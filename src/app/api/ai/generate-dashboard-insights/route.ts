import { NextRequest, NextResponse } from 'next/server';
import { generateDashboardInsights } from '@/ai/flows/generate-dashboard-insights';

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
    
    const result = await generateDashboardInsights({ ...body, apiKey });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Dashboard insights generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate dashboard insights' },
      { status: 500 }
    );
  }
}