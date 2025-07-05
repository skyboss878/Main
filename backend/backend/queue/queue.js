const Queue = require('bull');

const videoQueue = new Queue('videoProcessingQueue');
const imageQueue = new Queue('imageProcessingQueue');
const voiceQueue = new Queue('voiceProcessingQueue');
const textQueue = new Queue('textProcessingQueue');
const allJobsQueue = new Queue('allJobsQueue');

module.exports = {
  videoQueue,
  imageQueue,
  voiceQueue,
  textQueue,
  allJobsQueue
};
