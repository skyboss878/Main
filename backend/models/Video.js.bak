const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['social', 'commercial', 'product'], required: true },
  prompt: { type: String, required: true },
  productImages: { type: [String], default: [] }, // URLs or base64 strings for product videos
  options: { type: Object },
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
  url: { type: String }, // video URL after generation
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', videoSchema);
