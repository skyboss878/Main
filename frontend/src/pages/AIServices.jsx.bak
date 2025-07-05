// src/pages/AIServices.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Added motion import for consistency

const AIServices = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Unused, but kept for consistency

  const services = [
    {
      id: 'caption-generator',
      title: 'Caption Generator',
      description: 'Generate engaging captions for your social media posts',
      icon: '✍️',
      route: '/create/caption-generator'
    },
    {
      id: 'voice-generator',
      title: 'Voice Generator',
      description: 'Convert text to natural-sounding speech',
      icon: '🎤',
      route: '/create/voice-generator'
    },
    {
      id: 'text-to-image',
      title: 'Text to Image',
      description: 'Create stunning images from text descriptions',
      icon: '🎨',
      route: '/create/text-to-image'
    },
    {
      id: 'text-to-video',
      title: 'Text to Video',
      description: 'Generate videos from text prompts',
      icon: '🎬',
      route: '/create/text-to-video'
    },
    {
      id: 'image-refinement', // Added image refinement to services list
      title: 'Image Refinement',
      description: 'Refine and transform existing images with AI',
      icon: '✨',
      route: '/create/image-refinement'
    },
    {
        id: 'social-media-creator', // Added social media creator
        title: 'Social Media Video',
        description: 'Generate viral videos for social platforms',
        icon: '📱',
        route: '/create/social-media-creator'
    },
    {
        id: 'commercial-creator', // Added commercial creator
        title: 'Commercial Video',
        description: 'Create professional commercial advertisements',
        icon: '📺',
        route: '/create/create-commercial'
    },
    {
        id: 'blog-creator', // Added blog creator
        title: 'Blog Post Creator',
        description: 'Generate full blog posts from a topic',
        icon: '📝',
        route: '/create/blog-creator'
    },
    // Add other services here as you implement their pages
    // { id: 'flyer-generator', title: 'Flyer Generator', description: 'Design custom flyers with AI', icon: '📄', route: '/create/flyer-generator' },
    // { id: 'food-promos', title: 'Food Promos', description: 'Generate appetizing food promotions', icon: '🍔', route: '/create/food-promos' },
    // { id: 'tour-creator', title: 'Tour Creator', description: 'Create virtual tours', icon: '🗺️', route: '/create/tour-creator' },
    // { id: 'real-estate-tour', title: 'Real Estate Tour', description: 'Generate real estate virtual tours', icon: '🏠', route: '/create/real-estate-tour' },
    // { id: 'restaurant-promo-creator', title: 'Restaurant Promo', description: 'Create promos for restaurants', icon: '🍽️', route: '/create/restaurant-promo-creator' },
  ];

  const handleServiceClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 text-white"> {/* Adjusted background and text color */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4"> {/* Used gradient-text */}
            AI Services
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto"> {/* Adjusted text color */}
            Explore our comprehensive suite of AI-powered tools designed to enhance your creative workflow.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {services.map((service) => (
            <motion.div // Added motion.div for animation
              key={service.id}
              onClick={() => handleServiceClick(service.route)}
              className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg hover:border-blue-500 transition duration-300 cursor-pointer p-6 border border-gray-700" // Adjusted styling
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-100"> {/* Adjusted text color */}
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4"> {/* Adjusted text color */}
                  {service.description}
                </p>
                <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"> {/* Adjusted button styling */}
                  Try Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-6 py-3 border border-gray-700 rounded hover:bg-gray-700 transition text-gray-300 hover:text-white" // Adjusted styling
          >
            ← Back to Dashboard
          </button>
        </div>

      </div> {/* closing inner container */}
    </div> /* closing outer wrapper */
  );
};

export default AIServices;
