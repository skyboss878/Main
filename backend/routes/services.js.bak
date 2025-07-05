// backend/routes/services.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService'); // For fetching voices etc.

// Get available AI voices for Text-to-Speech
router.get('/voices', async (req, res) => {
  try {
    console.log('🎤 Backend: Fetching available AI voices...');
    const voices = await aiService.getAvailableVoices();
    res.json({ success: true, data: { voices } });
  } catch (error) {
    console.error('❌ Error fetching voices:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch available voices.', error: error.message });
  }
});

// You can add more routes here for other service information, e.g.,
// router.get('/models', async (req, res) => { ... get available AI models ... });
// router.get('/pricing', async (req, res) => { ... get current service pricing ... });

module.exports = router;
