import { NextResponse, type NextRequest } from 'next/server'; import { getAuth } from 'firebase-admin/auth'; import { getAdminApp } from '@/lib/firebase-admin'; import { createSocialMediaManager } from '@/lib/social-media-manager'; import { OAuthStateManager } from '@/lib/oauth-state-manager';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> { console.log('[OAuth LinkedIn] Starting connection request');


let adminApp;
try {
    adminApp = getAdminApp();
    console.log('[OAuth LinkedIn] Firebase Admin initialized');
} catch (error) {
    console.error('[OAuth LinkedIn] Firebase Admin error:', error);
    return NextResponse.json(
        { error: 'Server error: Firebase not initialized' },
        { status: 500 }
    );
}

let body;
try {
    body = await request.json();
} catch {
    return NextResponse.json(
        { error: 'Invalid JSON received in request body' },
        { status: 400 }
    );
}

const { token } = body;

if (!token || typeof token !== 'string') {
    return NextResponse.json(
        { error: 'Token missing from request body' },
        { status: 400 }
    );
}

const auth = getAuth(adminApp);
const stateManager = new OAuthStateManager();

try {
    console.log('[OAuth LinkedIn] Verifying Firebase ID token');
    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;
    console.log(`[OAuth LinkedIn] Firebase token verified for uid: ${uid}`);

    const state = await stateManager.generateJWTState({
        uid,
        platform: 'linkedin',
    });

    const socialManager = createSocialMediaManager();

    const supported = socialManager.getSupportedPlatforms();
    console.log('[OAuth LinkedIn] Supported platforms:', supported);
    console.log('[OAuth LinkedIn] Environment check:', {
        hasClientId: !!process.env.LINKEDIN_CLIENT_ID,
        hasClientSecret: !!process.env.LINKEDIN_CLIENT_SECRET,
        hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
        clientIdLength: process.env.LINKEDIN_CLIENT_ID?.length,
        clientSecretLength: process.env.LINKEDIN_CLIENT_SECRET?.length,
    });
    
    if (!supported.includes('linkedin')) {
        console.error('[OAuth LinkedIn] LinkedIn not configured - missing credentials');
        return NextResponse.json(
            { error: 'LinkedIn integration disabled or not configured' },
            { status: 500 }
        );
    }

    const authUrl = socialManager.getAuthUrl('linkedin', state);
    return NextResponse.json({ authUrl });
} catch (error: any) {
    console.error('[OAuth LinkedIn] Connection error:', error);
    return NextResponse.json(
        {
            error: 'Failed to initiate LinkedIn connection',
            details: error?.message || 'Unknown error',
        },
        { status: 401 }
    );
}
}