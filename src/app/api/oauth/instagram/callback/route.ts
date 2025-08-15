import { NextResponse, type NextRequest } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    let adminApp;
    try {
        adminApp = getAdminApp();
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=server_configuration_error', request.url));
    }

    const db = getFirestore(adminApp);
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=missing_code_or_state', request.url));
    }

    const stateRef = db.collection('oauth_states').doc(state);

    try {
        const stateDoc = await stateRef.get();
        if (!stateDoc.exists) {
            console.error("Invalid or expired state parameter.");
            return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=invalid_state', request.url));
        }

        const { uid: userId } = stateDoc.data() as { uid: string };
        
        await stateRef.delete();

        // Use the unified social media manager (Instagram uses Facebook OAuth)
        const socialManager = createSocialMediaManager();
        const account = await socialManager.connectAccount('instagram', code);

        // Get Instagram-specific accounts
        const instagramClient = socialManager.getClient('instagram');
        if (instagramClient) {
            instagramClient.setTokens(account.tokens);
            const instagramAccounts = await (instagramClient as any).getInstagramAccounts();
            // Ensure metadata exists before assigning
            if (!account.metadata) {
                account.metadata = {};
            }
            account.metadata.instagramAccounts = instagramAccounts;
        }

        // Store the account in Firestore with enhanced structure
        const profileRef = db.collection('workspaces').doc(userId).collection('social_accounts').doc(account.id);

        const accountData = {
            id: account.id,
            platform: 'instagram',
            platformIcon: 'Instagram',
            username: account.username,
            displayName: account.displayName,
            profilePicture: account.profilePicture,
            tokens: {
                accessToken: account.tokens.accessToken,
                refreshToken: account.tokens.refreshToken,
                expiresAt: account.tokens.expiresAt,
                tokenType: account.tokens.tokenType,
            },
            pageTokens: account.pageTokens || {},
            metadata: account.metadata,
            connectedAt: new Date(),
            lastSynced: new Date(),
        };

        await profileRef.set(accountData, { merge: true });

        // Also store in legacy profiles collection for backward compatibility
        const instagramAccounts = account.metadata?.instagramAccounts || [];
        if (instagramAccounts.length > 0) {
            const igAccount = instagramAccounts[0];
            const legacyProfileRef = db.collection('workspaces').doc(userId).collection('profiles').doc(`instagram_${igAccount.id}`);
            const legacyProfile = {
                id: `instagram_${igAccount.id}`,
                platform: 'Instagram',
                platformIcon: 'Instagram',
                name: `@${igAccount.username} (Instagram)`,
                credentials: {
                    accessToken: account.tokens.accessToken,
                    userId: igAccount.id,
                }
            };

            await legacyProfileRef.set(legacyProfile, { merge: true });
        }

        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&success=true', request.url));

    } catch (error) {
        console.error("Instagram OAuth callback error:", error);
        
        const stateDocCheck = await stateRef.get();
        if (stateDocCheck.exists) {
            await stateRef.delete();
        }
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=oauth_failed', request.url));
    }
}