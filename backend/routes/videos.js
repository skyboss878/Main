// backend/routes/videos.js
const express = require('express');
const router = express.Router();
const { videoQueue, allJobsQueue } = require('../queue/queue'); // Import queues
const authMiddleware = require('../middleware/authMiddleware'); // NEW
const { checkCredits } = require('../middleware/checkCredits'); // NEW

// Helper to add a video job with middleware integration
const addVideoJob = async (type, data, cost, req, res) => { // Added req and res to pass through
  try {
    const job = await videoQueue.add(type, { ...data, userId: req.user.id, cost: cost }, { // Pass userId and cost
        attempts: 3, // Retry up to 3 times on failure
        backoff: {
            type: 'exponential',
            delay: 1000 // Start with 1 second, then 2s, 4s, etc.
        }
    });
    // Add to allJobsQueue for general status tracking
    await allJobsQueue.add('trackJob', { queue: 'videoProcessingQueue', jobId: job.id, userId: req.user.id });

    console.log(`🎥 Backend: Enqueued video job ${job.id} (Type: ${type}) for user ${req.user.id}. Cost: ${cost}.`);
    res.status(202).json({
      success: true,
      message: 'Video generation started.',
      jobId: job.id,
      statusUrl: `/api/jobs/${job.id}/status`
    });
  } catch (error) {
    console.error(`❌ Backend Error enqueuing video job (${type}) for user ${req.user.id}:`, error);
    res.status(500).json({ success: false, message: 'Failed to start video generation.', error: error.message });
  }
};

// Cost examples: Video generation is expensive
const SOCIAL_MEDIA_VIDEO_COST = 20;
const COMMERCIAL_VIDEO_COST = 50;
const PRODUCT_SHOWCASE_COST = 30;

router.post('/social-media', authMiddleware, checkCredits(SOCIAL_MEDIA_VIDEO_COST), async (req, res) => {
  const { prompt, duration, videoStyle, voiceover, music, captions, hashtags, description } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required for social media video generation.' });
  }
  // Pass all options and the specific cost
  await addVideoJob('socialMediaVideo', { prompt, options: { duration, videoStyle, voiceover, music, captions, hashtags, description } }, SOCIAL_MEDIA_VIDEO_COST, req, res);
});

router.post('/commercial', authMiddleware, checkCredits(COMMERCIAL_VIDEO_COST), async (req, res) => {
  const { prompt, duration } = req.body;
  if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });
  await addVideoJob('commercialVideo', { prompt, options: { duration } }, COMMERCIAL_VIDEO_COST, req, res);
});

router.post('/product-showcase', authMiddleware, checkCredits(PRODUCT_SHOWCASE_COST), async (req, res) => {
  const { prompt, productImages, duration } = req.body;
  if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });
  // productImages might be an array of URLs or local paths from frontend uploads
  await addVideoJob('productShowcase', { prompt, productImages, options: { duration, productImages } }, PRODUCT_SHOWCASE_COST, req, res);
});

module.exports = router;
