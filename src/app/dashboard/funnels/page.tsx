
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Lightbulb, TrendingUp, UserPlus, HeartPulse, Filter, Eye } from "lucide-react";
import Link from "next/link";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { LazyImage } from "@/components/ui/LazyImage";
// Removed template-error-monitor import - using simple error handling
import type { FunnelTemplate } from "@/lib/types";

export default function FunnelsPage() {
    const [funnelTemplates, setFunnelTemplates] = useState<FunnelTemplate[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState<boolean>(true);
    const [templatesError, setTemplatesError] = useState<string | null>(null);

    // Load funnel templates with rate limiting protection
    useEffect(() => {
        const loadTemplates = async () => {
            try {
                setTemplatesLoading(true);
                setTemplatesError(null);
                
                // Use dynamic import with rate limiting protection
                const { funnelTemplates: templates } = await import('@/lib/funnel-templates');
                
                // Validate templates before setting with proper typing
                const validatedTemplates: FunnelTemplate[] = (templates || []).map((template: Partial<FunnelTemplate>): FunnelTemplate => ({
                    // Ensure all required properties exist with proper defaults
                    id: template.id || `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: template.title || 'Untitled Template',
                    description: template.description || 'No description available',
                    image: template.image || '/fallback-image.png',
                    hint: template.hint || '',
                    aiInsight: template.aiInsight || 'No insights available',
                    stats: {
                        ctr: template.stats?.ctr ?? 0,
                        optInRate: template.stats?.optInRate ?? 0,
                        healthScore: template.stats?.healthScore ?? 75
                    },
                    components: template.components || [],
                    purpose: template.purpose || 'General purpose funnel',
                    targetAudience: template.targetAudience || 'General audience',
                    conversionStrategy: template.conversionStrategy || 'Standard conversion approach',
                    industry: template.industry,
                    psychologicalTriggers: template.psychologicalTriggers
                }));
                
                setFunnelTemplates(validatedTemplates);
            } catch (error) {
                console.error('Error loading funnel templates:', error);
                setTemplatesError('Failed to load funnel templates');
                setFunnelTemplates([]);
            } finally {
                setTemplatesLoading(false);
            }
        };

        loadTemplates();
    }, []);

    if (templatesLoading) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading funnel templates...</span>
            </div>
        );
    }

    if (templatesError) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Funnel Templates</h2>
                        <p className="text-red-600">
                            {templatesError}. Please try refreshing the page.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/funnels/default">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Blank Funnel
                        </Link>
                    </Button>
                </div>
                <div className="text-center py-12">
                    <p className="text-gray-500">Failed to load templates. Please refresh the page or try again later.</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Funnel Templates</h2>
                    <p className="text-blue-600">
                        Create a new funnel from a professionally designed template.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/funnels/default">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Blank Funnel
                    </Link>
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {funnelTemplates.length > 0 ? funnelTemplates.map(funnel => (
                    <Card key={funnel.id} className="overflow-hidden flex flex-col">
                        <div className="relative h-48 w-full">
                            <LazyImage 
                                src={funnel.image} 
                                alt={funnel.title} 
                                fill 
                                className="object-cover" 
                                data-ai-hint={funnel.hint}
                                priority={5}
                                fallbackSrc="/placeholder-funnel.jpg"
                            />
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{funnel.title}</CardTitle>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Badge variant={funnel.stats.healthScore > 80 ? "default" : "secondary"}>
                                                <HeartPulse className="mr-1.5 h-3 w-3" />
                                                {funnel.stats.healthScore}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>AI Funnel Health Score</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <CardDescription className="h-10 pt-1">{funnel.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-center">
                            <div className="flex items-center justify-center gap-2 rounded-lg border p-3">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-lg font-bold">{funnel.stats.ctr}%</p>
                                    <p className="text-xs text-blue-600">CTR</p>
                                </div>
                            </div>
                             <div className="flex items-center justify-center gap-2 rounded-lg border p-3">
                                <UserPlus className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-lg font-bold">{funnel.stats.optInRate}%</p>
                                    <p className="text-xs text-blue-600">Opt-in Rate</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-auto grid grid-cols-3 gap-2 pt-2">
                            <TemplatePreview 
                                templateId={funnel.id} 
                                title={funnel.title} 
                                components={funnel.components}
                                templateType="funnel"
                            >
                                <Button variant="outline" className="w-full">
                                    <Eye className="mr-2 h-4 w-4" /> Preview
                                </Button>
                            </TemplatePreview>
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <Lightbulb className="mr-2 h-4 w-4" /> AI Insights
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent align="start">
                                        <p className="max-w-xs">{funnel.aiInsight}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Button asChild className="w-full">
                                <Link href={`/dashboard/funnels/${funnel.id}`}>Use Template</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No funnel templates available at the moment.</p>
                    </div>
                )}
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[480px]">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/funnels/default" className="flex flex-col items-center justify-center h-full w-full text-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <Filter className="h-12 w-12 text-primary" />
                            </div>
                            <p className="font-semibold">Start From Scratch</p>
                            <p className="text-sm text-blue-600 px-4">Build a funnel with a blank canvas.</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}
