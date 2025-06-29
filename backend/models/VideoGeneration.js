// models/VideoGeneration.js
const mongoose = require('mongoose');

const videoGenerationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['social', 'commercial', 'product', 'explainer'],
    required: true
  },
  prompt: {
    type: String,
    required: true,
    maxlength: 2000
  },
  script: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  url: {
    type: String,
    default: ''
  },
  productImages: [{
    type: String
  }],
  options: {
    duration: {
      type: Number,
      default: 30,
      min: 10,
      max: 300
    },
    style: {
      type: String,
      default: 'default'
    },
    voice: {
      type: String,
      default: 'default'
    }
  },
  hashtags: [{
    type: String
  }],
  musicSuggestions: [{
    type: String
  }],
  metadata: {
    fileSize: Number,
    duration: Number,
    resolution: String,
    format: String
  },
  error: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
videoGenerationSchema.index({ user: 1, createdAt: -1 });
videoGenerationSchema.index({ status: 1 });
videoGenerationSchema.index({ type: 1 });

// Virtual for formatted creation date
videoGenerationSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Method to update status
videoGenerationSchema.methods.updateStatus = function(status, url = '', error = '') {
  this.status = status;
  if (url) this.url = url;
  if (error) this.error = error;
  return this.save();
};

// Static method to get user's videos
videoGenerationSchema.statics.getUserVideos = function(userId, limit = 10, skip = 0) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('-__v');
};

// Static method to get video stats
videoGenerationSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        processing: {
          $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
        },
        failed: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        types: {
          $push: '$type'
        }
      }
    }
  ]);
};

module.exports = mongoose.model('VideoGeneration', videoGenerationSchema);
