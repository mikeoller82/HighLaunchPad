"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useApiKey } from '@/context/ApiKeyContext';
import type { Component } from '@/lib/types';

import { Save, Globe, Eye, Loader2, Wand2, Edit, Type, ImageIcon, VideoIcon } from 'lucide-react';

interface EditorActionsProps {
  type?: 'website' | 'funnel' | 'blog' | 'newsletter';
  isPublished?: boolean;
  onSaveDraft?: () => Promise<void>;
  onPublishLive?: () => Promise<void>;
  onPreview?: () => void;
  previewUrl?: string;
  component?: Component;
  onUpdate?: (newContent: any) => void;
}

export function EditorActions({
  type,
  isPublished = false,
  onSaveDraft,
  onPublishLive,
  onPreview,
  previewUrl,
  component,
  onUpdate
}: EditorActionsProps) {
  const { toast } = useToast();
  const { isKeyReady } = useApiKey();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSaveDraft = async () => {
    if (!onSaveDraft) return;
    
    setIsSaving(true);
    try {
      await onSaveDraft();
      toast({
        title: 'Draft Saved',
        description: `Your ${type} has been saved as a draft.`,
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save draft. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishLive = async () => {
    if (!onPublishLive) return;
    
    setIsPublishing(true);
    try {
      await onPublishLive();
      toast({
        title: 'Published Successfully',
        description: `Your ${type} is now live!`,
      });
      setShowPublishDialog(false);
    } catch (error) {
      console.error('Error publishing:', error);
      toast({
        variant: 'destructive',
        title: 'Publish Failed',
        description: 'Failed to publish. Please try again.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const handleAiGenerate = async () => {
    if (!isKeyReady) {
      toast({
        variant: 'destructive',
        title: 'API Key Required',
        description: 'Please add your API key in the top-right corner to use AI features.',
      });
      return;
    }

    if (!aiPrompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt Required',
        description: 'Please enter a prompt for AI generation.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          componentType: component?.type || 'text',
          currentContent: component?.content || {}
        }),
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const result = await response.json();
      
      if (onUpdate && result.content) {
        onUpdate(result.content);
        toast({
          title: 'Content Generated',
          description: 'AI has generated new content for your component.',
        });
      }
      
      setShowAiDialog(false);
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Failed to generate content. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderComponentEditor = () => {
    if (!component || !onUpdate) return null;

    const { content } = component;

    switch (component.type) {
      case 'header':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="header-title">Title</Label>
              <Input
                id="header-title"
                value={content.title || ''}
                onChange={(e) => onUpdate({ ...content, title: e.target.value })}
                placeholder="Enter header title..."
              />
            </div>
            <div>
              <Label htmlFor="header-links">Navigation Links (JSON)</Label>
              <Textarea
                id="header-links"
                value={JSON.stringify(content.links || [], null, 2)}
                onChange={(e) => {
                  try {
                    const links = JSON.parse(e.target.value);
                    onUpdate({ ...content, links });
                  } catch (error) {
                    // Invalid JSON, ignore
                  }
                }}
                placeholder='[{"label": "Home", "href": "/"}]'
                rows={4}
              />
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={content.title || ''}
                onChange={(e) => onUpdate({ ...content, title: e.target.value })}
                placeholder="Enter hero title..."
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                value={content.subtitle || ''}
                onChange={(e) => onUpdate({ ...content, subtitle: e.target.value })}
                placeholder="Enter hero subtitle..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="hero-cta">Call to Action</Label>
              <Input
                id="hero-cta"
                // Safely get the string value to display in the input
                value={typeof content.cta === 'string' ? content.cta : content.cta?.primary || ''}
                // When the input changes, update the cta property with the new string value
                onChange={(e) => onUpdate({ ...content, cta: e.target.value })}
                placeholder="Get Started"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                value={content.text || ''}
                onChange={(e) => onUpdate({ ...content, text: e.target.value })}
                placeholder="Enter your text content..."
                rows={6}
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-src">Image URL</Label>
              <Input
                id="image-src"
                value={content.src || ''}
                onChange={(e) => onUpdate({ ...content, src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={content.alt || ''}
                onChange={(e) => onUpdate({ ...content, alt: e.target.value })}
                placeholder="Describe the image..."
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-title">Video Title</Label>
              <Input
                id="video-title"
                value={content.title || ''}
                onChange={(e) => onUpdate({ ...content, title: e.target.value })}
                placeholder="Enter video title..."
              />
            </div>
            <div>
              <Label htmlFor="video-url">Video Embed URL</Label>
              <Input
                id="video-url"
                value={content.embedUrl || ''}
                onChange={(e) => onUpdate({ ...content, embedUrl: e.target.value })}
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-blue-600 py-8">
            <p>Select a component to edit its properties</p>
          </div>
        );
    }
  };

  // If component editing mode, show component editor
  if (component && onUpdate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit {component.type}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAiDialog(true)}
            disabled={!isKeyReady}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            AI Enhance
          </Button>
        </div>
        
        {renderComponentEditor()}

        <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Content Enhancement</DialogTitle>
              <DialogDescription>
                Describe how you&apos;d like to improve this {component.type} component.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-prompt">Enhancement Prompt</Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Make it more engaging and professional..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAiDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAiGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Otherwise show the floating action buttons
  return (
    <>
      <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-background border rounded-lg p-2 shadow-lg z-50">
        {onPreview && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveDraft}
          disabled={isSaving || !onSaveDraft}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Draft
        </Button>

        <Button
          size="sm"
          onClick={() => setShowPublishDialog(true)}
          disabled={isPublishing || !onPublishLive}
          className="bg-green-600 hover:bg-green-700"
        >
          <Globe className="h-4 w-4 mr-2" />
          {isPublished ? 'Update Live' : 'Publish Live'}
        </Button>
      </div>

      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isPublished ? `Update ${type}?` : `Publish ${type}?`}
            </DialogTitle>
            <DialogDescription>
              {isPublished 
                ? `This will update your live ${type} with the current changes.`
                : `This will make your ${type} publicly accessible.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePublishLive}
              disabled={isPublishing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPublishing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Globe className="h-4 w-4 mr-2" />
              )}
              {isPublished ? 'Update Live' : 'Publish Live'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}