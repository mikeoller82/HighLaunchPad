/**
 * Browser-based conversation sync test suite
 * Run this in your browser console to test the conversation sync functionality
 */

import { auth, db } from './firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export class ConversationTestSuite {
  private results: string[] = [];

  private log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    const timestamp = new Date().toISOString();
    const emoji = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type];
    
    const logMessage = `[${timestamp}] ${emoji} ${message}`;
    console.log(logMessage);
    this.results.push(logMessage);
  }

  async testAuthentication(): Promise<boolean> {
    this.log('Testing user authentication...');
    
    const user = auth?.currentUser;
    if (!user) {
      this.log('User not authenticated', 'error');
      return false;
    }
    
    this.log(`User authenticated: ${user.uid}`, 'success');
    return true;
  }

  async testSocialAccounts(): Promise<number> {
    this.log('Checking connected social accounts...');
    
    const user = auth?.currentUser;
    if (!user) return 0;

    try {
      const accountsSnapshot = await getDocs(
        collection(db, 'workspaces', user.uid, 'social_accounts')
      );

      this.log(`Found ${accountsSnapshot.size} connected social accounts`, 'success');
      
      accountsSnapshot.forEach(doc => {
        const account = doc.data();
        const platform = account.platform?.toUpperCase() || 'UNKNOWN';
        const name = account.displayName || account.username || 'Unknown';
        const tokenExpiry = account.tokens?.expiresAt ? 
          new Date(account.tokens.expiresAt).toLocaleDateString() : 'Never';
        
        this.log(`  - ${platform}: ${name} (expires: ${tokenExpiry})`);
        
        // Check if token is expired
        if (account.tokens?.expiresAt && account.tokens.expiresAt < Date.now()) {
          this.log(`    Token expired! Reconnect this account.`, 'warning');
        }
      });

      return accountsSnapshot.size;
    } catch (error) {
      this.log(`Error checking social accounts: ${error}`, 'error');
      return 0;
    }
  }

  async testConversations(): Promise<number> {
    this.log('Checking stored conversations...');
    
    const user = auth?.currentUser;
    if (!user) return 0;

    try {
      const conversationsSnapshot = await getDocs(
        query(
          collection(db, 'workspaces', user.uid, 'conversations'),
          orderBy('updatedAt', 'desc'),
          limit(10)
        )
      );

      this.log(`Found ${conversationsSnapshot.size} conversations in database`, 'success');
      
      if (conversationsSnapshot.size === 0) {
        this.log('No conversations found - this explains placeholder data', 'warning');
        return 0;
      }

      conversationsSnapshot.forEach((doc) => {
        const conv = doc.data();
        const platform = conv.platform?.toUpperCase() || 'UNKNOWN';
        const contactName = conv.contact?.name || 'Unknown Contact';
        const lastMessage = conv.lastMessage?.content?.substring(0, 40) || 'No message';
        const updated = conv.updatedAt ? 
          new Date(conv.updatedAt.seconds * 1000).toLocaleDateString() : 'Unknown';
        
        this.log(`  • ${platform}: ${contactName}`);
        this.log(`     Last: "${lastMessage}..." (${updated})`);
      });

      return conversationsSnapshot.size;
    } catch (error) {
      this.log(`Error checking conversations: ${error}`, 'error');
      return 0;
    }
  }

  async testSyncAPI(): Promise<boolean> {
    this.log('Testing conversation sync API...');
    
    const user = auth?.currentUser;
    if (!user) return false;

    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/social/inbox/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.log(`Sync API failed: ${errorData.error}`, 'error');
        return false;
      }

      const result = await response.json();
      this.log(`Sync API successful: ${result.totalConversations || 0} conversations synced`, 'success');
      
      if (result.results) {
        result.results.forEach((platformResult: any) => {
          if (platformResult.success) {
            this.log(`  ✅ ${platformResult.platform}: ${platformResult.count} conversations`);
          } else {
            this.log(`  ❌ ${platformResult.platform}: ${platformResult.error}`, 'error');
          }
        });
      }

      return true;
    } catch (error) {
      this.log(`Sync API error: ${error}`, 'error');
      return false;
    }
  }

  async testSocialAccountsAPI(): Promise<boolean> {
    this.log('Testing social accounts API...');
    
    const user = auth?.currentUser;
    if (!user) return false;

    try {
      const token = await user.getIdToken();
      
      const response = await fetch(`/api/social/accounts?token=${token}`);

      if (!response.ok) {
        const errorData = await response.json();
        this.log(`Social accounts API failed: ${errorData.error}`, 'error');
        return false;
      }

      const accounts = await response.json();
      this.log(`Social accounts API successful: ${accounts.length} accounts`, 'success');
      
      return true;
    } catch (error) {
      this.log(`Social accounts API error: ${error}`, 'error');
      return false;
    }
  }

  async runFullTest(): Promise<void> {
    console.clear();
    this.results = [];
    
    this.log('🚀 Starting Conversation Sync Test Suite', 'info');
    this.log('==========================================', 'info');

    // Test 1: Authentication
    const isAuthenticated = await this.testAuthentication();
    if (!isAuthenticated) {
      this.log('Cannot continue without authentication', 'error');
      return;
    }

    // Test 2: Social Accounts
    const socialAccountCount = await this.testSocialAccounts();
    
    // Test 3: Conversations
    const conversationCount = await this.testConversations();
    
    // Test 4: APIs
    await this.testSocialAccountsAPI();
    await this.testSyncAPI();

    // Summary
    this.log('==========================================', 'info');
    this.log('📊 TEST SUMMARY', 'info');
    this.log('==========================================', 'info');
    
    this.log(`Connected Social Accounts: ${socialAccountCount}`);
    this.log(`Stored Conversations: ${conversationCount}`);

    if (conversationCount === 0) {
      this.log('🚨 ISSUE IDENTIFIED:', 'warning');
      this.log('No conversations in database = placeholder data shown', 'warning');
      
      this.log('💡 POSSIBLE SOLUTIONS:', 'info');
      this.log('1. Check if your social accounts have actual messages/DMs');
      this.log('2. Verify OAuth app permissions for messaging');
      this.log('3. Try reconnecting expired social accounts');
      this.log('4. Use the sync button to fetch conversations');
      this.log('5. Check browser network tab for API errors');
    } else {
      this.log('✅ Conversations found in database', 'success');
      this.log('If you still see placeholder data, check page filters', 'info');
    }

    this.log('==========================================', 'info');
    this.log('🔧 DEBUGGING COMMANDS:', 'info');
    this.log('Run these in console for more details:', 'info');
    this.log('- testSuite.testSyncAPI() // Test sync functionality');
    this.log('- testSuite.testConversations() // Check stored data');
    this.log('- testSuite.testSocialAccounts() // Check connections');
  }

  getResults(): string[] {
    return this.results;
  }

  exportResults(): void {
    const resultsText = this.results.join('\\n');
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-test-results-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.log('Test results exported to file', 'success');
  }
}

// Create global instance for easy access
declare global {
  interface Window {
    testSuite: ConversationTestSuite;
  }
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  window.testSuite = new ConversationTestSuite();
}

export const testSuite = new ConversationTestSuite();