import React, { useState } from 'react';

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // Simulate video generation
    setTimeout(() => {
      setLoading(false);
      alert('Video generation complete!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Video Generator
          </h1>
          <p className="text-gray-400">Create amazing videos with AI</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              rows={4}
              placeholder="Describe the video you want to create..."
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Generating Video...' : 'Generate Video'}
          </button>
        </div>
        
        <div className="text-center mt-8">
          <a href="/dashboard" className="text-purple-400 hover:text-purple-300">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
