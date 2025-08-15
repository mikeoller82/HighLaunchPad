import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, displayName } = await req.json();
    
    // Validate required fields
    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and email are required' }, 
        { status: 400 }
      );
    }

    const db = adminDb();
    const affiliateRef = db.collection('affiliates').doc(userId);
    
    // Check if user is already an affiliate
    const existingAffiliate = await affiliateRef.get();
    if (existingAffiliate.exists) {
      const data = existingAffiliate.data();
      return NextResponse.json({
        success: true,
        affiliate: {
          referralCode: data?.referralCode,
          totalReferrals: data?.totalReferrals || 0,
          totalEarnings: data?.totalEarnings || 0,
          pendingPayouts: data?.pendingPayouts || 0,
          conversionRate: data?.conversionRate || 0,
          isActive: data?.isActive !== false,
        },
        message: 'Already registered as affiliate'
      });
    }

    // Generate unique referral code
    const referralCode = nanoid(8);
    
    // Verify referral code is unique
    const existingCodeQuery = await db.collection('affiliates')
      .where('referralCode', '==', referralCode)
      .limit(1)
      .get();
    
    if (!existingCodeQuery.empty) {
      // Regenerate if collision (very unlikely with nanoid)
      const newReferralCode = nanoid(10);
      await createAffiliateRecord(db, userId, email, displayName, newReferralCode);
      return NextResponse.json({
        success: true,
        affiliate: {
          referralCode: newReferralCode,
          totalReferrals: 0,
          totalEarnings: 0,
          pendingPayouts: 0,
          conversionRate: 0,
          isActive: true,
        }
      });
    }

    // Create affiliate record
    await createAffiliateRecord(db, userId, email, displayName, referralCode);
    
    return NextResponse.json({
      success: true,
      affiliate: {
        referralCode,
        totalReferrals: 0,
        totalEarnings: 0,
        pendingPayouts: 0,
        conversionRate: 0,
        isActive: true,
      }
    });

  } catch (error) {
    console.error('Affiliate signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' }, 
      { status: 500 }
    );
  }
}

async function createAffiliateRecord(
  db: FirebaseFirestore.Firestore, 
  userId: string, 
  email: string, 
  displayName: string | undefined, 
  referralCode: string
) {
  const affiliateData = {
    userId,
    email,
    displayName: displayName || email.split('@')[0],
    referralCode,
    tier: 1,
    totalReferrals: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
    conversionRate: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Commission structure
    commissionRates: {
      tier1: 0.30, // 30% for direct referrals
      tier2: 0.10, // 10% for sub-affiliates
    },
    // Tracking data
    clicks: 0,
    conversions: 0,
    lastActivity: new Date().toISOString(),
  };

  const affiliateRef = db.collection('affiliates').doc(userId);
  await affiliateRef.set(affiliateData);
  
  // Create initial tracking document
  const trackingRef = db.collection('affiliateTracking').doc(userId);
  await trackingRef.set({
    userId,
    referralCode,
    monthlyStats: {},
    createdAt: new Date().toISOString(),
  });
}
