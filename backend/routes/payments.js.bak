const express = require('express');
const router = express.Router();
const paypalService = require('../services/paypalService'); // Assuming this exists

// Route to create a PayPal order
router.post('/create-order', async (req, res) => {
  const { amount, currency, userId, description } = req.body; // Example parameters

  if (!amount || !currency || !userId) {
    return res.status(400).json({ success: false, message: 'Missing required payment details' });
  }

  try {
    console.log(`💰 Creating PayPal order for user ${userId}, amount ${amount} ${currency}`);
    const order = await paypalService.createOrder(amount, currency, userId, description);
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('❌ Error creating PayPal order:', error);
    res.status(500).json({ success: false, message: 'Failed to create PayPal order', error: error.message });
  }
});

// Route to capture a PayPal order
router.post('/capture-order', async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, message: 'Order ID is required' });
  }

  try {
    console.log(`💰 Capturing PayPal order: ${orderId}`);
    const capture = await paypalService.captureOrder(orderId);
    // You might want to update user's credits/subscription here in your DB
    res.json({ success: true, data: capture });
  } catch (error) {
    console.error('❌ Error capturing PayPal order:', error);
    res.status(500).json({ success: false, message: 'Failed to capture PayPal order', error: error.message });
  }
});

// Example route for fetching transaction history for a user (requires DB integration)
// router.get('/history/:userId', async (req, res) => { /* ... */ });

module.exports = router;
