import React from 'react';

const PricingCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Basic</h3>
        <p className="text-3xl font-bold text-purple-400 mb-4">$9/month</p>
        <ul className="text-gray-300 space-y-2">
          <li>• 10 videos per month</li>
          <li>• Basic templates</li>
          <li>• Email support</li>
        </ul>
      </div>
      <div className="bg-purple-600/20 border border-purple-500 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Pro</h3>
        <p className="text-3xl font-bold text-purple-400 mb-4">$29/month</p>
        <ul className="text-gray-300 space-y-2">
          <li>• 50 videos per month</li>
          <li>• Premium templates</li>
          <li>• Priority support</li>
        </ul>
      </div>
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Enterprise</h3>
        <p className="text-3xl font-bold text-purple-400 mb-4">$99/month</p>
        <ul className="text-gray-300 space-y-2">
          <li>• Unlimited videos</li>
          <li>• Custom templates</li>
          <li>• 24/7 support</li>
        </ul>
      </div>
    </div>
  );
};

export default PricingCards;
