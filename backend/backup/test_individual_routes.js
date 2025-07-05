// test_individual_routes.js
const fs = require('fs');
const path = require('path');

console.log('🧪 Individual Route Tester');
console.log('===========================\n');

const routesDir = './routes';
const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));

console.log(`Testing ${routeFiles.length} route files individually...\n`);

const results = [];

routeFiles.forEach(file => {
    console.log(`🔍 Testing: ${file}`);
    
    const filePath = path.join(routesDir, file);
    const result = {
        file,
        success: false,
        error: null,
        router: null,
        path: null,
        routes: []
    };
    
    try {
        // Clear require cache
        delete require.cache[path.resolve(filePath)];
        
        // Try to require the module
        const module = require(path.resolve(filePath));
        
        result.success = true;
        
        // Check module structure
        if (module.router) {
            result.router = 'Found';
            
            // Try to extract route information
            if (module.router.stack) {
                result.routes = module.router.stack.map(layer => {
                    const methods = Object.keys(layer.route ? layer.route.methods : {});
                    return {
                        path: layer.route ? layer.route.path : 'unknown',
                        methods: methods
                    };
                });
            }
        }
        
        if (module.path) {
            result.path = module.path;
        }
        
        console.log(`  ✅ Success - Router: ${result.router || 'None'}, Path: ${result.path || 'None'}`);
        if (result.routes.length > 0) {
            console.log(`  📍 Routes found: ${result.routes.length}`);
            result.routes.forEach(route => {
                console.log(`    ${route.methods.join(',').toUpperCase()} ${route.path}`);
            });
        }
        
    } catch (error) {
        result.success = false;
        result.error = error.message;
        console.log(`  ❌ Error: ${error.message}`);
        
        // Try to provide more specific error details
        if (error.code) {
            console.log(`     Code: ${error.code}`);
        }
        if (error.lineNumber) {
            console.log(`     Line: ${error.lineNumber}`);
        }
    }
    
    results.push(result);
    console.log('');
});

// Summary
console.log('📊 TEST SUMMARY');
console.log('===============');

const successful = results.filter(r => r.success);
const failed = results.filter(r => !r.success);

console.log(`✅ Successful: ${successful.length}`);
console.log(`❌ Failed: ${failed.length}\n`);

if (failed.length > 0) {
    console.log('💥 FAILED ROUTES:');
    failed.forEach(result => {
        console.log(`  📄 ${result.file}: ${result.error}`);
    });
    console.log('');
}

if (successful.length > 0) {
    console.log('✅ SUCCESSFUL ROUTES:');
    successful.forEach(result => {
        const routeCount = result.routes.length;
        console.log(`  📄 ${result.file}: ${routeCount} routes${result.path ? ` (${result.path})` : ''}`);
    });
}

console.log('\n🔍 NEXT STEPS:');
console.log('===============');

if (failed.length > 0) {
    console.log('1. Fix the failed route files listed above');
    console.log('2. Check for missing dependencies or syntax errors');
    console.log('3. Verify all imports and exports are correct');
} else {
    console.log('1. All routes load successfully individually');
    console.log('2. Check your main server file (server.js/app.js) for integration issues');
    console.log('3. Verify app.use() statements are correct');
    console.log('4. Check middleware order and conflicts');
    console.log('5. Look at server startup logs for specific errors');
}

console.log('\n✨ Test complete!');
