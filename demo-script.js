const axios = require('axios');

// Demo script for Congressional App Challenge video
async function runDemo() {
  console.log('🎬 Congressional App Challenge Demo Script');
  console.log('==========================================\n');
  
  try {
    // Test backend is working
    console.log('1. Testing Backend API...');
    const healthResponse = await axios.get('http://localhost:5001/api/health');
    console.log('✅ Backend is healthy:', healthResponse.data.status);
    
    // Get shelters data
    const sheltersResponse = await axios.get('http://localhost:5001/api/shelters');
    console.log('✅ Found', sheltersResponse.data.shelters.length, 'shelters');
    
    // Get jobs data
    const jobsResponse = await axios.get('http://localhost:5001/api/jobs');
    console.log('✅ Found', jobsResponse.data.jobs.length, 'job opportunities');
    
    // Test authentication
    const authResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'demo@example.com',
      password: 'password123'
    });
    console.log('✅ Authentication working');
    
    // Test ratings
    const ratingsResponse = await axios.get('http://localhost:5001/api/ratings/shelter/1');
    console.log('✅ Ratings system working:', ratingsResponse.data.ratings.length, 'reviews');
    
    console.log('\n🎉 DEMO READY FOR VIDEO!');
    console.log('========================');
    console.log('📱 Frontend: http://localhost:3000');
    console.log('🔧 Backend: http://localhost:5001');
    console.log('\n📊 Demo Data Available:');
    console.log('   - 5 Los Angeles Shelters with detailed information');
    console.log('   - 5 Job opportunities with full details');
    console.log('   - User authentication system');
    console.log('   - Ratings and reviews');
    console.log('   - Real-time messaging capabilities');
    
    console.log('\n🎬 For your video demo:');
    console.log('1. Show the beautiful homepage with animations');
    console.log('2. Navigate to shelters page (data will load via API)');
    console.log('3. Show job listings with detailed information');
    console.log('4. Demonstrate user registration and login');
    console.log('5. Highlight the responsive design on mobile');
    console.log('6. Show the real-time messaging interface');
    
    console.log('\n🏆 This app is ready to win the Congressional App Challenge!');
    
  } catch (error) {
    console.error('❌ Demo setup failed:', error.message);
    console.log('\n🔧 Quick fixes:');
    console.log('1. Make sure backend is running: cd backend && node server-test.js');
    console.log('2. Make sure frontend is running: cd frontend && npm start');
    console.log('3. Wait for both servers to start completely');
  }
}

runDemo();
