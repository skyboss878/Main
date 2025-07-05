// backend/routes/commercial.js
// This route serves as a placeholder or for other non-video commercial content.
// Commercial video generation is now handled by /api/videos/commercial.
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.status(400).json({
    success: false,
    message: 'This endpoint is for general commercial tools. For commercial video generation, please use /api/videos/commercial.'
  });
});

router.get('/info', (req, res) => {
  res.json({
    success: true,
    message: 'This is the commercial content API. Specific video generation is available at /api/videos/commercial.',
    availableTools: ['commercial video', 'ad copy', 'slogan generator'] // Example
  });
});

module.exports = router;
