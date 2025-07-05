// src/services/apiService.js (Corrected state)
import axios from 'axios';

const api = axios.create({
  // Point to the root of your backend server, WITHOUT the /api prefix.
  // The API_ROUTES in utils/api.js already include '/api'.
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming JWT token is stored here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling global errors, e.g., token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Redirecting to login...');
      // You might want to dispatch a logout action here if using Redux/Context for auth
      // For now, a simple redirect:
      // window.location.href = '/login'; // This would force a full page reload to login
      // Or, if using react-router-dom, you'd need history or navigate object:
      // toast.error("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default api;


