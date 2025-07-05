
// backend/queue/worker.js
const { Worker, QueueEvents } = require('bullmq');
const IORedis = require('ioredis'); // Correct import for IORedis
const path = require('path'); // Needed for path.basename
require('dotenv').config({ path: '../.env' }); // Load .env from backend root
const User = require('../models/User'); // NEW: Import User model

const aiService = require('../services/aiService');
const VideoService = require('../services/VideoService');
// Add other services if they'll be directly called by the worker
// const authService = require('../services/authService'); // Example

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || null;

const connection = new IORedis({ // Use IORedis directly for connection
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  maxRetriesPerRequest: null, // Essential for long-running jobs
  enableReadyCheck: false,
});

console.log(`✅ Worker connecting to Redis: ${REDIS_HOST}:${REDIS_PORT}`);

// Worker for video processing
const videoWorker = new Worker('videoProcessingQueue', async job => {
  console.log(`🎥 Worker: Processing video job ${job.id} - ${job.name}`);
  try {
    const { type, prompt, options } = job.data;
    let result;

    job.updateProgress(5); // Initial progress

    if (type === 'socialMediaVideo') {
      result = await VideoService.generateSocialMediaVideo(prompt, options);
    } else if (type === 'commercialVideo') {
      result = await VideoService.generateCommercialVideo(prompt, options);
    } else if (type === 'productShowcase') {
      result = await VideoService.generateProductShowcase(prompt, options.productImages, options);
    } else if (type === 'textToVideo') {
      // textToVideo logic from your backend/routes/textToVideo.js, but adapted to direct service calls
      const videoPath = await aiService.generateVideo(prompt, options.videoOptions);
      const videoUrl = `/temp/${path.basename(videoPath)}`;

      job.updateProgress(30);

      const voiceoverTextPrompt = `Create a concise and engaging voiceover script (max 200 words) for a video about: "${prompt}".`;
      const voiceoverScript = await aiService.generateText(voiceoverTextPrompt, { maxTokens: 200, temperature: 0.7 });
      const voicePath = await aiService.generateVoice(voiceoverScript, options.voiceOptions);
      const voiceUrl = `/temp/${path.basename(voicePath)}`;

      job.updateProgress(60);

      const captionsRaw = await aiService.generateText(`Generate 3-5 short, punchy caption ideas for a video about "${prompt}". Format as bullet points.`, { maxTokens: 150 });
      const captions = captionsRaw.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^- /, '').trim());

      const hashtags = await aiService.generateHashtags(prompt, options.hashtagOptions?.platform, options.hashtagOptions?.count);

      result = {
        video: videoUrl,
        voice: voiceUrl,
        captions,
        hashtags,
        script: voiceoverScript
      };
    } else {
      throw new Error(`Unknown video job type: ${type}`);
    }

    job.updateProgress(100); // Job complete
    console.log(`✅ Worker: Video job ${job.id} completed.`);
    return result;
  } catch (error) {
    console.error(`❌ Worker: Error processing video job ${job.id}:`, error);
    throw error; // Re-throw to mark job as failed
  }
}, { connection });

// Worker for image processing
const imageWorker = new Worker('imageProcessingQueue', async job => {
  console.log(`🖼️ Worker: Processing image job ${job.id} - ${job.name}`);
  try {
    const { type, prompt, options } = job.data;
    let result;

    job.updateProgress(10);

    if (type === 'generateGenericImage') { // NEW JOB TYPE
        const imagePath = await aiService.generateImage(prompt, options);
        const imageUrl = `/temp/${path.basename(imagePath)}`;
        result = { imageUrl };
    } else if (type === 'generateImageToImage') { // NEW JOB TYPE
        const { imageUrl: sourceImageUrl, prompt: transformPrompt, options: transformOptions } = job.data;
        const transformedImagePath = await aiService.generateImageToImage(sourceImageUrl, transformPrompt, transformOptions);
        const transformedImageUrl = `/temp/${path.basename(transformedImagePath)}`;
        result = { transformedImageUrl };
    } else if (type === 'generateFlyer') {
      const { title, theme, color, size } = options;
      const imagePath = await aiService.generateImage(prompt, { size, style: theme || 'modern' });
      const imageUrl = `/temp/${path.basename(imagePath)}`;
      result = { imagePath: imageUrl, title, theme: theme || 'Modern', color: color || '#ffffff' };
    } else if (type === 'generateFoodPromo') {
      const { itemName, description, offer, style, targetAudience } = options;
      const promoTextPrompt = `Create a short, enticing food promotion text for "${itemName}" which is described as "${description}". The offer is: "${offer || 'none'}". Target audience: ${targetAudience || 'general'}. Make it highly appetizing and include a strong call to action.`;
      const promoText = await aiService.generateText(promoTextPrompt, { maxTokens: 300, temperature: 0.8 });
      const imagePrompt = `High-quality, professional food photography of "${itemName}", ${description}, with ${offer ? offer + ', ' : ''}on a clean background, ${style}. Focus on making the food look irresistible.`;
      const imagePath = await aiService.generateImage(imagePrompt, { size: '1024x1024' });
      const imageUrl = `/temp/${path.basename(imagePath)}`;
      result = { promoText, imageUrl };
    } else {
      throw new Error(`Unknown image job type: ${type}`);
    }

    job.updateProgress(100);
    console.log(`✅ Worker: Image job ${job.id} completed.`);
    return result;
  } catch (error) {
    console.error(`❌ Worker: Error processing image job ${job.id}:`, error);
    throw error;
  }
}, { connection });


// Worker for voice processing
const voiceWorker = new Worker('voiceProcessingQueue', async job => {
  console.log(`🎤 Worker: Processing voice job ${job.id} - ${job.name}`);
  try {
    const { text, options } = job.data;

    job.updateProgress(20);
    const audioPath = await aiService.generateVoice(text, options);
    const audioUrl = `/temp/${path.basename(audioPath)}`;
    job.updateProgress(100);
    console.log(`✅ Worker: Voice job ${job.id} completed.`);
    return { audioUrl };
  } catch (error) {
    console.error(`❌ Worker: Error processing voice job ${job.id}:`, error);
    throw error;
  }
}, { connection });

// Worker for text processing (blog, captions, descriptions, tour scripts, and new generic text/ideas)
const textWorker = new Worker('textProcessingQueue', async job => {
  console.log(`✍️ Worker: Processing text job ${job.id} - ${job.name}`);
  try {
    const { type, prompt, options } = job.data;
    let result;

    job.updateProgress(10); // Initial progress

    if (type === 'generateGenericText') { // NEW JOB TYPE
        result = { text: await aiService.generateText(prompt, options) };
    } else if (type === 'generateIdeas') { // NEW JOB TYPE
        const { type: ideaType, keywords, tone } = job.data; // job.data contains what was passed to textQueue.add
        const systemPrompt = `You are a creative AI content idea generator. Provide compelling and unique ideas for ${ideaType} based on keywords and tone.`;
        const userPrompt = `Generate 3-5 distinct and engaging content ideas for a ${ideaType} using keywords "${keywords}". Tone: ${tone || 'neutral'}. For each idea, suggest a main prompt for AI generation and a catchy title. Format as:
        1. Idea: [Short description]
           Prompt: [Detailed AI prompt]
           Title: [Catchy Title]`;

        const ideasRaw = await aiService.generateText(userPrompt, { systemPrompt, maxTokens: 800, temperature: 0.9 });

        // Parse the ideas into a structured array
        const ideas = ideasRaw.split('\n\n').map(block => {
            const ideaMatch = block.match(/Idea:\s*(.*)/);
            const promptMatch = block.match(/Prompt:\s*(.*)/);
            const titleMatch = block.match(/Title:\s*(.*)/);
            return {
                idea: ideaMatch ? ideaMatch[1].trim() : '',
                prompt: promptMatch ? promptMatch[1].trim() : '',
                title: titleMatch ? titleMatch[1].trim() : ''
            };
        }).filter(item => item.idea && item.prompt && item.title);

        result = { ideas };
    } else if (type === 'generateBlog') {
      const { length, tone, keywords, sections } = options;
      let userPrompt = `Write a comprehensive blog post about "${prompt}".`;
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
      const blogContent = await aiService.generateText(userPrompt, { systemPrompt, maxTokens: 3000, temperature: 0.8 });
      const titlePrompt = `Generate a catchy, SEO-friendly title for a blog post about "${title}".`;
      const title = await aiService.generateText(titlePrompt, { maxTokens: 100, temperature: 0.7 });
      const imagePrompt = await aiService.generateText(`Suggest a detailed prompt for a featured image for a blog post titled "${title}".`, { maxTokens: 150 });
      result = { title: title.trim(), content: blogContent, suggestedImagePrompt: imagePrompt.trim() };
    } else if (type === 'generateCaption') {
      const { platform, count, tone } = options;
      const captionGenPrompt = `Generate ${count} ${tone} social media captions for this content: "${prompt}". Make them concise, suitable for ${platform || 'general social media'}, and distinct. Provide them as a numbered list.`;
      const captionsRaw = await aiService.generateText(captionGenPrompt, { maxTokens: 500, temperature: 0.7 });
      const captions = captionsRaw.split('\n').filter(line => line.match(/^\s*\d+\./)).map(line => line.replace(/^\s*\d+\.\s*/, '').trim()).filter(Boolean);
      const hashtags = await aiService.generateHashtags(prompt, platform, Math.min(count, 20));
      result = { captions, hashtags };
    } else if (type === 'createTour') {
      const { tourType, location, highlights, duration, numScenes, details } = options;
      let scriptPrompt = `Create an engaging virtual tour script for a ${tourType} in ${location}.`;
      if (highlights) scriptPrompt += ` Highlights include: ${highlights}.`;
      if (duration) scriptPrompt += ` Target duration: ${duration} seconds.`;
      if (details) scriptPrompt += ` Key details: ${details}.`;
      scriptPrompt += ` Break it into ${numScenes} distinct scenes, each with a visual description and narration.`;
      const tourScript = await aiService.generateVideoScript(scriptPrompt, 'explainer', duration || 120);
      const scenes = aiService.parseVideoScript(tourScript);
      const images = []; // Images will be generated via imageQueue for each scene separately
      for (const scene of scenes.slice(0, Math.min(numScenes, 5))) {
        const imageGenPrompt = `${scene.description}, virtual tour photography, ${location}, high quality, realistic.`;
        try {
            const imagePath = await aiService.generateImage(imageGenPrompt, { size: '1024x1024' });
            images.push(`/temp/${path.basename(imagePath)}`);
        } catch (imgErr) {
            console.warn(`Could not generate image for tour scene: ${imgErr.message}`);
        }
      }
      result = { script: tourScript, images, tourType, location };
    } else if (type === 'createSocialContent') {
      const { platform, generateImage } = options;
      let content = {};
      const textPrompt = `Create an engaging social media post for ${platform} about: "${prompt}". Make it concise and shareable.`;
      content.text = await aiService.generateText(textPrompt, { maxTokens: 500 });
      content.hashtags = await aiService.generateHashtags(prompt, platform, 15);
      if (generateImage) {
        const imageGenPrompt = `${prompt}, high-quality social media graphic, ${platform} style, engaging.`;
        const imagePath = await aiService.generateImage(imageGenPrompt);
        content.imageUrl = `/temp/${path.basename(imagePath)}`;
      }
      result = content;
    }
    else {
      throw new Error(`Unknown text job type: ${type}`);
    }

    job.updateProgress(100);
    console.log(`✅ Worker: Text job ${job.id} completed.`);
    return result;
  } catch (error) {
    console.error(`❌ Worker: Error processing text job ${job.id}:`, error);
    throw error;
  }
}, { connection });


// Optional: QueueEvents to listen to job lifecycle events
const videoQueueEvents = new QueueEvents('videoProcessingQueue', { connection });
videoQueueEvents.on('completed', async ({ jobId, returnvalue }) => { // Make async
  console.log(`🎊 Job ${jobId} from videoProcessingQueue completed! Result:`, returnvalue ? Object.keys(returnvalue) : 'No result');
  // Deduct credits if userId and cost are present in job data
  try {
    const job = await videoWorker.getJob(jobId); // Get the full job object to access its data
    if (job && job.data && job.data.userId && typeof job.data.cost !== 'undefined') {
      const user = await User.findById(job.data.userId);
      if (user) {
        user.credits -= job.data.cost;
        await user.save();
        console.log(`✅ Credits deducted for user ${job.data.userId}: ${job.data.cost}. Remaining: ${user.credits}`);
      } else {
        console.warn(`⚠️ User ${job.data.userId} not found for credit deduction after job ${jobId} completion.`);
      }
    }
  } catch (err) {
    console.error(`❌ Error deducting credits for job ${jobId} on completion:`, err);
  }
});
videoQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`🔴 Job ${jobId} from videoProcessingQueue failed:`, failedReason);
});
videoQueueEvents.on('progress', ({ jobId, data }) => {
    console.log(`🔄 Job ${jobId} progress: ${data}%`);
});

const imageQueueEvents = new QueueEvents('imageProcessingQueue', { connection });
imageQueueEvents.on('completed', async ({ jobId, returnvalue }) => { // Make async
    console.log(`🎊 Job ${jobId} from imageProcessingQueue completed!`);
    // Deduct credits if userId and cost are present in job data
    try {
      const job = await imageWorker.getJob(jobId); // Get the full job object to access its data
      if (job && job.data && job.data.userId && typeof job.data.cost !== 'undefined') {
        const user = await User.findById(job.data.userId);
        if (user) {
          user.credits -= job.data.cost;
          await user.save();
          console.log(`✅ Credits deducted for user ${job.data.userId}: ${job.data.cost}. Remaining: ${user.credits}`);
        } else {
          console.warn(`⚠️ User ${job.data.userId} not found for credit deduction after job ${jobId} completion.`);
        }
      }
    } catch (err) {
      console.error(`❌ Error deducting credits for job ${jobId} on completion:`, err);
    }
});
imageQueueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`🔴 Job ${jobId} from imageProcessingQueue failed:`, failedReason);
});
imageQueueEvents.on('progress', ({ jobId, data }) => {
    console.log(`🔄 Job ${jobId} progress: ${data}%`);
});

const voiceQueueEvents = new QueueEvents('voiceProcessingQueue', { connection });
voiceQueueEvents.on('completed', async ({ jobId, returnvalue }) => { // Make async
    console.log(`🎊 Job ${jobId} from voiceProcessingQueue completed!`);
    // Deduct credits if userId and cost are present in job data
    try {
      const job = await voiceWorker.getJob(jobId); // Get the full job object to access its data
      if (job && job.data && job.data.userId && typeof job.data.cost !== 'undefined') {
        const user = await User.findById(job.data.userId);
        if (user) {
          user.credits -= job.data.cost;
          await user.save();
          console.log(`✅ Credits deducted for user ${job.data.userId}: ${job.data.cost}. Remaining: ${user.credits}`);
        } else {
          console.warn(`⚠️ User ${job.data.userId} not found for credit deduction after job ${jobId} completion.`);
        }
      }
    } catch (err) {
      console.error(`❌ Error deducting credits for job ${jobId} on completion:`, err);
    }
});
voiceQueueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`🔴 Job ${jobId} from voiceProcessingQueue failed:`, failedReason);
});
voiceQueueEvents.on('progress', ({ jobId, data }) => {
    console.log(`🔄 Job ${jobId} progress: ${data}%`);
});

const textQueueEvents = new QueueEvents('textProcessingQueue', { connection });
textQueueEvents.on('completed', async ({ jobId, returnvalue }) => { // Make async
    console.log(`🎊 Job ${jobId} from textProcessingQueue completed!`);
    // Deduct credits if userId and cost are present in job data
    try {
      const job = await textWorker.getJob(jobId); // Get the full job object to access its data
      if (job && job.data && job.data.userId && typeof job.data.cost !== 'undefined') {
        const user = await User.findById(job.data.userId);
        if (user) {
          user.credits -= job.data.cost;
          await user.save();
          console.log(`✅ Credits deducted for user ${job.data.userId}: ${job.data.cost}. Remaining: ${user.credits}`);
        } else {
          console.warn(`⚠️ User ${job.data.userId} not found for credit deduction after job ${jobId} completion.`);
        }
      }
    } catch (err) {
      console.error(`❌ Error deducting credits for job ${jobId} on completion:`, err);
    }
});
textQueueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`🔴 Job ${jobId} from textProcessingQueue failed:`, failedReason);
});
textQueueEvents.on('progress', ({ jobId, data }) => {
    console.log(`🔄 Job ${jobId} progress: ${data}%`);
});

const allJobsQueueEvents = new QueueEvents('allJobsQueue', { connection });
allJobsQueueEvents.on('completed', ({ jobId, returnvalue }) => {
    console.log(`🎊 Overall Job ${jobId} completed!`);
});
allJobsQueueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`🔴 Overall Job ${jobId} failed:`, failedReason);
});
allJobsQueueEvents.on('progress', ({ jobId, data }) => {
    // This is where you might push updates to a WebSocket for frontend real-time progress
    console.log(`🔄 Overall Job ${jobId} progress: ${data}%`);
});
