import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';


import { useAuth } from '../contexts/AuthContext';

// Constants moved outside component to prevent re-creation
const RECENT_PROJECTS = [
  // Start with empty array for new users - projects will be added when users create content
];

const CREATOR_TOOLS = [
  {
    id: 'video-generator',
    title: 'Video Generator',
    description: 'Create stunning AI-powered videos from text prompts',
    icon: '🎬',
    route: '/create/video-generator',
    gradient: 'from-purple-500 to-pink-600',
    category: 'Video',
    isNew: false,
    isPremium: false
  },
  {
    id: 'social-media-creator',
    title: 'Social Media Creator',
    description: 'Generate viral social media posts and content',
    icon: '📱',
    route: '/create/social-media-creator',
    gradient: 'from-blue-500 to-cyan-600',
    category: 'Social',
    isNew: true,
    isPremium: false
  },
  {
    id: 'tour-creator',
    title: '360° Tour Creator',
    description: 'Create immersive virtual tours for businesses',
    icon: '🏠',
    route: '/create/tour-creator',
    gradient: 'from-green-500 to-emerald-600',
    category: 'Tour',
    isNew: false,
    isPremium: true
  },
  {
    id: 'restaurant-promo-creator',
    title: 'Restaurant Promo Creator',
    description: 'Design mouth-watering food promotions and ads',
    icon: '🍽️',
    route: '/create/restaurant-promo-creator',
    gradient: 'from-orange-500 to-red-600',
    category: 'Food',
    isNew: false,
    isPremium: false
  },
  {
    id: 'blog-creator',
    title: 'Blog Creator',
    description: 'Write engaging blog posts with AI assistance',
    icon: '✍️',
    route: '/create/blog-creator',
    gradient: 'from-indigo-500 to-purple-600',
    category: 'Content',
    isNew: false,
    isPremium: false
  },
  {
    id: 'flyer-generator',
    title: 'Flyer Generator',
    description: 'Design professional flyers and posters instantly',
    icon: '📄',
    route: '/create/flyer-generator',
    gradient: 'from-teal-500 to-blue-600',
    category: 'Design',
    isNew: false,
    isPremium: false
  },
  {
    id: 'text-to-image',
    title: 'Text to Image',
    description: 'Generate stunning images from text descriptions',
    icon: '🖼️',
    route: '/create/text-to-image',
    gradient: 'from-pink-500 to-rose-600',
    category: 'AI',
    isNew: false,
    isPremium: true
  },
  {
    id: 'food-promos',
    title: 'Food Promos',
    description: 'Create delicious food advertisements and menus',
    icon: '🍕',
    route: '/create/food-promos',
    gradient: 'from-yellow-500 to-orange-600',
    category: 'Food',
    isNew: false,
    isPremium: false
  },
  {
    id: 'real-estate-tour',
    title: 'Real Estate Tour',
    description: 'Showcase properties with virtual tours and listings',
    icon: '🏡',
    route: '/create/real-estate-tour',
    gradient: 'from-emerald-500 to-teal-600',
    category: 'Real Estate',
    isNew: false,
    isPremium: true
  },
  {
    id: 'create-commercial',
    title: 'Create Commercial',
    description: 'Produce professional TV and web commercials',
    icon: '📺',
    route: '/create/create-commercial',
    gradient: 'from-violet-500 to-purple-600',
    category: 'Video',
    isNew: false,
    isPremium: true
  },
  {
    id: 'text-to-video',
    title: 'Text to Video',
    description: 'Convert text scripts into engaging videos',
    icon: '🎥',
    route: '/create/text-to-video',
    gradient: 'from-cyan-500 to-blue-600',
    category: 'Video',
    isNew: true,
    isPremium: false
  },
  {
    id: 'image-to-image',
    title: 'Image to Image',
    description: 'Transform and enhance images with AI',
    icon: '🔄',
    route: '/create/image-to-image',
    gradient: 'from-lime-500 to-green-600',
    category: 'AI',
    isNew: false,
    isPremium: false
  }
];

const CATEGORIES = ['All', 'Video', 'Social', 'Food', 'Design', 'AI', 'Tour', 'Content', 'Real Estate'];

const PERFORMANCE_COLORS = {
  excellent: 'bg-green-100 text-green-800 border-green-200',
  viral: 'bg-pink-100 text-pink-800 border-pink-200',
  good: 'bg-blue-100 text-blue-800 border-blue-200',
  average: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

// Custom hooks for production
const useAnimatedStats = (userStats) => {
  const [animatedStats, setAnimatedStats] = useState({
    videos: 0,
    views: 0,
    hours: 0,
    revenue: 0,
    subscribers: 0
  });

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const increment = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);

      setAnimatedStats({
        videos: Math.floor(userStats.videosCreated * progress),
        views: Math.floor(userStats.totalViews * progress),
        hours: Math.floor(userStats.hoursGenerated * progress * 10) / 10,
        revenue: Math.floor(userStats.revenue * progress),
        subscribers: Math.floor(userStats.subscribers * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, [userStats]);

  return animatedStats;
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry for the inconvenience. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Production-ready user stats starting from zero
  const userStats = {
    videosCreated: 0,
    totalViews: 0,
    hoursGenerated: 0.0,
    revenue: 0,
    subscribers: 0
  };

  const animatedStats = useAnimatedStats(userStats);

  // Handle tool navigation with loading state
  const handleToolClick = useCallback((tool) => {
    if (tool.isPremium && !user?.isPremium) {
      navigate('/upgrade');
      return;
    }

    setIsLoading(true);
    
    // Add a small delay to show loading state
    setTimeout(() => {
      navigate(tool.route);
      setIsLoading(false);
    }, 300);
  }, [navigate, user]);

  // Filter tools based on category and search
  const filteredTools = useMemo(() => {
    return CREATOR_TOOLS.filter(tool => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Handle logout
  const handleLogout = () => {
    // Add logout functionality here
    navigate('/login');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/settings')}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Settings"
                >
                  ⚙️
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  title="Logout"
                >
                  Logout
                </button>
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  Welcome, {user?.name || user?.email?.split('@')[0] || 'Creator'}!
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Message for New Users */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-2">🎉 Welcome to Your Creator Studio!</h2>
            <p className="text-purple-100 mb-4">
              Start creating amazing content with our AI-powered tools. Choose from videos, flyers, social media posts, and more!
            </p>
            <button
              onClick={() => setSelectedCategory('Video')}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Start Creating →
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">🎬</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Videos Created</p>
                  <p className="text-2xl font-bold text-gray-900">{animatedStats.videos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👀</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{animatedStats.views.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Content Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{animatedStats.hours}h</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${animatedStats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Followers</p>
                  <p className="text-2xl font-bold text-gray-900">{animatedStats.subscribers.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search creator tools... (videos, flyers, social media, etc.)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Creator Tools Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🚀 Creator Tools</h2>
            {isLoading && <LoadingSpinner />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1 group relative"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    {tool.icon}
                  </div>

                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {tool.title}
                    </h3>
                    <div className="flex space-x-1">
                      {tool.isNew && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                      {tool.isPremium && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Pro
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{tool.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTools.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <span className="text-4xl mb-4 block">🔍</span>
                <p>No tools found matching your search.</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-purple-600 hover:text-purple-700 mt-2"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Getting Started Section for New Users */}
          {RECENT_PROJECTS.length === 0 && (
            <div className="mb-8">
              <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
                <span className="text-6xl mb-4 block">🎨</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Create Something Amazing?</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Your recent projects will appear here once you start creating. Choose from our powerful AI tools to generate videos, flyers, social media content, and more!
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleToolClick(CREATOR_TOOLS.find(t => t.id === 'video-generator'))}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Create Your First Video
                  </button>
                  <button
                    onClick={() => handleToolClick(CREATOR_TOOLS.find(t => t.id === 'flyer-generator'))}
                    className="bg-white text-purple-600 border border-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                  >
                    Design a Flyer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Projects */}
          {RECENT_PROJECTS.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">📁 Recent Projects</h2>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RECENT_PROJECTS.map(project => (
                  <div key={project.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-20 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTlBM0FFIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjEyIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">{project.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{project.type} • {project.duration}</p>
                            <p className="text-xs text-gray-500">{project.createdAt}</p>
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            <span className={`text-xs px-2 py-1 rounded-full border ${PERFORMANCE_COLORS[project.performance]}`}>
                              {project.performance}
                            </span>
                            <span className="text-xs text-gray-500">
                              {project.views.toLocaleString()} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;












