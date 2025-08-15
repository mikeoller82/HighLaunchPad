import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';
import { SocialAccount } from '@/lib/social-oauth-clients';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { token, platforms } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Authorization token is missing' }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const db = getFirestore(adminApp);

        // Verify the user token
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        console.log(`[Unified Inbox] Syncing conversations for user: ${userId}`);

        // Get all connected social accounts
        const accountsSnapshot = await db
            .collection('workspaces')
            .doc(userId)
            .collection('social_accounts')
            .get();

        const accounts: SocialAccount[] = accountsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SocialAccount));

        // Filter by requested platforms if specified
        const filteredAccounts = platforms 
            ? accounts.filter(account => platforms.includes(account.platform))
            : accounts;

        console.log(`[Unified Inbox] Found ${accounts.length} total accounts, ${filteredAccounts.length} filtered accounts`);
        
        // Log account details for production debugging
        accounts.forEach(account => {
            console.log(`[Unified Inbox] Account: ${account.platform} - ${account.displayName || account.username} - Token expires: ${account.tokens?.expiresAt ? new Date(account.tokens.expiresAt).toISOString() : 'Never'}`);
        });

        if (filteredAccounts.length === 0) {
            return NextResponse.json({ 
                success: true, 
                totalConversations: 0,
                message: accounts.length === 0 
                    ? 'No social media accounts connected. Connect accounts in Settings to sync conversations.'
                    : 'No accounts match the requested platforms.',
                results: [],
                debug: {
                    totalAccounts: accounts.length,
                    accountPlatforms: accounts.map(a => a.platform)
                }
            });
        }

        // Initialize social media manager
        const socialManager = createSocialMediaManager();

        // Check if any clients are configured
        const supportedPlatforms = socialManager.getSupportedPlatforms();
        console.log(`[Unified Inbox] Supported platforms: ${supportedPlatforms.join(', ')}`);

        if (supportedPlatforms.length === 0) {
            console.warn('[Unified Inbox] No social media clients configured - check environment variables');
            return NextResponse.json({
                success: true,
                totalConversations: 0,
                results: [],
                message: 'No social media platforms configured. Check environment variables.'
            });
        }

        // Sync inbox for all accounts
        let syncResults;
        try {
            syncResults = await socialManager.syncAllInboxes(filteredAccounts);
        } catch (syncError) {
            console.error('[Unified Inbox] Error during syncAllInboxes:', syncError);
            return NextResponse.json({ 
                error: 'Failed to sync conversations',
                details: syncError instanceof Error ? syncError.message : 'Unknown sync error',
                stage: 'syncAllInboxes'
            }, { status: 500 });
        }

        // Store conversations in Firestore
        let totalConversations = 0;
        const results = [];

        for (const result of syncResults) {
            if (result.error) {
                console.error(`Error syncing ${result.platform}:`, result.error);
                results.push({
                    platform: result.platform,
                    success: false,
                    error: result.error,
                    count: 0
                });
                continue;
            }

            // Store conversations in Firestore
            const batch = db.batch();
            let conversationCount = 0;

            for (const conversation of result.conversations) {
                const conversationRef = db
                    .collection('workspaces')
                    .doc(userId)
                    .collection('conversations')
                    .doc(conversation.id);

                batch.set(conversationRef, {
                    ...conversation,
                    lastSynced: new Date(),
                    userId: userId,
                }, { merge: true });

                conversationCount++;
            }

            if (conversationCount > 0) {
                await batch.commit();
            }

            totalConversations += conversationCount;
            results.push({
                platform: result.platform,
                success: true,
                count: conversationCount
            });

            console.log(`[Unified Inbox] Synced ${conversationCount} conversations for ${result.platform}`);
        }

        // Update last sync time for accounts
        const updateBatch = db.batch();
        for (const account of filteredAccounts) {
            const accountRef = db
                .collection('workspaces')
                .doc(userId)
                .collection('social_accounts')
                .doc(account.id);

            updateBatch.update(accountRef, {
                lastSynced: new Date()
            });
        }
        await updateBatch.commit();

        return NextResponse.json({
            success: true,
            totalConversations,
            results,
            message: `Successfully synced ${totalConversations} conversations across ${results.length} platforms`
        });

    } catch (error) {
        console.error('Error syncing unified inbox:', error);
        return NextResponse.json({ 
            error: 'Failed to sync conversations',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET endpoint to retrieve conversations
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        const platform = searchParams.get('platform');
        const limit = parseInt(searchParams.get('limit') || '50');
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

        console.log(`[Unified Inbox] Fetching conversations for user: ${userId}`);

        // Build query
        let query = db
            .collection('workspaces')
            .doc(userId)
            .collection('conversations')
            .orderBy('updatedAt', 'desc');

        if (platform) {
            query = query.where('platform', '==', platform);
        }

        // Apply pagination
        const snapshot = await query.limit(limit).offset(offset).get();

        const conversations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
            lastSynced: doc.data().lastSynced?.toDate?.() || doc.data().lastSynced,
        }));

        // Get total count for pagination
        const totalSnapshot = await db
            .collection('workspaces')
            .doc(userId)
            .collection('conversations')
            .get();

        const totalCount = totalSnapshot.size;

        return NextResponse.json({
            success: true,
            conversations,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + limit < totalCount
            }
        });

    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch conversations',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}