'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth-context';
import { 
  collection, 
  query, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { useOptimizedCollection } from '@/hooks/use-optimized-firestore';
import {
  FileText,
  Share2,
  Users,
  Zap,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BlogDraft {
  id: string;
  title?: string;
  content?: string;
  status?: string;
  createdAt?: Timestamp;
  agentGenerated?: boolean;
}

interface SocialPost {
  id: string;
  caption?: string;
  status?: string;
  createdAt?: Timestamp;
  agentGenerated?: boolean;
}

interface AgentResult {
  id: string;
  type: 'blog' | 'social' | 'crm' | 'automation' | 'email';
  title: string;
  description: string;
  status: 'draft' | 'scheduled' | 'completed' | 'active';
  createdAt: Date;
  agentGenerated: boolean;
  data?: any;
}

export default function AgentResultsDisplay() {
  const { user, db } = useAuth();
  const [results, setResults] = useState<{
    blog: AgentResult[];
    social: AgentResult[];
    crm: AgentResult[];
    automation: AgentResult[];
  }>({
    blog: [],
    social: [],
    crm: [],
    automation: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Use optimized Firestore hooks for different collections
  const blogQuery = user && db ? query(
    collection(db, 'workspaces', user.uid, 'blog_drafts'),
    orderBy('createdAt', 'desc'),
    limit(10)
  ) : null;

  const socialQuery = user && db ? query(
    collection(db, 'workspaces', user.uid, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(10)
  ) : null;

  const { data: blogData } = useOptimizedCollection<BlogDraft>(
    blogQuery,
    `blog-results-${user?.uid}`,
    { enabled: !!user && !!db }
  );

  const { data: socialData } = useOptimizedCollection<SocialPost>(
    socialQuery,
    `social-results-${user?.uid}`,
    { enabled: !!user && !!db }
  );

  useEffect(() => {
    if (blogData) {
      const blogResults = blogData.map(doc => ({
        id: doc.id,
        type: 'blog' as const,
        title: doc.title || 'Untitled Blog Post',
        description: doc.content?.substring(0, 150) + '...' || 'No content',
        status: (doc.status as AgentResult['status']) || 'draft',
        createdAt: (doc.createdAt as Timestamp)?.toDate() || new Date(),
        agentGenerated: doc.agentGenerated || false,
        data: doc
      }));
      setResults(prev => ({ ...prev, blog: blogResults }));
    }
  }, [blogData]);

  useEffect(() => {
    if (socialData) {
      const socialResults = socialData.map(doc => ({
        id: doc.id,
        type: 'social' as const,
        title: 'Social Media Post',
        description: doc.caption?.substring(0, 100) + '...' || 'No caption',
        status: (doc.status as AgentResult['status']) || 'draft',
        createdAt: (doc.createdAt as Timestamp)?.toDate() || new Date(),
        agentGenerated: doc.agentGenerated || false,
        data: doc
      }));
      setResults(prev => ({ ...prev, social: socialResults }));
    }
  }, [socialData]);

  useEffect(() => {
    // Set loading to false when we have data or when user/db is not available
    if (!user || !db) {
      setIsLoading(false);
      return;
    }
    
    // Set loading to false once we have initial data
    if (blogData !== undefined || socialData !== undefined) {
      setIsLoading(false);
    }
  }, [user, db, blogData, socialData]);

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
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const ResultCard = ({ result }: { result: AgentResult }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              {getTypeIcon(result.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium truncate">{result.title}</h4>
                {result.agentGenerated && (
                  <Badge variant="outline" className="text-xs">
                    AI Generated
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">{result.description}</p>
              <div className="flex items-center space-x-2">
                <Badge className={cn("text-xs", getStatusColor(result.status))}>
                  {result.status}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(result.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-1 ml-2">
            {result.type === 'blog' && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/blog/${result.id}`}>
                  <Eye className="h-3 w-3" />
                </Link>
              </Button>
            )}
            {result.type === 'social' && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/social-scheduler">
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Agent Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Clock className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading results...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalResults = results.blog.length + results.social.length + results.crm.length + results.automation.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Agent Results
          {totalResults > 0 && (
            <Badge variant="secondary" className="ml-2">
              {totalResults}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalResults === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No agent results yet</p>
            <p className="text-sm text-gray-400">
              Results from your AI agents will appear here as they work
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
              <TabsTrigger value="blog">
                <FileText className="h-3 w-3 mr-1" />
                Blog ({results.blog.length})
              </TabsTrigger>
              <TabsTrigger value="social">
                <Share2 className="h-3 w-3 mr-1" />
                Social ({results.social.length})
              </TabsTrigger>
              <TabsTrigger value="crm">
                <Users className="h-3 w-3 mr-1" />
                CRM ({results.crm.length})
              </TabsTrigger>
              <TabsTrigger value="automation">
                <Zap className="h-3 w-3 mr-1" />
                Auto ({results.automation.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <ScrollArea className="h-96">
                {[...results.blog, ...results.social, ...results.crm, ...results.automation]
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                  .slice(0, 20)
                  .map((result) => (
                    <ResultCard key={`${result.type}-${result.id}`} result={result} />
                  ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="blog" className="mt-4">
              <ScrollArea className="h-96">
                {results.blog.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No blog content created yet</p>
                  </div>
                ) : (
                  results.blog.map((result) => (
                    <ResultCard key={result.id} result={result} />
                  ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="social" className="mt-4">
              <ScrollArea className="h-96">
                {results.social.length === 0 ? (
                  <div className="text-center py-8">
                    <Share2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No social posts scheduled yet</p>
                  </div>
                ) : (
                  results.social.map((result) => (
                    <ResultCard key={result.id} result={result} />
                  ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="crm" className="mt-4">
              <ScrollArea className="h-96">
                {results.crm.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No CRM actions performed yet</p>
                  </div>
                ) : (
                  results.crm.map((result) => (
                    <ResultCard key={result.id} result={result} />
                  ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="automation" className="mt-4">
              <ScrollArea className="h-96">
                {results.automation.length === 0 ? (
                  <div className="text-center py-8">
                    <Zap className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No automation workflows executed yet</p>
                  </div>
                ) : (
                  results.automation.map((result) => (
                    <ResultCard key={result.id} result={result} />
                  ))
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}