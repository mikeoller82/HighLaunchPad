import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🧪 Testing Stripe configuration...');
    
    // Check environment variables with fallback for configuration issues
    const secretKey = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    const envStatus = {
      STRIPE_SECRET_KEY: secretKey ? '✅ Present' : '❌ Missing',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: publishableKey ? '✅ Present' : '❌ Missing',
      STRIPE_WEBHOOK_SECRET: webhookSecret ? '✅ Present' : '❌ Missing',
      NEXT_PUBLIC_STRIPE_PRO_PRICE_ID: priceId ? '✅ Present' : '❌ Missing',
      NEXT_PUBLIC_BASE_URL: baseUrl ? '✅ Present' : '❌ Missing',
    };
    
    // Direct environment variable check
    if (!secretKey) {
      return NextResponse.json({ 
        success: false,
        error: 'STRIPE_SECRET_KEY environment variable not found',
        envStatus,
        availableEnvVars: Object.keys(process.env).filter(key => 
          key.includes('STRIPE') || key.includes('FIREBASE')
        ).sort(),
        debugInfo: {
          STRIPE_SECRET_KEY_exists: !!process.env.STRIPE_SECRET_KEY,
          NEXT_PUBLIC_STRIPE_SECRET_KEY_exists: !!process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
          secretKeyValue: secretKey ? 'present' : 'missing'
        }
      }, { status: 500 });
    }

    // Validate key format
    if (!secretKey.startsWith('sk_')) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid STRIPE_SECRET_KEY format - must start with sk_',
        envStatus,
        debugInfo: {
          keyPrefix: secretKey.substring(0, 3),
          keyLength: secretKey.length
        }
      }, { status: 500 });
    }

    const keyType = secretKey.startsWith('sk_live_') ? 'LIVE' : 
                    secretKey.startsWith('sk_test_') ? 'TEST' : 'UNKNOWN';
    
    console.log(`🔑 Using ${keyType} Stripe key`);

    // Initialize Stripe directly
    const stripe = new Stripe(secretKey, { 
      apiVersion: '2024-06-20',
      typescript: true
    });
    
    console.log(`🔑 Using ${keyType} Stripe key`);

    // Test API call - get account info
    console.log('📡 Testing Stripe API connection...');
    const account = await stripe.accounts.retrieve();
    
    // Test price retrieval if price ID is available
    let priceInfo = null;
    if (priceId) {
      try {
        console.log('💰 Testing price retrieval...');
        const price = await stripe.prices.retrieve(priceId);
        priceInfo = {
          id: price.id,
          active: price.active,
          currency: price.currency,
          unit_amount: price.unit_amount,
          type: price.type,
          product: typeof price.product === 'string' ? price.product : price.product?.id
        };
      } catch (priceError) {
        console.error('❌ Price retrieval failed:', priceError);
        priceInfo = { error: priceError instanceof Error ? priceError.message : 'Unknown error' };
      }
    }
    
    // Test webhook endpoint accessibility
    let webhookTest = null;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com';
      const webhookUrl = `${baseUrl}/api/stripe/webhook`;
      
      console.log('🔗 Testing webhook endpoint accessibility...');
      const response = await fetch(webhookUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      webhookTest = {
        url: webhookUrl,
        accessible: response.status !== 404,
        status: response.status
      };
    } catch (webhookError) {
      webhookTest = { 
        error: webhookError instanceof Error ? webhookError.message : 'Unknown error' 
      };
    }
    
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      stripe: {
        accountId: account.id,
        keyType,
        country: account.country,
        email: account.email,
        businessProfile: account.business_profile?.name,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled
      },
      configuration: {
        envStatus,
        priceInfo,
        webhookTest,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL
      }
    };
    
    console.log('✅ Stripe configuration test completed successfully');
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Stripe configuration test failed:', error);
    
    let errorMessage = 'Unknown error';
    let errorType = 'unknown';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('Invalid API Key')) {
        errorType = 'invalid_api_key';
      } else if (error.message.includes('No such')) {
        errorType = 'resource_not_found';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorType = 'network_error';
      } else if (error.message.includes('permission')) {
        errorType = 'permission_error';
      }
    }
    
    return NextResponse.json({ 
      success: false,
      error: errorMessage,
      errorType,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}