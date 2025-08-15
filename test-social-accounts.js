#!/usr/bin/env node

/**
 * Quick test to check your connected social accounts
 * This will help identify if the issue is with account connections or sync logic
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin. Make sure serviceAccountKey.json exists.');
  console.error('   Download it from Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

const db = admin.firestore();

async function testSocialAccounts() {
  console.log('🔍 Testing connected social accounts...\n');

  try {
    // Get all workspaces (users)
    const workspacesSnapshot = await db.collection('workspaces').get();
    
    if (workspacesSnapshot.empty) {
      console.log('❌ No workspaces found. Make sure you have users in your system.');
      return;
    }

    console.log(`Found ${workspacesSnapshot.size} workspace(s):\n`);

    for (const workspaceDoc of workspacesSnapshot.docs) {
      const workspaceId = workspaceDoc.id;
      console.log(`👤 Workspace: ${workspaceId}`);

      // Check social accounts
      const socialAccountsSnapshot = await db
        .collection('workspaces')
        .doc(workspaceId)
        .collection('social_accounts')
        .get();

      if (socialAccountsSnapshot.empty) {
        console.log('  ❌ No social accounts connected');
      } else {
        console.log(`  ✅ ${socialAccountsSnapshot.size} social account(s) connected:`);
        
        socialAccountsSnapshot.docs.forEach(doc => {
          const account = doc.data();
          console.log(`    - ${account.platform?.toUpperCase() || 'UNKNOWN'}: ${account.displayName || account.username || 'Unknown'}`);
          console.log(`      Token expires: ${account.tokens?.expiresAt ? new Date(account.tokens.expiresAt).toISOString() : 'Never'}`);
          console.log(`      Last synced: ${account.lastSynced ? account.lastSynced.toDate().toISOString() : 'Never'}`);
        });
      }

      // Check conversations
      const conversationsSnapshot = await db
        .collection('workspaces')
        .doc(workspaceId)
        .collection('conversations')
        .limit(5)
        .get();

      if (conversationsSnapshot.empty) {
        console.log('  ❌ No conversations found (this is why you see placeholder data)');
      } else {
        console.log(`  ✅ ${conversationsSnapshot.size} conversation(s) found:`);
        
        conversationsSnapshot.docs.forEach(doc => {
          const conv = doc.data();
          console.log(`    - ${conv.platform || 'unknown'}: ${conv.contact?.name || 'Unknown Contact'}`);
          console.log(`      Last message: ${conv.lastMessage?.content?.substring(0, 50) || 'No message'}...`);
          console.log(`      Updated: ${conv.updatedAt ? conv.updatedAt.toDate().toISOString() : 'Unknown'}`);
        });
      }

      console.log(''); // Empty line between workspaces
    }

    console.log('📊 SUMMARY:');
    console.log('If you see "No conversations found", that explains the placeholder data.');
    console.log('The sync process needs to successfully fetch conversations from your social platforms.');
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Make sure your social accounts have proper permissions for messaging/DMs');
    console.log('2. Check that your OAuth apps are configured correctly');
    console.log('3. Try the sync button in the conversation page');
    console.log('4. Use the debug tools we created to troubleshoot further');

  } catch (error) {
    console.error('❌ Error testing social accounts:', error);
  }
}

testSocialAccounts().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});