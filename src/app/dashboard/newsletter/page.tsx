
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Edit, Mails, Lightbulb } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { newsletterTemplates } from '@/lib/newsletter-templates';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function NewslettersPage() {

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Newsletter Templates</h2>
                    <p className="text-blue-600">
                        Create a beautiful, single-page newsletter from a pre-built template.
                    </p>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {newsletterTemplates.map(template => (
                    <Card key={template.id} className="overflow-hidden flex flex-col">
                        <div className="relative h-48 w-full bg-muted">
                            <Image src={template.image} alt={template.title} fill className="object-cover" data-ai-hint={template.hint} />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg">{template.title}</CardTitle>
                            <CardDescription className="h-10 pt-1">{template.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto grid grid-cols-2 gap-2 pt-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <Lightbulb className="mr-2 h-4 w-4" /> AI Insights
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent align="start">
                                        <p className="max-w-xs">{template.aiInsight}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Button asChild className="w-full">
                                <Link href={`/dashboard/newsletter/${template.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Use Template
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[380px]">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/newsletter/default" className="flex flex-col items-center justify-center h-full w-full text-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <Mails className="h-12 w-12 text-primary" />
                            </div>
                            <p className="font-semibold">Start From Scratch</p>
                            <p className="text-sm text-blue-600 px-4">Design a new newsletter page with a blank canvas.</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}

    