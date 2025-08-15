import { NextRequest, NextResponse } from 'next/server';
import { generateEmailContentFlow } from '@/ai/flows/generate-email-content';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await generateEmailContentFlow(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Email generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate email content' },
      { status: 500 }
    );
  }
}