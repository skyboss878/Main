// ~/main/backend/workers/allJobsWorker.js
const { Worker } = require('bullmq');
const Redis = require('ioredis');
require('dotenv').config();

const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

const allJobsWorker = new Worker(
  'allJobsTrackingQueue', // This must match the queue name in `queue/queue.js`
  async (job) => {
    // This worker's job is simply to record/track other jobs.
    // The data passed to it is usually `originalQueue`, `originalJobId`, `status`, `result`, `failedReason`.
    // BullMQ itself handles the state, but if you wanted a database record of all jobs, this worker would do it.
    console.log(`🔄 All Jobs Tracker: Job ${job.id} received for ${job.data.originalQueue} job ${job.data.originalJobId}. Status: ${job.data.status}`);

    // Here you could save this information to a database for long-term tracking
    // For example: await JobTrackingModel.create(job.data);
    // Or update an existing record: await JobTrackingModel.findOneAndUpdate({ originalJobId: job.data.originalJobId }, job.data);

    return { status: 'tracked', data: job.data };
  },
  { connection }
);

allJobsWorker.on('completed', (job) => {
  console.log(`✅ All Jobs Tracker: Job ${job.id} for ${job.data.originalQueue} job ${job.data.originalJobId} completed tracking.`);
});

allJobsWorker.on('failed', (job, err) => {
  console.error(`💔 All Jobs Tracker: Job ${job.id} for ${job.data.originalQueue} job ${job.data.originalJobId} failed tracking:`, err.message);
});

console.log('All Jobs Worker started.');

module.exports = allJobsWorker;
