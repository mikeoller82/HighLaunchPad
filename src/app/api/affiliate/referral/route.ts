import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { affiliateId, referredUserId } = await req.json();
  if (!affiliateId || !referredUserId) return NextResponse.json({ error: 'Missing affiliateId or referredUserId' }, { status: 400 });
  const referralRef = db().collection('referrals').doc();
  await referralRef.set({ affiliateId, referredUserId, status: 'pending', payoutAmount: 0, createdAt: Date.now() });
  return NextResponse.json({ success: true });
}
