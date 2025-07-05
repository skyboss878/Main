// backend/routes/textToImage.js
const express = require('express');
const router = express.Router();
const { imageQueue, allJobsQueue } = require('../queue/queue');
const authMiddleware = require('../middleware/authMiddleware'); // NEW
const { checkCredits } = require('../middleware/checkCredits'); // NEW

const TEXT_TO_IMAGE_COST = 6; // Example cost for text-to-image generation (adjust as needed)

router.post('/', authMiddleware, checkCredits(TEXT_TO_IMAGE_COST), async (req, res) => {
  const { prompt, size, style, cfgScale, steps } = req.body; // Options for image generation

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required for image generation.' });
  }

  try {
    const job = await imageQueue.add('generateGenericImage', { // Using 'generateGenericImage' job type
        prompt,
        options: { size, style, cfgScale, steps },
        userId: req.user.id, // Pass userId
        cost: req.cost // Pass cost
    }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 }
    });
    await allJobsQueue.add('trackJob', { queue: 'imageProcessingQueue', jobId: job.id, userId: req.user.id });

    console.log(`🎨 Backend: Enqueued text-to-image job ${job.id} for user ${req.user.id}. Cost: ${req.cost}.`);
    res.status(202).json({ success: true, message: 'Text-to-Image generation started.', jobId: job.id, statusUrl: `/api/jobs/${job.id}/status` });
  } catch (error) {
    console.error('❌ Error enqueuing text-to-image job:', error);
    res.status(500).json({ success: false, message: 'Failed to start text-to-image generation.', error: error.message });
  }
});

module.exports = router;
