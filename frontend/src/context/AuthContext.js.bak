// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiUtils } from '../utils/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, username, email, credits }
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Function to update user data (e.g., after credit deduction/top-up)
  const fetchUserCredits = async () => {
    if (token && user?.id) {
      try {
        const response = await apiUtils.getCredits();
        if (response.data.success) {
          setUser(prev => ({ ...prev, credits: response.data.data.credits }));
        } else {
          console.error('Failed to fetch user credits:', response.data.message);
        }
      } catch (err) {
        console.error('Error fetching user credits:', err);
        // If token is invalid, log out
        if (err.response?.status === 401) {
          logout();
          toast.error('Session expired. Please log in again.');
        }
      }
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData); // userData should include { id, username, email, credits }
    toast.success('Logged in successfully!');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast('Logged out.', { icon: '👋' });
  };

  // Auto-login on app load if token exists
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // You'd need a backend route like /api/auth/verify-token that returns user data
          // For now, let's assume the token is valid and fetch user credits directly
          const response = await apiUtils.getCredits(); // This will use the auth middleware
          if (response.data.success) {
            setUser({
              id: response.data.data.id,
              username: response.data.data.username,
              email: response.data.data.email,
              credits: response.data.data.credits
            });
          } else {
            logout(); // Token might be invalid or user not found
          }
        } catch (err) {
          console.error('Token verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  // Provide the user, token, login, logout, and fetchUserCredits to children
  const authContextValue = {
    user,
    token,
    login,
    logout,
    fetchUserCredits, // Allow components to refresh credits
    isAuthenticated: !!user,
    isLoading: loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for convenience
export const useAuth = () => {
  return useContext(AuthContext);
};
