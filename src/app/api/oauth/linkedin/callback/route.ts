import { NextResponse, type NextRequest } from 'next/server'; import { getAdminApp } from '@/lib/firebase-admin'; import { createSocialMediaManager } from '@/lib/social-media-manager'; import { OAuthStateManager } from '@/lib/oauth-state-manager';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log('[LinkedIn OAuth Callback] Starting callback process');
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('[LinkedIn OAuth Callback] Received params:', { 
        hasCode: !!code, 
        hasState: !!state, 
        error, 
        errorDescription 
    });

    if (error || !code || !state) {
        const reason = error || (!code ? 'missing_code' : 'missing_state');
        const messageMap = {
            access_denied: 'Authorization canceled by user',
            missing_code: 'Missing authorization code',
            missing_state: 'Missing state parameter',
            unauthorized_scope_error: 'Unauthorized scope for app',
            invalid_request: 'Invalid request parameters',
        } as const;
        const message = messageMap[reason as keyof typeof messageMap] || errorDescription || 'OAuth failed';

        console.error('[LinkedIn OAuth Callback] Error:', {
            error,
            reason,
            code: !!code,
            state: !!state,
            url: request.url,
        });

        return NextResponse.redirect(
            new URL(`/oauth-success?error=oauth_error&details=${encodeURIComponent(message)}`, process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com')
        );
    }

let adminApp;
try {
    adminApp = getAdminApp();
} catch (err) {
    console.error('[OAuth Callback] Firebase Admin init error:', err);
    return NextResponse.redirect(
        new URL('/oauth-success?error=server_config_error', process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com')
    );
}

const stateManager = new OAuthStateManager();

try {
    console.log('[LinkedIn OAuth Callback] Retrieving state data');
    const stateData = await stateManager.retrieveState(state);

    if (!stateData || !stateData.uid) {
        console.error('[LinkedIn OAuth Callback] Invalid or expired state:', { hasStateData: !!stateData, hasUid: !!stateData?.uid });
        return NextResponse.redirect(
            new URL('/oauth-success?error=invalid_state&details=OAuth state expired or invalid', process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com')
        );
    }

    const userId = stateData.uid;
    console.log('[LinkedIn OAuth Callback] State validated for user:', userId);

    const socialManager = createSocialMediaManager();
    console.log('[LinkedIn OAuth Callback] Connecting LinkedIn account for user:', userId);

    // Add timeout to the account connection process
    const connectPromise = socialManager.connectAccount('linkedin', code);
    const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 30000)
    );

    const account = await Promise.race([connectPromise, timeoutPromise]);
    console.log('[LinkedIn OAuth Callback] Account connected successfully:', account.id);

    const { SocialSyncService } = await import('@/lib/social-sync-service');
    const { getFirestore } = await import('firebase-admin/firestore');
    const db = getFirestore(adminApp);

    const syncService = new SocialSyncService(db);
    await syncService.syncNewAccount(userId, account);

    console.log('[LinkedIn OAuth Callback] Account synced successfully');
    return NextResponse.redirect(
        new URL('/oauth-success?success=true', process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com')
    );
} catch (err: any) {
    const msg = err.message || 'Unknown OAuth error';
    console.error('[LinkedIn OAuth Callback] OAuth process error:', {
        message: msg,
        stack: err?.stack,
        name: err?.name,
    });

    let errorDetails = msg;

    if (msg.toLowerCase().includes('invalid_client')) {
        errorDetails = 'LinkedIn app configuration error. Please check your credentials.';
    } else if (msg.toLowerCase().includes('invalid_grant')) {
        errorDetails = 'Authorization code expired. Please try connecting again.';
    } else if (msg.toLowerCase().includes('timeout')) {
        errorDetails = 'Connection timed out. Please try again.';
    } else if (msg.toLowerCase().includes('unauthorized')) {
        errorDetails = 'LinkedIn authorization failed. Please check your app permissions.';
    }

    return NextResponse.redirect(
        new URL(
            `/oauth-success?error=oauth_failed&details=${encodeURIComponent(errorDetails)}`,
            process.env.NEXT_PUBLIC_BASE_URL || 'https://highlaunchpad.com'
        )
    );
}
}