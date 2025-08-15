import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth, getAdminDb } from '@/lib/firebase-admin';
import { enhancedSocialMediaAgent } from '@/lib/ai-agents/enhanced-social-media-agent';
import { EventType } from '@/lib/ai-agents/types';

const auth = getFirebaseAuth();
const db = getAdminDb();

async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ') && !process.env.NODE_ENV?.includes('development')) {
    throw new Error('No valid authorization header');
  }

  if (process.env.NODE_ENV?.includes('development')) {
    // For development, allow requests without auth
    return { uid: 'dev-user' };
  }

  const token = authHeader!.split('Bearer ')[1];
  const decodedToken = await auth.verifyIdToken(token);
  return decodedToken;
}

// POST /api/ai-agents/social-media - Create social media content
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    const body = await request.json();

    const { action, ...requestData } = body;

    switch (action) {
      case 'create_posts':
        const { topic, platforms, tone, count, apiKey } = requestData;

        if (!topic) {
          return NextResponse.json(
            { success: false, error: 'Topic is required' },
            { status: 400 }
          );
        }

        const socialRequest = {
          topic: topic,
          platforms: platforms || ['twitter', 'linkedin', 'facebook'],
          tone: tone || 'professional',
          count: count || 3,
          apiKey: process.env.GEMINI_API_KEY || apiKey
        };

        if (!socialRequest.apiKey) {
          return NextResponse.json(
            { success: false, error: 'API key is required for content generation' },
            { status: 400 }
          );
        }

        // Generate social media posts
        const generatedPosts = await enhancedSocialMediaAgent.generateSocialPosts(socialRequest);

        // Save the generated posts to Firestore
        const postsRef = db.collection('workspaces').doc(user.uid)
          .collection('socialMediaPosts').doc();

        await postsRef.set({
          posts: generatedPosts,
          request: socialRequest,
          createdAt: new Date(),
          createdBy: user.uid,
          agentId: 'social_media',
          status: 'generated'
        });

        // Log activity
        const activityRef = db.collection('workspaces').doc(user.uid)
          .collection('agentActivities').doc();

        await activityRef.set({
          agentId: 'social_media',
          agentName: 'Social Media Agent',
          activity: `Generated ${generatedPosts.length} social media posts`,
          details: `Topic: ${topic}, Platforms: ${socialRequest.platforms.join(', ')}, Tone: ${tone}`,
          status: 'success',
          timestamp: new Date(),
          postsId: postsRef.id,
          postsCount: generatedPosts.length
        });

        return NextResponse.json({
          success: true,
          posts: generatedPosts,
          postsId: postsRef.id,
          message: 'Social media posts generated successfully'
        });

      case 'schedule_posts':
        const { posts, scheduleData } = requestData;

        if (!posts || !Array.isArray(posts)) {
          return NextResponse.json(
            { success: false, error: 'Posts array is required' },
            { status: 400 }
          );
        }

        // Schedule posts (in a real implementation, this would integrate with social media APIs)
        const scheduledPosts = posts.map((post: any, index: number) => ({
          ...post,
          scheduledFor: new Date(Date.now() + (index * 60 * 60 * 1000)), // 1 hour apart
          status: 'scheduled',
          scheduledAt: new Date()
        }));

        // Save scheduled posts to Firestore
        const scheduleRef = db.collection('workspaces').doc(user.uid)
          .collection('scheduledPosts').doc();

        await scheduleRef.set({
          posts: scheduledPosts,
          scheduleData: scheduleData,
          createdAt: new Date(),
          createdBy: user.uid,
          agentId: 'social_media',
          status: 'scheduled'
        });

        // Log activity
        const scheduleActivityRef = db.collection('workspaces').doc(user.uid)
          .collection('agentActivities').doc();

        // Fix Set iteration issue by using Array.from
        const uniquePlatforms = Array.from(new Set(scheduledPosts.map(p => p.platform)));

        await scheduleActivityRef.set({
          agentId: 'social_media',
          agentName: 'Social Media Agent',
          activity: `Scheduled ${scheduledPosts.length} social media posts`,
          details: `Posts scheduled across ${uniquePlatforms.join(', ')}`,
          status: 'success',
          timestamp: new Date(),
          scheduleId: scheduleRef.id,
          scheduledCount: scheduledPosts.length
        });

        return NextResponse.json({
          success: true,
          scheduledPosts: scheduledPosts,
          scheduleId: scheduleRef.id,
          message: 'Posts scheduled successfully'
        });

      case 'analyze_performance':
        // Create analysis event
        const analysisEvent = {
          id: `social_analysis_${Date.now()}`,
          type: EventType.DATA_UPDATED,
          timestamp: new Date(),
          source: 'api_request',
          data: { analysisType: 'social_performance', ...requestData },
          priority: 5
        };

        await enhancedSocialMediaAgent.perceive([analysisEvent]);

        // Log activity
        const analysisActivityRef = db.collection('workspaces').doc(user.uid)
          .collection('agentActivities').doc();

        await analysisActivityRef.set({
          agentId: 'social_media',
          agentName: 'Social Media Agent',
          activity: 'Analyzed social media performance',
          details: 'Performance analysis completed for recent posts',
          status: 'success',
          timestamp: new Date(),
          analysisType: 'social_performance'
        });

        return NextResponse.json({
          success: true,
          message: 'Social media performance analysis initiated',
          eventId: analysisEvent.id
        });

      case 'get_content_ideas':
        const { niche, targetAudience } = requestData;

        // Generate content ideas using the agent
        const contentIdeas = await enhancedSocialMediaAgent.generateContentIdeas({
          niche: niche || 'general business',
          targetAudience: targetAudience || 'business professionals',
          count: 10,
          apiKey: process.env.GEMINI_API_KEY || requestData.apiKey
        });

        return NextResponse.json({
          success: true,
          contentIdeas: contentIdeas,
          message: 'Content ideas generated successfully'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: create_posts, schedule_posts, analyze_performance, or get_content_ideas' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in social media agent:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process social media request'
      },
      { status: 500 }
    );
  }
}

// GET /api/ai-agents/social-media - Get social media status and content
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Get recent social media posts
    const postsRef = db.collection('workspaces').doc(user.uid)
      .collection('socialMediaPosts')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    const postsSnapshot = await postsRef.get();
    const recentPosts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));

    // Get scheduled posts
    const scheduledRef = db.collection('workspaces').doc(user.uid)
      .collection('scheduledPosts')
      .orderBy('createdAt', 'desc')
      .limit(5);

    const scheduledSnapshot = await scheduledRef.get();
    const scheduledPosts = scheduledSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));

    // Get agent activities
    const activitiesRef = db.collection('workspaces').doc(user.uid)
      .collection('agentActivities')
      .where('agentId', '==', 'social_media')
      .orderBy('timestamp', 'desc')
      .limit(5);

    const activitiesSnapshot = await activitiesRef.get();
    const recentActivities = activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));

    // Calculate stats with proper typing
    const totalPosts = recentPosts.reduce((sum, batch: any) => sum + (batch.posts?.length || 0), 0);
    const totalScheduled = scheduledPosts.reduce((sum, batch: any) => sum + (batch.posts?.length || 0), 0);
    const platforms = Array.from(new Set(
      recentPosts.flatMap((batch: any) =>
        batch.posts?.map((post: any) => post.platform) || []
      )
    ));

    return NextResponse.json({
      success: true,
      agent: {
        id: 'social_media',
        name: 'Social Media Agent',
        status: 'active'
      },
      recentPosts: recentPosts,
      scheduledPosts: scheduledPosts,
      recentActivities: recentActivities,
      stats: {
        totalPostsGenerated: totalPosts,
        totalScheduled: totalScheduled,
        activePlatforms: platforms,
        lastActivity: recentActivities[0]?.timestamp || null
      }
    });

  } catch (error) {
    console.error('Error fetching social media status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch social media status'
      },
      { status: 500 }
    );
  }
}