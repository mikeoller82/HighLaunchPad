"use client";

import React, { useState, useCallback, useEffect } from "react";
import { websiteTemplates } from "@/lib/website-templates";
import type { Component, ComponentType } from "@/lib/types";
import { renderWebsiteComponent } from "./RenderWebsiteComponent";
import { renderEditorWebsiteComponent } from "./EditorWebsiteComponent";
import { defaultContent } from "@/lib/default-content";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useOptimizedFetch } from "@/hooks/use-optimized-firestore";
import { loadImagesInBatch } from "@/lib/rate-limit-prevention";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StylePanel } from "./StylePanel";
import {
  Plus,
  Trash2,
  Copy,
  Move,
  Eye,
  EyeOff,
  Settings,
  Layout,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Undo,
  Redo,
  Grid,
  Layers,
  MousePointer,
  Zap,
  Image as ImageIcon,
  Video,
  FileText,
  Star,
  Users,
  Mail,
  MapPin,
  Calendar,
  ShoppingCart,
  CreditCard,
  BarChart3,
  MessageSquare,
  Globe,
  Maximize,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WebsiteData {
  components: Component[];
}

interface WebsiteBuilderProps {
  templateId: string;
  renderComponent?: (component: Component) => React.ReactNode;
  mode?: "edit" | "preview";
}

// Element Library Components
const ELEMENT_LIBRARY = {
  "Basic Elements": [
    {
      type: "text",
      icon: FileText,
      label: "Text Block",
      description: "Rich text content",
    },
    {
      type: "image",
      icon: ImageIcon,
      label: "Image",
      description: "Single image with caption",
    },
    {
      type: "video",
      icon: Video,
      label: "Video",
      description: "Embedded video player",
    },
    {
      type: "button",
      icon: MousePointer,
      label: "Button",
      description: "Call-to-action button",
    },
    {
      type: "customHtml",
      icon: Globe,
      label: "HTML",
      description: "Custom HTML code",
    },
  ],
  "Layout Sections": [
    {
      type: "header",
      icon: Layout,
      label: "Header",
      description: "Navigation header",
    },
    {
      type: "hero",
      icon: Star,
      label: "Hero Section",
      description: "Main banner area",
    },
    {
      type: "features",
      icon: Grid,
      label: "Features",
      description: "Feature showcase grid",
    },
    {
      type: "pricing",
      icon: CreditCard,
      label: "Pricing",
      description: "Pricing tables",
    },
    {
      type: "testimonials",
      icon: MessageSquare,
      label: "Testimonials",
      description: "Customer reviews",
    },
    {
      type: "footer",
      icon: Layout,
      label: "Footer",
      description: "Bottom page section",
    },
  ],
  "Content Blocks": [
    {
      type: "gallery",
      icon: ImageIcon,
      label: "Gallery",
      description: "Image gallery grid",
    },
    {
      type: "team",
      icon: Users,
      label: "Team",
      description: "Team member profiles",
    },
    {
      type: "stats",
      icon: BarChart3,
      label: "Statistics",
      description: "Number counters",
    },
    {
      type: "timeline",
      icon: Calendar,
      label: "Timeline",
      description: "Process timeline",
    },
    {
      type: "portfolio",
      icon: Grid,
      label: "Portfolio",
      description: "Project showcase",
    },
    {
      type: "brands",
      icon: Star,
      label: "Brands",
      description: "Logo showcase",
    },
  ],
  Interactive: [
    {
      type: "contact",
      icon: Mail,
      label: "Contact Form",
      description: "Contact form with fields",
    },
    {
      type: "newsletter",
      icon: Mail,
      label: "Newsletter",
      description: "Email signup form",
    },
    {
      type: "accordion",
      icon: Layers,
      label: "Accordion",
      description: "Collapsible content",
    },
    {
      type: "tabs",
      icon: Layers,
      label: "Tabs",
      description: "Tabbed content",
    },
    { type: "map", icon: MapPin, label: "Map", description: "Interactive map" },
    {
      type: "countdown",
      icon: Calendar,
      label: "Countdown",
      description: "Timer countdown",
    },
  ],
  "E-commerce": [
    {
      type: "products",
      icon: ShoppingCart,
      label: "Products",
      description: "Product grid",
    },
    {
      type: "cart",
      icon: ShoppingCart,
      label: "Shopping Cart",
      description: "Cart widget",
    },
    {
      type: "checkout",
      icon: CreditCard,
      label: "Checkout",
      description: "Payment form",
    },
    {
      type: "reviews",
      icon: Star,
      label: "Reviews",
      description: "Product reviews",
    },
  ],
  Marketing: [
    {
      type: "cta",
      icon: Zap,
      label: "Call to Action",
      description: "Conversion section",
    },
    {
      type: "popup",
      icon: Maximize,
      label: "Popup",
      description: "Modal popup",
    },
    {
      type: "banner",
      icon: Layout,
      label: "Banner",
      description: "Promotional banner",
    },
    {
      type: "socialProof",
      icon: Users,
      label: "Social Proof",
      description: "Trust indicators",
    },
  ],
};

// Simple Element Component
const ElementItem = ({
  element,
  onAdd,
}: {
  element: any;
  onAdd: (type: ComponentType) => void;
}) => {
  const IconComponent = element.icon;

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50"
      onClick={() => onAdd(element.type)}
    >
      <IconComponent className="h-5 w-5 text-gray-600" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{element.label}</p>
        <p className="text-xs text-gray-600 truncate">{element.description}</p>
      </div>
      <Plus className="h-4 w-4 text-gray-500" />
    </div>
  );
};

// Component Wrapper with Controls
const ComponentWrapper = ({
  component,
  index,
  onDelete,
  onDuplicate,
  onSelect,
  onMoveUp,
  onMoveDown,
  isSelected,
  children,
}: {
  component: Component;
  index: number;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
  onSelect: (component: Component) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isSelected: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative group transition-all",
        isSelected && "ring-2 ring-blue-500"
      )}
      onClick={() => onSelect(component)}
    >
      {/* Component Controls Overlay */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 bg-white border rounded-lg shadow-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(index);
            }}
            className="h-8 w-8 p-0"
            disabled={index === 0}
          >
            ↑
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(index);
            }}
            className="h-8 w-8 p-0"
          >
            ↓
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(index);
            }}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {children}
    </div>
  );
};

const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({
  templateId,
  renderComponent,
  mode = "edit",
}) => {
  const [template, setTemplate] = useState<any>(null);
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    async function loadTemplate() {
      const templates = await websiteTemplates;
      const found = templates.find((t: any) => t.id === templateId);
      setTemplate(found);
      setComponents(
        found
          ? found.components
          : [
              {
                id: 1,
                type: "header",
                content: defaultContent.header,
                metadata: {},
                design: {
                  typography: {},
                  colors: {},
                  shadows: {},
                  borders: {},
                  interactions: {},
                },
              },
              {
                id: 2,
                type: "hero",
                content: defaultContent.hero,
                metadata: {},
                design: {
                  typography: {},
                  colors: {},
                  shadows: {},
                  borders: {},
                  interactions: {},
                },
              },
              {
                id: 3,
                type: "features",
                content: defaultContent.features,
                metadata: {},
                design: {
                  typography: {},
                  colors: {},
                  shadows: {},
                  borders: {},
                  interactions: {},
                },
              },
              {
                id: 4,
                type: "footer",
                content: defaultContent.footer,
                metadata: {},
                design: {
                  typography: {},
                  colors: {},
                  shadows: {},
                  borders: {},
                  interactions: {},
                },
              },
            ]
      );
    }
    loadTemplate();
  }, [templateId]);

  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [sidebarTab, setSidebarTab] = useState<
    "elements" | "layers" | "settings"
  >("elements");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [imageLoadProgress, setImageLoadProgress] = useState({
    loaded: 0,
    total: 0,
  });
  const [rateLimitDetected, setRateLimitDetected] = useState(false);

  const { user, db } = useAuth();
  const { toast } = useToast();

  // Use optimized Firestore hook to load website
  const websiteRef =
    user && db && templateId
      ? doc(db, "workspaces", user.uid, "websites", templateId)
      : null;
  const { data: websiteData, loading: websiteLoading } =
    useOptimizedFetch<WebsiteData>(
      websiteRef,
      `website-${templateId}-${user?.uid}`,
      { enabled: !!user && !!db && !!templateId }
    );

  // Function to preload website images with simple rate limiting protection
  const preloadWebsiteImages = useCallback(
    async (componentsToLoad: Component[]) => {
      if (isLoadingImages) return; // Prevent multiple simultaneous preloads

      setIsLoadingImages(true);
      setRateLimitDetected(false);

      let loaded = 0;
      let failed = 0;
      const imageUrls: string[] = [];

      // Extract image URLs from components
      componentsToLoad.forEach((component) => {
        if (component.content?.image) {
          imageUrls.push(component.content.image);
        }
        if (component.content?.testimonials) {
          component.content.testimonials.forEach((testimonial: any) => {
            if (testimonial.image) {
              imageUrls.push(testimonial.image);
            }
          });
        }
        if (component.content?.coach?.image) {
          imageUrls.push(component.content.coach.image);
        }
        if (component.content?.src) {
          imageUrls.push(component.content.src);
        }
      });

      // Filter to external URLs only and remove duplicates
      const externalImages = Array.from(new Set(imageUrls.filter(url => 
        url && (url.startsWith('http') || url.startsWith('https'))
      ))).slice(0, 8); // Limit to 8 images

      setImageLoadProgress({ loaded: 0, total: externalImages.length });

      // Load images with rate limiting protection
      try {
        const result = await loadImagesInBatch(externalImages, {
          batchSize: 1, // Load one image at a time
          delayBetweenBatches: 2000, // 2 second delay between images
          onProgress: (loadedCount, total) => {
            setImageLoadProgress({ loaded: loadedCount, total });
          }
        });
        
        loaded = result.loaded;
        failed = result.failed;
        
        if (failed > 0 && failed / externalImages.length > 0.5) {
          setRateLimitDetected(true);
        }
        
        console.log(`Image preloading completed: ${loaded} loaded, ${failed} failed`);
      } catch (error) {
        console.warn("Error during batch image loading:", error);
        setRateLimitDetected(true);
      }
      setIsLoadingImages(false);
    },
    [isLoadingImages]
  );

  // Load website data when available and preload images
  useEffect(() => {
    if (websiteData && !Array.isArray(websiteData) && websiteData.components) {
      setComponents(websiteData.components);

      // Preload images to prevent rate limiting
      preloadWebsiteImages(websiteData.components);

      toast({
        title: "Website Loaded",
        description: "Your saved website has been loaded successfully.",
      });
    }
  }, [websiteData, toast, preloadWebsiteImages]);

  // Preload images when template components are initially loaded to prevent rate limiting
  useEffect(() => {
    if (
      template &&
      template.components &&
      components.length > 0 &&
      !websiteLoading &&
      !websiteData
    ) {
      // Only preload for template components when no saved data exists
      preloadWebsiteImages(template.components);
    }
  }, [template, components, websiteLoading, websiteData, preloadWebsiteImages]);

  // Save website to Firestore
  const saveWebsite = useCallback(async () => {
    if (!user || !db) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your website.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const websiteData = {
        templateId,
        components,
        title: template?.title || "My Website",
        description:
          template?.description || "A beautiful website built with our builder",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      // Save to user's websites collection
      const websiteRef = doc(
        db,
        "workspaces",
        user.uid,
        "websites",
        templateId
      );
      await setDoc(websiteRef, websiteData, { merge: true });

      toast({
        title: "Website Saved!",
        description: "Your website has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving website:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save your website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, db, templateId, components, template, toast]);

  // Component Management Functions
  const addComponent = useCallback(
    (componentType: ComponentType, index?: number) => {
      const newComponent: Component = {
        id: Date.now(),
        type: componentType,
        content: defaultContent[componentType] || {},
        metadata: {},
        design: {
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {},
        },
      };

      setComponents((prev) => {
        const newComponents = [...prev];
        if (index !== undefined) {
          newComponents.splice(index, 0, newComponent);
        } else {
          newComponents.push(newComponent);
        }
        return newComponents;
      });
    },
    []
  );

  const deleteComponent = useCallback((index: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
    setSelectedComponent(null);
  }, []);

  const duplicateComponent = useCallback(
    (index: number) => {
      const component = components[index];
      const newComponent: Component = {
        ...component,
        id: Date.now(),
      };
      setComponents((prev) => {
        const newComponents = [...prev];
        newComponents.splice(index + 1, 0, newComponent);
        return newComponents;
      });
    },
    [components]
  );

  const moveComponentUp = useCallback((index: number) => {
    if (index > 0) {
      setComponents((prev) => {
        const newComponents = [...prev];
        [newComponents[index - 1], newComponents[index]] = [
          newComponents[index],
          newComponents[index - 1],
        ];
        return newComponents;
      });
    }
  }, []);

  const moveComponentDown = useCallback((index: number) => {
    setComponents((prev) => {
      if (index < prev.length - 1) {
        const newComponents = [...prev];
        [newComponents[index], newComponents[index + 1]] = [
          newComponents[index + 1],
          newComponents[index],
        ];
        return newComponents;
      }
      return prev;
    });
  }, []);

  const updateComponent = useCallback((updatedComponent: Component) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    );
    setSelectedComponent(updatedComponent);
  }, []);

  const getViewportClass = () => {
    switch (viewMode) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      default:
        return "w-full";
    }
  };

  if (mode === "preview" || isPreviewMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={getViewportClass()}>
          {components.map((component) => (
            <div key={component.id}>
              {renderComponent
                ? renderComponent(component)
                : renderWebsiteComponent(component)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Left Sidebar - Elements & Settings */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Website Builder</h2>
          <p className="text-sm text-gray-600">
            Click elements to add them to your page
          </p>
        </div>

        <Tabs
          value={sidebarTab}
          onValueChange={(value: any) => setSidebarTab(value)}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="elements" className="flex-1 p-4 space-y-4">
            <ScrollArea className="h-full">
              {Object.entries(ELEMENT_LIBRARY).map(([category, elements]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {elements.map((element) => (
                      <ElementItem
                        key={element.type}
                        element={element}
                        onAdd={addComponent}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="layers" className="flex-1 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {components.map((component, index) => (
                  <div
                    key={component.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100",
                      selectedComponent?.id === component.id && "bg-blue-100"
                    )}
                    onClick={() => setSelectedComponent(component)}
                  >
                    <Move className="h-4 w-4 text-gray-500" />
                    <span className="flex-1 text-sm capitalize">
                      {component.type}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteComponent(index);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-hidden">
            {selectedComponent ? (
              <StylePanel
                component={selectedComponent}
                onUpdate={updateComponent}
              />
            ) : (
              <div className="text-center text-gray-600 py-8 px-4">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a component to edit its settings</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={viewMode === "desktop" ? "default" : "outline"}
                  onClick={() => setViewMode("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "tablet" ? "default" : "outline"}
                  onClick={() => setViewMode("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "mobile" ? "default" : "outline"}
                  onClick={() => setViewMode("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Image loading indicator */}
              {isLoadingImages && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mr-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>
                    Loading images ({imageLoadProgress.loaded}/
                    {imageLoadProgress.total})
                  </span>
                  {rateLimitDetected && (
                    <span className="text-amber-600">
                      (Rate limited - loading slowly)
                    </span>
                  )}
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                {isPreviewMode ? "Edit" : "Preview"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={saveWebsite}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full flex items-start justify-center p-4">
            <div
              className={cn(
                "bg-white shadow-lg transition-all border border-gray-200",
                "min-h-full flex flex-col",
                getViewportClass()
              )}
              style={{ minHeight: "calc(100vh - 120px)" }}
            >
              {components.length === 0 ? (
                <div className="flex items-center justify-center h-96 text-gray-600">
                  <div className="text-center">
                    <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      Start building your website
                    </p>
                    <p className="text-sm">
                      Click elements from the sidebar to get started
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 w-full">
                  {components.map((component, index) => (
                    <ComponentWrapper
                      key={component.id}
                      component={component}
                      index={index}
                      onDelete={deleteComponent}
                      onDuplicate={duplicateComponent}
                      onSelect={setSelectedComponent}
                      onMoveUp={moveComponentUp}
                      onMoveDown={moveComponentDown}
                      isSelected={selectedComponent?.id === component.id}
                    >
                      <div className="w-full">
                        {renderComponent
                          ? renderComponent(component)
                          : renderEditorWebsiteComponent(component)}
                      </div>
                    </ComponentWrapper>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
