// Add this before your route loading section
console.log('🔍 API_ROUTES object:', JSON.stringify(API_ROUTES, null, 2));

// Wrap app.use calls in try-catch
const originalUse = app.use.bind(app);
app.use = function(path, ...args) {
  try {
    console.log(`🔄 Attempting to register route: ${path}`);
    return originalUse(path, ...args);
  } catch (error) {
    console.error(`❌ Failed to register route ${path}:`, error.message);
    throw error;
  }
};
