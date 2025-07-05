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
