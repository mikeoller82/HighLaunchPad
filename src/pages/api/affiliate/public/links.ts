import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/lib/db';

// This endpoint is for the public/landing page affiliate links
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Fetch all public/active affiliate links (not user-specific)
      const linksRef = firestore().collection('affiliateLinks');
      const snapshot = await linksRef.where('status', '==', 'Active').get();
      const links = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ links });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Public affiliate links API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
