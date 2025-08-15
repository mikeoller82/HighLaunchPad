# LinkedIn OAuth Fix for Production

## Issue Summary
LinkedIn OAuth is failing with "not found" page error when users try to connect their LinkedIn accounts.

## Root Causes
1. **Redirect URI Mismatch**: The redirect URI in the LinkedIn app must exactly match the one sent in the OAuth request
2. **LinkedIn App Configuration**: The app needs proper products and permissions enabled
3. **Scope Issues**: LinkedIn requires specific scopes to be approved

## Fix Steps

### 1. LinkedIn App Configuration
Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps) and verify:

1. **Select your app** → **Auth** tab
2. **Authorized redirect URLs** must include EXACTLY:
   ```
   https://highlaunchpad.com/api/oauth/linkedin/callback
   ```
   
3. **Products** - Ensure these are added:
   - ✅ Sign In with LinkedIn using OpenID Connect
   - ✅ Share on LinkedIn
   - ✅ Marketing Developer Platform (if available)

4. **OAuth 2.0 scopes** - Verify these are available:
   - `openid`
   - `profile` 
   - `email`
   - `w_member_social`

### 2. Environment Variables
Verify in production (.env or deployment settings):
```env
LINKEDIN_CLIENT_ID=86lhf1a47prmph
LINKEDIN_CLIENT_SECRET=WPL_AP1.7NfxiKacx63ZHkcq
NEXT_PUBLIC_BASE_URL=https://highlaunchpad.com
```

### 3. Code Updates Needed

The current implementation looks correct, but let's add better error handling and logging:

#### Update `/src/lib/social-oauth-clients.ts` (LinkedIn class)
- Add more detailed logging for debugging
- Handle LinkedIn-specific error responses
- Add timeout handling for slow responses

#### Update `/src/app/api/oauth/linkedin/callback/route.ts`
- Add better error handling for missing state
- Log the full callback URL for debugging
- Handle LinkedIn-specific error codes

### 4. Testing Steps

1. **Clear browser cache and cookies** for LinkedIn
2. **Test the OAuth flow**:
   - Go to Settings → Social Accounts
   - Click "Connect" on LinkedIn
   - Check browser console for errors
   - Check server logs for detailed error messages

### 5. Common LinkedIn OAuth Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `invalid_redirect_uri` | Redirect URI mismatch | Ensure exact match in LinkedIn app |
| `unauthorized_scope_error` | Scope not approved | Remove unapproved scopes or request approval |
| `invalid_client` | Wrong client ID/secret | Verify credentials |
| `access_denied` | User cancelled | Normal - handle gracefully |

### 6. Debug Checklist

- [ ] Redirect URI in LinkedIn app matches exactly: `https://highlaunchpad.com/api/oauth/linkedin/callback`
- [ ] No trailing slashes in redirect URI
- [ ] Client ID and Secret are correct in production
- [ ] OpenID Connect product is added to LinkedIn app
- [ ] App is not in development mode (should be in production)
- [ ] SSL certificate is valid for highlaunchpad.com
- [ ] No URL encoding issues in the redirect

### 7. Alternative Solutions

If LinkedIn continues to fail:
1. **Use LinkedIn's OAuth 2.0 without OpenID Connect**:
   - Remove `openid` scope
   - Use `/v2/me` endpoint instead of `/userinfo`
   
2. **Implement LinkedIn Sign In SDK**:
   - Use LinkedIn's JavaScript SDK for client-side auth
   - Exchange auth code server-side

### 8. Monitoring

Add these logs to track issues:
1. Log the full auth URL generated
2. Log the callback parameters received
3. Log any LinkedIn API errors with full response
4. Track success/failure rates

## Quick Fix Script

Run this to verify the OAuth URL:
```bash
node scripts/test-linkedin-oauth.ts
```

This will:
1. Generate a test OAuth URL
2. Verify redirect URI format
3. Check for common configuration issues