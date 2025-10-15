const axios = require('axios');

async function testAPI() {
  console.log('🧪 Testing Shelter Match API...\n');
  
  try {
    // Test backend health
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get('http://localhost:5001/api/health');
    console.log('✅ Backend health:', healthResponse.data);
    
    // Test shelters endpoint
    console.log('\n2. Testing shelters endpoint...');
    const sheltersResponse = await axios.get('http://localhost:5001/api/shelters');
    console.log('✅ Found', sheltersResponse.data.shelters.length, 'shelters');
    sheltersResponse.data.shelters.forEach(shelter => {
      console.log(`   - ${shelter.name}: ${shelter.capacity.availableBeds}/${shelter.capacity.totalBeds} beds available`);
    });
    
    // Test jobs endpoint
    console.log('\n3. Testing jobs endpoint...');
    const jobsResponse = await axios.get('http://localhost:5001/api/jobs');
    console.log('✅ Found', jobsResponse.data.jobs.length, 'jobs');
    jobsResponse.data.jobs.forEach(job => {
      console.log(`   - ${job.title} at ${job.company.name}`);
    });
    
    // Test authentication
    console.log('\n4. Testing authentication...');
    const authResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Authentication working:', authResponse.data.message);
    
    console.log('\n🎉 All API tests passed! The application is ready to use.');
    console.log('\n📱 Frontend: http://localhost:3000');
    console.log('🔧 Backend: http://localhost:5001');
    console.log('\nYou can now open http://localhost:3000 in your browser to test the full application!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
