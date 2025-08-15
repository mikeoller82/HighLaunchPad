export interface ReferralTrackingData {
  referralCode?: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  utm?: Record<string, string>;
}

/**
 * Server-side function to get affiliate by referral code
 * This should only be called from API routes, not client components
 */
export async function getAffiliateByReferralCode(referralCode: string) {
  try {
    // This function should only be used in API routes where adminDb is available
    const { adminDb } = await import('@/lib/firebase-admin');
    const db = adminDb();
    const affiliatesQuery = await db.collection('affiliates')
      .where('referralCode', '==', referralCode)
      .limit(1)
      .get();
    
    if (affiliatesQuery.empty) {
      return null;
    }

    const affiliateDoc = affiliatesQuery.docs[0];
    return {
      id: affiliateDoc.id,
      ...affiliateDoc.data()
    };
  } catch (error) {
    console.error('Error getting affiliate by referral code:', error);
    return null;
  }
}

