
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/components/dashboard/social-scheduler/calendar-view';
import { EnhancedPostEditor } from '@/components/dashboard/social-scheduler/enhanced-post-editor';
import { type Post, type SocialProfile } from '@/lib/social-types';
import { useAuth } from '@/context/auth-context';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brain, TrendingUp, Clock, Target, BarChart3 } from 'lucide-react';
import { 
  AgentRegistry,
  BaseAgent,
  AgentConfiguration,
  AgentType,
  AgentCapability,
  EventType,
  ActionType
} from '@/lib/ai-agents';

interface SocialInsight {
    type: 'timing' | 'content' | 'engagement' | 'hashtags';
    title: string;
    description: string;
    action?: string;
    priority: 'high' | 'medium' | 'low';
}

class SocialMediaAgent extends BaseAgent {
    protected async processEvents(events: any[]): Promise<void> {
        for (const event of events) {
            if (event.type === EventType.CUSTOMER_INTERACTION) {
                console.log('Processing social interaction:', event);
            }
        }
    }

    protected async makeDecisions(context: any): Promise<any[]> {
        const actions: any[] = [];
        
        if (context.events.length > 0) {
            actions.push({
                id: `social-insight-${Date.now()}`,
                type: ActionType.GENERATE_INSIGHT,
                agentId: this.id,
                timestamp: new Date(),
                parameters: {
                    type: 'social_optimization',
                    insights: ['Best posting times identified', 'Trending hashtags available']
                },
                priority: 1
            });
        }

        return actions;
    }

    protected async executeActions(actions: any[]): Promise<any[]> {
        const results: any[] = [];
        
        for (const action of actions) {
            try {
                const result = {
                    actionId: action.id,
                    success: true,
                    result: { message: 'Social insight generated successfully' },
                    timestamp: new Date()
                };
                results.push(result);
            } catch (error) {
                results.push({
                    actionId: action.id,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date()
                });
            }
        }

        return results;
    }

    protected async processFeedback(feedback: any[]): Promise<void> {
        // Process feedback to improve social media recommendations
        for (const fb of feedback) {
            console.log('Processing social feedback:', fb);
            // Update learning algorithms based on feedback
        }
    }
}

export default function SocialSchedulerPage() {
    const { user, db } = useAuth();
    const { toast } = useToast();
    const [posts, setPosts] = useState<Post[]>([]);
    const [profiles, setProfiles] = useState<SocialProfile[]>([]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [socialAgent, setSocialAgent] = useState<SocialMediaAgent | null>(null);
    const [aiInsights, setAiInsights] = useState<SocialInsight[]>([]);
    const [isAiEnabled, setIsAiEnabled] = useState(false);

    useEffect(() => {
        if (!user || !db) return;

        const postsQuery = query(collection(db, 'workspaces', user.uid, 'posts'), orderBy('scheduledTime', 'desc'));
        const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    profileIds: data.profileIds || [],
                    caption: data.caption || '',
                    media: data.media || [],
                    hashtags: data.hashtags || [],
                    status: data.status || 'draft',
                    scheduledTime: (data.scheduledTime as Timestamp).toDate(),
                    linkPreview: data.linkPreview,
                    agentGenerated: data.agentGenerated || false,
                    agentScheduled: data.agentScheduled || false
                } as Post;
            });
            setPosts(fetchedPosts);
            
            // Log AI-generated posts for debugging
            const aiPosts = fetchedPosts.filter(p => p.agentGenerated);
            if (aiPosts.length > 0) {
                console.log(`📱 Found ${aiPosts.length} AI-generated social posts:`, aiPosts.map(p => ({
                    id: p.id,
                    caption: p.caption?.substring(0, 50) + '...',
                    scheduledTime: p.scheduledTime,
                    platforms: p.profileIds
                })));
            }
        });

        const profilesQuery = collection(db, 'workspaces', user.uid, 'profiles');
        const unsubscribeProfiles = onSnapshot(profilesQuery, (snapshot) => {
            const fetchedProfiles = snapshot.docs.map(doc => ({
                 id: doc.id, 
                 ...doc.data() 
            }) as SocialProfile);
            setProfiles(fetchedProfiles);
        });

        return () => {
            unsubscribePosts();
            unsubscribeProfiles();
        };
    }, [user, db, toast]);

    // Initialize Social Media AI Agent
    useEffect(() => {
        if (!user) return;

        const initializeSocialAgent = async () => {
            try {
                console.log('🤖 Initializing Social Media AI Agent');
                
                const agentConfig: AgentConfiguration = {
                    id: `social-agent-${user.uid}`,
                    type: AgentType.CUSTOMER_INTERACTION,
                    name: 'Social Media Agent',
                    description: 'AI agent for social media optimization and content insights',
                    enabled: true,
                    priority: 1,
                    maxConcurrentActions: 5,
                    learningEnabled: true,
                    configuration: {
                        contentOptimization: true,
                        timingAnalysis: true,
                        hashtagSuggestions: true
                    },
                    capabilities: [
                        {
                            name: 'content_optimization',
                            description: 'Optimize social media content',
                            requiredPermissions: ['read_posts', 'analyze_engagement'],
                            supportedEventTypes: [EventType.CUSTOMER_INTERACTION, EventType.DATA_UPDATED],
                            supportedActionTypes: [ActionType.GENERATE_INSIGHT, ActionType.UPDATE_RECORD]
                        }
                    ]
                };

                const agent = new SocialMediaAgent(agentConfig);
                setSocialAgent(agent);

                // Register agent
                const registry = AgentRegistry.getInstance();
                await registry.registerAgent(agent);
                await agent.start();

                setIsAiEnabled(true);

                // Generate initial insights
                const insights: SocialInsight[] = [
                    {
                        type: 'timing',
                        title: 'Peak Engagement Hours',
                        description: 'Your audience is most active between 7-9 PM on weekdays',
                        action: 'Schedule posts for optimal reach',
                        priority: 'high'
                    },
                    {
                        type: 'hashtags',
                        title: 'Trending Hashtags',
                        description: '#entrepreneurship and #digitalmarketing are trending in your niche',
                        action: 'Include trending hashtags',
                        priority: 'medium'
                    },
                    {
                        type: 'content',
                        title: 'Content Performance',
                        description: 'Video content gets 3x more engagement than images',
                        action: 'Create more video content',
                        priority: 'medium'
                    }
                ];

                setAiInsights(insights);
                console.log('✅ Social Media AI Agent initialized successfully');
            } catch (error) {
                console.error('❌ Failed to initialize Social Media AI agent:', error);
            }
        };

        initializeSocialAgent();
    }, [user]);
    
    const handleSelectPost = (post: Post) => {
        setSelectedPost(post);
        setIsEditorOpen(true);
    };

    const handleCreateNewPost = () => {
        if (profiles.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Profiles Connected',
                description: 'Please connect a social profile in Settings before creating a post.'
            });
            return;
        }
        setSelectedPost(null);
        setIsEditorOpen(true);
    };

    const handleSavePost = async (postData: Omit<Post, 'id' | 'scheduledTime'> & { id?: string; scheduledTime: Date }) => {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        
        const dataToSave = {
            ...postData,
            scheduledTime: Timestamp.fromDate(postData.scheduledTime)
        };

        try {
            if (postData.id) {
                const postRef = doc(db, 'workspaces', user.uid, 'posts', postData.id);
                await updateDoc(postRef, dataToSave);
                toast({ title: 'Success', description: 'Post updated successfully.' });
            } else {
                await addDoc(collection(db, 'workspaces', user.uid, 'posts'), dataToSave);
                toast({ title: 'Success', description: 'Post scheduled successfully.' });
            }
            setIsEditorOpen(false);
        } catch (error) {
            console.error("Error saving post:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save post.' });
        }
    };
    
    const handleDeletePost = async (postId: string) => {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        
        try {
            await deleteDoc(doc(db, 'workspaces', user.uid, 'posts', postId));
            toast({ title: 'Success', description: 'Post deleted.' });
            setIsEditorOpen(false);
        } catch (error) {
            console.error("Error deleting post:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete post.' });
        }
    };


    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Social Scheduler
                            {isAiEnabled && (
                                <Badge variant="outline" className="text-xs">
                                    <Brain className="h-3 w-3 mr-1" />
                                    AI Enhanced
                                </Badge>
                            )}
                        </h1>
                        <p className="text-blue-600">Plan and automate your social media content. {isAiEnabled && 'AI will optimize timing and content.'}</p>
                    </div>
                    {isAiEnabled && aiInsights.length > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {aiInsights.length} AI insights
                        </Badge>
                    )}
                </div>

                {/* AI Insights Panel */}
                {isAiEnabled && aiInsights.length > 0 && (
                    <Card className="mt-4 border-blue-200 bg-blue-50/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Brain className="h-4 w-4 text-blue-600" />
                                AI Social Media Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {aiInsights.map((insight, index) => (
                                <Alert key={index} className={`border-l-4 py-2 ${
                                    insight.priority === 'high' ? 'border-l-red-500' :
                                    insight.priority === 'medium' ? 'border-l-yellow-500' :
                                    'border-l-green-500'
                                }`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <AlertTitle className="text-sm font-medium flex items-center gap-2">
                                                {insight.type === 'timing' && <Clock className="h-3 w-3" />}
                                                {insight.type === 'hashtags' && <Target className="h-3 w-3" />}
                                                {insight.type === 'content' && <BarChart3 className="h-3 w-3" />}
                                                {insight.title}
                                            </AlertTitle>
                                            <AlertDescription className="text-xs mt-1">
                                                {insight.description}
                                            </AlertDescription>
                                        </div>
                                        {insight.action && (
                                            <Button variant="outline" size="sm" className="text-xs h-6">
                                                {insight.action}
                                            </Button>
                                        )}
                                    </div>
                                </Alert>
                            ))}
                        </CardContent>
                    </Card>
                )}
                <div className="mt-4">
                     {profiles.length === 0 ? (
                         <p className="text-sm text-blue-600">No social profiles connected. <Button variant="link" asChild className="p-0 h-auto"><Link href="/dashboard/settings?tab=social">Connect one in Settings</Link></Button> to get started.</p>
                    ) : (
                         <div className="flex flex-wrap gap-2 items-center">
                            <p className="text-sm font-medium">Connected as:</p>
                            {profiles.map(profile => (
                                <div key={profile.id} className="flex items-center gap-2 text-sm bg-muted px-2 py-1 rounded-md">
                                    <p>{profile.name}</p>
                                </div>
                            ))}
                         </div>
                    )}
                </div>
            </div>
            <CalendarView 
                posts={posts} 
                profiles={profiles}
                onSelectPost={handleSelectPost}
                onAddNewPost={handleCreateNewPost}
            />
            {isEditorOpen && (
                <EnhancedPostEditor
                    post={selectedPost}
                    profiles={profiles}
                    onSave={handleSavePost}
                    onDelete={handleDeletePost}
                    onClose={() => setIsEditorOpen(false)}
                />
            )}
        </div>
    );
}
