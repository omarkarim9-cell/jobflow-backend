const { Clerk } = require('@clerk/clerk-sdk-node');
const axios = require('axios'); // You may need to install: npm install axios

// Initialize Clerk with YOUR secret key
const clerk = new Clerk({ 
  secretKey: 'sk_test_zbzNHXOKFn9VGP9ioioYwsf8MJSjIozK1AlblrjCge'
});

async function testFullAuthFlow() {
  try {
    console.log('🔐 Testing full authentication flow...\n');
    
    // 1. Create a test user
    console.log('1. Creating test user...');
    const user = await clerk.users.createUser({
      emailAddress: ['test' + Date.now() + '@example.com'],
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('   ✅ User created:', user.id, '\n');
    
    // 2. Create a session for this user
    console.log('2. Creating user session...');
    const session = await clerk.sessions.createSession({
      userId: user.id,
      expireInMinutes: 30
    });
    console.log('   ✅ Session created:', session.id, '\n');
    
    // 3. Get the session token
    const sessionToken = session.clientSecret;
    console.log('3. Session token obtained (first 20 chars):', 
                sessionToken.substring(0, 20) + '...', '\n');
    
    // 4. Test the protected API endpoint WITH the token
    console.log('4. Testing protected endpoint WITH authentication...');
    const response = await axios.get('http://localhost:8080/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${sessionToken}`
      }
    });
    
    console.log('   ✅ SUCCESS! Protected endpoint returned:', response.data);
    console.log('\n🎉 FULL AUTHENTICATION FLOW WORKS!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('   API Error:', error.response.data);
    }
  }
}

testFullAuthFlow();