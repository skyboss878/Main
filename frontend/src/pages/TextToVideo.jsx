import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobStatusTracker = ({ jobId, onComplete }) => {
  const [status, setStatus] = useState('checking');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/jobs/${jobId}/status`);
        const data = res.data;

        setStatus(data.status);
        setProgress(data.progress || 0);

        if (data.status === 'completed') {
          clearInterval(interval);
          setResult(data.result);
          onComplete?.(data.result);
        }

        if (data.status === 'failed') {
          clearInterval(interval);
          setError(data.failedReason || 'Job failed.');
        }
      } catch (err) {
        clearInterval(interval);
        setError('Error checking job status.');
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [jobId]);

  if (error) return <div className="text-red-600 font-bold">{error}</div>;
  if (status === 'completed' && result?.videoUrl) return null;

  return (
    <div className="mt-6 text-gray-700">
      <p>⏳ Job Status: <strong>{status}</strong></p>
      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
        <div
          className="bg-purple-600 h-4 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default JobStatusTracker;









