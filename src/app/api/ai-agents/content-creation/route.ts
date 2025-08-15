import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth, getAdminDb } from '@/lib/firebase-admin';
import { contentCreationAgent, BlogGenerationRequest } from '@/lib/ai-agents/content-creation-agent';

const auth = getFirebaseAuth();
const db = getAdminDb();

async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No valid authorization header');
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await auth.verifyIdToken(token);
  return decodedToken;
}

// POST /api/ai-agents/content-creation - Generate blog content
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    const body = await request.json();

    const { action, ...requestData } = body;

    switch (action) {
      case 'set_niche':
        const { niche, topics } = requestData;
        if (!niche) {
          return NextResponse.json(
            { success: false, error: 'Niche is required' },
            { status: 400 }
          );
        }

        await contentCreationAgent.setUserNiche(niche, topics || [], user.uid);
        
        return NextResponse.json({
          success: true,
          message: 'Niche set successfully',
          niche: niche,
          contentPlan: contentCreationAgent.getContentPlan()
        });

      case 'generate_blog':
        const blogRequest: BlogGenerationRequest = {
          topic: requestData.topic,
          niche: requestData.niche || contentCreationAgent.getUserNiche() || '',
          targetAudience: requestData.targetAudience || 'general audience',
          tone: requestData.tone || 'professional',
          length: requestData.length || 'medium',
          includeResearch: requestData.includeResearch !== false,
          seoKeywords: requestData.seoKeywords || [],
          outline: requestData.outline || [],
          apiKey: process.env.GEMINI_API_KEY || requestData.apiKey
        };

        if (!blogRequest.apiKey) {
          return NextResponse.json(
            { success: false, error: 'API key is required for content generation' },
            { status: 400 }
          );
        }

        if (!blogRequest.topic) {
          return NextResponse.json(
            { success: false, error: 'Topic is required' },
            { status: 400 }
          );
        }

        // Generate the blog post
        const blogPost = await contentCreationAgent.generateBlogPost(blogRequest);

        // Save the generated content to Firestore
        const contentRef = db.collection('workspaces').doc(user.uid)
          .collection('generatedContent').doc();
        
        await contentRef.set({
          type: 'blog_post',
          title: blogPost.title,
          content: blogPost,
          request: blogRequest,
          createdAt: new Date(),
          createdBy: user.uid,
          agentId: 'content_creation',
          status: 'generated'
        });

        // Log activity
        const activityRef = db.collection('workspaces').doc(user.uid)
          .collection('agentActivities').doc();
        
        await activityRef.set({
          agentId: 'content_creation',
          agentName: 'Content Creation Agent',
          activity: `Generated blog post: "${blogPost.title}"`,
          details: `${blogPost.estimatedReadTime} min read, ${blogPost.sections.length} sections, SEO score: ${blogPost.seoScore}`,
          status: 'success',
          timestamp: new Date(),
          contentId: contentRef.id,
          topic: blogRequest.topic,
          niche: blogRequest.niche
        });

        return NextResponse.json({
          success: true,
          blogPost: blogPost,
          contentId: contentRef.id,
          message: 'Blog post generated successfully'
        });

      case 'get_content_plan':
        const currentNiche = contentCreationAgent.getUserNiche();
        const contentPlan = contentCreationAgent.getContentPlan();
        
        return NextResponse.json({
          success: true,
          niche: currentNiche,
          contentPlan: contentPlan
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: set_niche, generate_blog, or get_content_plan' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in content creation agent:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process content request' 
      },
      { status: 500 }
    );
  }
}

// GET /api/ai-agents/content-creation - Get content creation status and history
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Get current niche and content plan
    const currentNiche = contentCreationAgent.getUserNiche();
    const contentPlan = contentCreationAgent.getContentPlan();

    // Get recent generated content
    const contentRef = db.collection('workspaces').doc(user.uid)
      .collection('generatedContent')
      .where('type', '==', 'blog_post')
      .orderBy('createdAt', 'desc')
      .limit(limit);
    
    const contentSnapshot = await contentRef.get();
    const recentContent = contentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));

    // Get agent activities
    const activitiesRef = db.collection('workspaces').doc(user.uid)
      .collection('agentActivities')
      .where('agentId', '==', 'content_creation')
      .orderBy('timestamp', 'desc')
      .limit(5);
    
    const activitiesSnapshot = await activitiesRef.get();
    const recentActivities = activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));

    return NextResponse.json({
      success: true,
      agent: {
        id: 'content_creation',
        name: 'Content Creation Agent',
        status: 'active',
        currentNiche: currentNiche,
        contentPlan: contentPlan
      },
      recentContent: recentContent,
      recentActivities: recentActivities,
      stats: {
        totalContentGenerated: recentContent.length,
        nicheConfigured: !!currentNiche,
        contentPlanActive: !!contentPlan
      }
    });

  } catch (error) {
    console.error('Error fetching content creation status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch content creation status' 
      },
      { status: 500 }
    );
  }
}