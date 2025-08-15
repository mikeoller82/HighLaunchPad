# OAuth Setup Guide for fir-veilnet.web.app

## Your Exact OAuth Redirect URIs

**Base URL**: https://fir-veilnet.web.app

### 🐦 Twitter/X Configuration
- **Developer Portal**: https://developer.twitter.com/en/portal/dashboard
- **Redirect URI**: `https://fir-veilnet.web.app/api/oauth/twitter/callback`
- **Website URL**: `https://fir-veilnet.web.app`

### 💼 LinkedIn Configuration  
- **Developer Portal**: https://www.linkedin.com/developers/apps
- **Redirect URI**: `https://fir-veilnet.web.app/api/oauth/linkedin/callback`

### 📘 Facebook Configuration
- **Developer Portal**: https://developers.facebook.com/apps
- **Redirect URI**: `https://fir-veilnet.web.app/api/oauth/facebook/callback`

### 📸 Instagram Configuration
- **Developer Portal**: https://developers.facebook.com/apps (same as Facebook)
- **Redirect URI**: `https://fir-veilnet.web.app/api/oauth/instagram/callback`

## Step-by-Step Configuration

### 1. Update Cloud Build Environment Variables

Go to Google Cloud Console → Cloud Build → Triggers → Edit your trigger → Substitution variables:

```
_NEXT_PUBLIC_BASE_URL=https://fir-veilnet.web.app
_FACEBOOK_CLIENT_ID=your_facebook_app_id
_FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
_LINKEDIN_CLIENT_ID=your_linkedin_client_id
_LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
_TWITTER_CLIENT_ID=your_twitter_client_id
_TWITTER_CLIENT_SECRET=your_twitter_client_secret
```

### 2. Twitter/X Setup (CRITICAL)

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Select your app → **App settings** → **Authentication settings**
3. **Enable OAuth 2.0** (disable OAuth 1.0a)
4. Set **Type of App**: "Web App"
5. **Callback URI**: `https://fir-veilnet.web.app/api/oauth/twitter/callback`
6. **Website URL**: `https://fir-veilnet.web.app`
7. Enable **"Request email from users"**
8. Set **App permissions** to "Read and write"
9. **Save settings**

### 3. LinkedIn Setup

1. Go to https://www.linkedin.com/developers/apps
2. Select your app → **Auth** tab
3. **Authorized redirect URLs**: `https://fir-veilnet.web.app/api/oauth/linkedin/callback`
4. In **Products** tab, ensure these are added:
   - Sign In with LinkedIn using OpenID Connect
   - Share on LinkedIn
5. **Save settings**

### 4. Facebook/Instagram Setup

1. Go to https://developers.facebook.com/apps
2. Select your app → **Facebook Login** → **Settings**
3. **Valid OAuth Redirect URIs**:
   - `https://fir-veilnet.web.app/api/oauth/facebook/callback`
   - `https://fir-veilnet.web.app/api/oauth/instagram/callback`
4. Add required products:
   - Facebook Login
   - Instagram Basic Display
   - Instagram API
5. Switch app to **"Live"** mode
6. **Save settings**

## Testing & Verification

After making these changes:

1. **Deploy your app** (to pick up new environment variables)
2. **Test connections**: `npm run test:social`
3. **Debug if needed**: `npm run debug:social-stripe`
4. **Manual test**: Visit https://fir-veilnet.web.app/dashboard/settings?tab=social

## Troubleshooting

If connections still fail:

1. **Check exact URLs**: Must match exactly (no trailing slashes)
2. **Verify HTTPS**: All URLs must use HTTPS
3. **Production mode**: Apps must be in live/production mode
4. **Check logs**: `gcloud logs read --service=highlaunchpad`
5. **Browser network tab**: Check for OAuth errors

## Environment Variables Checklist

Ensure these are set in your Cloud Build trigger:
- [ ] `_NEXT_PUBLIC_BASE_URL=https://fir-veilnet.web.app`
- [ ] `_FACEBOOK_CLIENT_ID=your_actual_id`
- [ ] `_FACEBOOK_CLIENT_SECRET=your_actual_secret`
- [ ] `_LINKEDIN_CLIENT_ID=your_actual_id`
- [ ] `_LINKEDIN_CLIENT_SECRET=your_actual_secret`
- [ ] `_TWITTER_CLIENT_ID=your_actual_id`
- [ ] `_TWITTER_CLIENT_SECRET=your_actual_secret`