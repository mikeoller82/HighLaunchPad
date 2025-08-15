'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { AgentActivityMonitor, ActivityFeedItem } from '@/lib/ai-agents/agent-activity-monitor';
import { AgentInitializer } from '@/lib/ai-agents/agent-initializer';
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  Zap,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgentActivityFeed() {
  const { user, db } = useAuth();
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monitor] = useState(() => AgentActivityMonitor.getInstance());
  const [initializer] = useState(() => AgentInitializer.getInstance());

  useEffect(() => {
    if (!user || !db) return;

    let unsubscribeFunction: (() => void) | null = null;

    const initializeAgents = async () => {
      try {
        // Initialize all agents first
        await initializer.initializeAllAgents(db, user.uid);
        
        // Start monitoring agent activities
        monitor.startMonitoring(db, user.uid);
        
        // Subscribe to activity updates
        unsubscribeFunction = monitor.subscribeToActivities((newActivities) => {
          setActivities(newActivities);
          setIsLoading(false);
        });

        // Get initial activities
        setActivities(monitor.getActivityFeed());
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize agents:', error);
        setIsLoading(false);
      }
    };

    initializeAgents();
    
    return () => {
      if (unsubscribeFunction) {
        unsubscribeFunction();
      }
      monitor.stopMonitoring();
    };
  }, [user, db, monitor, initializer]);

  const getStatusIcon = (status: 'success' | 'processing' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'success' | 'processing' | 'error') => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const forceGenerateActivity = async () => {
    if (!user || !db) return;
    
    // Generate activity for a random agent
    const agentIds = ['crm', 'content', 'social', 'automation'];
    const randomAgentId = agentIds[Math.floor(Math.random() * agentIds.length)];
    
    try {
      await monitor.forceGenerateActivity(randomAgentId, db, user.uid);
    } catch (error) {
      console.error('Failed to generate activity:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Agent Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Initializing agents...</span>
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
            <Activity className="h-5 w-5" />
            Agent Activity Feed
            {activities.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activities.length}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={forceGenerateActivity}
            className="flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Test Activity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No agent activities yet</p>
            <p className="text-sm text-gray-400">
              Your AI agents will show their activities here as they work
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200",
                    getStatusColor(activity.status)
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {activity.agentName}
                          </span>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                          >
                            {activity.agentId}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          {activity.activity}
                        </p>
                        {activity.details && (
                          <p className="text-xs text-gray-500">
                            {activity.details}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-400">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}