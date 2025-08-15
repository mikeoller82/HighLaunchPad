import { getFirestore } from 'firebase-admin/firestore';
import { createSocialMediaManager } from './social-media-manager';
import type { SocialAccount, Conversation } from './social-oauth-clients';

export class SocialSyncService {
  private db: FirebaseFirestore.Firestore;
  private socialManager: any;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.socialManager = createSocialMediaManager();
  }

  /**
   * Sync a newly connected social account with the unified inbox and scheduler
   */
  async syncNewAccount(userId: string, account: SocialAccount): Promise<void> {
    console.log(`[SocialSync] Syncing new ${account.platform} account for user ${userId}`);

    try {
      // 1. Store in social_accounts collection for scheduler
      await this.storeSocialAccount(userId, account);

      // 2. Store in profiles collection for backward compatibility
      await this.storeLegacyProfile(userId, account);

      // 3. Sync initial conversations for inbox
      await this.syncAccountConversations(userId, account);

      // 4. Update user's connected platforms list
      await this.updateConnectedPlatforms(userId, account.platform);

      console.log(`[SocialSync] Successfully synced ${account.platform} account`);
    } catch (error) {
      console.error(`[SocialSync] Failed to sync ${account.platform} account:`, error);
      throw error;
    }
  }

  private async storeSocialAccount(userId: string, account: SocialAccount): Promise<void> {
    const accountRef = this.db.collection('workspaces').doc(userId).collection('social_accounts').doc(account.id);
    
    // Filter out undefined values to prevent Firestore errors
    const accountData = this.filterUndefinedValues({
      id: account.id,
      platform: account.platform,
      platformIcon: this.getPlatformIcon(account.platform),
      username: account.username,
      displayName: account.displayName,
      profilePicture: account.profilePicture,
      tokens: this.filterUndefinedValues({
        accessToken: account.tokens.accessToken,
        refreshToken: account.tokens.refreshToken,
        expiresAt: account.tokens.expiresAt,
        tokenType: account.tokens.tokenType,
        expiresIn: account.tokens.expiresIn,
        idToken: account.tokens.idToken,
      }),
      pageTokens: account.pageTokens || {},
      metadata: account.metadata ? this.filterUndefinedValues(account.metadata) : {},
      connectedAt: new Date(),
      lastSynced: new Date(),
      isActive: true,
    });

    await accountRef.set(accountData, { merge: true });
  }

  private async storeLegacyProfile(userId: string, account: SocialAccount): Promise<void> {
    const profileRef = this.db.collection('workspaces').doc(userId).collection('profiles').doc(account.id);
    
    const legacyProfile = this.filterUndefinedValues({
      id: account.id,
      platform: this.getPlatformDisplayName(account.platform),
      platformIcon: this.getPlatformIcon(account.platform),
      name: account.displayName,
      username: account.username,
      profilePicture: account.profilePicture,
      credentials: this.filterUndefinedValues({
        accessToken: account.tokens.accessToken,
        refreshToken: account.tokens.refreshToken,
        expiresAt: account.tokens.expiresAt,
      }),
      connectedAt: new Date(),
    });

    await profileRef.set(legacyProfile, { merge: true });
  }

  private async syncAccountConversations(userId: string, account: SocialAccount): Promise<void> {
    try {
      const client = this.socialManager.getClient(account.platform);
      if (!client) {
        console.warn(`[SocialSync] No client available for ${account.platform}`);
        return;
      }

      client.setTokens(account.tokens);
      const conversations = await client.getInboxMessages();

      if (conversations.length > 0) {
        const batch = this.db.batch();
        const conversationsRef = this.db.collection('workspaces').doc(userId).collection('conversations');

        conversations.forEach((conversation: Conversation) => {
          const docRef = conversationsRef.doc(conversation.id);
          batch.set(docRef, {
            ...conversation,
            accountId: account.id,
            syncedAt: new Date(),
          }, { merge: true });
        });

        await batch.commit();
        console.log(`[SocialSync] Synced ${conversations.length} conversations for ${account.platform}`);
      }
    } catch (error) {
      console.error(`[SocialSync] Failed to sync conversations for ${account.platform}:`, error);
      // Don't throw - conversation sync failure shouldn't break account connection
    }
  }

  private async updateConnectedPlatforms(userId: string, platform: string): Promise<void> {
    const userRef = this.db.collection('workspaces').doc(userId);
    
    await userRef.set({
      connectedPlatforms: {
        [platform]: {
          connected: true,
          connectedAt: new Date(),
        }
      }
    }, { merge: true });
  }

  private getPlatformIcon(platform: string): string {
    const iconMap: { [key: string]: string } = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter',
      linkedin: 'Linkedin',
    };
    return iconMap[platform] || 'Share2';
  }

  private getPlatformDisplayName(platform: string): string {
    const nameMap: { [key: string]: string } = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
    };
    return nameMap[platform] || platform;
  }

  /**
   * Filter out undefined values from an object to prevent Firestore errors
   */
  private filterUndefinedValues(obj: any): any {
    if (obj === null || obj === undefined) {
      return {};
    }
    
    if (typeof obj !== 'object') {
      return obj;
    }
    
    const filtered: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
          filtered[key] = this.filterUndefinedValues(value);
        } else {
          filtered[key] = value;
        }
      }
    }
    return filtered;
  }

  /**
   * Periodic sync for all connected accounts
   */
  async syncAllAccounts(userId: string): Promise<void> {
    console.log(`[SocialSync] Starting periodic sync for user ${userId}`);

    const accountsSnapshot = await this.db
      .collection('workspaces')
      .doc(userId)
      .collection('social_accounts')
      .where('isActive', '==', true)
      .get();

    const syncPromises = accountsSnapshot.docs.map(async (doc) => {
      const account = doc.data() as SocialAccount;
      try {
        await this.syncAccountConversations(userId, account);
        
        // Update last synced timestamp
        await doc.ref.update({ lastSynced: new Date() });
      } catch (error) {
        console.error(`[SocialSync] Failed to sync account ${account.id}:`, error);
      }
    });

    await Promise.allSettled(syncPromises);
    console.log(`[SocialSync] Completed periodic sync for ${accountsSnapshot.size} accounts`);
  }
}