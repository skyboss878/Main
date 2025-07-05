import React, { useState } from 'react';

const TextToImage = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedImage('https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=512&h=512&fit=crop');
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🖼️ Text to Image Generator</h1>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe the image you want to create:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful sunset over mountains with a lake in the foreground..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>

          {generatedImage && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Generated Image:</h3>
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Features Overview */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">💡 Why Use Our AI Image Generator?</h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Whether you're a content creator, brand, or just exploring—our AI gives you studio-quality images in seconds.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">🎨 AI-Powered Creativity</h3>
              <p className="text-gray-600">Turn plain text into vibrant, high-resolution visuals using the latest AI models.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-purple-600">📚 Built-in Prompt Ideas</h3>
              <p className="text-gray-600">Stuck for ideas? Use viral starter prompts to spark your imagination.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-green-600">🗂️ Save & Manage Library</h3>
              <p className="text-gray-600">Your creations are auto-saved in a personal image library (stored in-browser).</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-pink-600">📱 Mobile-Optimized</h3>
              <p className="text-gray-600">Fast and responsive experience built for mobile creators on the go.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-yellow-500">📤 Share Anywhere</h3>
              <p className="text-gray-600">Share instantly to Instagram, TikTok, or download and use in your next project.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-indigo-500">⚡ Lightning Fast API</h3>
              <p className="text-gray-600">Optimized backend with real-time feedback and near-instant image delivery.</p>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <a href="/dashboard" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default TextToImage;
