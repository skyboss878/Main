// advanced_route_diagnostics.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Advanced Route Diagnostics Tool');
console.log('=====================================\n');

const routesDir = './routes';

// Check if routes directory exists
if (!fs.existsSync(routesDir)) {
    console.error('❌ Routes directory not found!');
    process.exit(1);
}

const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));

console.log(`📁 Found ${routeFiles.length} route files:\n`);

// Track all issues found
const issues = [];

routeFiles.forEach(file => {
    const filePath = path.join(routesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`🔍 Analyzing: ${file}`);
    console.log('─'.repeat(50));
    
    // Check for common issues
    let fileIssues = [];
    
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Check for router definitions
        if (line.includes('router.')) {
            console.log(`  Line ${lineNum}: ${line.trim()}`);
            
            // Check for malformed parameters
            const paramMatches = line.match(/:([^/\s'",)]+)/g);
            if (paramMatches) {
                paramMatches.forEach(param => {
                    if (param.length <= 1 || param.includes(':')) {
                        fileIssues.push(`Line ${lineNum}: Malformed parameter "${param}"`);
                    }
                });
            }
            
            // Check for unclosed quotes
            const singleQuotes = (line.match(/'/g) || []).length;
            const doubleQuotes = (line.match(/"/g) || []).length;
            if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
                fileIssues.push(`Line ${lineNum}: Unclosed quotes detected`);
            }
            
            // Check for missing async/await patterns
            if (line.includes('async') && !line.includes('await') && !line.includes('=>')) {
                // This is just the function declaration, check next few lines
                for (let i = index + 1; i < Math.min(index + 10, lines.length); i++) {
                    if (lines[i].includes('await') || lines[i].includes('res.')) {
                        break;
                    }
                    if (i === index + 9) {
                        fileIssues.push(`Line ${lineNum}: Async function without await usage`);
                    }
                }
            }
        }
        
        // Check for common syntax errors
        if (line.includes('router') && line.includes('(') && !line.includes(')')) {
            // Check if closing parenthesis is on next line
            let found = false;
            for (let i = index + 1; i < Math.min(index + 5, lines.length); i++) {
                if (lines[i].includes(')')) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                fileIssues.push(`Line ${lineNum}: Unclosed parenthesis in router definition`);
            }
        }
        
        // Check for module.exports issues
        if (line.includes('module.exports') && line.includes('router')) {
            console.log(`  📤 Export: ${line.trim()}`);
        }
    });
    
    // Try to load the module to check for syntax errors
    try {
        delete require.cache[path.resolve(filePath)];
        const module = require(path.resolve(filePath));
        
        if (module.router) {
            console.log(`  ✅ Module loads successfully with router`);
        } else if (module.path && module.router) {
            console.log(`  ✅ Module loads successfully with path: ${module.path}`);
        } else {
            console.log(`  ⚠️  Module loads but no router found`);
            fileIssues.push('No router export found');
        }
    } catch (error) {
        console.log(`  ❌ Module load error: ${error.message}`);
        fileIssues.push(`Module load error: ${error.message}`);
    }
    
    if (fileIssues.length > 0) {
        console.log('  🚨 Issues found:');
        fileIssues.forEach(issue => {
            console.log(`    - ${issue}`);
        });
        issues.push({ file, issues: fileIssues });
    } else {
        console.log('  ✅ No issues detected');
    }
    
    console.log('');
});

// Summary
console.log('📊 DIAGNOSTIC SUMMARY');
console.log('====================');

if (issues.length === 0) {
    console.log('✅ All route files appear to be healthy!');
    console.log('\nIf you\'re still having issues, check:');
    console.log('1. Server startup logs for specific error messages');
    console.log('2. Express app.use() statements in your main server file');
    console.log('3. Middleware conflicts or missing dependencies');
    console.log('4. Port conflicts or environment variables');
} else {
    console.log(`❌ Found issues in ${issues.length} files:\n`);
    issues.forEach(({ file, issues: fileIssues }) => {
        console.log(`📄 ${file}:`);
        fileIssues.forEach(issue => {
            console.log(`  - ${issue}`);
        });
        console.log('');
    });
}

// Check main server file integration
console.log('🔍 CHECKING SERVER INTEGRATION');
console.log('===============================');

const serverFiles = ['server.js', 'app.js', 'index.js'];
let serverFile = null;

for (const file of serverFiles) {
    if (fs.existsSync(file)) {
        serverFile = file;
        break;
    }
}

if (serverFile) {
    console.log(`📄 Found server file: ${serverFile}`);
    const serverContent = fs.readFileSync(serverFile, 'utf8');
    
    // Check for route imports
    const routeImports = serverContent.match(/require\(['"]\.\/routes\/.*?['"]\)/g) || [];
    console.log(`📥 Found ${routeImports.length} route imports:`);
    routeImports.forEach(imp => console.log(`  - ${imp}`));
    
    // Check for app.use statements
    const appUses = serverContent.match(/app\.use\([^)]*\)/g) || [];
    console.log(`🔗 Found ${appUses.length} app.use statements:`);
    appUses.forEach(use => console.log(`  - ${use}`));
    
} else {
    console.log('⚠️  No main server file found (server.js, app.js, or index.js)');
}

console.log('\n✨ Diagnostic complete!');
