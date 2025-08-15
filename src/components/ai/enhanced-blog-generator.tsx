'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, FileText, Target, Zap, BarChart3, Eye, Clock, Hash, Save, Bell, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useNotifications } from '@/components/ui/notification-system';

interface BlogGenerationRequest {
  topic: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'authoritative' | 'conversational' | 'technical';
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  seoKeywords: string[];
  includeResearch: boolean;
  outline: string[];
  industry?: string;
  competitorAnalysis: boolean;
  includeExamples: boolean;
  callToActionType: 'newsletter' | 'product' | 'service' | 'download' | 'contact';
}

interface BlogPost {
  titles: string[];
  metaDescription: string;
  tableOfContents: string[];
  introduction: string;
  sections: Array<{
    heading: string;
    content: string;
    subsections?: Array<{
      subheading: string;
      content: string;
    }>;
  }>;
  conclusion: string;
  tags: string[];
  seoKeywords: string[];
  socialMediaSnippets: string[];
  keyTakeaways: string[];
  estimatedReadTime: number;
  wordCount: number;
  researchSources: string[];
}

export function EnhancedBlogGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<BlogPost | null>(null);
  const [research, setResearch] = useState<string>('');
  const [savedBlogId, setSavedBlogId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, db } = useAuth();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState<BlogGenerationRequest>({
    topic: '',
    targetAudience: '',
    tone: 'professional',
    length: 'medium',
    seoKeywords: [],
    includeResearch: true,
    outline: [],
    industry: '',
    competitorAnalysis: false,
    includeExamples: true,
    callToActionType: 'newsletter'
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [outlineInput, setOutlineInput] = useState('');

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.seoKeywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter(k => k !== keyword)
    }));
  };

  const handleAddOutlinePoint = () => {
    if (outlineInput.trim() && !formData.outline.includes(outlineInput.trim())) {
      setFormData(prev => ({
        ...prev,
        outline: [...prev.outline, outlineInput.trim()]
      }));
      setOutlineInput('');
    }
  };

  const handleRemoveOutlinePoint = (point: string) => {
    setFormData(prev => ({
      ...prev,
      outline: prev.outline.filter(p => p !== point)
    }));
  };

  const handleGenerate = async () => {
    if (!formData.topic || !formData.targetAudience) {
      toast({
        title: "Missing Information",
        description: "Please provide both topic and target audience.",
        variant: "destructive"
      });
      return;
    }

    if (!user || !db) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate blog posts.",
        variant: "destructive"
      });
      return;
    }

    // Get API key from context or environment
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || localStorage.getItem('google_ai_api_key');
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Google AI API key in settings.",
        variant: "destructive"
      });
      return;
    }

    // Show notification that generation is starting
    addNotification({
      type: 'info',
      title: '🤖 AI Blog Generator Starting',
      message: 'Your blog post is being generated. This may take a few moments...',
      duration: 3000
    });

    setIsGenerating(true);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();
      
      // First set the niche for the AI agent if provided
      if (formData.industry) {
        await fetch('/api/ai-agents/content-creation', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            action: 'set_niche',
            niche: formData.industry,
            topics: []
          })
        });
      }

      // Generate the blog post using the AI agent
      const response = await fetch('/api/ai-agents/content-creation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          action: 'generate_blog',
          ...formData,
          niche: formData.industry || 'general',
          apiKey
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate blog post');
      }

      const result = await response.json();
      setGeneratedBlog(result.blogPost);
      setResearch(result.research);
      
      // Automatically save the generated blog post to Firestore
      await saveBlogToFirestore(result.data, result.research);
      
      addNotification({
        type: 'success',
        title: '✅ Blog Post Generated Successfully!',
        message: `Created a ${result.data.wordCount}-word blog post with ${result.data.sections.length} sections. It's now available in your blog editor.`,
        duration: 8000
      });
    } catch (error) {
      console.error('Generation error:', error);
      addNotification({
        type: 'error',
        title: '❌ Generation Failed',
        message: 'Failed to generate blog post. Please try again.',
        duration: 6000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveBlogToFirestore = async (blogData: BlogPost, researchData: string) => {
    if (!user || !db) return;

    try {
      // Create a slug from the title
      const slug = blogData.titles[0]
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

      // Convert blog data to blog editor format
      const blogComponents = convertBlogToComponents(blogData);

      const blogDraftData = {
        title: blogData.titles[0],
        slug: slug,
        description: blogData.metaDescription,
        seoDescription: blogData.metaDescription,
        content: blogData,
        components: blogComponents,
        tags: blogData.tags,
        seoKeywords: blogData.seoKeywords,
        author: user.displayName || user.email || 'AI Content Agent',
        status: 'draft',
        agentGenerated: true,
        estimatedReadTime: blogData.estimatedReadTime,
        wordCount: blogData.wordCount,
        research: researchData,
        generationConfig: formData,
        image: '/images/blog-placeholder.jpg',
        hint: `AI-generated blog post about ${formData.topic}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Save to the blog_drafts collection that the blog page reads from
      const docRef = await addDoc(
        collection(db, 'workspaces', user.uid, 'blog_drafts'),
        blogDraftData
      );

      setSavedBlogId(docRef.id);

      // Show success notification
      toast({
        title: "💾 Blog Saved Successfully",
        description: "Your generated blog post is now available in the blog editor for further customization.",
      });

    } catch (error) {
      console.error('Error saving blog to Firestore:', error);
      toast({
        title: "Save Warning",
        description: "Blog was generated but couldn't be saved automatically. You can still export it manually.",
        variant: "destructive"
      });
    }
  };

  const convertBlogToComponents = (blogData: BlogPost) => {
    const components = [];
    let componentId = 1;

    // Add header component
    components.push({
      id: componentId++,
      type: 'header',
      content: {
        title: 'Your Blog',
        links: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' }
        ]
      }
    });

    // Add hero section with title
    components.push({
      id: componentId++,
      type: 'hero',
      content: {
        title: blogData.titles[0],
        subtitle: blogData.metaDescription,
        cta: 'Read More'
      }
    });

    // Add introduction
    if (blogData.introduction) {
      components.push({
        id: componentId++,
        type: 'text',
        content: {
          text: blogData.introduction
        }
      });
    }

    // Add table of contents if available
    if (blogData.tableOfContents.length > 0) {
      const tocText = "## Table of Contents\n\n" + 
        blogData.tableOfContents.map((item, index) => `${index + 1}. ${item}`).join('\n');
      
      components.push({
        id: componentId++,
        type: 'text',
        content: {
          text: tocText
        }
      });
    }

    // Add each section as text components
    blogData.sections.forEach(section => {
      let sectionText = `## ${section.heading}\n\n${section.content}`;
      
      if (section.subsections) {
        section.subsections.forEach(subsection => {
          sectionText += `\n\n### ${subsection.subheading}\n\n${subsection.content}`;
        });
      }

      components.push({
        id: componentId++,
        type: 'text',
        content: {
          text: sectionText
        }
      });
    });

    // Add conclusion
    if (blogData.conclusion) {
      components.push({
        id: componentId++,
        type: 'text',
        content: {
          text: `## Conclusion\n\n${blogData.conclusion}`
        }
      });
    }

    // Add key takeaways if available
    if (blogData.keyTakeaways.length > 0) {
      const takeawaysText = "## Key Takeaways\n\n" + 
        blogData.keyTakeaways.map(takeaway => `- ${takeaway}`).join('\n');
      
      components.push({
        id: componentId++,
        type: 'text',
        content: {
          text: takeawaysText
        }
      });
    }

    // Add author box
    components.push({
      id: componentId++,
      type: 'authorBox',
      content: {
        name: user?.displayName || user?.email || 'AI Content Agent',
        bio: `Content created with AI assistance for ${formData.targetAudience}`,
        avatarSrc: user?.photoURL || '/images/default-avatar.jpg',
        avatarHint: 'Author profile picture'
      }
    });

    // Add footer
    components.push({
      id: componentId++,
      type: 'footer',
      content: {
        copyright: `© ${new Date().getFullYear()} Your Blog. All rights reserved.`,
        links: [
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' }
        ]
      }
    });

    return components;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const exportAsMarkdown = () => {
    if (!generatedBlog) return;

    let markdown = `# ${generatedBlog.titles[0]}\n\n`;
    markdown += `${generatedBlog.introduction}\n\n`;
    
    if (generatedBlog.tableOfContents.length > 0) {
      markdown += `## Table of Contents\n\n`;
      generatedBlog.tableOfContents.forEach((item, index) => {
        markdown += `${index + 1}. ${item}\n`;
      });
      markdown += '\n';
    }

    generatedBlog.sections.forEach(section => {
      markdown += `## ${section.heading}\n\n`;
      markdown += `${section.content}\n\n`;
      
      if (section.subsections) {
        section.subsections.forEach(subsection => {
          markdown += `### ${subsection.subheading}\n\n`;
          markdown += `${subsection.content}\n\n`;
        });
      }
    });

    markdown += `## Conclusion\n\n${generatedBlog.conclusion}\n\n`;
    
    if (generatedBlog.keyTakeaways.length > 0) {
      markdown += `## Key Takeaways\n\n`;
      generatedBlog.keyTakeaways.forEach(takeaway => {
        markdown += `- ${takeaway}\n`;
      });
      markdown += '\n';
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedBlog.titles[0].replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Enhanced Blog AI Generator</h1>
        <p className="text-muted-foreground">
          Generate comprehensive, research-driven blog posts that rank and convert
        </p>
      </div>

      {/* Success Alert */}
      {savedBlogId && generatedBlog && (
        <Alert className="border-green-200 bg-green-50">
          <Bell className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-green-800">
              ✅ Blog post &quot;{generatedBlog.titles[0]}&quot; has been saved and is ready for editing!
            </span>
            <Button asChild size="sm" className="ml-4">
              <Link href={`/dashboard/blog/${savedBlogId}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit in Blog Editor
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Blog Configuration
            </CardTitle>
            <CardDescription>
              Configure your blog post requirements and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., AI-Powered Content Marketing Strategies"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience *</Label>
              <Input
                id="audience"
                placeholder="e.g., Digital marketing managers at SaaS companies"
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={formData.tone} onValueChange={(value: any) => setFormData(prev => ({ ...prev, tone: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={formData.length} onValueChange={(value: any) => setFormData(prev => ({ ...prev, length: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (800-1,200 words)</SelectItem>
                    <SelectItem value="medium">Medium (1,500-2,500 words)</SelectItem>
                    <SelectItem value="long">Long (2,500-4,000 words)</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive (4,000+ words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry (Optional)</Label>
              <Input
                id="industry"
                placeholder="e.g., SaaS, E-commerce, Healthcare"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>SEO Keywords</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button onClick={handleAddKeyword} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.seoKeywords.map(keyword => (
                  <Badge key={keyword} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveKeyword(keyword)}>
                    {keyword} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content Outline (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add section point"
                  value={outlineInput}
                  onChange={(e) => setOutlineInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddOutlinePoint()}
                />
                <Button onClick={handleAddOutlinePoint} variant="outline">Add</Button>
              </div>
              <div className="space-y-1 mt-2">
                {formData.outline.map((point, index) => (
                  <div key={point} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{index + 1}. {point}</span>
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveOutlinePoint(point)}>×</Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="research"
                  checked={formData.includeResearch}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeResearch: !!checked }))}
                />
                <Label htmlFor="research">Include research and data</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="examples"
                  checked={formData.includeExamples}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeExamples: !!checked }))}
                />
                <Label htmlFor="examples">Include examples and case studies</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="competitor"
                  checked={formData.competitorAnalysis}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, competitorAnalysis: !!checked }))}
                />
                <Label htmlFor="competitor">Include competitor analysis</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Call-to-Action Type</Label>
              <Select value={formData.callToActionType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, callToActionType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newsletter">Newsletter Signup</SelectItem>
                  <SelectItem value="product">Product Promotion</SelectItem>
                  <SelectItem value="service">Service Inquiry</SelectItem>
                  <SelectItem value="download">Resource Download</SelectItem>
                  <SelectItem value="contact">Contact Form</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !formData.topic || !formData.targetAudience}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Blog Post...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Blog Post
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Content
            </CardTitle>
            <CardDescription>
              Your AI-generated blog post and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedBlog ? (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {generatedBlog.estimatedReadTime} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        {generatedBlog.wordCount} words
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(JSON.stringify(generatedBlog, null, 2))}>
                        Copy JSON
                      </Button>
                      <Button size="sm" variant="outline" onClick={exportAsMarkdown}>
                        Export MD
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Title Options</h3>
                      {generatedBlog.titles.map((title, index) => (
                        <div key={index} className="p-2 bg-muted rounded cursor-pointer hover:bg-muted/80" onClick={() => copyToClipboard(title)}>
                          {title}
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Introduction</h3>
                      <div className="p-3 bg-muted rounded text-sm whitespace-pre-wrap">
                        {generatedBlog.introduction}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Table of Contents</h3>
                      <div className="space-y-1">
                        {generatedBlog.tableOfContents.map((item, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            {index + 1}. {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Sections ({generatedBlog.sections.length})</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {generatedBlog.sections.map((section, index) => (
                          <div key={index} className="border rounded p-3">
                            <h4 className="font-medium mb-2">{section.heading}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {section.content.substring(0, 200)}...
                            </p>
                            {section.subsections && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                {section.subsections.length} subsections
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Meta Description</h3>
                    <div className="p-3 bg-muted rounded text-sm cursor-pointer hover:bg-muted/80" onClick={() => copyToClipboard(generatedBlog.metaDescription)}>
                      {generatedBlog.metaDescription}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">SEO Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {generatedBlog.seoKeywords.map(keyword => (
                        <Badge key={keyword} variant="outline">
                          <Hash className="h-3 w-3 mr-1" />
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {generatedBlog.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Key Takeaways</h3>
                    <div className="space-y-2">
                      {generatedBlog.keyTakeaways.map((takeaway, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-muted-foreground">{index + 1}.</span>
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Social Media Snippets</h3>
                    <div className="space-y-2">
                      {generatedBlog.socialMediaSnippets.map((snippet, index) => (
                        <div key={index} className="p-3 bg-muted rounded text-sm cursor-pointer hover:bg-muted/80" onClick={() => copyToClipboard(snippet)}>
                          {snippet}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="research" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Research Foundation</h3>
                    <div className="p-3 bg-muted rounded text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {research || 'No research data available'}
                    </div>
                  </div>

                  {generatedBlog.researchSources.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Research Sources</h3>
                      <div className="space-y-1">
                        {generatedBlog.researchSources.map((source, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            {index + 1}. {source}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your blog post settings and click &quot;Generate Blog Post&quot; to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}