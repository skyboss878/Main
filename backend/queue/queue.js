// backend/queue/queue.js
const { Queue } = require('bullmq');
require('dotenv').config({ path: '../.env' }); // Load .env from backend root

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || null;

const connection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
};

// Define different queues for different types of jobs
const videoQueue = new Queue('videoProcessingQueue', { connection });
const imageQueue = new Queue('imageProcessingQueue', { connection });
const voiceQueue = new Queue('voiceProcessingQueue', { connection });
const textQueue = new Queue('textProcessingQueue', { connection }); // For blog, captions, descriptions, etc.

// A single queue to track all jobs if you want to poll generic status
const allJobsQueue = new Queue('allJobsQueue', { connection });

console.log(`✅ Redis connection established for BullMQ: ${REDIS_HOST}:${REDIS_PORT}`);

module.exports = {
  videoQueue,
  imageQueue,
  voiceQueue,
  textQueue,
  allJobsQueue, // Export the queue for overall job tracking
  connection, // Export connection for workers
};
