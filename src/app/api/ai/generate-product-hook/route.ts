import { NextRequest, NextResponse } from 'next/server';
import { generateProductHookFlow } from '@/ai/flows/generate-product-hook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await generateProductHookFlow(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Product hook generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate product hooks' },
      { status: 500 }
    );
  }
}