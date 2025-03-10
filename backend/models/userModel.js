const pool = require("../config/db"); // ✅ Import the database connection
const bcrypt = require("bcrypt"); // ✅ Import bcrypt for password hashing

const user = {
  // Fetch all users
  getAllUsers: async () => {
    console.log("Executing query to fetch users...");
    try {
      const result = await pool.query("SELECT * FROM users"); // ✅ Use 'pool'
      console.log("Fetched users:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      throw error;
    }
  },

  // Get total user count
  getTotalUserCount: async () => {
    console.log("Executing query to count users...");
    try {
      const result = await pool.query("SELECT COUNT(*) AS total FROM users");
      console.log("Total users:", result.rows[0].total);
      return result.rows[0].total;
    } catch (error) {
      console.error("❌ Error counting users:", error);
      throw error;
    }
  },

  getUserDetails: async () => {
    console.log("Fetching user details (excluding HR)...");
    try {
      const query = `
        SELECT 
          user_id, 
          profile_url, 
          CONCAT(first_name, ' ', last_name) AS employee_name, 
          salary, 
          allowance, 
          contact, 
          address,
          position,
          status
        FROM users
        WHERE position != 'hr'  -- ✅ Fixed: Direct ENUM comparison (no LOWER)
      `;
      const result = await pool.query(query);
      console.log("Fetched user details (excluding HR):", result.rows);
      return result.rows;
    } catch (error) {
      console.error("❌ Error fetching user details:", error);
      throw error;
    }
  },



  registerUser: async (userData) => {
    console.log("Registering a new user...");

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
      profile_url,
      password,
      status,
    } = userData;

    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Validate position
      const validPositions = ["hr", "manager", "technician"];
      if (!validPositions.includes(position?.toLowerCase())) {
        throw new Error("Invalid position");
      }

      // Check if email already exists
      const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
      const emailExists = await pool.query(emailCheckQuery, [email]);
      if (emailExists.rows.length > 0) {
        throw new Error("Email is already in use");
      }

      // Check if contact number already exists
      if (contact) {
        const contactCheckQuery = "SELECT * FROM users WHERE contact = $1";
        const contactExists = await pool.query(contactCheckQuery, [contact]);
        if (contactExists.rows.length > 0) {
          throw new Error("Contact number is already in use");
        }
      }

      const query = `
        INSERT INTO users 
          (first_name, middle_name, last_name, email, position, salary, allowance, contact, address, profile_url, password, status, "createdAt", "updatedAt") 
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) 
        RETURNING *;
      `;

      const values = [
        first_name,
        middle_name || null,
        last_name,
        email,
        position.toLowerCase(), // Ensure lowercase
        salary || null,
        allowance || null,
        contact || null,
        address || null,
        profile_url || null,
        hashedPassword,
        status || "active",
      ];

      const result = await pool.query(query, values);
      console.log("✅ User registered successfully:", result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error registering user:", error.message);
      throw new Error(error.message);
    }
  },
};


module.exports = user; 