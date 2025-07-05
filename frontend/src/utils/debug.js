// src/utils/debug.js
export const debugLog = (context, data, type = 'info') => {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    context,
    type,
    data
  };
  
  console.log(`[${type.toUpperCase()}] ${context}:`, data);
  
  // Store in memory for debugging (replace localStorage)
  if (!window.debugLogs) window.debugLogs = [];
  window.debugLogs.push(logData);
  
  // Keep only last 100 logs
  if (window.debugLogs.length > 100) {
    window.debugLogs = window.debugLogs.slice(-100);
  }
};

export const apiDebugWrapper = (apiCall, context) => {
  return async (...args) => {
    debugLog(context, { request: args }, 'request');
    
    try {
      const result = await apiCall(...args);
      debugLog(context, { response: result }, 'success');
      return result;
    } catch (error) {
      debugLog(context, { 
        error: error.message, 
        response: error.response?.data,
        status: error.response?.status 
      }, 'error');
      throw error;
    }
  };
};

// Error boundary for React components
export const withErrorBoundary = (Component) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      debugLog('ErrorBoundary', { error, errorInfo }, 'error');
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="p-4 bg-red-100 border border-red-400 rounded">
            <h2 className="text-red-800 font-bold">Something went wrong</h2>
            <pre className="text-sm text-red-600 mt-2">
              {this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
};

// Helper to check API health
export const checkApiHealth = async () => {
  try {
    const response = await fetch('/api/health');
    const status = response.ok ? 'healthy' : 'unhealthy';
    debugLog('API Health', { status, response: response.status });
    return status === 'healthy';
  } catch (error) {
    debugLog('API Health', { error: error.message }, 'error');
    return false;
  }
};

// Export logs for analysis
export const exportDebugLogs = () => {
  const logs = window.debugLogs || [];
  const dataStr = JSON.stringify(logs, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `debug-logs-${Date.now()}.json`;
  link.click();
};
