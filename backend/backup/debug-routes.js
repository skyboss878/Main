const path = require('path');

const routeFiles = [
  { path: '/api/ai', file: './routes/ai' },
  { path: '/api/auth', file: './routes/auth' },
  { path: '/api/blog', file: './routes/blog' },
  { path: '/api/caption', file: './routes/caption' },
  { path: '/api/commercial', file: './routes/commercial' },
  { path: '/api/flyer', file: './routes/flyer' },
  { path: '/api/food-promos', file: './routes/foodpromos' },
  { path: '/api/image-to-image', file: './routes/imageToImage' },
  { path: '/api/payments', file: './routes/payments' },
  { path: '/api/services', file: './routes/services' },
  { path: '/api/social-media', file: './routes/social-media' },
  { path: '/api/text-to-image', file: './routes/textToImage' },
  { path: '/api/text-to-video', file: './routes/textToVideo' },
  { path: '/api/tours', file: './routes/tours' },
  { path: '/api/videos', file: './routes/videos' },
  { path: '/api/voice', file: './routes/voice' }
];

console.log('Checking each route file for syntax errors...\n');

for (const { path: routePath, file } of routeFiles) {
  try {
    console.log(`Checking ${routePath} -> ${file}`);
    const route = require(file);
    
    if (typeof route !== 'function') {
      console.log(`❌ ${file}: Not a function (type: ${typeof route})`);
      continue;
    }
    
    console.log(`✅ ${file}: OK`);
    
  } catch (err) {
    console.error(`❌ ${file}: ERROR`);
    console.error(`   Message: ${err.message}`);
    if (err.stack) {
      console.error(`   Location: ${err.stack.split('\n')[1]}`);
    }
    console.log('');
  }
}

console.log('\nRoute inspection complete!');
