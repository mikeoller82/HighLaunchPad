import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/ai/flows/generate-image';

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
    
    const result = await generateImage({ ...body, apiKey });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Image generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}