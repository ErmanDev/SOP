const { sign, verify } = require('jsonwebtoken');
const SECRET_KEY = 'jwtsecret';

const createTokens = (user) => {
  const accessToken = sign(
    {
      email: user.email,
      id: user.id,
      user_type: user.user_type,
      role_id: user.role_id,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader)
    return res.status(401).json({ error: 'User not authenticated' });

  try {
    const token = authorizationHeader.split(' ')[1];
    const validToken = verify(token, SECRET_KEY);

    if (validToken) {
      req.authenticated = true;
      req.id = validToken.id;
      req.user_id = validToken.user_id;
      req.user_type = validToken.user_type;
      return next();
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { createTokens, validateToken };
