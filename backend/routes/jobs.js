// ~/main/backend/routes/jobs.js
const express = require('express');
const router = express.Router();

const {
  textQueue,
  imageQueue,
  voiceQueue,
  videoQueue,
  allJobsQueue
} = require('../queue/queue');

const authMiddleware = require('../middleware/authMiddleware');

// Map the queue name to the correct queue instance
const getQueueInstance = (queueName) => {
  switch (queueName) {
    case 'textProcessingQueue': return textQueue;
    case 'imageProcessingQueue': return imageQueue;
    case 'voiceProcessingQueue': return voiceQueue;
    case 'videoProcessingQueue': return videoQueue;
    default: return null;
  }
};

// GET /api/jobs/:jobId/status
router.get('/:jobId/status', authMiddleware, async (req, res) => {
  const { jobId } = req.params;

  try {
    const trackingJob = await allJobsQueue.getJob(jobId);

    if (!trackingJob) {
      return res.status(404).json({
        success: false,
        message: 'Tracking job not found. It may have expired or been cleaned up.'
      });
    }

    const { queue: originalQueueName, jobId: actualJobId } = trackingJob.data;

    const queue = getQueueInstance(originalQueueName);
    if (!queue) {
      return res.status(400).json({
        success: false,
        message: 'Invalid original queue name in tracking job.'
      });
    }

    const job = await queue.getJob(actualJobId);

    // Return completed result from tracking log if original job is gone
    if (!job && trackingJob.returnvalue) {
      return res.json({
        success: true,
        jobId: actualJobId,
        status: 'completed',
        progress: 100,
        result: trackingJob.returnvalue,
        queueName: originalQueueName,
        message: 'Job completed and result retrieved from tracking log.'
      });
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Original job not found in its specific queue. It might be processing or completed/cleaned up.'
      });
    }

    const status = await job.getState();
    const progress = job.progress || 0;
    const result = job.returnvalue || null;
    const failedReason = job.failedReason || null;

    res.json({
      success: true,
      jobId: job.id,
      queueName: originalQueueName,
      status,
      progress,
      result,
      failedReason,
      message: `Job is currently ${status}.`
    });
  } catch (error) {
    console.error(`❌ Job status error for tracking ID ${req.params.jobId}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error checking job status.',
      error: error.message
    });
  }
});

module.exports = router;
