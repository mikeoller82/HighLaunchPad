
import type * as Icons from 'lucide-react';

// Legacy interface for backward compatibility
export interface SocialProfile {
    id: string; // Corresponds to document ID in Firestore
    platform: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn';
    platformIcon: keyof typeof Icons;
    name: string;
    // In a real scenario, this would hold encrypted tokens
    credentials?: any; 
}

// New unified social account interface
export interface UnifiedSocialAccount {
    id: string;
    platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
    platformIcon: keyof typeof Icons;
    username: string;
    displayName: string;
    profilePicture?: string;
    tokens: {
        hasAccessToken: boolean;
        hasRefreshToken: boolean;
        expiresAt?: number;
        tokenType: string;
    };
    pageTokens?: { [pageId: string]: string };
    metadata?: any;
    connectedAt: Date;
    lastSynced: Date;
    needsTokenRefresh?: boolean;
    needsReconnection?: boolean;
    platformRequirements?: {
        maxTextLength: number;
        supportsMedia: boolean;
        supportsScheduling: boolean;
        supportsLinks: boolean;
        requiresMedia?: boolean;
        requiresPageToken?: boolean;
    };
}

export interface MediaItem {
    type: 'image' | 'video';
    url: string;
    file?: File; // For uploads before URL is generated
    thumbnail?: string; // For video thumbnails
    alt?: string; // Alt text for accessibility
}

export interface LinkPreview {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    domain?: string;
}

export interface Post {
    id: string; // Corresponds to document ID in Firestore
    profileIds: string[];
    caption: string;
    media: MediaItem[];
    linkPreview?: LinkPreview;
    hashtags: string[];
    status: 'draft' | 'scheduled' | 'processing' | 'published' | 'error';
    scheduledTime: any; // Firestore Timestamp will be used here, but Date object on client
    agentGenerated?: boolean; // Added for AI agent integration
    agentScheduled?: boolean; // Added for AI agent integration
}

// New unified post interface
export interface UnifiedPost {
    id: string;
    userId: string;
    content: {
        text: string;
        media?: MediaItem[];
        link?: string;
    };
    platformSpecificContent?: { [platform: string]: any };
    results?: {
        platform: string;
        success: boolean;
        data?: any;
        error?: string;
    }[];
    status: 'draft' | 'scheduled' | 'processing' | 'published' | 'partial_failure' | 'failed';
    createdAt: Date;
    scheduledTime?: Date;
    publishedAt?: Date;
}

// Conversation interfaces
export interface ConversationMessage {
    id: string;
    text: string;
    senderId: string;
    senderName?: string;
    createdAt: Date;
    isFromPage?: boolean;
    attachments?: any[];
}

export interface Conversation {
    id: string;
    platform: string;
    profileId: string;
    participants: any[];
    lastMessage?: ConversationMessage;
    unreadCount: number;
    updatedAt: Date;
    lastSynced: Date;
    messages?: ConversationMessage[];
}

// API Response interfaces
export interface SocialAccountsResponse {
    success: boolean;
    accounts: UnifiedSocialAccount[];
    supportedPlatforms: string[];
}

export interface PostResponse {
    success: boolean;
    message: string;
    results?: {
        platform: string;
        success: boolean;
        data?: any;
        error?: string;
    }[];
    postId?: string;
    successCount?: number;
    failureCount?: number;
    scheduledTime?: string;
}

export interface InboxSyncResponse {
    success: boolean;
    totalConversations: number;
    results: {
        platform: string;
        success: boolean;
        count: number;
        error?: string;
    }[];
    message: string;
}

export interface ConversationsResponse {
    success: boolean;
    conversations: Conversation[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}
