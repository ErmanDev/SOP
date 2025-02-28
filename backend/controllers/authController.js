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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ 
      where: { email },
      raw: true  
    });

    if (!user) {
 
      return res.status(401).json({ error: "Invalid email or password" });
    }


   
    const match = await bcrypt.compare(password, user.password);
    

    if (!match) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ error: "Invalid email or password" });
    }


    if (user.status === "inactive") {
      console.log('Inactive user attempted login:', email);
      return res.status(403).json({ error: "Account is inactive" });
    }

    const accessToken = createTokens(user);


    const responseData = {
      message: "Login successful",
      accessToken,
      role_id: user.role_id,
      uid: user.id,
      first_name: user.first_name,
      email: user.email

    };
    
 
    res.json(responseData);

  } catch (error) {
    console.error("Login error details:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
};

const logoutUser = async (req, res) => {
    try {
      const token  = req.headers.authorization.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      await Blacklist.create({ token });

      res.json({ message: "Logout successful" });

    }catch (error) {
      res.status(500).json({ message: "Server error" });
    }
}
module.exports = { registerUser, loginUser, logoutUser };
