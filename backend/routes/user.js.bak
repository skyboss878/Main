// backend/routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User'); // Import User model

// Get authenticated user's details, including credits
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user is populated by authMiddleware
    // We select all fields except password
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('❌ Error fetching user data:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching user data.' });
  }
});

// Get authenticated user's credits
router.get('/credits', authMiddleware, async (req, res) => {
  try {
    // req.user is populated by authMiddleware and now includes credits directly
    if (!req.user || typeof req.user.credits === 'undefined') {
      return res.status(400).json({ success: false, message: 'User credits not available.' });
    }
    res.json({ success: true, data: { credits: req.user.credits, id: req.user.id, username: req.user.username, email: req.user.email } });
  } catch (error) {
    console.error('❌ Error fetching user credits:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching user credits.' });
  }
});

module.exports = router;
