# LinkedIn OAuth 2.0 Implementation - Updated & Fixed

This document describes the updated LinkedIn OAuth 2.0 implementation that follows LinkedIn's current API specifications and best practices.

## 🔄 Changes Made

### 1. Updated API Endpoints
- **Base URL**: Changed from `https://api.linkedin.com/v2` to `https://api.linkedin.com/rest`
- **Profile Endpoint**: Changed from deprecated `/people/~` to current `/userinfo`
- **Posts Endpoint**: Changed from `/ugcPosts` to `/posts`
- **Added Required Headers**: `LinkedIn-Version: 202405` and `X-Restli-Protocol-Version: 2.0.0`

### 2. Enhanced Scopes Configuration
Updated scopes to include modern LinkedIn API requirements:

```typescript
scopes: [
  'openid',                    // ← Added for OpenID Connect
  'profile',
  'email', 
  'w_member_social',
  'r_organization_social',
  'w_organization_social',
  'rw_organization_admin'      // ← Added for organization management
]
```

### 3. Modernized Authentication
- **OpenID Connect**: Added `openid` scope for modern authentication
- **Profile API**: Uses `/userinfo` endpoint with proper headers
- **Error Handling**: Enhanced to handle LinkedIn's specific error formats

### 4. Updated Posting API
- **New Posts API**: Uses LinkedIn's current `/posts` endpoint
- **Simplified Structure**: Updated post data structure for current API
- **Media Support**: Prepared for LinkedIn's asset upload flow

## 🔧 Configuration

### Environment Variables
```env
# LinkedIn OAuth 2.0 Configuration
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### LinkedIn App Configuration
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Select your app → **Auth** tab
3. Set **Authorized redirect URLs**: `https://your-domain.com/api/oauth/linkedin/callback`
4. Add required **Products**:
   - **Sign In with LinkedIn using OpenID Connect**
   - **Share on LinkedIn**
   - **Marketing Developer Platform** (for organization features)
5. **Save settings**

## 📋 Updated Scope Details

| Scope | Description | Required For |
|-------|-------------|--------------|
| `openid` | OpenID Connect authentication | Modern auth flow |
| `profile` | Access to profile information | User identification |
| `email` | Access to email address | User contact info |
| `w_member_social` | Post on behalf of user | Personal posting |
| `r_organization_social` | Read organization posts | Organization content |
| `w_organization_social` | Post on behalf of organization | Company posting |
| `rw_organization_admin` | Manage organization pages | Full org management |

## 🚀 Usage Examples

### 1. Initiating LinkedIn OAuth Flow

```typescript
// Frontend: Initiate OAuth connection
const response = await fetch('/api/oauth/linkedin/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: userIdToken })
});

const { authUrl } = await response.json();
window.location.href = authUrl; // Redirect to LinkedIn OAuth
```

### 2. Posting to LinkedIn

```typescript
// Post to LinkedIn (personal or organization)
const response = await fetch('/api/social/post', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: userIdToken,
    content: {
      text: "Exciting news from our team! 🚀 #innovation #business",
      media: [] // Optional media attachments
    },
    platforms: ['linkedin'],
    platformSpecificContent: {
      linkedin: {
        organizationId: 'optional_org_id' // For company posting
      }
    }
  })
});
```

### 3. Getting User Profile

```typescript
// The profile data now comes from /userinfo endpoint
// Returns OpenID Connect standard format:
{
  "sub": "user_id",
  "name": "Full Name", 
  "given_name": "First",
  "family_name": "Last",
  "picture": "profile_image_url",
  "email": "user@example.com",
  "email_verified": true
}
```

## 🔒 Security & Rate Limits

### Rate Limits
- **Personal API**: 500 requests per 24 hours per user token
- **Organization API**: Varies by endpoint and organization size
- **Posting**: Limited to prevent spam (exact limits vary)

### Security Features
- **OpenID Connect**: Modern, secure authentication standard
- **Scope Granularity**: Fine-grained permissions
- **Token Expiration**: Access tokens expire (typically 60 days)
- **Refresh Tokens**: Available for long-term access

## 🐛 Troubleshooting

### Common Issues

1. **Invalid Scope Error**
   - Ensure your LinkedIn app has the required products added
   - Some scopes require LinkedIn review/approval
   - Organization scopes need admin approval

2. **Profile API Errors**
   - Verify `openid` scope is included
   - Check that OpenID Connect product is added to your app
   - Ensure proper headers are sent with requests

3. **Posting Failures**
   - Verify `w_member_social` scope for personal posts
   - Use `w_organization_social` for company posts
   - Check content length (3000 character limit)

4. **Organization Access**
   - User must be admin of the organization
   - Organization must approve the app
   - Use correct organization URN format

### Debug Headers
All API requests now include:
```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'LinkedIn-Version': '202405',
  'X-Restli-Protocol-Version': '2.0.0',
  'Content-Type': 'application/json'
}
```

## 📊 API Endpoint Changes

### Before (Deprecated)
```typescript
// Old endpoints - no longer recommended
baseUrl: 'https://api.linkedin.com/v2'
profile: '/people/~'
posts: '/ugcPosts'
```

### After (Current)
```typescript
// New endpoints - current LinkedIn API
baseUrl: 'https://api.linkedin.com/rest'
profile: '/userinfo'
posts: '/posts'
```

## 🔄 Migration Guide

If you're migrating from the old implementation:

1. **Update Environment Variables**: No changes needed
2. **App Configuration**: Add OpenID Connect product
3. **Scope Updates**: Automatic with new configuration
4. **API Calls**: Handled automatically by updated client
5. **Profile Data**: May have different structure (OpenID Connect format)

## 📚 References

- [LinkedIn OAuth 2.0 Documentation](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)
- [LinkedIn API Reference](https://docs.microsoft.com/en-us/linkedin/marketing/)
- [OpenID Connect Specification](https://openid.net/connect/)
- [LinkedIn Developer Portal](https://www.linkedin.com/developers/)

## ✅ Implementation Checklist

- [x] Updated to LinkedIn REST API endpoints
- [x] Added OpenID Connect support (`openid` scope)
- [x] Updated profile endpoint to `/userinfo`
- [x] Modernized posts API to `/posts`
- [x] Added required LinkedIn API headers
- [x] Enhanced error handling for LinkedIn responses
- [x] Added organization admin permissions
- [x] Updated scope configuration
- [x] Maintained backward compatibility
- [x] Added comprehensive documentation

## 🎯 Key Benefits

✅ **Future-Proof**: Uses LinkedIn's current API standards
✅ **OpenID Connect**: Modern authentication protocol
✅ **Better Error Handling**: More descriptive error messages
✅ **Organization Support**: Full company page management
✅ **Rate Limit Compliance**: Respects LinkedIn's current limits
✅ **Security**: Enhanced with proper headers and scopes

The LinkedIn OAuth 2.0 implementation is now fully updated and compliant with LinkedIn's current API specifications.