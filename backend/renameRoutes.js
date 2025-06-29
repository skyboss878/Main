// renameRoutes.js
const fs = require('fs');
const path = require('path');

const backendDir = __dirname;
const routesDir = path.join(backendDir, 'routes');

const filesToRename = {
  'authRoutes.js': 'auth.js',
  'videoRoutes.js': 'videos.js',
  'paymentRoutes.js': 'payments.js',
  'aiRoutes.js': 'ai.js',
};

for (const [oldName, newName] of Object.entries(filesToRename)) {
  const oldPath = path.join(routesDir, oldName);
  const newPath = path.join(routesDir, newName);

  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${oldName} → ${newName}`);
  } else {
    console.warn(`File not found: ${oldName}`);
  }
}
