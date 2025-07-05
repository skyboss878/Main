import React, { useState } from 'react';
import axios from 'axios';

const CaptionGenerator = () => {
  const [topic, setTopic] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateCaptions = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setCaption('');
      setHashtags('');

try {
  const response = await axios.post("/api/caption", { prompt });
  if (response.data) {
    setCaption(response.data.caption || "");
    setHashtags(response.data.hashtags || "");
  } else {
    setError("No caption returned from server.");
  }
} catch (err) {
  setError("Caption generation failed.");
  console.error(err);
}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">📝 Viral Caption Generator</h1>
        <p className="text-sm text-gray-600 mb-4">
          Generate scroll-stopping captions and hashtag combos that boost engagement.
        </p>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your video or post topic..."
          className="w-full p-4 border rounded-md mb-4 focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={generateCaptions}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
        >
          {loading ? 'Generating...' : 'Generate Captions'}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {caption && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">📢 Caption</h2>
            <p className="bg-gray-100 rounded-md p-4">{caption}</p>
          </div>
        )}

        {hashtags && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">🏷️ Hashtags</h2>
            <p className="bg-gray-100 rounded-md p-4">{hashtags}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptionGenerator;
