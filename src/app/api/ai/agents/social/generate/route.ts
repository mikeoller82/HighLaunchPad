import { NextRequest, NextResponse } from 'next/server';
import { enhancedSocialMediaAgent } from '@/lib/ai-agents/enhanced-social-media-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.topic || !body.niche) {
      return NextResponse.json(
        { error: 'Topic and niche are required' },
        { status: 400 }
      );
    }

    if (!body.apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Check if niche is set
    const currentNiche = enhancedSocialMediaAgent.getUserNiche();
    if (!currentNiche || currentNiche !== body.niche) {
      return NextResponse.json(
        { error: 'Please set the niche first using the set-niche endpoint' },
        { status: 400 }
      );
    }

    // Generate social media content
    const requestId = await enhancedSocialMediaAgent.requestSocialContent({
      niche: body.niche,
      topic: body.topic,
      platforms: body.platforms || ['twitter', 'linkedin'],
      tone: body.tone || 'professional',
      contentType: body.contentType || 'post',
      targetAudience: body.targetAudience || 'general audience',
      callToAction: body.callToAction || 'Engage with this content',
      hashtags: body.hashtags || [],
      apiKey: body.apiKey
    });

    // Get scheduled posts
    const scheduledPosts = enhancedSocialMediaAgent.getScheduledPosts();
    
    return NextResponse.json({
      success: true,
      requestId,
      message: `Social media content generated and scheduled for ${body.platforms?.join(', ') || 'default platforms'}`,
      scheduledPosts: scheduledPosts.slice(-5) // Return last 5 scheduled posts
    });

  } catch (error) {
    console.error('Social media generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate social media content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}