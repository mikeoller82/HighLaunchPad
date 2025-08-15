import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { referralCode, userId, subscriptionAmount, subscriptionId } = await req.json();
    
    if (!referralCode || !userId || !subscriptionAmount) {
      return NextResponse.json(
        { error: 'Missing required fields: referralCode, userId, and subscriptionAmount are required' }, 
        { status: 400 }
      );
    }

    const db = adminDb();
    
    // Find affiliate by referral code
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
    const affiliateData = affiliateDoc.data();
    const affiliateId = affiliateDoc.id;
    
    // Calculate commission (30% for tier 1)
    const commissionRate = affiliateData.commissionRates?.tier1 || 0.30;
    const commissionAmount = subscriptionAmount * commissionRate;
    
    // Update affiliate stats
    const newConversions = (affiliateData.conversions || 0) + 1;
    const newTotalReferrals = (affiliateData.totalReferrals || 0) + 1;
    const newPendingPayouts = (affiliateData.pendingPayouts || 0) + commissionAmount;
    const newTotalEarnings = (affiliateData.totalEarnings || 0) + commissionAmount;
    
    // Calculate new conversion rate
    const totalClicks = affiliateData.clicks || 0;
    const newConversionRate = totalClicks > 0 ? newConversions / totalClicks : 0;

    await affiliateDoc.ref.update({
      conversions: newConversions,
      totalReferrals: newTotalReferrals,
      pendingPayouts: newPendingPayouts,
      totalEarnings: newTotalEarnings,
      conversionRate: newConversionRate,
      lastActivity: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create conversion record
    const conversionRef = db.collection('affiliateConversions').doc();
    await conversionRef.set({
      affiliateId,
      referralCode,
      convertedUserId: userId,
      subscriptionId: subscriptionId || '',
      subscriptionAmount,
      commissionAmount,
      commissionRate,
      status: 'pending', // pending, paid, cancelled
      timestamp: new Date().toISOString(),
      payoutDate: null,
      // Additional tracking
      tier: 1, // Direct referral
      monthYear: new Date().toISOString().slice(0, 7), // YYYY-MM for monthly tracking
    });

    // Update referral record
    const referralRef = db.collection('referrals').doc();
    await referralRef.set({
      affiliateId,
      referredUserId: userId,
      status: 'converted',
      payoutAmount: commissionAmount,
      subscriptionAmount,
      createdAt: new Date().toISOString(),
      convertedAt: new Date().toISOString(),
    });

    // Check for tier 2 commissions (if this affiliate was referred by someone else)
    const parentAffiliateQuery = await db.collection('referrals')
      .where('referredUserId', '==', affiliateId)
      .where('status', '==', 'converted')
      .limit(1)
      .get();

    if (!parentAffiliateQuery.empty) {
      const parentReferral = parentAffiliateQuery.docs[0].data();
      const parentAffiliateId = parentReferral.affiliateId;
      
      // Calculate tier 2 commission (10%)
      const tier2Rate = 0.10;
      const tier2Commission = subscriptionAmount * tier2Rate;
      
      // Update parent affiliate
      const parentAffiliateRef = db.collection('affiliates').doc(parentAffiliateId);
      const parentAffiliateDoc = await parentAffiliateRef.get();
      
      if (parentAffiliateDoc.exists) {
        const parentData = parentAffiliateDoc.data();
        await parentAffiliateRef.update({
          pendingPayouts: (parentData?.pendingPayouts || 0) + tier2Commission,
          totalEarnings: (parentData?.totalEarnings || 0) + tier2Commission,
          updatedAt: new Date().toISOString(),
        });

        // Create tier 2 conversion record
        const tier2ConversionRef = db.collection('affiliateConversions').doc();
        await tier2ConversionRef.set({
          affiliateId: parentAffiliateId,
          referralCode: parentData?.referralCode || '',
          convertedUserId: userId,
          subscriptionId: subscriptionId || '',
          subscriptionAmount,
          commissionAmount: tier2Commission,
          commissionRate: tier2Rate,
          status: 'pending',
          timestamp: new Date().toISOString(),
          payoutDate: null,
          tier: 2, // Sub-affiliate commission
          monthYear: new Date().toISOString().slice(0, 7),
          parentConversionId: conversionRef.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Conversion tracked successfully',
      commissionAmount,
      tier2Commission: parentAffiliateQuery.empty ? 0 : subscriptionAmount * 0.10,
    });

  } catch (error) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}