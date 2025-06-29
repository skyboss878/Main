try {
  const { API_ROUTES } = require('../shared/routes');
  console.log('API_ROUTES:', API_ROUTES);
  console.log('API_ROUTES keys:', Object.keys(API_ROUTES));
  
  // Check for undefined or malformed values
  for (const [key, value] of Object.entries(API_ROUTES)) {
    console.log(`${key}: "${value}" (type: ${typeof value})`);
    if (value === undefined || value === null || value === '') {
      console.log(`❌ Found problematic route: ${key} = ${value}`);
    }
  }
} catch (error) {
  console.log('❌ Error importing API_ROUTES:', error.message);
}
