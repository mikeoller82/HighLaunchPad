import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
    hasStripePublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    stripeSecretPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) || 'missing',
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('STRIPE') || key.includes('FIREBASE')
    ).sort()
  });
}