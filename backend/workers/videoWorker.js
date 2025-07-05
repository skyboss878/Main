// ~/main/backend/workers/videoWorker.js
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const aiService = require('../services/aiService');
const User = require('../models/User');
const { allJobsQueue } = require('../queue/queue'); // ✅ Tracking queue
require('dotenv').config();

const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

const videoWorker = new Worker(
  'videoProcessingQueue',
  async (job) => {
    const { type, prompt, options, userId, cost } = job.data;
    console.log(`🚀 Video Worker: Processing job ${job.id} of type "${type}" for user ${userId}...`);

    try {
      let result;
      switch (type) {
        case 'generateVideo':
          result = await aiService.generateVideo(prompt, options);
          break;
        default:
          throw new Error(`Unknown job type for video worker: ${type}`);
      }

      if (userId && cost) {
        await User.findByIdAndUpdate(userId, { $inc: { credits: -cost } });
        console.log(`💳 User ${userId} debited ${cost} credits.`);
      }

      return { result, timestamp: new Date() };
    } catch (error) {
      console.error(`❌ Video Worker: Job ${job.id} failed. Error: ${error.message}`);
      throw error;
    }
  },
  { connection }
);

videoWorker.on('completed', async (job) => {
  console.log(`🎉 Video Job ${job.id} completed.`, job.returnvalue);
  try {
    await allJobsQueue.add('updateJobStatus', {
      originalQueue: 'videoProcessingQueue',
      originalJobId: job.id,
      status: 'completed',
      result: job.returnvalue
    });
    console.log(`✅ Video Job ${job.id} tracked in allJobsQueue.`);
  } catch (err) {
    console.error(`❌ Failed to track completed video job ${job.id}:`, err.message);
  }
});

videoWorker.on('failed', async (job, err) => {
  console.error(`💔 Video Job ${job.id} failed:`, err.message);
  try {
    await allJobsQueue.add('updateJobStatus', {
      originalQueue: 'videoProcessingQueue',
      originalJobId: job.id,
      status: 'failed',
      failedReason: err.message
    });
    console.log(`❌ Video Job ${job.id} failure tracked.`);
  } catch (trackError) {
    console.error(`❌ Failed to track failed job ${job.id}:`, trackError.message);
  }
});

console.log('🎞️ Video Worker started.');
module.exports = videoWorker;
