import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { createSocialMediaManager } from '@/lib/social-media-manager';
import { SocialAccount } from '@/lib/social-oauth-clients';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { token, conversationId, message, platform } = await request.json();

        if (!token || !conversationId || !message || !platform) {
            return NextResponse.json({ 
                error: 'Missing required parameters: token, conversationId, message, platform' 
            }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const db = getFirestore(adminApp);

        // Verify the user token
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        console.log(`[Send Message] Sending message for user: ${userId}, platform: ${platform}`);

        // Get the conversation to verify it belongs to the user
        const conversationRef = db
            .collection('workspaces')
            .doc(userId)
            .collection('conversations')
            .doc(conversationId);

        const conversationDoc = await conversationRef.get();
        if (!conversationDoc.exists) {
            return NextResponse.json({ 
                error: 'Conversation not found' 
            }, { status: 404 });
        }

        const conversation = conversationDoc.data();
        if (conversation?.platform !== platform) {
            return NextResponse.json({ 
                error: 'Platform mismatch' 
            }, { status: 400 });
        }

        // Get the social account for this platform
        const accountsSnapshot = await db
            .collection('workspaces')
            .doc(userId)
            .collection('social_accounts')
            .where('platform', '==', platform)
            .limit(1)
            .get();

        if (accountsSnapshot.empty) {
            return NextResponse.json({ 
                error: `No connected ${platform} account found` 
            }, { status: 404 });
        }

        const account = accountsSnapshot.docs[0].data() as SocialAccount;

        // Check if tokens need refresh
        const socialManager = createSocialMediaManager();
        if (socialManager.shouldRefreshTokens(account)) {
            try {
                const refreshedAccount = await socialManager.refreshTokens(platform as any, account);
                
                // Update the account in Firestore
                await accountsSnapshot.docs[0].ref.update({
                    tokens: refreshedAccount.tokens
                });
                
                account.tokens = refreshedAccount.tokens;
            } catch (refreshError) {
                console.error('Failed to refresh tokens:', refreshError);
                return NextResponse.json({ 
                    error: 'Authentication expired. Please reconnect your account.' 
                }, { status: 401 });
            }
        }

        // Send the message
        try {
            const result = await socialManager.sendMessage(account, conversationId, message);

            // Update the conversation with the new message
            const newMessage = {
                id: result.id || `msg_${Date.now()}`,
                text: message,
                senderId: account.metadata?.id || account.id,
                senderName: account.displayName,
                createdAt: new Date(),
                isFromPage: true,
            };

            // Add the message to the conversation
            await conversationRef.update({
                lastMessage: newMessage,
                updatedAt: new Date(),
                'messages': FieldValue.arrayUnion(newMessage)
            });

            console.log(`[Send Message] Successfully sent message to ${platform}`);

            return NextResponse.json({
                success: true,
                message: 'Message sent successfully',
                data: result,
                sentMessage: newMessage
            });

        } catch (sendError) {
            console.error(`Error sending message to ${platform}:`, sendError);
            
            // Check if it's an authentication error
            if (sendError instanceof Error && sendError.message.includes('auth')) {
                return NextResponse.json({ 
                    error: 'Authentication failed. Please reconnect your account.',
                    details: sendError.message
                }, { status: 401 });
            }

            return NextResponse.json({ 
                error: `Failed to send message to ${platform}`,
                details: sendError instanceof Error ? sendError.message : 'Unknown error'
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Error in send message endpoint:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}