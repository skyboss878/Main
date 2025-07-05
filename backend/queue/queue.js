// ~/main/backend/queue/queue.js
const { Queue, Worker } = require("bullmq");
const Redis = require('ioredis');
require('dotenv').config(); // Load environment variables

// Ensure Redis connection details are available
if (!process.env.REDIS_URL) {
  console.error('❌ CRITICAL: REDIS_URL environment variable is not set. Queues will not function.');
  process.exit(1); // Exit if Redis URL is missing, as queues are fundamental
}

// Establish a single Redis connection for all queues and workers
// maxRetriesPerRequest: null prevents ioredis from retrying failed commands indefinitely,
// which can cause issues with BullMQ's handling of job state.
const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

// Define your queues
const textQueue = new Queue('textProcessingQueue', { connection });
const imageQueue = new Queue('imageProcessingQueue', { connection });
const voiceQueue = new Queue('voiceProcessingQueue', { connection });
const videoQueue = new Queue('videoProcessingQueue', { connection });
const allJobsQueue = new Queue('allJobsTrackingQueue', { connection }); // Define the allJobsQueue for tracking

// It should ideally run in a separate process in production, but here it's coupled for simplicity.


module.exports = {
  textQueue,
  imageQueue,
  voiceQueue,
  videoQueue,
  allJobsQueue, // Export allJobsQueue
};
