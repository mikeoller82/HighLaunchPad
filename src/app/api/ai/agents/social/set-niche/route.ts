import { NextRequest, NextResponse } from 'next/server';
import { enhancedSocialMediaAgent } from '@/lib/ai-agents/enhanced-social-media-agent';

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms } = await request.json();
    
    if (!niche) {
      return NextResponse.json(
        { error: 'Niche is required' },
        { status: 400 }
      );
    }

    // Get user ID from request headers or context
    const userId = request.headers.get('x-user-id') || 'anonymous';
    
    // Set the niche for the social media agent
    await enhancedSocialMediaAgent.setUserNiche(niche, platforms || ['twitter', 'linkedin'], userId);
    
    // Get the social media plan
    const socialPlan = enhancedSocialMediaAgent.getSocialMediaPlan();
    
    return NextResponse.json({
      success: true,
      message: `Enhanced Social Media Agent configured for "${niche}" niche`,
      niche,
      plan: socialPlan
    });

  } catch (error) {
    console.error('Social media agent niche setup error:', error);
    return NextResponse.json(
      { error: 'Failed to set niche for social media agent', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}