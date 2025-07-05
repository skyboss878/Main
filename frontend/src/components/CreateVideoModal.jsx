// src/components/CreateVideoModal.jsx
import React, { useState } from 'react';

const CreateVideoModal = ({ onClose }) => {
  const [script, setScript] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // TODO: Call backend to start generation
    setTimeout(() => {
      alert('Video generation started!');
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Create Your Viral Video
        </h2>
        <textarea
          className="w-full border p-3 rounded mb-4"
          placeholder="Enter your video script or message..."
          rows={4}
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          {loading ? 'Generating...' : 'Generate Video'}
        </button>
      </div>
    </div>
  );
};

export default CreateVideoModal;
