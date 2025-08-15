import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';
import { SocialAccount } from '@/lib/social-oauth-clients';

export async function POST(request: NextRequest) {
    try {
        const { profileId, userId } = await request.json();

        if (!profileId || !userId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const adminDb = getAdminDb();

        // Try to get from new social_accounts collection first
        let accountDoc = await adminDb
            .collection('workspaces')
            .doc(userId)
            .collection('social_accounts')
            .doc(profileId)
            .get();

        // Fallback to legacy profiles collection
        if (!accountDoc.exists) {
            const profileDoc = await adminDb
                .collection('workspaces')
                .doc(userId)
                .collection('profiles')
                .doc(profileId)
                .get();

            if (!profileDoc.exists) {
                return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
            }

            const profile = profileDoc.data();
            if (profile?.platform !== 'Facebook') {
                return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
            }

            // Convert legacy profile to new format for processing
            const legacyAccount: SocialAccount = {
                id: profileId,
                platform: 'facebook',
                username: profile.name || 'Facebook Account',
                displayName: profile.name || 'Facebook Account',
                tokens: {
                    accessToken: profile.credentials?.accessToken,
                    tokenType: 'Bearer',
                    expiresAt: profile.credentials?.expiresAt,
                },
                pageTokens: {},
                metadata: { pages: profile.credentials?.pages || [] }
            };

            // Use unified social media manager
            const socialManager = createSocialMediaManager();
            const client = socialManager.getClient('facebook');
            
            if (!client) {
                return NextResponse.json({ error: 'Facebook client not configured' }, { status: 500 });
            }

            client.setTokens(legacyAccount.tokens);
            const conversations = await client.getInboxMessages();

            // Store conversations using the unified format
            let totalConversations = 0;
            const batch = adminDb.batch();

            for (const conversation of conversations) {
                const conversationRef = adminDb
                    .collection('workspaces')
                    .doc(userId)
                    .collection('conversations')
                    .doc(conversation.id);

                batch.set(conversationRef, {
                    ...conversation,
                    lastSynced: new Date(),
                    userId: userId,
                }, { merge: true });

                totalConversations++;
            }

            if (totalConversations > 0) {
                await batch.commit();
            }

            return NextResponse.json({ 
                success: true, 
                count: totalConversations,
                message: `Synced ${totalConversations} Facebook conversations`
            });
        }

        // Use new social_accounts format
        const account = accountDoc.data() as SocialAccount;
        if (account.platform !== 'facebook') {
            return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
        }

        console.log(`Syncing Facebook conversations for profile ${profileId}`);

        // Use unified social media manager
        const socialManager = createSocialMediaManager();
        
        // Check if tokens need refresh
        if (socialManager.shouldRefreshTokens(account)) {
            try {
                const refreshedAccount = await socialManager.refreshTokens('facebook', account);
                
                // Update the account in Firestore
                await accountDoc.ref.update({
                    tokens: refreshedAccount.tokens
                });
                
                account.tokens = refreshedAccount.tokens;
            } catch (refreshError) {
                console.error('Failed to refresh Facebook tokens:', refreshError);
                return NextResponse.json({ 
                    error: 'Authentication expired. Please reconnect your Facebook account.' 
                }, { status: 401 });
            }
        }

        const client = socialManager.getClient('facebook');
        if (!client) {
            return NextResponse.json({ error: 'Facebook client not configured' }, { status: 500 });
        }

        client.setTokens(account.tokens);
        const conversations = await client.getInboxMessages();

        // Store conversations using the unified format
        let totalConversations = 0;
        const batch = adminDb.batch();

        for (const conversation of conversations) {
            const conversationRef = adminDb
                .collection('workspaces')
                .doc(userId)
                .collection('conversations')
                .doc(conversation.id);

            batch.set(conversationRef, {
                ...conversation,
                lastSynced: new Date(),
                userId: userId,
            }, { merge: true });

            totalConversations++;
        }

        if (totalConversations > 0) {
            await batch.commit();
        }

        // Update last sync time
        await accountDoc.ref.update({
            lastSynced: new Date()
        });

        return NextResponse.json({ 
            success: true, 
            count: totalConversations,
            message: `Synced ${totalConversations} Facebook conversations`
        });

    } catch (error) {
        console.error('Error syncing Facebook conversations:', error);
        return NextResponse.json({ 
            error: 'Failed to sync Facebook conversations',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}