// middleware/authenticate.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    console.log('Middleware Authenticate: No token provided'); // Debug log
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This is where the decoded token payload is attached to req.user
    console.log('Middleware Authenticate: Decoded User Payload (req.user):', req.user); // <-- CRITICAL DEBUG LOG
    next();
  } catch (err) {
    console.error('Middleware Authenticate: JWT Verification Error:', err.message); // Added error logging
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
