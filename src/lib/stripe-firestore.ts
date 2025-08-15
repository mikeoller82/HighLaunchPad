'use client';

import { 
  getFirestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData 
} from 'firebase/firestore';
import { getAuth, type User } from 'firebase/auth';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { getBaseUrl } from '@/lib/utils';
import app from 'next/app';

// Initialize Firestore
const db = getFirestore();

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export interface Product {
  id: string;
  active: boolean;
  name: string;
  description: string;
  role?: string;
  images: string[];
  metadata: Record<string, any>;
}

export interface Price {
  id: string;
  product: string | Product;
  active: boolean;
  currency: string;
  unit_amount: number;
  type: 'one_time' | 'recurring';
  interval?: 'day' | 'week' | 'month' | 'year';
  interval_count?: number;
  trial_period_days?: number;
  metadata: Record<string, any>;
}

export interface Subscription {
  id: string;
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  price: Price;
  prices: Price[];
  product: Product;
  quantity: number;
  cancel_at_period_end: boolean;
  current_period_start: number;
  current_period_end: number;
  ended_at?: number;
  cancel_at?: number;
  canceled_at?: number;
  trial_start?: number;
  trial_end?: number;
  metadata: Record<string, any>;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'processing' | 'succeeded' | 'canceled' | 'requires_payment_method';
  created: number;
  payment_method_types: string[];
}

// Get all active products with their prices
export const getProducts = (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('active', '==', true));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const products: Product[] = [];
        
        for (const productDoc of snapshot.docs) {
          const productData = { id: productDoc.id, ...productDoc.data() } as Product;
          
          // Get prices for this product
          const pricesRef = collection(db, 'products', productDoc.id, 'prices');
          const pricesQuery = query(pricesRef, where('active', '==', true));
          
          const pricesSnapshot = await new Promise<any>((resolvePrices) => {
            const unsubPrices = onSnapshot(pricesQuery, (pricesSnap) => {
              unsubPrices();
              resolvePrices(pricesSnap);
            });
          });
          
          const prices = pricesSnapshot.docs.map((priceDoc: any) => ({
            id: priceDoc.id,
            ...priceDoc.data()
          }));
          
          products.push({ ...productData, prices } as any);
        }
        
        unsubscribe();
        resolve(products);
      } catch (error) {
        unsubscribe();
        reject(error);
      }
    }, reject);
  });
};

// Get user's active subscriptions
export const getUserSubscriptions = (user: User): Promise<Subscription[]> => {
  return new Promise((resolve, reject) => {
    if (!user) {
      resolve([]);
      return;
    }

    const subscriptionsRef = collection(db, 'customers', user.uid, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('status', 'in', ['trialing', 'active']),
      orderBy('created', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subscriptions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subscription[];
      
      unsubscribe();
      resolve(subscriptions);
    }, reject);
  });
};

// Create a checkout session for subscription
export const createCheckoutSession = async (
  user: User,
  priceId: string,
  options: {
    success_url?: string;
    cancel_url?: string;
    trial_from_plan?: boolean;
    allow_promotion_codes?: boolean;
    promotion_code?: string;
    automatic_tax?: boolean;
    tax_id_collection?: boolean;
    collect_shipping_address?: boolean;
    metadata?: Record<string, any>;
  } = {}
): Promise<{ sessionId?: string; url?: string }> => {
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const checkoutSessionRef = collection(db, 'customers', user.uid, 'checkout_sessions');
  
  const sessionData = {
    price: priceId,
    success_url: options.success_url || getBaseUrl(),
    cancel_url: options.cancel_url || getBaseUrl(),
    ...options
  };

  // Add the checkout session document
  const docRef = await addDoc(checkoutSessionRef, sessionData);

  // Listen for the session to be updated with the URL
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const data = snap.data();
      if (data?.error) {
        unsubscribe();
        reject(new Error(data.error.message));
      }
      if (data?.url) {
        unsubscribe();
        resolve({ url: data.url, sessionId: data.sessionId });
      }
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      unsubscribe();
      reject(new Error('Timeout waiting for checkout session'));
    }, 10000);
  });
};

// Create a checkout session for one-time payment
export const createPaymentSession = async (
  user: User,
  priceId: string,
  options: {
    success_url?: string;
    cancel_url?: string;
    allow_promotion_codes?: boolean;
    promotion_code?: string;
    automatic_tax?: boolean;
    tax_id_collection?: boolean;
    collect_shipping_address?: boolean;
    metadata?: Record<string, any>;
  } = {}
): Promise<{ sessionId?: string; url?: string }> => {
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const checkoutSessionRef = collection(db, 'customers', user.uid, 'checkout_sessions');
  
  const sessionData = {
    mode: 'payment',
    price: priceId,
    success_url: options.success_url || getBaseUrl(),
    cancel_url: options.cancel_url || getBaseUrl(),
    ...options
  };

  // Add the checkout session document
  const docRef = await addDoc(checkoutSessionRef, sessionData);

  // Listen for the session to be updated with the URL
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const data = snap.data();
      if (data?.error) {
        unsubscribe();
        reject(new Error(data.error.message));
      }
      if (data?.url) {
        unsubscribe();
        resolve({ url: data.url, sessionId: data.sessionId });
      }
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      unsubscribe();
      reject(new Error('Timeout waiting for checkout session'));
    }, 10000);
  });
};

// Create a billing portal session
export const createPortalSession = async (
  returnUrl?: string
): Promise<{ url: string }> => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const token = await user.getIdToken();
  
  const response = await fetch('/api/stripe/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      returnUrl: returnUrl || getBaseUrl()
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create portal session');
  }

  return response.json();
};

// Listen to subscription changes
export const onSubscriptionUpdate = (
  user: User,
  callback: (subscriptions: Subscription[]) => void
): (() => void) => {
  if (!user) {
    callback([]);
    return () => {};
  }

  const subscriptionsRef = collection(db, 'customers', user.uid, 'subscriptions');
  const q = query(
    subscriptionsRef,
    where('status', 'in', ['trialing', 'active']),
    orderBy('created', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const subscriptions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Subscription[];
    
    callback(subscriptions);
  });
};

// Listen to payment changes
export const onPaymentUpdate = (
  user: User,
  callback: (payments: Payment[]) => void
): (() => void) => {
  if (!user) {
    callback([]);
    return () => {};
  }

  const paymentsRef = collection(db, 'customers', user.uid, 'payments');
  const q = query(paymentsRef, orderBy('created', 'desc'), limit(10));

  return onSnapshot(q, (snapshot) => {
    const payments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Payment[];
    
    callback(payments);
  });
};

// Redirect to checkout (convenience function)
export const redirectToCheckout = async (
  user: User,
  priceId: string,
  options?: {
    mode?: 'subscription' | 'payment';
    success_url?: string;
    cancel_url?: string;
    trial_from_plan?: boolean;
    allow_promotion_codes?: boolean;
    promotion_code?: string;
    automatic_tax?: boolean;
    tax_id_collection?: boolean;
    collect_shipping_address?: boolean;
    metadata?: Record<string, any>;
  }
): Promise<void> => {
  const { mode = 'subscription', ...sessionOptions } = options || {};
  
  let result;
  if (mode === 'payment') {
    result = await createPaymentSession(user, priceId, sessionOptions);
  } else {
    result = await createCheckoutSession(user, priceId, sessionOptions);
  }

  if (result.url) {
    window.location.href = result.url;
  } else {
    throw new Error('No checkout URL received');
  }
};

export { db, getStripe };