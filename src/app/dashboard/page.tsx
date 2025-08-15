// /src/app/dashboard/page.tsx

"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowRight, BarChart, BrainCircuit, DollarSign, Lightbulb, Loader2, Users } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useApiKey } from '@/context/ApiKeyContext';
import { useAuth } from '@/context/auth-context';

type GenerateDashboardInsightsOutput = {
  insights: string[];
  recommendations: {
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    icon: 'Lightbulb' | 'BarChart' | 'TrendingUp' | 'Settings';
  }[];
};



const mockMetrics = {
  clicks: 1250,
  conversions: 89,
  commission: 2340.50
};

const mockFunnels = [
  { name: 'Product Launch Funnel', ctr: 3.2, optInRate: 12.5 },
  { name: 'Email Capture Funnel', ctr: 2.8, optInRate: 18.3 }
];

export default function DashboardPage() {
  const { toast } = useToast();
  const { checkApiKey } = useApiKey();
  const [insights, setInsights] = useState<GenerateDashboardInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // This function is now triggered by a button click
  const handleFetchInsights = async () => {
    // Check if user has API key first
    if (!checkApiKey()) {
      return;
    }

    setIsLoading(true);
    try {
        const userApiKey = localStorage.getItem('user_gemini_api_key');
        if (!userApiKey) {
          throw new Error('API key not found');
        }

        const response = await fetch('/api/ai/dashboard-insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': userApiKey,
          },
          body: JSON.stringify({
            metrics: mockMetrics,
            funnels: mockFunnels,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch insights');
        }

        const data = await response.json();
        setInsights(data);
        toast({
          title: "Success",
          description: "AI insights generated successfully!",
        });
    } catch (error) {
        console.error(error);
        toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate insights",
        variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };



  return (
    <div className="space-y-6">
        {/* Your Stat Cards - Unchanged */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                    <Activity className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-blue-600">No data available</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-900">0</div>
                    <p className="text-xs text-blue-700">No data available</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commission</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-900">$0.00</div>
                    <p className="text-xs text-blue-700">No data available</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">EPC (Earnings Per Click)</CardTitle>
                    <BarChart className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-900">$0.00</div>
                    <p className="text-xs text-blue-700">No data available</p>
                </CardContent>
            </Card>
        </div>

        {/* Your Chart and Recent Activity Cards - Unchanged */}
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>Your performance data will appear here once you start getting traffic.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-900">0</div>
                    <p className="text-xs text-blue-700">No data available</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of your recent clicks and conversions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed rounded-lg">
                        <Activity className="h-10 w-10 text-blue-600 mb-4" />
                        <h3 className="text-lg font-semibold text-blue-900">No Recent Activity</h3>
                        <p className="text-blue-700 text-sm">Your recent events will show up here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>



        {/* Your AI Assistant Card - LOGIC UPDATED */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><BrainCircuit className="mr-2 h-5 w-5 text-primary" /> AI Assistant</CardTitle>
                <CardDescription>Your AI assistant analyzes your performance and provides actionable recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed rounded-lg">
                      <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
                      <h3 className="text-lg font-semibold text-blue-900">Analyzing your data...</h3>
                      <p className="text-blue-700 text-sm">Our AI is generating personalized insights for you.</p>
                    </div>                ) : insights ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-blue-900">Key Insights</h3>
                            <ul className="space-y-2">
                                {insights.insights.map((insight, index) => (
                                    <li key={index} className="text-sm text-blue-700 flex items-start">
                                        <Lightbulb className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                        {insight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-blue-900">Recommendations</h3>
                            {insights.recommendations.map((rec, index) => {
                                const IconComponent = (Icons as any)[rec.icon] || Lightbulb;
                                return (
                                    <div key={index} className="border rounded-lg p-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <IconComponent className="h-4 w-4 text-blue-600" />
                                            <h4 className="font-medium text-sm text-blue-900">{rec.title}</h4>
                                        </div>
                                        <p className="text-sm text-blue-700">{rec.description}</p>
                                        <div>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={rec.ctaLink}>{rec.ctaText} <ArrowRight className="ml-2 h-4 w-4"/></Link>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                   <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed rounded-lg">
                      <Lightbulb className="h-10 w-10 text-blue-600 mb-4" />
                      <h3 className="text-lg font-semibold text-blue-900">No Recommendations Yet</h3>
                      <p className="text-blue-700 text-sm">Click the button to get AI-powered insights.</p>
                      {/* THIS BUTTON NOW TRIGGERS THE CORRECT LOGIC */}
                      <Button className="mt-4" onClick={handleFetchInsights}>
                          Generate Insights
                      </Button>
                  </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}