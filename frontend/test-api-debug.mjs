import axios from 'axios';

const API_BASE = 'http://192.168.1.26:5000';

async function testAPI() {
  console.log('🔍 Testing API Connection...\n');
  
  const endpoints = [
    '/api/health',
    '/api/status', 
    '/api/caption',
    '/api/voice',
    '/api/services',
    '/api/videos',
    '/api/tours',
    '/api/flyer',
    '/api/foodpromos',
    '/api/image-to-image',
    '/api/commercial',
    '/api/text-to-image',
    '/api/text-to-video',
    '/api/social-media',
    '/api/blog',
    '/api/real-estate',
    '/api/auth/status'
  ];

  console.log(`Base URL: ${API_BASE}`);
  console.log(`Testing ${endpoints.length} endpoints...\n`);

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`, {
        timeout: 5000,
        validateStatus: () => true
      });
      
      const status = response.status;
      const statusText = response.statusText;
      
      if (status >= 200 && status < 300) {
        console.log(`✅ ${endpoint} - ${status} ${statusText}`);
      } else if (status === 404) {
        console.log(`❌ ${endpoint} - ${status} NOT FOUND`);
      } else if (status === 401) {
        console.log(`🔐 ${endpoint} - ${status} UNAUTHORIZED (needs auth)`);
      } else if (status >= 400 && status < 500) {
        console.log(`⚠️  ${endpoint} - ${status} ${statusText}`);
      } else {
        console.log(`🔥 ${endpoint} - ${status} ${statusText}`);
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`💀 ${endpoint} - CONNECTION REFUSED`);
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`⏰ ${endpoint} - TIMEOUT`);
      } else {
        console.log(`❌ ${endpoint} - ERROR: ${error.message}`);
      }
    }
  }
  
  console.log('\n🔍 Testing backend server directly...');
  try {
    const response = await axios.get(API_BASE, {
      timeout: 5000,
      validateStatus: () => true
    });
    console.log(`Backend server status: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`Backend server error: ${error.message}`);
  }
}

testAPI().catch(console.error);
