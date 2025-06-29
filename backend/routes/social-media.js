// backend/routes/social-media.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const path = require('path');

router.post('/', async (req, res) => {
  const { prompt, type = 'post', platform = 'instagram', generateImage = false } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required for social media content.' });
  }

  try {
    console.log(`📱 Backend: Generating social media ${type} for prompt: "${prompt.substring(0, 50)}..." on ${platform}`);

    let content = {};

    // Generate text/caption
    const textPrompt = `Create an engaging social media ${type} for ${platform} about: "${prompt}". Make it concise, compelling, and shareable.`;
    content.text = await aiService.generateText(textPrompt, { maxTokens: 500, temperature: 0.7 });

    // Generate hashtags
    content.hashtags = await aiService.generateHashtags(prompt, platform, 15);

    // Optionally generate an image if requested
    if (generateImage) {
      const imageGenPrompt = `${prompt}, high-quality social media graphic, ${platform} style, engaging.`;
      const imagePath = await aiService.generateImage(imageGenPrompt);
      content.imageUrl = `/temp/${path.basename(imagePath)}`; // Served from /temp static route
    }

    res.json({ success: true, data: content });
  } catch (error) {
    console.error('❌ Backend Error in social media content generation route:', error);
    res.status(500).json({ success: false, message: 'Failed to generate social media content.', error: error.message });
  }
});

module.exports = router;
