const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());

// Rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', globalLimiter);

// Logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// Load routes safely
console.log('🚀 Loading routes...');

const routeConfigs = [
  { path: '/api/auth', file: './routes/auth' },
  { path: '/api/ai', file: './routes/ai' },
  { path: '/api/blog', file: './routes/blog' },
  { path: '/api/caption', file: './routes/caption' },
  { path: '/api/commercial', file: './routes/commercial' },
  { path: '/api/flyer', file: './routes/flyer' },
  { path: '/api/food-promos', file: './routes/foodpromos' },
  { path: '/api/image-to-image', file: './routes/imageToImage' },
  { path: '/api/payments', file: './routes/payments' },
  { path: '/api/services', file: './routes/services' },
  { path: '/api/social-media', file: './routes/social-media' },
  { path: '/api/text-to-image', file: './routes/textToImage' },
  { path: '/api/text-to-video', file: './routes/textToVideo' },
  { path: '/api/tours', file: './routes/tours' },
  { path: '/api/videos', file: './routes/videos' },
  { path: '/api/voice', file: './routes/voice' }
];

for (const { path: routePath, file } of routeConfigs) {
  try {
    console.log(`🔍 Loading route: ${routePath} -> ${file}`);
    
    // Validate route path
    if (typeof routePath !== 'string' || !routePath.startsWith('/')) {
      console.log(`❌ Invalid route path: ${routePath}`);
      continue;
    }
    
    const route = require(file);
    app.use(routePath, route);
    console.log(`✅ Loaded route ${routePath} -> ${file}`);
  } catch (err) {
    console.warn(`⚠️ Failed to load route ${routePath} from ${file}: ${err.message}`);
  }
}

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (mongoUri) {
  mongoose.set('strictQuery', true);
  mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
  console.log('⚠️ No MongoDB URI configured');
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
