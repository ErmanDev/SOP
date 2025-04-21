const db = require("../models/main");
const bcrypt = require('bcryptjs');
const {Users} = db;

module.exports = {
    Register: async(req, res) => {
      try {  
        const {
            full_name, email, password
        } = req.body;
 
        const hash = await bcrypt.hash(password, 10);

        const newUser = await Users.create({
            full_name, email, password: hash
        });

        res.status(201).json({
            message: "User Registered",
            user: {
                id: newUser.user_id,
                fullName: newUser.full_name,
                email: newUser.email
            }
        });
    }
    catch (error) {
        console.error("Error: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
    },

    Login: async(req, res) => {
        try {
            const {email, password} = req.body;
            const user = await Users.findOne({where: {email: email}})
            const dbPassword = user.password;
            const match = await bcrypt.compare(password, dbPassword)

            if(!email && !password){return res.status(400).json({error: "No input"})}

            if(!match) {return res.status(400).json({ error: "Wrong email and password combination"})}
            else{
                const accessToken = createTokens(user);
                res.json({
                    message: "Logged in",
                    accessToken: accessToken
                })
            }
        }
        catch(error) {
            console.error("Error: ", error.message);
            res.status(500).send("Internal Server Error", error.message);
        }
    }
}

