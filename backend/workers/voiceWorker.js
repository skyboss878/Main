// ~/main/backend/workers/voiceWorker.js
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const aiService = require('../services/aiService');
const User = require('../models/User');
const { allJobsQueue } = require('../queue/queue'); // ✅ Add tracking queue
require('dotenv').config();

const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

const voiceWorker = new Worker(
  'voiceProcessingQueue',
  async (job) => {
    const { type, text, options, userId, cost } = job.data;
    console.log(`🚀 Voice Worker: Processing job ${job.id} of type "${type}" for user ${userId}...`);

    try {
      let result;
      switch (type) {
        case 'generateGenericVoice':
          result = await aiService.generateVoice(text, options);
          break;
        default:
          throw new Error(`Unknown job type for voice worker: ${type}`);
      }

      if (userId && cost) {
        await User.findByIdAndUpdate(userId, { $inc: { credits: -cost } });
        console.log(`💳 User ${userId} debited ${cost} credits.`);
      }

      return { result, timestamp: new Date() };
    } catch (error) {
      console.error(`❌ Voice Worker: Job ${job.id} failed. Error: ${error.message}`);
      throw error;
    }
  },
  { connection }
);

voiceWorker.on('completed', async (job) => {
  console.log(`🎉 Voice Job ${job.id} completed!`, job.returnvalue);
  try {
    await allJobsQueue.add('updateJobStatus', {
      originalQueue: 'voiceProcessingQueue',
      originalJobId: job.id,
      status: 'completed',
      result: job.returnvalue
    });
    console.log(`✅ Voice Job ${job.id} tracked in allJobsQueue.`);
  } catch (err) {
    console.error(`❌ Failed to track completed voice job ${job.id}:`, err.message);
  }
});

voiceWorker.on('failed', async (job, err) => {
  console.error(`💔 Voice Job ${job.id} failed:`, err.message);
  try {
    await allJobsQueue.add('updateJobStatus', {
      originalQueue: 'voiceProcessingQueue',
      originalJobId: job.id,
      status: 'failed',
      failedReason: err.message
    });
    console.log(`❌ Voice Job ${job.id} failure tracked.`);
  } catch (trackError) {
    console.error(`❌ Failed to track failed job ${job.id}:`, trackError.message);
  }
});

console.log('🎙️ Voice Worker started.');
module.exports = voiceWorker;
