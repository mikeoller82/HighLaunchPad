import { db, auth } from './firebase';
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';
import type { Conversation, Message, Contact, ConversationFilter } from './conversation-types';
import type { SocialProfile } from './social-types';

const getCurrentUserId = (): string | null => {
    if (!auth) {
        console.error('Firebase auth not initialized');
        return null;
    }
    return auth.currentUser?.uid || null;
};

const getConversationsCollection = (userId: string) => {
    if (!db) {
        throw new Error('Firebase database not initialized');
    }
    if (!userId?.trim()) {
        throw new Error('User ID is required');
    }
    return collection(db, 'workspaces', userId, 'conversations');
};

const getMessagesCollection = (userId: string, conversationId: string) => {
    if (!db) {
        throw new Error('Firebase database not initialized');
    }
    if (!userId?.trim()) {
        throw new Error('User ID is required');
    }
    if (!conversationId?.trim()) {
        throw new Error('Conversation ID is required');
    }
    return collection(db, 'workspaces', userId, 'conversations', conversationId, 'messages');
};

const getContactsCollection = (userId: string) => {
    if (!db) {
        throw new Error('Firebase database not initialized');
    }
    if (!userId?.trim()) {
        throw new Error('User ID is required');
    }
    return collection(db, 'workspaces', userId, 'contacts');
};

const getSocialAccountsCollection = (userId: string) => {
    if (!db) {
        throw new Error('Firebase database not initialized');
    }
    if (!userId?.trim()) {
        throw new Error('User ID is required');
    }
    return collection(db, 'workspaces', userId, 'social_accounts');
};

export const getConversations = async (filter?: ConversationFilter): Promise<Conversation[]> => {
    const userId = getCurrentUserId();
    if (!userId) return [];

    try {
        let q = query(getConversationsCollection(userId), orderBy('updatedAt', 'desc'));

        if (filter?.status) {
            q = query(q, where('status', '==', filter.status));
        }
        if (filter?.channel) {
            q = query(q, where('channel', '==', filter.channel));
        }
        if (filter?.unreadOnly) {
            q = query(q, where('unreadCount', '>', 0));
        }

        const snapshot = await getDocs(q);
        const conversations = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // Create proper defaults for missing data
            const defaultContact: Contact = {
                id: data.contactId || 'unknown',
                name: 'Unknown Contact',
                tags: [],
                source: 'unknown',
                createdAt: new Date(),
                lastActivity: new Date()
            };

            const defaultMessage: Message = {
                id: 'default',
                conversationId: doc.id,
                from: 'contact',
                content: 'No messages yet',
                timestamp: new Date(),
                channel: data.channel || 'email',
                status: 'sent'
            };

            return {
                id: doc.id,
                contactId: data.contactId || 'unknown',
                contact: data.contact || defaultContact,
                unreadCount: data.unreadCount || 0,
                status: data.status || 'active',
                channel: data.channel || 'email',
                platformConversationId: data.platformConversationId,
                connectedProfileId: data.connectedProfileId,
                createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
                updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : new Date(),
                lastMessage: data.lastMessage ? {
                    id: data.lastMessage.id || 'msg_' + Date.now(),
                    conversationId: doc.id,
                    from: data.lastMessage.from || 'contact',
                    content: data.lastMessage.content || '',
                    timestamp: data.lastMessage.timestamp ? (data.lastMessage.timestamp as Timestamp).toDate() : new Date(),
                    channel: data.lastMessage.channel || data.channel || 'email',
                    status: data.lastMessage.status || 'sent',
                    platformMessageId: data.lastMessage.platformMessageId,
                    attachments: data.lastMessage.attachments
                } : defaultMessage
            } as Conversation;
        });

        if (filter?.search) {
            return conversations.filter(conv => 
                conv.contact.name.toLowerCase().includes(filter.search!.toLowerCase()) ||
                conv.lastMessage.content.toLowerCase().includes(filter.search!.toLowerCase())
            );
        }

        return conversations;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
    const userId = getCurrentUserId();
    if (!userId) return [];

    if (!conversationId?.trim()) {
        console.error('Conversation ID is required');
        return [];
    }

    try {
        const q = query(getMessagesCollection(userId, conversationId), orderBy('timestamp', 'asc'));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                conversationId: data.conversationId || conversationId,
                from: data.from || 'contact',
                content: data.content || '',
                timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
                channel: data.channel || 'email',
                status: data.status || 'sent',
                platformMessageId: data.platformMessageId,
                attachments: data.attachments
            } as Message;
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

export const sendMessage = async (conversationId: string, content: string, channel: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    if (!conversationId?.trim()) {
        throw new Error('Conversation ID is required');
    }

    if (!content?.trim()) {
        throw new Error('Message content is required');
    }

    if (!channel?.trim()) {
        throw new Error('Channel is required');
    }

    try {
        const messageData = {
            conversationId,
            from: 'user' as const,
            content: content.trim(),
            timestamp: serverTimestamp(),
            channel,
            status: 'sent' as const
        };

        await addDoc(getMessagesCollection(userId, conversationId), messageData);

        // Update conversation with last message
        const conversationRef = doc(getConversationsCollection(userId), conversationId);
        await updateDoc(conversationRef, {
            lastMessage: {
                ...messageData,
                timestamp: serverTimestamp()
            },
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message. Please try again.');
    }
};

export const markAsRead = async (conversationId: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    if (!conversationId?.trim()) {
        throw new Error('Conversation ID is required');
    }

    try {
        const conversationRef = doc(getConversationsCollection(userId), conversationId);
        await updateDoc(conversationRef, {
            unreadCount: 0
        });
    } catch (error) {
        console.error('Error marking conversation as read:', error);
        throw new Error('Failed to mark conversation as read. Please try again.');
    }
};

export const createContact = async (contactData: Omit<Contact, 'id' | 'createdAt' | 'lastActivity'>): Promise<string> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    if (!contactData?.name?.trim()) {
        throw new Error('Contact name is required');
    }

    try {
        const newContact = {
            ...contactData,
            name: contactData.name.trim(),
            email: contactData.email?.trim(),
            phone: contactData.phone?.trim(),
            tags: contactData.tags || [],
            source: contactData.source || 'manual',
            createdAt: serverTimestamp(),
            lastActivity: serverTimestamp()
        };

        const docRef = await addDoc(getContactsCollection(userId), newContact);
        return docRef.id;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw new Error('Failed to create contact. Please try again.');
    }
};

export const subscribeToConversations = (
    callback: (conversations: Conversation[]) => void,
    filter?: ConversationFilter
) => {
    const userId = getCurrentUserId();
    if (!userId) return () => {};

    let q = query(getConversationsCollection(userId), orderBy('updatedAt', 'desc'));

    if (filter?.status) {
        q = query(q, where('status', '==', filter.status));
    }
    if (filter?.channel) {
        q = query(q, where('channel', '==', filter.channel));
    }

    return onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // Create a proper default contact if missing
            const defaultContact: Contact = {
                id: data.contactId || 'unknown',
                name: 'Unknown Contact',
                tags: [],
                source: 'unknown',
                createdAt: new Date(),
                lastActivity: new Date()
            };

            // Create a proper default message if missing
            const defaultMessage: Message = {
                id: 'default',
                conversationId: doc.id,
                from: 'contact',
                content: 'No messages yet',
                timestamp: new Date(),
                channel: data.channel || 'email',
                status: 'sent'
            };

            return {
                id: doc.id,
                contactId: data.contactId || 'unknown',
                contact: data.contact || defaultContact,
                unreadCount: data.unreadCount || 0,
                status: data.status || 'active',
                channel: data.channel || 'email',
                platformConversationId: data.platformConversationId,
                connectedProfileId: data.connectedProfileId,
                createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
                updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : new Date(),
                lastMessage: data.lastMessage ? {
                    id: data.lastMessage.id || 'msg_' + Date.now(),
                    conversationId: doc.id,
                    from: data.lastMessage.from || 'contact',
                    content: data.lastMessage.content || '',
                    timestamp: data.lastMessage.timestamp ? (data.lastMessage.timestamp as Timestamp).toDate() : new Date(),
                    channel: data.lastMessage.channel || data.channel || 'email',
                    status: data.lastMessage.status || 'sent',
                    platformMessageId: data.lastMessage.platformMessageId,
                    attachments: data.lastMessage.attachments
                } : defaultMessage
            } as Conversation;
        });

        if (filter?.search) {
            const filtered = conversations.filter(conv => 
                conv.contact.name.toLowerCase().includes(filter.search!.toLowerCase()) ||
                conv.lastMessage.content.toLowerCase().includes(filter.search!.toLowerCase())
            );
            callback(filtered);
        } else {
            callback(conversations);
        }
    });
};

export const subscribeToMessages = (
    conversationId: string,
    callback: (messages: Message[]) => void
) => {
    const userId = getCurrentUserId();
    if (!userId) return () => {};

    if (!conversationId?.trim()) {
        console.error('Conversation ID is required for message subscription');
        return () => {};
    }

    try {
        const q = query(getMessagesCollection(userId, conversationId), orderBy('timestamp', 'asc'));
        
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    conversationId: data.conversationId || conversationId,
                    from: data.from || 'contact',
                    content: data.content || '',
                    timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
                    channel: data.channel || 'email',
                    status: data.status || 'sent',
                    platformMessageId: data.platformMessageId,
                    attachments: data.attachments
                } as Message;
            });
            
            callback(messages);
        });
    } catch (error) {
        console.error('Error subscribing to messages:', error);
        return () => {};
    }
};

export const getConnectedSocialProfiles = async (): Promise<SocialProfile[]> => {
    const userId = getCurrentUserId();
    if (!userId) return [];

    try {
        const snapshot = await getDocs(getSocialAccountsCollection(userId));
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as SocialProfile[];
    } catch (error) {
        console.error('Error fetching connected social profiles:', error);
        return [];
    }
};

export const syncConversationsFromPlatform = async (profileId: string, platform: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    if (!profileId?.trim()) {
        throw new Error('Profile ID is required');
    }

    if (!platform?.trim()) {
        throw new Error('Platform is required');
    }

    try {
        // Get the user's Firebase token
        const user = auth?.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }
        
        const token = await user.getIdToken();

        // Call the unified inbox sync API endpoint
        const response = await fetch('/api/social/inbox/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                token,
                platforms: [platform.toLowerCase()]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to sync ${platform} conversations: ${errorData.error || 'Unknown error'}`);
        }

        const result = await response.json();
        console.log(`Synced ${result.totalConversations || 0} conversations from ${platform}`);
    } catch (error) {
        console.error(`Error syncing ${platform} conversations:`, error);
        throw new Error(`Failed to sync ${platform} conversations. Please try again.`);
    }
};

export const syncAllConnectedPlatforms = async (): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        console.warn('User not authenticated for platform sync');
        return;
    }

    try {
        // Get the user's Firebase token
        const user = auth?.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }
        
        const token = await user.getIdToken();

        // Call the unified inbox sync API endpoint for all platforms
        const response = await fetch('/api/social/inbox/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                token
                // No platforms specified = sync all connected platforms
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to sync conversations: ${errorData.error || 'Unknown error'}`);
        }

        const result = await response.json();
        console.log(`Successfully synced ${result.totalConversations || 0} conversations from ${result.results?.length || 0} platforms`);
        
        // Log individual platform results
        if (result.results) {
            result.results.forEach((platformResult: any) => {
                if (platformResult.success) {
                    console.log(`✅ ${platformResult.platform}: ${platformResult.count} conversations`);
                } else {
                    console.error(`❌ ${platformResult.platform}: ${platformResult.error}`);
                }
            });
        }
    } catch (error) {
        console.error('Error syncing all connected platforms:', error);
        throw error; // Re-throw to let calling code handle it
    }
};

export const initializeConversationsForUser = async (): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        console.warn('User not authenticated for conversation initialization');
        return;
    }

    try {
        // Sync real conversations from all connected platforms
        await syncAllConnectedPlatforms();
        console.log('Conversations initialized successfully for user');
    } catch (error) {
        console.error('Error initializing conversations for user:', error);
        // Don't throw error to prevent breaking the app initialization
    }
};