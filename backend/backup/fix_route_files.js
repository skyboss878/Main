// fix_route_files.js
const fs = require('fs');
const path = require('path');

console.log('🔧 Route Files Repair Script');
console.log('============================\n');

const routesDir = './routes';
const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));

console.log(`Found ${routeFiles.length} route files to analyze...\n`);

routeFiles.forEach(file => {
    const filePath = path.join(routesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`🔍 Analyzing: ${file}`);
    console.log('─'.repeat(50));
    
    // Check for router declaration
    const hasRouterDeclaration = content.includes('const router = express.Router()') || 
                                 content.includes('const router = require(\'express\').Router()') ||
                                 content.includes('const router = Router()');
    
    const hasExpressImport = content.includes('require(\'express\')') || 
                           content.includes('const express = require(\'express\')');
    
    const hasRouterExport = content.includes('module.exports = router');
    
    const hasRouterUsage = content.includes('router.');
    
    console.log(`  Express import: ${hasExpressImport ? '✅' : '❌'}`);
    console.log(`  Router declaration: ${hasRouterDeclaration ? '✅' : '❌'}`);
    console.log(`  Router usage: ${hasRouterUsage ? '✅' : '❌'}`);
    console.log(`  Router export: ${hasRouterExport ? '✅' : '❌'}`);
    
    // Identify what needs to be fixed
    const needsFix = !hasRouterDeclaration || !hasExpressImport;
    
    if (needsFix) {
        console.log(`  🚨 NEEDS REPAIR`);
        
        // Create the fixed content
        let fixedContent = content;
        let modifications = [];
        
        // Add express import if missing
        if (!hasExpressImport) {
            if (!fixedContent.startsWith('const express = require(\'express\')')) {
                fixedContent = `const express = require('express');\n${fixedContent}`;
                modifications.push('Added express import');
            }
        }
        
        // Add router declaration if missing
        if (!hasRouterDeclaration) {
            // Find the best place to insert router declaration
            const lines = fixedContent.split('\n');
            let insertIndex = 0;
            
            // Insert after imports but before route definitions
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('require(') || lines[i].includes('import ')) {
                    insertIndex = i + 1;
                } else if (lines[i].includes('router.')) {
                    break;
                }
            }
            
            lines.splice(insertIndex, 0, 'const router = express.Router();', '');
            fixedContent = lines.join('\n');
            modifications.push('Added router declaration');
        }
        
        // Write the backup and fixed file
        const backupPath = `${filePath}.backup`;
        fs.writeFileSync(backupPath, content);
        fs.writeFileSync(filePath, fixedContent);
        
        console.log(`  ✅ REPAIRED: ${modifications.join(', ')}`);
        console.log(`  💾 Backup saved: ${file}.backup`);
        
    } else {
        console.log(`  ✅ File is properly structured`);
    }
    
    console.log('');
});

console.log('🎯 REPAIR SUMMARY');
console.log('=================');
console.log('1. All route files have been analyzed');
console.log('2. Missing express imports and router declarations have been added');
console.log('3. Original files backed up with .backup extension');
console.log('4. You can now test your routes again\n');

console.log('🔍 NEXT STEPS:');
console.log('==============');
console.log('1. Run: node test_individual_routes.js');
console.log('2. Check that all routes now show "Router: Found"');
console.log('3. Test your server startup');
console.log('4. If everything works, you can delete the .backup files');
console.log('\n✨ Repair complete!');
