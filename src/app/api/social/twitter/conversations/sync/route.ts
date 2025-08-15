import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { profileId, userId } = await request.json();

        if (!profileId || !userId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Get the connected Twitter profile with credentials
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
        if (profile?.platform !== 'Twitter') {
            return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
        }

        const accessToken = profile.credentials?.accessToken;
        if (!accessToken) {
            return NextResponse.json({ error: 'No access token found for profile' }, { status: 400 });
        }

        console.log(`Syncing Twitter conversations for profile ${profileId}`);
        
        try {
            // Fetch Twitter DM events
            const dmResponse = await fetch(
                'https://api.twitter.com/2/dm_events?dm_event.fields=id,text,created_at,sender_id,referenced_tweet&expansions=sender_id,referenced_tweet.id',
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            const dmData = await dmResponse.json();
            
            if (dmData.errors) {
                console.error('Twitter API error:', dmData.errors);
                return NextResponse.json({ error: 'Failed to fetch Twitter DMs' }, { status: 400 });
            }

            let totalConversations = 0;
            const conversationMap = new Map();
            
            // Group DM events by conversation
            for (const event of dmData.data || []) {
                const conversationId = event.conversation_id || `dm_${event.sender_id}`;
                
                if (!conversationMap.has(conversationId)) {
                    conversationMap.set(conversationId, {
                        id: conversationId,
                        platform: 'Twitter',
                        profileId: profileId,
                        lastMessage: event.text,
                        lastMessageTime: new Date(event.created_at),
                        senderId: event.sender_id,
                        messages: []
                    });
                }
                
                conversationMap.get(conversationId).messages.push(event);
            }
            
            // Store conversations in Firestore
            for (const [conversationId, conversation] of Array.from(conversationMap.entries())) {
                try {
                    await adminDb
                        .collection('workspaces')
                        .doc(userId)
                        .collection('conversations')
                        .doc(`twitter_${conversationId}`)
                        .set({
                            ...conversation,
                            lastSynced: new Date()
                        }, { merge: true });
                    
                    totalConversations++;
                } catch (error) {
                    console.error(`Error storing Twitter conversation:`, error);
                }
            }

            return NextResponse.json({ 
                success: true, 
                count: totalConversations,
                message: `Synced ${totalConversations} Twitter conversations`
            });
            
        } catch (error) {
            console.error('Error calling Twitter API:', error);
            return NextResponse.json({ error: 'Failed to sync Twitter conversations' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error syncing Twitter conversations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}