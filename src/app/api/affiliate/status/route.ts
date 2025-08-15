import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' }, 
        { status: 400 }
      );
    }

    const db = adminDb();
    const affiliateRef = db.collection('affiliates').doc(userId);
    const affiliateDoc = await affiliateRef.get();
    
    if (!affiliateDoc.exists) {
      return NextResponse.json({
        success: true,
        affiliate: null,
        message: 'User is not an affiliate'
      });
    }

    const data = affiliateDoc.data();
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to retrieve affiliate data' }, 
        { status: 500 }
      );
    }

    // Calculate conversion rate
    const conversionRate = data.clicks > 0 ? data.conversions / data.clicks : 0;

    const affiliate = {
      referralCode: data.referralCode,
      totalReferrals: data.totalReferrals || 0,
      totalEarnings: data.totalEarnings || 0,
      pendingPayouts: data.pendingPayouts || 0,
      conversionRate: conversionRate,
      isActive: data.isActive !== false,
      clicks: data.clicks || 0,
      conversions: data.conversions || 0,
      tier: data.tier || 1,
      createdAt: data.createdAt,
      lastActivity: data.lastActivity,
    };

    return NextResponse.json({
      success: true,
      affiliate
    });

  } catch (error) {
    console.error('Affiliate status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' }, 
      { status: 500 }
    );
  }
}