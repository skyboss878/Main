// backend/routes/blog.js
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/', async (req, res) => {
  const { topic, length, tone, keywords, sections } = req.body; // Add sections for structured content

  if (!topic) {
    return res.status(400).json({ success: false, message: 'Topic is required for blog generation.' });
  }

  try {
    console.log(`✍️ Backend: Generating blog post for topic: "${topic}"`);

    // Construct a more detailed prompt for a blog post
    let userPrompt = `Write a comprehensive blog post about "${topic}".`;
    if (length) userPrompt += ` Target length: ${length}.`;
    if (tone) userPrompt += ` Tone: ${tone}.`;
    if (keywords) userPrompt += ` Incorporate these keywords: ${keywords}.`;
    if (sections && sections.length > 0) {
        userPrompt += ` Structure it with these sections: ${sections.join(', ')}.`;
    } else {
        userPrompt += ` Include an introduction, a few main points, and a conclusion.`;
    }
    userPrompt += ` Provide the full article text.`;

    const systemPrompt = `You are a professional blog post writer. Create engaging, informative, well-structured, and SEO-friendly blog posts.`;

    const blogContent = await aiService.generateText(userPrompt, { systemPrompt, maxTokens: 3000, temperature: 0.8 }); // Increased maxTokens

    // Optionally generate a catchy title
    const titlePrompt = `Generate a catchy, SEO-friendly title for a blog post about "${topic}".`;
    const title = await aiService.generateText(titlePrompt, { maxTokens: 100, temperature: 0.7 });

    // Optionally generate a featured image prompt
    const imagePrompt = await aiService.generateText(`Suggest a detailed prompt for a featured image for a blog post titled "${title}".`, { maxTokens: 150 });

    res.json({ success: true, data: { title: title.trim(), content: blogContent, suggestedImagePrompt: imagePrompt.trim() } });
  } catch (error) {
    console.error('❌ Backend Error in blog generation route:', error);
    res.status(500).json({ success: false, message: 'Failed to generate blog post.', error: error.message });
  }
});

module.exports = router;
