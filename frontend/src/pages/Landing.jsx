import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PlayCircleIcon,
  SparklesIcon,
  CameraIcon,
  ShareIcon,
  CheckIcon,
  StarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid'

import Header from '../components/Header'

const features = [
  {
    icon: CameraIcon,
    title: '360° Virtual Tours',
    description: 'Create immersive, scrollable tours to showcase spaces like restaurants, events, and businesses.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: PlayCircleIcon,
    title: 'AI Video Generation',
    description: 'Convert text or images into viral videos for social media, ads, and promotions.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: ShareIcon,
    title: 'Social Media Content',
    description: 'Generate scroll-stopping posts, captions, and hashtags in seconds.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: SparklesIcon,
    title: 'AI Flyers & Promos',
    description: 'Auto-design food promos, flyers, and commercial ads using text-based prompts.',
    color: 'from-orange-500 to-red-500'
  }
]

const pricingPlans = [
  {
    name: '3-Day Free Trial',
    price: '$0',
    period: '',
    description: 'Try all features for free. No credit card needed.',
    features: [
      'All AI tools unlocked',
      'Watermarked downloads',
      'Text to video, image to video',
      'Voiceovers, social captions'
    ],
    popular: false
  },
  {
    name: 'Pro Creator',
    price: '$19.99',
    period: '/month',
    description: 'For creators, marketers & influencers',
    features: [
      'HD videos & promos',
      'Remove watermark',
      '360° Virtual Tours',
      'Flyers, Voiceovers, Social Posts',
      'Auto-upload to TikTok, IG, YT Shorts'
    ],
    popular: true
  },
  {
    name: 'Agency',
    price: '$49.99',
    period: '/month',
    description: 'Designed for teams, agencies, and brands',
    features: [
      'Unlimited HD exports',
      'Team collaboration access',
      'Priority rendering & support',
      'Extended API usage',
      'White-label content (no branding)'
    ],
    popular: false
  }
]

const Landing = () => {
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {/* HERO */}
      <section className="pt-24 pb-16 text-center max-w-5xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Build Viral AI Content
          <span className="block bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
            With Just Your Phone
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-400 mb-8"
        >
          AI-Powered Video, Virtual Tours, Commercials, Promos & Social Content — No Laptop Needed.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            to="/signup"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-lg font-bold text-lg"
          >
            Start Free Trial
          </Link>
          <Link
            to="/login"
            className="border border-gray-600 hover:border-gray-400 px-8 py-4 rounded-lg font-semibold text-gray-300"
          >
            Already a Member?
          </Link>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${feature.color} p-6 rounded-xl shadow-lg flex space-x-4 items-start`}
            >
              <feature.icon className="w-10 h-10 text-white" />
              <div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-white/90 mt-1">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-xl text-gray-300">Choose the plan that fits your content goals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative p-8 rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900 to-black shadow-xl"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-sm font-semibold rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className="block text-center py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {plan.price === '$0' ? 'Start Free Trial' : 'Choose Plan'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing














