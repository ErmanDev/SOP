const User = require("../models/User");
const bcrypt = require("bcrypt");


const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, middle_name, last_name, suffix, position, status, gender, email, password, role_id } = req.body;

   
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    const validPositions = ['hr', 'manager', 'technician'];
    if (position && !validPositions.includes(position.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid position' });
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
      role_id: role_id || user.role_id,
    });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const countUsers = async (res) => {
  try {
    const totalUsers = await User.count();
    res.status(200).json({ totalUsers: totalUsers });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({ message: 'An error occurred while counting users', error });
  }
};

const countTechnicians = async (req, res) => {
  try {
    const totalTechnicians = await User.count({ where: { position: 'technician' } });
    res.status(200).json({ totalTechnicians: totalTechnicians });
  } catch (error) {
    console.error('Error counting technicians:', error);
    res.status(500).json({ message: 'An error occurred while counting technicians', error });
  }
};

const countManagers = async (res) => {
  try {
    const totalManagers = await User.count({ where: { position: 'manager' } });
    res.status(200).json({ totalManagers: totalManagers });
  } catch (error) {
    console.error('Error counting managers:', error);
    res.status(500).json({ message: 'An error occurred while counting managers', error });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  countUsers,
  countTechnicians,
  countManagers

};
