// Simple test script for ad copy generation
const testAdCopy = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/ai/generate-ad-copy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key' // You'll need to replace with actual key
      },
      body: JSON.stringify({
        product: 'AI-powered project management tool',
        audience: 'Small business owners and entrepreneurs',
        platform: 'Facebook'
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Test error:', error);
  }
};

testAdCopy();