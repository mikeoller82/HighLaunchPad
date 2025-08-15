
import * as Icons from 'lucide-react';
import { addDays, subDays } from 'date-fns';
import { UnifiedSocialAccount, UnifiedPost } from './social-types';

// Legacy interface for backward compatibility
export interface SocialProfile {
    id: string;
    platform: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn';
    platformIcon: keyof typeof Icons;
    name: string;
}

export interface Post {
    id: string;
    profileIds: string[];
    caption: string;
    media: { type: 'image' | 'video', url: string }[];
    status: 'draft' | 'scheduled' | 'processing' | 'published' | 'error';
    scheduledTime: Date;
}

// New unified functions
export const getConnectedSocialAccounts = async (userId: string, db: any): Promise<UnifiedSocialAccount[]> => {
    try {
        // Try new social_accounts collection first
        const accountsSnapshot = await db.collection('workspaces').doc(userId).collection('social_accounts').get();
        
        if (!accountsSnapshot.empty) {
            return accountsSnapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                connectedAt: doc.data().connectedAt?.toDate?.() || doc.data().connectedAt,
                lastSynced: doc.data().lastSynced?.toDate?.() || doc.data().lastSynced,
            }));
        }

        // Fallback to legacy profiles collection
        const profilesSnapshot = await db.collection('workspaces').doc(userId).collection('profiles').get();
        return profilesSnapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                platform: data.platform?.toLowerCase() || 'unknown',
                platformIcon: data.platformIcon || 'Globe',
                username: data.name || 'Unknown Account',
                displayName: data.name || 'Unknown Account',
                tokens: {
                    hasAccessToken: !!data.credentials?.accessToken,
                    hasRefreshToken: !!data.credentials?.refreshToken,
                    expiresAt: data.credentials?.expiresAt,
                    tokenType: 'Bearer',
                },
                connectedAt: new Date(),
                lastSynced: new Date(),
            };
        });
    } catch (error) {
        console.error('Error fetching connected social accounts:', error);
        return [];
    }
};

export const getUnifiedPosts = async (userId: string, db: any): Promise<UnifiedPost[]> => {
    try {
        // Get published posts
        const postsSnapshot = await db
            .collection('workspaces')
            .doc(userId)
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        const publishedPosts = postsSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            publishedAt: doc.data().publishedAt?.toDate?.() || doc.data().publishedAt,
            scheduledTime: doc.data().scheduledTime?.toDate?.() || doc.data().scheduledTime,
        }));

        // Get scheduled posts
        const scheduledSnapshot = await db
            .collection('workspaces')
            .doc(userId)
            .collection('scheduled_posts')
            .orderBy('scheduledTime', 'asc')
            .get();

        const scheduledPosts = scheduledSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            scheduledTime: doc.data().scheduledTime?.toDate?.() || doc.data().scheduledTime,
        }));

        return [...publishedPosts, ...scheduledPosts];
    } catch (error) {
        console.error('Error fetching unified posts:', error);
        return [];
    }
};

// Legacy function for backward compatibility
export const getConnectedProfiles = async (userId: string, db: any): Promise<SocialProfile[]> => {
    try {
        const accounts = await getConnectedSocialAccounts(userId, db);
        return accounts.map(account => ({
            id: account.id,
            platform: account.platform.charAt(0).toUpperCase() + account.platform.slice(1) as any,
            platformIcon: account.platformIcon,
            name: account.displayName,
        }));
    } catch (error) {
        console.error('Error fetching connected profiles:', error);
        return [];
    }
};

export const mockProfiles: SocialProfile[] = [
    { id: 'fb_1', platform: 'Facebook', platformIcon: 'Facebook', name: 'HighLaunchPad Page' },
    { id: 'ig_1', platform: 'Instagram', platformIcon: 'Instagram', name: '@HighLaunchPad' },
    { id: 'tw_1', platform: 'Twitter', platformIcon: 'Twitter', name: '@HighLaunchPad' },
    { id: 'li_1', platform: 'LinkedIn', platformIcon: 'Linkedin', name: 'HighLaunchPad Inc.' },
];

const today = new Date();

export const mockPosts: Post[] = [
    {
        id: 'post_1',
        profileIds: ['fb_1'],
        caption: 'Our new AI Content Engine is a game-changer for marketers. Generate ad copy, emails, and more in seconds. 🚀',
        media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=entropy&auto=format' }],
        status: 'published',
        scheduledTime: subDays(today, 2),
    },
    {
        id: 'post_2',
        profileIds: ['ig_1'],
        caption: 'Behind the scenes at HighLaunchPad. #saas #startup #ai',
        media: [{ type: 'video', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop&crop=entropy&auto=format' }],
        status: 'published',
        scheduledTime: subDays(today, 1),
    },
    {
        id: 'post_3',
        profileIds: ['tw_1'],
        caption: 'Quick poll: What feature should we build next? A) Advanced Analytics B) Team Collaboration',
        media: [],
        status: 'scheduled',
        scheduledTime: today,
    },
    {
        id: 'post_4',
        profileIds: ['li_1'],
        caption: 'We\'re excited to announce our seed funding round to accelerate development of our AI-powered CRM for the Creator Economy. Read more on our blog.',
        media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=entropy&auto=format' }],
        status: 'scheduled',
        scheduledTime: today,
    },
     {
        id: 'post_5',
        profileIds: ['fb_1', 'ig_1'],
        caption: 'Join our free webinar this Thursday on "How to Triple Your Leads with Marketing Automation". Link in bio to register!',
        media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=entropy&auto=format' }],
        status: 'scheduled',
        scheduledTime: addDays(today, 2),
    },
    {
        id: 'post_6',
        profileIds: ['tw_1'],
        caption: 'Draft post about upcoming features.',
        media: [],
        status: 'draft',
        scheduledTime: addDays(today, 3),
    },
];

// Utility functions for the new unified system
export const createSocialPost = async (
    userId: string,
    content: {
        text: string;
        media?: { type: 'image' | 'video'; url: string; alt?: string }[];
        link?: string;
    },
    platforms: string[],
    scheduledTime?: Date,
    platformSpecificContent?: { [platform: string]: any }
): Promise<Response> => {
    const response = await fetch('/api/social/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await getAuthToken(), // You'll need to implement this
            content,
            platforms,
            scheduledTime: scheduledTime?.toISOString(),
            platformSpecificContent,
        }),
    });

    return response;
};

export const syncSocialInbox = async (userId: string, platforms?: string[]): Promise<Response> => {
    const response = await fetch('/api/social/inbox/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await getAuthToken(), // You'll need to implement this
            platforms,
        }),
    });

    return response;
};

export const getSocialAccounts = async (): Promise<UnifiedSocialAccount[]> => {
    const response = await fetch(`/api/social/accounts?token=${await getAuthToken()}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch social accounts');
    }

    const data = await response.json();
    return data.accounts || [];
};

// Helper function to get auth token - you'll need to implement this based on your auth system
async function getAuthToken(): Promise<string> {
    // This should return the user's Firebase ID token
    // Implementation depends on your authentication setup
    throw new Error('getAuthToken not implemented - please implement based on your auth system');
}
