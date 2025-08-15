import { NextRequest, NextResponse } from 'next/server';
import { generateAdCopy } from '@/ai/flows/generate-ad-copy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = request.headers.get('X-API-Key');
    
    console.log('Ad copy generation request:', { body, hasApiKey: !!apiKey });
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }
    
    const result = await generateAdCopy({ ...body, apiKey });
    
    console.log('Ad copy generation result:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ad copy generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ad copy', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}