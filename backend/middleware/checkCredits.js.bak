// backend/middleware/checkCredits.js
const User = require('../models/User'); // To update user credits

/**
 * Middleware to check if a user has enough credits for an operation.
 * It also attaches the cost of the operation to req.cost.
 * @param {number} requiredCredits - The number of credits required for this operation.
 */
const checkCredits = (requiredCredits) => {
  return async (req, res, next) => {
    // Ensure authMiddleware has run and req.user is populated
    if (!req.user || !req.user.credits) {
      return res.status(401).json({ success: false, message: 'User not authenticated or credits not available.' });
    }

    if (req.user.credits < requiredCredits) {
      return res.status(403).json({
        success: false,
        message: `Insufficient credits. You need ${requiredCredits} credits but have ${req.user.credits}. Please upgrade your plan.`,
        code: 'INSUFFICIENT_CREDITS' // Custom error code for frontend
      });
    }

    // Attach the cost to the request object for later deduction
    req.cost = requiredCredits;
    next();
  };
};

/**
 * Middleware to deduct credits after a successful operation.
 * This should be called AFTER the AI service has successfully generated content.
 */
const deductCredits = async (req, res, next) => {
  if (!req.user || !req.user.id || typeof req.cost === 'undefined') {
    // This middleware should only run if checkCredits has run and req.cost is set.
    // If not, something is wrong in the middleware chain.
    console.error('❌ Deduct credits middleware called without req.user or req.cost');
    return res.status(500).json({ success: false, message: 'Internal server error: Credit deduction setup issue.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error(`❌ User not found for credit deduction: ${req.user.id}`);
      return res.status(500).json({ success: false, message: 'Internal server error: User not found for credit deduction.' });
    }

    user.credits -= req.cost;
    await user.save();
    console.log(`✅ Credits deducted for user ${req.user.id}: ${req.cost}. Remaining: ${user.credits}`);
    // You can attach updated credits to response or log them
    res.locals.updatedCredits = user.credits; // Store for potential use in response
    next();
  } catch (error) {
    console.error('❌ Error deducting credits:', error.message);
    // Do not block the request, but log the error.
    // The AI generation was successful, but credit deduction failed.
    // You might want a more robust error handling/retry mechanism here.
    next();
  }
};

module.exports = { checkCredits, deductCredits };
