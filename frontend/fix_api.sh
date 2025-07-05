#!/bin/bash

# Script to fix all API endpoints in your React app
# Run this from your frontend directory

echo "🔧 Fixing API endpoints in React components..."

# Create the api utility file
mkdir -p src/utils
cat > src/utils/api.js << 'EOF'
// API Configuration for Frontend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

// API Configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
};

// API Helper Functions
export const apiCall = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle different response types
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType && contentType.includes('audio/')) {
      return await response.blob();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Specific API endpoints
export const api = {
  // AI Services
  generateCaption: (input) => apiCall('/ai-services/caption', {
    method: 'POST',
    body: JSON.stringify({ input })
  }),

  generateImage: (prompt, options = {}) => apiCall('/ai-services/image', {
    method: 'POST',
    body: JSON.stringify({ prompt, ...options })
  }),

  generateVoice: (text, options = {}) => apiCall('/ai-services/voice', {
    method: 'POST',
    body: JSON.stringify({ text, ...options })
  }),

  generateVideo: (prompt, options = {}) => apiCall('/text-to-video', {
    method: 'POST',
    body: JSON.stringify({ prompt, ...options })
  }),

  // Other services
  generateBlog: (data) => apiCall('/blog', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  generateFlyer: (data) => apiCall('/flyer', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  generateCommercial: (data) => apiCall('/commercial', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  generateFoodPromo: (data) => apiCall('/foodpromo', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  processImageToImage: (data) => apiCall('/image-to-image', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Health check
  healthCheck: () => apiCall('/health'),

  // Test endpoint
  test: () => apiCall('/test')
};

export default api;
EOF

echo "✅ Created src/utils/api.js"

# Fix CaptionGenerator.jsx
sed -i "s|const response = await fetch('/api/ai-services/caption'|import { api } from '../utils/api';\n\n// In the component:\nconst response = await api.generateCaption(input); // Remove this line\n// Replace the entire fetch call with:\nconst data = await api.generateCaption(input);\nsetResult(data.data.caption)|g" src/pages/CaptionGenerator.jsx

# Fix VoiceGenerator.jsx
sed -i "s|const response = await fetch('/api/ai-services/voice'|const data = await api.generateVoice(text, voiceOptions);\nsetAudioData(data)|g" src/pages/VoiceGenerator.jsx

# Fix TextToVideo.jsx - replace localhost URLs
sed -i "s|http://localhost:5000/api/text-to-video|/api/text-to-video|g" src/pages/TextToVideo.jsx

# Fix other pages to use relative URLs
sed -i "s|https://ai-studio-backend-2.onrender.com/api/|/api/|g" src/pages/BlogCreator.jsx
sed -i "s|https://ai-studio-backend-2.onrender.com/api/|/api/|g" src/pages/FlyerGenerator.jsx
sed -i "s|https://ai-studio-backend-2.onrender.com/api/|/api/|g" src/pages/ImageToImage.jsx
sed -i "s|https://ai-studio-backend-2.onrender.com/api/|/api/|g" src/pages/CreateCommercial.jsx
sed -i "s|https://ai-studio-backend-2.onrender.com/api/|/api/|g" src/pages/FoodPromos.jsx

echo "✅ Fixed API endpoints in all React components"

# Create/update .env file
cat > .env << 'EOF'
# Frontend Environment Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_NODE_ENV=development
VITE_ENABLE_DEBUG=true
VITE_APP_NAME="AI Marketing Creator"
VITE_APP_VERSION="1.0.0"
EOF

echo "✅ Created .env file"

echo "🎉 All API endpoints fixed!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure your backend is running on port 5000"
echo "2. Run: npm run dev"
echo "3. Test your AI services!"
echo ""
echo "🔧 Your API calls now go through the Vite proxy:"
echo "   Frontend (port 3000) → Vite Proxy → Backend (port 5000)"
