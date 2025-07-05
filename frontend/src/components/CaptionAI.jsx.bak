// src/components/CaptionAI.jsx import React, { useState } from 'react'; import { useNavigate } from 'react-router-dom'; import { motion } from 'framer-motion';

const CaptionAI = () => { const [prompt, setPrompt] = useState(''); const [tone, setTone] = useState('engaging'); const [platform, setPlatform] = useState('Instagram'); const [count, setCount] = useState(5); const [captions, setCaptions] = useState([]); const [hashtags, setHashtags] = useState([]); const [loading, setLoading] = useState(false); const [error, setError] = useState(null); const navigate = useNavigate();

const generateCaptions = async () => { if (!prompt.trim()) return; setLoading(true); setError(null);

try {
  const res = await fetch('/api/caption', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, tone, platform, count })
  });

  const data = await res.json();
  if (data.success) {
    setCaptions(data.data.captions);
    setHashtags(data.data.hashtags);
  } else {
    setError(data.message || 'Failed to generate captions.');
  }
} catch (err) {
  setError('Something went wrong.');
} finally {
  setLoading(false);
}

};

return ( <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-4 max-w-xl mx-auto bg-white rounded-xl shadow-md" > <button className="mb-4 text-blue-600 hover:underline" onClick={() => navigate('/dashboard')} > ← Back to Dashboard </button>

<h2 className="text-xl font-semibold mb-4">🎯 AI Caption Generator</h2>

  <input
    type="text"
    className="w-full border px-3 py-2 mb-3 rounded"
    placeholder="What's your post about?"
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
  />

  <div className="flex flex-wrap gap-2 mb-3">
    <select
      className="border px-2 py-1 rounded"
      value={tone}
      onChange={(e) => setTone(e.target.value)}
    >
      <option value="engaging">Engaging</option>
      <option value="funny">Funny</option>
      <option value="bold">Bold</option>
      <option value="emotional">Emotional</option>
      <option value="salesy">Salesy</option>
    </select>

    <select
      className="border px-2 py-1 rounded"
      value={platform}
      onChange={(e) => setPlatform(e.target.value)}
    >
      <option value="Instagram">Instagram</option>
      <option value="TikTok">TikTok</option>
      <option value="Facebook">Facebook</option>
      <option value="Twitter">Twitter</option>
      <option value="LinkedIn">LinkedIn</option>
    </select>

    <input
      type="number"
      className="w-20 border px-2 py-1 rounded"
      value={count}
      onChange={(e) => setCount(e.target.value)}
      min="1"
      max="20"
    />
  </div>

  <button
    onClick={generateCaptions}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    disabled={loading}
  >
    {loading ? 'Generating...' : 'Generate Captions'}
  </button>

  {error && <p className="text-red-500 mt-2">{error}</p>}

  {captions.length > 0 && (
    <div className="mt-4">
      <h3 className="font-bold mb-2">📝 Captions</h3>
      <ul className="list-disc pl-5 space-y-2">
        {captions.map((caption, idx) => (
          <li key={idx} className="flex justify-between items-start gap-2">
            <span>{caption}</span>
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={() => navigator.clipboard.writeText(caption)}
            >
              Copy
            </button>
          </li>
        ))}
      </ul>
    </div>
  )}

  {hashtags.length > 0 && (
    <div className="mt-4">
      <h3 className="font-bold mb-2">🏷️ Hashtags</h3>
      <p className="text-gray-700">{hashtags.join(' ')}</p>
    </div>
  )}
</motion.div>

); };

export default CaptionAI;


