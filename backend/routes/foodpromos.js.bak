// backend/routes/foodpromos.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const path = require('path');

router.post('/', async (req, res) => {
  const { itemName, description, offer, style = 'vibrant, appetizing', targetAudience } = req.body;

  if (!itemName || !description) {
    return res.status(400).json({ success: false, message: 'Item name and description are required for food promo.' });
  }

  try {
    console.log(`🍔 Backend: Generating food promo for: "${itemName}"`);

    // Generate promo text
    const promoTextPrompt = `Create a short, enticing food promotion text for "${itemName}" which is described as "${description}". The offer is: "${offer || 'none'}". Target audience: ${targetAudience || 'general'}. Make it highly appetizing and include a strong call to action.`;
    const promoText = await aiService.generateText(promoTextPrompt, { maxTokens: 300, temperature: 0.8 });

    // Generate an image
    const imagePrompt = `High-quality, professional food photography of "${itemName}", ${description}, with ${offer ? offer + ', ' : ''}on a clean background, ${style}. Focus on making the food look irresistible.`;
    const imagePath = await aiService.generateImage(imagePrompt, { size: '1024x1024' });
    const imageUrl = `/temp/${path.basename(imagePath)}`; // Served from /temp static route

    res.json({ success: true, data: { promoText, imageUrl } });
  } catch (error) {
    console.error('❌ Backend Error in food promo generation route:', error);
    res.status(500).json({ success: false, message: 'Failed to generate food promo.', error: error.message });
  }
});

module.exports = router;
