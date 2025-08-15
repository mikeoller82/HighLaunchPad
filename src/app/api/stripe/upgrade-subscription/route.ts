import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Upgrade subscription API called');
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Unauthorized request - missing or invalid auth header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, subscriptionId } = await request.json();
    console.log('Received upgrade request:', { priceId, subscriptionId });
    
    if (!priceId) {
      console.log('Missing priceId in request');
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    // Verify the Firebase token
    const token = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Validate the price ID exists in Stripe
    try {
      const price = await stripe.prices.retrieve(priceId);
      if (!price.active) {
        console.log('Price is not active:', priceId);
        return NextResponse.json({ error: 'The selected plan is not available' }, { status: 400 });
      }
      console.log('Price validated:', price.id);
    } catch (priceError) {
      console.error('Invalid price ID:', priceId, priceError);
      return NextResponse.json({ error: 'Invalid price ID provided' }, { status: 400 });
    }

    // Get customer info
    const customerDoc = await db.collection('customers').doc(uid).get();
    if (!customerDoc.exists || !customerDoc.data()?.stripeId) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const stripeCustomerId = customerDoc.data()!.stripeId;

    // If subscriptionId is provided, update existing subscription
    if (subscriptionId) {
      console.log('Updating existing subscription:', subscriptionId);
      
      // Get the current subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Update the subscription to the new price
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: priceId,
        }],
        proration_behavior: 'create_prorations',
      });

      // Update in Firestore
      await db.collection('customers').doc(uid)
        .collection('subscriptions').doc(subscriptionId)
        .update({
          status: updatedSubscription.status,
          updated: new Date(),
        });

      console.log('Subscription updated successfully:', subscriptionId);
      return NextResponse.json({ 
        success: true, 
        subscriptionId: updatedSubscription.id,
        status: updatedSubscription.status 
      });
    } else {
      // Create new subscription (for trial-to-paid transitions)
      console.log('Creating new subscription for customer:', stripeCustomerId);
      
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          firebaseUID: uid,
        },
      });

      console.log('Subscription created:', subscription.id);
      
      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = latestInvoice?.payment_intent as Stripe.PaymentIntent;
      
      return NextResponse.json({ 
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
        status: subscription.status
      });
    }

  } catch (error) {
    console.error('Error upgrading subscription:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to upgrade subscription' },
      { status: 500 }
    );
  }
}