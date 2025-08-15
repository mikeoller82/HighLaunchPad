import { NextRequest, NextResponse } from 'next/server';
import { generateFunnelCopy } from '@/ai/flows/generate-funnel-copy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = request.headers.get('X-API-Key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }
    
    const result = await generateFunnelCopy({ ...body, apiKey });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Funnel copy generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate funnel copy' },
      { status: 500 }
    );
  }
}