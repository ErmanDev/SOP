const db = require('../models/main');
const bcrypt = require('bcryptjs');
const { createTokens } = require('../middlewares/jwt.js');
const { Users } = db;

Users.belongsTo(db.UserRoles, {
  foreignKey: 'role_id',
  as: 'role',
});

db.UserRoles.hasMany(db.Users, {
  foreignKey: 'role_id',
});

module.exports = {
  Register: async (req, res) => {
    try {
      const {
        full_name,
        user_id,
        email,
        phone,
        password,
        role_id,
        status,
        date_hired,
      } = req.body;

      if (![1, 2].includes(parseInt(role_id))) {
        return res.status(400).json({ error: 'Invalid role_id' });
      }

      const existingUser = await Users.findOne({ where: { email: email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hash = await bcrypt.hash(password, 10);

      let currentDate = new Date().toISOString().split('T')[0];
      const hiredDate = (date_hired || currentDate).split('T')[0];
      if (hiredDate > currentDate) {
        return res.status(400).json({ error: 'Invalid date_hired' });
      }

      let formattedUserId;
      if (role_id === '1') {
        formattedUserId = `ADM${user_id}`;
      } else if (role_id === '2') {
        formattedUserId = `EMP${user_id}`;
      } else {
        return res.status(400).json({ error: 'Role Invalid' });
      }

      const newUser = await Users.create({
        full_name,
        user_id: formattedUserId,
        email,
        phone,
        password: hash,
        role_id,
        status,
        date_hired: hiredDate,
      });

      res.status(201).json({
        message: 'User Registered',
        user: {
          id: newUser.id,
          user_id: newUser.user_id,
          fullName: newUser.full_name,
          email: newUser.email,
          phone: newUser.phone,
          role_id: newUser.role_id,
          status: newUser.status,
          date_hired: newUser.date_hired,
        },
      });
    } catch (error) {
      console.error('Error: ', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  Login: async (req, res) => {
    try {
      const { user_id, password } = req.body;

      if (!user_id && !password) {
        return res.status(400).json({ error: 'No input' });
      }

      if (!user_id) {
        return res.status(400).json({ error: 'Incorrect user id' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Incorrect password' });
      }

      const user = await Users.findOne({
        where: { user_id: user_id },
        include: [
          {
            model: db.UserRoles,
            as: 'role',
          },
        ],
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res
          .status(400)
          .json({ error: 'Wrong email and password combination' });
      }

      const accessToken = createTokens(user);

      res.json({
        message: 'Logged in',
        accessToken,
        role_name: user.role.role_name,
        id: user.id,
        fullname: user.full_name,
        email: user.email,
        profile_url: user.profile_url,
      });
    } catch (error) {
      console.error('Error: ', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
