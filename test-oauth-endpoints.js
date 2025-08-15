// Test script to verify OAuth endpoints are accessible
const testOAuthEndpoints = async () => {
  const baseUrl = 'http://localhost:3000';
  const platforms = ['facebook', 'instagram', 'linkedin', 'twitter'];
  
  console.log('🔍 Testing OAuth endpoints...\n');
  
  for (const platform of platforms) {
    try {
      console.log(`Testing ${platform.toUpperCase()} connect endpoint...`);
      
      // Test the connect endpoint (should return 400 for missing token)
      const connectResponse = await fetch(`${baseUrl}/api/oauth/${platform}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Empty body to test error handling
      });
      
      const connectData = await connectResponse.json();
      
      if (connectResponse.status === 400 && connectData.error?.includes('token')) {
        console.log(`✅ ${platform} connect endpoint working (returns expected error)`);
      } else {
        console.log(`❌ ${platform} connect endpoint unexpected response:`, connectData);
      }
      
      // Test the callback endpoint (should redirect)
      console.log(`Testing ${platform.toUpperCase()} callback endpoint...`);
      const callbackResponse = await fetch(`${baseUrl}/api/oauth/${platform}/callback`, {
        redirect: 'manual' // Don't follow redirects
      });
      
      if (callbackResponse.status === 302 || callbackResponse.status === 307) {
        const location = callbackResponse.headers.get('location');
        if (location?.includes('oauth-success')) {
          console.log(`✅ ${platform} callback endpoint working (redirects to oauth-success)`);
        } else {
          console.log(`⚠️  ${platform} callback redirects to: ${location}`);
        }
      } else {
        console.log(`❌ ${platform} callback unexpected status: ${callbackResponse.status}`);
      }
      
      console.log(''); // Empty line for readability
      
    } catch (error) {
      console.error(`❌ Error testing ${platform}:`, error.message);
      console.log('');
    }
  }
  
  console.log('🏁 OAuth endpoint testing complete!');
};

// Run the test
testOAuthEndpoints().catch(console.error);