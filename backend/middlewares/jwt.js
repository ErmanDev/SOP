const { sign, verify } = require("jsonwebtoken");
const SECRET_KEY = "jwtsecret"; 

// Function to create JWT tokens
const createTokens = (user) => {
  const accessToken = sign(
    { 
      username: user.username, 
      id: user.account_id,
      user_type: user.user_type 
    },
    SECRET_KEY,
    { expiresIn: '1h' }  
  );
  return accessToken;
};

// Middleware to validate JWT tokens
const validateToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader)
    return res.status(401).json({ error: "User not authenticated" });

  try {
    const token = authorizationHeader.split(' ')[1];  
    const validToken = verify(token, SECRET_KEY);  

    if (validToken) {
      req.authenticated = true;
      req.id = validToken.id;          
      req.username = validToken.username;
      req.user_type = validToken.user_type;
      return next();                 
    }

  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ error: "Invalid or expired token" });  
  }
};

module.exports = { createTokens, validateToken };
