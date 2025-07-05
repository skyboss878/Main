// backend/services/paypalService.js
const checkoutNodeSdk = require('@paypal/checkout-server-sdk');
require('dotenv').config({ path: '../.env' }); // Load .env from backend root

class PayPalClient {
  /**
   * Returns PayPal HTTP client instance with environment that depends on NODE_ENV.
   * For local development, set NODE_ENV to 'development' or 'test'.
   * For production, set NODE_ENV to 'production'.
   */
  environment() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('PayPal Client ID and Client Secret are not configured in environment variables.');
    }

    if (process.env.NODE_ENV === 'production') {
      return new checkoutNodeSdk.core.LiveEnvironment(clientId, clientSecret);
    } else {
      return new checkoutNodeSdk.core.SandboxEnvironment(clientId, clientSecret);
    }
  }

  /**
   * Returns PayPal HTTP client instance.
   */
  client() {
    return new checkoutNodeSdk.core.PayPalHttpClient(this.environment());
  }

  /**
   * Creates a PayPal order.
   * @param {string} amount - The total amount for the order.
   * @param {string} currency - The currency code (e.g., "USD").
   * @param {string} referenceId - A unique identifier for the order (e.g., user ID + timestamp).
   * @param {string} description - A description for the order.
   * @returns {object} The created order details.
   */
  async createOrder(amount, currency, referenceId, description = "AI Content Service Purchase") {
    const request = new checkoutNodeSdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: referenceId,
        description: description,
        amount: {
          currency_code: currency,
          value: amount
        }
      }],
      // Define redirect URLs after approval/cancellation
      application_context: {
        brand_name: 'AI Creators Studio', // Your brand name
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/payments/success`, // IMPORTANT: Update with your actual frontend success URL
        cancel_url: `${process.env.FRONTEND_URL}/payments/cancel`  // IMPORTANT: Update with your actual frontend cancel URL
      }
    });

    try {
      const client = this.client();
      const response = await client.execute(request);
      console.log(`✅ PayPal Order Created: ${JSON.stringify(response.result)}`);
      return response.result;
    } catch (error) {
      console.error('❌ Error creating PayPal order:', error.statusCode, error.message);
      throw error;
    }
  }

  /**
   * Captures a PayPal order.
   * @param {string} orderId - The ID of the order to capture.
   * @returns {object} The captured order details.
   */
  async captureOrder(orderId) {
    const request = new checkoutNodeSdk.orders.OrdersCaptureRequest(orderId);
    request.prefer("return=representation"); // Use prefer method
    try {
      const client = this.client();
      const response = await client.execute(request);
      console.log(`✅ PayPal Order Captured: ${JSON.stringify(response.result)}`);
      return response.result;
    } catch (error) {
      console.error('❌ Error capturing PayPal order:', error.statusCode, error.message);
      throw error;
    }
  }
}

module.exports = new PayPalClient();
