import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/services/stripe.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Create checkout session API called');
    
    // Direct validation with fallback for deployment configuration issues
    const secretKey = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!secretKey) {
      console.error('❌ STRIPE_SECRET_KEY not found in environment');
      console.error('Available Stripe env vars:', Object.keys(process.env).filter(key => key.includes('STRIPE')));
      return NextResponse.json({ 
        error: 'Server configuration error: Stripe not properly configured. Please contact support.',
        details: 'Missing STRIPE_SECRET_KEY'
      }, { status: 500 });
    }

    if (!publishableKey) {
      console.error('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found in environment');
      return NextResponse.json({ 
        error: 'Server configuration error: Stripe not properly configured. Please contact support.',
        details: 'Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
      }, { status: 500 });
    }

    console.log('✅ Stripe environment variables validated');
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Unauthorized request - missing or invalid auth header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await request.json();
    console.log('Received priceId:', priceId);
    
    if (!priceId) {
      console.log('Missing priceId in request');
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Extract token
    const token = authHeader.substring(7);
    
    // Use the service helper
    const session = await createCheckoutSession({
      priceId,
      metadata: { source: 'api_endpoint' },
    }, token);

    console.log('Checkout session created successfully:', session.id);
    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    let errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
    let statusCode = 500;
    
    // Enhanced error handling
    if (errorMessage.includes('already have an active subscription')) {
      statusCode = 400;
    } else if (errorMessage.includes('Missing STRIPE_SECRET_KEY') || 
               errorMessage.includes('Stripe configuration error') ||
               errorMessage.includes('Invalid STRIPE_SECRET_KEY')) {
      errorMessage = 'Server configuration error: Stripe not properly configured. Please contact support.';
      statusCode = 500;
    } else if (errorMessage.includes('No such price')) {
      errorMessage = 'The selected plan is not available. Please try again or contact support.';
      statusCode = 400;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}