// advanced_debug.js - More thorough route debugging
const fs = require('fs');
const path = require('path');

console.log('🔍 Advanced Route Pattern Analysis\n');

const routeFiles = ['auth', 'videos', 'payments', 'ai'];

for (const routeFile of routeFiles) {
  const filePath = `./routes/${routeFile}.js`;
  
  try {
    console.log(`\n📁 Analyzing ${routeFile}.js:`);
    console.log('='.repeat(40));
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let foundSuspiciousLines = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip comments and empty lines
      if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || !trimmedLine) {
        return;
      }
      
      // Look for router method calls
      const routerMatch = trimmedLine.match(/router\.(get|post|put|delete|patch|use)\s*\(\s*['"`]([^'"`]+)['"`]/);
      
      if (routerMatch) {
        const method = routerMatch[1];
        const routePath = routerMatch[2];
        
        console.log(`   Line ${index + 1}: ${method.toUpperCase()} "${routePath}"`);
        
        // Check for problematic patterns
        const issues = [];
        
        // Pattern 1: Colon not followed by alphanumeric
        if (routePath.includes(':') && !routePath.match(/:[a-zA-Z_$][a-zA-Z0-9_$]*/)) {
          issues.push('Invalid parameter pattern');
        }
        
        // Pattern 2: Double colons
        if (routePath.includes('::')) {
          issues.push('Double colons found');
        }
        
        // Pattern 3: Colon at end
        if (routePath.endsWith(':')) {
          issues.push('Route ends with colon');
        }
        
        // Pattern 4: Colon followed by space or special chars
        if (routePath.match(/:\s|:[^a-zA-Z_$]/)) {
          issues.push('Colon followed by invalid character');
        }
        
        // Pattern 5: Empty parameter name
        if (routePath.match(/\/:/)) {
          const afterColon = routePath.split('/:')[1];
          if (afterColon && !afterColon.match(/^[a-zA-Z_$]/)) {
            issues.push('Parameter name starts with invalid character');
          }
        }
        
        if (issues.length > 0) {
          console.log(`   ❌ ISSUES: ${issues.join(', ')}`);
          foundSuspiciousLines.push({
            file: routeFile,
            line: index + 1,
            content: trimmedLine,
            path: routePath,
            issues: issues
          });
        }
      }
      
      // Also check for app.use patterns
      const appMatch = trimmedLine.match(/app\.use\s*\(\s*['"`]([^'"`]+)['"`]/);
      if (appMatch) {
        const routePath = appMatch[1];
        console.log(`   Line ${index + 1}: APP.USE "${routePath}"`);
        
        if (routePath.includes(':') && !routePath.match(/:[a-zA-Z_$][a-zA-Z0-9_$]*/)) {
          console.log(`   ❌ ISSUE: Invalid parameter pattern in app.use`);
          foundSuspiciousLines.push({
            file: routeFile,
            line: index + 1,
            content: trimmedLine,
            path: routePath,
            issues: ['Invalid parameter pattern in app.use']
          });
        }
      }
    });
    
    if (foundSuspiciousLines.length === 0) {
      console.log('   ✅ No obvious issues found');
    }
    
  } catch (error) {
    console.log(`   ❌ Could not read ${routeFile}.js: ${error.message}`);
  }
}

console.log('\n🎯 SUMMARY:');
console.log('='.repeat(50));

// Try a different approach - look for the exact error pattern
console.log('\n🔬 Searching for specific problematic patterns:');

for (const routeFile of routeFiles) {
  const filePath = `./routes/${routeFile}.js`;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for these specific patterns that cause the error
    const problematicPatterns = [
      { pattern: /['"`][^'"`]*:[^a-zA-Z_$][^'"`]*['"`]/, desc: 'Colon not followed by valid identifier' },
      { pattern: /['"`][^'"`]*::/, desc: 'Double colon' },
      { pattern: /['"`][^'"`]*:$/, desc: 'Ends with colon' },
      { pattern: /['"`][^'"`]*:\s/, desc: 'Colon followed by space' },
      { pattern: /['"`][^'"`]*:\W/, desc: 'Colon followed by non-word character' }
    ];
    
    problematicPatterns.forEach(({ pattern, desc }) => {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`❌ Found in ${routeFile}.js - ${desc}:`);
        console.log(`   Pattern: ${matches[0]}`);
        
        // Find the line number
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(matches[0])) {
            console.log(`   Line ${index + 1}: ${line.trim()}`);
          }
        });
      }
    });
    
  } catch (error) {
    console.log(`Could not analyze ${routeFile}.js`);
  }
}

console.log('\n💡 If no issues found above, try this manual check:');
console.log('1. Look for any route with just ":" character');
console.log('2. Check for routes copied from URLs that might have malformed patterns');
console.log('3. Look for any dynamic imports or programmatically generated routes');
console.log('4. Check if any middleware is adding routes dynamically');
