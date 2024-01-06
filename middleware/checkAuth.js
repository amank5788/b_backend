const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  jwt.verify(token, 'yourSecretKey', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    req.user = decoded; // Store decoded user information for further use
    next();
  });
};

module.exports = authenticateToken;
