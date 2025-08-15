import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { profileId, userId } = await request.json();

        if (!profileId || !userId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Get the connected Instagram profile with credentials
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
        if (profile?.platform !== 'Instagram') {
            return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
        }

        const accessToken = profile.credentials?.accessToken;
        if (!accessToken) {
            return NextResponse.json({ error: 'No access token found for profile' }, { status: 400 });
        }

        console.log(`Syncing Instagram conversations for profile ${profileId}`);
        
        try {
            // Get Instagram business account ID
            const instagramUserId = profile.credentials?.userId;
            if (!instagramUserId) {
                return NextResponse.json({ error: 'No Instagram user ID found' }, { status: 400 });
            }

            // Fetch Instagram conversations (requires instagram_manage_messages permission)
            const conversationsResponse = await fetch(
                `https://graph.facebook.com/${instagramUserId}/conversations?fields=id,updated_time,message_count,unread_count,participants&access_token=${accessToken}`
            );
            
            const conversationsData = await conversationsResponse.json();
            
            if (conversationsData.error) {
                console.error('Instagram API error:', conversationsData.error);
                return NextResponse.json({ 
                    error: 'Failed to fetch Instagram conversations. This may require additional permissions or a business account.',
                    details: conversationsData.error.message
                }, { status: 400 });
            }

            let totalConversations = 0;
            
            // Store conversations in Firestore
            for (const conversation of conversationsData.data || []) {
                try {
                    await adminDb
                        .collection('workspaces')
                        .doc(userId)
                        .collection('conversations')
                        .doc(`instagram_${conversation.id}`)
                        .set({
                            id: conversation.id,
                            platform: 'Instagram',
                            profileId: profileId,
                            updatedTime: new Date(conversation.updated_time),
                            messageCount: conversation.message_count || 0,
                            unreadCount: conversation.unread_count || 0,
                            participants: conversation.participants?.data || [],
                            lastSynced: new Date()
                        }, { merge: true });
                    
                    totalConversations++;
                } catch (error) {
                    console.error(`Error storing Instagram conversation:`, error);
                }
            }

            return NextResponse.json({ 
                success: true, 
                count: totalConversations,
                message: `Synced ${totalConversations} Instagram conversations`
            });
            
        } catch (error) {
            console.error('Error calling Instagram API:', error);
            return NextResponse.json({ 
                error: 'Failed to sync Instagram conversations',
                message: 'Instagram messaging requires special permissions and business account setup'
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Error syncing Instagram conversations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}