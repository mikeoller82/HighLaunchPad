import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET endpoint for Instagram webhook verification
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const mode = searchParams.get('hub.mode');
        const token = searchParams.get('hub.verify_token');
        const challenge = searchParams.get('hub.challenge');

        console.log('[Instagram Webhook] Verification request:', { mode, token: token ? 'present' : 'missing', challenge: challenge ? 'present' : 'missing' });

        // Instagram uses the same verify token as Facebook
        if (mode === 'subscribe' && token === process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN) {
            console.log('[Instagram Webhook] Verification successful');
            return new Response(challenge, { status: 200 });
        }

        console.error('[Instagram Webhook] Verification failed - invalid token or mode');
        return new Response('Forbidden', { status: 403 });
    } catch (error) {
        console.error('[Instagram Webhook] Verification error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

// POST endpoint for receiving Instagram webhook events
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        console.log('[Instagram Webhook] Received event:', JSON.stringify(body, null, 2));

        // Verify the request signature (optional but recommended for production)
        const signature = request.headers.get('x-hub-signature-256');
        if (signature && process.env.FACEBOOK_APP_SECRET) {
            const crypto = require('crypto');
            const expectedSignature = 'sha256=' + crypto
                .createHmac('sha256', process.env.FACEBOOK_APP_SECRET)
                .update(JSON.stringify(body))
                .digest('hex');
            
            if (signature !== expectedSignature) {
                console.error('[Instagram Webhook] Invalid signature');
                return new Response('Unauthorized', { status: 401 });
            }
        }

        // Process webhook events
        if (body.object === 'instagram') {
            const adminApp = getAdminApp();
            const db = getFirestore(adminApp);

            for (const entry of body.entry || []) {
                const instagramAccountId = entry.id;
                const time = entry.time;

                console.log(`[Instagram Webhook] Processing entry for account ${instagramAccountId} at ${new Date(time * 1000).toISOString()}`);

                // Handle messaging events
                if (entry.messaging) {
                    for (const messagingEvent of entry.messaging) {
                        await handleInstagramMessagingEvent(db, instagramAccountId, messagingEvent);
                    }
                }

                // Handle changes (like mentions, comments, etc.)
                if (entry.changes) {
                    for (const change of entry.changes) {
                        await handleInstagramChangeEvent(db, instagramAccountId, change);
                    }
                }
            }
        }

        return new Response('OK', { status: 200 });
    } catch (error) {
        console.error('[Instagram Webhook] Error processing webhook:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

async function handleInstagramMessagingEvent(db: any, instagramAccountId: string, messagingEvent: any) {
    try {
        console.log(`[Instagram Webhook] Processing messaging event for account ${instagramAccountId}:`, messagingEvent);

        const senderId = messagingEvent.sender?.id;
        const recipientId = messagingEvent.recipient?.id;
        const timestamp = messagingEvent.timestamp;

        if (!senderId || !recipientId) {
            console.warn('[Instagram Webhook] Missing sender or recipient ID');
            return;
        }

        // Handle different types of messaging events
        if (messagingEvent.message) {
            await handleInstagramMessage(db, instagramAccountId, senderId, messagingEvent.message, timestamp);
        }

        if (messagingEvent.postback) {
            await handleInstagramPostback(db, instagramAccountId, senderId, messagingEvent.postback, timestamp);
        }

        if (messagingEvent.delivery) {
            await handleInstagramDelivery(db, instagramAccountId, senderId, messagingEvent.delivery, timestamp);
        }

        if (messagingEvent.read) {
            await handleInstagramRead(db, instagramAccountId, senderId, messagingEvent.read, timestamp);
        }

    } catch (error) {
        console.error('[Instagram Webhook] Error handling messaging event:', error);
    }
}

async function handleInstagramMessage(db: any, instagramAccountId: string, senderId: string, message: any, timestamp: number) {
    try {
        const conversationId = `instagram_${instagramAccountId}_${senderId}`;
        
        // Store the message in Firestore
        const messageData = {
            id: message.mid,
            conversationId,
            platform: 'instagram',
            instagramAccountId,
            senderId,
            text: message.text || '',
            timestamp: new Date(timestamp),
            attachments: message.attachments || [],
            isFromPage: false,
            processed: false,
            createdAt: new Date(),
        };

        // Find the workspace that owns this Instagram account
        const accountsQuery = await db.collectionGroup('social_accounts')
            .where('platform', '==', 'instagram')
            .where('metadata.instagram_business_account.id', '==', instagramAccountId)
            .get();

        if (accountsQuery.empty) {
            // Also check Facebook accounts that might have Instagram connected
            const facebookAccountsQuery = await db.collectionGroup('social_accounts')
                .where('platform', '==', 'facebook')
                .get();

            let found = false;
            for (const accountDoc of facebookAccountsQuery.docs) {
                const accountData = accountDoc.data();
                const pages = accountData.metadata?.pages || [];
                
                for (const page of pages) {
                    if (page.instagram_business_account?.id === instagramAccountId) {
                        const workspaceId = accountDoc.ref.parent.parent?.id;
                        if (workspaceId) {
                            await storeInstagramMessage(db, workspaceId, messageData, conversationId, instagramAccountId, senderId, message, timestamp);
                            found = true;
                        }
                    }
                }
            }

            if (!found) {
                console.warn(`[Instagram Webhook] No account found for Instagram account ${instagramAccountId}`);
            }
            return;
        }

        // Store message for each workspace that has this Instagram account connected
        for (const accountDoc of accountsQuery.docs) {
            const workspaceId = accountDoc.ref.parent.parent?.id;
            if (!workspaceId) continue;

            await storeInstagramMessage(db, workspaceId, messageData, conversationId, instagramAccountId, senderId, message, timestamp);
        }

    } catch (error) {
        console.error('[Instagram Webhook] Error handling message:', error);
    }
}

async function storeInstagramMessage(db: any, workspaceId: string, messageData: any, conversationId: string, instagramAccountId: string, senderId: string, message: any, timestamp: number) {
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
        platform: 'instagram',
        profileId: `instagram_${instagramAccountId}`,
        participants: [
            { id: instagramAccountId, isPage: true },
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

    console.log(`[Instagram Webhook] Stored message ${message.mid} for workspace ${workspaceId}`);
}

async function handleInstagramPostback(db: any, instagramAccountId: string, senderId: string, postback: any, timestamp: number) {
    console.log(`[Instagram Webhook] Postback from ${senderId} to account ${instagramAccountId}:`, postback);
    // Handle postback events (button clicks, etc.)
    // Implementation depends on your specific use case
}

async function handleInstagramDelivery(db: any, instagramAccountId: string, senderId: string, delivery: any, timestamp: number) {
    console.log(`[Instagram Webhook] Delivery confirmation from ${senderId} to account ${instagramAccountId}:`, delivery);
    // Handle message delivery confirmations
    // You might want to update message status in your database
}

async function handleInstagramRead(db: any, instagramAccountId: string, senderId: string, read: any, timestamp: number) {
    console.log(`[Instagram Webhook] Read receipt from ${senderId} to account ${instagramAccountId}:`, read);
    // Handle read receipts
    // You might want to update conversation unread count
}

async function handleInstagramChangeEvent(db: any, instagramAccountId: string, change: any) {
    try {
        console.log(`[Instagram Webhook] Change event for account ${instagramAccountId}:`, change);
        
        // Handle different types of changes
        switch (change.field) {
            case 'comments':
                // Handle comment changes
                await handleInstagramCommentChange(db, instagramAccountId, change.value);
                break;
            case 'mentions':
                // Handle mention changes
                await handleInstagramMentionChange(db, instagramAccountId, change.value);
                break;
            case 'story_insights':
                // Handle story insights
                break;
            default:
                console.log(`[Instagram Webhook] Unhandled change field: ${change.field}`);
        }

    } catch (error) {
        console.error('[Instagram Webhook] Error handling change event:', error);
    }
}

async function handleInstagramCommentChange(db: any, instagramAccountId: string, value: any) {
    try {
        console.log(`[Instagram Webhook] Comment change for account ${instagramAccountId}:`, value);
        
        // Store comment data
        const commentData = {
            id: value.id,
            platform: 'instagram',
            instagramAccountId,
            mediaId: value.media?.id,
            text: value.text,
            userId: value.from?.id,
            username: value.from?.username,
            timestamp: new Date(value.timestamp),
            createdAt: new Date(),
        };

        // Find workspaces that have this Instagram account
        const accountsQuery = await db.collectionGroup('social_accounts')
            .where('platform', '==', 'instagram')
            .where('metadata.instagram_business_account.id', '==', instagramAccountId)
            .get();

        for (const accountDoc of accountsQuery.docs) {
            const workspaceId = accountDoc.ref.parent.parent?.id;
            if (!workspaceId) continue;

            const commentRef = db
                .collection('workspaces')
                .doc(workspaceId)
                .collection('instagram_comments')
                .doc(value.id);

            await commentRef.set(commentData, { merge: true });
            console.log(`[Instagram Webhook] Stored comment ${value.id} for workspace ${workspaceId}`);
        }

    } catch (error) {
        console.error('[Instagram Webhook] Error handling comment change:', error);
    }
}

async function handleInstagramMentionChange(db: any, instagramAccountId: string, value: any) {
    try {
        console.log(`[Instagram Webhook] Mention change for account ${instagramAccountId}:`, value);
        
        // Store mention data
        const mentionData = {
            id: value.id,
            platform: 'instagram',
            instagramAccountId,
            mediaId: value.media_id,
            commentId: value.comment_id,
            text: value.text,
            userId: value.from?.id,
            username: value.from?.username,
            timestamp: new Date(),
            createdAt: new Date(),
        };

        // Find workspaces that have this Instagram account
        const accountsQuery = await db.collectionGroup('social_accounts')
            .where('platform', '==', 'instagram')
            .where('metadata.instagram_business_account.id', '==', instagramAccountId)
            .get();

        for (const accountDoc of accountsQuery.docs) {
            const workspaceId = accountDoc.ref.parent.parent?.id;
            if (!workspaceId) continue;

            const mentionRef = db
                .collection('workspaces')
                .doc(workspaceId)
                .collection('instagram_mentions')
                .doc(value.id);

            await mentionRef.set(mentionData, { merge: true });
            console.log(`[Instagram Webhook] Stored mention ${value.id} for workspace ${workspaceId}`);
        }

    } catch (error) {
        console.error('[Instagram Webhook] Error handling mention change:', error);
    }
}