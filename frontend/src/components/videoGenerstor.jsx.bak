import React, { useState } from 'react';

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://192.168.1.26:5000/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      setVideo(data.url || 'placeholder-video.mp4');
    } catch (err) {
      setError(err.message || 'Failed to generate video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Video Generator
          </h1>
          <p className="text-xl text-gray-300">
            Transform your ideas into professional marketing videos
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-lg font-semibold mb-3">
                Video Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to create... (e.g., 'A professional product showcase for a tech startup with modern animations')"
                className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Video...</span>
                </div>
              ) : (
                'Generate Video'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}

          {video && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Generated Video</h3>
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <video 
                  src={video} 
                  controls 
                  className="w-full h-auto"
                  poster="/api/placeholder/640/360"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4 flex space-x-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors">
                  Download Video
                </button>
                <button className="flex-1 border border-gray-600 hover:border-gray-500 px-4 py-2 rounded-lg font-semibold transition-colors">
                  Share Video
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/dashboard" 
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
