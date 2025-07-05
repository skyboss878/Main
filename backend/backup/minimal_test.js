// minimal_test.js - Test server startup without routes
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

console.log('🧪 Testing minimal server...');

const app = express();

// Basic middleware only
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route works' });
});

console.log('✅ Middleware configured, starting server...');

// Try to start server
const PORT = process.env.PORT || 5000;
try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Minimal server running on http://0.0.0.0:${PORT}`);
    console.log('✅ Server started successfully!');
    
    // Test if we can make a request
    setTimeout(() => {
      console.log('📡 Testing server response...');
      fetch(`http://localhost:${PORT}/test`)
        .then(res => res.json())
        .then(data => console.log('✅ Test response:', data))
        .catch(err => console.log('❌ Test request failed:', err.message));
    }, 1000);
  });

  server.on('error', (error) => {
    console.error('❌ Server startup error:', error);
  });

} catch (error) {
  console.error('❌ Failed to start server:', error);
}
