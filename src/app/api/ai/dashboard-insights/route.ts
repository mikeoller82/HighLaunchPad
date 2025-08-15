import { NextRequest, NextResponse } from 'next/server';
// Temporarily disabled due to OpenTelemetry build issues
// import { generateDashboardInsights } from '@/ai/flows/generate-dashboard-insights';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metrics, funnels } = body;
    const apiKey = request.headers.get('X-API-Key');

    // Temporarily return mock insights until OpenTelemetry issues are resolved
    const insights = {
      summary: "Dashboard insights are temporarily unavailable due to system maintenance.",
      recommendations: [
        "Continue monitoring your affiliate performance",
        "Check back later for AI-powered insights"
      ],
      metrics: metrics || {},
      funnels: funnels || []
    };

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating dashboard insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}