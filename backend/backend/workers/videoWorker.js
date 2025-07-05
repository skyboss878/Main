const { videoQueue } = require('../queue/queue');
const aiService = require('../services/aiService');

videoQueue.process('textToVideo', async (job) => {
  const { prompt, options, userId, cost } = job.data;

  const script = await aiService.generateVideoScript(
    prompt,
    options?.videoOptions?.type || 'commercial',
    options?.videoOptions?.duration || 60
  );

  const scenes = aiService.parseVideoScript(script);
  const hashtags = await aiService.generateHashtags(prompt, options?.hashtagOptions?.platform || 'Instagram');

  // Placeholder for video file - Replace with real generator later
  const videoUrl = 'https://example.com/video.mp4';

  return {
    videoUrl,
    script,
    scenes,
    hashtags
  };
});
