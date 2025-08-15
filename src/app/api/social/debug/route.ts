import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';
import { SocialAccount } from '@/lib/social-oauth-clients';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Authorization token is missing' }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const db = getFirestore(adminApp);

        // Verify the user token
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        console.log(`[Debug] Starting debug for user: ${userId}`);

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

        console.log(`[Debug] Found ${accounts.length} social accounts`);

        // Initialize social media manager
        const socialManager = createSocialMediaManager();
        const supportedPlatforms = socialManager.getSupportedPlatforms();

        const debugInfo = {
            userId,
            totalAccounts: accounts.length,
            supportedPlatforms,
            accounts: accounts.map(account => ({
                id: account.id,
                platform: account.platform,
                displayName: account.displayName,
                username: account.username,
                hasTokens: !!account.tokens,
                hasAccessToken: !!account.tokens?.accessToken,
                tokenExpiry: account.tokens?.expiresAt ? new Date(account.tokens.expiresAt).toISOString() : 'Never',
                isExpired: account.tokens?.expiresAt ? account.tokens.expiresAt < Date.now() : false,
                hasPageTokens: !!account.pageTokens && Object.keys(account.pageTokens).length > 0,
                metadata: account.metadata ? Object.keys(account.metadata) : []
            })),
            environmentVariables: {
                hasFacebookConfig: !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
                hasLinkedInConfig: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
                hasTwitterConfig: !!(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET),
                baseUrl: process.env.NEXT_PUBLIC_BASE_URL
            }
        };

        // Test each account individually
        const accountTests = [];
        for (const account of accounts) {
            const client = socialManager.getClient(account.platform);
            const testResult = {
                platform: account.platform,
                hasClient: !!client,
                error: null as string | null,
                canFetchProfile: false,
                canFetchInbox: false
            };

            if (client && account.tokens?.accessToken) {
                try {
                    client.setTokens(account.tokens);
                    
                    // Test profile fetch
                    try {
                        await client.getProfile();
                        testResult.canFetchProfile = true;
                    } catch (profileError) {
                        testResult.error = `Profile fetch failed: ${profileError instanceof Error ? profileError.message : 'Unknown error'}`;
                    }

                    // Test inbox fetch
                    if (testResult.canFetchProfile) {
                        try {
                            const conversations = await client.getInboxMessages();
                            testResult.canFetchInbox = true;
                            console.log(`[Debug] ${account.platform} returned ${conversations.length} conversations`);
                        } catch (inboxError) {
                            testResult.error = `Inbox fetch failed: ${inboxError instanceof Error ? inboxError.message : 'Unknown error'}`;
                        }
                    }
                } catch (generalError) {
                    testResult.error = `General error: ${generalError instanceof Error ? generalError.message : 'Unknown error'}`;
                }
            } else if (!client) {
                testResult.error = 'No client configured for this platform';
            } else if (!account.tokens?.accessToken) {
                testResult.error = 'No access token available';
            }

            accountTests.push(testResult);
        }

        return NextResponse.json({
            success: true,
            debug: debugInfo,
            accountTests,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in debug endpoint:', error);
        return NextResponse.json({ 
            error: 'Debug failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}