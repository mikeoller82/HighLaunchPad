'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { doc, updateDoc } from 'firebase/firestore';
import { useOptimizedDocument } from '@/hooks/use-optimized-firestore';
import { WorkspaceData } from '@/lib/ai-agents/workspace-initializer';
import { AgentRegistry } from '@/lib/ai-agents/agent-registry';
import { AgentType, AgentStatus } from '@/lib/ai-agents/types';
import { 
  BrainCircuit, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Workflow, 
  Database, 
  BarChart3, 
  Bot,
  Settings,
  FileText,
  Share2,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const agentTypeIcons = {
  [AgentType.LEAD_MANAGEMENT]: Users,
  [AgentType.CUSTOMER_INTERACTION]: MessageSquare,
  [AgentType.SALES_PIPELINE]: TrendingUp,
  [AgentType.JOURNEY_ORCHESTRATION]: Workflow,
  [AgentType.DATA_INTEGRATION]: Database,
  [AgentType.WORKFLOW_MANAGEMENT]: Workflow,
  [AgentType.INTELLIGENCE_REPORTING]: BarChart3,
  [AgentType.CONVERSATIONAL_AI]: Bot,
  [AgentType.CONTENT_CREATION]: FileText,
  [AgentType.SOCIAL_MEDIA]: Share2,
  [AgentType.AUTOMATION]: Zap,
};

const agentConfigurations = [
  {
    id: 'crm',
    type: AgentType.LEAD_MANAGEMENT,
    name: 'CRM Agent',
    description: 'Automatically captures, scores, and routes leads',
    features: ['Lead Scoring', 'Auto-Assignment', 'Follow-up Scheduling'],
    pipelineFeatures: ['crm', 'forms', 'automations']
  },
  {
    id: 'content',
    type: AgentType.CONTENT_CREATION,
    name: 'Content Creation Agent',
    description: 'Generates and optimizes content across platforms',
    features: ['Blog Writing', 'SEO Optimization', 'Content Planning'],
    pipelineFeatures: ['content', 'social-scheduler', 'email']
  },
  {
    id: 'social',
    type: AgentType.SOCIAL_MEDIA,
    name: 'Social Media Agent',
    description: 'Manages social media presence and engagement',
    features: ['Post Scheduling', 'Engagement Analysis', 'Content Curation'],
    pipelineFeatures: ['social-scheduler', 'content', 'analytics']
  },
  {
    id: 'automation',
    type: AgentType.AUTOMATION,
    name: 'Automation Agent',
    description: 'Executes workflows and automated processes',
    features: ['Workflow Execution', 'Task Automation', 'Process Optimization'],
    pipelineFeatures: ['automations', 'email', 'crm']
  },
  {
    id: 'customer_interaction',
    type: AgentType.CUSTOMER_INTERACTION,
    name: 'Customer Interaction Agent',
    description: 'Handles customer communications and support',
    features: ['Chat Support', 'Email Responses', 'Ticket Management'],
    pipelineFeatures: ['conversations', 'email', 'crm']
  },
  {
    id: 'sales_pipeline',
    type: AgentType.SALES_PIPELINE,
    name: 'Sales Pipeline Agent',
    description: 'Manages deals and sales processes',
    features: ['Deal Tracking', 'Pipeline Management', 'Revenue Forecasting'],
    pipelineFeatures: ['crm', 'automations', 'email']
  },
  {
    id: 'journey_orchestration',
    type: AgentType.JOURNEY_ORCHESTRATION,
    name: 'Journey Orchestration Agent',
    description: 'Orchestrates customer journeys and touchpoints',
    features: ['Journey Mapping', 'Touchpoint Optimization', 'Experience Personalization'],
    pipelineFeatures: ['automations', 'email', 'social-scheduler']
  },
  {
    id: 'data_integration',
    type: AgentType.DATA_INTEGRATION,
    name: 'Data Integration Agent',
    description: 'Syncs and integrates data across platforms',
    features: ['Data Sync', 'API Integration', 'Data Validation'],
    pipelineFeatures: ['crm', 'forms', 'automations']
  },
  {
    id: 'workflow_management',
    type: AgentType.WORKFLOW_MANAGEMENT,
    name: 'Workflow Management Agent',
    description: 'Automates business processes and workflows',
    features: ['Process Automation', 'Task Management', 'Workflow Optimization'],
    pipelineFeatures: ['automations', 'forms', 'email']
  },
  {
    id: 'intelligence_reporting',
    type: AgentType.INTELLIGENCE_REPORTING,
    name: 'Intelligence & Reporting Agent',
    description: 'Generates insights and analytics reports',
    features: ['Analytics Dashboard', 'Performance Reports', 'Predictive Insights'],
    pipelineFeatures: ['crm', 'email', 'social-scheduler']
  },
  {
    id: 'conversational_ai',
    type: AgentType.CONVERSATIONAL_AI,
    name: 'Conversational AI Agent',
    description: 'Powers chatbots and conversational interfaces',
    features: ['Natural Language Processing', 'Intent Recognition', 'Response Generation'],
    pipelineFeatures: ['conversations', 'crm', 'forms']
  }
];

interface AIAgentsMenuProps {
  isCollapsed?: boolean;
}

export default function AIAgentsMenu({ isCollapsed = false }: AIAgentsMenuProps) {
  const { user, db } = useAuth();
  const [activeAgents, setActiveAgents] = useState<Record<string, boolean>>({});
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [registry, setRegistry] = useState<any>(null);

  // Use optimized Firestore hook for workspace data
  const workspaceRef = user && db ? doc(db, 'workspaces', user.uid) : null;
  const { data: workspaceData } = useOptimizedDocument<WorkspaceData>(
    workspaceRef,
    `workspace-agents-${user?.uid}`,
    { enabled: !!user && !!db }
  );

  useEffect(() => {
    if (workspaceData) {
      setActiveAgents(workspaceData.activeAgents || {});
    }
  }, [workspaceData]);

  // Initialize registry only when menu is expanded
  useEffect(() => {
    if (!isExpanded || !user || !db || registry) return;

    const initializeRegistry = async () => {
      try {
        const agentRegistry = AgentRegistry.getInstance();
        setRegistry(agentRegistry);
        
        await agentRegistry.loadActiveAgents(db, user.uid);
        
        // Get agent statuses
        const newStatuses: Record<string, AgentStatus> = {};
        
        agentConfigurations.forEach(config => {
          const agent = agentRegistry.getAgent(config.id);
          newStatuses[config.id] = agent?.getStatus() || AgentStatus.IDLE;
        });
        
        setAgentStatuses(newStatuses);
      } catch (error) {
        console.warn('Error loading agents in menu:', error);
      }
    };

    initializeRegistry();
  }, [isExpanded, user, db, registry]);

  const toggleAgent = async (agentId: string, newValue: boolean) => {
    if (!user || !db) return;

    const workspaceRef = doc(db, 'workspaces', user.uid);
    
    try {
      await updateDoc(workspaceRef, { 
        [`activeAgents.${agentId}`]: newValue 
      });

      // Start/stop the agent in the registry
      if (newValue) {
        await registry.startAgent(agentId);
      } else {
        await registry.stopAgent(agentId);
      }
    } catch (error) {
      console.error('Error toggling agent:', error);
    }
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.IDLE:
        return 'bg-gray-500';
      case AgentStatus.PERCEIVING:
      case AgentStatus.DECIDING:
      case AgentStatus.ACTING:
        return 'bg-green-500';
      case AgentStatus.LEARNING:
        return 'bg-blue-500';
      case AgentStatus.ERROR:
        return 'bg-red-500';
      case AgentStatus.DISABLED:
        return 'bg-gray-400';
      default:
        return 'bg-gray-500';
    }
  };

  const activeAgentCount = Object.values(activeAgents).filter(Boolean).length;

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center space-y-2 p-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <BrainCircuit className="h-5 w-5" />
          {activeAgentCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
            >
              {activeAgentCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <Button
          variant="ghost"
          className="w-full justify-between p-2 h-auto"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            <span className="font-medium">AI Agents</span>
            {activeAgentCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {activeAgentCount}
              </Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        
        {isExpanded && (
          <div className="space-y-2">
            <div className="pl-4 space-y-3">
              {agentConfigurations.map((agent) => {
                const IconComponent = agentTypeIcons[agent.type];
                const isActive = activeAgents[agent.id] ?? false;
                const status = agentStatuses[agent.id] || AgentStatus.IDLE;
                
                return (
                  <div
                    key={agent.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-200",
                      isActive 
                        ? "bg-blue-50 border-blue-200 shadow-sm" 
                        : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                        <div className="flex items-center gap-2">
                          <Label 
                            htmlFor={agent.id} 
                            className="text-sm font-medium cursor-pointer"
                          >
                            {agent.name}
                          </Label>
                          <div 
                            className={cn(
                              "w-2 h-2 rounded-full",
                              getStatusColor(status)
                            )}
                            title={`Status: ${status}`}
                          />
                        </div>
                      </div>
                      <Switch
                        id={agent.id}
                        checked={isActive}
                        onCheckedChange={(checked) => toggleAgent(agent.id, checked)}
                      />
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      {agent.description}
                    </p>
                    
                    {isActive && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {agent.features.map((feature) => (
                            <Badge 
                              key={feature} 
                              variant="outline" 
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Connected to:</span>{' '}
                          {agent.pipelineFeatures.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Navigate to AI agents unified interface
                    window.location.href = '/dashboard/ai-agents';
                  }}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Open AI Agents
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}