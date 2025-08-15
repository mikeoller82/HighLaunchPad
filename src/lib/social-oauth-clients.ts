import crypto from 'crypto';

// Base interfaces and types
export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType: string;
  expiresAt?: number;
  idToken?: string; // For OpenID Connect
}

export interface SocialAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  username: string;
  displayName: string;
  profilePicture?: string;
  tokens: OAuthTokens;
  pageTokens?: { [pageId: string]: string };
  metadata?: Record<string, any>;
}

export interface PostContent {
  text: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  }[];
  link?: string;
  scheduledTime?: Date;
  platformSpecific?: Record<string, any>;
}

export interface ConversationMessage {
  id: string;
  text: string;
  senderId: string;
  senderName?: string;
  createdAt: Date;
  isFromPage?: boolean;
  attachments?: Record<string, any>[];
}

export interface Conversation {
  id: string;
  platform: string;
  profileId: string;
  participants: Record<string, any>[];
  lastMessage?: ConversationMessage;
  unreadCount: number;
  updatedAt: Date;
  messages?: ConversationMessage[];
}

// Base OAuth client abstract class
export abstract class BaseSocialClient {
  protected config: OAuthConfig;
  protected tokens?: OAuthTokens;

  constructor(config: OAuthConfig) {
    this.config = config;
  }

  setTokens(tokens: OAuthTokens) {
    this.tokens = tokens;
  }

  abstract getAuthUrl(state: string): string;
  abstract exchangeCodeForToken(code: string, codeVerifier?: string): Promise<OAuthTokens>;
  abstract refreshToken(): Promise<OAuthTokens>;
  abstract getProfile(): Promise<Record<string, any>>;
  abstract postContent(content: PostContent): Promise<Record<string, any>>;
  abstract getInboxMessages(): Promise<Conversation[]>;
  abstract sendMessage(conversationId: string, message: string): Promise<Record<string, any>>;

  protected generateState(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  protected generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  protected generateCodeChallenge(verifier: string): string {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
  }
}

// Facebook OAuth Implementation
export class FacebookOAuth extends BaseSocialClient {
  protected readonly baseUrl = 'https://graph.facebook.com/v18.0';
  private readonly authUrl = 'https://www.facebook.com/v18.0/dialog/oauth';

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(','),
      response_type: 'code',
      state,
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<OAuthTokens> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri,
      code,
    });

    const response = await fetch(`${this.baseUrl}/oauth/access_token?${params.toString()}`);
    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || 'Failed to exchange code for token');
    }

    const tokens: OAuthTokens = {
      accessToken: data.access_token,
      tokenType: data.token_type || 'Bearer',
      expiresIn: data.expires_in,
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
    };

    this.tokens = tokens;
    return tokens;
  }

  async refreshToken(): Promise<OAuthTokens> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available for refresh');
    }

    // Exchange short-lived token for long-lived token
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      fb_exchange_token: this.tokens.accessToken,
    });

    const response = await fetch(`${this.baseUrl}/oauth/access_token?${params.toString()}`);
    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || 'Failed to refresh token');
    }

    this.tokens.accessToken = data.access_token;
    this.tokens.expiresIn = data.expires_in;
    this.tokens.expiresAt = data.expires_in ? Date.now() + data.expires_in * 1000 : undefined;
    
    return this.tokens;
  }

  async getProfile(): Promise<any> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    const params = new URLSearchParams({
      access_token: this.tokens.accessToken,
      fields: 'id,name,email,picture',
    });

    const response = await fetch(`${this.baseUrl}/me?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get profile');
    }

    return data;
  }

  async getPages(): Promise<any[]> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    const params = new URLSearchParams({
      access_token: this.tokens.accessToken,
      fields: 'id,name,access_token,instagram_business_account',
    });

    const response = await fetch(`${this.baseUrl}/me/accounts?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get pages');
    }

    return data.data || [];
  }

  async postContent(content: PostContent & { pageId?: string; pageAccessToken?: string }): Promise<any> {
    if (!content.pageId || !content.pageAccessToken) {
      throw new Error('Page ID and page access token required for Facebook posting');
    }

    const postData: any = {
      message: content.text,
      access_token: content.pageAccessToken,
    };

    if (content.link) {
      postData.link = content.link;
    }

    if (content.scheduledTime) {
      postData.published = false;
      postData.scheduled_publish_time = Math.floor(content.scheduledTime.getTime() / 1000);
    }

    if (content.media && content.media.length > 0) {
      // Handle media uploads - this would need additional implementation for file uploads
      postData.url = content.media[0].url;
    }

    const response = await fetch(`${this.baseUrl}/${content.pageId}/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(postData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to post content');
    }

    return data;
  }

  async getInboxMessages(): Promise<Conversation[]> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const pages = await this.getPages();
      const conversations: Conversation[] = [];

      console.log(`[Facebook] Found ${pages.length} pages to sync conversations from`);

      for (const page of pages) {
        try {
          // First, get conversations for this page
          const params = new URLSearchParams({
            access_token: page.access_token,
            fields: 'id,updated_time,message_count,unread_count,participants',
            limit: '25'
          });

          const response = await fetch(`${this.baseUrl}/${page.id}/conversations?${params.toString()}`);
          const data = await response.json();

          if (!response.ok) {
            console.error(`[Facebook] Error fetching conversations for page ${page.id}:`, data.error);
            continue;
          }

          console.log(`[Facebook] Found ${data.data?.length || 0} conversations for page ${page.name}`);

          for (const conv of data.data || []) {
            try {
              // Get messages for each conversation
              const messageParams = new URLSearchParams({
                access_token: page.access_token,
                fields: 'id,message,from,created_time',
                limit: '10'
              });

              const messagesResponse = await fetch(`${this.baseUrl}/${conv.id}/messages?${messageParams.toString()}`);
              const messagesData = await messagesResponse.json();

              if (!messagesResponse.ok) {
                console.error(`[Facebook] Error fetching messages for conversation ${conv.id}:`, messagesData.error);
                continue;
              }

              const messages: ConversationMessage[] = (messagesData.data || []).map((msg: any) => ({
                id: msg.id,
                text: msg.message || '',
                senderId: msg.from?.id || 'unknown',
                senderName: msg.from?.name || 'Unknown User',
                createdAt: new Date(msg.created_time),
                isFromPage: msg.from?.id === page.id,
              }));

              // Get participant info
              const participants = conv.participants?.data || [];

              conversations.push({
                id: `facebook_${conv.id}`,
                platform: 'facebook',
                profileId: `facebook_${page.id}`,
                participants: participants,
                lastMessage: messages[0] || {
                  id: 'no_message',
                  text: 'No messages yet',
                  senderId: 'system',
                  senderName: 'System',
                  createdAt: new Date(conv.updated_time),
                  isFromPage: false,
                },
                unreadCount: conv.unread_count || 0,
                updatedAt: new Date(conv.updated_time),
                messages: messages.slice(0, 5), // Only store recent messages
              });
            } catch (msgError) {
              console.error(`[Facebook] Error processing conversation ${conv.id}:`, msgError);
            }
          }
        } catch (pageError) {
          console.error(`[Facebook] Error processing page ${page.id}:`, pageError);
        }
      }

      console.log(`[Facebook] Successfully synced ${conversations.length} conversations`);
      return conversations;
    } catch (error) {
      console.error('[Facebook] Error in getInboxMessages:', error);
      return [];
    }
  }

  async sendMessage(_conversationId: string, _message: string): Promise<any> {
    // Implementation would depend on specific Facebook Messenger API requirements
    throw new Error('Facebook message sending not implemented - requires Messenger API setup');
  }
}

// Instagram OAuth Implementation (uses Facebook's API)
export class InstagramOAuth extends FacebookOAuth {
  async postContent(content: PostContent & { instagramAccountId?: string; pageAccessToken?: string }): Promise<any> {
    if (!content.instagramAccountId || !content.pageAccessToken) {
      throw new Error('Instagram account ID and page access token required for Instagram posting');
    }

    if (!content.media || content.media.length === 0) {
      throw new Error('Instagram posts require at least one image or video');
    }

    // Create media object
    const mediaData: any = {
      image_url: content.media[0].url,
      caption: content.text,
      access_token: content.pageAccessToken,
    };

    // Create media object
    const mediaResponse = await fetch(`${this.baseUrl}/${content.instagramAccountId}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(mediaData),
    });

    const mediaResult = await mediaResponse.json();

    if (!mediaResponse.ok) {
      throw new Error(mediaResult.error?.message || 'Failed to create Instagram media');
    }

    // Publish media
    const publishData = {
      creation_id: mediaResult.id,
      access_token: content.pageAccessToken,
    };

    const publishResponse = await fetch(`${this.baseUrl}/${content.instagramAccountId}/media_publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(publishData),
    });

    const publishResult = await publishResponse.json();

    if (!publishResponse.ok) {
      throw new Error(publishResult.error?.message || 'Failed to publish Instagram media');
    }

    return publishResult;
  }
}

// LinkedIn OAuth Implementation with OpenID Connect
export class LinkedInOAuth extends BaseSocialClient {
  private readonly baseUrl = 'https://api.linkedin.com/v2';
  private readonly authUrl = 'https://www.linkedin.com/oauth/v2/authorization';
  private readonly userinfoUrl = 'https://api.linkedin.com/v2/userinfo';

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state,
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<OAuthTokens> {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || 'Failed to exchange code for token');
    }

    const tokens: OAuthTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type || 'Bearer',
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
      idToken: data.id_token,
    };

    this.tokens = tokens;
    return tokens;
  }

  async refreshToken(): Promise<OAuthTokens> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.tokens.refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || 'Failed to refresh token');
    }

    this.tokens.accessToken = data.access_token;
    this.tokens.expiresIn = data.expires_in;
    this.tokens.expiresAt = data.expires_in ? Date.now() + data.expires_in * 1000 : undefined;
    
    return this.tokens;
  }

  async getProfile(): Promise<any> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch(this.userinfoUrl, {
        headers: {
          Authorization: `Bearer ${this.tokens.accessToken}`,
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        return {
          id: profileData.sub,
          firstName: profileData.given_name,
          lastName: profileData.family_name,
          name: profileData.name,
          email: profileData.email,
          emailVerified: profileData.email_verified,
          profilePicture: profileData.picture,
          locale: profileData.locale
        };
      }
    } catch (error) {
      console.error('[LinkedIn] OpenID Connect profile fetch failed:', error);
    }

    // Fallback to legacy profile method
    return this.getLegacyProfile();
  }

  async getLegacyProfile(): Promise<any> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    const profileResponse = await fetch(`${this.baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${this.tokens.accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      throw new Error(errorData.message || 'Failed to get profile');
    }

    const profileData = await profileResponse.json();

    // Get email address
    const emailResponse = await fetch(`${this.baseUrl}/emailAddress?q=members&projection=(elements*(handle~))`, {
      headers: {
        Authorization: `Bearer ${this.tokens.accessToken}`,
      },
    });

    let email = null;
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      if (emailData.elements && emailData.elements.length > 0) {
        email = emailData.elements[0]['handle~']?.emailAddress;
      }
    }

    return {
      id: profileData.id,
      firstName: profileData.localizedFirstName,
      lastName: profileData.localizedLastName,
      email: email,
      profilePicture: profileData.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier
    };
  }

  async postContent(content: PostContent & { organizationId?: string }): Promise<any> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    const profile = await this.getProfile();
    const author = content.organizationId 
      ? `urn:li:organization:${content.organizationId}`
      : `urn:li:person:${profile.id}`;

    const postData: any = {
      author,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content.text
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch(`${this.baseUrl}/ugcPosts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.tokens.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error_description || 'Failed to post content');
    }

    return data;
  }

  async getInboxMessages(): Promise<Conversation[]> {
    console.log('[LinkedIn] LinkedIn messaging API has limitations, returning empty conversations');
    return [];
  }

  async sendMessage(_conversationId: string, _message: string): Promise<any> {
    throw new Error('LinkedIn message sending not implemented - API limitations');
  }
}

// X (Twitter) OAuth Implementation
export class TwitterOAuth extends BaseSocialClient {
  private readonly baseUrl = 'https://api.x.com/2';
  private readonly authUrl = 'https://x.com/i/oauth2/authorize';

  getAuthUrl(state: string): string {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, codeVerifier?: string): Promise<OAuthTokens> {
    if (!codeVerifier) {
      throw new Error('Code verifier is required for Twitter OAuth');
    }

    const response = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || 'Failed to exchange code for token');
    }

    const tokens: OAuthTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
    };

    this.tokens = tokens;
    return tokens;
  }

  async refreshToken(): Promise<OAuthTokens> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        refresh_token: this.tokens.refreshToken,
        grant_type: 'refresh_token',
        client_id: this.config.clientId,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || 'Failed to refresh token');
    }

    this.tokens.accessToken = data.access_token;
    this.tokens.refreshToken = data.refresh_token;
    this.tokens.expiresIn = data.expires_in;
    this.tokens.expiresAt = data.expires_in ? Date.now() + data.expires_in * 1000 : undefined;
    
    return this.tokens;
  }

  async getProfile(): Promise<any> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    const params = new URLSearchParams({
      'user.fields': 'id,name,username,profile_image_url,public_metrics',
    });

    const response = await fetch(`${this.baseUrl}/users/me?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${this.tokens.accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.title || 'Failed to get profile');
    }

    return data.data;
  }

  async postContent(content: PostContent): Promise<any> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    const tweetData: any = {
      text: content.text,
    };

    if (content.media && content.media.length > 0) {
      tweetData.media = {
        media_ids: content.media.map(m => m.url),
      };
    }

    const response = await fetch(`${this.baseUrl}/tweets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tweetData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.title || 'Failed to post content');
    }

    return data;
  }

  async getInboxMessages(): Promise<Conversation[]> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    try {
      console.log('[Twitter] Fetching DM conversations...');
      
      const params = new URLSearchParams({
        'dm_conversation.fields': 'id,type,created_at',
        'expansions': 'participant_ids',
        'user.fields': 'id,name,username,profile_image_url',
        'max_results': '25'
      });

      const response = await fetch(`${this.baseUrl}/dm_conversations?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${this.tokens.accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Twitter] Error fetching DM conversations:', data);
        if (data.errors && data.errors.some((e: any) => e.code === 403)) {
          console.error('[Twitter] Permission denied - check if your Twitter app has DM permissions');
        }
        return [];
      }

      console.log(`[Twitter] Found ${data.data?.length || 0} DM conversations`);
      const conversations: Conversation[] = [];

      for (const conv of data.data || []) {
        try {
          // Get messages for each conversation
          const messageParams = new URLSearchParams({
            'dm_event.fields': 'id,text,created_at,sender_id,event_type',
            'expansions': 'sender_id',
            'user.fields': 'id,name,username,profile_image_url',
            'max_results': '10'
          });

          const messagesResponse = await fetch(
            `${this.baseUrl}/dm_conversations/${conv.id}/dm_events?${messageParams.toString()}`,
            {
              headers: {
                Authorization: `Bearer ${this.tokens.accessToken}`,
              },
            }
          );

          const messagesData = await messagesResponse.json();

          if (!messagesResponse.ok) {
            console.error(`[Twitter] Error fetching messages for conversation ${conv.id}:`, messagesData);
            continue;
          }

          const messages: ConversationMessage[] = (messagesData.data || [])
            .filter((event: any) => event.event_type === 'MessageCreate')
            .map((event: any) => {
              const sender = messagesData.includes?.users?.find((u: any) => u.id === event.sender_id);
              return {
                id: event.id,
                text: event.text || '',
                senderId: event.sender_id,
                senderName: sender?.name || sender?.username || 'Unknown User',
                createdAt: new Date(event.created_at),
                isFromPage: false,
              };
            });

          // Get participant info
          const participants = conv.participant_ids || [];
          const users = data.includes?.users || [];
          
          conversations.push({
            id: `twitter_${conv.id}`,
            platform: 'twitter',
            profileId: `twitter_${conv.id}`,
            participants: participants.map((id: string) => {
              const user = users.find((u: any) => u.id === id);
              return {
                id,
                name: user?.name || user?.username || 'Unknown User',
                username: user?.username,
                profile_image_url: user?.profile_image_url
              };
            }),
            lastMessage: messages[0] || {
              id: 'no_message',
              text: 'No messages yet',
              senderId: 'system',
              senderName: 'System',
              createdAt: new Date(conv.created_at),
              isFromPage: false,
            },
            unreadCount: 0,
            updatedAt: new Date(conv.created_at),
            messages: messages.slice(0, 5),
          });
        } catch (convError) {
          console.error(`[Twitter] Error processing conversation ${conv.id}:`, convError);
        }
      }

      console.log(`[Twitter] Successfully synced ${conversations.length} conversations`);
      return conversations;
    } catch (error) {
      console.error('[Twitter] Error in getInboxMessages:', error);
      return [];
    }
  }

  async sendMessage(conversationId: string, message: string): Promise<any> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    const messageData = {
      dm_conversation_id: conversationId,
      text: message,
    };

    const response = await fetch(`${this.baseUrl}/dm_conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.title || 'Failed to send message');
    }

    return data;
  }
}