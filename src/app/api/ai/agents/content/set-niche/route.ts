import { NextRequest, NextResponse } from 'next/server';
import { contentCreationAgent } from '@/lib/ai-agents/content-creation-agent';

export async function POST(request: NextRequest) {
  try {
    const { niche, topics } = await request.json();
    
    if (!niche) {
      return NextResponse.json(
        { error: 'Niche is required' },
        { status: 400 }
      );
    }

    // Get user ID from request headers or context
    const userId = request.headers.get('x-user-id') || 'anonymous';
    
    // Set the niche for the content creation agent
    await contentCreationAgent.setUserNiche(niche, topics || [], userId);
    
    // Get the content plan
    const contentPlan = contentCreationAgent.getContentPlan();
    
    return NextResponse.json({
      success: true,
      message: `Content Creation Agent configured for "${niche}" niche`,
      niche,
      plan: contentPlan
    });

  } catch (error) {
    console.error('Content agent niche setup error:', error);
    return NextResponse.json(
      { error: 'Failed to set niche for content agent', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}