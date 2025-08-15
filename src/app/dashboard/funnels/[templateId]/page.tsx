"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
  Move,
  Trash2,
  PanelTop,
  PanelBottom,
  ImageIcon,
  VideoIcon,
  Code,
  Pencil,
  RectangleHorizontal,
  Type,
  Wand2,
  Loader2,
  Star,
  MessageSquare,
  UserCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Zap,
  Clock,
  Mail,
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
import {
  getFunnelComponentsById,
  getTemplateById,
} from "@/lib/funnel-templates";
import { defaultContent } from "@/lib/default-content";
import type { Component, ComponentType } from "@/lib/types";
import { useApiKey } from "@/context/ApiKeyContext";
import { useAuth } from "@/context/auth-context";
import { EditorActions } from "@/components/editor/editor-actions";
import { LivePreview } from "@/components/editor/live-preview";
import { useContentManager } from "@/hooks/use-content-manager";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";

// Type definitions for component props
interface StylesType {
  primaryColor: string;
  primaryColorForeground: string;
  backgroundColor: string;
  textColor: string;
  font: string;
}

interface ButtonStylesType {
  borderRadius: number;
  shadow: string;
}

interface ContentType {
  [key: string]: any;
}

// Placeholder components for the canvas
const HeaderPreview = ({
  content,
  styles,
}: {
  content: ContentType;
  styles: StylesType;
}) => (
  <header className="p-4" style={{ color: styles.textColor }}>
    <div className="flex justify-between items-center max-w-6xl mx-auto">
      <h1 className="text-xl font-bold">{content.title}</h1>
      <nav className="flex items-center gap-6">
        {(content.links || []).map((link: any, i: number) => (
          <a
            key={i}
            href={link.href}
            className="text-sm hover:underline transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  </header>
);

const HeroPreview = ({
  content,
  styles,
  buttonStyles,
}: {
  content: ContentType;
  styles: StylesType;
  buttonStyles: ButtonStylesType;
}) => {
  const getCtaText = (cta: any) => {
    if (typeof cta === "string") return cta;
    if (typeof cta === "object" && cta !== null) {
      return cta.primary || cta.text || "Get Started";
    }
    return "Get Started";
  };

  return (
    <div
      className="py-6 px-4 text-center rounded-lg"
      style={{ color: styles.textColor }}
    >
      <h2 className="text-3xl font-bold">{content.title}</h2>
      <p className="mt-2 text-base">{content.subtitle}</p>
      <Button
        className="mt-4"
        style={{
          backgroundColor: styles.primaryColor,
          color: styles.primaryColorForeground,
          borderRadius: `${buttonStyles.borderRadius}px`,
          boxShadow: buttonStyles.shadow,
        }}
      >
        {getCtaText(content.cta)}
      </Button>
      {typeof content.cta === "object" && content.cta?.secondary && (
        <div className="mt-2">
          <Button variant="outline" className="ml-2">
            {content.cta.secondary}
          </Button>
        </div>
      )}
      {typeof content.cta === "object" && content.cta?.note && (
        <p className="mt-2 text-sm opacity-75">{content.cta.note}</p>
      )}
    </div>
  );
};

const ImagePreview = ({ content }: { content: any }) => (
  <div className="py-8">
    <div className="relative aspect-video max-w-5xl mx-auto">
      <Image
        src={content.src}
        alt={content.alt}
        fill
        className="object-cover rounded-lg shadow-lg"
        data-ai-hint={content.hint}
      />
    </div>
  </div>
);

const VideoPreview = ({
  content,
  styles,
}: {
  content: ContentType;
  styles: StylesType;
}) => (
  <div className="py-6 px-4 text-center" style={{ color: styles.textColor }}>
    <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
    <div className="aspect-video max-w-3xl mx-auto rounded-lg overflow-hidden bg-black shadow-lg">
      <iframe
        src={content.embedUrl}
        title="Video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  </div>
);

const FeaturesPreview = ({
  content,
  styles,
}: {
  content: ContentType;
  styles: StylesType;
}) => (
  <div
    className="py-6 px-4 rounded-lg text-center"
    style={{ color: styles.textColor }}
  >
    <h2 className="text-2xl font-bold">{content.title}</h2>
    <div className="grid md:grid-cols-3 gap-4 mt-4">
      {(content.features || []).map((feat: any, i: number) => (
        <div
          key={i}
          className="p-4 bg-white/5 rounded-lg border border-white/10"
        >
          <h3 className="font-semibold text-lg">{feat.title}</h3>
          <p className="text-sm mt-2 opacity-80">{feat.description}</p>
        </div>
      ))}
    </div>
  </div>
);

const TestimonialsPreview = ({
  content,
  styles,
}: {
  content: ContentType;
  styles: StylesType;
}) => (
  <div
    className="py-6 px-4 rounded-lg text-center"
    style={{ color: styles.textColor }}
  >
    <h2 className="text-2xl font-bold">{content.title}</h2>
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      {(content.testimonials || []).map((testimonial: any, i: number) => (
        <div
          key={i}
          className="p-4 bg-white/5 rounded-lg border border-white/10"
        >
          <blockquote className="italic">
            &quot;{testimonial.quote}&quot;
          </blockquote>
          <p className="font-semibold mt-2">- {testimonial.author}</p>
        </div>
      ))}
    </div>
  </div>
);

const FooterPreview = ({
  content,
  styles,
  isPro = false,
}: {
  content: ContentType;
  styles: StylesType;
  isPro?: boolean;
}) => (
  <footer
    className="p-8 mt-10 border-t"
    style={{ color: styles.textColor, borderColor: styles.textColor + "33" }}
  >
    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 max-w-6xl mx-auto">
      <p className="text-sm opacity-80">{content.copyright}</p>
      <div className="flex gap-4">
        {(content.links || []).map((link: any, i: number) => (
          <a
            key={i}
            href={link.href}
            className="text-sm hover:underline opacity-80 hover:opacity-100 transition-opacity"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
    {!isPro && (
      <div className="text-center mt-6">
        <a
          href="https://highlaunchpad.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs hover:underline opacity-60 hover:opacity-100 transition-opacity"
        >
          Powered by HighLaunchPad
        </a>
      </div>
    )}
  </footer>
);

const CountdownPreview = ({
  content,
  styles,
}: {
  content: any;
  styles: any;
}) => (
  <div
    className="p-8 text-center"
    style={{
      color: styles.textColor,
      backgroundColor: styles.primaryColor + "22",
    }}
  >
    <h2 className="text-2xl font-semibold uppercase tracking-wider">
      {content.title || "Limited Time Offer"}
    </h2>
    <div className="text-6xl font-bold mt-4">
      <span>00</span>:<span>00</span>:<span>00</span>
    </div>
  </div>
);

const OptinFormPreview = ({
  content,
  styles,
  buttonStyles,
}: {
  content: any;
  styles: any;
  buttonStyles: any;
}) => (
  <div className="p-8 rounded-lg" style={{ color: styles.textColor }}>
    <h2 className="text-3xl font-bold text-center">
      {content.title || "Join the Waitlist"}
    </h2>
    <div className="mt-6 max-w-md mx-auto flex flex-col gap-4">
      <Input placeholder={content.namePlaceholder || "Your Name"} />
      <Input
        type="email"
        placeholder={content.emailPlaceholder || "Your Email"}
      />
      <Button
        style={{
          backgroundColor: styles.primaryColor,
          color: styles.primaryColorForeground,
          borderRadius: `${buttonStyles.borderRadius}px`,
          boxShadow: buttonStyles.shadow,
        }}
      >
        {content.buttonText || "Sign Up Now"}
      </Button>
    </div>
  </div>
);

const FaqPreview = ({ content, styles }: { content: any; styles: any }) => (
  <div className="p-8" style={{ color: styles.textColor }}>
    <h2 className="text-3xl font-bold text-center mb-6">
      {content.title || "Frequently Asked Questions"}
    </h2>
    <div className="max-w-3xl mx-auto space-y-4">
      {content.faqs?.map((faq: any, i: number) => (
        <div
          key={i}
          className="p-4 border rounded-md"
          style={{ borderColor: styles.textColor + "33" }}
        >
          <h3 className="font-semibold text-lg">{faq.question}</h3>
          <p className="mt-2 text-sm opacity-80">{faq.answer}</p>
        </div>
      ))}
    </div>
  </div>
);

const GuaranteePreview = ({
  content,
  styles,
}: {
  content: any;
  styles: any;
}) => (
  <div
    className="p-8 text-center rounded-lg border-2 border-dashed"
    style={{ color: styles.textColor, borderColor: styles.primaryColor }}
  >
    <h2 className="text-2xl font-bold">{content.title || "Our Guarantee"}</h2>
    <p className="mt-4 max-w-2xl mx-auto">
      {content.text ||
        "Your satisfaction is 100% guaranteed. If you are not happy with the product, get a full refund."}
    </p>
  </div>
);

const StatsPreview = ({ content, styles }: { content: any; styles: any }) => (
  <div className="py-8 text-center" style={{ color: styles.textColor }}>
    <h2 className="text-3xl font-bold mb-6">
      {content.title || "Key Metrics"}
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {content.stats?.map((stat: any, i: number) => (
        <div key={i} className="p-4 bg-white/5 rounded-lg">
          <p
            className="text-4xl font-bold"
            style={{ color: styles.primaryColor }}
          >
            {stat.value}
          </p>
          <p className="text-sm mt-2">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
);

const CtaPreview = ({
  content,
  styles,
  buttonStyles,
}: {
  content: any;
  styles: any;
  buttonStyles: any;
}) => {
  const getCtaText = (cta: any) => {
    if (typeof cta === "string") return cta;
    if (typeof cta === "object" && cta !== null) {
      return cta.primary || cta.text || "Enroll Now";
    }
    return "Enroll Now";
  };

  return (
    <div
      className="p-12 text-center rounded-lg"
      style={{
        backgroundColor: styles.primaryColor,
        color: styles.primaryColorForeground,
      }}
    >
      <h2 className="text-3xl font-bold">
        {content.title || "Ready to Get Started?"}
      </h2>
      <p className="mt-2 text-lg opacity-90">
        {content.subtitle || "Take the next step now."}
      </p>
      <Button
        className="mt-6"
        variant="secondary"
        style={{
          borderRadius: `${buttonStyles.borderRadius}px`,
          boxShadow: buttonStyles.shadow,
        }}
      >
        {getCtaText(content.cta)}
      </Button>
    </div>
  );
};

const CustomHtmlPreview = ({ content }: { content: any }) => {
  const sanitizeHtml = (html: string) => {
    if (!html) return "";
    let sanitized = html;
    sanitized = sanitized.replace(/<!DOCTYPE[^>]*>/gi, "");
    sanitized = sanitized.replace(/<\/?(?:html|head|body)[^>]*>/gi, "");
    if (
      sanitized &&
      !sanitized.trim().startsWith("<div") &&
      !sanitized.trim().startsWith("<p") &&
      !sanitized.trim().startsWith("<span")
    ) {
      sanitized = `<div>${sanitized}</div>`;
    }
    return sanitized;
  };

  return (
    <div
      className="p-2"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.html) }}
    />
  );
};

const TextPreview = ({ content, styles }: { content: any; styles: any }) => (
  <div className="p-4" style={{ color: styles.textColor }}>
    <p className="whitespace-pre-wrap">{content.text}</p>
  </div>
);

const AboutCoachPreview = ({
  content,
  styles,
}: {
  content: any;
  styles: any;
}) => (
  <div className="p-8 text-center" style={{ color: styles.textColor }}>
    <h2 className="text-3xl font-bold mb-4">
      {content.title || "About Your Coach"}
    </h2>
    <p className="text-lg mb-6 opacity-90">
      {content.subtitle || "Meet your guide to success"}
    </p>
    {content.image && (
      <div className="mb-6">
        <Image
          src={content.image}
          alt={content.name || "Coach"}
          width={200}
          height={200}
          className="rounded-full mx-auto object-cover"
        />
      </div>
    )}
    <h3 className="text-xl font-semibold mb-4">
      {content.name || "Your Coach"}
    </h3>
    <p className="max-w-2xl mx-auto mb-6">
      {content.bio || "Experienced professional dedicated to your success."}
    </p>
    {content.credentials && (
      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {content.credentials.map((credential: any, i: number) => (
          <div
            key={i}
            className="flex items-center justify-center p-3 bg-white/5 rounded-lg"
          >
            <span className="text-sm">{credential.text}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);
const ButtonPreview = ({
  content,
  styles,
  buttonStyles,
}: {
  content: any;
  styles: any;
  buttonStyles: any;
}) => (
  <div className="p-4 text-center">
    <Button
      asChild
      variant={content.variant}
      style={{
        backgroundColor: styles.primaryColor,
        color: styles.primaryColorForeground,
        borderRadius: `${buttonStyles.borderRadius}px`,
        boxShadow: buttonStyles.shadow,
      }}
    >
      <a href={content.href}>{content.text}</a>
    </Button>
  </div>
);

const componentMap: { [key in ComponentType]?: React.FC<any> } = {
  header: HeaderPreview,
  hero: HeroPreview,
  features: FeaturesPreview,
  testimonials: TestimonialsPreview,
  image: ImagePreview,
  video: VideoPreview,
  text: TextPreview,
  button: ButtonPreview,
  customHtml: CustomHtmlPreview,
  footer: FooterPreview,
  about_coach: AboutCoachPreview,
  countdown: CountdownPreview,
  optinForm: OptinFormPreview,
  faq: FaqPreview,
  guarantee: GuaranteePreview,
  stats: StatsPreview,
  cta: CtaPreview,
};

export default function FunnelEditorPage() {
  const params = useParams<{ templateId: string }>();
  const { toast } = useToast();
  const { apiKey, checkApiKey } = useApiKey();
  const { user, subscription } = useAuth();
  
  const initialComponents = getFunnelComponentsById(params?.templateId || 'default');
  const initialTemplate = getTemplateById(params?.templateId || 'default');
  const isPro = subscription?.status === 'active';

  const getTemplateStyles = (template: any) => {
    if (!template?.components) return {
      primaryColor: '#3B82F6',
      primaryColorForeground: '#FFFFFF',
      backgroundColor: '#111827',
      textColor: '#F9FAFB',
      font: 'Inter'
    };

    let primaryColor = '#3B82F6';
    let backgroundColor = '#111827';
    let textColor = '#F9FAFB';
    
    template.components.forEach((component: any) => {
      if (component.design) {
        if (component.design.accentColor) primaryColor = component.design.accentColor;
        if (component.design.backgroundColor && component.design.backgroundColor !== 'transparent') {
          backgroundColor = component.design.backgroundColor;
        }
        if (component.design.textColor) textColor = component.design.textColor;
      }
    });

    return {
      primaryColor,
      primaryColorForeground: '#FFFFFF',
      backgroundColor,
      textColor,
      font: 'Inter'
    };
  };

  const [components, setComponents] = useState<Component[]>(initialComponents || []);
  const [styles, setStyles] = useState(getTemplateStyles(initialTemplate));
  const [buttonStyles, setButtonStyles] = useState({
    borderRadius: 8,
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  });
  const [domain, setDomain] = useState('');
  const [slug, setSlug] = useState(params?.templateId || 'default');
  const [funnelProductInfo, setFunnelProductInfo] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const contentManager = useContentManager('funnel', params?.templateId || 'default');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [currentContent, setCurrentContent] = useState<any>({});

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTargetField, setAiTargetField] = useState({ value: '', label: '' });
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const workspaceSubdomain = user?.email?.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || 'your-workspace';
  const generatedUrl = domain ? `${domain}/${slug}` : `${workspaceSubdomain}.highlaunchpad.com/${slug}`;

  const addComponent = (type: ComponentType) => {
    const newComponent: Component = {
      id: Date.now(),
      type: type,
      content: defaultContent[type],
      metadata: {},
    };
    setComponents([...components, newComponent]);
  };

  const removeComponent = (id: number) => {
    setComponents(components.filter(c => c.id !== id));
  }

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setStyles({ ...styles, [e.target.name]: e.target.value });
  }

  const handleFontChange = (value: string) => {
      setStyles({ ...styles, font: value });
  }

  const handleButtonStylesChange = (key: string, value: any) => {
    setButtonStyles(prev => ({ ...prev, [key]: value }));
  }

  const openEditDialog = (component: Component) => {
    setEditingComponent(component);
    setCurrentContent(component.content);
    setIsEditDialogOpen(true);
  };

  const handleContentChange = (field: string, value: any) => {
    setCurrentContent((prev: any) => ({ ...prev, [field]: value }));
  }

  const saveChanges = () => {
    if (editingComponent) {
        const updatedComponent = { ...editingComponent, content: currentContent };
        setComponents(components.map(c =>
            c.id === editingComponent.id ? updatedComponent : c
        ));
    }
    setIsEditDialogOpen(false);
    setEditingComponent(null);
    setCurrentContent({});
  };

  const getEditableFieldsForAI = (type: ComponentType | null) => {
    if (!type) return [];
    switch (type) {
        case 'hero':
            return [
                { value: 'title', label: 'Headline' },
                { value: 'subtitle', label: 'Subtitle' },
                { value: 'cta', label: 'Button Text' },
            ];
        case 'text':
            return [{ value: 'text', label: 'Text Content' }];
        case 'button':
            return [{ value: 'text', label: 'Button Text' }];
        case 'image':
            return [{ value: 'alt', label: 'Image Alt Text' }];
        case 'video':
        case 'features':
        case 'testimonials':
        case 'header':
        case 'about_coach':
        case 'countdown':
        case 'optinForm':
        case 'faq':
        case 'guarantee':
        case 'stats':
        case 'cta':
            return [{ value: 'title', label: 'Section Title' }];
        case 'footer':
            return [{ value: 'copyright', label: 'Copyright Text' }];
        default:
            return [];
    }
  };

  const handleAiGenerate = async () => {
    if (!apiKey) {
      checkApiKey();
      return;
    }
    if (!aiTargetField.value || !funnelProductInfo) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a product description in the Settings tab and select a content type to generate.',
      });
      return;
    }

    setAiIsLoading(true);
    setAiResult('');
    try {
      const response = await fetch('/api/ai/generate-funnel-copy', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({
          productDescription: funnelProductInfo,
          copyType: aiTargetField.label,
          userPrompt: aiPrompt || `Generate a standard ${aiTargetField.label}`,
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate content');
      }
      
      setAiResult(result.generatedCopy || result.content || 'Generated content not available');
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Generation Failed',
        description: error instanceof Error ? error.message : 'An error occurred while generating content. Please try again.',
      });
    } finally {
      setAiIsLoading(false);
    }
  };

  const handleUseAiResult = () => {
    if (aiResult && aiTargetField.value) {
      handleContentChange(aiTargetField.value, aiResult);
      toast({
        title: 'Content Updated',
        description: `The ${aiTargetField.label.toLowerCase()} has been updated with the AI-generated copy.`,
      });
      setAiResult('');
    }
  };

  const editableFieldsForAI = getEditableFieldsForAI(editingComponent?.type as ComponentType || null);
  
  const handleSaveDraft = async () => {
    const data = {
      components,
      styles,
      settings: {
        domain,
        slug,
        funnelProductInfo,
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
        funnelProductInfo,
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
      style={{ backgroundColor: styles.backgroundColor, fontFamily: styles.font }}
    >
      <TemplateRenderer 
        components={components}
        styles={styles}
        buttonStyles={buttonStyles}
      />
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-card border-r overflow-y-auto">
          <Card className="rounded-none border-0 border-b sticky top-0 z-10">
            <CardHeader>
              <CardTitle>Funnel Editor</CardTitle>
            </CardHeader>
          </Card>
          <Tabs defaultValue="components" className="p-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="components" className="space-y-2 pt-4">
              <h3 className="font-semibold text-sm text-blue-600">Layout</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('header')}><PanelTop className="mr-2 h-4 w-4" /> Header</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('footer')}><PanelBottom className="mr-2 h-4 w-4" /> Footer</Button>

              <h3 className="font-semibold text-sm text-blue-600 pt-4">Content Sections</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('hero')}><Star className="mr-2 h-4 w-4" /> Hero</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('features')}><PlusCircle className="mr-2 h-4 w-4" /> Features</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('testimonials')}><MessageSquare className="mr-2 h-4 w-4" /> Testimonials</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('about_coach')}><UserCircle className="mr-2 h-4 w-4" /> About Coach</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('faq')}><HelpCircle className="mr-2 h-4 w-4" /> FAQ</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('guarantee')}><ShieldCheck className="mr-2 h-4 w-4" /> Guarantee</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('stats')}><TrendingUp className="mr-2 h-4 w-4" /> Stats</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('cta')}><Zap className="mr-2 h-4 w-4" /> CTA</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('text')}><Type className="mr-2 h-4 w-4" /> Text Block</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('button')}><RectangleHorizontal className="mr-2 h-4 w-4" /> Button</Button>

              <h3 className="font-semibold text-sm text-blue-600 pt-4">Media</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('image')}><ImageIcon className="mr-2 h-4 w-4" /> Image</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('video')}><VideoIcon className="mr-2 h-4 w-4" /> Video</Button>

              <h3 className="font-semibold text-sm text-blue-600 pt-4">Advanced</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('countdown')}><Clock className="mr-2 h-4 w-4" /> Countdown</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('optinForm')}><Mail className="mr-2 h-4 w-4" /> Opt-in Form</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('customHtml')}><Code className="mr-2 h-4 w-4" /> Custom HTML</Button>
            </TabsContent>

            <TabsContent value="styling" className="space-y-4 pt-4">
              <h3 className="font-semibold text-sm text-blue-600">Global Styles</h3>
              <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                      <Input id="primaryColor" name="primaryColor" type="color" value={styles.primaryColor} onChange={handleStyleChange} className="w-10 h-10 p-1" />
                      <Input value={styles.primaryColor} onChange={handleStyleChange} name="primaryColor" className="flex-1" />
                  </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex items-center gap-2">
                      <Input id="backgroundColor" name="backgroundColor" type="color" value={styles.backgroundColor} onChange={handleStyleChange} className="w-10 h-10 p-1" />
                      <Input value={styles.backgroundColor} onChange={handleStyleChange} name="backgroundColor" className="flex-1" />
                  </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center gap-2">
                      <Input id="textColor" name="textColor" type="color" value={styles.textColor} onChange={handleStyleChange} className="w-10 h-10 p-1" />
                      <Input value={styles.textColor} onChange={handleStyleChange} name="textColor" className="flex-1" />
                  </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font">Font Family</Label>
                <Select onValueChange={handleFontChange} defaultValue={styles.font}>
                  <SelectTrigger id="font">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <h3 className="font-semibold text-sm text-blue-600 pt-4">Button Styles</h3>
                <div className="space-y-2">
                    <Label htmlFor="buttonBorderRadius">Border Radius ({buttonStyles.borderRadius}px)</Label>
                    <Slider
                        id="buttonBorderRadius"
                        min={0}
                        max={50}
                        step={1}
                        value={[buttonStyles.borderRadius]}
                        onValueChange={(value) => handleButtonStylesChange('borderRadius', value[0])}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="buttonShadow">Shadow</Label>
                    <Select
                        value={buttonStyles.shadow}
                        onValueChange={(value) => handleButtonStylesChange('shadow', value)}
                    >
                        <SelectTrigger id="buttonShadow">
                            <SelectValue placeholder="Select a shadow" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="0 1px 2px 0 rgb(0 0 0 / 0.05)">Small</SelectItem>
                            <SelectItem value="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)">Medium (Default)</SelectItem>
                            <SelectItem value="0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)">Large</SelectItem>
                            <SelectItem value="0 25px 50px -12px rgb(0 0 0 / 0.25)">Extra Large</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </TabsContent>      
      <TabsContent value="settings" className="space-y-4 pt-4">
              <h3 className="font-semibold text-sm text-blue-600">Page Settings</h3>
               <div className="space-y-2">
                  <Label>Generated URL</Label>
                  <Input
                      readOnly
                      value={generatedUrl}
                      className="bg-muted text-blue-600"
                  />
                  <p className="text-xs text-blue-600">
                      This is the URL where your funnel will be live.
                  </p>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="domain">Custom Domain (Optional)</Label>
                  <Input
                      id="domain"
                      name="domain"
                      placeholder="e.g., yourdomain.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                  />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                      id="slug"
                      name="slug"
                      placeholder="e.g., my-awesome-funnel"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                  />
              </div>
               <div className="space-y-2 pt-4">
                    <Label htmlFor="funnel-product-info">Product/Offer Description (for AI)</Label>
                    <Textarea
                        id="funnel-product-info"
                        placeholder="Describe the product or service this funnel is for. This will be used as context for the AI Assistant."
                        value={funnelProductInfo}
                        onChange={(e) => setFunnelProductInfo(e.target.value)}
                        className="min-h-[120px]"
                    />
                </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3 bg-gray-50 overflow-y-auto">
          <div className="h-full flex items-start justify-center p-4">
            <div
              className="bg-white shadow-lg border border-gray-200 w-full max-w-4xl"
              style={{ backgroundColor: styles.backgroundColor, fontFamily: styles.font, minHeight: 'calc(100vh - 120px)' }}
            >
              <div className="flex-1 w-full">
                {components.map(component => {
                   const ComponentPreview = componentMap[component.type as keyof typeof componentMap];
                   if (!ComponentPreview) return null;
                  return (
                      <div key={component.id} className="relative group border-2 border-transparent hover:border-primary hover:border-dashed w-full">
                           <div className="absolute -top-3 right-2 z-10 hidden group-hover:flex items-center gap-1 bg-primary p-1 rounded-md shadow text-primary-foreground">
                               <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary-foreground/20" onClick={() => openEditDialog(component)}>
                                   <Pencil className="h-4 w-4"/>
                               </Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 cursor-move hover:bg-primary-foreground/20"><Move className="h-4 w-4"/></Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-primary-foreground/20 hover:text-destructive-foreground" onClick={() => removeComponent(component.id)}><Trash2 className="h-4 w-4"/></Button>
                           </div>
                          <div className="w-full">
                            <ComponentPreview content={component.content} styles={styles} buttonStyles={buttonStyles} isPro={isPro} />
                          </div>
                      </div>
                  );
                })}
              </div>
              {components.length === 0 && (
                  <div className="flex items-center justify-center h-96 text-blue-600">
                      <div className="text-center">
                          <p className="text-lg font-medium">Add components from the sidebar to build your page.</p>
                      </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>      
<Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          if (!open) {
              setEditingComponent(null);
          }
          setIsEditDialogOpen(open);
      }}>
          <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                  <DialogTitle>Edit {editingComponent?.type} Component</DialogTitle>
                  <DialogDescription>
                      Make changes to your component content here. Click save when you&apos;re done.
                  </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="ai-assistant" disabled={editableFieldsForAI.length === 0}>AI Assistant</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="py-4 max-h-[60vh] overflow-y-auto pr-4">
                    {editingComponent?.type === 'text' && (
                        <div className="space-y-2">
                            <Label htmlFor="text-content">Text</Label>
                            <Textarea
                                id="text-content"
                                value={currentContent.text || ''}
                                onChange={(e) => handleContentChange('text', e.target.value)}
                                className="min-h-[200px]"
                            />
                        </div>
                    )}

                    {editingComponent?.type === 'button' && (
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="button-text">Button Text</Label>
                                <Input
                                    id="button-text"
                                    value={currentContent.text || ''}
                                    onChange={(e) => handleContentChange('text', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="button-href">Link URL</Label>
                                <Input
                                    id="button-href"
                                    value={currentContent.href || ''}
                                    onChange={(e) => handleContentChange('href', e.target.value)}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                    )}

                    {editingComponent?.type === 'hero' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="hero-title">Title</Label>
                                <Input id="hero-title" value={currentContent.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hero-subtitle">Subtitle</Label>
                                <Input id="hero-subtitle" value={currentContent.subtitle || ''} onChange={(e) => handleContentChange('subtitle', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hero-cta">CTA Text</Label>
                                <Input id="hero-cta" value={currentContent.cta || ''} onChange={(e) => handleContentChange('cta', e.target.value)} />
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="ai-assistant" className="py-4 max-h-[60vh] overflow-y-auto pr-4">
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Content to Generate</Label>
                            <Select value={aiTargetField.value} onValueChange={(v) => {
                                const field = editableFieldsForAI.find(f => f.value === v);
                                if (field) setAiTargetField(field);
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select what to generate..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {editableFieldsForAI.map(field => (
                                        <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ai-prompt">Prompt / Instruction</Label>
                            <Textarea
                                id="ai-prompt"
                                placeholder="e.g., Make it sound more urgent and exclusive."
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAiGenerate} disabled={aiIsLoading || !aiTargetField.value}>
                            {aiIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                            Generate with AI
                        </Button>

                        {(aiIsLoading || aiResult) && (
                             <div className="space-y-2 pt-4">
                                <Label>Generated Result</Label>
                                <div className="p-4 rounded-md border bg-muted min-h-[120px]">
                                    {aiIsLoading && <div className="flex items-center gap-2 text-blue-600"><Loader2 className="h-4 w-4 animate-spin" /><span>Generating...</span></div>}
                                    {aiResult && <p className="whitespace-pre-wrap">{aiResult}</p>}
                                </div>
                                {aiResult && <Button onClick={handleUseAiResult}>Use this copy</Button>}
                            </div>
                        )}
                    </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button onClick={saveChanges}>Save Changes</Button>
              </DialogFooter>
           </DialogContent>
       </Dialog>

       <EditorActions
         type="funnel"
         isPublished={contentManager.isPublished}
         onSaveDraft={handleSaveDraft}
         onPublishLive={handlePublishLive}
         onPreview={handlePreview}
       />

       <LivePreview
         isOpen={showPreview}
         onClose={() => setShowPreview(false)}
         title="Funnel Preview"
       >
         {renderPreviewContent()}
       </LivePreview>
     </>
   );
 }