#!/usr/bin/env node

/**
 * Quick test to check your social accounts and conversation sync
 * This will help us verify the fixes are working
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

let db;
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  db = admin.firestore();
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin.');
  console.error('   Make sure serviceAccountKey.json exists in your project root.');
  console.error('   Download it from: Firebase Console > Project Settings > Service Accounts > Generate new private key');
  process.exit(1);
}

async function quickTest() {
  console.log('🚀 Quick Social Accounts & Conversation Test\n');

  try {
    // Get all workspaces (users)
    const workspacesSnapshot = await db.collection('workspaces').get();
    
    if (workspacesSnapshot.empty) {
      console.log('❌ No users found in your system.');
      console.log('   Make sure you have logged in at least once to create a workspace.');
      return;
    }

    console.log(`Found ${workspacesSnapshot.size} user(s) in your system:\n`);

    for (const workspaceDoc of workspacesSnapshot.docs) {
      const workspaceId = workspaceDoc.id;
      console.log(`👤 User ID: ${workspaceId}`);

      // Check social accounts
      const socialAccountsSnapshot = await db
        .collection('workspaces')
        .doc(workspaceId)
        .collection('social_accounts')
        .get();

      console.log(`📱 Social Accounts: ${socialAccountsSnapshot.size} connected`);
      
      if (socialAccountsSnapshot.empty) {
        console.log('   ❌ No social accounts connected');
        console.log('   → Go to Settings and connect your social media accounts');
      } else {
        socialAccountsSnapshot.docs.forEach((doc, index) => {
          const account = doc.data();
          const platform = account.platform?.toUpperCase() || 'UNKNOWN';
          const name = account.displayName || account.username || 'Unknown';
          const tokenExpiry = account.tokens?.expiresAt ? 
            new Date(account.tokens.expiresAt).toLocaleDateString() : 'Never';
          const lastSync = account.lastSynced ? 
            account.lastSynced.toDate().toLocaleDateString() : 'Never';
          
          console.log(`   ${index + 1}. ${platform}: ${name}`);
          console.log(`      Token expires: ${tokenExpiry}`);
          console.log(`      Last synced: ${lastSync}`);
        });
      }

      // Check conversations
      const conversationsSnapshot = await db
        .collection('workspaces')
        .doc(workspaceId)
        .collection('conversations')
        .orderBy('updatedAt', 'desc')
        .limit(10)
        .get();

      console.log(`💬 Conversations: ${conversationsSnapshot.size} found`);
      
      if (conversationsSnapshot.empty) {
        console.log('   ❌ No conversations found');
        console.log('   → This explains why you see "Unknown Contact" placeholder messages');
        console.log('   → Try clicking the Sync button in the conversation page');
      } else {
        conversationsSnapshot.docs.forEach((doc, index) => {
          const conv = doc.data();
          const platform = conv.platform?.toUpperCase() || 'UNKNOWN';
          const contactName = conv.contact?.name || 'Unknown Contact';
          const lastMessage = conv.lastMessage?.content?.substring(0, 40) || 'No message';
          const updated = conv.updatedAt ? 
            conv.updatedAt.toDate().toLocaleDateString() : 'Unknown';
          
          console.log(`   ${index + 1}. ${platform}: ${contactName}`);
          console.log(`      Last message: "${lastMessage}..."`);
          console.log(`      Updated: ${updated}`);
        });
      }

      console.log(''); // Empty line between users
    }

    // Summary and recommendations
    console.log('📊 QUICK DIAGNOSIS:');
    
    const totalWorkspaces = workspacesSnapshot.size;
    let totalSocialAccounts = 0;
    let totalConversations = 0;
    
    for (const workspaceDoc of workspacesSnapshot.docs) {
      const socialSnapshot = await db
        .collection('workspaces')
        .doc(workspaceDoc.id)
        .collection('social_accounts')
        .get();
      totalSocialAccounts += socialSnapshot.size;
      
      const convSnapshot = await db
        .collection('workspaces')
        .doc(workspaceDoc.id)
        .collection('conversations')
        .get();
      totalConversations += convSnapshot.size;
    }

    console.log(`   Users: ${totalWorkspaces}`);
    console.log(`   Connected Social Accounts: ${totalSocialAccounts}`);
    console.log(`   Total Conversations: ${totalConversations}`);

    if (totalConversations === 0) {
      console.log('\n🚨 ISSUE IDENTIFIED:');
      console.log('   You have no conversations in your database.');
      console.log('   This is why you see placeholder "Unknown Contact" messages.');
      
      console.log('\n💡 SOLUTIONS:');
      console.log('   1. Make sure your social accounts have actual messages/conversations');
      console.log('   2. Check OAuth app permissions (especially for messaging/DMs)');
      console.log('   3. Try the sync button in the conversation page');
      console.log('   4. Use the 🔍 debug button for detailed error messages');
      console.log('   5. Reconnect your social accounts if tokens are expired');
    } else {
      console.log('\n✅ LOOKS GOOD:');
      console.log('   You have conversations in your database.');
      console.log('   If you still see placeholder data, check the conversation page filters.');
    }

    console.log('\n🔧 NEXT STEPS:');
    console.log('   1. Open your app: http://localhost:3000');
    console.log('   2. Go to the Conversations page');
    console.log('   3. Click the 🔍 debug button next to sync');
    console.log('   4. Check browser console for detailed information');
    console.log('   5. Try the sync button to fetch new conversations');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\nThis might indicate:');
    console.error('   - Firebase configuration issues');
    console.error('   - Database permission problems');
    console.error('   - Network connectivity issues');
  }
}

// Run the test
quickTest().then(() => {
  console.log('\n✅ Quick test completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});