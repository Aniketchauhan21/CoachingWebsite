module.exports = function requireStudent(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Student privileges required' });
  }
  next();
};