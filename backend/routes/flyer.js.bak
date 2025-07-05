// backend/routes/flyer.js

const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService'); // Make sure the path is correct

// POST /api/flyer - Generate AI flyer with custom text and styles
router.post('/', async (req, res) => {
  try {
    const { prompt, title, theme, color, size = '1024x1024' } = req.body;

    if (!prompt || !title) {
      return res.status(400).json({ success: false, error: 'Missing prompt or title' });
    }

    console.log('🖼️ Generating flyer with:', { prompt: prompt.substring(0, 50) + '...', title, theme, color });

    // Generate image using AI
    const imagePath = await aiService.generateImage(prompt, {
      size,
      style: theme || 'modern' // Pass theme as style for AI image generation
    });
    const imageUrl = `/temp/${path.basename(imagePath)}`; // Served from /temp static route

    // Respond with flyer data
    res.json({
      success: true,
      imagePath: imageUrl,
      title,
      theme: theme || 'Modern',
      color: color || '#ffffff'
    });

  } catch (error) {
    console.error('❌ Flyer generation failed:', error.message || error);
    res.status(500).json({ success: false, error: 'Flyer generation failed: ' + (error.message || 'Unknown error') });
  }
});

module.exports = router;
