// ~/main/backend/routes/imageToImage.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { imageQueue } = require('../queue/queue');
const authMiddleware = require('../middleware/authMiddleware');
const { checkCredits, deductCredits } = require('../middleware/checkCredits'); // ✅ FIXED

// Route for Image-to-Image transformation
router.post(
  '/',
  authMiddleware,
  checkCredits(3), // Cost: 3 credits
  async (req, res, next) => {
    const { imagePath, prompt, options } = req.body;

    if (!imagePath || !prompt) {
      return res.status(400).json({ success: false, message: 'Image path and prompt are required for image-to-image transformation.' });
    }

    try {
      const job = await imageQueue.add('imageToImage', {
        imagePath,
        prompt,
        options,
        userId: req.user.id,
        cost: req.cost
      });

      res.locals.result = { jobId: job.id }; // Store job ID for response
      next(); // Proceed to deductCredits
    } catch (error) {
      console.error('❌ Error enqueuing image-to-image job:', error);
      res.status(500).json({ success: false, message: 'Failed to start image-to-image transformation.', error: error.message });
    }
  },
  deductCredits, // ✅ Deduct after successful queueing
  (req, res) => {
    const { jobId } = res.locals.result;
    res.status(202).json({
      success: true,
      message: 'Image-to-image transformation started.',
      jobId,
      statusUrl: `/api/jobs/image/${jobId}/status`
    });
  }
);

module.exports = router;
