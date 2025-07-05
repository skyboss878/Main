// scripts/listUsers.js
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User'); // Adjust path if needed

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await User.find().select('-password');
    console.log('✅ Users in database:\n', users);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
