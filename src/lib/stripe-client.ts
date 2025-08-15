// src/lib/stripe-client.ts
import { loadStripe } from '@stripe/stripe-js';
import { type Firestore } from 'firebase/firestore';
import { type User } from 'firebase/auth';
import { onCurrentUserSubscriptionUpdate as _onCurrentUserSubscriptionUpdate } from './firebase-stripe-sync';
import type { SubscriptionSnapshot } from '@/types/stripe-subscription';
import { fetchWithRetry as optimizedFetch } from './optimized-fetch';

/* ------------------------------------------------------------------ */
/*  1. Checkout – drop-in replacement                                 */
/* ------------------------------------------------------------------ */
export const redirectToCheckout = async (
  _db: Firestore,          // mirror old signature
  user: User,
  priceId: string,
) => {
  if (!user) throw new Error('You must be logged in to make a purchase.');
  if (!priceId) throw new Error('No price ID was provided.');
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable. Stripe is not properly configured.');
  }

  const token = await user.getIdToken();
  
  // Use regular fetch instead of optimizedFetch to avoid JSON parsing conflicts
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ priceId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create checkout session');
  }

  const responseData = await response.json();
  const { sessionId, url } = responseData;
  
  if (url) {
    // Redirect directly to Stripe checkout
    window.location.href = url;
    return;
  } else if (sessionId) {
    // Fallback: use Stripe.js to redirect
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) throw new Error('Failed to load Stripe');
    await stripe.redirectToCheckout({ sessionId });
  } else {
    throw new Error('No session ID or URL returned from checkout creation');
  }
};

/* ------------------------------------------------------------------ */
/*  2. Customer portal – simple wrapper                               */
/* ------------------------------------------------------------------ */
export const goToBillingPortal = async (user?: User) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization if user is provided
  if (user) {
    const token = await user.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/stripe/create-portal-session', {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to create billing portal session');
  }

  // Fix potential variable name collision by being more explicit
  const responseData = await response.json();
  const { url } = responseData;
  window.location.assign(url);
};

/* ------------------------------------------------------------------ */
/*  3. Real-time Firebase snapshot → typed Subscription               */
/* ------------------------------------------------------------------ */
export const onCurrentUserSubscriptionUpdate = (
  db: Firestore,
  user: User,
  callback: (data: { subscriptions: SubscriptionSnapshot[] }) => void,
) => _onCurrentUserSubscriptionUpdate(db, user, callback);