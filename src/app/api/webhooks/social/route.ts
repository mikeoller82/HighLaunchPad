import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const platform = request.nextUrl.searchParams.get('platform');
        
        if (!platform) {
            return NextResponse.json({ error: 'Platform parameter required' }, { status: 400 });
        }

        console.log(`Received webhook from ${platform}:`, body);

        // Handle different platform webhook formats
        switch (platform.toLowerCase()) {
            case 'instagram':
                return handleInstagramWebhook(body);
            case 'twitter':
                return handleTwitterWebhook(body);
            case 'facebook':
                return handleFacebookWebhook(body);
            case 'linkedin':
                return handleLinkedInWebhook(body);
            default:
                return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
        }

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function handleInstagramWebhook(body: any) {
    // Instagram webhook format for messages
    // https://developers.facebook.com/docs/messenger-platform/webhooks
    
    if (body.object === 'instagram' && body.entry) {
        for (const entry of body.entry) {
            if (entry.messaging) {
                for (const messagingEvent of entry.messaging) {
                    await processInstagramMessage(messagingEvent);
                }
            }
        }
    }
    
    return NextResponse.json({ status: 'ok' });
}

async function handleTwitterWebhook(body: any) {
    // Twitter webhook format for direct messages
    // https://developer.twitter.com/en/docs/twitter-api/direct-messages/manage/api-reference
    
    if (body.direct_message_events) {
        for (const dmEvent of body.direct_message_events) {
            await processTwitterDirectMessage(dmEvent);
        }
    }
    
    return NextResponse.json({ status: 'ok' });
}

async function handleFacebookWebhook(body: any) {
    // Facebook Messenger webhook format
    // https://developers.facebook.com/docs/messenger-platform/webhooks
    
    if (body.object === 'page' && body.entry) {
        for (const entry of body.entry) {
            if (entry.messaging) {
                for (const messagingEvent of entry.messaging) {
                    await processFacebookMessage(messagingEvent);
                }
            }
        }
    }
    
    return NextResponse.json({ status: 'ok' });
}

async function handleLinkedInWebhook(body: any) {
    // LinkedIn webhook format for messages
    // https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/messaging-api
    
    if (body.eventType === 'MESSAGE_RECEIVED') {
        await processLinkedInMessage(body);
    }
    
    return NextResponse.json({ status: 'ok' });
}

async function processInstagramMessage(messagingEvent: any) {
    const senderId = messagingEvent.sender?.id;
    const recipientId = messagingEvent.recipient?.id;
    const messageText = messagingEvent.message?.text;
    
    if (!senderId || !recipientId || !messageText) return;
    
    // Find the user who owns this Instagram profile
    const adminDb = getAdminDb();
    const profileQuery = await adminDb
        .collectionGroup('profiles')
        .where('platform', '==', 'Instagram')
        .where('platformUserId', '==', recipientId)
        .get();
    
    if (profileQuery.empty) return;
    
    const profileDoc = profileQuery.docs[0];
    const userId = profileDoc.ref.parent.parent?.id;
    
    if (!userId) return;
    
    // Store the message in the user's conversations
    await storeIncomingMessage(userId, 'instagram', senderId, messageText, messagingEvent);
}

async function processTwitterDirectMessage(dmEvent: any) {
    // Similar processing for Twitter DMs
    console.log('Processing Twitter DM:', dmEvent);
}

async function processFacebookMessage(messagingEvent: any) {
    // Similar processing for Facebook messages
    console.log('Processing Facebook message:', messagingEvent);
}

async function processLinkedInMessage(messageEvent: any) {
    // Similar processing for LinkedIn messages
    console.log('Processing LinkedIn message:', messageEvent);
}

async function storeIncomingMessage(
    userId: string, 
    platform: string, 
    senderId: string, 
    messageText: string, 
    originalEvent: any
) {
    const adminDb = getAdminDb();
    const conversationsRef = adminDb
        .collection('workspaces')
        .doc(userId)
        .collection('conversations');
    
    // Find or create conversation
    const existingConversation = await conversationsRef
        .where('channel', '==', platform)
        .where('platformConversationId', '==', senderId)
        .get();
    
    let conversationId: string;
    
    if (existingConversation.empty) {
        // Create new conversation
        const newConversation = await conversationsRef.add({
            channel: platform,
            platformConversationId: senderId,
            contact: {
                id: senderId,
                name: `${platform} User`,
                source: platform,
                createdAt: FieldValue.serverTimestamp(),
                lastActivity: FieldValue.serverTimestamp(),
                tags: []
            },
            status: 'active',
            unreadCount: 1,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
        });
        conversationId = newConversation.id;
    } else {
        conversationId = existingConversation.docs[0].id;
        // Update unread count
        await conversationsRef.doc(conversationId).update({
            unreadCount: FieldValue.increment(1),
            updatedAt: FieldValue.serverTimestamp()
        });
    }
    
    // Add the message
    await conversationsRef
        .doc(conversationId)
        .collection('messages')
        .add({
            conversationId,
            from: 'contact',
            content: messageText,
            timestamp: FieldValue.serverTimestamp(),
            channel: platform,
            status: 'delivered',
            platformMessageId: originalEvent.message?.mid || originalEvent.id
        });
}

// Webhook verification for platforms that require it
export async function GET(request: NextRequest) {
    const platform = request.nextUrl.searchParams.get('platform');
    const mode = request.nextUrl.searchParams.get('hub.mode');
    const token = request.nextUrl.searchParams.get('hub.verify_token');
    const challenge = request.nextUrl.searchParams.get('hub.challenge');
    
    // Verify webhook subscription (Facebook/Instagram format)
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        return new NextResponse(challenge);
    }
    
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}