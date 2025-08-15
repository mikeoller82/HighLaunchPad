#!/usr/bin/env node

/**
 * Comprehensive test script to debug conversation sync issues
 * This will help identify why you're seeing placeholder data instead of real conversations
 */

const fetch = require('node-fetch');

class ConversationSyncTester {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    this.testUserId = null;
    this.testToken = null;
  }

  async log(message, data = null) {
    console.log(`[${new Date().toISOString()}] ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  async error(message, error = null) {
    console.error(`[${new Date().toISOString()}] ❌ ${message}`);
    if (error) {
      console.error(error);
    }
  }

  async success(message, data = null) {
    console.log(`[${new Date().toISOString()}] ✅ ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  async testSocialAccountsConnection() {
    this.log('🔍 Testing connected social accounts...');
    
    try {
      // You'll need to provide a valid Firebase ID token for testing
      // This would normally come from your authenticated user
      const response = await fetch(`${this.baseUrl}/api/social/accounts`, {
        headers: {
          'Authorization': `Bearer ${this.testToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.error('Failed to fetch social accounts', errorData);
        return [];
      }

      const accounts = await response.json();
      this.success(`Found ${accounts.length} connected social accounts`);
      
      accounts.forEach((account, index) => {
        console.log(`  ${index + 1}. ${account.platform.toUpperCase()}: ${account.displayName} (${account.username})`);
        console.log(`     - Profile Picture: ${account.profilePicture ? 'Yes' : 'No'}`);
        console.log(`     - Token Expires: ${account.tokens.expiresAt ? new Date(account.tokens.expiresAt).toISOString() : 'Never'}`);
        console.log(`     - Last Synced: ${account.lastSynced ? new Date(account.lastSynced).toISOString() : 'Never'}`);
      });

      return accounts;
    } catch (error) {
      this.error('Error testing social accounts connection', error);
      return [];
    }
  }

  async testInboxSync(platforms = null) {
    this.log('🔄 Testing inbox sync...');
    
    try {
      const requestBody = {
        token: this.testToken
      };

      if (platforms) {
        requestBody.platforms = platforms;
      }

      const response = await fetch(`${this.baseUrl}/api/social/inbox/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.error('Inbox sync failed', errorData);
        return null;
      }

      const result = await response.json();
      this.success('Inbox sync completed', result);

      if (result.results) {
        result.results.forEach(platformResult => {
          if (platformResult.success) {
            console.log(`  ✅ ${platformResult.platform.toUpperCase()}: ${platformResult.count} conversations`);
          } else {
            console.log(`  ❌ ${platformResult.platform.toUpperCase()}: ${platformResult.error}`);
          }
        });
      }

      return result;
    } catch (error) {
      this.error('Error testing inbox sync', error);
      return null;
    }
  }

  async testConversationRetrieval() {
    this.log('📥 Testing conversation retrieval...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/social/inbox/sync?token=${this.testToken}&limit=10`);

      if (!response.ok) {
        const errorData = await response.json();
        this.error('Failed to retrieve conversations', errorData);
        return [];
      }

      const result = await response.json();
      this.success(`Retrieved ${result.conversations?.length || 0} conversations`);

      if (result.conversations && result.conversations.length > 0) {
        result.conversations.forEach((conv, index) => {
          console.log(`  ${index + 1}. ${conv.platform.toUpperCase()} - ${conv.id}`);
          console.log(`     - Participants: ${conv.participants?.length || 0}`);
          console.log(`     - Unread: ${conv.unreadCount || 0}`);
          console.log(`     - Last Message: ${conv.lastMessage?.text?.substring(0, 50) || 'No message'}...`);
          console.log(`     - Updated: ${conv.updatedAt ? new Date(conv.updatedAt).toISOString() : 'Unknown'}`);
        });
      } else {
        console.log('  No conversations found - this might be why you see placeholder data');
      }

      return result.conversations || [];
    } catch (error) {
      this.error('Error testing conversation retrieval', error);
      return [];
    }
  }

  async testPlatformSpecificSync(platform) {
    this.log(`🎯 Testing ${platform.toUpperCase()} specific sync...`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/social/inbox/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.testToken,
          platforms: [platform]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.error(`${platform} sync failed`, errorData);
        return null;
      }

      const result = await response.json();
      this.success(`${platform} sync completed`, result);
      return result;
    } catch (error) {
      this.error(`Error testing ${platform} sync`, error);
      return null;
    }
  }

  async testEmailSync() {
    this.log('📧 Testing email sync...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/email/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.testToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: 'gmail',
          email: 'test@example.com', // This would be the user's actual email
          password: '' // This would need proper OAuth setup
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.error('Email sync failed (this is expected if not configured)', errorData);
        return null;
      }

      const result = await response.json();
      this.success('Email sync completed', result);
      return result;
    } catch (error) {
      this.error('Error testing email sync (this is expected if not configured)', error);
      return null;
    }
  }

  async diagnoseIssues() {
    this.log('🔍 Diagnosing conversation sync issues...');
    
    const issues = [];
    const recommendations = [];

    // Check if user has connected accounts
    const accounts = await this.testSocialAccountsConnection();
    if (accounts.length === 0) {
      issues.push('No social accounts connected');
      recommendations.push('Connect at least one social media account in Settings');
    }

    // Check if tokens are expired
    const expiredAccounts = accounts.filter(account => 
      account.tokens.expiresAt && account.tokens.expiresAt < Date.now()
    );
    if (expiredAccounts.length > 0) {
      issues.push(`${expiredAccounts.length} accounts have expired tokens`);
      recommendations.push('Reconnect expired social media accounts');
    }

    // Test sync functionality
    const syncResult = await this.testInboxSync();
    if (!syncResult || syncResult.totalConversations === 0) {
      issues.push('Inbox sync returns no conversations');
      recommendations.push('Check social media account permissions and API access');
    }

    // Test conversation retrieval
    const conversations = await this.testConversationRetrieval();
    if (conversations.length === 0) {
      issues.push('No conversations stored in database');
      recommendations.push('Verify Firestore database structure and permissions');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSIS SUMMARY');
    console.log('='.repeat(60));

    if (issues.length === 0) {
      this.success('No issues detected! Your conversation sync should be working.');
    } else {
      console.log('\n🚨 ISSUES FOUND:');
      issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });

      console.log('\n💡 RECOMMENDATIONS:');
      recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }

    console.log('\n📝 NEXT STEPS:');
    console.log('  1. Ensure you have valid social media accounts connected');
    console.log('  2. Check that your OAuth apps have the correct permissions');
    console.log('  3. Verify your Firestore security rules allow conversation access');
    console.log('  4. Test the sync manually from the conversation page');
    console.log('  5. Check browser console for any JavaScript errors');
  }

  async runFullTest() {
    console.log('🚀 Starting comprehensive conversation sync test...\n');

    // You need to provide a valid Firebase ID token for testing
    // This would normally come from your authenticated user session
    if (!this.testToken) {
      console.log('⚠️  To run this test, you need to provide a valid Firebase ID token.');
      console.log('   You can get this from your browser\'s developer tools:');
      console.log('   1. Open your app and log in');
      console.log('   2. Open Developer Tools > Application > Local Storage');
      console.log('   3. Look for Firebase auth token');
      console.log('   4. Set the FIREBASE_TEST_TOKEN environment variable');
      console.log('\n   Example: FIREBASE_TEST_TOKEN="your_token_here" node test-conversation-sync.js\n');
      return;
    }

    await this.diagnoseIssues();

    console.log('\n🔧 DETAILED TESTING:');
    
    // Test each platform individually
    const platforms = ['facebook', 'instagram', 'linkedin', 'twitter'];
    for (const platform of platforms) {
      await this.testPlatformSpecificSync(platform);
    }

    // Test email sync
    await this.testEmailSync();

    console.log('\n✅ Test completed! Check the output above for issues and recommendations.');
  }
}

// Run the test
const tester = new ConversationSyncTester();

// Get test token from environment variable
tester.testToken = process.env.FIREBASE_TEST_TOKEN;

tester.runFullTest().catch(console.error);