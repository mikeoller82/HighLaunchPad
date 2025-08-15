# Conversation Sync Testing Guide

## Quick Test Steps

### 1. Start Your Development Server
```bash
npm run dev
```

### 2. Open Your App
Go to: `http://localhost:3000`

### 3. Navigate to Conversations
- Log in to your account
- Go to the **Conversations** page from the sidebar

### 4. Run the Test Suite
You'll see three buttons next to the sync button:
- **Sync** - Syncs conversations from your connected platforms
- **🔍** - Debug button for detailed sync information  
- **🧪** - Comprehensive test suite (NEW!)

**Click the 🧪 button** to run the full test suite.

### 5. Check Browser Console
Open your browser's developer tools (F12) and look at the console. You'll see detailed test results like:

```
🚀 Starting Conversation Sync Test Suite
==========================================
✅ User authenticated: abc123...
✅ Found 4 connected social accounts
  - FACEBOOK: My Page Name (expires: 12/25/2025)
  - TWITTER: @myhandle (expires: Never)
  - LINKEDIN: John Doe (expires: 1/15/2025)
  - INSTAGRAM: my_insta (expires: 12/25/2025)
❌ Found 0 conversations in database
⚠️  No conversations found - this explains placeholder data
✅ Social accounts API successful: 4 accounts
✅ Sync API successful: 0 conversations synced
```

## Understanding the Results

### ✅ **If Everything Works:**
- You see real conversations from your social accounts
- No more "Unknown Contact" placeholder messages
- Test suite shows conversations in database

### ❌ **If You Still See Placeholder Data:**

The test suite will tell you exactly what's wrong:

#### **Issue: "Found 0 conversations in database"**
**Cause:** No real conversations are being synced from your social accounts
**Solutions:**
1. Check if your social media accounts actually have messages/DMs
2. Verify OAuth app permissions include messaging/DM access
3. Try reconnecting expired social accounts
4. Check if your social accounts have any conversations to sync

#### **Issue: "No social accounts connected"**
**Cause:** You haven't connected any social media accounts
**Solution:** Go to Settings and connect your social media accounts

#### **Issue: "Token expired"**
**Cause:** Your social media account tokens have expired
**Solution:** Reconnect the expired accounts in Settings

#### **Issue: "Sync API failed"**
**Cause:** The sync process is encountering errors
**Solutions:**
1. Check browser network tab for API errors
2. Verify your OAuth apps are configured correctly
3. Check Firestore database permissions

## Platform-Specific Notes

### Facebook/Instagram
- Requires Facebook Page with messaging enabled
- Needs proper page permissions for conversations
- Instagram uses Facebook's messaging API

### Twitter/X
- Requires DM permissions in your Twitter app
- Check Twitter Developer Console for proper scopes
- May have rate limiting restrictions

### LinkedIn
- Has limited messaging API access
- May not return conversations (this is normal)
- Primarily for posting, not messaging

## Advanced Debugging

### Manual Console Commands
After running the test suite, you can run individual tests:

```javascript
// Test sync functionality
testSuite.testSyncAPI()

// Check stored conversations
testSuite.testConversations()

// Check social account connections
testSuite.testSocialAccounts()

// Export test results to file
testSuite.exportResults()
```

### Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Click sync button
4. Look for failed API calls (red entries)
5. Check response details for error messages

## Common Solutions

### 1. **OAuth App Configuration**
Make sure your OAuth apps have these permissions:
- **Facebook:** `pages_messaging`, `pages_read_engagement`
- **Twitter:** `dm.read`, `dm.write` 
- **LinkedIn:** `w_member_social` (limited messaging)

### 2. **Reconnect Social Accounts**
If tokens are expired:
1. Go to Settings
2. Disconnect the expired account
3. Reconnect with fresh permissions

### 3. **Check Social Account Activity**
- Make sure your social accounts have actual messages/DMs
- Test with accounts that have recent conversations
- Some platforms may not have any messages to sync

### 4. **Firestore Database**
Verify your Firestore rules allow conversation access:
```javascript
// Should allow read/write to conversations
match /workspaces/{workspaceId}/conversations/{conversationId} {
  allow read, write: if request.auth.uid == workspaceId;
}
```

## Expected Timeline

- **Immediate:** Test suite results in console
- **1-2 minutes:** Social account sync completion
- **Real conversations:** Should appear after successful sync

## Getting Help

If you're still having issues after following this guide:

1. **Run the test suite** and note the specific error messages
2. **Check browser console** for JavaScript errors
3. **Verify OAuth app settings** in each platform's developer console
4. **Test with a fresh social account connection**
5. **Check that your social accounts have actual messages to sync**

The test suite will give you specific, actionable information about what's preventing your conversations from syncing properly.