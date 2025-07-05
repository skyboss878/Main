const { API_ROUTES } = require('../shared/routes');

const routeFiles = [
  { path: API_ROUTES.AUTH, file: './routes/auth' },
  { path: API_ROUTES.BLOG, file: './routes/blog' },
  { path: API_ROUTES.CAPTION, file: './routes/caption' },
  { path: API_ROUTES.COMMERCIAL, file: './routes/commercial' },
  { path: API_ROUTES.FLYER, file: './routes/flyer' },
  { path: API_ROUTES.FOOD_PROMOS, file: './routes/foodpromos' },
  { path: API_ROUTES.IMAGE_TO_IMAGE, file: './routes/imageToImage' },
  { path: API_ROUTES.PAYMENTS, file: './routes/payments' },
  { path: API_ROUTES.SERVICES, file: './routes/services' },
  { path: API_ROUTES.SOCIAL_MEDIA, file: './routes/social-media' },
  { path: API_ROUTES.TEXT_TO_IMAGE, file: './routes/textToImage' },
  { path: API_ROUTES.TEXT_TO_VIDEO, file: './routes/textToVideo' },
  { path: API_ROUTES.TOURS, file: './routes/tours' },
  { path: API_ROUTES.VIDEOS, file: './routes/videos' },
  { path: API_ROUTES.VOICE, file: './routes/voice' }
];

console.log('Route files configuration:');
routeFiles.forEach((route, index) => {
  console.log(`${index}: path="${route.path}", file="${route.file}"`);
  
  // Check if the file exists
  try {
    require.resolve(route.file);
    console.log(`  ✅ File exists: ${route.file}`);
  } catch (err) {
    console.log(`  ❌ File missing: ${route.file}`);
  }
});
