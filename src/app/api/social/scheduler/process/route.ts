import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';
import { SocialAccount, PostContent } from '@/lib/social-oauth-clients';

export const dynamic = 'force-dynamic';

// POST endpoint to process scheduled posts (can be called by cron job)
export async function POST(request: NextRequest) {
    try {
        const { authKey } = await request.json();

        // Simple auth check for cron jobs - you should use a proper secret
        if (authKey !== process.env.CRON_SECRET_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminApp = getAdminApp();
        const db = getFirestore(adminApp);

        console.log('[Scheduler] Processing scheduled posts...');

        // Get all scheduled posts that are due to be published
        const now = new Date();
        const scheduledPostsSnapshot = await db
            .collectionGroup('scheduled_posts')
            .where('status', '==', 'scheduled')
            .where('scheduledTime', '<=', now)
            .get();

        if (scheduledPostsSnapshot.empty) {
            console.log('[Scheduler] No scheduled posts found');
            return NextResponse.json({
                success: true,
                message: 'No scheduled posts to process',
                processedCount: 0
            });
        }

        const socialManager = createSocialMediaManager();
        let processedCount = 0;
        let errorCount = 0;

        // Process each scheduled post
        for (const postDoc of scheduledPostsSnapshot.docs) {
            try {
                const postData = postDoc.data();
                const userId = postData.userId;

                console.log(`[Scheduler] Processing post ${postDoc.id} for user ${userId}`);

                // Get the user's social accounts
                const accountsSnapshot = await db
                    .collection('workspaces')
                    .doc(userId)
                    .collection('social_accounts')
                    .where('id', 'in', postData.accountIds)
                    .get();

                if (accountsSnapshot.empty) {
                    console.error(`[Scheduler] No accounts found for post ${postDoc.id}`);
                    await postDoc.ref.update({
                        status: 'failed',
                        error: 'No connected accounts found',
                        processedAt: new Date()
                    });
                    errorCount++;
                    continue;
                }

                const accounts: SocialAccount[] = accountsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as SocialAccount));

                // Refresh tokens if needed
                const refreshedAccounts = [];
                for (const account of accounts) {
                    if (socialManager.shouldRefreshTokens(account)) {
                        try {
                            const refreshedAccount = await socialManager.refreshTokens(account.platform as any, account);
                            
                            // Update the account in Firestore
                            await db
                                .collection('workspaces')
                                .doc(userId)
                                .collection('social_accounts')
                                .doc(account.id)
                                .update({
                                    tokens: refreshedAccount.tokens
                                });
                            
                            refreshedAccounts.push(refreshedAccount);
                        } catch (refreshError) {
                            console.error(`[Scheduler] Failed to refresh tokens for ${account.platform}:`, refreshError);
                            refreshedAccounts.push(account); // Use original account anyway
                        }
                    } else {
                        refreshedAccounts.push(account);
                    }
                }

                // Post to all platforms
                const results = await socialManager.postToMultiplePlatforms(
                    postData.content as PostContent,
                    refreshedAccounts,
                    postData.platformSpecificContent
                );

                // Store the results
                const publishedPostRef = db
                    .collection('workspaces')
                    .doc(userId)
                    .collection('posts')
                    .doc();

                const postRecord = {
                    id: publishedPostRef.id,
                    userId,
                    content: postData.content,
                    platformSpecificContent: postData.platformSpecificContent || {},
                    results,
                    status: results.every(r => r.success) ? 'published' : 'partial_failure',
                    createdAt: postData.createdAt,
                    scheduledTime: postData.scheduledTime,
                    publishedAt: new Date(),
                    originalScheduledPostId: postDoc.id
                };

                await publishedPostRef.set(postRecord);

                // Update the scheduled post status
                await postDoc.ref.update({
                    status: results.every(r => r.success) ? 'published' : 'partial_failure',
                    results,
                    processedAt: new Date(),
                    publishedPostId: publishedPostRef.id
                });

                processedCount++;
                console.log(`[Scheduler] Successfully processed post ${postDoc.id}`);

            } catch (error) {
                console.error(`[Scheduler] Error processing post ${postDoc.id}:`, error);
                
                await postDoc.ref.update({
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    processedAt: new Date()
                });
                
                errorCount++;
            }
        }

        console.log(`[Scheduler] Processed ${processedCount} posts, ${errorCount} errors`);

        return NextResponse.json({
            success: true,
            message: `Processed ${processedCount} scheduled posts`,
            processedCount,
            errorCount,
            totalFound: scheduledPostsSnapshot.size
        });

    } catch (error) {
        console.error('[Scheduler] Error processing scheduled posts:', error);
        return NextResponse.json({ 
            error: 'Failed to process scheduled posts',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET endpoint to check scheduled posts status
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Authorization token is missing' }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const db = getFirestore(adminApp);

        // Get upcoming scheduled posts across all users (for admin view)
        const now = new Date();
        const upcoming = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next 24 hours

        const upcomingPostsSnapshot = await db
            .collectionGroup('scheduled_posts')
            .where('status', '==', 'scheduled')
            .where('scheduledTime', '>=', now)
            .where('scheduledTime', '<=', upcoming)
            .orderBy('scheduledTime', 'asc')
            .limit(50)
            .get();

        const upcomingPosts = upcomingPostsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            scheduledTime: doc.data().scheduledTime?.toDate?.() || doc.data().scheduledTime,
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        }));

        // Get overdue posts
        const overduePostsSnapshot = await db
            .collectionGroup('scheduled_posts')
            .where('status', '==', 'scheduled')
            .where('scheduledTime', '<', now)
            .orderBy('scheduledTime', 'asc')
            .limit(20)
            .get();

        const overduePosts = overduePostsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            scheduledTime: doc.data().scheduledTime?.toDate?.() || doc.data().scheduledTime,
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        }));

        return NextResponse.json({
            success: true,
            upcomingPosts,
            overduePosts,
            stats: {
                upcomingCount: upcomingPosts.length,
                overdueCount: overduePosts.length
            }
        });

    } catch (error) {
        console.error('Error fetching scheduled posts status:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch scheduled posts status',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}