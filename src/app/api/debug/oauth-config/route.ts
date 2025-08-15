import { NextResponse } from 'next/server';
import { createSocialMediaManager } from '@/lib/social-media-manager';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const socialManager = createSocialMediaManager();
    const supportedPlatforms = socialManager.getSupportedPlatforms();
    
    const config = {
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      supportedPlatforms,
      hasLinkedInCredentials: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
      hasTwitterCredentials: !!(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET),
      hasFacebookCredentials: !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
      redirectUris: {
        linkedin: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/linkedin/callback`,
        twitter: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/twitter/callback`,
        facebook: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/facebook/callback`,
      },
      environment: process.env.NODE_ENV,
    };

    // Test auth URL generation
    const authUrls: { [key: string]: string | string } = {};
    for (const platform of supportedPlatforms) {
      try {
        const authUrl = socialManager.getAuthUrl(platform, 'test-state-123');
        authUrls[platform] = `Generated successfully (${authUrl.length} chars)`;
      } catch (error) {
        authUrls[platform] = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    return NextResponse.json({
      success: true,
      config,
      authUrls,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}