'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { AgentRegistry } from '@/lib/ai-agents/agent-registry';
import { AgentActivityMonitor } from '@/lib/ai-agents/agent-activity-monitor';
import { AgentStatus } from '@/lib/ai-agents/types';
import {
  Bot,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  TrendingUp,
  Users,
  FileText,
  Share2,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentStatusInfo {
  id: string;
  name: string;
  type: string;
  status: AgentStatus;
  isEnabled: boolean;
  lastActivity?: Date;
  currentTask?: string;
  completedTasks: number;
  errorCount: number;
}

export default function AgentStatusTracker() {
  const { user, db } = useAuth();
  const [agents, setAgents] = useState<AgentStatusInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registry] = useState(() => AgentRegistry.getInstance());
  const [monitor] = useState(() => AgentActivityMonitor.getInstance());

  useEffect(() => {
    if (!user || !db) return;

    const updateAgentStatus = () => {
      const allAgents = registry.getAllAgents();
      const stats = monitor.getAgentStats();
      
      const agentStatusList: AgentStatusInfo[] = allAgents.map(agent => ({
        id: agent.id,
        name: agent.configuration.name,
        type: agent.type,
        status: agent.getStatus(),
        isEnabled: agent.configuration.enabled,
        lastActivity: stats[agent.id]?.lastActivity,
        completedTasks: stats[agent.id]?.successfulActivities || 0,
        errorCount: stats[agent.id]?.errorActivities || 0,
        currentTask: agent.getStatus() === AgentStatus.ACTING ? 'Executing actions...' :
                    agent.getStatus() === AgentStatus.DECIDING ? 'Making decisions...' :
                    agent.getStatus() === AgentStatus.PERCEIVING ? 'Processing data...' : undefined
      }));

      setAgents(agentStatusList);
      setIsLoading(false);
    };

    // Initial update
    updateAgentStatus();

    // Update every 2 seconds
    const interval = setInterval(updateAgentStatus, 2000);

    return () => clearInterval(interval);
  }, [user, db, registry, monitor]);

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.IDLE:
        return <Clock className="h-4 w-4 text-gray-500" />;
      case AgentStatus.PERCEIVING:
      case AgentStatus.DECIDING:
      case AgentStatus.ACTING:
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case AgentStatus.ERROR:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bot className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.IDLE:
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case AgentStatus.PERCEIVING:
      case AgentStatus.DECIDING:
      case AgentStatus.ACTING:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case AgentStatus.ERROR:
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.IDLE:
        return 'Idle';
      case AgentStatus.PERCEIVING:
        return 'Processing';
      case AgentStatus.DECIDING:
        return 'Deciding';
      case AgentStatus.ACTING:
        return 'Working';
      case AgentStatus.ERROR:
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lead_management':
        return <Users className="h-4 w-4" />;
      case 'content_creation':
        return <FileText className="h-4 w-4" />;
      case 'social_media':
        return <Share2 className="h-4 w-4" />;
      case 'automation':
        return <Zap className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date?: Date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const forceAgentActivity = async (agentId: string) => {
    if (!user || !db) return;
    
    try {
      await monitor.forceGenerateActivity(agentId, db, user.uid);
    } catch (error) {
      console.error('Failed to force agent activity:', error);
    }
  };

  const activeAgents = agents.filter(agent => agent.isEnabled);
  const workingAgents = activeAgents.filter(agent => 
    agent.status === AgentStatus.PERCEIVING || 
    agent.status === AgentStatus.DECIDING || 
    agent.status === AgentStatus.ACTING
  );
  const totalTasks = activeAgents.reduce((sum, agent) => sum + agent.completedTasks, 0);
  const totalErrors = activeAgents.reduce((sum, agent) => sum + agent.errorCount, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Activity className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading agents...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Agent Status
            <Badge variant="secondary" className="ml-2">
              {activeAgents.length} active
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {workingAgents.length} working
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {totalTasks} tasks
            </div>
            {totalErrors > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle className="h-3 w-3" />
                {totalErrors} errors
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Activity</span>
              <span className="text-xs text-gray-500">
                {workingAgents.length}/{activeAgents.length} agents working
              </span>
            </div>
            <Progress 
              value={(workingAgents.length / Math.max(activeAgents.length, 1)) * 100} 
              className="h-2"
            />
          </div>

          {/* Individual Agent Status */}
          <div className="space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  agent.isEnabled ? "bg-white" : "bg-gray-50 opacity-60"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(agent.type)}
                      <span className="font-medium text-sm">{agent.name}</span>
                    </div>
                    
                    <Badge className={cn("text-xs", getStatusColor(agent.status))}>
                      {getStatusIcon(agent.status)}
                      <span className="ml-1">{getStatusText(agent.status)}</span>
                    </Badge>

                    {!agent.isEnabled && (
                      <Badge variant="outline" className="text-xs">
                        Disabled
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500 text-right">
                      <div>Tasks: {agent.completedTasks}</div>
                      <div>Last: {formatTimeAgo(agent.lastActivity)}</div>
                    </div>
                    
                    {agent.isEnabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => forceAgentActivity(agent.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Zap className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {agent.currentTask && (
                  <div className="mt-2 text-xs text-blue-600 flex items-center">
                    <Activity className="h-3 w-3 mr-1 animate-pulse" />
                    {agent.currentTask}
                  </div>
                )}

                {agent.errorCount > 0 && (
                  <div className="mt-2 text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {agent.errorCount} error{agent.errorCount !== 1 ? 's' : ''} encountered
                  </div>
                )}
              </div>
            ))}
          </div>

          {activeAgents.length === 0 && (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No agents are currently active</p>
              <p className="text-sm text-gray-400">
                Enable agents in the AI Agents menu to see their status here
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}