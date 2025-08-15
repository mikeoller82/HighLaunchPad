import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import Stripe from 'stripe';

// Initialize Stripe with error handling
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-06-20',
  });
};

const getWebhookSecret = () => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
  }
  return secret;
};

export async function POST(request: NextRequest) {
  console.log('🔔 Stripe webhook received');
  
  let stripe: Stripe;
  let event: Stripe.Event;
  
  try {
    stripe = getStripe();
    const endpointSecret = getWebhookSecret();
    
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      console.error('❌ Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      console.log(`✅ Webhook signature verified for event: ${event.type}`);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json({ 
        error: 'Webhook signature verification failed',
        details: err instanceof Error ? err.message : 'Unknown error'
      }, { status: 400 });
    }
  } catch (configError) {
    console.error('❌ Stripe configuration error:', configError);
    return NextResponse.json({ 
      error: 'Stripe configuration error',
      details: configError instanceof Error ? configError.message : 'Unknown error'
    }, { status: 500 });
  }

  const adminApp = getAdminApp();
  const db = getFirestore(adminApp);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          
          // Get the subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['items.data.price.product'],
          });
          
          // Find the customer document
          const customersSnapshot = await db.collection('customers')
            .where('stripeId', '==', customerId)
            .limit(1)
            .get();
          
          if (!customersSnapshot.empty) {
            const customerDoc = customersSnapshot.docs[0];
            const userId = customerDoc.id;
            
            // Store the subscription
            await db.collection('customers').doc(userId)
              .collection('subscriptions').doc(subscriptionId)
              .set({
                id: subscriptionId,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
                cancel_at_period_end: subscription.cancel_at_period_end,
                items: subscription.items.data.map(item => ({
                  id: item.id,
                  price: {
                    id: item.price.id,
                    product: {
                      id: item.price.product,
                      name: (item.price.product as Stripe.Product).name,
                    },
                  },
                })),
                created: new Date(subscription.created * 1000),
                updated: new Date(),
              });

            // Handle affiliate conversion tracking
            try {
              // Check if this user was referred by an affiliate
              const userReferralSnapshot = await db.collection('userReferrals')
                .where('userId', '==', userId)
                .where('hasConverted', '==', false)
                .limit(1)
                .get();

              if (!userReferralSnapshot.empty) {
                const referralDoc = userReferralSnapshot.docs[0];
                const referralData = referralDoc.data();
                
                // Calculate subscription amount (convert from cents to dollars)
                const subscriptionAmount = session.amount_total ? session.amount_total / 100 : 0;
                
                console.log(`🎯 Processing affiliate conversion for user ${userId}, amount: $${subscriptionAmount}`);
                
                // Track the conversion
                const conversionResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/affiliate/track-conversion`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    referralCode: referralData.referralCode,
                    userId: userId,
                    subscriptionAmount: subscriptionAmount,
                    subscriptionId: subscriptionId
                  })
                });

                if (conversionResponse.ok) {
                  // Mark the referral as converted
                  await referralDoc.ref.update({
                    hasConverted: true,
                    conversionTimestamp: new Date().toISOString(),
                    subscriptionAmount: subscriptionAmount,
                    subscriptionId: subscriptionId,
                  });
                  
                  console.log(`✅ Affiliate conversion tracked successfully for user ${userId}`);
                } else {
                  console.error('❌ Failed to track affiliate conversion:', await conversionResponse.text());
                }
              }
            } catch (affiliateError) {
              console.error('❌ Error processing affiliate conversion:', affiliateError);
              // Don't fail the webhook if affiliate tracking fails
            }
          }
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find the customer document
        const customersSnapshot = await db.collection('customers')
          .where('stripeId', '==', customerId)
          .limit(1)
          .get();
        
        if (!customersSnapshot.empty) {
          const customerDoc = customersSnapshot.docs[0];
          const userId = customerDoc.id;
          
          if (event.type === 'customer.subscription.deleted') {
            // Delete the subscription document
            await db.collection('customers').doc(userId)
              .collection('subscriptions').doc(subscription.id)
              .delete();
          } else {
            // Update the subscription
            await db.collection('customers').doc(userId)
              .collection('subscriptions').doc(subscription.id)
              .update({
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
                cancel_at_period_end: subscription.cancel_at_period_end,
                updated: new Date(),
              });
          }
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        // Find the customer document
        const customersSnapshot = await db.collection('customers')
          .where('stripeId', '==', customerId)
          .limit(1)
          .get();
        
        if (!customersSnapshot.empty) {
          const customerDoc = customersSnapshot.docs[0];
          const userId = customerDoc.id;
          
          // Store the payment record
          await db.collection('customers').doc(userId)
            .collection('payments').doc(invoice.id)
            .set({
              id: invoice.id,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: invoice.status,
              created: new Date(invoice.created * 1000),
              subscription_id: invoice.subscription,
            });
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        // Find the customer document
        const customersSnapshot = await db.collection('customers')
          .where('stripeId', '==', customerId)
          .limit(1)
          .get();
        
        if (!customersSnapshot.empty) {
          const customerDoc = customersSnapshot.docs[0];
          const userId = customerDoc.id;
          
          // Log the failed payment
          await db.collection('customers').doc(userId)
            .collection('payments').doc(invoice.id)
            .set({
              id: invoice.id,
              amount: invoice.amount_due,
              currency: invoice.currency,
              status: 'failed',
              created: new Date(invoice.created * 1000),
              subscription_id: invoice.subscription,
              failure_reason: 'Payment failed after trial period',
            });
          
          // If this is a subscription invoice, update the subscription status
          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
            await db.collection('customers').doc(userId)
              .collection('subscriptions').doc(subscription.id)
              .update({
                status: subscription.status,
                updated: new Date(),
              });
          }
        }
        break;
      }
      
      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find the customer document
        const customersSnapshot = await db.collection('customers')
          .where('stripeId', '==', customerId)
          .limit(1)
          .get();
        
        if (!customersSnapshot.empty) {
          const customerDoc = customersSnapshot.docs[0];
          const userId = customerDoc.id;
          
          // Update subscription with trial ending notification
          await db.collection('customers').doc(userId)
            .collection('subscriptions').doc(subscription.id)
            .update({
              trial_ending: true,
              trial_end: new Date(subscription.trial_end! * 1000),
              updated: new Date(),
            });
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}