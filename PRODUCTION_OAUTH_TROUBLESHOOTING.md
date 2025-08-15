# Production OAuth Troubleshooting Guide

## Common Production OAuth Issues & Fixes

### 1. Scope Permission Issues ✅ FIXED

**Problem**: LinkedIn and Twitter were requesting scopes that require special approval or elevated access.

**Solution**: Reduced to basic scopes that work without special approval:

#### LinkedIn Scopes (Reduced)
- `openid` - Basic authentication
- `profile` - User profile information  
- `email` - User email address
- `w_member_social` - Post on behalf of user

**Removed scopes that require approval:**
- `r_organization_social` - Requires LinkedIn Partner Program
- `w_organization_social` - Requires LinkedIn Partner Program  
- `rw_organization_admin` - Requires special approval

#### Twitter Scopes (Reduced)
- `tweet.read` - Read tweets
- `tweet.write` - Post tweets
- `users.read` - Read user information
- `offline.access` - Refresh tokens

**Removed scopes that require elevated access:**
- `follows.read/write` - Requires elevated access
- `dm.read/write` - Requires elevated access
- `space.read` - Requires elevated access
- `mute.read/write` - Requires elevated access
- `block.read/write` - Requires elevated access

### 2. Redirect URI Configuration

**Check these exact URLs in your OAuth app settings:**

#### LinkedIn App Settings
- Redirect URI: `https://highlaunchpad.com/api/oauth/linkedin/callback`
- Make sure there are no trailing slashes or extra parameters

#### Twitter App Settings  
- Redirect URI: `https://highlaunchpad.com/api/oauth/twitter/callback`
- Ensure OAuth 2.0 with PKCE is enabled
- Make sure "Request email address from users" is enabled if you need email

### 3. Environment Variables in Production

**Verify these are set in Google Cloud Build:**

```bash
_LINKEDIN_CLIENT_ID=your_actual_linkedin_client_id
_LINKEDIN_CLIENT_SECRET=your_actual_linkedin_client_secret
_TWITTER_CLIENT_ID=your_actual_twitter_client_id  
_TWITTER_CLIENT_SECRET=your_actual_twitter_client_secret
_NEXT_PUBLIC_BASE_URL=https://highlaunchpad.com
```

### 4. Diagnostic Endpoint

**Added new endpoint to debug production issues:**

```
GET /api/debug/oauth-config
```

This will show:
- Which platforms are configured
- What redirect URIs are being used
- Whether credentials are present
- Auth URL generation status

### 5. Enhanced Error Logging

**Added comprehensive logging to track issues:**

- OAuth connect attempts
- Token exchange processes  
- Profile fetching
- State management
- Specific error messages from OAuth providers

### 6. Common Production Errors & Solutions

#### "Invalid redirect_uri"
- **Cause**: Redirect URI in OAuth app doesn't match exactly
- **Fix**: Ensure exact match including protocol (https://)

#### "Invalid scope"  
- **Cause**: Requesting scopes not approved for your app
- **Fix**: Use only basic scopes listed above

#### "Invalid client_id"
- **Cause**: Wrong client ID or not set in environment
- **Fix**: Verify environment variables in Cloud Build

#### "Code challenge required"
- **Cause**: Twitter app not configured for OAuth 2.0 with PKCE
- **Fix**: Enable OAuth 2.0 with PKCE in Twitter app settings

#### "Access denied"
- **Cause**: User denied permission or app not approved
- **Fix**: Check app review status, use approved scopes only

### 7. Testing Production OAuth

#### Step 1: Check Configuration
```bash
curl https://highlaunchpad.com/api/debug/oauth-config
```

#### Step 2: Test OAuth Flow
1. Go to `https://highlaunchpad.com/dashboard/settings?tab=social`
2. Click "Connect" for LinkedIn or Twitter
3. Check browser console for errors
4. Check server logs for detailed error messages

#### Step 3: Verify OAuth App Settings
- LinkedIn: https://developer.linkedin.com/
- Twitter: https://developer.twitter.com/

### 8. OAuth App Configuration Checklist

#### LinkedIn App
- [ ] App is in "Live" status (not "In development")
- [ ] Redirect URI exactly matches: `https://highlaunchpad.com/api/oauth/linkedin/callback`
- [ ] Only requesting approved scopes: `openid profile email w_member_social`
- [ ] App has been reviewed and approved if required

#### Twitter App  
- [ ] OAuth 2.0 with PKCE is enabled
- [ ] Redirect URI exactly matches: `https://highlaunchpad.com/api/oauth/twitter/callback`
- [ ] App type is set correctly (Web App)
- [ ] Only requesting basic scopes: `tweet.read tweet.write users.read offline.access`

### 9. Monitoring & Debugging

#### Server Logs to Watch
```bash
# Look for these log patterns:
[OAuth LinkedIn] Starting connection process
[OAuth Twitter] Starting connection process  
[LinkedIn OAuth] Generated auth URL successfully
[Twitter OAuth] Generated auth URL successfully
[LinkedIn Callback] Successfully connected account
[Twitter Callback] Successfully connected account
```

#### Client-Side Debugging
```javascript
// Check browser console for:
- Popup blocked messages
- Network errors in OAuth requests
- PostMessage communication errors
```

### 10. Quick Fixes to Try

1. **Clear OAuth app cache**: Some providers cache redirect URIs
2. **Regenerate client secrets**: Old secrets might be invalid
3. **Check app quotas**: Some providers have rate limits
4. **Verify domain ownership**: Some providers require domain verification
5. **Test with different browsers**: Rule out browser-specific issues

### 11. Contact Support

If issues persist after trying all above:

#### LinkedIn
- Use LinkedIn Developer Support: https://developer.linkedin.com/support
- Include your app ID and specific error messages

#### Twitter  
- Use Twitter Developer Support: https://developer.twitter.com/en/support
- Include your app ID and specific error messages

## Recent Changes Made

1. ✅ Reduced OAuth scopes to basic approved scopes
2. ✅ Added comprehensive error logging  
3. ✅ Created diagnostic endpoint
4. ✅ Enhanced state management with JWT fallback
5. ✅ Fixed popup communication flow
6. ✅ Added credential validation checks