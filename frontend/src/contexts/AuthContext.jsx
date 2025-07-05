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
    if (!token || !user?.id) return;

    try {
      const response = await apiUtils.getCredits();
      if (response.data.success) {
        setUser(prev => ({ ...prev, credits: response.data.data.credits }));
      } else {
        console.error('Failed to fetch user credits:', response.data.message);
      }
    } catch (err) {
      console.error('Error fetching user credits:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleAuthError('Session expired. Please log in again.');
      }
    }
  };

  // Centralized auth error handling
  const handleAuthError = (message = 'Authentication failed') => {
    logout();
    toast.error(message);
  };

  // Set user data and token after successful authentication
  const login = (newToken, userData) => {
    try {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData); // userData should include { id, username, email, credits }
      toast.success('Logged in successfully!');
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Failed to save login data');
    }
  };

  // API call for login with credentials
  const loginWithCredentials = async (formData) => {
    try {
      const response = await apiUtils.login(formData);
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data.data;
        
        // Use the existing login function to set state
        login(newToken, userData);
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Login successful'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Login failed'
        };
      }
    } catch (err) {
      console.error('Login with credentials error:', err);
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Network error occurred';
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  // API call for signup
  const signup = async (formData) => {
    try {
      const response = await apiUtils.signup(formData);
      
      if (response.data.success) {
        // Some apps auto-login after signup, others require separate login
        // Check if your API returns a token on signup
        if (response.data.data.token && response.data.data.user) {
          const { token: newToken, user: userData } = response.data.data;
          login(newToken, userData);
        }
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Account created successfully'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Signup failed'
        };
      }
    } catch (err) {
      console.error('Signup error:', err);
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Network error occurred';
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      toast('Logged out.', { icon: '👋' });
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear state even if localStorage fails
      setToken(null);
      setUser(null);
    }
  };

  // Verify token and get user data
  const verifyToken = async (tokenToVerify) => {
    try {
      // Option 1: If you have a dedicated verify endpoint
      // const response = await apiUtils.verifyToken();

      // Option 2: Use getCredits as a way to verify token and get user data
      const response = await apiUtils.getCredits();

      if (response.data.success) {
        const userData = response.data.data;

        // Ensure we have all required user fields
        if (userData.id && userData.username && userData.email !== undefined) {
          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            credits: userData.credits || 0
          });
          return true;
        } else {
          console.error('Incomplete user data received:', userData);
          return false;
        }
      } else {
        console.error('Token verification failed:', response.data.message);
        return false;
      }
    } catch (err) {
      console.error('Token verification error:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token is invalid or expired
        return false;
      }
      // For other errors, we might want to retry or handle differently
      throw err;
    }
  };

  // Auto-login on app load if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const isValid = await verifyToken(token);
          if (!isValid) {
            handleAuthError('Session expired. Please log in again.');
          }
        } catch (err) {
          console.error('Auth initialization failed:', err);
          // For network errors, we might want to keep the token and retry later
          // For auth errors, we should logout
          if (err.response?.status === 401 || err.response?.status === 403) {
            handleAuthError('Authentication failed');
          } else {
            // Network error - keep token but show warning
            toast.error('Unable to verify session. Please check your connection.');
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []); // Remove token dependency to avoid infinite loops

  // Update user credits (can be called by components)
  const updateUserCredits = (newCredits) => {
    setUser(prev => prev ? { ...prev, credits: newCredits } : null);
  };

  // Provide the user, token, login, logout, and other functions to children
  const authContextValue = {
    user,
    token,
    login, // Internal function for setting auth state
    loginWithCredentials, // API call function for login
    signup, // API call function for signup
    logout,
    fetchUserCredits,
    updateUserCredits, // Direct way to update credits without API call
    isAuthenticated: !!user && !!token,
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
