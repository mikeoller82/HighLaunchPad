import Stripe from 'stripe';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

const getStripe = (): Stripe => {
  // Use fallback for configuration issues where secret key might be in NEXT_PUBLIC_ (which shouldn't happen but handles deployment issues)
  const secretKey = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('❌ STRIPE_SECRET_KEY environment variable is missing');
    console.error('Available Stripe env vars:', Object.keys(process.env).filter(key => key.includes('STRIPE')));
    throw new Error('Missing STRIPE_SECRET_KEY environment variable. Please configure Stripe in your deployment environment.');
  }

  // Validate key format
  if (!secretKey.startsWith('sk_')) {
    console.error('❌ Invalid Stripe secret key format');
    throw new Error('Invalid STRIPE_SECRET_KEY format. Must start with sk_');
  }

  // Log key type for debugging (without exposing the key)
  const keyType = secretKey.startsWith('sk_live_') ? 'LIVE' : 
                  secretKey.startsWith('sk_test_') ? 'TEST' : 'UNKNOWN';
  console.log(`🔑 Initializing Stripe with ${keyType} key`);

  return new Stripe(secretKey, {
    apiVersion: '2024-06-20',
  });
};

export interface CreateCheckoutOptions {
  priceId: string;
  customerId?: string;
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

export const createCheckoutSession = async (
  options: CreateCheckoutOptions,
  authToken?: string
): Promise<Stripe.Checkout.Session> => {
  const { priceId, customerId, metadata = {}, successUrl, cancelUrl } = options;

  let stripeCustomerId = customerId;
  let firebaseUid: string | undefined;

  // If no customerId provided but we have an auth token, get/create customer
  if (!stripeCustomerId && authToken) {
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    const decodedToken = await auth.verifyIdToken(authToken);
    firebaseUid = decodedToken.uid;

    // Get user info
    const userRecord = await auth.getUser(firebaseUid);
    
    // Get or create Stripe customer
    const customerDoc = await db.collection('customers').doc(firebaseUid).get();
    
    if (customerDoc.exists && customerDoc.data()?.stripeId) {
      stripeCustomerId = customerDoc.data()!.stripeId;
    } else {
      // Create new Stripe customer
      const customer = await getStripe().customers.create({
        email: userRecord.email,
        name: userRecord.displayName || userRecord.email?.split('@')[0],
        metadata: {
          firebaseUID: firebaseUid,
        },
      });
      
      stripeCustomerId = customer.id;
      
      // Store customer info in Firestore
      await db.collection('customers').doc(firebaseUid).set({
        stripeId: customer.id,
        email: userRecord.email,
        created: new Date(),
      }, { merge: true });
    }

    // Check for existing active subscriptions
    const existingSubscriptions = await db.collection('customers').doc(firebaseUid)
      .collection('subscriptions')
      .where('status', 'in', ['active', 'trialing'])
      .get();

    if (!existingSubscriptions.empty) {
      throw new Error('You already have an active subscription. Please manage it from the billing portal.');
    }
  }

  // Validate the price ID exists in Stripe
  const price = await getStripe().prices.retrieve(priceId);
  if (!price.active) {
    throw new Error('The selected plan is not available');
  }

  // Create checkout session
  const session = await getStripe().checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings?tab=billing&success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings?tab=billing&cancelled=true`,
    metadata: {
      ...metadata,
      ...(firebaseUid && { firebaseUID: firebaseUid }),
    },
    subscription_data: {
      metadata: {
        ...metadata,
        ...(firebaseUid && { firebaseUID: firebaseUid }),
      },
    },
  });

  return session;
};

export const createBillingPortalSession = async (
  returnUrl: string,
  authToken?: string
): Promise<{ url: string }> => {
  let stripeCustomerId: string;

  if (authToken) {
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    const decodedToken = await auth.verifyIdToken(authToken);
    const firebaseUid = decodedToken.uid;

    // Get the customer's Stripe customer ID from Firestore
    const customerDoc = await db.collection('customers').doc(firebaseUid).get();
    
    if (!customerDoc.exists) {
      throw new Error('Customer not found');
    }

    const customerData = customerDoc.data();
    stripeCustomerId = customerData?.stripeId;

    if (!stripeCustomerId) {
      throw new Error('Stripe customer ID not found');
    }
  } else {
    throw new Error('Authentication token required');
  }

  // Create a billing portal session
  const session = await getStripe().billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });

  return { url: session.url };
};