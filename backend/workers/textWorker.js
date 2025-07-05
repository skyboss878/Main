// ~/main/backend/workers/textWorker.js
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const aiService = require('../services/aiService');
const User = require('../models/User');
const { allJobsQueue } = require('../queue/queue'); // ✅ Import tracking queue
require('dotenv').config();

const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

const textWorker = new Worker(
  'textProcessingQueue',
  async (job) => {
    const { type, prompt, options, userId, cost } = job.data;
    console.log(`🚀 Text Worker: Processing job ${job.id} of type "${type}" for user ${userId}...`);

    try {
      let result;
      switch (type) {
        case 'generateGenericText':
          result = await aiService.generateText(prompt, options);
          break;
        case 'generateIdeas':
          result = await aiService.generateText(
            `Generate ideas for ${options.type} related to "${options.keywords}" with a ${options.tone} tone.`,
            { provider: options.provider || 'openai', maxTokens: 500 }
          );
          break;
        case 'generateCaption':
          result = await aiService.generateCaption(prompt, options);
          break;
        default:
          throw new Error(`Unknown job type for text worker: ${type}`);
      }

      if (userId && cost) {
        await User.findByIdAndUpdate(userId, { $inc: { credits: -cost } });
        console.log(`💳 User ${userId} debited ${cost} credits.`);
      }

      return { result, timestamp: new Date() };
    } catch (error) {
      console.error(`❌ Text Worker: Job ${job.id} failed. Error: ${error.message}`);
      throw error;
    }
  },
  { connection }
);

textWorker.on('completed', async (job) => {
  console.log(`🎉 Text Job ${job.id} has completed! Result:`, job.returnvalue);
  try {
    await allJobsQueue.add('updateJobStatus', {
      originalQueue: 'textProcessingQueue',
      originalJobId: job.id,
      status: 'completed',
      result: job.returnvalue
    });
    console.log(`✅ Tracked completed job ${job.id} in allJobsQueue.`);
  } catch (err) {
    console.error(`❌ Failed to track completed job ${job.id}:`, err.message);
  }
});

textWorker.on('failed', async (job, err) => {
  console.error(`💔 Text Job ${job.id} has failed with error:`, err.message);
  try {
    await allJobsQueue.add('updateJobStatus', {
      originalQueue: 'textProcessingQueue',
      originalJobId: job.id,
      status: 'failed',
      failedReason: err.message
    });
    console.log(`❌ Tracked failed job ${job.id} in allJobsQueue.`);
  } catch (trackError) {
    console.error(`❌ Failed to track failed job ${job.id}:`, trackError.message);
  }
});

console.log('📝 Text Worker started.');
module.exports = textWorker;
