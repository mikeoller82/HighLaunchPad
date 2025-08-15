import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { profileId, userId } = await request.json();

        if (!profileId || !userId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Get the connected LinkedIn profile with credentials
        const adminDb = getAdminDb();
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
        if (profile?.platform !== 'LinkedIn') {
            return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
        }

        const accessToken = profile.credentials?.accessToken;
        if (!accessToken) {
            return NextResponse.json({ error: 'No access token found for profile' }, { status: 400 });
        }

        console.log(`Syncing LinkedIn conversations for profile ${profileId}`);
        
        try {
            // Fetch LinkedIn conversations
            const conversationsResponse = await fetch(
                'https://api.linkedin.com/v2/conversations?q=actor&actor=urn:li:person:' + profile.credentials.userId,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Restli-Protocol-Version': '2.0.0'
                    }
                }
            );
            
            const conversationsData = await conversationsResponse.json();
            
            if (conversationsData.error) {
                console.error('LinkedIn API error:', conversationsData.error);
                return NextResponse.json({ error: 'Failed to fetch LinkedIn conversations' }, { status: 400 });
            }

            let totalConversations = 0;
            
            // Store conversations in Firestore
            for (const conversation of conversationsData.elements || []) {
                try {
                    await adminDb
                        .collection('workspaces')
                        .doc(userId)
                        .collection('conversations')
                        .doc(`linkedin_${conversation.entityUrn.split(':').pop()}`)
                        .set({
                            id: conversation.entityUrn,
                            platform: 'LinkedIn',
                            profileId: profileId,
                            updatedTime: new Date(conversation.lastModified?.time || Date.now()),
                            participants: conversation.participants || [],
                            lastSynced: new Date()
                        }, { merge: true });
                    
                    totalConversations++;
                } catch (error) {
                    console.error(`Error storing LinkedIn conversation:`, error);
                }
            }

            return NextResponse.json({ 
                success: true, 
                count: totalConversations,
                message: `Synced ${totalConversations} LinkedIn conversations`
            });
            
        } catch (error) {
            console.error('Error calling LinkedIn API:', error);
            return NextResponse.json({ error: 'Failed to sync LinkedIn conversations' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error syncing LinkedIn conversations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}