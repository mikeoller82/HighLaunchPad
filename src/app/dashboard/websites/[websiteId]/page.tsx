"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Plus,
  Move,
  Trash2,
  Eye,
  Save,
  Settings,
  Palette,
  Layout,
  Copy,
  EyeOff,
  Smartphone,
  Tablet,
  Monitor,
  Undo,
  Redo,
  Grid,
  Layers,
  MousePointer,
  Zap,
  ImageIcon,
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
  Loader2,
  Wand2,
  Edit,
  Type,
  VideoIcon,
  Code,
  Pencil,
  RectangleHorizontal,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { websiteTemplates } from "@/lib/website-templates";
import { defaultContent } from "@/lib/default-content";
import type { Component, ComponentType } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { EditorActions } from "@/components/editor/editor-actions";
import { LivePreview } from "@/components/editor/live-preview";
import { useContentManager } from "@/hooks/use-content-manager";
// Removed renderWebsiteComponent import to prevent circular dependency issues
import { BlockSelector } from "@/components/editor/block-selector";
import type { Block } from "@/lib/blocks-types";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { useApiKey } from "@/context/ApiKeyContext";
import { rateLimitHandler } from "@/lib/rate-limit-handler";

const componentTypes: { type: ComponentType; label: string; icon: any }[] = [
  { type: "header", label: "Header", icon: Layout },
  { type: "hero", label: "Hero Section", icon: Layout },
  { type: "features", label: "Features", icon: Layout },
  { type: "pricing", label: "Pricing", icon: Layout },
  { type: "testimonials", label: "Testimonials", icon: Layout },
  { type: "contact", label: "Contact", icon: Layout },
  { type: "footer", label: "Footer", icon: Layout },
];

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
      <IconComponent className="h-5 w-5 text-blue-700" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{element.label}</p>
        <p className="text-xs text-blue-600 truncate">{element.description}</p>
      </div>
      <Plus className="h-4 w-4 text-blue-500" />
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

export default function WebsiteBuilderPage() {
  const params = useParams();
  const { toast } = useToast();
  const { user, subscription } = useAuth();
  const { apiKey, checkApiKey } = useApiKey();
  const templateId = (params?.websiteId as string) || "";

  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Styles state
  const [styles, setStyles] = useState({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    primaryColor: "#3b82f6",
    primaryColorForeground: "#ffffff",
    font: "Inter, sans-serif",
  });

  const [buttonStyles, setButtonStyles] = useState({
    borderRadius: 8,
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  });

  const [domain, setDomain] = useState("");
  const [slug, setSlug] = useState(templateId || "default");
  const [websiteProductInfo, setWebsiteProductInfo] = useState("");

  // AI Assistant State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(
    null
  );
  const [currentContent, setCurrentContent] = useState<Record<string, any>>({});
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTargetField, setAiTargetField] = useState({ value: "", label: "" });
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  // AI Generation Function
  const handleAiGenerate = async () => {
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description:
          "Please add your Google AI API key in settings to use AI features.",
      });
      return;
    }

    if (!aiTargetField.value) {
      toast({
        variant: "destructive",
        title: "Select Content Type",
        description: "Please select what type of content you want to generate.",
      });
      return;
    }

    setAiIsLoading(true);
    try {
      // Import genkit dynamically to avoid client-side issues
      const { genkit } = await import("genkit");
      const { googleAI } = await import("@genkit-ai/googleai");

      // Create AI instance with user's API key
      const userAI = genkit({
        plugins: [googleAI({ apiKey })],
      });

      // Build context-aware prompt based on component type and field
      const componentType = editingComponent?.type || "component";
      const fieldLabel = aiTargetField.label;
      const currentValue = currentContent[aiTargetField.value] || "";
      const customInstructions = aiPrompt.trim();

      let prompt = "";

      // Build specific prompts based on component type and field
      if (componentType === "hero" && aiTargetField.value === "title") {
        prompt = `Generate a compelling hero title for a website. The current title is: "${currentValue}".
        
Requirements:
- Make it attention-grabbing and benefit-focused
- Keep it under 60 characters for optimal display
- Focus on the value proposition
- Make it conversion-oriented

${customInstructions ? `Additional instructions: ${customInstructions}` : ""}

Generate only the title text, no quotes or extra formatting.`;
      } else if (
        componentType === "hero" &&
        aiTargetField.value === "subtitle"
      ) {
        prompt = `Generate a compelling hero subtitle/description for a website. The current subtitle is: "${currentValue}".
        
Requirements:
- Explain the value proposition clearly
- Keep it between 100-150 characters
- Make it benefit-focused and action-oriented
- Support the main title

${customInstructions ? `Additional instructions: ${customInstructions}` : ""}

Generate only the subtitle text, no quotes or extra formatting.`;
      } else if (
        componentType === "features" &&
        aiTargetField.value === "title"
      ) {
        prompt = `Generate a compelling features section title. The current title is: "${currentValue}".
        
Requirements:
- Make it benefit-focused
- Keep it under 50 characters
- Make it engaging and clear

${customInstructions ? `Additional instructions: ${customInstructions}` : ""}

Generate only the title text, no quotes or extra formatting.`;
      } else {
        // Generic prompt for other cases
        prompt = `Generate compelling ${fieldLabel.toLowerCase()} content for a ${componentType} component. The current content is: "${currentValue}".
        
Requirements:
- Make it engaging and professional
- Focus on benefits and value
- Keep it concise and impactful
- Make it conversion-oriented

${customInstructions ? `Additional instructions: ${customInstructions}` : ""}

Generate only the content text, no quotes or extra formatting.`;
      }

      // Generate content using AI
      const response = await userAI.generate({
        model: googleAI.model("gemini-2.0-flash-exp"),
        prompt: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      });

      const generatedContent = response.text.trim();

      if (generatedContent) {
        setAiResult(generatedContent);
        toast({
          title: "Content Generated!",
          description: `AI has generated new ${fieldLabel.toLowerCase()} content for you.`,
        });
      } else {
        throw new Error("No content generated");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description:
          "Failed to generate content. Please check your API key and try again.",
      });
    } finally {
      setAiIsLoading(false);
    }
  };

  const contentManager = useContentManager("website", templateId);
  const isPro = subscription?.status === "active";
  const workspaceSubdomain =
    user?.email?.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") || "your-workspace";
  const generatedUrl = domain
    ? `${domain}/${slug}`
    : `${workspaceSubdomain}.highlaunchpad.com/${slug}`;

  useEffect(() => {
    async function loadTemplate() {
      try {
        // Clear any existing rate limits to prevent white screen
        rateLimitHandler.clearAllRateLimits();

        // Await the templates
        const templates = await websiteTemplates;
        const template = templates.find((t) => t.id === templateId);
        if (template) {
          setComponents(
            template.components || [
              { id: 1, type: "header", content: defaultContent.header, metadata: {} },
              { id: 2, type: "hero", content: defaultContent.hero, metadata: {} },
              { id: 3, type: "features", content: defaultContent.features, metadata: {} },
              { id: 4, type: "footer", content: defaultContent.footer, metadata: {} },
            ]
          );
        } else if (templateId === "default") {
          setComponents([
            { id: 1, type: "header", content: defaultContent.header, metadata: {} },
            { id: 2, type: "hero", content: defaultContent.hero, metadata: {} },
            { id: 3, type: "features", content: defaultContent.features, metadata: {} },
            { id: 4, type: "footer", content: defaultContent.footer, metadata: {} },
          ]);
        }
      } catch (error) {
        console.error("Error loading website template:", error);
        // Fallback to basic components if there's an error
        setComponents([
          { id: 1, type: "header", content: defaultContent.header, metadata: {} },
          { id: 2, type: "hero", content: defaultContent.hero, metadata: {} },
          { id: 3, type: "features", content: defaultContent.features, metadata: {} },
          { id: 4, type: "footer", content: defaultContent.footer, metadata: {} },
        ]);
      }
    }
    loadTemplate();
  }, [templateId]);

  const addComponent = (type: ComponentType) => {
    const newComponent: Component = {
      id: Date.now(),
      type: type,
      content: defaultContent[type] || {},
      design: {
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {},
      },
      metadata: {},
    };
    setComponents((prev) => [...prev, newComponent]);
  };

  const removeComponent = (id: number) => {
    setComponents(components.filter((c) => c.id !== id));
  };

  const duplicateComponent = (index: number) => {
    const component = components[index];
    const newComponent: Component = {
      ...component,
      id: Date.now(),
    };
    const newComponents = [...components];
    newComponents.splice(index + 1, 0, newComponent);
    setComponents(newComponents);
  };

  const moveComponentUp = (index: number) => {
    if (index === 0) return;
    const newComponents = [...components];
    [newComponents[index], newComponents[index - 1]] = [
      newComponents[index - 1],
      newComponents[index],
    ];
    setComponents(newComponents);
  };

  const moveComponentDown = (index: number) => {
    if (index === components.length - 1) return;
    const newComponents = [...components];
    [newComponents[index], newComponents[index + 1]] = [
      newComponents[index + 1],
      newComponents[index],
    ];
    setComponents(newComponents);
  };

  const resetAiState = () => {
    setAiPrompt("");
    setAiTargetField({ value: "", label: "" });
    setAiIsLoading(false);
    setAiResult("");
  };

  const openEditDialog = (component: Component) => {
    setEditingComponent(component);
    setCurrentContent(component.content);
    resetAiState();
    setIsEditDialogOpen(true);
  };

  const handleContentChange = (field: string, value: any) => {
    setCurrentContent((prev: any) => ({ ...prev, [field]: value }));
  };

  // Removed duplicate saveChanges function - using the one below

  const getEditableFieldsForAI = (type: ComponentType | null) => {
    if (!type) return [];
    switch (type) {
      case "hero":
        return [
          { value: "title", label: "Hero Title" },
          { value: "subtitle", label: "Hero Subtitle" },
          { value: "cta", label: "Call-to-Action Button" },
        ];
      case "header":
        return [{ value: "title", label: "Brand Name" }];
      case "features":
        return [
          { value: "title", label: "Features Section Title" },
          { value: "subtitle", label: "Features Description" },
        ];
      case "testimonials":
        return [
          { value: "title", label: "Testimonials Title" },
          { value: "subtitle", label: "Testimonials Description" },
        ];
      case "text":
        return [{ value: "text", label: "Text Content" }];
      case "button":
        return [{ value: "text", label: "Button Text" }];
      case "image":
        return [{ value: "alt", label: "Image Alt Text" }];
      case "contact":
        return [
          { value: "title", label: "Contact Section Title" },
          { value: "subtitle", label: "Contact Description" },
        ];
      case "pricing":
        return [
          { value: "title", label: "Pricing Section Title" },
          { value: "subtitle", label: "Pricing Description" },
        ];
      case "footer":
        return [
          { value: "copyright", label: "Copyright Text" },
          { value: "description", label: "Footer Description" },
        ];
      case "cta":
        return [
          { value: "title", label: "CTA Title" },
          { value: "subtitle", label: "CTA Description" },
          { value: "primaryCta", label: "Primary Button Text" },
        ];
      default:
        return [
          { value: "title", label: "Section Title" },
          { value: "description", label: "Section Description" },
        ];
    }
  };

  // Removed duplicate handleAiGenerate function - using the genkit version above

  const handleUseAiResult = () => {
    if (aiResult && aiTargetField.value) {
      // Update the current content with AI result
      const updatedContent = { ...currentContent };
      updatedContent[aiTargetField.value] = aiResult;
      setCurrentContent(updatedContent);

      toast({
        title: "Content Updated",
        description: `The ${aiTargetField.label.toLowerCase()} has been updated with the AI-generated copy.`,
      });
      setAiResult("");
    }
  };

  const saveChanges = () => {
    if (editingComponent) {
      // Update the component in the components array
      setComponents((prev) =>
        prev.map((comp) =>
          comp.id === editingComponent.id
            ? { ...comp, content: { ...comp.content, ...currentContent } }
            : comp
        )
      );

      toast({
        title: "Changes Saved",
        description: "Component has been updated successfully.",
      });

      setIsEditDialogOpen(false);
      setCurrentContent({});
      setEditingComponent(null);
    }
  };

  const editableFieldsForAI = getEditableFieldsForAI(
    (editingComponent?.type as ComponentType) || null
  );

  const handleSaveDraft = async () => {
    const data = {
      components,
      styles,
      settings: {
        domain,
        slug,
        websiteProductInfo,
        buttonStyles,
      },
    };
    await contentManager.saveDraft(data);
  };

  const handlePublishLive = async () => {
    const data = {
      components,
      styles,
      settings: {
        domain,
        slug,
        websiteProductInfo,
        buttonStyles,
      },
    };
    await contentManager.publishLive(data);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const renderPreviewContent = () => (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: styles.backgroundColor,
        fontFamily: styles.font,
      }}
    >
      <TemplateRenderer
        components={components}
        styles={styles}
        buttonStyles={buttonStyles}
      />
    </div>
  );

  const addBlock = (block: Block) => {
    const newComponent: Component = {
      id: Date.now(),
      type: block.type,
      content: block.content,
      design: block.design,
      metadata: {},
    };
    setComponents((prev) => [...prev, newComponent]);
  };

  const updateComponent = (id: number, newContent: any) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id
          ? { ...comp, content: { ...comp.content, ...newContent } }
          : comp
      )
    );
  };

  const deleteComponent = (id: number) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const moveComponent = (id: number, direction: "up" | "down") => {
    setComponents((prev) => {
      const index = prev.findIndex((comp) => comp.id === id);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newComponents = [...prev];
      [newComponents[index], newComponents[newIndex]] = [
        newComponents[newIndex],
        newComponents[index],
      ];
      return newComponents;
    });
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to save your website.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await contentManager.saveContent({
        components,
        styles,
        buttonStyles,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Website Saved",
        description: "Your website has been saved successfully.",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save website. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Component renderer for dialog preview
  const renderComponent = (type: ComponentType, content: any) => {
    switch (type) {
      case "header":
        return (
          <div className="p-4 border-b bg-white">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
              <h1 className="text-xl font-bold">{content.title || "Header"}</h1>
              <nav className="flex gap-4">
                {content.links?.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.href}
                    className="text-sm hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        );

      case "hero":
        return (
          <div className="p-8 text-center bg-gray-50">
            <h2 className="text-3xl font-bold mb-4">
              {content.title || "Hero Title"}
            </h2>
            <p className="text-lg mb-6">
              {content.subtitle || "Hero subtitle"}
            </p>
            <Button style={{ backgroundColor: styles.primaryColor }}>
              {typeof content.cta === "string"
                ? content.cta
                : content.cta?.primary || "Get Started"}
            </Button>
          </div>
        );

      case "features":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              {content.title || "Features"}
            </h2>
            {content.subtitle && (
              <p className="text-center text-gray-600 mb-8">
                {content.subtitle}
              </p>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              {content.features?.map((feature: any, i: number) => (
                <div key={i} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-center mb-6">
              {content.title || "Testimonials"}
            </h2>
            {content.subtitle && (
              <p className="text-center text-gray-600 mb-8">
                {content.subtitle}
              </p>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {content.testimonials?.map((testimonial: any, i: number) => (
                <div key={i} className="p-4 bg-white rounded-lg">
                  <p className="italic mb-2">&quot;{testimonial.quote}&quot;</p>
                  <p className="font-semibold">- {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "text":
        return (
          <div className="p-4">
            <p className="whitespace-pre-wrap">
              {content.text || "Text content"}
            </p>
          </div>
        );

      case "image":
        return (
          <div className="p-4">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">
                Image: {content.alt || "Image placeholder"}
              </span>
            </div>
          </div>
        );

      case "footer":
        return (
          <div className="p-4 border-t bg-gray-100">
            <div className="text-center">
              <p className="text-sm">
                {content.copyright || "© 2025 Your Brand. All rights reserved."}
              </p>
              {content.description && (
                <p className="text-xs text-gray-500 mt-2">
                  {content.description}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 border border-dashed border-gray-300 text-center">
            <span className="text-gray-500 capitalize">{type} Component</span>
          </div>
        );
    }
  };

  // Simple component renderer for editor preview to avoid circular dependencies
  const renderComponentPreview = (component: Component) => {
    const { type, content } = component;

    switch (type) {
      case "header":
        return (
          <div className="p-4 border-b bg-white">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
              <h1 className="text-xl font-bold">{content.title || "Header"}</h1>
              <nav className="flex gap-4">
                {content.links?.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.href}
                    className="text-sm hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        );

      case "hero":
        return (
          <div className="p-8 text-center bg-gray-50">
            <h2 className="text-3xl font-bold mb-4">
              {content.title || "Hero Title"}
            </h2>
            <p className="text-lg mb-6">
              {content.subtitle || "Hero subtitle"}
            </p>
            <Button style={{ backgroundColor: styles.primaryColor }}>
              {typeof content.cta === "string"
                ? content.cta
                : content.cta?.primary || "Get Started"}
            </Button>
          </div>
        );

      case "features":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              {content.title || "Features"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {content.features?.map((feature: any, i: number) => (
                <div key={i} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-center mb-6">
              {content.title || "Testimonials"}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.testimonials?.map((testimonial: any, i: number) => (
                <div key={i} className="p-4 bg-white rounded-lg">
                  <p className="italic mb-2">&quot;{testimonial.quote}&quot;</p>
                  <p className="font-semibold">- {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "text":
        return (
          <div className="p-4">
            <p className="whitespace-pre-wrap">
              {content.text || "Text content"}
            </p>
          </div>
        );

      case "image":
        return (
          <div className="p-4">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">
                Image: {content.alt || "Image placeholder"}
              </span>
            </div>
          </div>
        );

      case "footer":
        return (
          <div className="p-4 border-t bg-gray-100">
            <div className="text-center">
              <p className="text-sm">
                {content.copyright || "© 2025 Your Brand. All rights reserved."}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 border border-dashed border-gray-300 text-center">
            <span className="text-gray-500 capitalize">{type} Component</span>
          </div>
        );
    }
  };

  return (
    <>
      <style jsx global>{`
        .editor-compact section {
          padding-top: 1rem !important;
          padding-bottom: 1rem !important;
        }
        .editor-compact .py-8,
        .editor-compact .py-12,
        .editor-compact .py-16,
        .editor-compact .py-24,
        .editor-compact .md\\:py-12,
        .editor-compact .md\\:py-16,
        .editor-compact .md\\:py-24,
        .editor-compact .lg\\:py-24 {
          padding-top: 1rem !important;
          padding-bottom: 1rem !important;
        }
        .editor-component-preview {
          border-bottom: 1px dashed #e5e7eb;
          margin-bottom: 0.5rem;
        }
        .editor-component-preview:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
      `}</style>
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-card border-r overflow-y-auto">
          <Card className="rounded-none border-0 border-b sticky top-0 z-10">
            <CardHeader>
              <CardTitle>Website Editor</CardTitle>
            </CardHeader>
          </Card>

          <Tabs defaultValue="components" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none">
              <TabsTrigger value="components" className="rounded-none">
                <PlusCircle className="mr-2 h-4 w-4" />
                Components
              </TabsTrigger>
              <TabsTrigger value="styling" className="rounded-none">
                <Palette className="mr-2 h-4 w-4" />
                Styling
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-none">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="p-4 space-y-4">
              <div className="space-y-4">
                {Object.entries(ELEMENT_LIBRARY).map(([category, elements]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-sm text-gray-700 mb-2">
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
              </div>
            </TabsContent>

            <TabsContent value="styling" className="p-4 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bg-color">Background Color</Label>
                  <Input
                    id="bg-color"
                    type="color"
                    value={styles.backgroundColor}
                    onChange={(e) =>
                      setStyles((prev) => ({
                        ...prev,
                        backgroundColor: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <Input
                    id="text-color"
                    type="color"
                    value={styles.textColor}
                    onChange={(e) =>
                      setStyles((prev) => ({
                        ...prev,
                        textColor: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={styles.primaryColor}
                    onChange={(e) =>
                      setStyles((prev) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select
                    value={styles.font}
                    onValueChange={(value) =>
                      setStyles((prev) => ({ ...prev, font: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                      <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                      <SelectItem value="Open Sans, sans-serif">
                        Open Sans
                      </SelectItem>
                      <SelectItem value="Lato, sans-serif">Lato</SelectItem>
                      <SelectItem value="Montserrat, sans-serif">
                        Montserrat
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="button-radius">Button Border Radius</Label>
                  <Slider
                    id="button-radius"
                    min={0}
                    max={20}
                    step={1}
                    value={[buttonStyles.borderRadius]}
                    onValueChange={([value]) =>
                      setButtonStyles((prev) => ({
                        ...prev,
                        borderRadius: value,
                      }))
                    }
                    className="mt-2"
                  />
                  <span className="text-sm text-blue-600">
                    {buttonStyles.borderRadius}px
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="domain">Custom Domain (Optional)</Label>
                  <Input
                    id="domain"
                    placeholder="yourdomain.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    placeholder="my-website"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="product-info">Website Description</Label>
                  <Textarea
                    id="product-info"
                    placeholder="Describe your website or business to help AI generate better content..."
                    value={websiteProductInfo}
                    onChange={(e) => setWebsiteProductInfo(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Your Website URL:</strong>
                    <br />
                    {generatedUrl}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Top Actions Bar */}
          <div className="border-b p-4 flex items-center justify-between bg-card">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </div>

            <EditorActions
              type="website"
              onSaveDraft={handleSaveDraft}
              onPublishLive={handlePublishLive}
              onPreview={handlePreview}
            />
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-y-auto bg-white p-6">
            <div
              className="max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden min-h-[calc(100vh-200px)]"
              style={{
                backgroundColor: styles.backgroundColor,
                fontFamily: styles.font,
              }}
            >
              {components.length === 0 ? (
                <div
                  className="p-12 text-center"
                  style={{ color: styles.textColor }}
                >
                  <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Add components from the sidebar to start building your
                    website.
                  </p>
                </div>
              ) : (
                components.map((component, index) => (
                  <ComponentWrapper
                    key={component.id}
                    component={component}
                    index={index}
                    onDelete={() => removeComponent(component.id)}
                    onDuplicate={() => duplicateComponent(index)}
                    onSelect={() => openEditDialog(component)}
                    onMoveUp={() => moveComponentUp(index)}
                    onMoveDown={() => moveComponentDown(index)}
                    isSelected={selectedComponent?.id === component.id}
                  >
                    <div className="editor-component-preview">
                      <TemplateRenderer
                        components={[component]}
                        styles={styles}
                        buttonStyles={buttonStyles}
                        className="editor-compact"
                      />
                    </div>
                  </ComponentWrapper>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Component Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editingComponent?.type} Component</DialogTitle>
            <DialogDescription>
              Customize the content and appearance of this component.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Editor */}
            <div className="space-y-4">
              <h3 className="font-semibold">Content</h3>
              <EditorActions
                component={editingComponent || undefined}
                onUpdate={(newContent) => {
                  setCurrentContent({ ...currentContent, ...newContent });
                }}
              />

              {/* AI Assistant */}
              {editableFieldsForAI.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Wand2 className="mr-2 h-4 w-4" />
                    AI Assistant
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="ai-field">Content Type</Label>
                      <Select
                        value={aiTargetField.value}
                        onValueChange={(value) => {
                          const field = editableFieldsForAI.find(
                            (f) => f.value === value
                          );
                          setAiTargetField(field || { value: "", label: "" });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          {editableFieldsForAI.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ai-prompt">
                        Custom Instructions (Optional)
                      </Label>
                      <Textarea
                        id="ai-prompt"
                        placeholder="e.g., Make it more professional, add urgency, focus on benefits..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <Button
                      onClick={handleAiGenerate}
                      disabled={aiIsLoading || !aiTargetField.value}
                      className="w-full"
                    >
                      {aiIsLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Generate Content
                        </>
                      )}
                    </Button>
                    {aiResult && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 mb-2">
                          Generated Content:
                        </p>
                        <p className="text-sm mb-3">{aiResult}</p>
                        <Button
                          size="sm"
                          onClick={handleUseAiResult}
                          className="w-full"
                        >
                          Use This Content
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold">Preview</h3>
              <div className="border rounded-lg p-4 bg-white min-h-[400px] max-h-[600px] overflow-y-auto">
                {editingComponent && (
                  <div className="w-full">
                    <TemplateRenderer
                      components={[
                        { ...editingComponent, content: currentContent },
                      ]}
                      styles={styles}
                      buttonStyles={buttonStyles}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Component Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editingComponent?.type} Component</DialogTitle>
            <DialogDescription>
              Customize the content and appearance of this component.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Editor */}
            <div className="space-y-4">
              <h3 className="font-semibold">Content</h3>

              {/* Manual Content Editing */}
              {editingComponent?.type === "hero" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hero-title">Title</Label>
                    <Input
                      id="hero-title"
                      value={currentContent.title || ""}
                      onChange={(e) =>
                        setCurrentContent((prev: any) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter hero title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      value={currentContent.subtitle || ""}
                      onChange={(e) =>
                        setCurrentContent((prev) => ({
                          ...prev,
                          subtitle: e.target.value,
                        }))
                      }
                      placeholder="Enter hero subtitle"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-cta">Call-to-Action Button</Label>
                    <Input
                      id="hero-cta"
                      value={currentContent.cta || ""}
                      onChange={(e) =>
                        setCurrentContent((prev) => ({
                          ...prev,
                          cta: e.target.value,
                        }))
                      }
                      placeholder="Enter button text"
                    />
                  </div>
                </div>
              )}

              {editingComponent?.type === "header" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="header-title">Brand Name</Label>
                    <Input
                      id="header-title"
                      value={currentContent.title || ""}
                      onChange={(e) =>
                        setCurrentContent((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>
              )}

              {editingComponent?.type === "features" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="features-title">Section Title</Label>
                    <Input
                      id="features-title"
                      value={currentContent.title || ""}
                      onChange={(e) =>
                        setCurrentContent((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter features title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="features-subtitle">Description</Label>
                    <Textarea
                      id="features-subtitle"
                      value={currentContent.subtitle || ""}
                      onChange={(e) =>
                        setCurrentContent((prev) => ({
                          ...prev,
                          subtitle: e.target.value,
                        }))
                      }
                      placeholder="Enter features description"
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {/* AI Assistant */}
              {editableFieldsForAI.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Wand2 className="mr-2 h-4 w-4" />
                    AI Assistant
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="ai-field">Content Type</Label>
                      <Select
                        value={aiTargetField.value}
                        onValueChange={(value) => {
                          const field = editableFieldsForAI.find(
                            (f) => f.value === value
                          );
                          setAiTargetField(field || { value: "", label: "" });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          {editableFieldsForAI.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ai-prompt">
                        Custom Instructions (Optional)
                      </Label>
                      <Textarea
                        id="ai-prompt"
                        placeholder="e.g., Make it more professional, add urgency, focus on benefits..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <Button
                      onClick={handleAiGenerate}
                      disabled={aiIsLoading || !aiTargetField.value}
                      className="w-full"
                    >
                      {aiIsLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Generate Content
                        </>
                      )}
                    </Button>
                    {aiResult && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 mb-2 font-medium">
                          Generated Content:
                        </p>
                        <p className="text-sm mb-3 bg-white p-2 rounded border">
                          {aiResult}
                        </p>
                        <Button
                          size="sm"
                          onClick={handleUseAiResult}
                          className="w-full"
                        >
                          Use This Content
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold">Preview</h3>
              <div className="border rounded-lg p-4 bg-white min-h-[400px] max-h-[600px] overflow-y-auto">
                {editingComponent && (
                  <div className="w-full">
                    {renderComponent(editingComponent.type, {
                      ...editingComponent.content,
                      ...currentContent,
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Preview Modal */}
      <LivePreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Website Preview"
        backgroundColor={styles.backgroundColor}
      >
        {renderPreviewContent()}
      </LivePreview>
    </>
  );
}
