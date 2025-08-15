import { NextRequest, NextResponse } from 'next/server';
import { createBillingPortalSession } from '@/services/stripe.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Create billing portal session API called');
    
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract token
    const token = authHeader.substring(7);
    
    // Use the service helper
    const { url } = await createBillingPortalSession(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?tab=billing`,
      token
    );

    return NextResponse.json({ url });

  } catch (error) {
    console.error('Error creating billing portal session:', error);
    
    let errorMessage = error instanceof Error ? error.message : 'Failed to create billing portal session';
    let statusCode = 500;
    
    // Enhanced error handling
    if (errorMessage.includes('not found')) {
      statusCode = 404;
    } else if (errorMessage.includes('Missing STRIPE_SECRET_KEY') || 
               errorMessage.includes('Stripe configuration error') ||
               errorMessage.includes('Invalid STRIPE_SECRET_KEY')) {
      errorMessage = 'Server configuration error: Stripe not properly configured. Please contact support.';
      statusCode = 500;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}