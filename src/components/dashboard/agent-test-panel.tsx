'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  FileText, 
  Share2, 
  Users, 
  Zap, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface TestResult {
  type: 'blog' | 'social' | 'crm' | 'automation';
  success: boolean;
  message: string;
  actionUrl?: string;
}

export default function AgentTestPanel() {
  const { user, db } = useAuth();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const runAgentTests = async () => {
    if (!user || !db) {
      toast({
        title: "Error",
        description: "Please log in to run agent tests",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // Import the necessary modules
      const { DashboardSynchronizer } = await import('@/lib/ai-agents/dashboard-synchronizer');
      const { AgentActivityMonitor } = await import('@/lib/ai-agents/agent-activity-monitor');
      
      const synchronizer = DashboardSynchronizer.getInstance();
      const monitor = AgentActivityMonitor.getInstance();

      const results: TestResult[] = [];

      // Test 1: Force generate activities for each agent type
      toast({
        title: "Testing Agents",
        description: "Generating activities for all agent types..."
      });

      const agentTypes = [
        { id: 'content', type: 'blog' as const, name: 'Content Creation Agent' },
        { id: 'social', type: 'social' as const, name: 'Social Media Agent' },
        { id: 'crm', type: 'crm' as const, name: 'CRM Agent' },
        { id: 'automation', type: 'automation' as const, name: 'Automation Agent' }
      ];

      for (const agent of agentTypes) {
        try {
          // Force generate activity for this agent
          await monitor.forceGenerateActivity(agent.id, db, user.uid);
          
          // Wait a moment for the activity to process
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          results.push({
            type: agent.type,
            success: true,
            message: `${agent.name} activity generated successfully`,
            actionUrl: agent.type === 'blog' ? '/dashboard/blog' :
                      agent.type === 'social' ? '/dashboard/social-scheduler' :
                      agent.type === 'crm' ? '/dashboard/crm' :
                      '/dashboard/automations'
          });
        } catch (error) {
          results.push({
            type: agent.type,
            success: false,
            message: `${agent.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      }

      // Test 2: Force synchronization
      toast({
        title: "Synchronizing",
        description: "Ensuring all activities are reflected in dashboard sections..."
      });

      const syncResult = await synchronizer.forceSynchronization(db, user.uid);
      
      if (syncResult.success) {
        toast({
          title: "Sync Complete",
          description: `${syncResult.syncedItems} items synchronized successfully`
        });
      } else {
        toast({
          title: "Sync Issues",
          description: `${syncResult.errors.length} errors occurred during sync`,
          variant: "destructive"
        });
      }

      // Test 3: Validate dashboard content
      const validation = await synchronizer.validateDashboardSync(db, user.uid);
      
      toast({
        title: "Validation Complete",
        description: `Found ${validation.totalAgentGenerated} AI-generated items across all sections`
      });

      // Update results with validation data
      results.forEach(result => {
        if (result.success) {
          switch (result.type) {
            case 'blog':
              result.message += ` (${validation.blogPosts} blog posts created)`;
              break;
            case 'social':
              result.message += ` (${validation.socialPosts} social posts scheduled)`;
              break;
            case 'crm':
              result.message += ` (${validation.crmActions} CRM actions performed)`;
              break;
            case 'automation':
              result.message += ` (${validation.automationActions} workflows executed)`;
              break;
          }
        }
      });

      setTestResults(results);

      // Final success message
      toast({
        title: "Agent Test Complete",
        description: "All agents have been tested. Check the results below and visit the respective sections to see the generated content.",
      });

    } catch (error) {
      console.error('Agent test failed:', error);
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'social':
        return <Share2 className="h-4 w-4" />;
      case 'crm':
        return <Users className="h-4 w-4" />;
      case 'automation':
        return <Zap className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'text-blue-600';
      case 'social':
        return 'text-green-600';
      case 'crm':
        return 'text-purple-600';
      case 'automation':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Agent Testing Panel
          <Badge variant="outline" className="ml-2">
            Development Tool
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Test all AI agents to ensure they&apos;re creating actual content in their respective dashboard sections.
          </div>

          <Button 
            onClick={runAgentTests}
            disabled={isRunning || !user || !db}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Agents...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Agent Tests
              </>
            )}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Test Results:</h4>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 ${getTypeColor(result.type)}`}>
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm capitalize">
                            {result.type} Agent
                          </span>
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {result.message}
                        </p>
                      </div>
                    </div>
                    {result.success && result.actionUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={result.actionUrl}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>What this test does:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Forces each AI agent to generate activities</li>
              <li>Creates actual content (blog posts, social posts, CRM actions, automations)</li>
              <li>Synchronizes activities with their respective dashboard sections</li>
              <li>Validates that content appears in the correct places</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}