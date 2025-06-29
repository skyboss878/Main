// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const { textQueue, imageQueue, voiceQueue, allJobsQueue } = require('../queue/queue'); // Import queues
const aiService = require('../services/aiService'); // For direct voice fetching
const authMiddleware = require('../middleware/authMiddleware'); // NEW
const { checkCredits } = require('../middleware/checkCredits'); // NEW

// Test route (no auth or credits needed)
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'AI service test route is working',
    timestamp: new Date().toISOString()
  });
});

// Enqueue Text Generation Job
router.post('/generate-text', authMiddleware, checkCredits(1), async (req, res) => { // Cost: 1 credit
  const { prompt, options } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required for text generation.' });
  }
  try {
    const job = await textQueue.add('generateGenericText', { prompt, options, userId: req.user.id, cost: req.cost }); // Pass userId and cost
    await allJobsQueue.add('trackJob', { queue: 'textProcessingQueue', jobId: job.id, userId: req.user.id });
    res.status(202).json({ success: true, message: 'Text generation started.', jobId: job.id, statusUrl: `/api/jobs/${job.id}/status` });
  } catch (error) {
    console.error('❌ Error enqueuing text generation job:', error);
    res.status(500).json({ success: false, message: 'Failed to start text generation.', error: error.message });
  }
});

// Enqueue Image Generation Job
router.post('/generate-image', authMiddleware, checkCredits(5), async (req, res) => { // Cost: 5 credits
  const { prompt, options } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required for image generation.' });
  }
  try {
    const job = await imageQueue.add('generateGenericImage', { prompt, options, userId: req.user.id, cost: req.cost }); // Pass userId and cost
    await allJobsQueue.add('trackJob', { queue: 'imageProcessingQueue', jobId: job.id, userId: req.user.id });
    res.status(202).json({ success: true, message: 'Image generation started.', jobId: job.id, statusUrl: `/api/jobs/${job.id}/status` });
  } catch (error) {
    console.error('❌ Error enqueuing image generation job:', error);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Enqueue Voice Generation Job
router.post('/generate-voice', authMiddleware, checkCredits(2), async (req, res) => { // Cost: 2 credits
  const { text, options } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: 'Text is required for voice generation.' });
  }
  try {
    const job = await voiceQueue.add('generateVoice', { text, options, userId: req.user.id, cost: req.cost }); // Pass userId and cost
    await allJobsQueue.add('trackJob', { queue: 'voiceProcessingQueue', jobId: job.id, userId: req.user.id });
    res.status(202).json({ success: true, message: 'Voice generation started.', jobId: job.id, statusUrl: `/api/jobs/${job.id}/status` });
  } catch (error) {
    console.error('❌ Error enqueuing voice generation job:', error);
    res.status(500).json({ success: false, error: err.message });
  }
});


// Enqueue Ideas Generation Job
router.post('/generate-ideas', authMiddleware, checkCredits(3), async (req, res) => { // Cost: 3 credits
  const { type, keywords, tone } = req.body;
  if (!type || !keywords) {
    return res.status(400).json({ success: false, message: 'Idea type and keywords are required.' });
  }
  try {
    const job = await textQueue.add('generateIdeas', { type, keywords, tone, userId: req.user.id, cost: req.cost }); // Pass userId and cost
    await allJobsQueue.add('trackJob', { queue: 'textProcessingQueue', jobId: job.id, userId: req.user.id });
    res.status(202).json({ success: true, message: 'Idea generation started.', jobId: job.id, statusUrl: `/api/jobs/${job.id}/status` });
  } catch (error) {
    console.error('❌ Error enqueuing idea generation job:', error);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get available AI voices (no credits needed, direct call)
router.get('/voices', async (req, res) => {
  try {
    console.log('🎤 Backend: Fetching available AI voices...');
    const voices = await aiService.getAvailableVoices();
    res.json({ success: true, data: { voices } });
  } catch (error) {
    console.error('❌ Error fetching voices directly:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch available voices.', error: error.message });
  }
});


module.exports = router;

