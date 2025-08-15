# Unified Social Media Integration System

This document describes the comprehensive social media OAuth integration system that supports Facebook, Instagram, LinkedIn, and X (Twitter) with unified inbox and social scheduler functionality.

## Overview

The system provides:
- **Unified OAuth Integration** for all major social platforms
- **Cross-platform Social Scheduler** with platform-specific optimizations
- **Unified Inbox** for managing conversations across all platforms
- **Token Management** with automatic refresh capabilities
- **Platform-specific Content Validation** and requirements
- **Backward Compatibility** with existing profile system

## Architecture

### Core Components

1. **OAuth Clients** (`/src/lib/social-oauth-clients.ts`)
   - `BaseSocialClient` - Abstract base class for all platforms
   - `FacebookOAuth` - Facebook/Meta integration with Pages and Instagram support
   - `LinkedInOAuth` - LinkedIn integration with company pages
   - `TwitterOAuth` - X (Twitter) integration with OAuth 2.0 + PKCE
   - `InstagramOAuth` - Instagram Business integration (extends Facebook)

2. **Social Media Manager** (`/src/lib/social-media-manager.ts`)
   - `SocialMediaManager` - Unified manager for all platforms
   - Cross-platform posting with platform-specific content
   - Token refresh management
   - Content validation for each platform
   - Inbox synchronization across platforms

3. **API Endpoints**
   - OAuth routes: `/api/oauth/{platform}/connect` and `/api/oauth/{platform}/callback`
   - Unified posting: `/api/social/post`
   - Inbox management: `/api/social/inbox/sync` and `/api/social/inbox/send-message`
   - Account management: `/api/social/accounts`
   - Scheduler: `/api/social/scheduler/process`

4. **Database Schema**
   - `social_accounts` collection - New unified account storage
   - `conversations` collection - Cross-platform conversations
   - `posts` collection - Published posts with results
   - `scheduled_posts` collection - Posts scheduled for future publishing

## Platform-Specific Features

### Facebook/Meta
- **Scopes**: `pages_read_engagement`, `pages_manage_posts`, `pages_messaging`, `instagram_basic`, `instagram_content_publish`
- **Features**: Page management, post scheduling, inbox conversations
- **Rate Limits**: 200 calls/hour per user, 4800 calls/hour per app
- **Special Requirements**: Requires page access tokens for posting

### Instagram
- **Integration**: Uses Facebook OAuth with Instagram Business accounts
- **Features**: Media posting, story management, comments
- **Requirements**: Must have Instagram Business account connected to Facebook Page
- **Content**: Requires at least one image or video

### LinkedIn
- **Scopes**: `r_liteprofile`, `w_member_social`, `r_organization_social`, `w_organization_social`
- **Features**: Personal and company page posting
- **Rate Limits**: 500 requests/24 hours per user token
- **Content**: Supports text, images, and links (max 3000 characters)

### X (Twitter)
- **OAuth**: OAuth 2.0 with PKCE for enhanced security
- **Scopes**: `tweet.read`, `tweet.write`, `users.read`, `dm.read`, `dm.write`
- **Features**: Tweet posting, DM management, thread support
- **Rate Limits**: 300 requests/15 minutes per user
- **Content**: 280 character limit for tweets

## API Usage

### Connecting Social Accounts

```typescript
// Initiate OAuth flow
const response = await fetch('/api/oauth/facebook/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: userIdToken })
});

const { authUrl } = await response.json();
// Redirect user to authUrl
```

### Posting to Multiple Platforms

```typescript
const response = await fetch('/api/social/post', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: userIdToken,
    content: {
      text: "Hello from our CRM!",
      media: [{ type: 'image', url: 'https://example.com/image.jpg' }]
    },
    platforms: ['facebook', 'twitter', 'linkedin'],
    platformSpecificContent: {
      twitter: { text: "Hello from our CRM! 🚀" }, // Add emoji for Twitter
      instagram: { text: "Hello from our CRM! #socialmedia #automation" }
    }
  })
});
```

### Scheduling Posts

```typescript
const response = await fetch('/api/social/post', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: userIdToken,
    content: {
      text: "Scheduled post content",
      media: []
    },
    platforms: ['facebook', 'linkedin'],
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
  })
});
```

### Syncing Inbox

```typescript
const response = await fetch('/api/social/inbox/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: userIdToken,
    platforms: ['facebook', 'twitter'] // Optional: sync specific platforms
  })
});
```

### Sending Messages

```typescript
const response = await fetch('/api/social/inbox/send-message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: userIdToken,
    conversationId: 'facebook_conversation_123',
    message: 'Thank you for your message!',
    platform: 'facebook'
  })
});
```

### Getting Connected Accounts

```typescript
const response = await fetch(`/api/social/accounts?token=${userIdToken}`);
const { accounts, supportedPlatforms } = await response.json();
```

## Database Schema

### Social Accounts Collection (`social_accounts`)

```typescript
{
  id: string; // e.g., "facebook_123456789"
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  username: string;
  displayName: string;
  profilePicture?: string;
  tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    tokenType: string;
  };
  pageTokens?: { [pageId: string]: string }; // For Facebook pages
  metadata: any; // Platform-specific data
  connectedAt: Date;
  lastSynced: Date;
  needsReconnection?: boolean;
}
```

### Conversations Collection (`conversations`)

```typescript
{
  id: string; // e.g., "facebook_conv_123"
  platform: string;
  profileId: string;
  participants: any[];
  lastMessage?: {
    id: string;
    text: string;
    senderId: string;
    senderName?: string;
    createdAt: Date;
    isFromPage?: boolean;
  };
  unreadCount: number;
  updatedAt: Date;
  lastSynced: Date;
  messages?: ConversationMessage[];
}
```

### Posts Collection (`posts`)

```typescript
{
  id: string;
  userId: string;
  content: {
    text: string;
    media?: MediaItem[];
    link?: string;
  };
  platformSpecificContent?: { [platform: string]: any };
  results: {
    platform: string;
    success: boolean;
    data?: any;
    error?: string;
  }[];
  status: 'published' | 'partial_failure' | 'failed';
  createdAt: Date;
  publishedAt: Date;
}
```

### Scheduled Posts Collection (`scheduled_posts`)

```typescript
{
  id: string;
  userId: string;
  content: PostContent;
  platformSpecificContent?: { [platform: string]: any };
  accountIds: string[];
  platforms: string[];
  scheduledTime: Date;
  status: 'scheduled' | 'published' | 'failed';
  createdAt: Date;
  processedAt?: Date;
}
```

## Environment Variables

```env
# Facebook/Instagram
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# LinkedIn
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Twitter/X
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Base URL for OAuth redirects
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Cron job secret for scheduled post processing
CRON_SECRET_KEY=your_secure_random_key
```

## Security Considerations

1. **Token Storage**: All tokens are stored securely in Firestore with proper access controls
2. **CSRF Protection**: OAuth state parameters prevent CSRF attacks
3. **PKCE**: Twitter OAuth uses PKCE for enhanced security
4. **Token Refresh**: Automatic token refresh prevents expired token issues
5. **Rate Limiting**: Built-in respect for platform rate limits
6. **Webhook Validation**: All webhook signatures should be validated (implement as needed)

## Scheduled Post Processing

Set up a cron job to process scheduled posts:

```bash
# Every 5 minutes
*/5 * * * * curl -X POST https://your-domain.com/api/social/scheduler/process \
  -H "Content-Type: application/json" \
  -d '{"authKey":"your_cron_secret_key"}'
```

## Error Handling

The system includes comprehensive error handling:

- **Authentication Errors**: Automatic token refresh or reconnection prompts
- **Rate Limiting**: Respect platform limits and queue requests
- **Platform Outages**: Graceful degradation and retry logic
- **Content Validation**: Pre-posting validation for each platform's requirements

## Migration from Legacy System

The new system maintains backward compatibility:

1. **Dual Storage**: Accounts are stored in both `social_accounts` and legacy `profiles` collections
2. **Gradual Migration**: Existing profiles are automatically converted when accessed
3. **API Compatibility**: Legacy endpoints continue to work while new unified endpoints are available

## Platform Requirements Summary

| Platform | Max Text | Media Required | Scheduling | Links | Special Requirements |
|----------|----------|----------------|------------|-------|---------------------|
| Facebook | 63,206 chars | No | Yes | Yes | Page access token |
| Instagram | 2,200 chars | Yes | Yes | No | Business account + Page |
| LinkedIn | 3,000 chars | No | No | Yes | None |
| Twitter | 280 chars | No | No | Yes | None |

## Testing

To test the integration:

1. Set up test apps on each platform
2. Configure environment variables
3. Test OAuth flows for each platform
4. Test posting with various content types
5. Test inbox synchronization
6. Test scheduled post processing

## Troubleshooting

Common issues and solutions:

1. **OAuth Failures**: Check app configuration and redirect URIs
2. **Token Expiry**: Ensure refresh token logic is working
3. **Rate Limiting**: Implement proper backoff strategies
4. **Content Validation**: Check platform-specific requirements
5. **Webhook Issues**: Verify webhook URLs and signatures

## Future Enhancements

Potential improvements:

1. **Additional Platforms**: TikTok, YouTube, Pinterest
2. **Advanced Scheduling**: Optimal posting times, bulk scheduling
3. **Analytics Integration**: Post performance tracking
4. **Content Templates**: Platform-optimized content templates
5. **Team Collaboration**: Multi-user account management
6. **AI Integration**: Content optimization suggestions

This unified system provides a robust foundation for social media management across all major platforms while maintaining flexibility for future enhancements.