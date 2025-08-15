// Test script to verify Stripe configuration
const testStripeSetup = () => {
  console.log('🔍 Testing Stripe Configuration...\n');
  
  // Check environment variables
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_STRIPE_PRO_PRICE_ID',
    'STRIPE_WEBHOOK_SECRET'
  ];
  
  const missingVars = [];
  const presentVars = [];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      presentVars.push(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      missingVars.push(`❌ ${varName}: Missing`);
    }
  });
  
  console.log('📋 Environment Variables:');
  presentVars.forEach(v => console.log(`  ${v}`));
  missingVars.forEach(v => console.log(`  ${v}`));
  
  if (missingVars.length > 0) {
    console.log('\n⚠️  Missing required environment variables!');
    console.log('   Please add these to your .env.local file:');
    missingVars.forEach(v => console.log(`   ${v.replace('❌ ', '').replace(': Missing', '=your_value_here')}`));
  } else {
    console.log('\n✅ All required environment variables are present!');
  }
  
  // Check if we can import Stripe
  try {
    const Stripe = require('stripe');
    console.log('\n✅ Stripe package is available');
    
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2024-06-20',
        });
        console.log('✅ Stripe client initialized successfully');
      } catch (error) {
        console.log('❌ Failed to initialize Stripe client:', error.message);
      }
    }
  } catch (error) {
    console.log('\n❌ Stripe package not found. Run: npm install stripe');
  }
  
  console.log('\n🔗 Next Steps:');
  console.log('1. Ensure all environment variables are set');
  console.log('2. Create products and prices in your Stripe dashboard');
  console.log('3. Set up webhook endpoint: /api/stripe/webhook');
  console.log('4. Test the payment flow in your application');
  
  console.log('\n🏁 Stripe configuration check complete!');
};

// Run the test
testStripeSetup();