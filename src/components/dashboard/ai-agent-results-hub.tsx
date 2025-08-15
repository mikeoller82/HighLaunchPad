'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/auth-context';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { 
  Brain, 
  Users, 
  FileText, 
  Share2, 
  TrendingUp, 
  MessageSquare,
  BarChart3,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Download,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentResult {
  id: string;
  agentId: string;
  agentName: string;
  type: 'lead_scored' | 'content_generated' | 'social_posted' | 'report_generated' | 'customer_interaction';
  title: string;
  description: string;
  status: 'success' | 'processing' | 'error';
  timestamp: Date;
  data: any;
  metrics?: {
    score?: number;
    engagement?: number;
    conversion?: number;
  };
}

const agentIcons = {
  lead_management: Users,
  content_creation: FileText,
  social_media: Share2,
  sales_pipeline: TrendingUp,
  customer_interaction: MessageSquare,
  intelligence_reporting: BarChart3,
  automation: Zap
};

export default function AIAgentResultsHub() {
  const { user, db } = useAuth();
  const [results, setResults] = useState<AgentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedResult, setSelectedResult] = useState<AgentResult | null>(null);

  useEffect(() => {
    if (!user || !db) return;

    // Subscribe to agent activities in real-time
    const activitiesRef = collection(db, 'workspaces', user.uid, 'agentActivities');
    const activitiesQuery = query(
      activitiesRef,
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
      const activities = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          agentId: data.agentId,
          agentName: data.agentName,
          type: determineResultType(data),
          title: data.activity,
          description: data.details || '',
          status: data.status === 'success' ? 'success' : data.status === 'error' ? 'error' : 'processing',
          timestamp: data.timestamp?.toDate() || new Date(),
          data: data,
          metrics: extractMetrics(data)
        } as AgentResult;
      });

      setResults(activities);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, db]);

  const determineResultType = (data: any): AgentResult['type'] => {
    if (data.leadScore || data.qualification) return 'lead_scored';
    if (data.contentId || data.topic) return 'content_generated';
    if (data.postsCount || data.platform) return 'social_posted';
    if (data.reportType || data.reportId) return 'report_generated';
    if (data.customerId || data.escalation) return 'customer_interaction';
    return 'content_generated';
  };

  const extractMetrics = (data: any) => {
    const metrics: any = {};
    
    if (data.leadScore) metrics.score = data.leadScore;
    if (data.confidence) metrics.score = Math.round(data.confidence * 100);
    if (data.engagementRate) metrics.engagement = data.engagementRate;
    if (data.conversionRate) metrics.conversion = data.conversionRate;
    
    return Object.keys(metrics).length > 0 ? metrics : undefined;
  };

  const getStatusIcon = (status: AgentResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: AgentResult['status']) => {
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
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    if (activeTab === 'leads') return result.type === 'lead_scored';
    if (activeTab === 'content') return result.type === 'content_generated';
    if (activeTab === 'social') return result.type === 'social_posted';
    if (activeTab === 'reports') return result.type === 'report_generated';
    return true;
  });

  const handleViewDetails = async (result: AgentResult) => {
    setSelectedResult(result);
    
    // Fetch additional details if needed
    if (result.data.contentId && user && db) {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const contentRef = doc(db, 'workspaces', user.uid, 'generatedContent', result.data.contentId);
        const contentDoc = await getDoc(contentRef);
        
        if (contentDoc.exists()) {
          setSelectedResult({
            ...result,
            data: {
              ...result.data,
              fullContent: contentDoc.data()
            }
          });
        }
      } catch (error) {
        console.error('Error fetching content details:', error);
      }
    }
  };

  const handleDownloadResult = (result: AgentResult) => {
    const dataStr = JSON.stringify(result.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-result-${result.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Agent Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Clock className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading agent results...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Agent Results Hub
              <Badge variant="secondary" className="ml-2">
                {results.length} results
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {results.filter(r => r.status === 'success').length} successful
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-blue-500" />
                {results.filter(r => r.status === 'processing').length} processing
              </div>
              {results.filter(r => r.status === 'error').length > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {results.filter(r => r.status === 'error').length} errors
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Results</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredResults.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No results found</p>
                  <p className="text-sm text-gray-400">
                    AI agents will show their results here as they work
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredResults.map((result) => {
                      const IconComponent = agentIcons[result.agentId as keyof typeof agentIcons] || Brain;
                      
                      return (
                        <div
                          key={result.id}
                          className={cn(
                            "p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
                            getStatusColor(result.status)
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex-shrink-0 mt-0.5">
                                <IconComponent className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {result.title}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {result.agentName}
                                  </Badge>
                                  {getStatusIcon(result.status)}
                                </div>
                                <p className="text-sm text-gray-700 mb-2">
                                  {result.description}
                                </p>
                                
                                {result.metrics && (
                                  <div className="flex items-center gap-4 text-xs text-gray-600">
                                    {result.metrics.score && (
                                      <span>Score: {result.metrics.score}%</span>
                                    )}
                                    {result.metrics.engagement && (
                                      <span>Engagement: {result.metrics.engagement}%</span>
                                    )}
                                    {result.metrics.conversion && (
                                      <span>Conversion: {result.metrics.conversion}%</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {formatTimeAgo(result.timestamp)}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(result)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadResult(result)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Result Details Modal */}
      {selectedResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Result Details
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedResult(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Agent Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Agent:</span>
                    <span className="ml-2">{selectedResult.agentName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 capitalize">{selectedResult.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2">{selectedResult.type.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Timestamp:</span>
                    <span className="ml-2">{selectedResult.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Result Data</h4>
                <ScrollArea className="h-40">
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                    {JSON.stringify(selectedResult.data, null, 2)}
                  </pre>
                </ScrollArea>
              </div>

              {selectedResult.metrics && (
                <div>
                  <h4 className="font-medium mb-2">Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(selectedResult.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-lg font-semibold">{value}%</div>
                        <div className="text-xs text-gray-500 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}