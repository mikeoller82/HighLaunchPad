import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch 
} from 'firebase/firestore';
import type { Conversation, Message } from './conversation-types';

export class ConversationSyncService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async syncConversationsFromAPI(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      console.log('[ConversationSync] Starting sync for user:', this.userId);
      
      const user = auth?.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();
      
      // Call the sync API
      const response = await fetch('/api/social/inbox/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sync API failed');
      }

      const result = await response.json();
      console.log('[ConversationSync] API sync result:', result);

      return {
        success: true,
        count: result.totalConversations || 0
      };
    } catch (error) {
      console.error('[ConversationSync] Sync failed:', error);
      return {
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getStoredConversations(): Promise<Conversation[]> {
    try {
      const conversationsRef = collection(db, 'workspaces', this.userId, 'conversations');
      const q = query(conversationsRef, orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastMessage: data.lastMessage ? {
            ...data.lastMessage,
            timestamp: data.lastMessage.timestamp?.toDate() || new Date()
          } : undefined
        } as Conversation;
      });
    } catch (error) {
      console.error('[ConversationSync] Error getting stored conversations:', error);
      return [];
    }
  }

  async createTestConversation(): Promise<void> {
    try {
      console.log('[ConversationSync] Creating test conversation...');
      
      const testConversation = {
        contactId: 'test_contact_1',
        contact: {
          id: 'test_contact_1',
          name: 'Test Contact',
          email: 'test@example.com',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Test',
          source: 'test',
          tags: ['test'],
          createdAt: new Date(),
          lastActivity: new Date()
        },
        channel: 'email' as const,
        status: 'active' as const,
        unreadCount: 1,
        lastMessage: {
          id: 'test_msg_1',
          content: 'This is a test message to verify your conversation system is working',
          timestamp: new Date(),
          from: 'contact' as const,
          channel: 'email' as const,
          status: 'sent' as const
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const conversationsRef = collection(db, 'workspaces', this.userId, 'conversations');
      await addDoc(conversationsRef, testConversation);
      
      console.log('[ConversationSync] Test conversation created successfully');
    } catch (error) {
      console.error('[ConversationSync] Error creating test conversation:', error);
      throw error;
    }
  }

  async clearTestData(): Promise<void> {
    try {
      console.log('[ConversationSync] Clearing test data...');
      
      const conversationsRef = collection(db, 'workspaces', this.userId, 'conversations');
      const q = query(conversationsRef, where('contact.source', '==', 'test'));
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`[ConversationSync] Cleared ${snapshot.size} test conversations`);
    } catch (error) {
      console.error('[ConversationSync] Error clearing test data:', error);
      throw error;
    }
  }
}

// Helper function to get current user's sync service
export const getCurrentUserSyncService = (): ConversationSyncService | null => {
  const user = auth?.currentUser;
  if (!user) return null;
  return new ConversationSyncService(user.uid);
};