const { Clerk } = require('@clerk/clerk-sdk-node');

const clerk = new Clerk({ 
  secretKey: 'sk_test_zbzNHXOKFn9VGP9ioioYwsf8MJSjIozK1AlblrjCge'
});

async function testAuthSimple() {
  try {
    console.log('Testing Clerk API only (basic test)...\n');
    
    // Just test if Clerk initializes and can list users
    const users = await clerk.users.getUserList();
    console.log('✅ Clerk API working! Users count:', users.length);
    console.log('\n🎉 Clerk is properly configured!');
    
  } catch (error) {
    console.error('❌ Clerk test failed:', error.message);
    console.log('\nCheck:');
    console.log('1. Is your Clerk Secret Key correct?');
    console.log('2. Is the key active in Clerk dashboard?');
  }
}

testAuthSimple();
