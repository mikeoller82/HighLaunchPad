import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET endpoint for Facebook webhook verification
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const mode = searchParams.get('hub.mode');
        const token = searchParams.get('hub.verify_token');
        const challenge = searchParams.get('hub.challenge');

        console.log('[Facebook Webhook] Verification request:', { mode, token: token ? 'present' : 'missing', challenge: challenge ? 'present' : 'missing' });

        // Verify the webhook
        if (mode === 'subscribe' && token === process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN) {
            console.log('[Facebook Webhook] Verification successful');
            return new Response(challenge, { status: 200 });
        }

        console.error('[Facebook Webhook] Verification failed - invalid token or mode');
        return new Response('Forbidden', { status: 403 });
    } catch (error) {
        console.error('[Facebook Webhook] Verification error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

// POST endpoint for receiving Facebook webhook events
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        console.log('[Facebook Webhook] Received event:', JSON.stringify(body, null, 2));

        // Verify the request signature (optional but recommended for production)
        const signature = request.headers.get('x-hub-signature-256');
        if (signature && process.env.FACEBOOK_APP_SECRET) {
            const crypto = require('crypto');
            const expectedSignature = 'sha256=' + crypto
                .createHmac('sha256', process.env.FACEBOOK_APP_SECRET)
                .update(JSON.stringify(body))
                .digest('hex');
            
            if (signature !== expectedSignature) {
                console.error('[Facebook Webhook] Invalid signature');
                return new Response('Unauthorized', { status: 401 });
            }
        }

        // Process webhook events
        if (body.object === 'page') {
            const adminApp = getAdminApp();
            const db = getFirestore(adminApp);

            for (const entry of body.entry || []) {
                const pageId = entry.id;
                const time = entry.time;

                console.log(`[Facebook Webhook] Processing entry for page ${pageId} at ${new Date(time * 1000).toISOString()}`);

                // Handle messaging events
                if (entry.messaging) {
                    for (const messagingEvent of entry.messaging) {
                        await handleMessagingEvent(db, pageId, messagingEvent);
                    }
                }

                // Handle changes (like page updates)
                if (entry.changes) {
                    for (const change of entry.changes) {
                        await handleChangeEvent(db, pageId, change);
                    }
                }
            }
        }

        return new Response('OK', { status: 200 });
    } catch (error) {
        console.error('[Facebook Webhook] Error processing webhook:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

async function handleMessagingEvent(db: any, pageId: string, messagingEvent: any) {
    try {
        console.log(`[Facebook Webhook] Processing messaging event for page ${pageId}:`, messagingEvent);

        const senderId = messagingEvent.sender?.id;
        const recipientId = messagingEvent.recipient?.id;
        const timestamp = messagingEvent.timestamp;

        if (!senderId || !recipientId) {
            console.warn('[Facebook Webhook] Missing sender or recipient ID');
            return;
        }

        // Handle different types of messaging events
        if (messagingEvent.message) {
            await handleMessage(db, pageId, senderId, messagingEvent.message, timestamp);
        }

        if (messagingEvent.postback) {
            await handlePostback(db, pageId, senderId, messagingEvent.postback, timestamp);
        }

        if (messagingEvent.delivery) {
            await handleDelivery(db, pageId, senderId, messagingEvent.delivery, timestamp);
        }

        if (messagingEvent.read) {
            await handleRead(db, pageId, senderId, messagingEvent.read, timestamp);
        }

    } catch (error) {
        console.error('[Facebook Webhook] Error handling messaging event:', error);
    }
}

async function handleMessage(db: any, pageId: string, senderId: string, message: any, timestamp: number) {
    try {
        const conversationId = `facebook_${pageId}_${senderId}`;
        
        // Store the message in Firestore
        const messageData = {
            id: message.mid,
            conversationId,
            platform: 'facebook',
            pageId,
            senderId,
            text: message.text || '',
            timestamp: new Date(timestamp),
            attachments: message.attachments || [],
            isFromPage: false,
            processed: false,
            createdAt: new Date(),
        };

        // Find the workspace that owns this page
        const accountsQuery = await db.collectionGroup('social_accounts')
            .where('platform', '==', 'facebook')
            .where('metadata.pages', 'array-contains-any', [{ id: pageId }])
            .get();

        if (accountsQuery.empty) {
            console.warn(`[Facebook Webhook] No account found for page ${pageId}`);
            return;
        }

        // Store message for each workspace that has this page connected
        for (const accountDoc of accountsQuery.docs) {
            const workspaceId = accountDoc.ref.parent.parent?.id;
            if (!workspaceId) continue;

            const messageRef = db
                .collection('workspaces')
                .doc(workspaceId)
                .collection('messages')
                .doc(message.mid);

            await messageRef.set(messageData, { merge: true });

            // Update or create conversation
            const conversationRef = db
                .collection('workspaces')
                .doc(workspaceId)
                .collection('conversations')
                .doc(conversationId);

            await conversationRef.set({
                id: conversationId,
                platform: 'facebook',
                profileId: `facebook_${pageId}`,
                participants: [
                    { id: pageId, isPage: true },
                    { id: senderId, isPage: false }
                ],
                lastMessage: {
                    id: message.mid,
                    text: message.text || '',
                    senderId,
                    createdAt: new Date(timestamp),
                    isFromPage: false,
                },
                unreadCount: 1, // Increment this properly in production
                updatedAt: new Date(timestamp),
                lastSynced: new Date(),
            }, { merge: true });

            console.log(`[Facebook Webhook] Stored message ${message.mid} for workspace ${workspaceId}`);
        }

    } catch (error) {
        console.error('[Facebook Webhook] Error handling message:', error);
    }
}

async function handlePostback(db: any, pageId: string, senderId: string, postback: any, timestamp: number) {
    console.log(`[Facebook Webhook] Postback from ${senderId} to page ${pageId}:`, postback);
    // Handle postback events (button clicks, etc.)
    // Implementation depends on your specific use case
}

async function handleDelivery(db: any, pageId: string, senderId: string, delivery: any, timestamp: number) {
    console.log(`[Facebook Webhook] Delivery confirmation from ${senderId} to page ${pageId}:`, delivery);
    // Handle message delivery confirmations
    // You might want to update message status in your database
}

async function handleRead(db: any, pageId: string, senderId: string, read: any, timestamp: number) {
    console.log(`[Facebook Webhook] Read receipt from ${senderId} to page ${pageId}:`, read);
    // Handle read receipts
    // You might want to update conversation unread count
}

async function handleChangeEvent(db: any, pageId: string, change: any) {
    try {
        console.log(`[Facebook Webhook] Change event for page ${pageId}:`, change);
        
        // Handle different types of changes
        switch (change.field) {
            case 'feed':
                // Handle feed changes (posts, comments, etc.)
                break;
            case 'conversations':
                // Handle conversation changes
                break;
            default:
                console.log(`[Facebook Webhook] Unhandled change field: ${change.field}`);
        }

    } catch (error) {
        console.error('[Facebook Webhook] Error handling change event:', error);
    }
}