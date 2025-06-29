// backend/routes/jobs.js
const express = require('express');
const router = express.Router();
// Import all queues to get job status from them
const { videoQueue, imageQueue, voiceQueue, textQueue, allJobsQueue } = require('../queue/queue');

// Helper to get job from correct specific queue
const getJobFromSpecificQueue = async (queueName, jobId) => {
  switch (queueName) {
    case 'videoProcessingQueue': return videoQueue.getJob(jobId);
    case 'imageProcessingQueue': return imageQueue.getJob(jobId);
    case 'voiceProcessingQueue': return voiceQueue.getJob(jobId);
    case 'textProcessingQueue': return textQueue.getJob(jobId);
    default: return null;
  }
};

// Route to get the status of a specific job
router.get('/:jobId/status', async (req, res) => {
  const { jobId } = req.params;

  try {
    // First, retrieve the tracking job from `allJobsQueue` to find out its original queue name
    const trackingJob = await allJobsQueue.getJob(jobId);

    if (!trackingJob) {
      return res.status(404).json({ success: false, message: 'Job not found in tracking queue. It might have expired or been removed.' });
    }

    const { queue: originalQueueName, jobId: actualJobId } = trackingJob.data;

    // Now, get the actual job from its specific queue
    const job = await getJobFromSpecificQueue(originalQueueName, actualJobId);

    if (!job) {
      // This can happen if the job completed and was cleaned up from the specific queue,
      // but the tracking job in allJobsQueue still exists for a short period.
      // Or if the job ID didn't match.
      // For a completed job, we return its last known state from the tracking job.
      if (trackingJob.returnvalue) {
        return res.json({
          success: true,
          jobId: trackingJob.id,
          status: 'completed',
          progress: 100,
          result: trackingJob.returnvalue,
          queueName: originalQueueName,
          message: 'Job completed and result available.'
        });
      }
      return res.status(404).json({ success: false, message: 'Job not found in its specific queue. It may have been processed or cleaned up.' });
    }

    const status = await job.getState(); // 'waiting', 'active', 'completed', 'failed', 'delayed', 'paused'
    const progress = job.progress;
    const result = job.returnvalue; // The value returned by the worker upon completion
    const failedReason = job.failedReason; // Reason if job failed

    res.json({
      success: true,
      jobId: job.id,
      status,
      progress,
      result,
      failedReason,
      queueName: originalQueueName,
      message: `Job is ${status}.`
    });

  } catch (error) {
    console.error(`❌ Error fetching job status for ${jobId}:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch job status.', error: error.message });
  }
});

module.exports = router;
