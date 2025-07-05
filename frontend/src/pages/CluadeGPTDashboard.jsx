import React, { useState, useRef } from 'react';

const CLAUDE_MODELS = [
  { label: 'Claude Sonnet 4', value: 'claude-sonnet-4' },
  { label: 'Claude Opus 4', value: 'claude-opus-4' },
];

export default function ClaudeGPTDashboard() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState(CLAUDE_MODELS[0].value);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef('');

  // Check if puter is available (loaded in index.html or public)
  const hasPuter = typeof window !== 'undefined' && window.puter && window.puter.ai;

  // Function to call Puter.js streaming API
  async function fetchPuterStreaming() {
    setIsLoading(true);
    setResponse('');
    responseRef.current = '';

    try {
      const stream = await window.puter.ai.chat(prompt, { model, stream: true });

      for await (const part of stream) {
        responseRef.current += part?.text || '';
        setResponse(responseRef.current);
      }
    } catch (err) {
      setResponse(`⚠️ Error from Puter: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Fallback backend call (adjust URL as needed)
  async function fetchBackend() {
    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.result);
      } else {
        setResponse('❌ Backend AI error');
      }
    } catch (err) {
      setResponse(`⚠️ Backend fetch error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Main submit handler - uses puter if available, else backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return alert('Please enter a prompt.');

    if (hasPuter) {
      await fetchPuterStreaming();
    } else {
      await fetchBackend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Claude AI Chat Studio</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <label htmlFor="model" className="block mb-2 font-semibold text-gray-700">
          Select Claude Model:
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          {CLAUDE_MODELS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <label htmlFor="prompt" className="block mb-2 font-semibold text-gray-700">
          Your Prompt:
        </label>
        <textarea
          id="prompt"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your text prompt here..."
          className="w-full p-3 mb-4 border rounded resize-y"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      <div className="whitespace-pre-wrap p-4 border rounded bg-white min-h-[150px] text-gray-800 font-mono">
        {response || 'Your AI response will appear here...'}
      </div>
    </div>
  );
}
