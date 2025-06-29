const express = require('express');
const cors = require('cors');
const path = require('path');

// Import shared routes with error handling
let API_ROUTES;
try {
    API_ROUTES = require('../shared/routes.js').API_ROUTES;
    console.log('✅ Loaded shared routes successfully');
} catch (error) {
    console.error('❌ Failed to load shared routes:', error.message);
    // Fallback routes
    API_ROUTES = {
        AUTH: '/api/auth',
        AI: '/api/ai',
        BLOG: '/api/blog',
        CAPTION: '/api/caption',
        TEXT_TO_IMAGE: '/api/text-to-image',
        TEXT_TO_VIDEO: '/api/text-to-video',
        IMAGE_TO_IMAGE: '/api/image-to-image',
        VOICE: '/api/voice',
        COMMERCIAL: '/api/commercial',
        FLYER: '/api/flyer',
        FOOD_PROMOS: '/api/food-promos',
        SOCIAL_MEDIA: '/api/social-media',
        SERVICES: '/api/services',
        PAYMENTS: '/api/payments',
        TOURS: '/api/tours',
        VIDEOS: '/api/videos'
    };
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Function to safely validate and register routes
function safeRegisterRoute(routePath, routeFile) {
    try {
        // Validate the route path first
        if (!routePath || typeof routePath !== 'string') {
            throw new Error(`Invalid route path: ${routePath}`);
        }
        
        if (routePath.includes('undefined') || routePath.includes('null')) {
            throw new Error(`Route path contains invalid values: ${routePath}`);
        }
        
        // Test the route path with express
        const testRouter = express.Router();
        testRouter.get(routePath.replace('/api', ''), (req, res) => {});
        
        // If we get here, the path is valid, now load the route file
        console.log(`🔍 Loading route: ${routePath} -> ${routeFile}`);
        const route = require(routeFile);
        
        if (!route) {
            throw new Error(`Route file ${routeFile} did not export anything`);
        }
        
        app.use(routePath, route);
        console.log(`✅ Successfully registered route: ${routePath}`);
        return true;
        
    } catch (error) {
        console.error(`❌ Failed to register route ${routePath}:`, error.message);
        return false;
    }
}

// Route definitions with validation
const routeDefinitions = [
    { path: API_ROUTES.AUTH, file: './routes/auth' },
    { path: API_ROUTES.AI, file: './routes/ai' },
    { path: API_ROUTES.BLOG, file: './routes/blog' },
    { path: API_ROUTES.CAPTION, file: './routes/caption' },
    { path: API_ROUTES.COMMERCIAL, file: './routes/commercial' },
    { path: API_ROUTES.FLYER, file: './routes/flyer' },
    { path: API_ROUTES.FOOD_PROMOS, file: './routes/foodpromos' },
    { path: API_ROUTES.IMAGE_TO_IMAGE, file: './routes/imageToImage' },
    { path: API_ROUTES.PAYMENTS, file: './routes/payments' },
    { path: API_ROUTES.SERVICES, file: './routes/services' },
    { path: API_ROUTES.SOCIAL_MEDIA, file: './routes/social-media' },
    { path: API_ROUTES.TEXT_TO_IMAGE, file: './routes/textToImage' },
    { path: API_ROUTES.TEXT_TO_VIDEO, file: './routes/textToVideo' },
    { path: API_ROUTES.TOURS, file: './routes/tours' },
    { path: API_ROUTES.VIDEOS, file: './routes/videos' },
    { path: API_ROUTES.VOICE, file: './routes/voice' }
];

console.log('🚀 Starting enhanced server...');
console.log('📋 Route definitions loaded:', Object.keys(API_ROUTES).length);

// Register routes safely
let successCount = 0;
let failureCount = 0;

routeDefinitions.forEach(({ path, file }) => {
    if (safeRegisterRoute(path, file)) {
        successCount++;
    } else {
        failureCount++;
    }
});

console.log(`\n📊 Route Registration Summary:`);
console.log(`✅ Successful: ${successCount}`);
console.log(`❌ Failed: ${failureCount}`);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        routes: successCount,
        failures: failureCount
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found', 
        path: req.originalUrl 
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🎉 Enhanced server running on port ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
}).on('error', (error) => {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
});

module.exports = app;
