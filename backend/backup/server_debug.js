const express = require('express');
const cors = require('cors');

// Override path-to-regexp to catch the error
const originalPathToRegexp = require('path-to-regexp');
const pathToRegexp = function(...args) {
    console.log('🔍 PATH-TO-REGEXP CALLED WITH:', args);
    if (args[0] && args[0].includes && args[0].includes('pathToRegexpError')) {
        console.error('❌ FOUND THE CULPRIT PATH:', args[0]);
        console.trace('Stack trace:');
        throw new Error(`DEBUGGING: Found pathToRegexpError in: ${args[0]}`);
    }
    return originalPathToRegexp.pathToRegexp(...args);
};

// Replace the module
require.cache[require.resolve('path-to-regexp')] = {
    exports: { pathToRegexp, ...originalPathToRegexp }
};

// Import shared routes
let API_ROUTES;
try {
    API_ROUTES = require('../shared/routes.js').API_ROUTES;
    console.log('✅ Loaded shared routes successfully');
} catch (error) {
    console.error('❌ Failed to load shared routes:', error.message);
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Override app.use to log all route registrations
const originalUse = app.use.bind(app);
const originalGet = app.get.bind(app);
const originalPost = app.post.bind(app);
const originalPut = app.put.bind(app);
const originalDelete = app.delete.bind(app);

app.use = function(path, ...args) {
    console.log('🔍 APP.USE CALLED WITH PATH:', path);
    if (path && path.includes && path.includes('pathToRegexpError')) {
        console.error('❌ FOUND pathToRegexpError in app.use:', path);
        console.trace('Stack trace:');
    }
    return originalUse(path, ...args);
};

app.get = function(path, ...args) {
    console.log('🔍 APP.GET CALLED WITH PATH:', path);
    if (path && path.includes && path.includes('pathToRegexpError')) {
        console.error('❌ FOUND pathToRegexpError in app.get:', path);
        console.trace('Stack trace:');
    }
    return originalGet(path, ...args);
};

// Route definitions
const routeDefinitions = [
    { path: API_ROUTES.AUTH, file: './routes/auth' },
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

console.log('🚀 Loading routes with debugging...');

// Load routes with detailed logging
routeDefinitions.forEach(({ path, file }) => {
    try {
        console.log(`🔍 Loading route: ${path} -> ${file}`);
        const route = require(file);
        app.use(path, route);
        console.log(`✅ Loaded route ${path} -> ${file}`);
    } catch (error) {
        console.error(`❌ Failed to load route ${path}:`, error.message);
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log('🎉 Starting debug server...');
app.listen(PORT, () => {
    console.log(`Debug server running on port ${PORT}`);
}).on('error', (error) => {
    console.error('❌ Server error:', error);
});
