// shared/routes.js
exports.API_ROUTES = {
  AUTH: '/api/auth',
  AI: '/api/ai', // Generic AI services like generate-text, generate-image (if not specific route)
  BLOG: '/api/blog',
  CAPTION: '/api/caption',
  TEXT_TO_IMAGE: '/api/text-to-image',
  TEXT_TO_VIDEO: '/api/text-to-video',
  IMAGE_TO_IMAGE: '/api/image-to-image',
  VOICE: '/api/voice',
  COMMERCIAL: '/api/commercial', // Base for commercial content (or specific endpoint)
  FLYER: '/api/flyer',
  FOOD_PROMOS: '/api/food-promos',
  SOCIAL_MEDIA: '/api/social-media', // For general social media posts
  SERVICES: '/api/services', // For fetching AI service options (e.g. voices)
  PAYMENTS: '/api/payments',
  TOURS: '/api/tours',
  VIDEOS: '/api/videos', // Base route for video generation types (social-media, commercial, product-showcase)
  USER: '/api/user', // For user-specific data like credits
  JOBS: '/api/jobs', // NEW: This route is for job status polling
  REAL_ESTATE: '/api/real-estate' // Assuming this will be used for Real Estate Tours
};
