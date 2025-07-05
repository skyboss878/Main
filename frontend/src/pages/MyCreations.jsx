// src/pages/MyCreations.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiUtils } from '../utils/api'; // To fetch job history
import toast from 'react-hot-toast';
import JobStatusTracker from '../components/JobStatusTracker'; // Import the tracker

const MyCreations = () => {
  const { user } = useAuth();
  const [myJobs, setMyJobs] = useState([]); // This will hold a list of all user's jobs
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Function to fetch user's jobs (placeholder for now)
  const fetchMyJobs = async () => {
    if (!user) return; // Only fetch if user is logged in
    setLoadingJobs(true);
    try {
      // TODO: You need a backend API endpoint like /api/jobs/my or /api/user/jobs
      // to fetch a list of all jobs for the current user.
      // For now, let's simulate some data or fetch a single example job if possible.
      // const response = await apiUtils.getUserJobs(); // Example API call
      // setMyJobs(response.data.jobs);

      // --- TEMPORARY SIMULATED DATA (REMOVE ONCE BACKEND IS READY) ---
      setMyJobs([
        { id: 'job-123-abc', type: 'Video Generation', status: 'pending', createdAt: '2025-06-28T10:00:00Z', prompt: 'Animated logo reveal for a tech company.' },
        { id: 'job-456-def', type: 'Image Generation', status: 'completed', createdAt: '2025-06-27T14:30:00Z', prompt: 'Cyberpunk city at night.' },
        { id: 'job-789-ghi', type: 'Voice Generation', status: 'failed', createdAt: '2025-06-26T08:15:00Z', prompt: 'A cheerful narration.' },
        { id: 'job-012-jkl', type: 'Video Generation', status: 'processing', createdAt: '2025-06-29T11:45:00Z', prompt: 'A short social media ad for a new coffee shop.' },
      ]);
      // --- END TEMPORARY SIMULATED DATA ---

      toast.success('My creations loaded!');
    } catch (error) {
      console.error('Error fetching user jobs:', error);
      toast.error('Failed to load your creations. Please try again.');
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [user]); // Re-fetch jobs if user changes (e.g., login/logout)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Please <Link to="/login" className="text-purple-400 hover:underline">log in</Link> to view your creations.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Creations
          </h1>
          <p className="text-gray-400 text-lg">Track the status and view your AI-generated content.</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-8 shadow-2xl backdrop-blur-sm border border-gray-700">
          {loadingJobs ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
              Loading your creations...
            </div>
          ) : myJobs.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-xl mb-4">No creations yet!</p>
              <p>Start generating content from the <Link to="/dashboard" className="text-purple-400 hover:underline">Dashboard</Link>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`bg-gray-700/50 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border ${selectedJobId === job.id ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-600'}`}
                >
                  <h3 className="font-semibold text-lg text-gray-100">{job.type}</h3>
                  <p className="text-gray-400 text-sm mt-1 mb-2 truncate">{job.prompt}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'completed' ? 'bg-green-600/30 text-green-300' :
                      job.status === 'failed' ? 'bg-red-600/30 text-red-300' :
                      'bg-yellow-600/30 text-yellow-300'
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                    <span className="text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedJobId && (
            <div className="mt-10">
              <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Job Details
              </h2>
              <JobStatusTracker jobId={selectedJobId} />
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link to="/dashboard" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCreations;
