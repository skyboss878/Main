// ~/main/backend/middleware/checkCredits.js
const User = require('../models/User');

/**
 * Middleware to check if a user has enough credits before proceeding.
 * Usage: router.post('/some-route', authMiddleware, checkCredits(1), handler)
 */
const checkCredits = (requiredCredits = 1) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (user.credits < requiredCredits) {
        return res.status(402).json({ success: false, message: 'Not enough credits' });
      }

      req.cost = requiredCredits; // Save credit cost for later
      next();
    } catch (err) {
      console.error('❌ Error in checkCredits middleware:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
};

/**
 * Middleware to deduct credits after a successful operation.
 * This should be called AFTER the AI service has successfully generated content.
 */
const deductCredits = async (req, res, next) => {
  if (!req.user || !req.user.id || typeof req.cost === 'undefined') {
    console.error('❌ Deduct credits middleware called without req.user or req.cost');
    return res.status(500).json({ success: false, message: 'Internal server error: Credit deduction failed.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found during credit deduction' });
    }

    user.credits -= req.cost;
    await user.save();
    console.log(`💳 Deducted ${req.cost} credits from user ${user.email}`);
    next();
  } catch (err) {
    console.error('❌ Error deducting credits:', err.message);
    return res.status(500).json({ success: false, message: 'Internal error during credit deduction' });
  }
};

module.exports = { checkCredits, deductCredits };
