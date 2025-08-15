'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MessageSquare, Send, Phone, Search, Twitter, Instagram, Facebook, Linkedin, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { subscribeToConversations, subscribeToMessages, sendMessage, markAsRead, getConnectedSocialProfiles, initializeConversationsForUser, syncAllConnectedPlatforms, syncConversationsFromPlatform } from '@/lib/conversation-api';
import { getCurrentUserSyncService } from '@/lib/conversation-sync-service';
import { debugConversationSync } from '@/lib/conversation-debugger';
import { testSuite } from '@/lib/conversation-test-suite';
import type { Conversation, Message, ConversationFilter } from '@/lib/conversation-types';
import type { SocialProfile } from '@/lib/social-types';


const channelIcons = {
    email: <Mail className="h-4 w-4" />,
    sms: <MessageSquare className="h-4 w-4" />,
    instagram: <Instagram className="h-4 w-4" />,
    twitter: <Twitter className="h-4 w-4" />,
    facebook: <Facebook className="h-4 w-4" />,
    linkedin: <Linkedin className="h-4 w-4" />,
};

export default function ConversationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [filter, setFilter] = useState<ConversationFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [connectedProfiles, setConnectedProfiles] = useState<SocialProfile[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) return;

    const initializeData = async () => {
      setIsLoading(true);
      
      // Get connected social profiles
      const profiles = await getConnectedSocialProfiles();
      setConnectedProfiles(profiles);
      
      // Sync real conversations from connected platforms
      if (profiles.length > 0) {
        try {
          await initializeConversationsForUser();
          setLastSyncTime(new Date());
        } catch (error) {
          console.log('Initial sync failed, will try manual sync:', error);
        }
      }

      // Sync email conversations
      try {
        const idToken = await user.getIdToken();
        const emailResponse = await fetch('/api/email/sync', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        
        if (emailResponse.ok) {
          const emailData = await emailResponse.json();
          // Convert emails to conversation format
          const emailConversations = emailData.emails?.slice(0, 10).map((email: any) => ({
            id: `email-${email.id}`,
            channel: 'email' as const,
            contact: {
              id: email.from.email,
              name: email.from.name || email.from.email,
              email: email.from.email,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email.from.email}`,
              source: 'email',
              createdAt: new Date(email.date),
              lastActivity: new Date(email.date),
              tags: []
            },
            lastMessage: {
              id: email.id,
              content: email.bodyText.substring(0, 100) + (email.bodyText.length > 100 ? '...' : ''),
              timestamp: new Date(email.date),
              from: 'contact' as const
            },
            unreadCount: email.isRead ? 0 : 1,
            createdAt: new Date(email.date),
            updatedAt: new Date(email.syncedAt || email.date)
          })) || [];

          // Merge with existing conversations
          setConversations(prev => [...emailConversations, ...prev]);
        }
      } catch (error) {
        console.log('Email sync not available:', error);
      }
      
      setIsLoading(false);
    };

    initializeData();

    const unsubscribe = subscribeToConversations((fetchedConversations) => {
      setConversations(fetchedConversations);
      
      // Auto-select first conversation if none selected
      if (!selectedConversation && fetchedConversations.length > 0) {
        setSelectedConversation(fetchedConversations[0]);
      }
    }, { ...filter, search: searchQuery });

    return unsubscribe;
  }, [user, filter, searchQuery, selectedConversation]);

  useEffect(() => {
    if (!selectedConversation) return;

    const unsubscribe = subscribeToMessages(selectedConversation.id, (fetchedMessages) => {
      setMessages(fetchedMessages);
    });

    // Mark as read when conversation is selected
    if (selectedConversation.unreadCount > 0) {
      markAsRead(selectedConversation.id);
    }

    return unsubscribe;
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await sendMessage(selectedConversation.id, newMessage, selectedConversation.channel);
      setNewMessage('');
      toast({ title: 'Message sent successfully' });
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Failed to send message',
        description: 'Please try again later.'
      });
    }
  };

  const handleSyncConversations = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      // Sync social platforms
      await syncAllConnectedPlatforms();
      
      // Sync emails if user has email sync configured
      try {
        const idToken = await user!.getIdToken();
        const emailSyncResponse = await fetch('/api/email/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            provider: 'gmail', // Default to Gmail for now
            email: user!.email,
            password: '' // This would need to be configured in settings
          })
        });
        
        if (emailSyncResponse.ok) {
          const emailData = await emailSyncResponse.json();
          console.log('Email sync successful:', emailData);
        }
      } catch (emailError) {
        console.log('Email sync not configured or failed:', emailError);
      }
      
      setLastSyncTime(new Date());
      toast({ 
        title: 'Conversations synced', 
        description: 'Successfully synced conversations from all connected platforms and email.' 
      });
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Sync failed',
        description: 'Failed to sync conversations. Please try again.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-blue-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[320px_1fr_320px] h-[calc(100vh-4rem)] border-t">
      {/* Sidebar with conversation list */}
      <aside className="border-r flex flex-col bg-card">
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Conversations</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSyncConversations}
                  disabled={isSyncing || connectedProfiles.length === 0}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => debugConversationSync()}
                  title="Debug conversation sync"
                >
                  🔍
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => testSuite.runFullTest()}
                  title="Run comprehensive test suite"
                >
                  🧪
                </Button>
              </div>
            </div>
            
            {connectedProfiles.length > 0 && (
              <div className="text-xs text-blue-600 flex items-center gap-2">
                <AlertCircle className="h-3 w-3" />
                <span>
                  Real conversations from your connected platforms will appear here.
                  {lastSyncTime && ` Last synced: ${lastSyncTime.toLocaleTimeString()}`}
                </span>
              </div>
            )}
            
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
              <Input 
                placeholder="Search conversations..." 
                className="w-full pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filter.channel || 'all'} onValueChange={(value) => setFilter(prev => ({ ...prev, channel: value === 'all' ? undefined : value as any }))}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-blue-600">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              {connectedProfiles.length === 0 ? (
                <>
                  <p>No social accounts connected</p>
                  <p className="text-sm">Connect social accounts in Settings to see your real conversations</p>
                </>
              ) : (
                <>
                  <p>No conversations found</p>
                  <p className="text-sm">Your real conversations from connected platforms will appear here</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSyncConversations}
                    disabled={isSyncing}
                    className="mt-2"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </Button>
                </>
              )}
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={cn(
                    'p-3 border-b cursor-pointer hover:bg-muted/50 flex gap-3 items-start',
                    selectedConversation?.id === conv.id ? 'bg-muted' : ''
                )}
                onClick={() => setSelectedConversation(conv)}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={conv.contact.avatar} />
                  <AvatarFallback>{conv.contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-sm truncate">{conv.contact.name}</h3>
                      <p className="text-xs text-blue-600 whitespace-nowrap">{formatTime(conv.lastMessage.timestamp)}</p>
                  </div>
                  <p className="text-sm text-blue-600 truncate mt-0.5">{conv.lastMessage.content}</p>
                  <div className="flex justify-between items-center mt-1">
                      <div className="text-blue-600">{channelIcons[conv.channel]}</div>
                      {conv.unreadCount > 0 && (
                          <Badge variant="default" className="h-5 px-1.5 text-xs">{conv.unreadCount}</Badge>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main conversation view */}
      <main className="flex-1 flex flex-col bg-background">
        {selectedConversation ? (
          <>
            <header className="p-3 border-b flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={selectedConversation.contact.avatar} />
                <AvatarFallback>{selectedConversation.contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{selectedConversation.contact.name}</h3>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  {channelIcons[selectedConversation.channel]}
                  <span className="capitalize">{selectedConversation.channel}</span>
                </div>
              </div>
            </header>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-blue-600 py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 items-end ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                     {msg.from === 'contact' && (
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={selectedConversation.contact.avatar} />
                         <AvatarFallback>{selectedConversation.contact.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                     )}
                    <div className={`p-3 rounded-lg max-w-lg ${msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-primary-foreground/70' : 'text-blue-600'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <footer className="p-4 border-t bg-card">
              <div className="relative">
                <Textarea 
                  placeholder="Type your message..." 
                  className="pr-24" 
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Phone className="h-4 w-4" /></Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-blue-600"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-blue-600">
            <Mail className="h-16 w-16" />
            <h3 className="mt-4 text-lg font-semibold">Unified Inbox</h3>
            <p>Select a conversation to view messages from all your connected platforms.</p>
            {connectedProfiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Connected Platforms:</p>
                <div className="flex gap-2 justify-center">
                  {connectedProfiles.map(profile => (
                    <div key={profile.id} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                      {profile.platform}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
       {/* Right sidebar with contact details */}
       <aside className="hidden lg:block border-l bg-card p-4">
           {selectedConversation ? (
               <div className="space-y-4">
                    <div className="p-0 items-center text-center">
                        <Avatar className="h-20 w-20 border mx-auto">
                            <AvatarImage src={selectedConversation.contact.avatar} />
                            <AvatarFallback>{selectedConversation.contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="pt-2 font-semibold text-lg">{selectedConversation.contact.name}</h3>
                        <p className="text-sm text-blue-600">Contact</p>
                    </div>
                    <Separator/>
                     <div>
                        <h4 className="text-sm font-semibold mb-2">Contact Details</h4>
                        <div className="space-y-1 text-sm text-blue-600">
                            {selectedConversation.contact.email && (
                              <p>Email: {selectedConversation.contact.email}</p>
                            )}
                            {selectedConversation.contact.phone && (
                              <p>Phone: {selectedConversation.contact.phone}</p>
                            )}
                            <p>Source: {selectedConversation.contact.source}</p>
                            <p>First Contact: {formatTime(selectedConversation.contact.createdAt)}</p>
                            <p>Last Activity: {formatTime(selectedConversation.contact.lastActivity)}</p>
                        </div>
                    </div>
                    <Separator/>
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                            {selectedConversation.contact.tags.length > 0 ? (
                              selectedConversation.contact.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">{tag}</Badge>
                              ))
                            ) : (
                              <p className="text-sm text-blue-600">No tags assigned</p>
                            )}
                        </div>
                    </div>
                    {selectedConversation.contact.socialProfiles && (
                      <>
                        <Separator/>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Social Profiles</h4>
                          <div className="space-y-1 text-sm">
                            {selectedConversation.contact.socialProfiles.instagram && (
                              <p>Instagram: @{selectedConversation.contact.socialProfiles.instagram}</p>
                            )}
                            {selectedConversation.contact.socialProfiles.twitter && (
                              <p>Twitter: @{selectedConversation.contact.socialProfiles.twitter}</p>
                            )}
                            {selectedConversation.contact.socialProfiles.facebook && (
                              <p>Facebook: {selectedConversation.contact.socialProfiles.facebook}</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
               </div>
           ) : (
               <div className="text-center text-sm text-blue-600 pt-20">Select a conversation to see contact details.</div>
           )}
       </aside>
    </div>
  );
}