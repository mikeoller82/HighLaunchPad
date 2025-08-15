
import { NextResponse, type NextRequest } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';
import { OAuthStateManager } from '@/lib/oauth-state-manager';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    console.log('[Twitter Callback] Starting OAuth callback process');
    console.log('[Twitter Callback] Request URL:', request.url);
    
    let adminApp;
    try {
        adminApp = getAdminApp();
    } catch (error) {
        console.error('[Twitter Callback] Firebase Admin initialization error:', error);
        return NextResponse.redirect(new URL('/oauth-success?error=server_configuration_error', process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com'));
    }

    const stateManager = new OAuthStateManager();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('[Twitter Callback] Received params:', { 
        hasCode: !!code, 
        hasState: !!state, 
        error, 
        errorDescription 
    });

    if (error) {
        const errorMessage = error === 'access_denied' 
            ? 'Authorization canceled by user'
            : `OAuth error: ${error}${errorDescription ? ': ' + errorDescription : ''}`;
        console.error('[Twitter Callback] OAuth error:', error, errorDescription);
        return NextResponse.redirect(new URL(`/oauth-success?error=oauth_error&details=${encodeURIComponent(errorMessage)}`, process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com'));
    }

    if (!code || !state) {
        console.error('[Twitter Callback] Missing code or state parameter');
        return NextResponse.redirect(new URL('/oauth-success?error=missing_code_or_state&details=Missing authorization code or state parameter', process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com'));
    }

    try {
        console.log('[Twitter Callback] Retrieving state data');
        const stateData = await stateManager.retrieveState(state);
        if (!stateData || !stateData.uid) {
            console.error('[Twitter Callback] Invalid or expired state:', { hasStateData: !!stateData, hasUid: !!stateData?.uid });
            return NextResponse.redirect(new URL('/oauth-success?error=invalid_state&details=OAuth state expired or invalid', process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com'));
        }

        const { uid: userId, codeVerifier } = stateData;
        console.log('[Twitter Callback] State validated for user:', userId);

        if (!codeVerifier) {
            console.error('[Twitter Callback] Missing code verifier in state');
            return NextResponse.redirect(new URL('/oauth-success?error=missing_verifier&details=Missing code verifier for PKCE', process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com'));
        }

        // Use the unified social media manager
        const socialManager = createSocialMediaManager();
        
        console.log('[Twitter Callback] Attempting to connect account with code and verifier');
        
        // Add timeout to the account connection process
        const connectPromise = socialManager.connectAccount('twitter', code, codeVerifier);
        const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 30000)
        );

        const account = await Promise.race([connectPromise, timeoutPromise]);
        console.log('[Twitter Callback] Successfully connected account:', account.id);

        // Use the new sync service to properly integrate with inbox and scheduler
        const { SocialSyncService } = await import('@/lib/social-sync-service');
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(adminApp);
        const syncService = new SocialSyncService(db);
        await syncService.syncNewAccount(userId, account);

        console.log('[Twitter Callback] Account synced successfully');
        return NextResponse.redirect(new URL('/oauth-success?success=true', process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com'));

    } catch (error: any) {
        const msg = error.message || 'Unknown OAuth error';
        console.error('[Twitter Callback] OAuth process error:', {
            message: msg,
            stack: error?.stack,
            name: error?.name,
        });

        let errorDetails = msg;

        if (msg.toLowerCase().includes('invalid_client')) {
            errorDetails = 'Twitter app configuration error. Please check your credentials.';
        } else if (msg.toLowerCase().includes('invalid_grant')) {
            errorDetails = 'Authorization code expired. Please try connecting again.';
        } else if (msg.toLowerCase().includes('timeout')) {
            errorDetails = 'Connection timed out. Please try again.';
        } else if (msg.toLowerCase().includes('unauthorized')) {
            errorDetails = 'Twitter authorization failed. Please check your app permissions.';
        }

        return NextResponse.redirect(new URL(`/oauth-success?error=oauth_failed&details=${encodeURIComponent(errorDetails)}`, process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com'));
    }
}
