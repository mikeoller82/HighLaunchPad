import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';
import { SocialAccount, PostContent } from '@/lib/social-oauth-clients';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { 
            token, 
            content, 
            platforms, 
            accountIds, 
            scheduledTime,
            platformSpecificContent 
        } = await request.json();

        if (!token || !content || (!platforms && !accountIds)) {
            return NextResponse.json({ 
                error: 'Missing required parameters: token, content, and either platforms or accountIds' 
            }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const db = getFirestore(adminApp);

        // Verify the user token
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        console.log(`[Social Post] Creating post for user: ${userId}`);

        // Get connected social accounts
        const baseCollection = db
            .collection('workspaces')
            .doc(userId)
            .collection('social_accounts');

        let accountsQuery;

        if (accountIds && accountIds.length > 0) {
            // Filter by specific account IDs
            accountsQuery = baseCollection.where('id', 'in', accountIds);
        } else if (platforms && platforms.length > 0) {
            // Filter by platforms
            accountsQuery = baseCollection.where('platform', 'in', platforms);
        } else {
            // No filters, use the base collection
            accountsQuery = baseCollection;
        }

        const accountsSnapshot = await accountsQuery.get();
        
        if (accountsSnapshot.empty) {
            return NextResponse.json({ 
                error: 'No connected accounts found for the specified criteria' 
            }, { status: 404 });
        }

        const accounts: SocialAccount[] = accountsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SocialAccount));

        // Validate content for each platform
        const socialManager = createSocialMediaManager();
        const validationErrors: { [platform: string]: string[] } = {};

        for (const account of accounts) {
            const finalContent = {
                ...content,
                ...(platformSpecificContent?.[account.platform] || {})
            };

            const errors = socialManager.validateContentForPlatform(account.platform as any, finalContent);
            if (errors.length > 0) {
                validationErrors[account.platform] = errors;
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            return NextResponse.json({ 
                error: 'Content validation failed',
                validationErrors
            }, { status: 400 });
        }

        // Prepare post content
        const postContent: PostContent = {
            text: content.text || content.caption || '',
            media: content.media || [],
            link: content.link,
            scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
        };

        // If scheduled for future, store in database and return
        if (scheduledTime && new Date(scheduledTime) > new Date()) {
            const postRef = db
                .collection('workspaces')
                .doc(userId)
                .collection('scheduled_posts')
                .doc();

            const scheduledPost = {
                id: postRef.id,
                userId,
                content: postContent,
                platformSpecificContent: platformSpecificContent || {},
                accountIds: accounts.map(a => a.id),
                platforms: accounts.map(a => a.platform),
                scheduledTime: new Date(scheduledTime),
                status: 'scheduled',
                createdAt: new Date(),
            };

            await postRef.set(scheduledPost);

            return NextResponse.json({
                success: true,
                message: 'Post scheduled successfully',
                postId: postRef.id,
                scheduledTime: scheduledTime
            });
        }

        // Post immediately to all platforms
        const results = await socialManager.postToMultiplePlatforms(
            postContent,
            accounts,
            platformSpecificContent
        );

        // Store post results in database
        const postRef = db
            .collection('workspaces')
            .doc(userId)
            .collection('posts')
            .doc();

        const postRecord = {
            id: postRef.id,
            userId,
            content: postContent,
            platformSpecificContent: platformSpecificContent || {},
            results,
            status: results.every(r => r.success) ? 'published' : 'partial_failure',
            createdAt: new Date(),
            publishedAt: new Date(),
        };

        await postRef.set(postRecord);

        // Count successful and failed posts
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;

        console.log(`[Social Post] Posted to ${successCount} platforms successfully, ${failureCount} failed`);

        return NextResponse.json({
            success: successCount > 0,
            message: `Posted to ${successCount} platforms successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
            results,
            postId: postRef.id,
            successCount,
            failureCount
        });

    } catch (error) {
        console.error('Error in social post endpoint:', error);
        return NextResponse.json({ 
            error: 'Failed to create post',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET endpoint to retrieve posts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        const status = searchParams.get('status');
        const platform = searchParams.get('platform');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        if (!token) {
            return NextResponse.json({ error: 'Authorization token is missing' }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const db = getFirestore(adminApp);

        // Verify the user token
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        // Build query for published posts
        const basePostsCollection = db
            .collection('workspaces')
            .doc(userId)
            .collection('posts')
            .orderBy('createdAt', 'desc');

        let postsQuery;
        if (status) {
            postsQuery = basePostsCollection.where('status', '==', status);
        } else {
            postsQuery = basePostsCollection;
        }

        // Get published posts
        const postsSnapshot = await postsQuery.limit(limit).offset(offset).get();
        const posts = postsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            publishedAt: doc.data().publishedAt?.toDate?.() || doc.data().publishedAt,
        }));

        // Build query for scheduled posts
        const baseScheduledCollection = db
            .collection('workspaces')
            .doc(userId)
            .collection('scheduled_posts')
            .orderBy('scheduledTime', 'asc');

        let scheduledQuery;
        if (platform) {
            scheduledQuery = baseScheduledCollection.where('platforms', 'array-contains', platform);
        } else {
            scheduledQuery = baseScheduledCollection;
        }

        // Get scheduled posts
        const scheduledSnapshot = await scheduledQuery.get();
        const scheduledPosts = scheduledSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            scheduledTime: doc.data().scheduledTime?.toDate?.() || doc.data().scheduledTime,
        }));

        return NextResponse.json({
            success: true,
            posts,
            scheduledPosts,
            pagination: {
                limit,
                offset,
                hasMore: posts.length === limit
            }
        });

    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch posts',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}