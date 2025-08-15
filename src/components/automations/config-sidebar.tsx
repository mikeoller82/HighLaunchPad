
'use client';
import type { Node as ReactFlowNode } from '@reactflow/core';
import { useState } from 'react';
import { Button } from '../ui/button';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useApiKey } from '@/context/ApiKeyContext';
import { generateEmailContent } from '@/lib/ai-client';
import { useToast } from '@/hooks/use-toast';
import * as Icons from 'lucide-react';

interface AutomationNode extends ReactFlowNode {
  data: { 
    config?: any; 
    title?: string; 
    icon?: string;
    [key: string]: any; 
  };
}

interface ConfigSidebarProps {
  node: ReactFlowNode;
  onConfigChange: (config: any) => void;
  onClose: () => void;
}

const mockForms = [
    { id: 'form_1', name: 'Lead Magnet Download' },
    { id: 'form_2', name: 'Contact Us Page' },
    { id: 'form_3', name: 'Webinar Registration' },
];

const TriggerConfigForm = ({ config, onConfigChange }: { config: any, onConfigChange: (c:any) => void}) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="formId">Trigger Form</Label>
                <Select
                    value={config.formId || ''}
                    onValueChange={(value) => onConfigChange({ ...config, formId: value })}
                >
                    <SelectTrigger id="formId"><SelectValue placeholder="Select a form..." /></SelectTrigger>
                    <SelectContent>
                        {mockForms.map(form => (
                            <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

const ActionConfigForm = ({ config, onConfigChange }: { config: any, onConfigChange: (c:any) => void}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const { apiKey } = useApiKey();
    const { toast } = useToast();

    const handleAIGenerate = async () => {
        if (!apiKey) {
            toast({
                variant: "destructive",
                title: "API Key Required",
                description: "Please set your Google AI API key in settings to use AI features."
            });
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateEmailContent({
                objective: "Welcome new subscribers and provide value",
                tone: "friendly and professional",
                productDetails: config.productDetails || "our product/service",
                apiKey
            });

            onConfigChange({
                ...config,
                subject: result.subjectLines?.[0] || "Welcome!",
                body: result.body || "Thank you for subscribing!"
            });

            toast({
                title: "Content Generated",
                description: "AI has generated email content for you!"
            });
        } catch (error) {
            console.error('AI generation error:', error);
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "Failed to generate content. Please try again."
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="productDetails">Product/Service Context</Label>
                <Input 
                    id="productDetails" 
                    placeholder="Describe your product/service for better AI content"
                    value={config.productDetails || ''}
                    onChange={(e) => onConfigChange({ ...config, productDetails: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="subject">Email Subject</Label>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAIGenerate}
                        disabled={isGenerating}
                        className="h-7 px-2"
                    >
                        {isGenerating ? (
                            <Icons.Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                            <Icons.Sparkles className="h-3 w-3 mr-1" />
                        )}
                        AI Generate
                    </Button>
                </div>
                <Input 
                    id="subject" 
                    placeholder="Enter email subject"
                    value={config.subject || ''}
                    onChange={(e) => onConfigChange({ ...config, subject: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                    id="body"
                    placeholder="Enter email body. Use {{contact.name}} for personalization."
                    value={config.body || ''}
                    onChange={(e) => onConfigChange({ ...config, body: e.target.value })}
                    className="min-h-[200px]"
                />
            </div>
        </div>
    );
};

const DelayConfigForm = ({ config, onConfigChange }: { config: any, onConfigChange: (c:any) => void}) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Wait Duration</Label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        min="1"
                        value={config.duration || '1'}
                        onChange={(e) => onConfigChange({ ...config, duration: parseInt(e.target.value, 10) || 1 })}
                        className="w-24"
                    />
                    <Select
                        value={config.unit || 'days'}
                        onValueChange={(value) => onConfigChange({ ...config, unit: value })}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

const AIContentConfigForm = ({ config, onConfigChange }: { config: any, onConfigChange: (c:any) => void}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const { apiKey } = useApiKey();
    const { toast } = useToast();

    const handleAIGenerate = async () => {
        if (!apiKey) {
            toast({
                variant: "destructive",
                title: "API Key Required",
                description: "Please set your Google AI API key in settings to use AI features."
            });
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateEmailContent({
                objective: config.objective || "Generate engaging content",
                tone: config.tone || "professional",
                productDetails: config.context || "our product/service",
                apiKey
            });

            onConfigChange({
                ...config,
                generatedContent: result.body || "Generated content will appear here"
            });

            toast({
                title: "Content Generated",
                description: "AI has generated content for you!"
            });
        } catch (error) {
            console.error('AI generation error:', error);
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "Failed to generate content. Please try again."
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                    value={config.contentType || 'email'}
                    onValueChange={(value) => onConfigChange({ ...config, contentType: value })}
                >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="email">Email Content</SelectItem>
                        <SelectItem value="sms">SMS Message</SelectItem>
                        <SelectItem value="social">Social Media Post</SelectItem>
                        <SelectItem value="ad">Ad Copy</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="context">Context/Description</Label>
                <Textarea
                    id="context"
                    placeholder="Describe what content you need..."
                    value={config.context || ''}
                    onChange={(e) => onConfigChange({ ...config, context: e.target.value })}
                    className="min-h-[100px]"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                    value={config.tone || 'professional'}
                    onValueChange={(value) => onConfigChange({ ...config, tone: value })}
                >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button 
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="w-full"
            >
                {isGenerating ? (
                    <Icons.Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                    <Icons.Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate AI Content
            </Button>
            {config.generatedContent && (
                <div className="space-y-2">
                    <Label>Generated Content</Label>
                    <Textarea
                        value={config.generatedContent}
                        onChange={(e) => onConfigChange({ ...config, generatedContent: e.target.value })}
                        className="min-h-[150px]"
                        placeholder="Generated content will appear here..."
                    />
                </div>
            )}
        </div>
    );
};

const renderConfigForm = (node: ReactFlowNode, onConfigChange: (c:any) => void) => {
    switch (node.type) {
        case 'trigger':
            return <TriggerConfigForm config={node.data?.config} onConfigChange={onConfigChange} />;
        case 'action':
            if (node.data?.title === 'AI Content Generator') {
                return <AIContentConfigForm config={node.data?.config} onConfigChange={onConfigChange} />;
            }
            return <ActionConfigForm config={node.data?.config} onConfigChange={onConfigChange} />;
        case 'delay':
            return <DelayConfigForm config={node.data?.config} onConfigChange={onConfigChange} />;
        default:
            return <p className="text-blue-600">Configuration for this node is not yet available.</p>;
    }
};

export function ConfigSidebar({ node, onConfigChange, onClose }: ConfigSidebarProps) {
  const IconComponent = (Icons as any)[node.data?.icon || 'HelpCircle'] || Icons.HelpCircle;

  return (
    <aside className="w-80 bg-card border-r p-4 flex flex-col h-full">
        <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                <h2 className="text-lg font-semibold tracking-tight">{node.data?.title}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
                <Icons.X className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
            {renderConfigForm(node, onConfigChange)}
        </div>
    </aside>
  );
}
