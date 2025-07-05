// checkRoutes.js
const fs = require('fs');
const path = require('path');

const routeNames = ['auth', 'videos', 'payments', 'ai']; // match your temp_server.js require calls

const routesDir = path.join(__dirname, 'routes');

routeNames.forEach((route) => {
  const jsFile = path.join(routesDir, `${route}.js`);
  if (fs.existsSync(jsFile)) {
    console.log(`✅ Route file found: ${route}.js`);
  } else {
    console.warn(`❌ Route file missing: ${route}.js`);
  }
});
