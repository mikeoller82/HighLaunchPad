import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';
import { SocialAccount } from '@/lib/social-oauth-clients';

export const dynamic = 'force-dynamic';

// GET endpoint to retrieve connected social accounts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        const platform = searchParams.get('platform');

        if (!token) {
            return NextResponse.json({ error: 'Authorization token is missing' }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const db = getFirestore(adminApp);

        // Verify the user token
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        console.log(`[Social Accounts] Fetching accounts for user: ${userId}`);

        // Build query - declare as Query type to allow chaining
        let query = db
            .collection('workspaces')
            .doc(userId)
            .collection('social_accounts') as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

        if (platform) {
            query = query.where('platform', '==', platform);
        }

        const snapshot = await query.get();

        const accounts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                platform: data.platform, // Explicitly include platform property
                ...data,
                connectedAt: data.connectedAt?.toDate?.() || data.connectedAt,
                lastSynced: data.lastSynced?.toDate?.() || data.lastSynced,
                // Don't expose sensitive token data in the response
                tokens: {
                    hasAccessToken: !!data.tokens?.accessToken,
                    hasRefreshToken: !!data.tokens?.refreshToken,
                    expiresAt: data.tokens?.expiresAt,
                    tokenType: data.tokens?.tokenType,
                }
            };
        });

        // Get platform requirements for each account
        const socialManager = createSocialMediaManager();
        const accountsWithRequirements = accounts.map(account => ({
            ...account,
            platformRequirements: socialManager.getPlatformRequirements(account.platform as any),
            needsTokenRefresh: socialManager.shouldRefreshTokens(account as unknown as SocialAccount)
        }));

        return NextResponse.json({
            success: true,
            accounts: accountsWithRequirements,
            supportedPlatforms: socialManager.getSupportedPlatforms()
        });

    } catch (error) {
        console.error('Error fetching social accounts:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch social accounts',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// DELETE endpoint to disconnect a social account
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        const accountId = searchParams.get('accountId');

        if (!token || !accountId) {
            return NextResponse.json({ 
                error: 'Missing required parameters: token and accountId' 
            }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const db = getFirestore(adminApp);

        // Verify the user token
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        console.log(`[Social Accounts] Disconnecting account ${accountId} for user: ${userId}`);

        // Delete from social_accounts collection
        const accountRef = db
            .collection('workspaces')
            .doc(userId)
            .collection('social_accounts')
            .doc(accountId);

        const accountDoc = await accountRef.get();
        if (!accountDoc.exists) {
            return NextResponse.json({ 
                error: 'Account not found' 
            }, { status: 404 });
        }

        await accountRef.delete();

        // Also delete from legacy profiles collection for backward compatibility
        const legacyProfileRef = db
            .collection('workspaces')
            .doc(userId)
            .collection('profiles')
            .doc(accountId);

        const legacyDoc = await legacyProfileRef.get();
        if (legacyDoc.exists) {
            await legacyProfileRef.delete();
        }

        // Delete related conversations
        const conversationsSnapshot = await db
            .collection('workspaces')
            .doc(userId)
            .collection('conversations')
            .where('profileId', '==', accountId)
            .get();

        const batch = db.batch();
        conversationsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        if (!conversationsSnapshot.empty) {
            await batch.commit();
        }

        console.log(`[Social Accounts] Successfully disconnected account ${accountId}`);

        return NextResponse.json({
            success: true,
            message: 'Account disconnected successfully'
        });

    } catch (error) {
        console.error('Error disconnecting social account:', error);
        return NextResponse.json({ 
            error: 'Failed to disconnect account',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST endpoint to refresh account tokens
export async function POST(request: NextRequest) {
    try {
        const { token, accountId } = await request.json();

        if (!token || !accountId) {
            return NextResponse.json({ 
                error: 'Missing required parameters: token and accountId' 
            }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const db = getFirestore(adminApp);

        // Verify the user token
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        console.log(`[Social Accounts] Refreshing tokens for account ${accountId}, user: ${userId}`);

        // Get the account
        const accountRef = db
            .collection('workspaces')
            .doc(userId)
            .collection('social_accounts')
            .doc(accountId);

        const accountDoc = await accountRef.get();
        if (!accountDoc.exists) {
            return NextResponse.json({ 
                error: 'Account not found' 
            }, { status: 404 });
        }

        const account = accountDoc.data() as SocialAccount;

        // Refresh tokens
        const socialManager = createSocialMediaManager();
        
        try {
            const refreshedAccount = await socialManager.refreshTokens(account.platform as any, account);
            
            // Update the account in Firestore
            await accountRef.update({
                tokens: refreshedAccount.tokens,
                lastSynced: new Date()
            });

            console.log(`[Social Accounts] Successfully refreshed tokens for ${account.platform}`);

            return NextResponse.json({
                success: true,
                message: 'Tokens refreshed successfully',
                expiresAt: refreshedAccount.tokens.expiresAt
            });

        } catch (refreshError) {
            console.error('Failed to refresh tokens:', refreshError);
            
            // Mark account as needing reconnection
            await accountRef.update({
                needsReconnection: true,
                lastTokenRefreshError: refreshError instanceof Error ? refreshError.message : 'Unknown error',
                lastSynced: new Date()
            });

            return NextResponse.json({ 
                error: 'Failed to refresh tokens. Account may need to be reconnected.',
                details: refreshError instanceof Error ? refreshError.message : 'Unknown error',
                needsReconnection: true
            }, { status: 401 });
        }

    } catch (error) {
        console.error('Error refreshing account tokens:', error);
        return NextResponse.json({ 
            error: 'Failed to refresh tokens',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}