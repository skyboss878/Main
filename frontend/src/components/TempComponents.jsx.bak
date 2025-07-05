
 // src/components/TempComponents.jsx
// Temporary replacement components for App.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Landing from '../pages/Landing';

// Replace TempLanding with actual Landing component
export const TempLanding = () => <Landing />;

// Temporary Login Page
export const TempLogin = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
    <div className="max-w-md w-full space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="mt-2 text-gray-400">Sign in to your account</p>
      </div>
      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              // FIX: Completed the className attribute
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              // FIX: Completed the className attribute
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-gray-300">
              Remember me
            </label>
          </div>
          <div>
            <a href="#" className="font-medium text-purple-400 hover:text-purple-300">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <Link
            to="/dashboard"
            // FIX: Completed the className attribute
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Sign in
          </Link>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-400">Don't have an account? </span>
          <Link to="/signup" className="font-medium text-purple-400 hover:text-purple-300">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  </div>
);

// Temporary Signup Page
export const TempSignup = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create an Account
          </h2>
          <p className="mt-2 text-gray-400">Join us and start your journey</p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
              <input id="username" name="username" type="text" required className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Choose a username" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
              <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md placeholder-gray-400"
