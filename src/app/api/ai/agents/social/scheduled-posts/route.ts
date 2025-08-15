import { NextRequest, NextResponse } from 'next/server';
import { enhancedSocialMediaAgent } from '@/lib/ai-agents/enhanced-social-media-agent';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';
    
    // Try to get posts from Firestore first for persistence and analytics
    let firestorePosts: any[] = [];
    
    if (typeof window === 'undefined') { // Server-side
      try {
        const { db } = await import('@/lib/firebase-admin');
        if (db && userId !== 'anonymous') {
          const postsSnapshot = await db
            .collection('workspaces')
            .doc(userId)
            .collection('scheduledPosts')
            .orderBy('scheduledDate', 'desc')
            .limit(50)
            .get();
          
          firestorePosts = postsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            scheduledDate: doc.data().scheduledDate?.toDate?.() || new Date(doc.data().scheduledDate),
            actualPostDate: doc.data().actualPostDate?.toDate?.() || (doc.data().actualPostDate ? new Date(doc.data().actualPostDate) : undefined),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
          }));
        }
      } catch (firestoreError) {
        console.warn('Failed to load posts from Firestore, falling back to agent memory:', firestoreError);
      }
    }
    
    // Fallback to agent memory if Firestore fails or no posts found
    let scheduledPosts = firestorePosts;
    if (scheduledPosts.length === 0) {
      scheduledPosts = enhancedSocialMediaAgent.getScheduledPosts();
    }
    
    // Sort by scheduled date (most recent first)
    const sortedPosts = scheduledPosts.sort((a, b) => 
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );
    
    // Calculate analytics
    const analytics = {
      totalPosts: sortedPosts.length,
      scheduledCount: sortedPosts.filter(p => p.status === 'scheduled').length,
      postedCount: sortedPosts.filter(p => p.status === 'posted').length,
      failedCount: sortedPosts.filter(p => p.status === 'failed').length,
      cancelledCount: sortedPosts.filter(p => p.status === 'cancelled').length,
      platformBreakdown: sortedPosts.reduce((acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      engagementStats: sortedPosts
        .filter(p => p.engagement)
        .reduce((acc, post) => {
          if (post.engagement) {
            acc.totalLikes += post.engagement.likes || 0;
            acc.totalComments += post.engagement.comments || 0;
            acc.totalShares += post.engagement.shares || 0;
            acc.totalViews += post.engagement.views || 0;
            acc.avgEngagementRate += post.engagement.engagementRate || 0;
            acc.postCount += 1;
          }
          return acc;
        }, {
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          totalViews: 0,
          avgEngagementRate: 0,
          postCount: 0
        })
    };
    
    // Calculate average engagement rate
    if (analytics.engagementStats.postCount > 0) {
      analytics.engagementStats.avgEngagementRate = 
        analytics.engagementStats.avgEngagementRate / analytics.engagementStats.postCount;
    }
    
    return NextResponse.json({
      success: true,
      posts: sortedPosts,
      analytics,
      dataSource: firestorePosts.length > 0 ? 'firestore' : 'agent_memory'
    });

  } catch (error) {
    console.error('Scheduled posts retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve scheduled posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would cancel the scheduled post
    // For now, we'll just mark it as cancelled
    const scheduledPosts = enhancedSocialMediaAgent.getScheduledPosts();
    const post = scheduledPosts.find(p => p.id === postId);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    if (post.status === 'posted') {
      return NextResponse.json(
        { error: 'Cannot cancel a post that has already been posted' },
        { status: 400 }
      );
    }

    // Mark as cancelled
    post.status = 'cancelled' as any;
    
    return NextResponse.json({
      success: true,
      message: 'Post cancelled successfully',
      postId
    });

  } catch (error) {
    console.error('Post cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}