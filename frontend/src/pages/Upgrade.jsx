// src/pages/Upgrade.jsx
import React, { useState } from 'react';
import { apiUtils } from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Upgrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('pro'); // 'basic', 'pro', 'enterprise'
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false); // To show PayPal link

  const plans = [
    { id: 'basic', name: 'Basic Plan', price: '9.99', currency: 'USD', features: ['100 AI credits/month', 'Standard AI models'] },
    { id: 'pro', name: 'Pro Plan', price: '29.99', currency: 'USD', features: ['500 AI credits/month', 'Premium AI models', 'Faster generation'] },
    { id: 'enterprise', name: 'Enterprise Plan', price: '99.99', currency: 'USD', features: ['Unlimited AI credits', 'Custom AI models', 'Dedicated support'] },
  ];

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPaypalOrderId(null);
    setShowPaymentDetails(false);
    toast.dismiss();

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) {
      setError('Selected plan not found.');
      setLoading(false);
      return;
    }

    try {
      toast.loading(`Initiating purchase for ${plan.name}...`, { id: 'paymentToast', duration: 0 });
      // In a real app, userId would come from your AuthContext
      const userId = "user123"; // MOCK USER ID
      const response = await apiUtils.createPaymentOrder({
        amount: plan.price,
        currency: plan.currency,
        userId: userId,
        description: `${plan.name} subscription`
      });

      if (response.data.success && response.data.data.id) {
        const orderId = response.data.data.id;
        setPaypalOrderId(orderId);
        toast.success('PayPal order created. Redirecting to PayPal...', { id: 'paymentToast', duration: 5000 });

        // Find the approval URL
        const approveLink = response.data.data.links.find(link => link.rel === 'approve');
        if (approveLink) {
            window.location.href = approveLink.href; // Redirect to PayPal for approval
        } else {
            setError('Could not find PayPal approval link.');
            toast.error('Could not find PayPal approval link.', { id: 'paymentToast', duration: 5000 });
            setLoading(false);
        }
      } else {
        setError(response.data.message || 'Failed to create PayPal order.');
        toast.error(response.data.message || 'Failed to create PayPal order.', { id: 'paymentToast', duration: 5000 });
        setLoading(false);
      }
    } catch (err) {
      console.error('Frontend Error creating order:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`, { id: 'paymentToast', duration: 5000 });
      setLoading(false);
    }
  };

  // In a real app, you'd have a success page that captures the order ID from URL params
  // and calls apiUtils.capturePaymentOrder()
  // For this example, it's just a placeholder.

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8 bg-gray-900 text-white min-h-screen"
    >
      <h1 className="text-4xl font-bold mb-8 text-center gradient-text">Upgrade Your Plan</h1>
      <p className="text-xl text-gray-300 text-center mb-10">Unlock more features, faster generation, and higher credit limits.</p>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card p-6 bg-gray-800 border-2 ${selectedPlan === plan.id ? 'border-blue-500' : 'border-gray-700'} hover:border-purple-500 transition-all cursor-pointer`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <h2 className="text-3xl font-bold mb-4 text-blue-400">{plan.name}</h2>
            <p className="text-5xl font-extrabold mb-4">${plan.price}<span className="text-xl text-gray-400">/month</span></p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${selectedPlan === plan.id ? 'btn-primary' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
            >
              {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-100 text-center">Complete Your Purchase</h2>
        <form onSubmit={handleCreateOrder} className="space-y-6">
          <p className="text-lg text-center text-gray-300">
            You are purchasing the <span className="font-semibold text-blue-400">{plans.find(p => p.id === selectedPlan)?.name}</span> for <span className="font-semibold text-blue-400">${plans.find(p => p.id === selectedPlan)?.price}</span>.
          </p>

          <button
            type="submit"
            className="btn-primary w-full py-3 px-6 text-xl rounded-lg font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay with PayPal'}
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>

      {/* Placeholder for PayPal approval/capture success */}
      {/* In a real app, the success page (e.g., /payments/success) would handle this */}
      {/* For testing, you'd manually capture the order ID from the URL after PayPal approval */}
      {paypalOrderId && (
        <div className="mt-10 text-center text-gray-300">
            <p>After approving on PayPal, you'd typically be redirected to a success page.</p>
            <p>For manual testing, the created Order ID is: <span className="font-bold text-blue-400">{paypalOrderId}</span></p>
            <p>You would then manually trigger the capture API call on your backend from your frontend's success page.</p>
            <p>
             Example capture endpoint:{" "}
            <span className="text-sm">
             POST /api/payments/capture-order with body &#123; orderId: "{paypalOrderId}" &#125;
            </span>
            </p>
        </div>
      )}
    </motion.div>
  );
};

export default Upgrade;


