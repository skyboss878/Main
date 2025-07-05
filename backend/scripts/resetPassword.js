const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');

const emailToUpdate = 'testuser@example.com';
const newPassword = 'test1234'; // 🔐 You can change this

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const hashed = await bcrypt.hash(newPassword, 10);
    const result = await User.updateOne(
      { email: emailToUpdate },
      { $set: { password: hashed } }
    );
    console.log(`✅ Password reset for ${emailToUpdate}`, result);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error resetting password:', err.message);
    process.exit(1);
  });
