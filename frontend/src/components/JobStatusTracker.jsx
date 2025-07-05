// src/components/JobStatusTracker.jsx
import React, { useState, useEffect } from 'react';
import { apiUtils } from '../utils/api'; // Make sure this path is correct
import toast from 'react-hot-toast'; // For notifications

const JobStatusTracker = ({ jobId }) => {
  const [status, setStatus] = useState('pending');
  const [result, setResult] = useState(null); // Will hold { videoUrl: '...' } or other results
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const checkStatus = async () => {
      try {
        const response = await apiUtils.getJobStatus(jobId);
        // Assuming your backend /api/jobs/:jobId/status returns { success: true, job: { status, result, error } }
        const jobData = response.data.job;

        setStatus(jobData.status);
        setResult(jobData.result);
        setError(jobData.error);

        // If job is completed or failed, stop polling
        if (jobData.status === 'completed' || jobData.status === 'failed') {
          clearInterval(intervalId);
          setLoading(false);
          if (jobData.status === 'completed') {
            toast.success(`Job ${jobId.substring(0, 8)}... completed!`);
          } else {
            toast.error(`Job ${jobId.substring(0, 8)}... failed: ${jobData.error || 'Unknown error'}`);
          }
        }
      } catch (err) {
        console.error(`Error polling job ${jobId} status:`, err);
        setError('Could not fetch job status.');
        clearInterval(intervalId); // Stop polling on API error
        setLoading(false);
        toast.error(`Failed to track job ${jobId.substring(0, 8)}....`);
      }
    };

    if (jobId) {
      checkStatus(); // Initial check immediately
      intervalId = setInterval(checkStatus, 5000); // Poll every 5 seconds
    }

    // Cleanup function: clear the interval when the component unmounts or jobId changes
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [jobId]); // Re-run effect if jobId changes

  if (!jobId) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 text-center text-gray-400">
        No job selected for tracking.
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 shadow-2xl backdrop-blur-sm border border-gray-700 text-white">
      <h3 className="text-xl font-bold mb-4 gradient-text">Job Status: <span className="text-gray-200">{jobId.substring(0, 8)}...</span></h3>
      <p className="mb-2">
        Current Status: <span className={`font-semibold ${status === 'completed' ? 'text-green-400' : status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
          {status.toUpperCase()}
        </span> {loading && <span className="ml-2 animate-pulse text-gray-500">(polling...)</span>}
      </p>

      {/* Show loading spinner if still loading and not completed/failed */}
      {loading && status !== 'completed' && status !== 'failed' && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-400">Processing your request, please wait...</span>
        </div>
      )}

      {/* Display result if completed */}
      {status === 'completed' && result && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Result:</h4>
          {result.videoUrl && ( // Assuming videoUrl is the key for the video
            <div className="text-center">
              <video controls src={result.videoUrl} className="w-full max-h-96 rounded-md shadow-lg mb-4" />
              <a
                href={result.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Download Video</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          )}
          {result.imageUrl && ( // For image generation jobs
            <div className="text-center">
              <img src={result.imageUrl} alt="Generated Content" className="w-full max-h-96 rounded-md shadow-lg mb-4" />
              <a
                href={result.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>View Image</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          )}
          {/* Add more conditions for other result types (text, etc.) */}
          {(!result.videoUrl && !result.imageUrl && result.text) && (
            <p className="text-gray-300 whitespace-pre-wrap">{result.text}</p>
          )}
        </div>
      )}

      {/* Display error if failed */}
      {status === 'failed' && error && (
        <div className="mt-6 p-4 bg-red-800/50 rounded-lg border border-red-700 text-red-300">
          <h4 className="text-lg font-semibold mb-2">Generation Failed!</h4>
          <p>{error}</p>
          <p className="text-sm mt-2">Please try again, or contact support if the issue persists.</p>
        </div>
      )}

      <div className="text-center mt-6">
        <Link to="/dashboard" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default JobStatusTracker;
