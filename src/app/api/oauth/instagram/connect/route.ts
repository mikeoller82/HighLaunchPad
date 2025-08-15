import { NextResponse, type NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    console.log('[OAuth Instagram] Starting connection process');
    let adminApp;
    try {
        adminApp = getAdminApp();
        console.log('[OAuth Instagram] Firebase Admin initialized successfully');
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
        return NextResponse.json({ error: "Server configuration error. Firebase Admin not initialized." }, { status: 500 });
    }

    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({ error: "Authorization token is missing." }, { status: 400 });
    }

    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    try {
        console.log('[OAuth Instagram] Verifying ID token');
        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;
        console.log('[OAuth Instagram] Token verified for user:', uid);

        const state = nanoid();
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 15);
        
        const stateRef = db.collection('oauth_states').doc(state);
        await stateRef.set({
            uid,
            platform: 'instagram',
            expires,
        });
        
        // Use the unified social media manager (Instagram uses Facebook OAuth)
        const socialManager = createSocialMediaManager();
        const authUrl = socialManager.getAuthUrl('instagram', state);

        return NextResponse.json({ authUrl });

    } catch (error) {
        console.error("Error initiating Instagram OAuth:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ 
            error: "Authentication failed. Could not verify user.", 
            details: errorMessage 
        }, { status: 401 });
    }
}