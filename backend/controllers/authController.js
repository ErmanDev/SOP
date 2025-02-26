const bcrypt = require('bcrypt');
const User = require('../models/User');
const {createTokens} = require('../middlewares/jwt');


const registerUser = async (req, res) => {
  try {
    const { first_name, middle_name, last_name, suffix, position, status, gender, email, password, role_id } = req.body;

    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

   
    const validPositions = ['hr', 'manager', 'technician'];
  

    if (position && !validPositions.includes(position.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid position' });
    }


    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      first_name,
      middle_name,
      last_name,
      suffix,
      position,
      status: status || 'active', 
      gender,
      email,
      password: hashedPassword,
      role_id: null || role_id,
    });

    res.status(201).json({ message: 'User registered successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser =  async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        console.log(user)
        if (!user && !password) {
            return res.status(400).json({
                error: "There is no input"
            });
        }

        if (!user) {
            return res.status(400).json({ error: "Provide user input" });
        }
        if (!password) {
            return res.status(400).json({ error: "Provide password input" });
        }
        if (user.status == "inactive") {
            return res.status(400).json({ error: "Account is inactive please contact your administrator for further info" });
        }

        const dbPassword = user.password;
        const match = await bcrypt.compare(password, dbPassword);

        if (!match) {
            return res.status(400).json({ error: "Wrong username and password combination" });
        } else {
            const accessToken = createTokens(user);

            res.json({
                message: `Logged in! User ID: ${user.id} Username: ${user.username} User type: ${user.role_id}`,
                accessToken: accessToken,
                role_id: user.role_id,
                uid: user.user_id,
                first_name: user.first_name
           
            });    
        }

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal Server Error", error.message);
    }
};

module.exports = { registerUser, loginUser };
