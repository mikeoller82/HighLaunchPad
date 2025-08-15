import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { SocialSyncService } from '@/lib/social-sync-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    let adminApp;
    try {
        adminApp = getAdminApp();
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({ error: "Authorization token is missing" }, { status: 400 });
    }

    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const syncService = new SocialSyncService(db);
        await syncService.syncAllAccounts(userId);

        return NextResponse.json({ success: true, message: "All accounts synced successfully" });

    } catch (error) {
        console.error("Error syncing social accounts:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ 
            error: "Failed to sync social accounts", 
            details: errorMessage 
        }, { status: 500 });
    }
}