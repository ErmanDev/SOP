const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models'); 
const userTypes = require('../models/userTypes');


module.exports = {
    register: async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

   
        const hashedPassword = await bcrypt.hash(password, 10);

      
        const newUser = await User.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
},

login: async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ where: { username: username } });
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
            return res.status(400).json({ error: "Account is inactive please contact HR" });
        }

        const dbPassword = user.password;
        const match = await bcrypt.compare(password, dbPassword);

        if (!match) {
            return res.status(400).json({ error: "Wrong username and password combination" });
        } else {
            const accessToken = createTokens(user);

            res.json({
                message: `Logged in! User ID: ${user.user_id} Username: ${user.username} User type: ${user.role_id}:   ${user.profile_url}`,
                accessToken: accessToken,
                userTypes_id: user.role_id,
                uid: user.user_id,
                profile_url: user.profile_url,
                first_name: user.first_name
           
            });    
        }

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal Server Error", error.message);
    }
}


};