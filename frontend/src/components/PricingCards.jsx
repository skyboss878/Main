import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

const PAYPAL_PLAN_IDS = {
  basic: 'P-6A438876TU583010LNBQ3HWY',
  pro: 'P-0YD32059K1705561BNBQ3IYI',
  enterprise: 'P-2UF26878SM8694228NBQ3JKY',
};

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9/month',
    features: ['10 videos per month', 'Basic templates', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29/month',
    features: ['50 videos per month', 'Premium templates', 'Priority support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$99/month',
    features: ['Unlimited videos', 'Custom templates', '24/7 support'],
  },
];

const PricingCards = () => {
  useEffect(() => {
    plans.forEach((plan) => {
      const planId = PAYPAL_PLAN_IDS[plan.id];
      const containerId = `paypal-button-${plan.id}`;
      const alreadyRendered = document.getElementById(containerId)?.hasChildNodes();

      if (!window.paypal || alreadyRendered) return;

      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe',
        },
        createSubscription: (data, actions) => {
          return actions.subscription.create({ plan_id: planId });
        },
        onApprove: (data) => {
          toast.success(`✅ Subscribed to ${plan.name}!\nID: ${data.subscriptionID}`);
        },
        onError: (err) => {
          console.error(err);
          toast.error('❌ Subscription failed. Please try again.');
        },
      }).render(`#${containerId}`);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`${
            plan.id === 'pro'
              ? 'bg-purple-600/20 border border-purple-500'
              : 'bg-gray-800/50'
          } rounded-xl p-6`}
        >
          <h3 className="text-xl font-bold text-white mb-4">{plan.name}</h3>
          <p className="text-3xl font-bold text-purple-400 mb-4">{plan.price}</p>
          <ul className="text-gray-300 space-y-2 mb-4">
            {plan.features.map((feature, idx) => (
              <li key={idx}>• {feature}</li>
            ))}
          </ul>
          <div id={`paypal-button-${plan.id}`} className="mt-2" />
        </div>
      ))}
    </div>
  );
};

export default PricingCards;
