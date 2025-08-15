import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { userId, referralCode, signupTimestamp } = await req.json();
    
    if (!userId || !referralCode) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and referralCode are required' }, 
        { status: 400 }
      );
    }

    const db = adminDb();
    
    // Verify the referral code exists
    const affiliatesQuery = await db.collection('affiliates')
      .where('referralCode', '==', referralCode)
      .limit(1)
      .get();
    
    if (affiliatesQuery.empty) {
      return NextResponse.json(
        { error: 'Invalid referral code' }, 
        { status: 404 }
      );
    }

    const affiliateDoc = affiliatesQuery.docs[0];
    const affiliateId = affiliateDoc.id;

    // Store the referral relationship for future subscription tracking
    const userReferralRef = db.collection('userReferrals').doc(userId);
    await userReferralRef.set({
      userId,
      affiliateId,
      referralCode,
      signupTimestamp: signupTimestamp || new Date().toISOString(),
      hasConverted: false, // Will be set to true when they subscribe
      conversionTimestamp: null,
      subscriptionAmount: 0,
      createdAt: new Date().toISOString(),
    });

    // Also create a referral record in the referrals collection
    const referralRef = db.collection('referrals').doc();
    await referralRef.set({
      affiliateId,
      referredUserId: userId,
      status: 'signed_up', // signed_up, converted, cancelled
      payoutAmount: 0, // Will be updated on subscription
      subscriptionAmount: 0,
      createdAt: new Date().toISOString(),
      convertedAt: null,
    });

    return NextResponse.json({
      success: true,
      message: 'Referral relationship stored successfully'
    });

  } catch (error) {
    console.error('Store referral error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}