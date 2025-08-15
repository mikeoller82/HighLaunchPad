# LinkedIn OAuth Production Troubleshooting Guide

## Quick Diagnosis Steps

### 1. Test the OAuth URL Generation
```bash
npm run build
node -r dotenv/config scripts/test-linkedin-oauth.ts
```

### 2. Check LinkedIn App Settings

Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps/86lhf1a47prmph/auth)

**Critical Settings to Verify:**

1. **OAuth 2.0 settings** → **Authorized redirect URLs**
   - Must contain EXACTLY: `https://highlaunchpad.com/api/oauth/linkedin/callback`
   - No trailing slash
   - No www prefix
   - Must be HTTPS

2. **OAuth 2.0 scopes**
   - Verify these are checked:
     - ✅ `r_liteprofile` (legacy) OR `profile` (OpenID Connect)
     - ✅ `r_emailaddress` (legacy) OR `email` (OpenID Connect)
     - ✅ `w_member_social`
     - ✅ `openid` (if using OpenID Connect)

3. **Products**
   - Must have at least one of:
     - "Sign In with LinkedIn" (legacy)
     - "Sign In with LinkedIn using OpenID Connect" (recommended)
     - "Share on LinkedIn"

4. **App Status**
   - Should be "Live" not "Development"

### 3. Common Error Scenarios

#### "Page Not Found" Error
**Cause**: LinkedIn can't find the redirect URI
**Solutions**:
1. Verify exact redirect URI match in LinkedIn app
2. Check for URL encoding issues
3. Ensure no trailing slashes
4. Verify HTTPS certificate is valid

#### "Invalid redirect_uri" Error
**Cause**: Mismatch between configured and requested redirect URI
**Solutions**:
1. Copy the exact URL from the error message
2. Paste it into LinkedIn app settings
3. Save and wait 5 minutes for propagation

#### "Unauthorized scope" Error
**Cause**: Requesting scopes not approved for your app
**Solutions**:
1. Remove `w_member_social` if not approved
2. Use only basic scopes: `openid`, `profile`, `email`
3. Apply for additional products if needed

### 4. Debug Information to Collect

When the error occurs, collect:

1. **Browser Console**:
   ```javascript
   // Check for any JavaScript errors
   console.log(window.location.href);
   ```

2. **Network Tab**:
   - Look for the LinkedIn authorization request
   - Check the redirect_uri parameter
   - Note any 404 or redirect responses

3. **Server Logs**:
   - Check Vercel/deployment logs for the callback route
   - Look for "[LinkedIn Callback]" log entries

### 5. Emergency Fixes

#### Fix 1: Simplified Scopes
Update `/src/lib/social-media-manager.ts`:
```typescript
scopes: [
  'openid',
  'profile',
  'email'
  // Remove 'w_member_social' temporarily
],
```

#### Fix 2: Legacy API Fallback
If OpenID Connect fails, use legacy endpoints:
```typescript
// In LinkedInOAuth class
private readonly baseUrl = 'https://api.linkedin.com/v2'; // Use v2 instead of /rest
private readonly profileEndpoint = '/me'; // Instead of /userinfo
```

#### Fix 3: Manual Redirect URI Override
Add to `.env.production`:
```env
LINKEDIN_REDIRECT_URI_OVERRIDE=https://highlaunchpad.com/api/oauth/linkedin/callback
```

### 6. Verification Checklist

Before going live:
- [ ] LinkedIn app is in "Live" status
- [ ] Redirect URI matches exactly (no trailing slash)
- [ ] HTTPS certificate is valid
- [ ] Environment variables are set in production
- [ ] No CORS or CSP blocking LinkedIn
- [ ] OAuth popup is not blocked by browser

### 7. Contact LinkedIn Support

If all else fails, contact LinkedIn Developer Support with:
1. App ID: 86lhf1a47prmph
2. Exact error message
3. Screenshot of redirect URI settings
4. Network trace of the failed request

### 8. Alternative Implementation

If LinkedIn OAuth continues to fail, consider:
1. Using LinkedIn Sign In SDK (client-side)
2. Implementing server-side flow without popup
3. Using a third-party service like Auth0

## Testing Commands

```bash
# Test OAuth URL generation
curl -X POST https://highlaunchpad.com/api/oauth/linkedin/connect \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_FIREBASE_ID_TOKEN"}'

# Check callback endpoint
curl -I https://highlaunchpad.com/api/oauth/linkedin/callback

# Verify SSL certificate
openssl s_client -connect highlaunchpad.com:443 -servername highlaunchpad.com
```

## Monitor Success Rate

Add this to your monitoring:
```javascript
// Track OAuth attempts
analytics.track('linkedin_oauth_attempt', { step: 'initiate' });
analytics.track('linkedin_oauth_callback', { success: true/false, error: errorCode });
```