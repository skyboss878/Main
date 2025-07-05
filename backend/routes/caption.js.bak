// backend/routes/caption.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/', async (req, res) => {
  const { prompt, platform, count = 10, tone = 'engaging' } = req.body; // Added tone, default count

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required for caption generation.' });
  }

  try {
    console.log(`📝 Backend: Received request for captions with prompt: "${prompt.substring(0, 50)}..."`);

    // Generate main caption text
    const captionGenPrompt = `Generate ${count} ${tone} social media captions for this content: "${prompt}". Make them concise, suitable for ${platform || 'general social media'}, and distinct. Provide them as a numbered list.`;
    const captionsRaw = await aiService.generateText(captionGenPrompt, { maxTokens: 500, temperature: 0.7 });

    // Parse captions from the numbered list format (robust parsing)
    const captions = captionsRaw
                        .split('\n')
                        .filter(line => line.match(/^\s*\d+\./)) // Filter lines that start with a number and a dot
                        .map(line => line.replace(/^\s*\d+\.\s*/, '').trim()) // Remove numbering
                        .filter(Boolean); // Remove any empty strings after trimming

    // Generate hashtags
    const hashtags = await aiService.generateHashtags(prompt, platform, Math.min(count, 20)); // Limit hashtags to 20

    res.json({ success: true, data: { captions, hashtags } });
  } catch (error) {
    console.error('❌ Backend Error in caption generation route:', error);
    res.status(500).json({ success: false, message: 'Failed to generate captions.', error: error.message });
  }
});

module.exports = router;
