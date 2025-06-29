// debug_routes.js - Run this to find the problematic route
const express = require('express');

// Test each route file individually
const routeFiles = ['auth', 'videos', 'payments', 'ai'];

console.log('🔍 Testing route files individually...\n');

for (const routeFile of routeFiles) {
  try {
    console.log(`Testing ./routes/${routeFile}.js...`);
    const app = express();
    const routes = require(`./routes/${routeFile}`);
    app.use(`/api/${routeFile}`, routes);
    console.log(`✅ ${routeFile} routes - OK\n`);
  } catch (error) {
    console.log(`❌ ${routeFile} routes - ERROR:`);
    console.log(`   Error: ${error.message}`);
    console.log(`   This is likely the problematic route file!\n`);
    
    // Try to analyze the file content
    try {
      const fs = require('fs');
      const content = fs.readFileSync(`./routes/${routeFile}.js`, 'utf8');
      
      // Look for common problematic patterns
      const problematicPatterns = [
        /router\.(get|post|put|delete|patch)\(['"`]([^'"`]*:(?!\w)[^'"`]*)/g,
        /router\.(get|post|put|delete|patch)\(['"`]([^'"`]*::)/g,
        /router\.(get|post|put|delete|patch)\(['"`]([^'"`]*:$)/g,
        /router\.(get|post|put|delete|patch)\(['"`]([^'"`]*:\s)/g
      ];
      
      console.log(`   Analyzing ${routeFile}.js for problematic patterns:`);
      
      const lines = content.split('\n');
      let foundIssues = false;
      
      lines.forEach((line, index) => {
        problematicPatterns.forEach(pattern => {
          const matches = line.match(pattern);
          if (matches) {
            console.log(`   ⚠️  Line ${index + 1}: ${line.trim()}`);
            console.log(`      Issue: Route parameter pattern '${matches[2]}'`);
            foundIssues = true;
          }
        });
        
        // Check for other common issues
        if (line.includes('/:') && !line.match(/:\w+/)) {
          console.log(`   ⚠️  Line ${index + 1}: ${line.trim()}`);
          console.log(`      Issue: Possible malformed parameter`);
          foundIssues = true;
        }
      });
      
      if (!foundIssues) {
        console.log(`   No obvious pattern issues found. Check for:`);
        console.log(`   - Routes with ':' not followed by parameter name`);
        console.log(`   - Routes with '::' (double colons)`);
        console.log(`   - Routes ending with ':' without parameter`);
      }
      
    } catch (fsError) {
      console.log(`   Could not read file: ${fsError.message}`);
    }
    
    break; // Stop at first error since that's likely the culprit
  }
}

console.log('\n📋 Common route pattern issues to look for:');
console.log('   ❌ BAD: "/users/:"');
console.log('   ❌ BAD: "/users/::"');
console.log('   ❌ BAD: "/users/: "');
console.log('   ❌ BAD: "/users/:123"');
console.log('   ✅ GOOD: "/users/:id"');
console.log('   ✅ GOOD: "/users/:userId"');
console.log('   ✅ GOOD: "/users/:id/posts/:postId"');
