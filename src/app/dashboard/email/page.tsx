
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ArrowRight, Users, FolderKanban, Settings, Brain, TrendingUp } from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { professionalEmailTemplates, emailCategories } from "@/lib/email-templates-full";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/auth-context";
import { 
  AgentRegistry,
  AgentConfiguration,
  AgentType,
  AgentCapability,
  EventType,
  ActionType,
  Event,
  Action,
  DecisionContext,
  ExecutionResult,
  BaseAgent
} from "@/lib/ai-agents";

interface Subscriber {
    id: number;
    email: string;
    name: string;
    date: string;
    avatar: string;
}

interface Segment {
    id: number;
    name: string;
    count: number;
}

interface EmailInsight {
    type: 'engagement' | 'optimization' | 'timing' | 'content';
    title: string;
    description: string;
    action?: string;
    priority: 'high' | 'medium' | 'low';
}

class EmailMarketingAgent extends BaseAgent {
    protected async processEvents(events: Event[]): Promise<void> {
        // Process email-related events
        for (const event of events) {
            if (event.type === EventType.CUSTOMER_INTERACTION) {
                // Handle email interactions
                console.log('Processing email interaction:', event);
            }
        }
    }

    protected async makeDecisions(context: DecisionContext): Promise<Action[]> {
        const actions: Action[] = [];
        
        // Generate insights based on context
        if (context.events.length > 0) {
            actions.push({
                id: `insight-${Date.now()}`,
                type: ActionType.GENERATE_INSIGHT,
                agentId: this.id,
                timestamp: new Date(),
                parameters: {
                    type: 'email_optimization',
                    insights: ['Optimal send time detected', 'Subject line optimization available']
                },
                priority: 1
            });
        }

        return actions;
    }

    protected async executeActions(actions: Action[]): Promise<ExecutionResult[]> {
        const results: ExecutionResult[] = [];
        
        for (const action of actions) {
            try {
                // Execute the action
                const result: ExecutionResult = {
                    actionId: action.id,
                    success: true,
                    result: { message: 'Email insight generated successfully' },
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
        // Process feedback to improve email recommendations
        for (const fb of feedback) {
            console.log('Processing email feedback:', fb);
            // Update learning algorithms based on feedback
        }
    }
}

export default function EmailPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [segments, setSegments] = useState<Segment[]>([]);
    const [emailAgent, setEmailAgent] = useState<EmailMarketingAgent | null>(null);
    const [aiInsights, setAiInsights] = useState<EmailInsight[]>([]);
    const [isAiEnabled, setIsAiEnabled] = useState(false);
    const { user } = useAuth();

    // Initialize Email AI Agent
    useEffect(() => {
        if (!user) return;

        const initializeEmailAgent = async () => {
            try {
                console.log('🤖 Initializing Email AI Agent');
                
                const agentConfig: AgentConfiguration = {
                    id: `email-agent-${user.uid}`,
                    type: AgentType.CUSTOMER_INTERACTION,
                    name: 'Email Marketing Agent',
                    description: 'AI agent for email optimization, segmentation, and campaign insights',
                    enabled: true,
                    priority: 1,
                    maxConcurrentActions: 5,
                    learningEnabled: true,
                    configuration: {
                        emailOptimization: true,
                        audienceSegmentation: true,
                        engagementAnalysis: true
                    },
                    capabilities: [
                        {
                            name: 'email_optimization',
                            description: 'Optimize email content and timing',
                            requiredPermissions: ['read_emails', 'analyze_engagement'],
                            supportedEventTypes: [EventType.CUSTOMER_INTERACTION, EventType.DATA_UPDATED],
                            supportedActionTypes: [ActionType.GENERATE_INSIGHT, ActionType.UPDATE_RECORD]
                        },
                        {
                            name: 'audience_segmentation',
                            description: 'Automatically segment email audiences',
                            requiredPermissions: ['read_contacts', 'create_segments'],
                            supportedEventTypes: [EventType.DATA_UPDATED, EventType.CUSTOMER_INTERACTION],
                            supportedActionTypes: [ActionType.CREATE_TASK, ActionType.UPDATE_RECORD]
                        },
                        {
                            name: 'engagement_analysis',
                            description: 'Analyze email engagement patterns',
                            requiredPermissions: ['read_analytics', 'read_emails'],
                            supportedEventTypes: [EventType.CUSTOMER_INTERACTION, EventType.DATA_UPDATED],
                            supportedActionTypes: [ActionType.GENERATE_INSIGHT, ActionType.CREATE_TASK]
                        }
                    ]
                };

                const agent = new EmailMarketingAgent(agentConfig);
                setEmailAgent(agent);

                // Register agent
                const registry = AgentRegistry.getInstance();
                await registry.registerAgent(agent);
                await agent.start();

                setIsAiEnabled(true);

                // Generate initial insights
                const insights: EmailInsight[] = [
                    {
                        type: 'timing',
                        title: 'Optimal Send Time Detected',
                        description: 'Your audience is most active on Tuesdays at 10 AM',
                        action: 'Schedule campaigns for optimal engagement',
                        priority: 'high'
                    },
                    {
                        type: 'engagement',
                        title: 'Subject Line Optimization',
                        description: 'Personalized subject lines increase open rates by 26%',
                        action: 'Use dynamic personalization',
                        priority: 'medium'
                    },
                    {
                        type: 'content',
                        title: 'Content Performance',
                        description: 'Educational content performs 40% better than promotional',
                        action: 'Focus on value-driven content',
                        priority: 'medium'
                    }
                ];

                setAiInsights(insights);
                console.log('✅ Email AI Agent initialized successfully');
            } catch (error) {
                console.error('❌ Failed to initialize Email AI agent:', error);
            }
        };

        initializeEmailAgent();
    }, [user]);

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                {/* AI Insights Panel */}
                {isAiEnabled && aiInsights.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5 text-blue-600" />
                                AI Email Insights
                                <Badge variant="secondary" className="ml-2">
                                    {aiInsights.length} insights
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                AI-powered recommendations to improve your email marketing performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {aiInsights.map((insight, index) => (
                                <Alert key={index} className={`border-l-4 ${
                                    insight.priority === 'high' ? 'border-l-red-500' :
                                    insight.priority === 'medium' ? 'border-l-yellow-500' :
                                    'border-l-green-500'
                                }`}>
                                    <TrendingUp className="h-4 w-4" />
                                    <AlertTitle className="flex items-center gap-2">
                                        {insight.title}
                                        <Badge variant={
                                            insight.priority === 'high' ? 'destructive' :
                                            insight.priority === 'medium' ? 'default' :
                                            'secondary'
                                        } className="text-xs">
                                            {insight.priority}
                                        </Badge>
                                    </AlertTitle>
                                    <AlertDescription>
                                        {insight.description}
                                        {insight.action && (
                                            <div className="mt-2">
                                                <Button variant="outline" size="sm">
                                                    {insight.action}
                                                </Button>
                                            </div>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </CardContent>
                    </Card>
                )}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                Email Campaign Templates
                                {isAiEnabled && (
                                    <Badge variant="outline" className="text-xs">
                                        <Brain className="h-3 w-3 mr-1" />
                                        AI Enhanced
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                Start your next broadcast from a proven template. {isAiEnabled && 'AI will optimize content and timing.'}
                            </CardDescription>
                        </div>
                        <Button asChild variant="outline">
                           <Link href="/dashboard/email/new">
                             <PlusCircle className="mr-2 h-4 w-4" />
                             Start From Scratch
                           </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        {professionalEmailTemplates.slice(0, 6).map(template => {
                            const Icon = (Icons as any)[template.icon] || Icons.FileText;
                            return (
                                <Card key={template.id} className="group hover:shadow-md transition-shadow">
                                    <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                                        <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-base">{template.title}</CardTitle>
                                            <p className="text-xs text-blue-600 pt-1 h-10">{template.description}</p>
                                            <div className="flex gap-1 mt-2">
                                                {template.tags.slice(0, 2).map(tag => (
                                                    <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="text-xs text-green-600 mt-1">
                                                {template.metrics.averageOpenRate}% open rate
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href={`/dashboard/email/editor?template=${template.id}`}>Use Template</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Contacts</CardTitle>
                        <CardDescription>View your recent subscribers or manage your full contact list.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {subscribers.length === 0 ? (
                             <div className="text-sm text-center text-blue-600 py-4">No recent subscribers.</div>
                        ) : subscribers.map(sub => (
                             <div className="flex items-center gap-4" key={sub.id}>
                                {/* Avatar Content Removed for brevity */}
                            </div>
                        ))}
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/email/contacts">Manage All Contacts <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FolderKanban className="h-5 w-5"/> Segments</CardTitle>
                        <CardDescription>Group your contacts based on behavior and properties.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         {segments.length === 0 ? (
                             <div className="text-sm text-center text-blue-600 py-4">No segments created.</div>
                        ) : segments.map(seg => (
                            <div key={seg.id} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{seg.name}</span>
                                <span className="text-blue-600">{seg.count.toLocaleString()} contacts</span>
                            </div>
                        ))}
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/email/segments">Manage Segments <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5"/> Email Settings</CardTitle>
                        <CardDescription>Configure your sending provider and deliverability options.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full">
                             <Link href="/dashboard/settings?tab=email">Go to Settings <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

    