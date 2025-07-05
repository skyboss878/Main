// src/pages/SocialMediaCreator.jsx
import React, { useState, useEffect, useRef } from 'react';
import { apiUtils } from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Mock Music Options (replace with actual music API integration later if needed)
const MOCK_MUSIC_OPTIONS = [
  { id: 'upbeat_pop', name: 'Upbeat Pop' },
  { id: 'inspirational_ambient', name: 'Inspirational Ambient' },
  { id: 'energetic_electronic', name: 'Energetic Electronic' },
  { id: 'no_music', name: 'No Music' },
];

const SocialMediaCreator = () => {
  // Core Video Generation State
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30); // Video duration in seconds
  const [videoStyle, setVideoStyle] = useState('social'); // 'social', 'commercial', 'product'

  // Voiceover Options
  const [addVoiceover, setAddVoiceover] = useState(true);
  const [voiceoverText, setVoiceoverText] = useState(''); // If user provides custom text
  const [selectedVoice, setSelectedVoice] = useState('pNInz6obpgDQGcFmaJgB'); // Default Bella
  const [availableVoices, setAvailableVoices] = useState([]);

  // Music Options
  const [addMusic, setAddMusic] = useState(true);
  const [selectedMusic, setSelectedMusic] = useState('upbeat_pop'); // Default music track

  // Text Overlay/Caption Options
  const [addCaptions, setAddCaptions] = useState(true);
  const [captionStyle, setCaptionStyle] = useState('dynamic'); // e.g., 'dynamic', 'classic', 'minimal'
  const [customCaptions, setCustomCaptions] = useState(''); // If user provides specific captions

  // Hashtag Options
  const [generateHashtags, setGenerateHashtags] = useState(true);
  const [hashtagCount, setHashtagCount] = useState(15);

  // Description Options
  const [generateDescription, setGenerateDescription] = useState(true);
  const [descriptionTone, setDescriptionTone] = useState('engaging'); // e.g., 'engaging', 'informative', 'humorous'

  // Job/Output State
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState('idle'); // idle, enqueued, active, completed, failed
  const [jobProgress, setJobProgress] = useState(0);
  const [videoData, setVideoData] = useState(null); // Final result from job
  const [loading, setLoading] = useState(false); // Overall loading state for form submission
  const [error, setError] = useState('');

  // AI Idea Generation State
  const [ideaKeywords, setIdeaKeywords] = useState('');
  const [ideaTone, setIdeaTone] = useState('creative');
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [ideaError, setIdeaError] = useState('');

  // Polling mechanism
  const pollingIntervalRef = useRef(null);

  // Fetch available voices on component mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await apiUtils.getAvailableVoices();
        if (response.data.success && response.data.data.voices) {
          setAvailableVoices(response.data.data.voices);
          if (response.data.data.voices.length > 0) {
            setSelectedVoice(response.data.data.voices[0].id);
          }
        } else {
          console.warn('Failed to fetch voices from backend, using hardcoded fallback.');
          setAvailableVoices([
            { id: 'pNInz6obpgDQGcFmaJgB', name: 'Bella (Female, Energetic)', gender: 'Female', accent: 'American' },
            { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Daniel (Male, Professional)', gender: 'Male', accent: 'American' },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch available voices:', err);
        setAvailableVoices([
            { id: 'pNInz6obpgDQGcFmaJgB', name: 'Bella (Female, Energetic)', gender: 'Female', accent: 'American' },
            { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Daniel (Male, Professional)', gender: 'Male', accent: 'American' },
        ]);
        toast.error('Could not load voice options. Please refresh.');
      }
    };
    fetchVoices();
  }, []);

  // Polling effect for video generation job
  useEffect(() => {
    if (jobId && jobStatus !== 'completed' && jobStatus !== 'failed') {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await apiUtils.getJobStatus(jobId);
          const { status, progress, result } = response.data;
          setJobStatus(status);
          setJobProgress(progress);

          if (status === 'completed') {
            clearInterval(pollingIntervalRef.current);
            setVideoData(result);
            toast.success('Viral video generated successfully! 🎉', { id: 'videoGenToast', duration: 5000 });
            setLoading(false); // End overall loading
          } else if (status === 'failed') {
            clearInterval(pollingIntervalRef.current);
            setError(result?.error || 'Video generation failed. Check backend logs for details.');
            toast.error(`Error: ${result?.error || 'Video generation failed.'}`, { id: 'videoGenToast', duration: 5000 });
            setLoading(false); // End overall loading
            setJobStatus('failed');
          }
        } catch (err) {
          console.error('Error polling job status:', err);
          clearInterval(pollingIntervalRef.current);
          setError('Failed to retrieve job status or connection lost.');
          toast.error('Failed to retrieve job status.', { id: 'videoGenToast', duration: 5000 });
          setLoading(false); // End overall loading
          setJobStatus('failed');
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [jobId, jobStatus]); // Re-run effect if jobId or jobStatus changes

  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    setLoading(true); // Start overall loading
    setError('');
    setVideoData(null);
    setJobId(null);
    setJobStatus('idle');
    setJobProgress(0);
    toast.dismiss();

    if (!prompt.trim()) {
      setError('Please enter a prompt for your video.');
      setLoading(false);
      return;
    }

    try {
      toast.loading('Starting video generation...', { id: 'videoGenToast', duration: 0 });

      const requestData = {
        prompt,
        duration,
        videoStyle,
        voiceover: addVoiceover ? {
          text: voiceoverText || null,
          voiceId: selectedVoice,
        } : false,
        music: addMusic ? {
          trackId: selectedMusic,
        } : false, // In future, pass music generation options here
        captions: addCaptions ? {
          style: captionStyle,
          customText: customCaptions || null,
        } : false,
        hashtags: generateHashtags ? {
          count: hashtagCount,
        } : false,
        description: generateDescription ? {
          tone: descriptionTone,
        } : false,
      };

      console.log('Frontend: Enqueuing social media video generation job with options:', requestData);

      const response = await apiUtils.generateSocialMediaVideo(requestData);

      if (response.data.success) {
        setJobId(response.data.jobId);
        setJobStatus('enqueued');
        toast.loading(`Video generation job ${response.data.jobId} submitted! Waiting for processing...`, { id: 'videoGenToast', duration: 0 });
      } else {
        setError(response.data.message || 'Failed to submit video generation job.');
        toast.error(response.data.message || 'Failed to submit video generation job.', { id: 'videoGenToast', duration: 5000 });
        setLoading(false); // End overall loading
      }
    } catch (err) {
      console.error('Frontend Error submitting video generation job:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`, { id: 'videoGenToast', duration: 5000 });
      setLoading(false); // End overall loading
    }
  };

  const handleGenerateIdeas = async () => {
    setLoadingIdeas(true);
    setGeneratedIdeas([]);
    setIdeaError('');
    toast.dismiss();

    if (!ideaKeywords.trim()) {
      setIdeaError('Please enter keywords for idea generation.');
      setLoadingIdeas(false);
      return;
    }

    try {
      toast.loading('Generating creative ideas...', { id: 'ideaGenToast', duration: 0 });
      const response = await apiUtils.generateIdeas('social_video', ideaKeywords, ideaTone); // 'social_video' is a type for the AI

      if (response.data.success) {
        // Poll for idea generation job status
        const ideaJobId = response.data.jobId;
        let currentIdeaStatus = 'enqueued';
        let ideaResult = null;

        const ideaPollingInterval = setInterval(async () => {
          try {
            const ideaResponse = await apiUtils.getJobStatus(ideaJobId);
            currentIdeaStatus = ideaResponse.data.status;
            ideaResult = ideaResponse.data.result;

            if (currentIdeaStatus === 'completed') {
              clearInterval(ideaPollingInterval);
              setGeneratedIdeas(ideaResult.ideas);
              toast.success('Ideas generated successfully!', { id: 'ideaGenToast', duration: 3000 });
              setLoadingIdeas(false);
            } else if (currentIdeaStatus === 'failed') {
              clearInterval(ideaPollingInterval);
              setIdeaError(ideaResult?.error || 'Idea generation failed.');
              toast.error(`Error generating ideas: ${ideaResult?.error || 'Unknown error'}`, { id: 'ideaGenToast', duration: 5000 });
              setLoadingIdeas(false);
            }
          } catch (pollErr) {
            clearInterval(ideaPollingInterval);
            setIdeaError('Failed to poll idea status.');
            toast.error('Failed to poll idea status.', { id: 'ideaGenToast', duration: 5000 });
            setLoadingIdeas(false);
          }
        }, 2000); // Poll every 2 seconds for ideas (usually faster)

      } else {
        setIdeaError(response.data.message || 'Failed to submit idea generation job.');
        toast.error(response.data.message || 'Failed to submit idea generation job.', { id: 'ideaGenToast', duration: 5000 });
        setLoadingIdeas(false);
      }
    } catch (err) {
      console.error('Frontend Error submitting idea generation job:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setIdeaError(errorMessage);
      toast.error(`Error: ${errorMessage}`, { id: 'ideaGenToast', duration: 5000 });
      setLoadingIdeas(false);
    }
  };

  const handleUseIdea = (ideaPrompt) => {
    setPrompt(ideaPrompt); // Populate the main prompt box
    setGeneratedIdeas([]); // Clear ideas
    toast.success('Prompt populated from idea!');
    // You might also pre-set other options based on the idea type
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8 bg-gray-900 text-white min-h-screen"
    >
      <h1 className="text-4xl font-bold mb-8 text-center gradient-text">Viral Video Creator</h1>
      <p className="text-xl text-gray-300 text-center mb-10">Craft captivating social media videos with AI.</p>

      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        {/* AI Idea Generation Section */}
        <div className="p-6 bg-gray-700 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Need Ideas? Let AI Help!</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="ideaKeywords" className="block text-lg font-medium text-gray-300 mb-2">
                        Keywords for Ideas:
                    </label>
                    <input
                        type="text"
                        id="ideaKeywords"
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                        placeholder="e.g., new product launch, summer sale, fitness tips"
                        value={ideaKeywords}
                        onChange={(e) => setIdeaKeywords(e.target.value)}
                        disabled={loadingIdeas}
                    />
                </div>
                <div>
                    <label htmlFor="ideaTone" className="block text-lg font-medium text-gray-300 mb-2">
                        Tone:
                    </label>
                    <select
                        id="ideaTone"
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                        value={ideaTone}
                        onChange={(e) => setIdeaTone(e.target.value)}
                        disabled={loadingIdeas}
                    >
                        <option value="creative">Creative</option>
                        <option value="humorous">Humorous</option>
                        <option value="professional">Professional</option>
                        <option value="engaging">Engaging</option>
                    </select>
                </div>
                <button
                    type="button"
                    onClick={handleGenerateIdeas}
                    className="btn-primary w-full py-2 px-4 text-lg rounded-lg font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1"
                    disabled={loadingIdeas}
                >
                    {loadingIdeas ? 'Generating Ideas...' : 'Generate AI Ideas'}
                </button>
                {ideaError && <p className="text-red-500 mt-2 text-center text-sm">{ideaError}</p>}
            </div>

            {generatedIdeas.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6 space-y-4"
                >
                    <h3 className="text-xl font-semibold text-gray-200">Generated Ideas:</h3>
                    {generatedIdeas.map((idea, index) => (
                        <div key={index} className="bg-gray-600 p-4 rounded-md border border-gray-500 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="flex-grow">
                                <p className="text-lg font-semibold text-blue-300 mb-1">{idea.title}</p>
                                <p className="text-sm text-gray-300 mb-2">{idea.idea}</p>
                                <p className="text-xs text-gray-400">Prompt: {idea.prompt.substring(0, 80)}...</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleUseIdea(idea.prompt)}
                                className="btn-secondary mt-3 md:mt-0 md:ml-4 py-2 px-4 text-sm rounded-md"
                            >
                                Use This Idea
                            </button>
                        </div>
                    ))}
                </motion.div>
            )}
        </div>

        {/* Main Video Generation Form */}
        <form onSubmit={handleSubmitVideo} className="space-y-8">
          {/* Prompt Box */}
          <div>
            <label htmlFor="prompt" className="block text-xl font-bold text-gray-100 mb-3">
              1. Describe Your Viral Video Idea: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="prompt"
              rows="5"
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 text-lg"
              placeholder="e.g., 'A quirky, fast-paced video showing delicious gourmet burgers being made, ending with people enjoying them in a sunny park. Target audience: Foodies on TikTok.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              required
            ></textarea>
          </div>

          {/* Video Style & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="duration" className="block text-lg font-medium text-gray-300 mb-2">
                Video Length (seconds):
              </label>
              <input
                type="number"
                id="duration"
                min="15"
                max="90" // Increased max duration
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                disabled={loading}
              />
              <p className="text-sm text-gray-400 mt-1">Short, snappy videos perform best on social media.</p>
            </div>
            <div>
              <label htmlFor="videoStyle" className="block text-lg font-medium text-gray-300 mb-2">
                Video Style:
              </label>
              <select
                id="videoStyle"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                value={videoStyle}
                onChange={(e) => setVideoStyle(e.target.value)}
                disabled={loading}
              >
                <option value="social">Social Media (Fast & Dynamic)</option>
                <option value="commercial">Commercial (Polished & Persuasive)</option>
                <option value="product">Product Showcase (Clear & Detailed)</option>
                {/* Add more styles as your backend supports */}
              </select>
            </div>
          </div>

          {/* Voiceover Options */}
          <div className="p-6 bg-gray-700 rounded-lg">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="addVoiceover"
                className="form-checkbox h-5 w-5 text-blue-600 bg-gray-900 border-gray-600 rounded"
                checked={addVoiceover}
                onChange={(e) => setAddVoiceover(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="addVoiceover" className="ml-3 text-lg font-medium text-gray-200">
                Add AI Voiceover
              </label>
            </div>
            {addVoiceover && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="voiceoverText" className="block text-md font-medium text-gray-300 mb-2">
                    Custom Voiceover Script (Optional - if left blank, AI generates from prompt):
                  </label>
                  <textarea
                    id="voiceoverText"
                    rows="3"
                    className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                    placeholder="e.g., 'Welcome to our summer sale! Huge discounts on all items.'"
                    value={voiceoverText}
                    onChange={(e) => setVoiceoverText(e.target.value)}
                    disabled={loading}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="selectedVoice" className="block text-md font-medium text-gray-300 mb-2">
                    Select Voice:
                  </label>
                  <select
                    id="selectedVoice"
                    className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    disabled={loading || availableVoices.length === 0}
                  >
                    {availableVoices.length > 0 ? (
                      availableVoices.map((voice) => (
                        <option key={voice.id} value={voice.id}>
                          {voice.name} ({voice.gender}, {voice.accent})
                        </option>
                      ))
                    ) : (
                      <option value="">Loading voices...</option>
                    )}
                  </select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Music Options */}
          <div className="p-6 bg-gray-700 rounded-lg">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="addMusic"
                className="form-checkbox h-5 w-5 text-blue-600 bg-gray-900 border-gray-600 rounded"
                checked={addMusic}
                onChange={(e) => setAddMusic(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="addMusic" className="ml-3 text-lg font-medium text-gray-200">
                Add Background Music
              </label>
            </div>
            {addMusic && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="selectedMusic" className="block text-md font-medium text-gray-300 mb-2">
                  Select Music Track:
                </label>
                <select
                  id="selectedMusic"
                  className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={selectedMusic}
                  onChange={(e) => setSelectedMusic(e.target.value)}
                  disabled={loading}
                >
                  {MOCK_MUSIC_OPTIONS.map((music) => (
                    <option key={music.id} value={music.id}>
                      {music.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-400 mt-1">Note: Music integration is basic. Advanced options (volume, custom upload) can be added.</p>
              </motion.div>
            )}
          </div>

          {/* Captions Options */}
          <div className="p-6 bg-gray-700 rounded-lg">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="addCaptions"
                className="form-checkbox h-5 w-5 text-blue-600 bg-gray-900 border-gray-600 rounded"
                checked={addCaptions}
                onChange={(e) => setAddCaptions(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="addCaptions" className="ml-3 text-lg font-medium text-gray-200">
                Add On-Screen Captions
              </label>
            </div>
            {addCaptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="captionStyle" className="block text-md font-medium text-gray-300 mb-2">
                    Caption Style:
                  </label>
                  <select
                    id="captionStyle"
                    className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={captionStyle}
                    onChange={(e) => setCaptionStyle(e.target.value)}
                    disabled={loading}
                  >
                    <option value="dynamic">Dynamic (Highlighting)</option>
                    <option value="classic">Classic (Standard Bottom)</option>
                    <option value="minimal">Minimalist</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="customCaptions" className="block text-md font-medium text-gray-300 mb-2">
                    Custom Captions (Optional - separate by new lines):
                  </label>
                  <textarea
                    id="customCaptions"
                    rows="3"
                    className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                    placeholder="Line 1 of caption&#10;Line 2 of caption"
                    value={customCaptions}
                    onChange={(e) => setCustomCaptions(e.target.value)}
                    disabled={loading}
                  ></textarea>
                </div>
              </motion.div>
            )}
          </div>

          {/* Hashtag & Description Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-700 rounded-lg">
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="generateHashtags"
                  className="form-checkbox h-5 w-5 text-blue-600 bg-gray-900 border-gray-600 rounded"
                  checked={generateHashtags}
                  onChange={(e) => setGenerateHashtags(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="generateHashtags" className="ml-3 text-lg font-medium text-gray-200">
                  Generate Hashtags
                </label>
              </div>
              {generateHashtags && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor="hashtagCount" className="block text-md font-medium text-gray-300 mb-2">
                    Number of Hashtags:
                  </label>
                  <input
                    type="number"
                    id="hashtagCount"
                    min="5"
                    max="30"
                    className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={hashtagCount}
                    onChange={(e) => setHashtagCount(parseInt(e.target.value))}
                    disabled={loading}
                  />
                </motion.div>
              )}
            </div>

            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="generateDescription"
                  className="form-checkbox h-5 w-5 text-blue-600 bg-gray-900 border-gray-600 rounded"
                  checked={generateDescription}
                  onChange={(e) => setGenerateDescription(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="generateDescription" className="ml-3 text-lg font-medium text-gray-200">
                  Generate Description
                </label>
              </div>
              {generateDescription && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor="descriptionTone" className="block text-md font-medium text-gray-300 mb-2">
                    Description Tone:
                  </label>
                  <select
                    id="descriptionTone"
                    className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                    value={descriptionTone}
                    onChange={(e) => setDescriptionTone(e.target.value)}
                    disabled={loading}
                  >
                    <option value="engaging">Engaging</option>
                    <option value="informative">Informative</option>
                    <option value="humorous">Humorous</option>
                    <option value="promotional">Promotional</option>
                  </select>
                </motion.div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full py-4 px-6 text-2xl rounded-lg font-extrabold transition duration-300 ease-in-out transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'AI Enqueuing Video Job...' : 'Generate Viral Video'}
          </button>
          {error && <p className="text-red-500 mt-4 text-center text-lg">{error}</p>}
        </form>

        {loading && (
          <div className="text-center mt-10 text-blue-400">
            {jobId ? (
                <>
                    <p className="text-xl font-semibold">
                        Job ID: {jobId} - Status: <span className="capitalize">{jobStatus}</span>
                    </p>
                    <div className="w-full bg-gray-600 rounded-full h-2.5 my-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${jobProgress}%` }}></div>
                    </div>
                    <p className="text-xl font-semibold animate-pulse">
                        {jobStatus === 'enqueued' && 'Your job is in the queue, waiting to be processed.'}
                        {jobStatus === 'active' && `Processing... ${jobProgress}% completed. This might take a while!` }
                        {jobStatus === 'waiting' && 'Your job is in the queue. Please wait.'}
                        {jobStatus === 'delayed' && 'Your job is delayed. Please wait.'}
                    </p>
                </>
            ) : (
                <p className="text-xl font-semibold animate-pulse">
                    Submitting your request to the AI...
                </p>
            )}

            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mt-6"></div>
            <p className="text-md mt-4">Grab a coffee, your masterpiece is coming!</p>
          </div>
        )}

        {videoData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 bg-gray-700 p-8 rounded-lg shadow-inner"
          >
            <h2 className="text-4xl font-bold mb-6 text-center gradient-text">Your Viral Video is Ready!</h2>
            <div className="flex justify-center mb-8">
              <video controls src={videoData.videoUrl} className="w-full max-w-2xl rounded-lg shadow-xl border border-gray-600" />
            </div>

            {videoData.script && (
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3 text-blue-300">Generated Script:</h3>
                <p className="whitespace-pre-wrap bg-gray-600 p-5 rounded-md text-gray-200 text-base shadow-sm">{videoData.script}</p>
              </div>
            )}

            {videoData.description && (
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3 text-blue-300">Suggested Description:</h3>
                <p className="whitespace-pre-wrap bg-gray-600 p-5 rounded-md text-gray-200 text-base shadow-sm">{videoData.description}</p>
              </div>
            )}

            {videoData.hashtags && videoData.hashtags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3 text-blue-300">Suggested Hashtags:</h3>
                <p className="bg-gray-600 p-5 rounded-md text-gray-200 text-base shadow-sm">
                  {videoData.hashtags.map(tag => `#${tag}`).join(' ')}
                </p>
              </div>
            )}

            {videoData.musicInfo && (
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3 text-blue-300">Music Used:</h3>
                    <p className="bg-gray-600 p-5 rounded-md text-gray-200 text-base shadow-sm">
                        {videoData.musicInfo.name || "Custom Track"}
                    </p>
                </div>
            )}


            <div className="mt-8 text-center space-x-4">
                <a
                    href={videoData.videoUrl}
                    download={`viral-video-${Date.now()}.mp4`}
                    className="btn-primary inline-block mr-4 py-3 px-6 text-xl rounded-lg font-semibold"
                >
                    Download Video
                </a>
                {/* Add share buttons to social media platforms here, e.g., for TikTok, Instagram, YouTube Shorts */}
                <button className="btn-secondary inline-block py-3 px-6 text-xl rounded-lg font-semibold">
                    Share to TikTok (Coming Soon)
                </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SocialMediaCreator;











