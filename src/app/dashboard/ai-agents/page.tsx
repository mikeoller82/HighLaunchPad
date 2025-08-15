'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context';
import { AgentRegistry } from '@/lib/ai-agents/agent-registry';
import { AgentType, AgentStatus, EventType, ActionType } from '@/lib/ai-agents/types';
import { TaskExecutionService } from '@/lib/ai-agents/task-execution-service';
import { UnifiedAgentService } from '@/lib/ai-agents/unified-agent-service';
import { useAIAgentsInitialization } from '@/lib/ai-agents/initialization-hook';
import { AIAgentsDebugger } from '@/lib/ai-agents/debug-initializer';
import { 
  BrainCircuit, 
  Send, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Workflow, 
  Database, 
  BarChart3, 
  Bot,
  FileText,
  Share2,
  Zap,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { doc, onSnapshot, updateDoc, collection, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';

// Agent configurations with their tasks
const agentConfigurations = [
  {
    id: 'crm',
    type: AgentType.LEAD_MANAGEMENT,
    name: 'CRM Agent',
    description: 'Automatically captures, scores, and routes leads',
    icon: Users,
    color: 'bg-blue-500',
    tasks: [
      { id: 'score_leads', name: 'Score New Leads', description: 'Analyze and score incoming leads based on criteria', estimatedTime: '2-5 minutes' },
      { id: 'qualify_leads', name: 'Qualify Leads', description: 'Automatically qualify leads based on interactions', estimatedTime: '1-3 minutes' },
      { id: 'assign_leads', name: 'Assign Leads', description: 'Route leads to appropriate sales representatives', estimatedTime: '1 minute' },
      { id: 'detect_buying_signals', name: 'Detect Buying Signals', description: 'Identify potential purchase intent from interactions', estimatedTime: '3-7 minutes' }
    ]
  },
  {
    id: 'content',
    type: AgentType.CONTENT_CREATION,
    name: 'Content Creation Agent',
    description: 'Generates and optimizes content across platforms',
    icon: FileText,
    color: 'bg-green-500',
    tasks: [
      { id: 'generate_blog_post', name: 'Generate Blog Post', description: 'Create comprehensive, SEO-optimized blog content', estimatedTime: '10-15 minutes' },
      { id: 'create_content_calendar', name: 'Create Content Calendar', description: 'Plan content strategy and scheduling', estimatedTime: '5-10 minutes' },
      { id: 'optimize_seo', name: 'SEO Optimization', description: 'Optimize existing content for search engines', estimatedTime: '3-8 minutes' }
    ]
  },
  {
    id: 'social',
    type: AgentType.SOCIAL_MEDIA,
    name: 'Social Media Agent',
    description: 'Manages social media presence and engagement',
    icon: Share2,
    color: 'bg-purple-500',
    tasks: [
      { id: 'create_social_posts', name: 'Create Social Posts', description: 'Generate engaging social media content', estimatedTime: '3-7 minutes' },
      { id: 'schedule_posts', name: 'Schedule Posts', description: 'Plan and schedule social media posts', estimatedTime: '2-5 minutes' },
      { id: 'analyze_engagement', name: 'Analyze Engagement', description: 'Review social media performance and engagement', estimatedTime: '5-10 minutes' },
      { id: 'create_social_strategy', name: 'Create Social Strategy', description: 'Develop comprehensive social media marketing plan', estimatedTime: '15-20 minutes' }
    ]
  },
  {
    id: 'automation',
    type: AgentType.AUTOMATION,
    name: 'Automation Agent',
    description: 'Executes workflows and automated processes',
    icon: Zap,
    color: 'bg-yellow-500',
    tasks: [
      { id: 'execute_workflow', name: 'Execute Workflow', description: 'Run automated business processes', estimatedTime: '1-3 minutes' },
      { id: 'optimize_processes', name: 'Optimize Processes', description: 'Analyze and improve workflow efficiency', estimatedTime: '10-15 minutes' },
      { id: 'create_automation', name: 'Create Automation', description: 'Set up new automated workflows', estimatedTime: '5-12 minutes' }
    ]
  },
  {
    id: 'customer_interaction',
    type: AgentType.CUSTOMER_INTERACTION,
    name: 'Customer Interaction Agent',
    description: 'Handles customer communications and support',
    icon: MessageSquare,
    color: 'bg-indigo-500',
    tasks: [
      { id: 'respond_to_inquiries', name: 'Respond to Inquiries', description: 'Handle customer questions and support requests', estimatedTime: '2-5 minutes' },
      { id: 'escalate_issues', name: 'Escalate Issues', description: 'Route complex issues to appropriate team members', estimatedTime: '1-2 minutes' },
      { id: 'analyze_sentiment', name: 'Analyze Sentiment', description: 'Assess customer satisfaction and sentiment', estimatedTime: '3-7 minutes' }
    ]
  },
  {
    id: 'sales_pipeline',
    type: AgentType.SALES_PIPELINE,
    name: 'Sales Pipeline Agent',
    description: 'Manages deals and sales processes',
    icon: TrendingUp,
    color: 'bg-red-500',
    tasks: [
      { id: 'track_deals', name: 'Track Deals', description: 'Monitor deal progression and identify risks', estimatedTime: '3-8 minutes' },
      { id: 'forecast_revenue', name: 'Forecast Revenue', description: 'Predict sales performance and revenue', estimatedTime: '10-15 minutes' },
      { id: 'update_pipeline', name: 'Update Pipeline', description: 'Refresh deal stages and probabilities', estimatedTime: '2-5 minutes' }
    ]
  },
  {
    id: 'journey_orchestration',
    type: AgentType.JOURNEY_ORCHESTRATION,
    name: 'Journey Orchestration Agent',
    description: 'Orchestrates customer journeys and touchpoints',
    icon: Workflow,
    color: 'bg-teal-500',
    tasks: [
      { id: 'map_customer_journey', name: 'Map Customer Journey', description: 'Analyze and optimize customer touchpoints', estimatedTime: '15-25 minutes' },
      { id: 'trigger_touchpoints', name: 'Trigger Touchpoints', description: 'Execute personalized customer interactions', estimatedTime: '2-5 minutes' },
      { id: 'optimize_experience', name: 'Optimize Experience', description: 'Improve customer journey effectiveness', estimatedTime: '10-20 minutes' }
    ]
  },
  {
    id: 'data_integration',
    type: AgentType.DATA_INTEGRATION,
    name: 'Data Integration Agent',
    description: 'Syncs and integrates data across platforms',
    icon: Database,
    color: 'bg-gray-500',
    tasks: [
      { id: 'sync_data', name: 'Sync Data', description: 'Synchronize data across all connected platforms', estimatedTime: '5-10 minutes' },
      { id: 'validate_data', name: 'Validate Data', description: 'Check data integrity and consistency', estimatedTime: '3-8 minutes' },
      { id: 'integrate_apis', name: 'Integrate APIs', description: 'Connect new data sources and APIs', estimatedTime: '10-20 minutes' }
    ]
  },
  {
    id: 'workflow_management',
    type: AgentType.WORKFLOW_MANAGEMENT,
    name: 'Workflow Management Agent',
    description: 'Automates business processes and workflows',
    icon: Workflow,
    color: 'bg-orange-500',
    tasks: [
      { id: 'manage_tasks', name: 'Manage Tasks', description: 'Organize and prioritize workflow tasks', estimatedTime: '3-7 minutes' },
      { id: 'automate_processes', name: 'Automate Processes', description: 'Set up automated business workflows', estimatedTime: '8-15 minutes' },
      { id: 'monitor_workflows', name: 'Monitor Workflows', description: 'Track workflow performance and issues', estimatedTime: '5-10 minutes' }
    ]
  },
  {
    id: 'intelligence_reporting',
    type: AgentType.INTELLIGENCE_REPORTING,
    name: 'Intelligence & Reporting Agent',
    description: 'Generates insights and analytics reports',
    icon: BarChart3,
    color: 'bg-pink-500',
    tasks: [
      { id: 'generate_reports', name: 'Generate Reports', description: 'Create comprehensive analytics reports', estimatedTime: '10-20 minutes' },
      { id: 'analyze_performance', name: 'Analyze Performance', description: 'Review KPIs and performance metrics', estimatedTime: '8-15 minutes' },
      { id: 'predict_trends', name: 'Predict Trends', description: 'Forecast business trends and opportunities', estimatedTime: '15-25 minutes' }
    ]
  },
  {
    id: 'conversational_ai',
    type: AgentType.CONVERSATIONAL_AI,
    name: 'Conversational AI Agent',
    description: 'Powers chatbots and conversational interfaces',
    icon: Bot,
    color: 'bg-cyan-500',
    tasks: [
      { id: 'train_chatbot', name: 'Train Chatbot', description: 'Improve conversational AI responses', estimatedTime: '10-20 minutes' },
      { id: 'handle_conversations', name: 'Handle Conversations', description: 'Manage automated customer conversations', estimatedTime: '2-5 minutes' },
      { id: 'analyze_intent', name: 'Analyze Intent', description: 'Understand customer intent and context', estimatedTime: '3-8 minutes' }
    ]
  }
];

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
  taskId?: string;
}

interface TaskExecution {
  id: string;
  taskId: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  result?: any;
  error?: string;
}

export default function AIAgentsPage() {
  const { user, db } = useAuth();
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState<string>('crm');
  const [activeAgents, setActiveAgents] = useState<Record<string, boolean>>({});
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [taskExecutions, setTaskExecutions] = useState<TaskExecution[]>([]);
  const [registry] = useState(() => AgentRegistry.getInstance());
  const [unifiedService] = useState(() => UnifiedAgentService.getInstance());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the initialization hook
  const initStatus = useAIAgentsInitialization(db, user?.uid || null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Load agents and sync with Firestore - only after initialization is complete
  useEffect(() => {
    if (!user || !db || !initStatus.isInitialized) return;

    const setupAgentListeners = () => {
      try {
        // Get agent statuses after initialization
        const newStatuses: Record<string, AgentStatus> = {};
        agentConfigurations.forEach(config => {
          newStatuses[config.id] = unifiedService.getAgentStatus(config.id);
        });
        setAgentStatuses(newStatuses);
        
        console.log('✅ AI Agents listeners setup successfully');
      } catch (error) {
        console.error('❌ Failed to setup AI agents listeners:', error);
        toast({
          variant: 'destructive',
          title: 'Setup Error',
          description: 'Failed to setup AI agents listeners. Some features may not work properly.'
        });
      }
    };

    setupAgentListeners();

    // Listen to workspace changes with error handling
    const workspaceRef = doc(db, 'workspaces', user.uid);
    const unsubscribe = onSnapshot(workspaceRef, 
      (snap) => {
        if (snap.exists()) {
          setActiveAgents(snap.data().activeAgents || {});
        } else {
          console.warn('Workspace document does not exist, using empty active agents');
          setActiveAgents({});
        }
      },
      (error) => {
        console.error('Error listening to workspace changes:', error);
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: 'Failed to sync agent status. Please refresh the page.'
        });
      }
    );

    // Load chat messages with error handling - delay to ensure collection exists
    setTimeout(() => {
      try {
        const messagesRef = collection(db, 'workspaces', user.uid, 'agentChats');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));
        const unsubscribeMessages = onSnapshot(messagesQuery, 
          (snapshot) => {
            try {
              const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
              })) as ChatMessage[];
              setChatMessages(messages.reverse());
            } catch (error) {
              console.error('Error processing chat messages:', error);
              setChatMessages([]);
            }
          },
          (error) => {
            console.error('Error listening to chat messages:', error);
            // Check if it's a missing index error
            if (error.message.includes('FAILED_PRECONDITION')) {
              toast({
                variant: 'destructive',
                title: 'Database Index Missing',
                description: 'Please deploy Firestore indexes: firebase deploy --only firestore:indexes'
              });
            }
            setChatMessages([]);
          }
        );
        
        // Store unsubscribe function for cleanup
        return () => unsubscribeMessages();
      } catch (error) {
        console.error('Error setting up chat messages listener:', error);
      }
    }, 1000); // 1 second delay to ensure initialization is complete

    return () => {
      unsubscribe();
      // Note: unsubscribeMessages is defined inside setTimeout, so we can't access it here
      // This is a potential memory leak that needs to be fixed
    };
  }, [user, db, registry, unifiedService, toast, initStatus.isInitialized]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleAgent = async (agentId: string, enabled: boolean) => {
    if (!user || !db) return;

    try {
      // Use unified service for consistent agent management
      await unifiedService.toggleAgent(db, user.uid, agentId, enabled);

      // Update local status
      setAgentStatuses(prev => ({
        ...prev,
        [agentId]: unifiedService.getAgentStatus(agentId)
      }));

      toast({
        title: enabled ? 'Agent Activated' : 'Agent Deactivated',
        description: `${agentConfigurations.find(a => a.id === agentId)?.name} has been ${enabled ? 'activated' : 'deactivated'}.`
      });
    } catch (error) {
      console.error('Error toggling agent:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to toggle agent status.'
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !db) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Add to Firestore
    const messagesRef = collection(db, 'workspaces', user.uid, 'agentChats');
    await addDoc(messagesRef, {
      ...message,
      timestamp: Timestamp.fromDate(message.timestamp)
    });

    const userMessage = inputMessage;
    setInputMessage('');

    // Get intelligent agent response using unified service
    try {
      const agentResponse = await unifiedService.sendMessageToAgent(
        db, 
        user.uid, 
        selectedAgent, 
        userMessage
      );

      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: agentResponse,
        timestamp: new Date(),
        agentId: selectedAgent
      };

      await addDoc(messagesRef, {
        ...response,
        timestamp: Timestamp.fromDate(response.timestamp)
      });
    } catch (error) {
      console.error('Error getting agent response:', error);
      
      // Fallback response
      const agentConfig = agentConfigurations.find(a => a.id === selectedAgent);
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: `Hello! I'm the ${agentConfig?.name}. I can help you with various tasks. Would you like me to suggest some recommended tasks for you?`,
        timestamp: new Date(),
        agentId: selectedAgent
      };

      await addDoc(messagesRef, {
        ...fallbackResponse,
        timestamp: Timestamp.fromDate(fallbackResponse.timestamp)
      });
    }
  };

  const executeTask = async (taskId: string, agentId: string) => {
    if (!user || !db) return;

    const agent = registry.getAgent(agentId);
    if (!agent) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Agent not found or not active.'
      });
      return;
    }

    const execution: TaskExecution = {
      id: Date.now().toString(),
      taskId,
      agentId,
      status: 'running',
      startTime: new Date()
    };

    setTaskExecutions(prev => [...prev, execution]);

    // Add system message
    const agentConfig = agentConfigurations.find(a => a.id === agentId);
    const task = agentConfig?.tasks.find(t => t.id === taskId);
    
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `🚀 Starting task: ${task?.name}...`,
      timestamp: new Date(),
      agentId,
      taskId
    };

    const messagesRef = collection(db, 'workspaces', user.uid, 'agentChats');
    await addDoc(messagesRef, {
      ...systemMessage,
      timestamp: Timestamp.fromDate(systemMessage.timestamp)
    });

    try {
      // Use TaskExecutionService for proper agent integration
      const taskService = TaskExecutionService.getInstance();
      // For now, pass undefined for userApiKey to use environment variable
      const result = await taskService.executeTask(db, user.uid, taskId, agentId, undefined, undefined);

      // Update execution status
      setTaskExecutions(prev => 
        prev.map(exec => 
          exec.id === execution.id 
            ? { ...exec, status: 'completed', endTime: new Date(), result: result.result }
            : exec
        )
      );

      // Add completion message with more detailed feedback
      const completionMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: `✅ Task "${task?.name}" completed successfully! ${getTaskCompletionMessage(taskId, agentId)}`,
        timestamp: new Date(),
        agentId,
        taskId
      };

      await addDoc(messagesRef, {
        ...completionMessage,
        timestamp: Timestamp.fromDate(completionMessage.timestamp)
      });

      toast({
        title: 'Task Completed',
        description: `${task?.name} has been completed successfully.`
      });

    } catch (error) {
      setTaskExecutions(prev => 
        prev.map(exec => 
          exec.id === execution.id 
            ? { ...exec, status: 'failed', endTime: new Date(), error: error instanceof Error ? error.message : 'Unknown error' }
            : exec
        )
      );

      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'system',
        content: `❌ Task "${task?.name}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        agentId,
        taskId
      };

      await addDoc(messagesRef, {
        ...errorMessage,
        timestamp: Timestamp.fromDate(errorMessage.timestamp)
      });

      toast({
        variant: 'destructive',
        title: 'Task Failed',
        description: `${task?.name} failed to complete.`
      });
    }
  };

  // Get contextual completion messages for different tasks
  const getTaskCompletionMessage = (taskId: string, agentId: string): string => {
    const messages: Record<string, string> = {
      'score_leads': 'All leads have been scored and prioritized in your CRM.',
      'qualify_leads': 'Lead qualification has been updated based on latest interactions.',
      'assign_leads': 'Leads have been automatically assigned to appropriate team members.',
      'detect_buying_signals': 'Buying signals detected and flagged for follow-up.',
      'generate_blog_post': 'New blog post has been created and saved to your content library.',
      'create_content_calendar': 'Content calendar has been generated for the next 30 days.',
      'create_social_posts': 'Social media posts have been created and are ready for review.',
      'schedule_posts': 'Posts have been scheduled across your connected social platforms.',
      'execute_workflow': 'Workflow has been executed and all tasks completed.',
      'track_deals': 'Deal pipeline has been updated with latest progress and risk assessments.',
      'sync_data': 'Data synchronization completed across all connected platforms.',
      'generate_reports': 'Analytics report has been generated and is available in your dashboard.'
    };
    
    return messages[taskId] || 'The results have been synced with your workspace.';
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.IDLE: return 'bg-gray-500';
      case AgentStatus.PERCEIVING:
      case AgentStatus.DECIDING:
      case AgentStatus.ACTING: return 'bg-green-500';
      case AgentStatus.LEARNING: return 'bg-blue-500';
      case AgentStatus.ERROR: return 'bg-red-500';
      case AgentStatus.DISABLED: return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const selectedAgentConfig = agentConfigurations.find(a => a.id === selectedAgent);
  const isAgentActive = activeAgents[selectedAgent] ?? false;

  // Show initialization status
  if (initStatus.isInitializing) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 animate-pulse" />
              Initializing AI Agents
            </CardTitle>
            <CardDescription>
              Setting up your workspace for AI agents...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm">{initStatus.progress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Debug function to identify the exact issue
  const runDebugTest = async () => {
    if (!user || !db) return;
    
    setDebugInfo('Running debug test...');
    try {
      const debugInstance = AIAgentsDebugger.getInstance();
      const debugInfo = await debugInstance.debugWorkspace(db, user.uid);
      
      if (debugInfo.errors.length === 0) {
        setDebugInfo('✅ Debug test passed - Firestore access is working');
      } else {
        setDebugInfo(`❌ Debug test found issues: ${debugInfo.errors.join(', ')}`);
      }
    } catch (error) {
      setDebugInfo(`❌ Debug test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Show error state
  if (initStatus.error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Initialization Failed
            </CardTitle>
            <CardDescription>
              Failed to initialize AI agents workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-red-600">{initStatus.error}</p>
              
              {debugInfo && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-mono">{debugInfo}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={runDebugTest}
                  variant="outline"
                  size="sm"
                  disabled={!user || !db}
                >
                  Run Debug Test
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="flex-1"
                  variant="outline"
                >
                  Retry Initialization
                </Button>
              </div>
              
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">Common Solutions:</p>
                <ul className="space-y-1">
                  <li>• Check Firebase project configuration</li>
                  <li>• Verify Firestore rules are deployed</li>
                  <li>• Ensure user authentication is working</li>
                  <li>• Check browser console for detailed errors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Initialization Success Banner */}
      {initStatus.isInitialized && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">AI Agents Ready</span>
              <span className="text-xs text-green-600">• Workspace initialized successfully</span>
            </div>
            <Button 
              onClick={runDebugTest}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Debug Test
            </Button>
          </div>
          {debugInfo && (
            <div className="mt-2 p-2 bg-white rounded border text-xs font-mono">
              {debugInfo}
            </div>
          )}
        </div>
      )}
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agent Selection Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                AI Agents
              </CardTitle>
              <CardDescription>
                Select an agent to interact with
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2 p-4">
                  {agentConfigurations.map((agent) => {
                    const IconComponent = agent.icon;
                    const isActive = activeAgents[agent.id] ?? false;
                    const status = agentStatuses[agent.id] || AgentStatus.IDLE;
                    
                    return (
                      <div
                        key={agent.id}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all duration-200",
                          selectedAgent === agent.id
                            ? "bg-blue-50 border-blue-200 shadow-sm"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        )}
                        onClick={() => setSelectedAgent(agent.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1 rounded", agent.color, "text-white")}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{agent.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div 
                                  className={cn("w-2 h-2 rounded-full", getStatusColor(status))}
                                  title={`Status: ${status}`}
                                />
                                <Badge 
                                  variant={isActive ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {agent.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          {agent.tasks.length} available tasks
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="chat" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat & Tasks</TabsTrigger>
              <TabsTrigger value="tasks">Recommended Tasks</TabsTrigger>
              <TabsTrigger value="settings">Agent Settings</TabsTrigger>
            </TabsList>

            {/* Chat & Tasks Tab */}
            <TabsContent value="chat" className="h-full mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                {/* Chat Interface */}
                <div className="lg:col-span-2">
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {selectedAgentConfig && (
                            <>
                              <div className={cn("p-2 rounded-lg", selectedAgentConfig.color, "text-white")}>
                                <selectedAgentConfig.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{selectedAgentConfig.name}</CardTitle>
                                <CardDescription>{selectedAgentConfig.description}</CardDescription>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded-full", getStatusColor(agentStatuses[selectedAgent] || AgentStatus.IDLE))} />
                          <Badge variant={isAgentActive ? "default" : "secondary"}>
                            {isAgentActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0">
                      {/* Messages */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {chatMessages
                            .filter(msg => !msg.agentId || msg.agentId === selectedAgent)
                            .map((message) => (
                            <div
                              key={message.id}
                              className={cn(
                                "flex",
                                message.type === 'user' ? 'justify-end' : 'justify-start'
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                                  message.type === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : message.type === 'agent'
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                )}
                              >
                                <div>{message.content}</div>
                                <div className={cn(
                                  "text-xs mt-1 opacity-70",
                                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                )}>
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>
                      
                      {/* Input */}
                      <div className="p-4 border-t">
                        {!isAgentActive ? (
                          <div className="text-center py-4">
                            <p className="text-gray-500 mb-3">Agent is not active. Activate it to start chatting.</p>
                            <Button 
                              onClick={() => toggleAgent(selectedAgent, true)}
                              className="gap-2"
                            >
                              <Play className="h-4 w-4" />
                              Activate Agent
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              placeholder="Type your message..."
                              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <Button onClick={sendMessage} size="icon">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Tasks */}
                <div className="lg:col-span-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Tasks</CardTitle>
                      <CardDescription>
                        Execute common tasks instantly
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3">
                          {selectedAgentConfig?.tasks.map((task) => {
                            const execution = taskExecutions.find(e => e.taskId === task.id && e.agentId === selectedAgent);
                            const isRunning = execution?.status === 'running';
                            
                            return (
                              <div key={task.id} className="p-3 border rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm">{task.name}</h4>
                                    <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">⏱️ {task.estimatedTime}</p>
                                  </div>
                                  {execution && (
                                    <div className="ml-2">
                                      {execution.status === 'running' && <Clock className="h-4 w-4 text-blue-500 animate-spin" />}
                                      {execution.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                      {execution.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  className="w-full"
                                  onClick={() => executeTask(task.id, selectedAgent)}
                                  disabled={!isAgentActive || isRunning}
                                >
                                  {isRunning ? 'Running...' : 'Execute'}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Recommended Tasks Tab */}
            <TabsContent value="tasks" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Tasks for {selectedAgentConfig?.name}</CardTitle>
                  <CardDescription>
                    Based on your current workspace activity and data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedAgentConfig?.tasks.map((task) => {
                      const execution = taskExecutions.find(e => e.taskId === task.id && e.agentId === selectedAgent);
                      const isRunning = execution?.status === 'running';
                      
                      return (
                        <Card key={task.id} className="relative">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base">{task.name}</CardTitle>
                              {execution && (
                                <div>
                                  {execution.status === 'running' && <Clock className="h-4 w-4 text-blue-500 animate-spin" />}
                                  {execution.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                  {execution.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                                </div>
                              )}
                            </div>
                            <CardDescription>{task.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Estimated time:</span> {task.estimatedTime}
                              </div>
                              <Button
                                className="w-full"
                                onClick={() => executeTask(task.id, selectedAgent)}
                                disabled={!isAgentActive || isRunning}
                              >
                                {isRunning ? 'Running...' : 'Execute Task'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Agent Settings Tab */}
            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Agent Settings
                  </CardTitle>
                  <CardDescription>
                    Configure and manage your AI agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {agentConfigurations.map((agent) => {
                      const IconComponent = agent.icon;
                      const isActive = activeAgents[agent.id] ?? false;
                      const status = agentStatuses[agent.id] || AgentStatus.IDLE;
                      
                      return (
                        <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={cn("p-2 rounded-lg", agent.color, "text-white")}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{agent.name}</h3>
                              <p className="text-sm text-gray-600">{agent.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={cn("w-2 h-2 rounded-full", getStatusColor(status))} />
                                <span className="text-xs text-gray-500">Status: {status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={isActive ? "default" : "secondary"}>
                              {isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button
                              variant={isActive ? "destructive" : "default"}
                              size="sm"
                              onClick={() => toggleAgent(agent.id, !isActive)}
                            >
                              {isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}