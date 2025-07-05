// src/pages/ImageRefinement.jsx
import React, { useState, useRef, useEffect } from 'react';
import { apiUtils } from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ImageRefinement = () => {
  const [sourceImageUrl, setSourceImageUrl] = useState('');
  const [prompt, setPrompt] = useState(''); // Prompt for refinement
  const [transformedImageUrl, setTransformedImageUrl] = useState(null);

  // Refinement specific options (for Stability AI)
  const [imageStrength, setImageStrength] = useState(0.35); // How much original image influences
  const [cfgScale, setCfgScale] = useState(7); // How strictly AI follows prompt
  const [steps, setSteps] = useState(30); // Number of diffusion steps
  const [sampler, setSampler] = useState('K_DPM_2M_SDE'); // Sampler algorithm

  // Job/Output State
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState('idle'); // idle, enqueued, active, completed, failed
  const [jobProgress, setJobProgress] = useState(0);
  const [loading, setLoading] = useState(false); // Overall loading state for form submission
  const [error, setError] = useState('');

  // Polling mechanism
  const pollingIntervalRef = useRef(null);

  // Polling effect
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
            setTransformedImageUrl(result.transformedImageUrl);
            toast.success('Image refinement complete!', { id: 'imgRefineToast', duration: 5000 });
            setLoading(false); // End overall loading
          } else if (status === 'failed') {
            clearInterval(pollingIntervalRef.current);
            setError(result?.error || 'Image refinement failed. Check backend logs.');
            toast.error(`Error: ${result?.error || 'Image refinement failed.'}`, { id: 'imgRefineToast', duration: 5000 });
            setLoading(false); // End overall loading
            setJobStatus('failed');
          }
        } catch (err) {
          console.error('Error polling image refinement job status:', err);
          clearInterval(pollingIntervalRef.current);
          setError('Failed to retrieve job status or connection lost.');
          toast.error('Failed to retrieve job status.', { id: 'imgRefineToast', duration: 5000 });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTransformedImageUrl(null);
    setJobId(null);
    setJobStatus('idle');
    setJobProgress(0);
    toast.dismiss();

    if (!sourceImageUrl.trim() || !prompt.trim()) {
      setError('Please provide both an image URL/path and a refinement prompt.');
      setLoading(false);
      return;
    }

    try {
      toast.loading('Starting image refinement...', { id: 'imgRefineToast', duration: 0 });

      const requestData = {
        imageUrl: sourceImageUrl,
        prompt,
        options: { // Pass all refinement options
          imageStrength: parseFloat(imageStrength),
          cfgScale: parseFloat(cfgScale),
          steps: parseInt(steps),
          sampler: sampler,
        }
      };

      console.log('Frontend: Enqueuing image refinement job:', requestData);
      const response = await apiUtils.imageToImage(requestData); // apiUtils.imageToImage now handles refinement

      if (response.data.success) {
        setJobId(response.data.jobId);
        setJobStatus('enqueued');
        toast.loading(`Image refinement job ${response.data.jobId} submitted! Waiting for processing...`, { id: 'imgRefineToast', duration: 0 });
      } else {
        setError(response.data.message || 'Failed to submit refinement job.');
        toast.error(response.data.message || 'Failed to submit refinement job.', { id: 'imgRefineToast', duration: 5000 });
        setLoading(false);
      }
    } catch (err) {
      console.error('Frontend Error submitting image refinement job:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`, { id: 'imgRefineToast', duration: 5000 });
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8 bg-gray-900 text-white min-h-screen"
    >
      <h1 className="text-4xl font-bold mb-8 text-center gradient-text">AI Image Refinement</h1>
      <p className="text-xl text-gray-300 text-center mb-10">
        Upload an image or use a generated one, then refine it with a new prompt and advanced controls.
      </p>

      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="sourceImageUrl" className="block text-lg font-medium text-gray-300 mb-2">
              Source Image URL or Path:
            </label>
            <input
              type="text"
              id="sourceImageUrl"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="e.g., https://example.com/image.jpg OR /temp/generated_image.png"
              value={sourceImageUrl}
              onChange={(e) => setSourceImageUrl(e.target.value)}
              disabled={loading}
              required
            />
            <p className="text-sm text-gray-400 mt-1">
              Use a public image URL or a path from your backend's `/temp` or `/uploads` directory (e.g., `/temp/dall_e_img_12345.png`).
            </p>
          </div>

          <div>
            <label htmlFor="prompt" className="block text-lg font-medium text-gray-300 mb-2">
              Refinement Prompt:
            </label>
            <textarea
              id="prompt"
              rows="4"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="e.g., 'transform into a watercolor painting, vibrant colors' OR 'add a futuristic cyborg arm'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              required
            ></textarea>
          </div>

          {/* Advanced Refinement Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-700 p-6 rounded-lg">
            <div>
              <label htmlFor="imageStrength" className="block text-md font-medium text-gray-300 mb-2">
                Image Strength (0.0 - 1.0): {imageStrength}
              </label>
              <input
                type="range"
                id="imageStrength"
                min="0"
                max="1"
                step="0.01"
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                value={imageStrength}
                onChange={(e) => setImageStrength(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-gray-400 mt-1">
                How much the original image influences the output. Lower value = more creative freedom for AI.
              </p>
            </div>
            <div>
              <label htmlFor="cfgScale" className="block text-md font-medium text-gray-300 mb-2">
                CFG Scale (0 - 35): {cfgScale}
              </label>
              <input
                type="range"
                id="cfgScale"
                min="0"
                max="35"
                step="1"
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                value={cfgScale}
                onChange={(e) => setCfgScale(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-gray-400 mt-1">
                Classifier-Free Guidance scale. How strictly the AI adheres to your prompt.
              </p>
            </div>
            <div>
              <label htmlFor="steps" className="block text-md font-medium text-gray-300 mb-2">
                Diffusion Steps (10 - 150): {steps}
              </label>
              <input
                type="range"
                id="steps"
                min="10"
                max="150"
                step="1"
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-gray-400 mt-1">
                Number of steps to generate the image. More steps = higher quality (but slower).
              </p>
            </div>
            <div>
              <label htmlFor="sampler" className="block text-md font-medium text-gray-300 mb-2">
                Sampler:
              </label>
              <select
                id="sampler"
                className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                value={sampler}
                onChange={(e) => setSampler(e.target.value)}
                disabled={loading}
              >
                <option value="K_DPM_2M_SDE">K_DPM_2M_SDE</option>
                <option value="K_EULER_ANCESTRAL">K_EULER_ANCESTRAL</option>
                <option value="K_EULER">K_EULER</option>
                <option value="K_DPM_2">K_DPM_2</option>
                <option value="K_DPM_FAST">K_DPM_FAST</option>
                <option value="K_DPM_ADAPTIVE">K_DPM_ADAPTIVE</option>
                {/* Add more samplers if Stability AI supports them and you want to expose */}
              </select>
              <p className="text-sm text-gray-400 mt-1">
                Algorithm for noise removal during generation. Different samplers yield different results.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 px-6 text-xl rounded-lg font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1"
            disabled={loading}
          >
            {loading ? 'Refining Image...' : 'Refine Image'}
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>

        {loading && (
          <div className="text-center mt-8 text-blue-400">
            {jobId ? (
                <>
                    <p className="text-xl font-semibold">
                        Job ID: {jobId} - Status: <span className="capitalize">{jobStatus}</span>
                    </p>
                    <div className="w-full bg-gray-600 rounded-full h-2.5 my-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${jobProgress}%` }}></div>
                    </div>
                    <p className="text-xl font-semibold animate-pulse">
                        {jobStatus === 'enqueued' && 'Your job is in the queue, waiting for refinement.'}
                        {jobStatus === 'active' && `Refining... ${jobProgress}% completed.` }
                        {jobStatus === 'waiting' && 'Your job is in the queue. Please wait.'}
                        {jobStatus === 'delayed' && 'Your job is delayed. Please wait.'}
                    </p>
                </>
            ) : (
                <p className="text-xl font-semibold animate-pulse">
                    Submitting your image refinement request...
                </p>
            )}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mt-4"></div>
          </div>
        )}

        {transformedImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 bg-gray-700 p-6 rounded-lg shadow-inner text-center"
          >
            <h2 className="text-3xl font-bold mb-4 gradient-text">Your Refined Image!</h2>
            <img src={transformedImageUrl} alt="Refined" className="w-full max-w-lg mx-auto rounded-lg shadow-lg mb-6" />
            <a
              href={transformedImageUrl}
              download={`refined_image-${Date.now()}.png`}
              className="btn-primary inline-block py-2 px-4"
            >
              Download Refined Image
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageRefinement;
