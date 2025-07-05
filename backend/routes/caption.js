// ~/main/backend/routes/caption.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { textQueue } = require('../queue/queue');
const authMiddleware = require('../middleware/authMiddleware');
const { checkCredits, deductCredits } = require('../middleware/checkCredits'); // ✅ FIXED

// Route for Caption generation
router.post(
  '/',
  authMiddleware,
  checkCredits(2), // Cost: 2 credits
  async (req, res, next) => {
    const { imagePath, options } = req.body;

    if (!imagePath) {
      return res.status(400).json({ success: false, message: 'Image path is required for caption generation.' });
    }

    try {
      const job = await textQueue.add('generateCaption', {
        imagePath,
        options,
        userId: req.user.id,
        cost: req.cost
      });

      res.locals.result = { jobId: job.id }; // Save job info for final response
      next(); // Proceed to deduct credits
    } catch (error) {
      console.error('❌ Error enqueuing caption generation job:', error);
      res.status(500).json({ success: false, message: 'Failed to start caption generation.', error: error.message });
    }
  },
  deductCredits, // ✅ Deduct credits only if job was added
  (req, res) => {
    res.status(202).json({
      success: true,
      message: 'Caption generation started.',
      jobId: res.locals.result.jobId,
      statusUrl: `/api/jobs/text/${res.locals.result.jobId}/status`
    });
  }
);

module.exports = router;
