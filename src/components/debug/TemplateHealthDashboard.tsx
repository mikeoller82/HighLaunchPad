'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Image as ImageIcon, 
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';
import { rateLimitHandler } from '@/lib/rate-limit-handler';
import { loadImagesInBatch } from '@/lib/rate-limit-prevention';

interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  recommendations: string[];
}

export function TemplateHealthDashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'healthy',
    message: 'Loading...',
    recommendations: []
  });
  const [errorStats, setErrorStats] = useState<any>({});
  const [rateLimitStatus, setRateLimitStatus] = useState<any[]>([]);
  const [imageStats, setImageStats] = useState<any>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // Get rate limit status
      const rateLimits = rateLimitHandler.getRateLimitStatus();
      setRateLimitStatus(rateLimits);

      // Set basic health status
      const isRateLimited = rateLimits.some(r => r.isBlocked);
      setHealthStatus({
        status: isRateLimited ? 'warning' : 'healthy',
        message: isRateLimited ? 'Some hosts are rate limited' : 'System operating normally',
        recommendations: isRateLimited ? ['Wait for rate limits to clear', 'Reduce request frequency'] : []
      });

      // Set basic stats
      setErrorStats({
        totalErrors: 0,
        rateLimitErrors: rateLimits.filter(r => r.isBlocked).length
      });

      setImageStats({
        loadedCount: 0,
        failedCount: 0,
        queueLength: 0,
        isProcessing: false
      });
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Template System Health</h2>
          <p className="text-muted-foreground">Monitor rate limiting and template loading performance</p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Health Status */}
      <Alert className={getStatusColor(healthStatus.status)}>
        <div className="flex items-center gap-2">
          {getStatusIcon(healthStatus.status)}
          <AlertDescription className="font-medium">
            {healthStatus.message}
          </AlertDescription>
        </div>
        {healthStatus.recommendations.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Recommendations:</p>
            <ul className="text-sm space-y-1">
              {healthStatus.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-xs mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Alert>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorStats.totalErrors || 0}</div>
            <p className="text-xs text-muted-foreground">
              {errorStats.rateLimitErrors || 0} rate limit errors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limits</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rateLimitStatus.filter(r => r.isBlocked).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {rateLimitStatus.length} hosts monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images Loaded</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imageStats.loadedCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {imageStats.failedCount || 0} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imageStats.queueLength || 0}</div>
            <p className="text-xs text-muted-foreground">
              {imageStats.isProcessing ? 'Processing' : 'Idle'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rate Limit Details */}
      {rateLimitStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rate Limit Status by Host</CardTitle>
            <CardDescription>Current rate limiting status for external hosts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rateLimitStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant={status.isBlocked ? "destructive" : "secondary"}>
                      {status.isBlocked ? 'Blocked' : 'Active'}
                    </Badge>
                    <span className="font-mono text-sm">{status.hostname}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {status.consecutiveRateLimits > 0 && (
                      <span>{status.consecutiveRateLimits} failures</span>
                    )}
                    {status.isBlocked && (
                      <span className="ml-2">Next: {status.nextAllowedTime}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Breakdown */}
      {errorStats.errorsByType && Object.keys(errorStats.errorsByType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Error Breakdown</CardTitle>
            <CardDescription>Errors by type and template</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">By Type</h4>
                <div className="space-y-1">
                  {Object.entries(errorStats.errorsByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                      <span className="font-mono">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {errorStats.errorsByTemplate && Object.keys(errorStats.errorsByTemplate).length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">By Template</h4>
                  <div className="space-y-1">
                    {Object.entries(errorStats.errorsByTemplate).slice(0, 5).map(([template, count]) => (
                      <div key={template} className="flex justify-between text-sm">
                        <span className="truncate">{template}</span>
                        <span className="font-mono">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Actions</CardTitle>
          <CardDescription>Tools for debugging and managing the template system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                rateLimitHandler.clearAllRateLimits();
                refreshData();
              }}
            >
              Clear Rate Limits
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Clear local error state
                setErrorStats({
                  totalErrors: 0,
                  rateLimitErrors: 0
                });
                refreshData();
              }}
            >
              Clear Error History
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const data = JSON.stringify({
                  timestamp: new Date().toISOString(),
                  healthStatus,
                  errorStats,
                  rateLimitStatus,
                  imageStats
                }, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `template-debug-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export Debug Data
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log('=== Template System Debug Info ===');
                console.log('Health Status:', healthStatus);
                console.log('Error Stats:', errorStats);
                console.log('Rate Limit Status:', rateLimitStatus);
                console.log('Image Stats:', imageStats);
                console.log('Rate Limit Handler Status:', rateLimitHandler.getRateLimitStatus());
              }}
            >
              Log Debug Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}