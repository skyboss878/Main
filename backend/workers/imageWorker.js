// ~/main/backend/workers/imageWorker.js
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const aiService = require('../services/aiService');
const User = require('../models/User');
const { allJobsQueue } = require('../queue/queue'); // ✅ Add tracking queue
require('dotenv').config();

const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

const imageWorker = new Worker(
  'imageProcessingQueue',
  async (job) => {
    const { type, prompt, options, imagePath, userId, cost } = job.data;
    console.log(`🚀 Image Worker: Processing job ${job.id} of type "${type}" for user ${userId}...`);

    try {
      let result;
      switch (type) {
        case 'generateGenericImage':
          result = await aiService.generateImage(prompt, options);
          break;
        case 'imageToImage':
          result = await aiService.imageToImage(imagePath, prompt, options);
          break;
        default:
          throw new Error(`Unknown job type for image worker: ${type}`);
      }

      if (userId && cost) {
        await User.findByIdAndUpdate(userId, { $inc: { credits: -cost } });
        console.log(`💳 User ${userId} debited ${cost} credits.`);
      }

      return { result, timestamp: new Date() };
    } catch (error) {
      console.error(`❌ Image Worker: Job ${job.id} failed. Error: ${error.message}`);
      throw error;
    }
  },
  { connection }
);

imageWorker.on('completed', async (job) => {
  console.log(`🎉 Image Job ${job.id} has completed! Result:`, job.returnvalue);
  try {
    await allJobsQueue.add('updateJobStatus', {
      originalQueue: 'imageProcessingQueue',
      originalJobId: job.id,
      status: 'completed',
      result: job.returnvalue
    });
    console.log(`✅ Image Job ${job.id} tracked in allJobsQueue.`);
  } catch (err) {
    console.error(`❌ Failed to track completed image job ${job.id}:`, err.message);
  }
});

imageWorker.on('failed', async (job, err) => {
  console.error(`💔 Image Job ${job.id} has failed:`, err.message);
  try {
    await allJobsQueue.add('updateJobStatus', {
      originalQueue: 'imageProcessingQueue',
      originalJobId: job.id,
      status: 'failed',
      failedReason: err.message
    });
    console.log(`❌ Image Job ${job.id} failure tracked.`);
  } catch (trackError) {
    console.error(`❌ Failed to track failed image job ${job.id}:`, trackError.message);
  }
});

console.log('🖼️ Image Worker started.');
module.exports = imageWorker;
