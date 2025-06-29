// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Needed to attach user to req

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // decoded.user should contain { id: userId }

    // Optionally, fetch full user object and attach it to req
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(401).json({ success: false, message: 'Token is valid but user not found' });
    }
    req.user = user; // Attach the full user object (including credits) to the request

    next();
  } catch (err) {
    console.error('❌ Auth middleware error:', err.message);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};
