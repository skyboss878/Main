import React, { useState } from 'react';

const TestApi = () => {
  const [status, setStatus] = useState('Ready to test');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setStatus('Testing API...');
    
    try {
      // Example API test - replace with your actual API endpoint
      const result = await fetch('/api/test');
      const data = await result.json();
      
      setResponse(data);
      setStatus('API test successful');
    } catch (error) {
      setResponse({ error: error.message });
      setStatus('API test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-900">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            API Test
          </h1>
          <p className="text-gray-400 mb-8">
            Status: {status}
          </p>
        </div>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testApi}
            disabled={loading}
            className={`block w-full px-6 py-3 rounded-lg transition-colors ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
          
          <a
            href="/"
            className="block border border-purple-600 hover:bg-purple-600/10 px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </a>
        </div>

        {response && (
          <div className="p-4 bg-gray-800/50 rounded-lg text-left">
            <h3 className="text-purple-400 font-semibold mb-2">Response:</h3>
            <pre className="text-gray-300 text-sm overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestApi;
