const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please enter all fields' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    
    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ success: false, message: 'User with that email already exists' });
    }

    // Create new user
    user = new User({ 
      username, 
      email: normalizedEmail, 
      password 
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log("✅ Before saving user:", { id: user.id, username: user.username, email: user.email });
    await user.save();

    // Create JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME || '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ 
          success: true, 
          message: 'User registered successfully', 
          token, 
          user: { 
            id: user.id, 
            username: user.username, 
            email: user.email 
          } 
        });
      }
    );
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please enter all fields' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    
    // Find user by email
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('🔐 Raw input password: ', password);
    console.log('🔒 Stored user.password: ', user.password);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME || '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          success: true, 
          message: 'Logged in successfully', 
          token, 
          user: { 
            id: user.id, 
            username: user.username, 
            email: user.email 
          } 
        });
      }
    );
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Logout (Client-side token removal)
router.post('/logout', (req, res) => {
  // For JWTs, logout is typically handled client-side by deleting the token.
  // If you had token blacklisting or session management, you'd implement it here.
  res.json({ success: true, message: 'Logged out successfully (client-side token cleared).' });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    // Hash the token to match what's stored in database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching reset token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
});

// Request Password Reset (if you need this endpoint)
router.post('/request-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiry (1 hour from now)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // In a real app, you'd send an email with the resetToken
    // For now, we'll just return success
    res.json({ 
      success: true, 
      message: 'Password reset token generated',
      // Don't send the actual token in production - send via email instead
      token: resetToken 
    });
  } catch (error) {
    console.error('❌ Request reset error:', error);
    res.status(500).json({ success: false, message: 'Server error during reset request' });
  }
});

module.exports = router;
