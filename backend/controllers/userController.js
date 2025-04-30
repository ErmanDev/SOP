const { Users, UserRoles } = require('../models/main');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
}).single('profile_image');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      include: [
        {
          model: UserRoles,
          as: 'role',
          attributes: ['role_name'],
        },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Cannot fetch user' });
  }
};

exports.registerEmployee = async (req, res) => {
  try {
    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { user_id, full_name, email, phone, password, status } = req.body;
      let profile_url = 'http://api.dicebear.com/7.x/lorelei/svg'; // Default avatar

      // If file was uploaded, update profile_url
      if (req.file) {
        profile_url = `/uploads/profiles/${req.file.filename}`;
      }

      const existingUser = await Users.findOne({
        where: {
          [Op.or]: [{ user_id }, { email }],
        },
      });

      if (existingUser) {
        return res.status(409).json({ error: 'user_id or email already taken' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const formattedUserId = `EMP${user_id}`;
      const currentDate = new Date().toISOString().split('T')[0];

      // Create user with employee role (role_id: 2)
      const newUser = await Users.create({
        user_id: formattedUserId,
        full_name,
        email,
        phone,
        password: hashedPassword,
        role_id: 2, // Employee role
        status,
        date_hired: currentDate,
        profile_url,
      });

      res.status(201).json({
        message: 'Employee registered successfully',
        employee: {
          id: newUser.id,
          user_id: newUser.user_id,
          full_name: newUser.full_name,
          email: newUser.email,
          phone: newUser.phone,
          status: newUser.status,
          date_hired: newUser.date_hired,
          profile_url: newUser.profile_url
        }
      });
    });
  } catch (error) {
    console.error('Error registering employee:', error);
    res.status(500).json({ error: 'Error registering employee' });
  }
};

exports.countUser = async (req, res) => {
  try {
    const totalUsers = await Users.count();
    res.status(200).json({ 'Total user': totalUsers });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({ message: 'Error counting users', error });
  }
};

exports.getEmployeeDetails = async (req, res) => {
  try {
    const employeeRole = await UserRoles.findOne({
      where: { role_name: 'employee' },
    });

    if (!employeeRole) {
      return res.status(404).json({ message: 'Employee role not found' });
    }

    const employee = await Users.findAll({
      attributes: [
        'id',
        'user_id',
        'full_name',
        'email',
        'phone',
        'status',
        'date_hired',
        'profile_url'
      ],
      where: { role_id: employeeRole.role_id },
    });

    if (employee.length === 0) {
      return res.status(404).json({ message: 'No Employee Found' });
    }

    return res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee: ', error);
    res
      .status(500)
      .json({ message: 'An error occured fetching employee details', error });
  }
};

exports.updateEmployee = async (req, res) => {
  const { user_id } = req.params;
  const { full_name, email, phone, status, date_hired, profile_url } = req.body;

  try {
    const employee = await Users.findOne({
      where: { user_id: user_id }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update the employee
    await employee.update({
      full_name,
      email,
      phone,
      status,
      date_hired,
      profile_url
    });

    res.status(200).json({
      message: 'Employee updated successfully',
      employee: {
        id: employee.id,
        user_id: employee.user_id,
        full_name: employee.full_name,
        email: employee.email,
        phone: employee.phone,
        status: employee.status,
        date_hired: employee.date_hired,
        profile_url: employee.profile_url
      }
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Error updating employee' });
  }
};
