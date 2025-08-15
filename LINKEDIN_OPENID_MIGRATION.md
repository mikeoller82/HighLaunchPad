# LinkedIn OAuth Migration to OpenID Connect

## Overview

LinkedIn has updated their OAuth implementation to use OpenID Connect (OIDC) for new member authentication. This document outlines the changes made to support the new LinkedIn OAuth flow.

## Key Changes

### 1. Updated OAuth Scopes

**Old Scopes:**
- `r_liteprofile` - Access to basic profile information
- `r_emailaddress` - Access to email address
- `w_member_social` - Permission to post on behalf of the user

**New OpenID Connect Scopes:**
- `openid` - **Required** to indicate the application wants to use OIDC
- `profile` - **Required** to retrieve the member's lite profile including ID, name, and profile picture
- `email` - **Required** to retrieve the member's email address
- `w_member_social` - Permission to post on behalf of the user (unchanged)

### 2. New Endpoints

**OpenID Connect Discovery Document:**
```
https://www.linkedin.com/.well-known/openid_configuration
```

**New Userinfo Endpoint:**
```
https://api.linkedin.com/v2/userinfo
```

**JWKS Endpoint for Token Validation:**
```
https://www.linkedin.com/oauth/openid/jwks
```

### 3. ID Token Support

The OAuth token response now includes an `id_token` field containing a JWT with user information:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "id_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 5184000
}
```

### 4. Updated Profile Data Structure

**New OpenID Connect Profile Response:**
```json
{
  "sub": "782bbtaQ",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe", 
  "picture": "https://media.licdn-ei.com/dms/image/...",
  "locale": "en-US",
  "email": "doe@email.com",
  "email_verified": true
}
```

## Implementation Details

### 1. Updated LinkedIn OAuth Client

The `LinkedInOAuth` class has been enhanced with:

- **ID Token Validation**: New `validateIdToken()` method using JWKS
- **OpenID Connect Profile**: New `getProfile()` method using userinfo endpoint
- **Backward Compatibility**: Fallback to legacy endpoints if OpenID Connect fails
- **Enhanced Token Handling**: Support for ID tokens in addition to access tokens

### 2. Graceful Migration

The implementation includes backward compatibility:

1. **Primary Flow**: Uses OpenID Connect userinfo endpoint
2. **Fallback Flow**: Falls back to legacy `/me` and `/emailAddress` endpoints
3. **Error Handling**: Comprehensive error handling for both flows

### 3. Security Enhancements

- **JWT Validation**: Proper ID token validation using LinkedIn's JWKS
- **Issuer Verification**: Validates token issuer is `https://www.linkedin.com`
- **Audience Verification**: Ensures token audience matches client ID
- **Expiration Checking**: Validates token hasn't expired

## Required LinkedIn App Configuration

### 1. Enable OpenID Connect Product

In your LinkedIn Developer Portal:

1. Go to your app in "My Apps"
2. Navigate to the "Products" tab
3. Request access to "Sign in with LinkedIn using OpenID Connect"
4. Wait for approval (usually instant for existing apps)

### 2. Update Redirect URIs

Ensure your redirect URI exactly matches:
```
https://yourdomain.com/api/oauth/linkedin/callback
```

### 3. Verify Scopes

Your app should now have access to:
- OpenID Connect scopes (`openid`, `profile`, `email`)
- Existing scopes (`w_member_social`)

## Testing

Run the test script to verify your implementation:

```bash
npx tsx scripts/test-linkedin-openid.ts
```

This will verify:
- OAuth URL generation with correct scopes
- JWKS endpoint accessibility
- Userinfo endpoint accessibility
- Scope validation

## Migration Checklist

- [x] Update OAuth scopes to include `openid`, `profile`, `email`
- [x] Implement ID token validation using JWKS
- [x] Update profile retrieval to use userinfo endpoint
- [x] Add backward compatibility for legacy endpoints
- [x] Update profile picture extraction logic
- [x] Test OAuth flow with new scopes
- [ ] Request "Sign in with LinkedIn using OpenID Connect" product in Developer Portal
- [ ] Test with real OAuth flow in production
- [ ] Monitor for any authentication issues

## Troubleshooting

### Common Issues

1. **"unauthorized_scope_error"**
   - Ensure your LinkedIn app has the OpenID Connect product enabled
   - Verify all required scopes are requested

2. **"invalid_client"**
   - Check client ID and secret are correct
   - Verify redirect URI matches exactly

3. **ID Token Validation Fails**
   - Ensure JWKS endpoint is accessible
   - Check token hasn't expired
   - Verify issuer and audience claims

### Debug Logging

The implementation includes comprehensive logging:
- OAuth URL generation
- Token exchange process
- Profile fetching attempts
- Fallback scenarios

## Benefits of OpenID Connect

1. **Standardized**: Uses industry-standard OpenID Connect protocol
2. **Secure**: Enhanced security with JWT tokens and proper validation
3. **Efficient**: Single userinfo endpoint for all profile data
4. **Future-proof**: Aligns with LinkedIn's long-term authentication strategy

## References

- [LinkedIn OpenID Connect Documentation](https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)
- [OpenID Connect Specification](https://openid.net/connect/)
- [LinkedIn Developer Portal](https://developer.linkedin.com/)