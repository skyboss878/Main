import { api } from './src/utils/api.js';

async function testAllEndpoints() {
  console.log('🧪 Testing API endpoints...\n');
  
  const tests = [
    {
      name: 'Health Check',
      test: () => fetch('http://localhost:3001/api/health').then(r => r.json())
    },
    {
      name: 'Generate Caption',
      test: () => {
        const formData = new FormData();
        formData.append('style', 'casual');
        formData.append('text', 'test');
        return api.generateCaption(formData);
      }
    },
    // Add more endpoints as needed
  ];

  for (const { name, test } of tests) {
    try {
      console.log(`Testing ${name}...`);
      const result = await test();
      console.log(`✅ ${name}: SUCCESS`);
      console.log(`   Response:`, result);
    } catch (error) {
      console.log(`❌ ${name}: FAILED`);
      console.log(`   Error:`, error.message);
    }
    console.log('');
  }
}

testAllEndpoints();
