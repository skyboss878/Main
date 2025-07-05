// check_route_structure.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Route Structure Detailed Checker');
console.log('===================================\n');

const routesDir = './routes';
const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));

// Function to show file content structure
function analyzeFileStructure(file) {
    const filePath = path.join(routesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`📄 ${file}`);
    console.log('─'.repeat(60));
    
    // Show first 15 lines to see the structure
    console.log('📋 First 15 lines:');
    lines.slice(0, 15).forEach((line, index) => {
        const lineNum = (index + 1).toString().padStart(2, ' ');
        console.log(`  ${lineNum}: ${line}`);
    });
    
    // Check for key patterns
    const patterns = {
        'Express Import': /require\(['"]express['"]\)/,
        'Router Declaration': /const\s+router\s*=\s*express\.Router\(\)/,
        'Router Usage': /router\./,
        'Router Export': /module\.exports\s*=\s*router/,
        'Alt Export Pattern': /module\.exports\s*=\s*{.*router.*}/
    };
    
    console.log('\n🔍 Pattern Analysis:');
    Object.entries(patterns).forEach(([name, pattern]) => {
        const found = pattern.test(content);
        console.log(`  ${found ? '✅' : '❌'} ${name}`);
        
        if (found) {
            // Show the matching line
            const matchingLines = lines.filter(line => pattern.test(line));
            matchingLines.forEach(line => {
                console.log(`      "${line.trim()}"`);
            });
        }
    });
    
    // Check for duplicate exports
    const exportMatches = content.match(/module\.exports.*?$/gm);
    if (exportMatches && exportMatches.length > 1) {
        console.log(`\n⚠️  Multiple exports found (${exportMatches.length}):`);
        exportMatches.forEach(match => {
            console.log(`    ${match}`);
        });
    }
    
    console.log('\n');
}

// Analyze a few key files first
const keyFiles = ['ai.js', 'auth.js', 'videos.js', 'tours.js'];
const availableKeyFiles = keyFiles.filter(file => 
    routeFiles.includes(file)
);

console.log('🎯 Analyzing Key Files:');
console.log('=======================\n');

availableKeyFiles.forEach(analyzeFileStructure);

// Show summary of all files
console.log('📊 All Files Summary:');
console.log('=====================\n');

routeFiles.forEach(file => {
    const filePath = path.join(routesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const hasExpressImport = /require\(['"]express['"]\)/.test(content);
    const hasRouterDeclaration = /const\s+router\s*=\s*express\.Router\(\)/.test(content);
    const hasRouterUsage = /router\./.test(content);
    const hasRouterExport = /module\.exports\s*=\s*router/.test(content);
    
    const status = hasExpressImport && hasRouterDeclaration && hasRouterUsage && hasRouterExport ? '✅' : '❌';
    
    console.log(`${status} ${file.padEnd(20)} Express:${hasExpressImport ? '✅' : '❌'} Router:${hasRouterDeclaration ? '✅' : '❌'} Usage:${hasRouterUsage ? '✅' : '❌'} Export:${hasRouterExport ? '✅' : '❌'}`);
});

console.log('\n🔧 RECOMMENDATIONS:');
console.log('===================');
console.log('1. Run the repair script: node fix_route_files.js');
console.log('2. Files marked with ❌ need structural fixes');
console.log('3. Each route file should have:');
console.log('   - const express = require(\'express\');');
console.log('   - const router = express.Router();');
console.log('   - router.get/post/etc. definitions');
console.log('   - module.exports = router;');
console.log('\n✨ Analysis complete!');
