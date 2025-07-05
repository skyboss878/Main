// precise_debug.js - Find exact route patterns
const fs = require('fs');

console.log('🎯 Precise Route Pattern Analysis\n');

const routeFiles = ['auth', 'videos', 'payments', 'ai'];

for (const routeFile of routeFiles) {
  const filePath = `./routes/${routeFile}.js`;
  
  try {
    console.log(`\n📁 ${routeFile.toUpperCase()}.JS ROUTES:`);
    console.log('='.repeat(30));
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let foundIssues = false;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Only look for router method definitions (more precise regex)
      const routerPattern = /router\.(get|post|put|delete|patch|use)\s*\(\s*(['"`])([^'"`]+)\2/;
      const match = trimmedLine.match(routerPattern);
      
      if (match) {
        const method = match[1].toUpperCase();
        const routePath = match[3];
        
        console.log(`Line ${index + 1}: ${method} "${routePath}"`);
        
        // Check for specific problematic patterns in route paths
        const issues = [];
        
        // Check 1: Colon not followed by valid parameter name
        if (routePath.includes(':')) {
          const colonParts = routePath.split(':');
          for (let i = 1; i < colonParts.length; i++) {
            const afterColon = colonParts[i];
            const paramName = afterColon.split(/[\/\?\#]/)[0]; // Get parameter name before next separator
            
            if (!paramName || !paramName.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/)) {
              issues.push(`Invalid parameter after colon: ":${paramName}"`);
            }
          }
        }
        
        // Check 2: Double colons
        if (routePath.includes('::')) {
          issues.push('Contains double colons');
        }
        
        // Check 3: Route ends with colon
        if (routePath.endsWith(':')) {
          issues.push('Route ends with colon');
        }
        
        // Check 4: Common malformed patterns
        if (routePath.match(/:\s/)) {
          issues.push('Colon followed by space');
        }
        
        if (routePath.match(/:[^a-zA-Z_$]/)) {
          issues.push('Colon followed by invalid character');
        }
        
        if (issues.length > 0) {
          console.log(`   ❌ ISSUES: ${issues.join(', ')}`);
          foundIssues = true;
        }
      }
    });
    
    if (!foundIssues) {
      console.log('   ✅ No route pattern issues found');
    }
    
  } catch (error) {
    console.log(`   ❌ Could not read ${routeFile}.js: ${error.message}`);
  }
}

console.log('\n🔍 Let\'s also check for the most common culprits:');
console.log('='.repeat(50));

// Check for specific patterns that commonly cause this error
const commonProblems = [
  'router.get(":"',
  'router.post(":"',
  'router.put(":"',
  'router.delete(":"',
  'router.patch(":"',
  'router.get("/"',  // Sometimes people accidentally add : after /
  'router.post("/"',
  'router.put("/"',
  'router.delete("/"',
  'router.patch("/"'
];

for (const routeFile of routeFiles) {
  const filePath = `./routes/${routeFile}.js`;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for empty or malformed route patterns
    const suspiciousPatterns = [
      /router\.(get|post|put|delete|patch|use)\s*\(\s*(['"`])\s*:\s*\2/,  // router.get(":")
      /router\.(get|post|put|delete|patch|use)\s*\(\s*(['"`])[^'"`]*::\s*\2/,  // router.get("abc::")
      /router\.(get|post|put|delete|patch|use)\s*\(\s*(['"`])[^'"`]*:\s*\2/,   // router.get("abc:")
      /router\.(get|post|put|delete|patch|use)\s*\(\s*(['"`])[^'"`]*:\s+[^'"`]*\2/  // router.get("abc: def")
    ];
    
    suspiciousPatterns.forEach((pattern, i) => {
      const match = content.match(pattern);
      if (match) {
        console.log(`❌ ${routeFile}.js: Found suspicious pattern ${i + 1}`);
        console.log(`   Pattern: ${match[0]}`);
        
        // Find line number
        const lines = content.split('\n');
        lines.forEach((line, lineIndex) => {
          if (line.includes(match[0])) {
            console.log(`   Line ${lineIndex + 1}: ${line.trim()}`);
          }
        });
      }
    });
    
  } catch (error) {
    console.log(`Could not check ${routeFile}.js for suspicious patterns`);
  }
}

console.log('\n💡 Manual check commands:');
console.log('grep -n "router\\." routes/auth.js');
console.log('grep -n "router\\." routes/videos.js');
console.log('grep -n "router\\." routes/payments.js');
console.log('grep -n "router\\." routes/ai.js');
