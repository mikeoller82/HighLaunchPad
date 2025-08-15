export interface Message {
  id: string;
  conversationId: string;
  from: 'user' | 'contact';
  content: string;
  timestamp: Date;
  channel: 'email' | 'sms' | 'instagram' | 'twitter' | 'facebook' | 'linkedin';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  platformMessageId?: string; // Original message ID from the platform
  attachments?: {
    type: 'image' | 'video' | 'file';
    url: string;
    name?: string;
  }[];
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  tags: string[];
  source: string;
  socialProfiles?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  platformUserId?: string; // User ID from the social platform
  createdAt: Date;
  lastActivity: Date;
}

export interface Conversation {
  id: string;
  contactId: string;
  contact: Contact;
  lastMessage: Message;
  unreadCount: number;
  status: 'active' | 'archived' | 'spam';
  channel: 'email' | 'sms' | 'instagram' | 'twitter' | 'facebook' | 'linkedin';
  platformConversationId?: string; // Original conversation ID from the platform
  connectedProfileId?: string; // Which of user's social profiles this conversation is for
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationFilter {
  channel?: 'email' | 'sms' | 'instagram' | 'twitter' | 'facebook' | 'linkedin';
  status?: 'active' | 'archived' | 'spam';
  unreadOnly?: boolean;
  search?: string;
  profileId?: string; // Filter by specific connected social profile
}