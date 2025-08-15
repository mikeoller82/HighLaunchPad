// Conversation Sync Debugger
// Add this to your conversation page to debug sync issues

import { auth, db } from './firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

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
    
    // First, test the debug API to get server-side information
    const token = await user.getIdToken();
    console.log('🔧 Testing debug API...');
    
    const debugResponse = await fetch('/api/social/debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });
    
    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      console.log('📊 Server Debug Info:', debugData.debug);
      
      if (debugData.debug.accountCount === 0) {
        console.warn('⚠️  No social accounts connected - this explains the sync failures');
        console.log('💡 Solution: Go to Settings and connect your social media accounts');
        return;
      }
      
      if (debugData.debug.conversationCount === 0) {
        console.warn('⚠️  No conversations in database - this explains placeholder data');
      }
    } else {
      const debugError = await debugResponse.json();
      console.error('❌ Debug API failed:', debugError);
    }
    
    // Check connected social accounts
    const accountsSnapshot = await getDocs(
      collection(db, 'workspaces', user.uid, 'social_accounts')
    );
    
    console.log(`📱 Found ${accountsSnapshot.size} connected social accounts:`);
    accountsSnapshot.forEach(doc => {
      const account = doc.data();
      console.log(`  - ${account.platform}: ${account.displayName}`);
      console.log(`    Token expires: ${account.tokens?.expiresAt ? new Date(account.tokens.expiresAt).toISOString() : 'Never'}`);
      console.log(`    Last synced: ${account.lastSynced ? new Date(account.lastSynced.seconds * 1000).toISOString() : 'Never'}`);
    });
    
    // Test sync API
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
    
    console.log(`💬 Found ${conversationsSnapshot.size} conversations in Firestore:`);
    conversationsSnapshot.forEach(doc => {
      const conv = doc.data();
      console.log(`  - ${conv.platform || 'unknown'}: ${conv.contact?.name || 'Unknown Contact'}`);
      console.log(`    Last message: ${conv.lastMessage?.content?.substring(0, 50) || 'No message'}...`);
      console.log(`    Updated: ${conv.updatedAt ? new Date(conv.updatedAt.seconds * 1000).toISOString() : 'Unknown'}`);
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
// debugConversationSync();