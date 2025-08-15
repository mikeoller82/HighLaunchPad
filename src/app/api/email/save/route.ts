import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { getFirebaseAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from request
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const emailData = await request.json();
    const db = firestore();

    // Create or update email document
    const emailRef = emailData.id 
      ? db.collection('emails').doc(emailData.id)
      : db.collection('emails').doc();

    const emailDoc = {
      ...emailData,
      userId,
      id: emailRef.id,
      updatedAt: new Date(),
      createdAt: emailData.createdAt ? new Date(emailData.createdAt) : new Date()
    };

    await emailRef.set(emailDoc, { merge: true });

    return NextResponse.json({
      success: true,
      email: emailDoc
    });

  } catch (error) {
    console.error('Error saving email:', error);
    return NextResponse.json(
      { error: 'Failed to save email' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const db = firestore();
    const emailsSnapshot = await db
      .collection('emails')
      .where('userId', '==', userId)
      .orderBy('updatedAt', 'desc')
      .get();

    const emails = emailsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null
    }));

    return NextResponse.json({ emails });

  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}