// ~/main/backend/routes/voice.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { voiceQueue } = require('../queue/queue');
const authMiddleware = require('../middleware/authMiddleware');
const { checkCredits, deductCredits } = require('../middleware/checkCredits'); // ✅ FIXED

// Route for Voice generation
router.post(
  '/',
  authMiddleware,
  checkCredits(2), // Cost: 2 credits
  async (req, res, next) => {
    const { text, options } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required for voice generation.' });
    }

    try {
      const job = await voiceQueue.add('generateGenericVoice', {
        text,
        options,
        userId: req.user.id,
        cost: req.cost
      });

      res.locals.result = { jobId: job.id }; // Save job info
      next(); // Proceed to deductCredits
    } catch (error) {
      console.error('❌ Error enqueuing voice generation job:', error);
      return res.status(500).json({ success: false, message: 'Failed to start voice generation.', error: error.message });
    }
  },
  deductCredits, // ✅ Deduct only after successful job queue
  (req, res) => {
    const { jobId } = res.locals.result;
    res.status(202).json({
      success: true,
      message: 'Voice generation started.',
      jobId,
      statusUrl: `/api/jobs/voice/${jobId}/status`
    });
  }
);

module.exports = router;
