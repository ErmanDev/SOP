const user = require("../models/userModel");
const bcrypt = require("bcrypt");

const fetchAllUsers = async (req, res) => {  // ✅ Fixed: Added req
  try {
    const users = await user.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchUserDetails = async (req, res) => {
  try {
    const userDetails = await user.getUserDetails();
    res.status(200).json({ success: true, data: userDetails });
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


const countUsers = async (req, res) => {
  try {
    console.log("🔍 Fetching total user count...");
    const totalUsers = await user.getTotalUserCount();
    console.log("✅ Total users fetched:", totalUsers);
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("❌ Error fetching user count:", error.message || error);
    res.status(500).json({ message: "Internal server error", error: error.message || error });
  }
};


// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await user.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, middle_name, last_name, suffix, position, status, gender, email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPositions = ["hr", "manager", "technician"];
    if (position && !validPositions.includes(position.toLowerCase())) {
      return res.status(400).json({ message: "Invalid position" });
    }

    let hashedPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    await user.update({
      first_name,
      middle_name,
      last_name,
      suffix,
      position,
      status: status || user.status,
      gender,
      email,
      password: hashedPassword,
    });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};





const countTechnicians = async (req, res) => {
  try {
    const totalTechnicians = await user.count({ where: { position: "technician" } });
    res.status(200).json({ totalTechnicians });
  } catch (error) {
    console.error("Error counting technicians:", error);
    res.status(500).json({ message: "An error occurred while counting technicians", error });
  }
};

// Count all managers
const countManagers = async (req, res) => {  // ✅ Fixed: Added req
  try {
    const totalManagers = await user.count({ where: { position: "manager" } });
    res.status(200).json({ totalManagers });
  } catch (error) {
    console.error("Error counting managers:", error);
    res.status(500).json({ message: "An error occurred while counting managers", error });
  }
};

const registerUser = async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      email,
      position,
      salary,
      allowance,
      contact,
      address,
      password,
      status,
    } = req.body;

    let profile_url = req.body.profile_url || null; // Default to null if no file

    // Validate required fields
    if (!first_name || !last_name || !email || !password || !position) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate position
    const validPositions = ["hr", "manager", "technician"];
    if (!validPositions.includes(position?.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid position" });
    }

    // Check if email already exists
    const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
    const emailExists = await pool.query(emailCheckQuery, [email]);
    if (emailExists.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email is already in use" });
    }

    // Check if contact already exists
    if (contact) {
      const contactCheckQuery = "SELECT * FROM users WHERE contact = $1";
      const contactExists = await pool.query(contactCheckQuery, [contact]);
      if (contactExists.rows.length > 0) {
        return res.status(409).json({ success: false, message: "Contact number is already in use" });
      }
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle file upload if a file is included
    if (req.file) {
      try {
        profile_url = await uploadToSupabase(req.file); // Upload and get the URL
      } catch (uploadError) {
        console.error("❌ Error uploading file to Supabase:", uploadError.message);
        return res.status(500).json({ success: false, message: "File upload failed" });
      }
    }

    // Register user using userModel method
    const newUser = await user.registerUser({
      first_name,
      middle_name,
      last_name,
      email,
      position,
      salary,
      allowance,
      contact,
      address,
      profile_url, // Uploaded URL
      password: hashedPassword, // Hashed password
      status: status || "active",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("❌ Error registering user:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};




module.exports = {
  fetchAllUsers,
  fetchUserDetails,
  getUserById,
  updateUser,
  deleteUser,
  countUsers,
  countTechnicians,
  countManagers,
  registerUser
};
