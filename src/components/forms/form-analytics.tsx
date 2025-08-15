'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, TrendingUp, Users, Eye, MousePointer, Clock, 
  Download, Filter, Calendar, Globe, Smartphone, Monitor,
  AlertTriangle, CheckCircle, XCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface FormAnalyticsProps {
  formId: string;
  formName: string;
}

// Mock data - in real app this would come from your analytics service
const mockAnalyticsData = {
  overview: {
    totalViews: 12847,
    totalSubmissions: 3421,
    conversionRate: 26.6,
    averageCompletionTime: 4.2,
    bounceRate: 23.4,
    completionRate: 76.6
  },
  timeSeriesData: [
    { date: '2024-01-01', views: 245, submissions: 67, conversions: 27.3 },
    { date: '2024-01-02', views: 312, submissions: 89, conversions: 28.5 },
    { date: '2024-01-03', views: 198, submissions: 45, conversions: 22.7 },
    { date: '2024-01-04', views: 267, submissions: 73, conversions: 27.3 },
    { date: '2024-01-05', views: 334, submissions: 95, conversions: 28.4 },
    { date: '2024-01-06', views: 289, submissions: 78, conversions: 27.0 },
    { date: '2024-01-07', views: 356, submissions: 102, conversions: 28.7 }
  ],
  deviceBreakdown: [
    { device: 'Desktop', count: 7854, percentage: 61.1 },
    { device: 'Mobile', count: 3982, percentage: 31.0 },
    { device: 'Tablet', count: 1011, percentage: 7.9 }
  ],
  locationBreakdown: [
    { country: 'United States', count: 5847, percentage: 45.5 },
    { country: 'Canada', count: 2134, percentage: 16.6 },
    { country: 'United Kingdom', count: 1876, percentage: 14.6 },
    { country: 'Australia', count: 1245, percentage: 9.7 },
    { country: 'Germany', count: 987, percentage: 7.7 },
    { country: 'Others', count: 758, percentage: 5.9 }
  ],
  fieldAnalytics: [
    { fieldName: 'Full Name', completionRate: 98.5, averageTime: 12.3, dropOffRate: 1.5 },
    { fieldName: 'Email Address', completionRate: 96.2, averageTime: 18.7, dropOffRate: 3.8 },
    { fieldName: 'Phone Number', completionRate: 87.4, averageTime: 24.1, dropOffRate: 12.6 },
    { fieldName: 'Company', completionRate: 92.1, averageTime: 15.8, dropOffRate: 7.9 },
    { fieldName: 'Message', completionRate: 78.3, averageTime: 67.2, dropOffRate: 21.7 }
  ],
  conversionFunnel: [
    { step: 'Form View', count: 12847, percentage: 100 },
    { step: 'Started Form', count: 9834, percentage: 76.6 },
    { step: 'Completed 50%', count: 6789, percentage: 52.8 },
    { step: 'Completed 75%', count: 4567, percentage: 35.5 },
    { step: 'Form Submitted', count: 3421, percentage: 26.6 }
  ],
  trafficSources: [
    { source: 'Direct', count: 4523, percentage: 35.2 },
    { source: 'Organic Search', count: 3876, percentage: 30.2 },
    { source: 'Social Media', count: 2134, percentage: 16.6 },
    { source: 'Email Campaign', count: 1567, percentage: 12.2 },
    { source: 'Paid Ads', count: 747, percentage: 5.8 }
  ]
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function FormAnalytics({ formId, formName }: FormAnalyticsProps) {
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  const { overview, timeSeriesData, deviceBreakdown, locationBreakdown, fieldAnalytics, conversionFunnel, trafficSources } = mockAnalyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Form Analytics</h1>
          <p className="text-muted-foreground">{formName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalSubmissions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              +8.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.conversionRate}%</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDown className="h-3 w-3 mr-1" />
              -2.1% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.averageCompletionTime}m</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowDown className="h-3 w-3 mr-1" />
              -0.3m from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="fields">Field Analysis</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Track user journey through your form</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((step, index) => (
                  <div key={step.step} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">{step.step}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{step.count.toLocaleString()}</span>
                        <span className="text-sm font-medium">{step.percentage}%</span>
                      </div>
                      <Progress value={step.percentage} className="h-2" />
                    </div>
                    {index < conversionFunnel.length - 1 && (
                      <div className="text-xs text-muted-foreground">
                        -{((conversionFunnel[index].count - conversionFunnel[index + 1].count) / conversionFunnel[index].count * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Series Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Views & Submissions Over Time</CardTitle>
              <CardDescription>Daily performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="submissions" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-green-600">{overview.completionRate}%</CardTitle>
                <CardDescription>Completion Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={overview.completionRate} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-red-600">{overview.bounceRate}%</CardTitle>
                <CardDescription>Bounce Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={overview.bounceRate} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-blue-600">{overview.averageCompletionTime}m</CardTitle>
                <CardDescription>Avg. Time to Complete</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground text-center">
                  Industry average: 5.2m
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Rate Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Trend</CardTitle>
              <CardDescription>Daily conversion rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversions" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Form submissions by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ device, percentage }) => `${device} ${percentage}%`}
                    >
                      {deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Top countries by submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locationBreakdown.map((location, index) => (
                    <div key={location.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-sm font-medium">{location.country}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{location.count.toLocaleString()}</span>
                        <span className="text-sm font-medium">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fields" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Field Performance Analysis</CardTitle>
              <CardDescription>Analyze completion rates and drop-off points for each field</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fieldAnalytics.map((field, index) => (
                  <div key={field.fieldName} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{field.fieldName}</h4>
                      <div className="flex items-center gap-2">
                        {field.dropOffRate > 15 ? (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            High Drop-off
                          </Badge>
                        ) : field.completionRate > 95 ? (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Excellent
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Good
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Completion Rate</div>
                        <div className="font-medium text-green-600">{field.completionRate}%</div>
                        <Progress value={field.completionRate} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg. Time</div>
                        <div className="font-medium">{field.averageTime}s</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Drop-off Rate</div>
                        <div className="font-medium text-red-600">{field.dropOffRate}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your form visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={trafficSources}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Traffic Sources List */}
            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
                <CardDescription>Detailed breakdown by traffic source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{source.count.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}