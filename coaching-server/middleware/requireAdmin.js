// middleware/requireAdmin.js
module.exports = function (req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user session found.' });
    }
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin privileges required.' });
    }
};