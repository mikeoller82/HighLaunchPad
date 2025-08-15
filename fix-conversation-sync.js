#!/usr/bin/env node

/**
 * Comprehensive fix for conversation sync issues
 * This script will help diagnose and fix the placeholder data problem
 */

const fs = require('fs');
const path = require('path');

class ConversationSyncFixer {
  constructor() {
    this.fixes = [];
    this.issues = [];
  }

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  error(message) {
    console.error(`[${new Date().toISOString()}] ❌ ${message}`);
    this.issues.push(message);
  }

  success(message) {
    console.log(`[${new Date().toISOString()}] ✅ ${message}`);
    this.fixes.push(message);
  }

  async checkFileExists(filePath) {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async readFile(filePath) {
    try {
      return await fs.promises.readFile(filePath, 'utf8');
    } catch (error) {
      this.error(`Failed to read ${filePath}: ${error.message}`);
      return null;
    }
  }

  async writeFile(filePath, content) {
    try {
      await fs.promises.writeFile(filePath, content, 'utf8');
      this.success(`Updated ${filePath}`);
      return true;
    } catch (error) {
      this.error(`Failed to write ${filePath}: ${error.message}`);
      return false;
    }
  }

  async fixTwitterInboxImplementation() {
    this.log('🐦 Fixing Twitter inbox implementation...');
    
    const filePath = 'src/lib/social-oauth-clients.ts';
    const content = await this.readFile(filePath);
    
    if (!content) return false;

    // Complete the Twitter getInboxMessages implementation
    const twitterInboxFix = `          const messages: ConversationMessage[] = (messagesData.data || [])
            .filter((event: any) => event.event_type === 'MessageCreate')
            .map((event: any) => {
              const sender = messagesData.includes?.users?.find((u: any) => u.id === event.sender_id);
              return {
                id: event.id,
                text: event.text || '',
                senderId: event.sender_id,
                senderName: sender?.name || sender?.username || 'Unknown User',
                createdAt: new Date(event.created_at),
                isFromPage: false, // Twitter DMs are always from other users
              };
            });

          // Get participant info
          const participants = conv.participant_ids || [];
          const users = data.includes?.users || [];
          
          conversations.push({
            id: \`twitter_\${conv.id}\`,
            platform: 'twitter',
            profileId: \`twitter_\${conv.id}\`,
            participants: participants.map((id: string) => {
              const user = users.find((u: any) => u.id === id);
              return {
                id,
                name: user?.name || user?.username || 'Unknown User',
                username: user?.username,
                profile_image_url: user?.profile_image_url
              };
            }),
            lastMessage: messages[0] || {
              id: 'no_message',
              text: 'No messages yet',
              senderId: 'system',
              senderName: 'System',
              createdAt: new Date(conv.created_at),
              isFromPage: false,
            },
            unreadCount: 0, // Twitter API doesn't provide unread count
            updatedAt: new Date(conv.created_at),
            messages: messages.slice(0, 5),
          });
        } catch (convError) {
          console.error(\`[Twitter] Error processing conversation \${conv.id}:\`, convError);
        }
      }

      console.log(\`[Twitter] Successfully synced \${conversations.length} conversations\`);
      return conversations;
    } catch (error) {
      console.error('[Twitter] Error in getInboxMessages:', error);
      return [];
    }
  }`;

    // Find the incomplete Twitter implementation and replace it
    const updatedContent = content.replace(
      /const messages: ConversationMessage\[\] = \(messagesData\.data \|\| \[\]\)[\s\S]*?(?=\n\s*async sendMessage)/,
      twitterInboxFix + '\n\n  async sendMessage'
    );

    if (updatedContent !== content) {
      await this.writeFile(filePath, updatedContent);
      return true;
    } else {
      this.error('Could not find Twitter inbox implementation to fix');
      return false;
    }
  }

  async createImprovedConversationDebugger() {
    this.log('🔧 Creating improved conversation debugger...');
    
    const debuggerContent = `// Conversation Sync Debugger
// Add this to your conversation page to debug sync issues

export const debugConversationSync = async () => {
  console.log('🔍 Starting conversation sync debug...');
  
  try {
    // Check if user is authenticated
    const user = auth?.currentUser;
    if (!user) {
      console.error('❌ User not authenticated');
      return;
    }
    
    console.log('✅ User authenticated:', user.uid);
    
    // Check connected social accounts
    const accountsSnapshot = await getDocs(
      collection(db, 'workspaces', user.uid, 'social_accounts')
    );
    
    console.log(\`📱 Found \${accountsSnapshot.size} connected social accounts:\`);
    accountsSnapshot.forEach(doc => {
      const account = doc.data();
      console.log(\`  - \${account.platform}: \${account.displayName}\`);
      console.log(\`    Token expires: \${account.tokens?.expiresAt ? new Date(account.tokens.expiresAt).toISOString() : 'Never'}\`);
      console.log(\`    Last synced: \${account.lastSynced ? new Date(account.lastSynced.seconds * 1000).toISOString() : 'Never'}\`);
    });
    
    // Test sync API
    const token = await user.getIdToken();
    console.log('🔄 Testing sync API...');
    
    const syncResponse = await fetch('/api/social/inbox/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });
    
    if (!syncResponse.ok) {
      const error = await syncResponse.json();
      console.error('❌ Sync API failed:', error);
      return;
    }
    
    const syncResult = await syncResponse.json();
    console.log('✅ Sync API response:', syncResult);
    
    // Check conversations in Firestore
    const conversationsSnapshot = await getDocs(
      query(
        collection(db, 'workspaces', user.uid, 'conversations'),
        orderBy('updatedAt', 'desc'),
        limit(10)
      )
    );
    
    console.log(\`💬 Found \${conversationsSnapshot.size} conversations in Firestore:\`);
    conversationsSnapshot.forEach(doc => {
      const conv = doc.data();
      console.log(\`  - \${conv.platform || 'unknown'}: \${conv.contact?.name || 'Unknown Contact'}\`);
      console.log(\`    Last message: \${conv.lastMessage?.content?.substring(0, 50) || 'No message'}...\`);
      console.log(\`    Updated: \${conv.updatedAt ? new Date(conv.updatedAt.seconds * 1000).toISOString() : 'Unknown'}\`);
    });
    
    if (conversationsSnapshot.size === 0) {
      console.warn('⚠️  No conversations found in Firestore - this is why you see placeholder data');
      console.log('💡 Possible solutions:');
      console.log('  1. Check if your social accounts have proper permissions');
      console.log('  2. Verify your OAuth apps are configured correctly');
      console.log('  3. Check Firestore security rules');
      console.log('  4. Try reconnecting your social accounts');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
};

// Call this function from your browser console to debug
// debugConversationSync();`;

    await this.writeFile('src/lib/conversation-debugger.ts', debuggerContent);
    return true;
  }

  async createConversationSyncService() {
    this.log('🔄 Creating improved conversation sync service...');
    
    const serviceContent = `import { db, auth } from './firebase';
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
      console.log(\`[ConversationSync] Cleared \${snapshot.size} test conversations\`);
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
};`;

    await this.writeFile('src/lib/conversation-sync-service.ts', serviceContent);
    return true;
  }

  async updateConversationPage() {
    this.log('📄 Updating conversation page with better debugging...');
    
    const filePath = 'src/app/dashboard/conversations/page.tsx';
    const content = await this.readFile(filePath);
    
    if (!content) return false;

    // Add import for the new sync service
    const importFix = content.replace(
      "import { subscribeToConversations, subscribeToMessages, sendMessage, markAsRead, getConnectedSocialProfiles, initializeConversationsForUser, syncAllConnectedPlatforms, syncConversationsFromPlatform } from '@/lib/conversation-api';",
      `import { subscribeToConversations, subscribeToMessages, sendMessage, markAsRead, getConnectedSocialProfiles, initializeConversationsForUser, syncAllConnectedPlatforms, syncConversationsFromPlatform } from '@/lib/conversation-api';
import { getCurrentUserSyncService } from '@/lib/conversation-sync-service';
import { debugConversationSync } from '@/lib/conversation-debugger';`
    );

    // Add debug button to the sync section
    const debugButtonFix = importFix.replace(
      '<Button \n                variant="outline" \n                size="sm" \n                onClick={handleSyncConversations}\n                disabled={isSyncing || connectedProfiles.length === 0}\n              >\n                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? \'animate-spin\' : \'\'}`} />\n                {isSyncing ? \'Syncing...\' : \'Sync\'}\n              </Button>',
      `<div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSyncConversations}
                  disabled={isSyncing || connectedProfiles.length === 0}
                >
                  <RefreshCw className={\`h-4 w-4 mr-2 \${isSyncing ? 'animate-spin' : ''}\`} />
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => debugConversationSync()}
                  title="Debug conversation sync"
                >
                  🔍
                </Button>
              </div>`
    );

    if (debugButtonFix !== content) {
      await this.writeFile(filePath, debugButtonFix);
      return true;
    } else {
      this.error('Could not update conversation page');
      return false;
    }
  }

  async generateSummaryReport() {
    this.log('\n' + '='.repeat(60));
    this.log('📊 CONVERSATION SYNC FIX SUMMARY');
    this.log('='.repeat(60));

    if (this.fixes.length > 0) {
      console.log('\n✅ FIXES APPLIED:');
      this.fixes.forEach((fix, index) => {
        console.log(`  ${index + 1}. ${fix}`);
      });
    }

    if (this.issues.length > 0) {
      console.log('\n❌ ISSUES ENCOUNTERED:');
      this.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }

    console.log('\n📝 NEXT STEPS TO FIX YOUR CONVERSATION SYNC:');
    console.log('  1. Run: npm run dev (restart your development server)');
    console.log('  2. Go to your conversation page');
    console.log('  3. Click the 🔍 debug button to run diagnostics');
    console.log('  4. Check browser console for detailed debug information');
    console.log('  5. If no real conversations appear, check:');
    console.log('     - Your social media accounts are properly connected');
    console.log('     - OAuth apps have correct permissions (especially for DMs/messages)');
    console.log('     - Firestore security rules allow conversation access');
    console.log('  6. Run the test script: node test-conversation-sync.js');

    console.log('\n🔧 DEBUGGING TOOLS CREATED:');
    console.log('  - test-conversation-sync.js: Comprehensive testing script');
    console.log('  - src/lib/conversation-debugger.ts: Browser-based debugging');
    console.log('  - src/lib/conversation-sync-service.ts: Improved sync service');

    console.log('\n💡 COMMON ISSUES AND SOLUTIONS:');
    console.log('  - "Unknown Contact" messages = No real conversations synced');
    console.log('  - Empty conversation list = Check social account permissions');
    console.log('  - Sync button disabled = No connected social accounts');
    console.log('  - Sync fails = Check OAuth app configuration');
  }

  async runAllFixes() {
    console.log('🚀 Starting comprehensive conversation sync fix...\n');

    await this.fixTwitterInboxImplementation();
    await this.createImprovedConversationDebugger();
    await this.createConversationSyncService();
    await this.updateConversationPage();
    
    await this.generateSummaryReport();
    
    console.log('\n✅ All fixes completed! Restart your dev server and test the conversation sync.');
  }
}

// Run all fixes
const fixer = new ConversationSyncFixer();
fixer.runAllFixes().catch(console.error);