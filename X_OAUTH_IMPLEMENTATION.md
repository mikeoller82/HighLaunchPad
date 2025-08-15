# X (Twitter) OAuth 2.0 Authorization Code Flow with PKCE Implementation

This document describes the updated X OAuth 2.0 implementation that follows the official X API v2 OAuth 2.0 Authorization Code Flow with PKCE specification.

## 🔄 Changes Made

### 1. Updated API Endpoints
- **Authorization URL**: Changed from `https://twitter.com/i/oauth2/authorize` to `https://x.com/i/oauth2/authorize`
- **Token Exchange URL**: Changed from `https://api.twitter.com/2/oauth2/token` to `https://api.x.com/2/oauth2/token`
- **API Base URL**: Changed from `https://api.twitter.com/2` to `https://api.x.com/2`

### 2. Enhanced Scopes Configuration
Added the `offline.access` scope to enable refresh token generation:

```typescript
scopes: [
  'tweet.read',
  'tweet.write', 
  'users.read',
  'follows.read',
  'follows.write',
  'dm.read',
  'dm.write',
  'space.read',
  'mute.read',
  'mute.write',
  'block.read',
  'block.write',
  'offline.access'  // ← Added for refresh tokens
]
```

### 3. PKCE Implementation
The implementation correctly uses:
- **Code Challenge Method**: `S256` (SHA256 hashing)
- **Code Verifier**: 32-byte random string encoded as base64url
- **Code Challenge**: SHA256 hash of code verifier, base64url encoded

## 🔧 Configuration

### Environment Variables
Set these environment variables in your `.env` file:

```env
# X (Twitter) OAuth 2.0 Configuration
TWITTER_CLIENT_ID=your_x_client_id
TWITTER_CLIENT_SECRET=your_x_client_secret
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### X App Configuration
1. Go to the [X Developer Portal](https://developer.x.com/)
2. Navigate to your app's settings
3. Enable **OAuth 2.0** in authentication settings
4. Set your callback URL to: `https://your-domain.com/api/oauth/twitter/callback`
5. Ensure your app type supports the scopes you need:
   - **Web App** or **Automated App/Bot** for confidential clients
   - **Native App** or **Single Page App** for public clients

## 📋 Supported Scopes

| Scope | Description |
|-------|-------------|
| `tweet.read` | All the Tweets you can view, including Tweets from protected accounts |
| `tweet.write` | Tweet and Retweet for you |
| `users.read` | Any account you can view, including protected accounts |
| `follows.read` | People who follow you and people who you follow |
| `follows.write` | Follow and unfollow people for you |
| `dm.read` | Read direct messages |
| `dm.write` | Send direct messages |
| `space.read` | All the Spaces you can view |
| `mute.read` | Accounts you've muted |
| `mute.write` | Mute and unmute accounts for you |
| `block.read` | Accounts you've blocked |
| `block.write` | Block and unblock accounts for you |
| `offline.access` | Stay connected to your account until you revoke access |

## 🚀 Usage Examples

### 1. Initiating OAuth Flow

```typescript
// Frontend: Initiate OAuth connection
const response = await fetch('/api/oauth/twitter/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: userIdToken })
});

const { authUrl } = await response.json();
window.location.href = authUrl; // Redirect to X OAuth
```

### 2. Posting to X

```typescript
// Post a tweet
const response = await fetch('/api/social/post', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: userIdToken,
    content: {
      text: "Hello from our CRM! 🚀 #automation",
      media: [] // Optional media attachments
    },
    platforms: ['twitter']
  })
});
```

### 3. Managing Direct Messages

```typescript
// Sync DM conversations
const response = await fetch('/api/social/inbox/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: userIdToken,
    platforms: ['twitter']
  })
});

// Send a DM reply
const response = await fetch('/api/social/inbox/send-message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: userIdToken,
    conversationId: 'twitter_conversation_123',
    message: 'Thank you for your message!',
    platform: 'twitter'
  })
});
```

## 🔒 Security Features

### PKCE (Proof Key for Code Exchange)
- Prevents authorization code interception attacks
- Uses SHA256 hashing for enhanced security
- Required for all OAuth 2.0 flows on X

### Token Management
- **Access Tokens**: Valid for 2 hours by default
- **Refresh Tokens**: Available when `offline.access` scope is used
- **Automatic Refresh**: Implemented in the `refreshToken()` method

### State Parameter
- Prevents CSRF attacks
- Uses cryptographically secure random values
- Validated on callback

## 📊 Rate Limits

X API v2 with OAuth 2.0 provides enhanced rate limits:

| Endpoint Type | Rate Limit |
|---------------|------------|
| Tweet Lookup | 900 requests/15 minutes (increased from 300) |
| User Lookup | 900 requests/15 minutes (increased from 300) |
| Tweet Creation | 300 requests/15 minutes |
| DM Operations | Varies by endpoint |

## 🐛 Troubleshooting

### Common Issues

1. **Invalid Client Error**
   - Verify `TWITTER_CLIENT_ID` and `TWITTER_CLIENT_SECRET`
   - Ensure OAuth 2.0 is enabled in your X app

2. **Redirect URI Mismatch**
   - X requires exact match validation
   - Verify callback URL in app settings matches your environment

3. **Scope Errors**
   - Ensure your app type supports the requested scopes
   - Some scopes require app review/approval

4. **Token Expiry**
   - Implement proper refresh token handling
   - Use `offline.access` scope for long-lived access

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## 🔄 Migration from OAuth 1.0a

If migrating from OAuth 1.0a:

1. **Update App Settings**: Enable OAuth 2.0 in X Developer Portal
2. **Environment Variables**: Add `TWITTER_CLIENT_SECRET` 
3. **Scopes**: Replace OAuth 1.0a permissions with OAuth 2.0 scopes
4. **Token Format**: OAuth 2.0 uses Bearer tokens instead of signed requests

## 📚 References

- [X OAuth 2.0 Documentation](https://developer.x.com/en/docs/authentication/oauth-2-0)
- [X API v2 Reference](https://developer.x.com/en/docs/api-reference-index)
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)

## ✅ Implementation Checklist

- [x] Updated to X OAuth 2.0 endpoints (`x.com` and `api.x.com`)
- [x] Implemented PKCE with S256 method
- [x] Added `offline.access` scope for refresh tokens
- [x] Updated token exchange and refresh flows
- [x] Enhanced error handling and logging
- [x] Maintained backward compatibility with existing API
- [x] Added comprehensive test coverage
- [x] Updated documentation

The X OAuth 2.0 implementation is now fully compliant with the latest X API v2 specifications and ready for production use.