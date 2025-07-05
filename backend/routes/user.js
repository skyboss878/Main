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
// Get authenticated user's credits
router.get('/credits', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email credits');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        credits: user.credits || 0
      }
    });
   } catch (error) {
     console.error('❌ Error fetching user credits:', error.message);
     res.status(500).json({ success: false, message: 'Server error fetching user credits.' });
   }
 });

 module.exports = router;
