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
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    // Verify the Firebase token
    const token = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get user info
    const userRecord = await auth.getUser(uid);
    
    // Check if customer already exists
    const customerDoc = await db.collection('customers').doc(uid).get();
    
    if (customerDoc.exists) {
      const customerData = customerDoc.data();
      if (customerData?.stripeId) {
        return NextResponse.json({ customerId: customerData.stripeId });
      }
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: userRecord.email,
      name: userRecord.displayName || userRecord.email?.split('@')[0],
      metadata: {
        firebaseUID: uid,
      },
    });

    // Store customer info in Firestore
    await db.collection('customers').doc(uid).set({
      stripeId: customer.id,
      email: userRecord.email,
      created: new Date(),
    }, { merge: true });

    return NextResponse.json({ customerId: customer.id });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}