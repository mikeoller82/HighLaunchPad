import { NextRequest, NextResponse } from 'next/server';
import { generateProductReviewFlow } from '@/ai/flows/generate-product-review';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await generateProductReviewFlow(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Product review generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate product review' },
      { status: 500 }
    );
  }
}