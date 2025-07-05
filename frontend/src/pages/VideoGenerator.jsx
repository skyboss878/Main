// src/pages/VideoGenerator.jsx
import React, { useState } from 'react';
import { apiUtils } from '../utils/api'; // Correct import: specifically import apiUtils
import toast from 'react-hot-toast'; // Import toast for notifications
import { Link } from 'react-router-dom'; // For the back to dashboard link

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [videoType, setVideoType] = useState('textToVideo'); // Default to basic text-to-video
  const [duration, setDuration] = useState('short'); // e.g., short, medium, long
  const [voiceover, setVoiceover] = useState('none'); // e.g., none, male, female
  const [music, setMusic] = useState('none'); // e.g., none, upbeat, calm
  const [captions, setCaptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobStatusUrl, setJobStatusUrl] = useState(null); // Store the URL to check job status
  const [error, setError] = useState('');

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a video script or idea.');
      return;
    }

    setLoading(true);
    setJobStatusUrl(null);
    setError('');

    let apiCallFunction;
    let requestData;
    let successMessage = 'Video generation started!';

    // Base options that might apply to various video types
    const baseOptions = { duration, voiceover, music, captions };

    switch (videoType) {
      case 'socialMedia':
        apiCallFunction = apiUtils.generateSocialMediaVideo;
        // Add specific options for social media video (e.g., hashtags, description)
        requestData = { prompt, options: { ...baseOptions, hashtags: '', description: '' } };
        successMessage = 'Social media video generation started!';
        break;
      case 'commercial':
        apiCallFunction = apiUtils.generateCommercialVideo;
        requestData = { prompt, options: baseOptions };
        successMessage = 'Commercial video generation started!';
        break;
      case 'productShowcase':
        apiCallFunction = apiUtils.generateProductShowcase;
        // For product showcase, you'd need an input for `productImages` (e.g., array of URLs/IDs)
        // For now, it's an empty array placeholder.
        requestData = { prompt, productImages: [], options: baseOptions };
        successMessage = 'Product showcase video generation started!';
        break;
      case 'textToVideo': // This maps directly to your /api/text-to-video endpoint
      default:
        apiCallFunction = apiUtils.textToVideo;
        // Ensure backend textToVideo route can handle `options` object if passed
        requestData = { prompt, options: baseOptions };
        successMessage = 'Text-to-video generation started!';
        break;
    }

    try {
      const response = await apiCallFunction(requestData);

      if (response.data && response.data.jobId) {
        toast.success(successMessage);
        setJobStatusUrl(response.data.statusUrl); // Store the status URL
      } else {
        toast.error('Failed to get a job ID from the server. Check backend logs.');
        setError('Server did not return a job ID.');
      }
    } catch (err) {
      console.error('Video generation error:', err);
      // More specific error message from backend if available
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      toast.error(`Video generation failed: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Advanced AI Video Creator
          </h1>
          <p className="text-gray-400 text-lg">Generate high-quality videos for any purpose using powerful AI.</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-8 shadow-2xl backdrop-blur-sm border border-gray-700">
          {/* Video Type Selection */}
          <div className="mb-6">
            <label htmlFor="video-type" className="block text-sm font-medium text-gray-300 mb-2">
              Select Video Type
            </label>
            <select
              id="video-type"
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="textToVideo">Basic Text-to-Video</option>
              <option value="socialMedia">Social Media Video (e.g., Reels, TikToks)</option>
              <option value="commercial">Commercial/Advertisement</option>
              <option value="productShowcase">Product Showcase</option>
            </select>
          </div>

          {/* Video Prompt */}
          <div className="mb-6">
            <label htmlFor="video-prompt" className="block text-sm font-medium text-gray-300 mb-2">
              Video Script / Detailed Prompt
            </label>
            <textarea
              id="video-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={8}
              placeholder="Describe the video you want to create in detail. For example: 'A vibrant 30-second social media reel showing a dog playing fetch in a park during sunset, with energetic background music and text overlay saying 'Unleash the Fun!'.' "
            />
          </div>

          {/* Advanced Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
                Desired Duration
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="short">Short (15-30s)</option>
                <option value="medium">Medium (30-60s)</option>
                <option value="long">Long (1-2 min)</option>
              </select>
            </div>

            <div>
              <label htmlFor="voiceover" className="block text-sm font-medium text-gray-300 mb-2">
                Voiceover Style
              </label>
              <select
                id="voiceover"
                value={voiceover}
                onChange={(e) => setVoiceover(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="none">No Voiceover</option>
                <option value="male-energetic">Male - Energetic</option>
                <option value="female-calm">Female - Calm</option>
                <option value="child-friendly">Child Friendly</option>
                {/* You might dynamically load these from your backend /api/services/voices */}
              </select>
            </div>

            <div>
              <label htmlFor="music" className="block text-sm font-medium text-gray-300 mb-2">
                Background Music
              </label>
              <select
                id="music"
                value={music}
                onChange={(e) => setMusic(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="none">No Music</option>
                <option value="upbeat">Upbeat Pop</option>
                <option value="calm">Calm Ambient</option>
                <option value="cinematic">Cinematic Score</option>
                {/* You might dynamically load these from your backend /api/services/music */}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="captions"
                checked={captions}
                onChange={(e) => setCaptions(e.target.checked)}
                className="h-5 w-5 text-purple-600 rounded border-gray-600 focus:ring-purple-500 bg-gray-700"
              />
              <label htmlFor="captions" className="ml-2 block text-sm font-medium text-gray-300">
                Generate Captions
              </label>
            </div>
            {/* Add more fields for productImages if videoType is productShowcase */}
            {videoType === 'productShowcase' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Product Images (Max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => console.log('Files selected:', e.target.files)} // Implement actual file upload handling
                  className="w-full text-white bg-gray-700 border border-gray-600 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  (Note: File upload needs backend integration for storage.)
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateVideo}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              loading
                ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? 'Generating Video...' : 'Generate Video'}
          </button>

          {error && (
            <div className="mt-4 text-red-400 text-center p-3 border border-red-500 rounded">
              Error: {error}
            </div>
          )}

          {jobStatusUrl && (
            <div className="mt-8 p-6 bg-gray-700 rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold text-gray-200 mb-4 text-center">Video Processing Initiated!</h2>
              <p className="text-gray-300 text-center">
                Your video generation job has been submitted successfully.
              </p>
              <div className="text-center mt-4">
                 <Link
                    to={jobStatusUrl} // Use Link for internal navigation, or a tag for external
                    className="text-purple-400 hover:text-purple-300 underline font-medium"
                 >
                    Click here to track your video's progress
                 </Link>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                (The final video will be available on the job status page once completed. This may take a few minutes.)
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link to="/dashboard" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
