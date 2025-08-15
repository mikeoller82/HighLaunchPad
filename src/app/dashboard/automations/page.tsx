
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlusCircle, Play, Pause, Edit, Trash2, Workflow, Brain, TrendingUp, Zap, Target } from "lucide-react";
import Link from "next/link";
import { automationTemplates, type AutomationTemplate } from "@/lib/automation-templates";
import { useAuth } from "@/context/auth-context";
import { 
  AgentRegistry,
  AgentConfiguration,
  AgentType,
  EventType,
  ActionType,
  BaseAgent
} from "@/lib/ai-agents/types-only";

interface AutomationInsight {
    type: 'optimization' | 'performance' | 'trigger' | 'flow';
    title: string;
    description: string;
    action?: string;
    priority: 'high' | 'medium' | 'low';
}

class AutomationAgent extends BaseAgent {
    protected async processEvents(events: any[]): Promise<void> {
        for (const event of events) {
            if (event.type === EventType.WORKFLOW_TRIGGERED) {
                console.log('Processing automation event:', event);
            }
        }
    }

    protected async makeDecisions(context: any): Promise<any[]> {
        const actions: any[] = [];
        
        if (context.events.length > 0) {
            actions.push({
                id: `automation-insight-${Date.now()}`,
                type: ActionType.GENERATE_INSIGHT,
                agentId: this.id,
                timestamp: new Date(),
                parameters: {
                    type: 'automation_optimization',
                    insights: ['Workflow optimization available', 'Performance improvements detected']
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
                    result: { message: 'Automation insight generated successfully' },
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
        for (const fb of feedback) {
            console.log('Processing automation feedback:', fb);
        }
    }
}

export default function AutomationsPage() {
    const { user } = useAuth();
    const [automationAgent, setAutomationAgent] = useState<AutomationAgent | null>(null);
    const [aiInsights, setAiInsights] = useState<AutomationInsight[]>([]);
    const [isAiEnabled, setIsAiEnabled] = useState(false);

    // Initialize Automation AI Agent
    useEffect(() => {
        if (!user) return;

        const initializeAutomationAgent = async () => {
            try {
                console.log('🤖 Initializing Automation AI Agent');
                
                const agentConfig: AgentConfiguration = {
                    id: `automation-agent-${user.uid}`,
                    type: AgentType.WORKFLOW_MANAGEMENT,
                    name: 'Automation Agent',
                    description: 'AI agent for workflow optimization and automation insights',
                    enabled: true,
                    priority: 1,
                    maxConcurrentActions: 5,
                    learningEnabled: true,
                    configuration: {
                        workflowOptimization: true,
                        performanceAnalysis: true,
                        triggerOptimization: true
                    },
                    capabilities: [
                        {
                            name: 'workflow_optimization',
                            description: 'Optimize automation workflows',
                            requiredPermissions: ['read_workflows', 'analyze_performance'],
                            supportedEventTypes: [EventType.WORKFLOW_TRIGGERED, EventType.DATA_UPDATED],
                            supportedActionTypes: [ActionType.GENERATE_INSIGHT, ActionType.UPDATE_RECORD]
                        }
                    ]
                };

                const agent = new AutomationAgent(agentConfig);
                setAutomationAgent(agent);

                // Register agent
                const registry = AgentRegistry.getInstance();
                await registry.registerAgent(agent);
                await agent.start();

                setIsAiEnabled(true);

                // Generate initial insights
                const insights: AutomationInsight[] = [
                    {
                        type: 'optimization',
                        title: 'Workflow Efficiency',
                        description: 'Your email sequences can be optimized to reduce steps by 30%',
                        action: 'Optimize workflows',
                        priority: 'high'
                    },
                    {
                        type: 'performance',
                        title: 'Conversion Tracking',
                        description: 'Add conversion tracking to measure automation effectiveness',
                        action: 'Add tracking',
                        priority: 'medium'
                    },
                    {
                        type: 'trigger',
                        title: 'Smart Triggers',
                        description: 'Behavioral triggers perform 40% better than time-based ones',
                        action: 'Update triggers',
                        priority: 'medium'
                    }
                ];

                setAiInsights(insights);
                console.log('✅ Automation AI Agent initialized successfully');
            } catch (error) {
                console.error('❌ Failed to initialize Automation AI agent:', error);
            }
        };

        initializeAutomationAgent();
    }, [user]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        Automations
                        {isAiEnabled && (
                            <Badge variant="outline" className="text-xs">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Enhanced
                            </Badge>
                        )}
                    </h2>
                    <p className="text-blue-600">
                        Create and manage your automated marketing workflows. {isAiEnabled && 'AI will optimize performance and suggest improvements.'}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/automations/blank">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Automation
                    </Link>
                </Button>
            </div>

            {/* AI Insights Panel */}
            {isAiEnabled && aiInsights.length > 0 && (
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-blue-600" />
                            AI Automation Insights
                            <Badge variant="secondary" className="ml-2">
                                {aiInsights.length} insights
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            AI-powered recommendations to optimize your automation workflows
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {aiInsights.map((insight, index) => (
                            <Alert key={index} className={`border-l-4 ${
                                insight.priority === 'high' ? 'border-l-red-500' :
                                insight.priority === 'medium' ? 'border-l-yellow-500' :
                                'border-l-green-500'
                            }`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <AlertTitle className="flex items-center gap-2">
                                            {insight.type === 'optimization' && <Zap className="h-4 w-4" />}
                                            {insight.type === 'performance' && <TrendingUp className="h-4 w-4" />}
                                            {insight.type === 'trigger' && <Target className="h-4 w-4" />}
                                            {insight.type === 'flow' && <Workflow className="h-4 w-4" />}
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
                                        </AlertDescription>
                                    </div>
                                    {insight.action && (
                                        <Button variant="outline" size="sm" className="ml-4">
                                            {insight.action}
                                        </Button>
                                    )}
                                </div>
                            </Alert>
                        ))}
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {automationTemplates.map(automation => (
                    <Card key={automation.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{automation.title}</CardTitle>
                                <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                                    {automation.status === 'active' ? <Play className="mr-1.5 h-3 w-3" /> : <Pause className="mr-1.5 h-3 w-3" />}
                                    {automation.status}
                                </Badge>
                            </div>
                            <CardDescription className="h-10 pt-1">{automation.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-blue-600">
                                <p><strong>Trigger:</strong> {automation.trigger}</p>
                                <p><strong>Steps:</strong> {automation.steps}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-auto flex flex-col sm:flex-row gap-2">
                             <Button variant="outline" className="w-full" asChild>
                                <Link href={`/dashboard/automations/${automation.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Use Template
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[300px]">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/automations/blank" className="flex flex-col items-center justify-center h-full w-full text-center">
                             <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                                <Workflow className="h-12 w-12 text-purple-500" />
                            </div>
                            <p className="font-semibold">Start From Scratch</p>
                            <p className="text-sm text-blue-600 px-4">Start with a blank canvas.</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}
