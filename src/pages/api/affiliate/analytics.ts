import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebase-admin';
import { getAffiliateByReferralCode } from '@/lib/affiliate-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { linkId, referralCode, userId } = req.query;

  try {
    const db = adminDb();
    
    if (userId) {
      // Ensure userId is a string (query params can be string[])
      const userIdString = Array.isArray(userId) ? userId[0] : userId;
      
      // Get analytics for all links belonging to a user
      const linksSnapshot = await db.collection('affiliateLinks')
        .where('userId', '==', userIdString)
        .get();
      
      let totalClicks = 0;
      let totalConversions = 0;
      let totalRevenue = 0;
      const linkAnalytics = [];
      
      for (const linkDoc of linksSnapshot.docs) {
        const linkData = linkDoc.data();
        const clicks = linkData.clicks || 0;
        const conversions = linkData.conversions || 0;
        const commission = linkData.commission || 0;
        
        totalClicks += clicks;
        totalConversions += conversions;
        totalRevenue += commission;
        
        linkAnalytics.push({
          linkId: linkDoc.id,
          name: linkData.name,
          slug: linkData.slug,
          clicks,
          conversions,
          revenue: commission,
          conversionRate: clicks > 0 ? (conversions / clicks * 100).toFixed(2) : '0.00'
        });
      }
      
      // Also get affiliate program analytics
      const affiliateDoc = await db.collection('affiliates').doc(userIdString).get();
      let affiliateStats = {
        totalReferrals: 0,
        totalEarnings: 0,
        pendingPayouts: 0,
        conversionRate: 0
      };
      
      if (affiliateDoc.exists) {
        const affiliateData = affiliateDoc.data();
        affiliateStats = {
          totalReferrals: affiliateData?.totalReferrals || 0,
          totalEarnings: affiliateData?.totalEarnings || 0,
          pendingPayouts: affiliateData?.pendingPayouts || 0,
          conversionRate: affiliateData?.conversionRate || 0
        };
      }
      
      return res.status(200).json({
        userId,
        totalClicks,
        totalConversions,
        totalRevenue,
        overallConversionRate: totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : '0.00',
        linkAnalytics,
        affiliateProgram: affiliateStats
      });
    }
    
    // Single link analytics
    let affiliateLinkDoc;

    if (linkId) {
      affiliateLinkDoc = await db.collection('affiliateLinks').doc(linkId as string).get();
    } else if (referralCode) {
      const affiliate = await getAffiliateByReferralCode(referralCode as string);
      if (affiliate && affiliate.id) {
        // Get all links for this affiliate
        const linksSnapshot = await db.collection('affiliateLinks')
          .where('userId', '==', affiliate.id)
          .get();
        
        if (!linksSnapshot.empty) {
          affiliateLinkDoc = linksSnapshot.docs[0]; // Get first link for now
        }
      }
    }

    if (!affiliateLinkDoc || !affiliateLinkDoc.exists) {
      return res.status(404).json({ error: 'Affiliate link not found.' });
    }

    const data = affiliateLinkDoc.data();
    const clicks = data?.clicks || 0;
    const conversions = data?.conversions || 0;
    const totalCommissionEarned = data?.commission || 0;

    // Get recent click activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentClicksSnapshot = await db.collection('affiliateClicks')
      .where('linkId', '==', affiliateLinkDoc.id)
      .where('timestamp', '>=', thirtyDaysAgo)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    const recentClicks = recentClicksSnapshot.docs.map(doc => ({
      id: doc.id,
      timestamp: doc.data().timestamp,
      userAgent: doc.data().userAgent,
      referrer: doc.data().referrer
    }));

    return res.status(200).json({
      linkId: affiliateLinkDoc.id,
      name: data?.name || 'Unnamed Link',
      slug: data?.slug || '',
      targetUrl: data?.targetUrl || '',
      clicks,
      conversions,
      revenue: totalCommissionEarned,
      conversionRate: clicks > 0 ? (conversions / clicks * 100).toFixed(2) : '0.00',
      recentClicks,
      status: data?.status || 'Active'
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: error.message || 'Internal server error.' });
  }
}
