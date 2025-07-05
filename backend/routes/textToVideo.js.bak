// routes/textToVideo.js
const express = require('express');
const router = express.Router();
const { videoQueue, allJobsQueue } = require('../queue/queue'); // Import queues
const authMiddleware = require('../middleware/authMiddleware'); // NEW
const { checkCredits } = require('../middleware/checkCredits'); // NEW

const TEXT_TO_VIDEO_COST = 40; // Example cost for text-to-video generation (adjust as needed)

router.post('/', authMiddleware, checkCredits(TEXT_TO_VIDEO_COST), async (req, res) => {
  const { prompt, videoOptions, voiceOptions, captionOptions, hashtagOptions } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required' });
  }

  try {
    const job = await videoQueue.add('textToVideo', {
        prompt,
        options: { videoOptions, voiceOptions, captionOptions, hashtagOptions },
        userId: req.user.id, // Pass userId
        cost: req.cost // Pass cost
    }, {
        attempts: 3, // Retry up to 3 times on failure
        backoff: { type: 'exponential', delay: 1000 }
    });
    await allJobsQueue.add('trackJob', { queue: 'videoProcessingQueue', jobId: job.id, userId: req.user.id });

    console.log(`🎬 Backend: Enqueued text-to-video job ${job.id} for user ${req.user.id}. Cost: ${req.cost}.`);
    res.status(202).json({ success: true, message: 'Text-to-Video generation started.', jobId: job.id, statusUrl: `/api/jobs/${job.id}/status` });
  } catch (err) {
    console.error('❌ Error enqueuing text-to-video job:', err);
    res.status(500).json({ success: false, message: 'Failed to start text-to-video generation.', error: err.message });
  }
});

module.exports = router;
