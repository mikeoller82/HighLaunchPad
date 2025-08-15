"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PlusCircle,
  Lightbulb,
  Eye,
  Users,
  Edit,
  Globe,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { LazyImage } from "@/components/ui/LazyImage";
// Removed template-error-monitor import - using simple error handling
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { TemplatePreview } from "@/components/templates/TemplatePreview";

interface UserWorkspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function WebsitesPage() {
  const [isCreating, setIsCreating] = useState<string | null>(null);
  const [userWorkspaces, setUserWorkspaces] = useState<UserWorkspace[]>([]);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);
  const [websiteTemplates, setWebsiteTemplates] = useState<any[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load website templates with rate limiting protection
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplatesLoading(true);
        setTemplatesError(null);

        // Use dynamic import with rate limiting protection
        const { websiteTemplates } = await import("@/lib/website-templates");
        const templates = await websiteTemplates;

        // Validate templates before setting
        const validatedTemplates = (templates || []).map((template: any) => ({
          ...template,
          // Ensure all required properties exist
          id: template.id || `template-${Date.now()}`,
          title: template.title || "Untitled Template",
          description: template.description || "No description available",
          image: template.image || "/placeholder-image.jpg",
          hint: template.hint || "",
          aiInsight: template.aiInsight || "No insights available",
          stats: {
            visitors: template.stats?.visitors || "0",
            leads: template.stats?.leads || "0",
            conversion: template.stats?.conversion || "0%",
          },
          components: template.components || [],
        }));

        setWebsiteTemplates(validatedTemplates);
      } catch (error) {
        console.error("Error loading website templates:", error);
        setTemplatesError("Failed to load website templates");
        setWebsiteTemplates([]);
      } finally {
        setTemplatesLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Fetch user workspaces
  useEffect(() => {
    const fetchUserWorkspaces = async () => {
      if (!user) {
        setIsLoadingWorkspaces(false);
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const response = await fetch("/api/workspaces", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserWorkspaces(data.workspaces || []);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      } finally {
        setIsLoadingWorkspaces(false);
      }
    };

    fetchUserWorkspaces();
  }, [user]);

  // Helper function to find user workspace for a template
  const getUserWorkspaceForTemplate = (templateId: string) => {
    return userWorkspaces.find(
      (workspace) =>
        workspace.name?.includes(templateId) ||
        workspace.id?.includes(templateId)
    );
  };

  const handleCreateWorkspace = async (templateId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to create a workspace.",
      });
      return;
    }

    setIsCreating(templateId);
    try {
      // Clear any existing rate limits before navigation (following the preview pattern)
      const { rateLimitHandler } = await import("@/lib/rate-limit-handler");
      rateLimitHandler.clearAllRateLimits();

      // Navigate directly to the website editor with the template (following the preview pattern)
      const editorUrl = `/dashboard/websites/${templateId}`;
      window.location.href = editorUrl;

      toast({
        title: "Loading Template",
        description: "Opening the website editor with your selected template.",
      });
    } catch (error) {
      console.error("Error loading template:", error);
      toast({
        variant: "destructive",
        title: "Loading Failed",
        description: "Failed to load template. Please try again.",
      });
    } finally {
      setIsCreating(null);
    }
  };

  if (templatesLoading || isLoadingWorkspaces) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading templates...</span>
      </div>
    );
  }

  if (templatesError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Website Templates
            </h2>
            <p className="text-red-600">
              {templatesError}. Please try refreshing the page.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/websites/default">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Blank Website
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">
            Failed to load templates. Please refresh the page or try again
            later.
          </p>
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
          <h2 className="text-2xl font-bold tracking-tight">
            Website Templates
          </h2>
          <p className="text-blue-600">
            Create a professional website from a pre-built template.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/websites/default">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Blank Website
          </Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {websiteTemplates.length > 0 ? (
          websiteTemplates.map((website) => {
            return (
              <Card key={website.id} className="overflow-hidden flex flex-col">
                <div className="relative h-48 w-full">
                  <LazyImage
                    src={website.image}
                    alt={website.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={website.hint}
                    priority={5}
                    fallbackSrc="/placeholder-website.jpg"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{website.title}</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Lightbulb className="h-4 w-4 text-amber-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="max-w-xs text-center">
                            {website.aiInsight}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="h-10 pt-1">
                    {website.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="font-bold">{website.stats.visitors}</span>
                    <span className="text-blue-600">Visitors</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-bold">{website.stats.leads}</span>
                    <span className="text-blue-600">Leads</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-2">
                    <span className="text-lg font-bold">
                      {website.stats.conversion || "0%"}
                    </span>
                    <span className="text-blue-600">Conv. Rate</span>
                  </div>
                </CardContent>
                <CardFooter
                  className="mt-auto grid gap-2 pt-4"
                  style={{ gridTemplateColumns: "1fr 1fr" }}
                >
                  <TemplatePreview
                    templateId={website.id}
                    title={website.title}
                    components={website.components}
                  >
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                  </TemplatePreview>
                  <Button
                    className="w-full"
                    onClick={() => handleCreateWorkspace(website.id)}
                    disabled={isCreating === website.id}
                  >
                    {isCreating === website.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" /> Use Template
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              No website templates available at the moment.
            </p>
          </div>
        )}
        <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[450px]">
          <Button asChild variant="ghost" className="h-full w-full">
            <Link
              href="/dashboard/websites/default"
              className="flex flex-col items-center justify-center h-full w-full text-center"
            >
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Globe className="h-12 w-12 text-primary" />
              </div>
              <p className="font-semibold">Start From Scratch</p>
              <p className="text-sm text-blue-600 px-4">
                Build a professional website with a blank canvas.
              </p>
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
