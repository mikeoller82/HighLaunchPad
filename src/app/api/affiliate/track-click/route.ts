import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { referralCode, clickData } = await req.json();
    
    if (!referralCode) {
      return NextResponse.json(
        { error: 'Missing referralCode' }, 
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
    
    // Update click count
    const newClickCount = (affiliateData.clicks || 0) + 1;
    await affiliateDoc.ref.update({
      clicks: newClickCount,
      lastActivity: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Log the click for detailed tracking
    const clickLogRef = db.collection('affiliateClicks').doc();
    await clickLogRef.set({
      affiliateId: affiliateDoc.id,
      referralCode,
      timestamp: new Date().toISOString(),
      userAgent: clickData?.userAgent || '',
      ipAddress: clickData?.ipAddress || '',
      referrer: clickData?.referrer || '',
      // Additional tracking data
      sessionId: clickData?.sessionId || '',
      utm: clickData?.utm || {},
    });

    return NextResponse.json({
      success: true,
      message: 'Click tracked successfully'
    });

  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}