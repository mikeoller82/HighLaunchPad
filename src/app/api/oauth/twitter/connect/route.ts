
import { NextResponse, type NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';
import { OAuthStateManager } from '@/lib/oauth-state-manager';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    console.log('[OAuth Twitter] Starting connection process');
    let adminApp;
    try {
        adminApp = getAdminApp();
        console.log('[OAuth Twitter] Firebase Admin initialized successfully');
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
        return NextResponse.json({ error: "Server configuration error. Firebase Admin not initialized." }, { status: 500 });
    }

    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({ error: "Authorization token is missing." }, { status: 400 });
    }

    const auth = getAuth(adminApp);
    const stateManager = new OAuthStateManager();

    try {
        console.log('[OAuth Twitter] Verifying ID token');
        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;
        console.log('[OAuth Twitter] Token verified for user:', uid);

        // Generate code verifier for PKCE
        const codeVerifier = nanoid(128);
        console.log('[Twitter OAuth] Generated code verifier for PKCE');
        
        // Use JWT-based state management with code verifier
        const state = await stateManager.generateJWTState({
            uid,
            platform: 'twitter',
            codeVerifier,
        });
        
        console.log('[Twitter OAuth] Generated JWT state with code verifier');
        
        // Use the unified social media manager
        const socialManager = createSocialMediaManager();
        
        // Check if Twitter is configured
        const supportedPlatforms = socialManager.getSupportedPlatforms();
        console.log('[OAuth Twitter] Supported platforms:', supportedPlatforms);
        console.log('[OAuth Twitter] Environment check:', {
            hasClientId: !!process.env.TWITTER_CLIENT_ID,
            hasClientSecret: !!process.env.TWITTER_CLIENT_SECRET,
            hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
            clientIdLength: process.env.TWITTER_CLIENT_ID?.length,
            clientSecretLength: process.env.TWITTER_CLIENT_SECRET?.length,
        });
        
        if (!supportedPlatforms.includes('twitter')) {
            console.error('[OAuth Twitter] Twitter not configured - missing credentials');
            return NextResponse.json({ 
                error: "Twitter OAuth not configured. Missing credentials." 
            }, { status: 500 });
        }
        
        // Get the Twitter client and manually generate auth URL with our code verifier
        const twitterClient = socialManager.getClient('twitter');
        if (!twitterClient) {
            throw new Error('Twitter client not configured');
        }
        
        // Generate code challenge from our stored verifier
        const crypto = require('crypto');
        const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
        
        const authUrl = `https://x.com/i/oauth2/authorize?${new URLSearchParams({
            response_type: 'code',
            client_id: process.env.TWITTER_CLIENT_ID!,
            redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/twitter/callback`,
            scope: 'tweet.read tweet.write users.read offline.access',
            state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
        }).toString()}`;

        return NextResponse.json({ authUrl });

    } catch (error) {
        console.error("Error initiating Twitter OAuth:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ 
            error: "Authentication failed. Could not verify user.", 
            details: errorMessage 
        }, { status: 401 });
    }
}
