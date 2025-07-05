// backend/routes/tours.js
const express = require('express');
const router = express.Router();
const { textQueue, allJobsQueue } = require('../queue/queue'); // Tour generation involves text/images
const authMiddleware = require('../middleware/authMiddleware'); // NEW
const { checkCredits } = require('../middleware/checkCredits'); // NEW

const TOUR_GENERATION_COST = 15; // Example cost for tour generation (adjust as needed)

router.post('/', authMiddleware, checkCredits(TOUR_GENERATION_COST), async (req, res) => {
  const { tourType, location, highlights, duration, numScenes, details } = req.body;
  if (!tourType || !location) {
    return res.status(400).json({ success: false, message: 'Tour type and location are required.' });
  }

  try {
    const job = await textQueue.add('createTour', {
        prompt: tourType, // Main prompt for job data
        options: { location, highlights, duration, numScenes, details }, // Other options
        userId: req.user.id, // Pass userId
        cost: req.cost // Pass cost
    }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 }
    });
    await allJobsQueue.add('trackJob', { queue: 'textProcessingQueue', jobId: job.id, userId: req.user.id });

    console.log(`🗺️ Backend: Enqueued tour content job ${job.id} for user ${req.user.id}. Cost: ${req.cost}.`);
    res.status(202).json({ success: true, message: 'Tour content generation started.', jobId: job.id, statusUrl: `/api/jobs/${job.id}/status` });
  } catch (error) {
    console.error('❌ Error enqueuing tour generation job:', error);
    res.status(500).json({ success: false, message: 'Failed to start tour generation.', error: error.message });
  }
});

module.exports = router;
