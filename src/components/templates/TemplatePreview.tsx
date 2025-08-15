"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExternalLink, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Component } from "@/lib/types";
import { renderWebsiteComponent } from "@/components/website/RenderWebsiteComponent";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { rateLimitHandler } from "@/lib/rate-limit-handler";
import { loadImagesInBatch } from "@/lib/rate-limit-prevention";

interface TemplatePreviewProps {
  templateId: string;
  title: string;
  components: Component[];
  children: React.ReactNode;
  templateType?: "website" | "funnel";
}

export function TemplatePreview({
  templateId,
  title,
  components,
  children,
  templateType = "website",
}: TemplatePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState({
    loaded: 0,
    total: 0,
  });
  const [rateLimitDetected, setRateLimitDetected] = useState(false);
  const [preloadError, setPreloadError] = useState<string | null>(null);

  // Extract image URLs from components
  const extractImageUrls = (components: Component[]): string[] => {
    const urls: string[] = [];
    components.forEach((component) => {
      if (component.content?.src && typeof component.content.src === "string") {
        urls.push(component.content.src);
      }
      if (
        component.design?.backgroundImage &&
        typeof component.design.backgroundImage === "string"
      ) {
        urls.push(component.design.backgroundImage);
      }
    });
    return urls.filter((url) => url.startsWith("http"));
  };

  // Handle dialog open with image preloading
  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    if (open && !isPreloading) {
      setIsPreloading(true);
      setRateLimitDetected(false);
      setPreloadError(null);

      try {
        // Clear any existing rate limits before starting
        rateLimitHandler.clearAllRateLimits();

        // Extract and preload critical images
        const imageUrls = extractImageUrls(components).slice(0, 4); // Only first 4 images

        if (imageUrls.length > 0) {
          const result = await loadImagesInBatch(imageUrls, {
            batchSize: 1,
            delayBetweenBatches: 1000,
            onProgress: (loaded, total) => {
              setPreloadProgress({ loaded, total });
            },
          });

          if (result.failed > 0) {
            setPreloadError(
              `${result.failed} images failed to load, but the preview is available.`
            );
          }
        }
      } catch (error) {
        console.warn("Error during image preloading:", error);

        // Check if this is a rate limiting error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const isRateLimit =
          errorMessage.includes("rate limit") ||
          errorMessage.includes("429") ||
          errorMessage.includes("too many requests");

        if (isRateLimit) {
          setRateLimitDetected(true);
          setPreloadError(
            "Images are loading slowly due to server limits. This is normal."
          );
        } else {
          setPreloadError(
            "Some images may load slowly, but the preview is available."
          );
        }
      } finally {
        setIsPreloading(false);
      }
    }
  };

  // Handle retry for rate limited images
  const handleRetryPreload = async () => {
    setIsPreloading(true);
    setRateLimitDetected(false);
    setPreloadError(null);

    // Clear rate limits and try again
    rateLimitHandler.clearAllRateLimits();

    // Simple retry - just clear the error state
    setTimeout(() => {
      setIsPreloading(false);
      setPreloadError(null);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <DialogDescription className="sr-only">
              This dialog shows a preview of the selected website template.
            </DialogDescription>
            <div className="flex items-center gap-2">
              <span>Preview: {title}</span>
              {isPreloading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    Loading images ({preloadProgress.loaded}/
                    {preloadProgress.total})
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Clear any existing rate limits before navigation
                rateLimitHandler.clearAllRateLimits();

                // Navigate to the editor
                const editorUrl =
                  templateType === "funnel"
                    ? `/dashboard/funnels/${templateId}`
                    : `/dashboard/websites/${templateId}`;
                window.location.href = editorUrl;
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Edit Template
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Rate limiting or error notification */}
        {(rateLimitDetected || preloadError) && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <div className="text-sm">
                <div className="font-medium text-amber-800">
                  {rateLimitDetected
                    ? "Images Loading Slowly"
                    : "Loading Issue"}
                </div>
                <div className="text-amber-700">
                  {preloadError ||
                    "Some images are taking longer to load due to server rate limits. This is normal and the preview will work fine."}
                </div>
              </div>
            </div>
            {rateLimitDetected && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryPreload}
                disabled={isPreloading}
                className="ml-2"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${
                    isPreloading ? "animate-spin" : ""
                  }`}
                />
                Retry
              </Button>
            )}
          </div>
        )}

        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="scale-75 origin-top-left w-[133.33%] h-[133.33%] overflow-hidden">
            <div className="min-h-screen bg-white">
              {templateType === "funnel" ? (
                <TemplateRenderer components={components} />
              ) : (
                components.map((component, index) =>
                  renderWebsiteComponent(component, index)
                )
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
