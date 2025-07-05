// test-paypal.js - Run this to test your PayPal credentials
require('dotenv').config();
const axios = require('axios');

async function testPayPalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';
  
  console.log('Testing PayPal credentials...');
  console.log('Client ID:', clientId ? `${clientId.substring(0, 10)}...` : 'MISSING');
  console.log('Client Secret:', clientSecret ? `${clientSecret.substring(0, 10)}...` : 'MISSING');
  console.log('Mode:', mode);
  
  if (!clientId || !clientSecret) {
    console.error('❌ Missing PayPal credentials in .env file');
    return;
  }
  
  const baseURL = mode === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
  
  try {
    // Get access token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await axios.post(
      `${baseURL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('✅ PayPal credentials are valid!');
    console.log('Access token received:', response.data.access_token.substring(0, 20) + '...');
    
  } catch (error) {
    console.error('❌ PayPal credentials test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testPayPalCredentials();
