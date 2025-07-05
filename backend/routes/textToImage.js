// ~/main/backend/routes/textToImage.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { imageQueue } = require('../queue/queue');
const authMiddleware = require('../middleware/authMiddleware');
const { checkCredits, deductCredits } = require('../middleware/checkCredits'); // ✅ FIXED

// Route for Text-to-Image generation
router.post(
  '/',
  authMiddleware,
  checkCredits(5), // Cost: 5 credits
  async (req, res, next) => {
    const { prompt, options } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required for text-to-image generation.' });
    }

    try {
      const job = await imageQueue.add('generateGenericImage', {
        prompt,
        options,
        userId: req.user.id,
        cost: req.cost
      });

      res.locals.result = { jobId: job.id };
      next(); // Go to deductCredits
    } catch (error) {
      console.error('❌ Error enqueuing text-to-image job:', error);
      res.status(500).json({ success: false, message: 'Failed to start text-to-image generation.', error: error.message });
    }
  },
  deductCredits, // ✅ Deduct only if job added successfully
  (req, res) => {
    const { jobId } = res.locals.result;
    res.status(202).json({
      success: true,
      message: 'Text-to-image generation started.',
      jobId,
      statusUrl: `/api/jobs/image/${jobId}/status`
    });
  }
);

module.exports = router;
