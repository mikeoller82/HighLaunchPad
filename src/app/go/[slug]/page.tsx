
import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return [];
}

async function trackClick(slug: string, userAgent: string, referrer: string) {
  try {
    const db = adminDb();
    
    // Find the affiliate link by slug
    const linkQuery = await db.collection('affiliateLinks')
      .where('slug', '==', slug)
      .where('status', '==', 'Active')
      .limit(1)
      .get();

    if (linkQuery.empty) {
      console.log(`No active affiliate link found for slug: ${slug}`);
      return null;
    }

    const linkDoc = linkQuery.docs[0];
    const linkData = linkDoc.data();
    const linkId = linkDoc.id;

    // Update click count for the link
    const newClickCount = (linkData.clicks || 0) + 1;
    await linkDoc.ref.update({
      clicks: newClickCount,
      updatedAt: new Date(),
    });

    // Log the click for detailed tracking
    const clickLogRef = db.collection('affiliateClicks').doc();
    await clickLogRef.set({
      linkId: linkId,
      userId: linkData.userId,
      slug: slug,
      targetUrl: linkData.targetUrl,
      timestamp: new Date(),
      userAgent: userAgent || '',
      referrer: referrer || '',
      sessionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

    // Also update the affiliate's total click count if they have an affiliate record
    const affiliateRef = db.collection('affiliates').doc(linkData.userId);
    const affiliateDoc = await affiliateRef.get();
    
    if (affiliateDoc.exists) {
      const affiliateData = affiliateDoc.data();
      const totalClicks = (affiliateData?.clicks || 0) + 1;
      const conversions = affiliateData?.conversions || 0;
      const newConversionRate = totalClicks > 0 ? conversions / totalClicks : 0;
      
      await affiliateRef.update({
        clicks: totalClicks,
        conversionRate: newConversionRate,
        lastActivity: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      console.log(`Updated affiliate ${linkData.userId} total clicks to ${totalClicks}`);
    } else {
      console.log(`No affiliate record found for user ${linkData.userId}`);
    }

    console.log(`Click tracked for slug: ${slug}, new count: ${newClickCount}`);
    return linkData.targetUrl;
  } catch (error) {
    console.error('Error tracking click:', error);
    return null;
  }
}

export default async function AffiliateLinkPage({ params }: { params: { slug: string } }) {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  const referrer = headersList.get('referer') || '';

  console.log(`Processing affiliate link: ${params.slug}`);

  // Track the click and get the target URL
  const targetUrl = await trackClick(params.slug, userAgent, referrer);

  if (targetUrl) {
    console.log(`Redirecting to: ${targetUrl}`);
    redirect(targetUrl);
  } else {
    console.log(`No target URL found for slug: ${params.slug}, redirecting to home`);
    // Redirect to home page if the slug doesn't exist or is inactive
    redirect('/');
  }
}
