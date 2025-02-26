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




const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
  loginUser,
  deleteUser,
  countUsers,
  countTechnicians,
  countManagers

};
