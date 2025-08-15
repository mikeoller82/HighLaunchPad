"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { optimizedApiCall } from "@/lib/global-request-optimizer";
import {
  Loader2,
  FileText,
  Target,
  Zap,
  BarChart3,
  Eye,
  Clock,
  Hash,
  Calendar,
  Share2,
  TrendingUp,
  Settings,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

interface NicheSettings {
  niche: string;
  targetAudience: string;
  contentPillars: string[];
  socialPlatforms: SocialPlatform[];
  postingFrequency: "daily" | "weekly" | "bi-weekly";
  tone:
    | "professional"
    | "casual"
    | "authoritative"
    | "conversational"
    | "technical";
}

interface BlogRequest {
  topic: string;
  length: "short" | "medium" | "long" | "comprehensive";
  includeResearch: boolean;
  seoKeywords: string[];
  outline: string[];
}

interface SocialRequest {
  topic: string;
  platforms: SocialPlatform[];
  contentType: "post" | "thread" | "story" | "reel" | "carousel";
  callToAction: string;
}

interface ScheduledPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  scheduledDate: Date;
  status: "scheduled" | "posted" | "failed";
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  };
}

type SocialPlatform =
  | "twitter"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube";

export function NicheContentManager() {
  const [nicheSettings, setNicheSettings] = useState<NicheSettings>({
    niche: "",
    targetAudience: "",
    contentPillars: [],
    socialPlatforms: ["twitter", "linkedin"],
    postingFrequency: "weekly",
    tone: "professional",
  });

  const [isNicheSet, setIsNicheSet] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [contentPlan, setContentPlan] = useState<any>(null);
  const [socialPlan, setSocialPlan] = useState<any>(null);
  const [agentsStatus, setAgentsStatus] = useState({
    contentAgent: "idle",
    socialAgent: "idle",
  });

  const { toast } = useToast();
  const { user } = useAuth();

  // Blog generation state
  const [blogRequest, setBlogRequest] = useState<BlogRequest>({
    topic: "",
    length: "medium",
    includeResearch: true,
    seoKeywords: [],
    outline: [],
  });

  // Social media generation state
  const [socialRequest, setSocialRequest] = useState<SocialRequest>({
    topic: "",
    platforms: ["twitter", "linkedin"],
    contentType: "post",
    callToAction: "Engage with this content",
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [outlineInput, setOutlineInput] = useState("");
  const [pillarInput, setPillarInput] = useState("");

  // Initialize agents when niche is set
  const handleSetNiche = async () => {
    if (!nicheSettings.niche || !nicheSettings.targetAudience) {
      toast({
        title: "Missing Information",
        description: "Please provide both niche and target audience.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);

      // Initialize content creation agent
      const contentData = await optimizedApiCall(
        "/api/ai/agents/content/set-niche",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            niche: nicheSettings.niche,
            topics: nicheSettings.contentPillars,
          }),
          debounceMs: 2000,
          cacheKey: `set-niche-content-${user?.uid}`,
        }
      );

      // Initialize social media agent
      const socialData = await optimizedApiCall(
        "/api/ai/agents/social/set-niche",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            niche: nicheSettings.niche,
            platforms: nicheSettings.socialPlatforms,
          }),
          debounceMs: 2000,
          cacheKey: `set-niche-social-${user?.uid}`,
        }
      );

      if (contentData && socialData) {
        setContentPlan(contentData.plan);
        setSocialPlan(socialData.plan);
        setIsNicheSet(true);

        // Load scheduled posts
        loadScheduledPosts();

        toast({
          title: "Niche Set Successfully!",
          description: `Both agents are now configured for "${nicheSettings.niche}" niche.`,
        });
      }
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to configure agents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const loadScheduledPosts = async () => {
    try {
      // Get user ID from auth context or localStorage
      const userId = user?.uid || localStorage.getItem("userId") || "anonymous";

      const data = await optimizedApiCall(
        "/api/ai/agents/social/scheduled-posts",
        {
          method: "GET",
          headers: {
            "x-user-id": userId,
          },
          debounceMs: 3000,
          cacheKey: `scheduled-posts-${userId}`,
        }
      );

      if (data) {
        setScheduledPosts(data.posts || []);

        // Update analytics if available
        if (data.analytics) {
          console.log("Social Media Analytics:", data.analytics);
        }
      }
    } catch (error) {
      console.error("Failed to load scheduled posts:", error);
    }
  };

  const handleGenerateBlog = async () => {
    if (!isNicheSet) {
      toast({
        title: "Niche Required",
        description:
          "Please set your niche first before generating blog posts.",
        variant: "destructive",
      });
      return;
    }

    if (!blogRequest.topic) {
      toast({
        title: "Topic Required",
        description: "Please provide a topic for your blog post.",
        variant: "destructive",
      });
      return;
    }

    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY ||
      localStorage.getItem("google_ai_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Google AI API key in settings.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setAgentsStatus((prev) => ({ ...prev, contentAgent: "working" }));

    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to generate blog posts.",
          variant: "destructive",
        });
        return;
      }

      // First set the niche for the AI agent
      const idToken = await user.getIdToken();
      await fetch("/api/ai-agents/content-creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          action: "set_niche",
          niche: nicheSettings.niche,
          topics: [],
        }),
      });

      // Then generate the blog post using the AI agent
      const result = await optimizedApiCall("/api/ai-agents/content-creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          action: "generate_blog",
          ...blogRequest,
          niche: nicheSettings.niche,
          targetAudience: nicheSettings.targetAudience,
          tone: nicheSettings.tone,
          apiKey,
        }),
        debounceMs: 3000,
        cacheKey: `generate-blog-${user.uid}-${blogRequest.topic}`,
      });

      if (result && result.blogPost) {
        // Open blog post in new tab or modal
        const blogWindow = window.open("", "_blank");
        if (blogWindow) {
          blogWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${result.blogPost.title}</title>
              </head>
              <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h1>${result.blogPost.title}</h1>
                <p><strong>Meta Description:</strong> ${
                  result.blogPost.metaDescription
                }</p>
                <div>${result.blogPost.introduction}</div>
                ${result.blogPost.sections
                  .map(
                    (section: any) => `
                  <h2>${section.heading}</h2>
                  <div>${section.content}</div>
                  ${
                    section.subsections
                      ? section.subsections
                          .map(
                            (sub: any) => `
                    <h3>${sub.subheading}</h3>
                    <div>${sub.content}</div>
                  `
                          )
                          .join("")
                      : ""
                  }
                `
                  )
                  .join("")}
                <div>${result.blogPost.conclusion}</div>
                <p><strong>Call to Action:</strong> ${
                  result.blogPost.callToAction
                }</p>
                <p><strong>Tags:</strong> ${result.blogPost.tags.join(", ")}</p>
                <p><strong>Read Time:</strong> ${
                  result.blogPost.estimatedReadTime
                } minutes</p>
                <p><strong>SEO Score:</strong> ${
                  result.blogPost.seoScore
                }/100</p>
              </body>
            </html>
          `);
        }

        toast({
          title: "Blog Post Generated!",
          description: `Created a ${result.blogPost.estimatedReadTime}-minute read about "${blogRequest.topic}".`,
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setAgentsStatus((prev) => ({ ...prev, contentAgent: "idle" }));
    }
  };

  const handleGenerateSocial = async () => {
    if (!isNicheSet) {
      toast({
        title: "Niche Required",
        description:
          "Please set your niche first before generating social media content.",
        variant: "destructive",
      });
      return;
    }

    if (!socialRequest.topic) {
      toast({
        title: "Topic Required",
        description: "Please provide a topic for your social media content.",
        variant: "destructive",
      });
      return;
    }

    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY ||
      localStorage.getItem("google_ai_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Google AI API key in settings.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setAgentsStatus((prev) => ({ ...prev, socialAgent: "working" }));

    try {
      const result = await optimizedApiCall("/api/ai/agents/social/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...socialRequest,
          niche: nicheSettings.niche,
          targetAudience: nicheSettings.targetAudience,
          tone: nicheSettings.tone,
          apiKey,
        }),
        debounceMs: 3000,
        cacheKey: `generate-social-${user?.uid}-${socialRequest.topic}`,
      });

      if (result) {
        // Refresh scheduled posts
        loadScheduledPosts();

        toast({
          title: "Social Content Generated!",
          description: `Created and scheduled content for ${socialRequest.platforms.join(
            ", "
          )}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description:
          "Failed to generate social media content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setAgentsStatus((prev) => ({ ...prev, socialAgent: "idle" }));
    }
  };

  const addKeyword = () => {
    if (
      keywordInput.trim() &&
      !blogRequest.seoKeywords.includes(keywordInput.trim())
    ) {
      setBlogRequest((prev) => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, keywordInput.trim()],
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setBlogRequest((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((k) => k !== keyword),
    }));
  };

  const addOutlinePoint = () => {
    if (
      outlineInput.trim() &&
      !blogRequest.outline.includes(outlineInput.trim())
    ) {
      setBlogRequest((prev) => ({
        ...prev,
        outline: [...prev.outline, outlineInput.trim()],
      }));
      setOutlineInput("");
    }
  };

  const removeOutlinePoint = (point: string) => {
    setBlogRequest((prev) => ({
      ...prev,
      outline: prev.outline.filter((p) => p !== point),
    }));
  };

  const addContentPillar = () => {
    if (
      pillarInput.trim() &&
      !nicheSettings.contentPillars.includes(pillarInput.trim())
    ) {
      setNicheSettings((prev) => ({
        ...prev,
        contentPillars: [...prev.contentPillars, pillarInput.trim()],
      }));
      setPillarInput("");
    }
  };

  const removeContentPillar = (pillar: string) => {
    setNicheSettings((prev) => ({
      ...prev,
      contentPillars: prev.contentPillars.filter((p) => p !== pillar),
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "working":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "idle":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          AI Content & Social Media Manager
        </h1>
        <p className="text-muted-foreground">
          Set your niche and let AI agents create comprehensive blog posts and
          manage your social media
        </p>
      </div>

      {/* Agent Status Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(agentsStatus.contentAgent)}
                <span className="text-sm">Content Agent</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(agentsStatus.socialAgent)}
                <span className="text-sm">Social Media Agent</span>
              </div>
            </div>
            <Badge variant={isNicheSet ? "default" : "secondary"}>
              {isNicheSet ? `Niche: ${nicheSettings.niche}` : "No Niche Set"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Niche Configuration */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Niche Configuration
            </CardTitle>
            <CardDescription>
              Set your niche and content strategy before generating content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="niche">Your Niche *</Label>
              <Input
                id="niche"
                placeholder="e.g., Digital Marketing, AI Development, Fitness"
                value={nicheSettings.niche}
                onChange={(e) =>
                  setNicheSettings((prev) => ({
                    ...prev,
                    niche: e.target.value,
                  }))
                }
                disabled={isNicheSet}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience *</Label>
              <Input
                id="audience"
                placeholder="e.g., Small business owners, Tech professionals"
                value={nicheSettings.targetAudience}
                onChange={(e) =>
                  setNicheSettings((prev) => ({
                    ...prev,
                    targetAudience: e.target.value,
                  }))
                }
                disabled={isNicheSet}
              />
            </div>

            <div className="space-y-2">
              <Label>Content Tone</Label>
              <Select
                value={nicheSettings.tone}
                onValueChange={(value: any) =>
                  setNicheSettings((prev) => ({ ...prev, tone: value }))
                }
                disabled={isNicheSet}
              >
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
              <Label>Content Pillars</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add content pillar"
                  value={pillarInput}
                  onChange={(e) => setPillarInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addContentPillar()}
                  disabled={isNicheSet}
                />
                <Button
                  onClick={addContentPillar}
                  variant="outline"
                  disabled={isNicheSet}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {nicheSettings.contentPillars.map((pillar) => (
                  <Badge
                    key={pillar}
                    variant="secondary"
                    className={!isNicheSet ? "cursor-pointer" : ""}
                    onClick={() => !isNicheSet && removeContentPillar(pillar)}
                  >
                    {pillar} {!isNicheSet && "×"}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Social Media Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  ["twitter", "linkedin", "facebook", "instagram"] as const
                ).map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={nicheSettings.socialPlatforms.includes(platform)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNicheSettings((prev) => ({
                            ...prev,
                            socialPlatforms: [
                              ...prev.socialPlatforms,
                              platform,
                            ],
                          }));
                        } else {
                          setNicheSettings((prev) => ({
                            ...prev,
                            socialPlatforms: prev.socialPlatforms.filter(
                              (p) => p !== platform
                            ),
                          }));
                        }
                      }}
                      disabled={isNicheSet}
                    />
                    <Label htmlFor={platform} className="capitalize">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSetNiche}
              disabled={
                isGenerating ||
                !nicheSettings.niche ||
                !nicheSettings.targetAudience ||
                isNicheSet
              }
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Up Agents...
                </>
              ) : isNicheSet ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Niche Configured
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Configure Agents
                </>
              )}
            </Button>

            {isNicheSet && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsNicheSet(false);
                  setContentPlan(null);
                  setSocialPlan(null);
                  setScheduledPosts([]);
                }}
                className="w-full"
              >
                Reset Configuration
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Content Generation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Generation
            </CardTitle>
            <CardDescription>
              Generate blog posts and social media content for your niche
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="blog" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="blog">Blog Posts</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
              </TabsList>

              <TabsContent value="blog" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="blog-topic">Blog Topic *</Label>
                    <Input
                      id="blog-topic"
                      placeholder={`e.g., Advanced ${nicheSettings.niche} Strategies for 2024`}
                      value={blogRequest.topic}
                      onChange={(e) =>
                        setBlogRequest((prev) => ({
                          ...prev,
                          topic: e.target.value,
                        }))
                      }
                      disabled={!isNicheSet}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Length</Label>
                      <Select
                        value={blogRequest.length}
                        onValueChange={(value: any) =>
                          setBlogRequest((prev) => ({ ...prev, length: value }))
                        }
                        disabled={!isNicheSet}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">
                            Short (800-1,200 words)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (1,500-2,500 words)
                          </SelectItem>
                          <SelectItem value="long">
                            Long (2,500-4,000 words)
                          </SelectItem>
                          <SelectItem value="comprehensive">
                            Comprehensive (4,000+ words)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="research"
                        checked={blogRequest.includeResearch}
                        onCheckedChange={(checked) =>
                          setBlogRequest((prev) => ({
                            ...prev,
                            includeResearch: !!checked,
                          }))
                        }
                        disabled={!isNicheSet}
                      />
                      <Label htmlFor="research">Include research & data</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>SEO Keywords</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add keyword"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                        disabled={!isNicheSet}
                      />
                      <Button
                        onClick={addKeyword}
                        variant="outline"
                        disabled={!isNicheSet}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {blogRequest.seoKeywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeKeyword(keyword)}
                        >
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
                        onKeyPress={(e) =>
                          e.key === "Enter" && addOutlinePoint()
                        }
                        disabled={!isNicheSet}
                      />
                      <Button
                        onClick={addOutlinePoint}
                        variant="outline"
                        disabled={!isNicheSet}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="space-y-1 mt-2">
                      {blogRequest.outline.map((point, index) => (
                        <div
                          key={point}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <span className="text-sm">
                            {index + 1}. {point}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeOutlinePoint(point)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateBlog}
                    disabled={!isNicheSet || isGenerating || !blogRequest.topic}
                    className="w-full"
                  >
                    {isGenerating && agentsStatus.contentAgent === "working" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Blog Post...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Blog Post
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="social-topic">Social Media Topic *</Label>
                    <Input
                      id="social-topic"
                      placeholder={`e.g., Quick ${nicheSettings.niche} tip for beginners`}
                      value={socialRequest.topic}
                      onChange={(e) =>
                        setSocialRequest((prev) => ({
                          ...prev,
                          topic: e.target.value,
                        }))
                      }
                      disabled={!isNicheSet}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Content Type</Label>
                      <Select
                        value={socialRequest.contentType}
                        onValueChange={(value: any) =>
                          setSocialRequest((prev) => ({
                            ...prev,
                            contentType: value,
                          }))
                        }
                        disabled={!isNicheSet}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="post">Regular Post</SelectItem>
                          <SelectItem value="thread">
                            Thread/Carousel
                          </SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="reel">Reel/Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Call to Action</Label>
                      <Input
                        placeholder="e.g., Follow for more tips"
                        value={socialRequest.callToAction}
                        onChange={(e) =>
                          setSocialRequest((prev) => ({
                            ...prev,
                            callToAction: e.target.value,
                          }))
                        }
                        disabled={!isNicheSet}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Platforms</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {nicheSettings.socialPlatforms.map((platform) => (
                        <div
                          key={platform}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`social-${platform}`}
                            checked={socialRequest.platforms.includes(platform)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSocialRequest((prev) => ({
                                  ...prev,
                                  platforms: [...prev.platforms, platform],
                                }));
                              } else {
                                setSocialRequest((prev) => ({
                                  ...prev,
                                  platforms: prev.platforms.filter(
                                    (p) => p !== platform
                                  ),
                                }));
                              }
                            }}
                            disabled={!isNicheSet}
                          />
                          <Label
                            htmlFor={`social-${platform}`}
                            className="capitalize"
                          >
                            {platform}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateSocial}
                    disabled={
                      !isNicheSet ||
                      isGenerating ||
                      !socialRequest.topic ||
                      socialRequest.platforms.length === 0
                    }
                    className="w-full"
                  >
                    {isGenerating && agentsStatus.socialAgent === "working" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating & Scheduling...
                      </>
                    ) : (
                      <>
                        <Share2 className="mr-2 h-4 w-4" />
                        Generate & Schedule Content
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Posts & Analytics */}
      {isNicheSet && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduled Posts
              </CardTitle>
              <CardDescription>
                Upcoming social media posts scheduled by the AI agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {scheduledPosts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        No scheduled posts yet. Generate some social media
                        content to get started!
                      </p>
                    </div>
                  ) : (
                    scheduledPosts.map((post) => (
                      <div
                        key={post.id}
                        className="border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize">
                            {post.platform}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                post.status === "posted"
                                  ? "default"
                                  : post.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {post.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(post.scheduledDate)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm line-clamp-2">{post.content}</p>
                        {post.engagement && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>👍 {post.engagement.likes}</span>
                            <span>💬 {post.engagement.comments}</span>
                            <span>🔄 {post.engagement.shares}</span>
                            <span>
                              📊 {post.engagement.engagementRate.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Content Strategy
              </CardTitle>
              <CardDescription>
                Your AI-generated content plan and strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPlan && (
                  <div>
                    <h4 className="font-semibold mb-2">Blog Content Plan</h4>
                    <div className="space-y-1">
                      {contentPlan.topics
                        ?.slice(0, 5)
                        .map((topic: string, index: number) => (
                          <div
                            key={index}
                            className="text-sm p-2 bg-muted rounded"
                          >
                            {index + 1}. {topic}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {socialPlan && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      Social Media Strategy
                    </h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Content Pillars:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {socialPlan.contentPillars
                            ?.slice(0, 3)
                            .map((pillar: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {pillar}
                              </Badge>
                            ))}
                        </div>
                      </div>
                      <div className="text-sm">
                        <strong>Posting Schedule:</strong>{" "}
                        {nicheSettings.postingFrequency}
                      </div>
                      <div className="text-sm">
                        <strong>Platforms:</strong>{" "}
                        {nicheSettings.socialPlatforms.join(", ")}
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadScheduledPosts}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
