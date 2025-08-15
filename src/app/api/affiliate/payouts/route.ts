import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const affiliateId = searchParams.get('affiliateId');
  if (!affiliateId) return NextResponse.json({ error: 'Missing affiliateId' }, { status: 400 });
  const payoutsSnap = await db().collection('affiliatePayouts').where('affiliateId', '==', affiliateId).get();
  const payouts = payoutsSnap.docs.map(doc => doc.data());
  return NextResponse.json({ payouts });
}
