// src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { motion } from 'framer-motion'; // For animations

// Define pricing plans here (consistent with PricingWithPayPal.jsx)
const landingPagePricingPlans = [
  {
    id: 'trial',
    name: '3-Day Free Trial',
    price: '0',
    credits: '30',
    description: 'Test the waters for 3 days!',
    features: [
      'Limited AI generations (30 credits)',
      'Standard quality',
      'Community support'
    ],
    buttonText: 'Start Free Trial',
    link: '/signup',
    highlight: false
  },
  {
    id: 'pro', // Highlight a middle or premium plan on landing
    name: 'Pro Plan',
    price: '$29.99',
    credits: '2000',
    description: 'For serious creators & professionals',
    features: [
      '2000 AI credits/month',
      'Premium AI models',
      'Priority generation',
      'Chat support',
      'Commercial rights'
    ],
    buttonText: 'Go Pro Now',
    link: '/pricing?plan=pro',
    highlight: true // Mark this plan to be highlighted visually
  },
  {
    id: 'agency',
    name: 'Agency Plan',
    price: '$99.99',
    credits: 'Unlimited',
    description: 'For agencies & businesses',
    features: [
      'Unlimited AI credits',
      'Custom templates',
      '24/7 priority support',
      'Team accounts',
      'API access'
    ],
    buttonText: 'Get Agency',
    link: '/pricing?plan=agency',
    highlight: false
  }
];


const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Gradient & Blob */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 opacity-90"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        ></motion.div>
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        ></motion.div>
        <motion.div
          className="absolute top-1/2 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, delay: 1 }}
        ></motion.div>


        <div className="relative z-10 p-4">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight gradient-text mb-4"
          >
            Unleash Your Creativity
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            Generate stunning videos, images, and marketing content with cutting-edge AI, effortlessly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/signup"
              className="btn-primary text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Your Free Trial
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section (Example, can be expanded) */}
      <section className="py-20 bg-gray-900 text-center">
        <h2 className="text-4xl font-bold gradient-text mb-12">Powerful AI Tools at Your Fingertips</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          <motion.div
            className="card p-8 bg-gray-800 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-blue-400 mb-4">Video Generation</h3>
            <p className="text-gray-300">Create stunning social media videos and commercials from simple text prompts.</p>
          </motion.div>
          <motion.div
            className="card p-8 bg-gray-800 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-pink-400 mb-4">Image Creation & Refinement</h3>
            <p className="text-gray-300">Generate unique images or refine existing ones with precise AI control.</p>
          </motion.div>
          <motion.div
            className="card p-8 bg-gray-800 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-purple-400 mb-4">Marketing Content</h3>
            <p className="text-gray-300">Generate catchy captions, engaging blog posts, and persuasive ad copy.</p>
          </motion.div>
        </div>
      </section>

      {/* NEW: Integrated Pricing Section */}
      <section className="py-20 bg-gray-950 text-center">
        <h2 className="text-4xl font-bold gradient-text mb-12">Flexible Plans for Every Creator</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {landingPagePricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              className={`card p-8 rounded-xl shadow-lg flex flex-col justify-between ${
                plan.highlight ? 'bg-gradient-to-br from-blue-700 to-purple-700 transform scale-105 border-4 border-purple-500' : 'bg-gray-800 border border-gray-700'
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: plan.highlight ? 0.2 : 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className={`text-3xl font-bold mb-4 ${plan.highlight ? 'text-white' : 'text-blue-400'}`}>
                  {plan.name}
                </h3>
                <p className={`text-lg mb-4 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                  {plan.description}
                </p>
                <div className={`text-5xl font-extrabold mb-4 ${plan.highlight ? 'text-white' : 'text-purple-400'}`}>
                  {plan.price}
                </div>
                {plan.credits && (
                  <p className={`text-xl font-semibold mb-6 ${plan.highlight ? 'text-green-200' : 'text-green-400'}`}>
                    {plan.credits} AI Credits
                  </p>
                )}
                <ul className={`list-disc list-inside text-left mx-auto max-w-xs mb-8 space-y-2 ${plan.highlight ? 'text-gray-100' : 'text-gray-300'}`}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                </ul>
              </div>
              <Link
                to={plan.link}
                className={`mt-auto w-full py-3 px-6 text-xl rounded-lg font-semibold transition-transform transform hover:scale-105 duration-300 ${
                  plan.highlight ? 'bg-white text-purple-700 hover:text-purple-900 shadow-xl' : 'btn-primary'
                }`}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/pricing"
            className="btn-secondary text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            View All Plans
          </Link>
        </div>
      </section>

      {/* Footer Section (Placeholder) */}
      <footer className="py-10 bg-gray-900 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} AI Marketing Creator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;









