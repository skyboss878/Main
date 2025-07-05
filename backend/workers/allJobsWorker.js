const { Worker } = require('bullmq');
const Redis = require('ioredis');
require('dotenv').config();

const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

const allJobsWorker = new Worker(
  'allJobsTrackingQueue',
  async (job) => {
    console.log(`🔄 Tracking Job: ${job.id} | Queue: ${job.data.originalQueue} | Original Job: ${job.data.originalJobId}`);
    return { status: 'tracked', data: job.data };
  },
  { connection }
);

allJobsWorker.on('completed', (job) => {
  console.log(`✅ Tracked job ${job.id} completed.`);
});

allJobsWorker.on('failed', (job, err) => {
  console.error(`❌ Tracked job ${job.id} failed:`, err.message);
});

console.log('🧭 All Jobs Tracker Worker started.');
