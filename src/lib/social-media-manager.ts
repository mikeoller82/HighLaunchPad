import { 
  BaseSocialClient, 
  FacebookOAuth, 
  LinkedInOAuth, 
  TwitterOAuth, 
  InstagramOAuth,
  OAuthConfig,
  PostContent,
  Conversation,
  SocialAccount
} from './social-oauth-clients';

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'twitter';

export interface SocialMediaManagerConfig {
  facebook?: OAuthConfig;
  instagram?: OAuthConfig;
  linkedin?: OAuthConfig;
  twitter?: OAuthConfig;
}

export interface PostResult {
  platform: string;
  success: boolean;
  data?: Record<string, any>;
  error?: string;
}

export interface InboxSyncResult {
  platform: string;
  conversations: Conversation[];
  error?: string;
}

export class SocialMediaManager {
  private clients: Map<SocialPlatform, BaseSocialClient> = new Map();
  private configs: SocialMediaManagerConfig;

  constructor(configs: SocialMediaManagerConfig) {
    this.configs = configs;
    this.initializeClients();
  }

  private initializeClients() {
    if (this.configs.facebook) {
      this.clients.set('facebook', new FacebookOAuth(this.configs.facebook));
    }

    if (this.configs.instagram) {
      this.clients.set('instagram', new InstagramOAuth(this.configs.instagram));
    }

    if (this.configs.linkedin) {
      this.clients.set('linkedin', new LinkedInOAuth(this.configs.linkedin));
    }

    if (this.configs.twitter) {
      this.clients.set('twitter', new TwitterOAuth(this.configs.twitter));
    }
  }

  getClient(platform: SocialPlatform): BaseSocialClient | undefined {
    return this.clients.get(platform);
  }

  getAuthUrl(platform: SocialPlatform, state: string): string {
    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`No client configured for platform: ${platform}`);
    }
    return client.getAuthUrl(state);
  }

  async connectAccount(
    platform: SocialPlatform, 
    code: string, 
    codeVerifier?: string
  ): Promise<SocialAccount> {
    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`No client configured for platform: ${platform}`);
    }

    const tokens = await client.exchangeCodeForToken(code, codeVerifier);
    client.setTokens(tokens);
    
    const profile = await client.getProfile();
    
    const account: SocialAccount = {
      id: `${platform}_${profile.id}`,
      platform,
      username: profile.username || profile.name || profile.id,
      displayName: profile.name || profile.username || `${platform} Account`,
      profilePicture: this.extractProfilePicture(platform, profile),
      tokens,
      metadata: profile,
    };

    // For Facebook, also get page tokens
    if (platform === 'facebook' && client instanceof FacebookOAuth) {
      const pages = await client.getPages();
      account.pageTokens = {};
      pages.forEach(page => {
        if (account.pageTokens) {
          account.pageTokens[page.id] = page.access_token;
        }
      });
      if (account.metadata) {
        account.metadata.pages = pages;
      }
    }

    return account;
  }

  private extractProfilePicture(platform: SocialPlatform, profile: any): string | undefined {
    switch (platform) {
      case 'facebook':
        return profile.picture?.data?.url;
      case 'instagram':
        return profile.profile_picture_url;
      case 'linkedin':
        return profile.picture || profile.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier;
      case 'twitter':
        return profile.profile_image_url;
      default:
        return undefined;
    }
  }

  async refreshTokens(platform: SocialPlatform, account: SocialAccount): Promise<SocialAccount> {
    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`No client configured for platform: ${platform}`);
    }

    client.setTokens(account.tokens);
    const newTokens = await client.refreshToken();
    
    return {
      ...account,
      tokens: newTokens,
    };
  }

  async postToMultiplePlatforms(
    content: PostContent,
    accounts: SocialAccount[],
    platformSpecificContent?: { [platform: string]: Partial<PostContent> }
  ): Promise<PostResult[]> {
    const results: PostResult[] = [];

    for (const account of accounts) {
      const client = this.clients.get(account.platform);
      if (!client) {
        results.push({
          platform: account.platform,
          success: false,
          error: `No client configured for platform: ${account.platform}`,
        });
        continue;
      }

      try {
        client.setTokens(account.tokens);
        
        // Merge platform-specific content
        const finalContent = {
          ...content,
          ...(platformSpecificContent?.[account.platform] || {}),
        };

        // Add platform-specific data
        if (account.platform === 'facebook' && account.pageTokens) {
          const pages = account.metadata?.pages || [];
          if (pages.length > 0) {
            const page = pages[0]; // Use first page by default
            (finalContent as any).pageId = page.id;
            (finalContent as any).pageAccessToken = account.pageTokens[page.id];
          }
        }

        if (account.platform === 'instagram' && account.pageTokens) {
          const instagramAccounts = account.metadata?.instagramAccounts || [];
          if (instagramAccounts.length > 0) {
            const igAccount = instagramAccounts[0];
            (finalContent as any).instagramAccountId = igAccount.id;
            (finalContent as any).pageAccessToken = igAccount.pageAccessToken;
          }
        }

        const result = await client.postContent(finalContent);
        
        results.push({
          platform: account.platform,
          success: true,
          data: result,
        });
      } catch (error) {
        results.push({
          platform: account.platform,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  async syncAllInboxes(accounts: SocialAccount[]): Promise<InboxSyncResult[]> {
    const results: InboxSyncResult[] = [];

    console.log(`[SocialMediaManager] Starting inbox sync for ${accounts.length} accounts`);

    for (const account of accounts) {
      console.log(`[SocialMediaManager] Syncing ${account.platform} account: ${account.displayName}`);
      
      const client = this.clients.get(account.platform);
      if (!client) {
        console.warn(`[SocialMediaManager] No client configured for ${account.platform}`);
        results.push({
          platform: account.platform,
          conversations: [],
          error: `No client configured for platform: ${account.platform}. Check environment variables.`,
        });
        continue;
      }

      try {
        // Check if account has valid tokens
        if (!account.tokens || !account.tokens.accessToken) {
          console.warn(`[SocialMediaManager] No valid tokens for ${account.platform}`);
          results.push({
            platform: account.platform,
            conversations: [],
            error: `No valid access token for ${account.platform}. Please reconnect this account.`,
          });
          continue;
        }

        // Check if token is expired
        if (account.tokens.expiresAt && account.tokens.expiresAt < Date.now()) {
          console.warn(`[SocialMediaManager] Token expired for ${account.platform}`);
          results.push({
            platform: account.platform,
            conversations: [],
            error: `Access token expired for ${account.platform}. Please reconnect this account.`,
          });
          continue;
        }

        client.setTokens(account.tokens);
        const conversations = await client.getInboxMessages();
        
        console.log(`[SocialMediaManager] Successfully synced ${conversations.length} conversations from ${account.platform}`);
        
        results.push({
          platform: account.platform,
          conversations,
        });
      } catch (error) {
        results.push({
          platform: account.platform,
          conversations: [],
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  async sendMessage(
    account: SocialAccount,
    conversationId: string,
    message: string
  ): Promise<any> {
    const client = this.clients.get(account.platform);
    if (!client) {
      throw new Error(`No client configured for platform: ${account.platform}`);
    }

    client.setTokens(account.tokens);
    return await client.sendMessage(conversationId, message);
  }

  async getAccountDetails(account: SocialAccount): Promise<any> {
    const client = this.clients.get(account.platform);
    if (!client) {
      throw new Error(`No client configured for platform: ${account.platform}`);
    }

    client.setTokens(account.tokens);
    return await client.getProfile();
  }

  // Utility method to check if tokens need refresh
  shouldRefreshTokens(account: SocialAccount): boolean {
    if (!account.tokens.expiresAt) {
      return false; // No expiration info, assume valid
    }

    // Refresh if expires within 5 minutes
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    return account.tokens.expiresAt < fiveMinutesFromNow;
  }

  // Get all supported platforms
  getSupportedPlatforms(): SocialPlatform[] {
    return Array.from(this.clients.keys());
  }

  // Validate platform-specific content requirements
  validateContentForPlatform(platform: SocialPlatform, content: PostContent): string[] {
    const errors: string[] = [];

    switch (platform) {
      case 'twitter':
        if (content.text.length > 280) {
          errors.push('Twitter posts must be 280 characters or less');
        }
        break;
      case 'linkedin':
        if (content.text.length > 3000) {
          errors.push('LinkedIn posts must be 3000 characters or less');
        }
        break;
      case 'instagram':
        if (content.text.length > 2200) {
          errors.push('Instagram captions must be 2200 characters or less');
        }
        if (!content.media || content.media.length === 0) {
          errors.push('Instagram posts require at least one image or video');
        }
        break;
      case 'facebook':
        if (content.text.length > 63206) {
          errors.push('Facebook posts must be 63,206 characters or less');
        }
        break;
    }

    return errors;
  }

  // Get platform-specific posting requirements
  getPlatformRequirements(platform: SocialPlatform): any {
    const requirements = {
      facebook: {
        maxTextLength: 63206,
        supportsMedia: true,
        supportsScheduling: true,
        supportsLinks: true,
        requiresPageToken: true,
      },
      instagram: {
        maxTextLength: 2200,
        supportsMedia: true,
        supportsScheduling: true,
        supportsLinks: false,
        requiresMedia: true,
        requiresPageToken: true,
      },
      linkedin: {
        maxTextLength: 3000,
        supportsMedia: true,
        supportsScheduling: false,
        supportsLinks: true,
        requiresPageToken: false,
      },
      twitter: {
        maxTextLength: 280,
        supportsMedia: true,
        supportsScheduling: false,
        supportsLinks: true,
        requiresPageToken: false,
      },
    };

    return requirements[platform];
  }
}

// Factory function to create manager with environment variables
export function createSocialMediaManager(): SocialMediaManager {
  const configs: SocialMediaManagerConfig = {};

  if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    configs.facebook = {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/facebook/callback`,
      scopes: [
        'pages_read_engagement',
        'pages_read_user_content',
        'pages_manage_posts',
        'pages_messaging',
        'pages_show_list',
        'business_management',
        'instagram_basic',
        'instagram_content_publish',
        'instagram_manage_comments',
        'instagram_manage_messages'
      ],
    };

    // Instagram uses same config as Facebook
    configs.instagram = configs.facebook;
  }

  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    configs.linkedin = {
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/linkedin/callback`,
      scopes: [
        'openid',
        'profile', 
        'email',
        'w_member_social'
      ],
    };
  }

  if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
    configs.twitter = {
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/twitter/callback`,
      scopes: [
        'tweet.read',
        'tweet.write',
        'users.read',
        'offline.access'
      ],
    };
  }

  return new SocialMediaManager(configs);
}