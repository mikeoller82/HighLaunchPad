export type ComponentType =
  // Basic Elements
  | 'text' | 'image' | 'video' | 'button' | 'customHtml'
  // Layout Sections
  | 'header' | 'footer' | 'hero' | 'features' | 'pricing' | 'testimonials'
  // Content Blocks
  | 'gallery' | 'team' | 'stats' | 'timeline' | 'portfolio' | 'brands'
  // Interactive
  | 'contact' | 'newsletter' | 'accordion' | 'tabs' | 'map' | 'countdown' | 'quiz' | 'leaderboard' | 'achievement' | 'challenges'
  // E-commerce
  | 'products' | 'cart' | 'checkout' | 'reviews' | 'collections'
  // Marketing
  | 'cta' | 'popup' | 'banner' | 'socialProof'
  // Blog specific
  | 'authorBox'
  // Newsletter specific
  | 'socials' | 'optinForm'
  // Enhanced components
  | 'counter' | 'process' | 'faq' | 'metrics'
  // Gamification specific
  | 'engagement_rewards'
  // Funnel specific
  | 'media' | 'about' | 'case_studies' | 'guarantee' | 'consultation' | 'demo' | 'before_after' | 'transformation' | 'program_details' | 'about_coach' | 'application'
  // Coaching specific
  | 'problem_agitation' | 'transformation_journey' | 'program_curriculum' | 'success_stories' | 'coach_authority' | 'application_process' | 'investment_breakdown' | 'problem_breakdown';

// Enhanced styling properties
export interface ComponentDesign {
  typography: any;
  colors: any;
  shadows: any;
  borders: any;
  interactions: any;
  theme?: 'light' | 'dark' | 'energetic' | 'corporate' | 'elegant' | 'modern' | 'warm' | 'luxury' | 'nature' | 'urgent' | 'professional' | 'executive' | 'security' | 'tech' | 'wellness' | 'coaching' | 'premium-coaching';
  backgroundColor?: string;
  textColor?: string;
  layout?: 'default' | 'split' | 'centered' | 'full-width-image' | 'alternating' | 'sticky-header' | 'hero-split' | 'grid-2x2' | 'centered-card' | 'carousel-cards' | 'grid-3x2' | 'cta-premium' | 'countdown-premium' | 'hero-urgency' | 'pricing-comparison' | 'features-detailed' | 'testimonials-results' | 'guarantee-triple' | 'cta-final' | 'header-professional' | 'hero-authority' | 'media-showcase' | 'about-detailed' | 'case-studies-detailed' | 'testimonials-executive' | 'stats-professional' | 'consultation-premium' | 'cta-executive' | 'header-saas' | 'hero-saas-demo' | 'features-saas' | 'demo-interactive' | 'pricing-saas' | 'testimonials-saas' | 'cta-saas' | 'header-ecommerce' | 'hero-product' | 'features-scientific' | 'before-after-split' | 'testimonials-verified' | 'guarantee-comprehensive' | 'product-pricing' | 'faq-accordion' | 'cta-product' | 'header-coaching' | 'hero-coaching' | 'transformation-journey' | 'program-comprehensive' | 'testimonials-transformation' | 'coach-authority' | 'application-process' | 'guarantee-coaching' | 'cta-coaching' | 'hero-ai-assessment' | 'process-detailed' | 'quiz-premium' | 'testimonials-carousel' | 'form-centered' | 'faq-detailed' | 'guarantee-detailed' | 'stats-grid' | 'cta-webinar-final' | 'pulseGlow' | 'counterAnimate' | 'staggerChildren' | 'header-premium' | 'hero-split-premium' | 'problem-grid' | 'transformation-timeline-premium' | 'curriculum-comprehensive' | 'success-stories-immersive' | 'coach-authority-premium' | 'application-premium';
  animations?: string[];
  glassEffect?: boolean;
  cardStyle?: string;
  urgencyElements?: boolean;
  urgencyIndicators?: boolean;
  professionalLayout?: boolean;
  personalBranding?: boolean;
  techElements?: boolean;
  interactiveElements?: boolean;
  interactive?: boolean;
  scientificCredibility?: boolean;
  trustIndicators?: boolean;
  productFocus?: boolean;
  productShowcase?: boolean;
  progressIndicator?: boolean | string;
  spacing?: string;
  sticky?: boolean;

  backgroundImage?: string;
  backgroundSize?: 'auto' | 'cover' | 'contain';
  backgroundPosition?: string;
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';
  accentColor?: string;
  
  // Spacing
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  margin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  
  // Border & Effects
  border?: {
    width?: number;
    color?: string;
    radius?: number;
    style?: 'solid' | 'dashed' | 'dotted';
  };
  shadow?: {
    enabled?: boolean;
    blur?: number;
    spread?: number;
    color?: string;
    x?: number;
    y?: number;
  };
  
  // Animation
  animation?: {
    type?: 'none' | 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'zoomIn' | 'zoomOut' | 'bounce' | 'pulse' | 'shake' | 'flip' | 'scaleIn' | 'pulseGlow' | 'counterAnimate' | 'staggerChildren';
    duration?: number;
    delay?: number;
    easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  };
  
  // Transform
  transform?: {
    rotate?: number;
    scale?: number;
    translateX?: number;
    translateY?: number;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
  };
  
  // Visibility
  visibility?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
    condition?: string;
  };
  
  // Position
  position?: {
    type?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    zIndex?: number;
  };
  
  // Custom
  customClasses?: string;
  customStyles?: string;
}

// Enhanced content properties
export interface ComponentContent {
  // Text content
  title?: string;
  subtitle?: string;
  description?: string;
  text?: string;
  
  // Media
  image?: string;
  imageAlt?: string;
  video?: string | {
    thumbnail?: string;
    duration?: string;
    title?: string;
    url?: string;
  };
  videoType?: 'youtube' | 'vimeo' | 'mp4';
  
  // Links & Actions
  cta?: string | {
    primary?: string;
    secondary?: string;
    note?: string;
  };
  ctaUrl?: string;
  secondaryCta?: string;
  secondaryCtaUrl?: string;
  links?: Array<{
    label: string;
    href: string;
    target?: string;
  }>;
  
  // Lists & Collections
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
    image?: string;
    color?: string;
    module?: string;
    demo?: string;
    scientificBacking?: string;
    benefit?: string;
    timeframe?: string;
  }> | Array<{
    title: string;
    description?: string;
  }> | string[];
  testimonials?: Array<{
    quote: string;
    author: string;
    role?: string;
    company?: string;
    image?: string;
    rating?: number;
    results?: string;
    metric?: string;
    logo?: string;
    location?: string;
    verified?: boolean;
    beforeAfter?: {
      before: string;
      after: string;
    };
    [key: string]: any; // Allow additional properties
  }>;
  team?: Array<{
    name: string;
    role: string;
    bio?: string;
    image?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  }>;
  
  // Quiz specific content
  questions?: Array<{
    question: string;
    options?: string[];
    type?: string;
    helpText?: string;
  }>;
  
  // Stats specific content
  stats?: Array<{
    value: string;
    label: string;
    icon?: string;
    description?: string;
  }>;
  
  // Pricing specific content
  plans?: Array<{
    name: string;
    price?: string;
    frequency?: string;
    description?: string;
    features: Array<{
      title: string;
      description: string;
      icon?: string;
      image?: string;
      color?: string;
      module?: string;
      demo?: string;
      scientificBacking?: string;
      benefit?: string;
      timeframe?: string;
    }> | Array<{
      title: string;
      description?: string;
    }> | string[];
    cta: string;
    ctaUrl?: string;
    disabled?: boolean;
    strikethrough?: boolean;
    badge?: string;
    featured?: boolean;
    savings?: string;
    urgency?: string;
    priceRange?: string;
    trustSignals?: string[];
    popular?: boolean;
    exclusive?: boolean;
    deliverables?: string[];
    roi?: string;
    enterprise?: boolean;
    bestFor?: string;
    timeline?: string;
    guarantee?: string;
  }>;
  
  // Countdown specific content
  endDate?: string;
  urgencyMessage?: string;
  scarcityMessage?: string;
  
  // Social proof
  socialProof?: string;
  guaranteeText?: string;
  urgency?: string;
  badges?: Array<{
    label: string;
    color: string;
    icon?: string;
  }>;
  
  // Coach/About specific content
  coach?: {
    name: string;
    title: string;
    image: string;
    bio?: string;
    credentials?: string[];
    achievements?: Array<{ stat: string; label: string }>;
    quote?: string;
  };
  
  // Guarantee specific content
  guarantees?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  
  // Styling overrides
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: 'none' | 'underline' | 'line-through';
  lineHeight?: number;
  letterSpacing?: number;
  
  // Form fields (for contact/newsletter components)
  fields?: Array<{
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }>;
  
  // E-commerce
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
  }>;
  
  // Footer specific
  copyright?: string;
  socials?: Array<{
    label: string;
    href: string;
  }> | Record<string, string>;
  
  // Conditional display
  showIf?: string;
  hideIf?: string;
  
  // Custom properties
  [key: string]: any;
}

// Updated Component interface
export interface Component {
  metadata: any;
  id: number;
  type: ComponentType;
  content: ComponentContent;
  design?: ComponentDesign;
  scripts?: string;
  styles?: Record<string, any>;
  
  // Metadata
  name?: string;
  locked?: boolean;
  hidden?: boolean;
  
  // Responsive settings
  responsive?: {
    desktop?: Partial<ComponentContent & ComponentDesign>;
    tablet?: Partial<ComponentContent & ComponentDesign>;
    mobile?: Partial<ComponentContent & ComponentDesign>;
  };
  
  // A/B Testing
  variants?: Array<{
    id: string;
    name: string;
    content: Partial<ComponentContent>;
    design?: Partial<ComponentDesign>;
    weight?: number;
  }>;
  
  // Analytics
  tracking?: {
    events?: Array<{
      trigger: 'click' | 'view' | 'hover' | 'submit';
      action: string;
      category?: string;
      label?: string;
    }>;
  };
}

// Block-related interfaces (from types.ts)
export interface Block {
  id: string;
  name: string;
  description: string;
  category: BlockCategory;
  type: ComponentType;
  thumbnail: string;
  content: ComponentContent;
  design?: ComponentDesign;
  tags: string[];
  isCustom?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  usageCount?: number;
  rating?: number;
  featured?: boolean;
}

export type BlockCategory = 
  | 'headers'
  | 'heroes' 
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'footers'
  | 'cta'
  | 'content'
  | 'forms'
  | 'media'
  | 'navigation'
  | 'social'
  | 'custom';

export interface BlockCollection {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
  category: BlockCategory;
  featured?: boolean;
}

export interface UserBlock extends Block {
  workspaceId: string;
  isPrivate: boolean;
  sharedWith?: string[];
}

export interface BlocksFilter {
  category?: BlockCategory;
  tags?: string[];
  search?: string;
  featured?: boolean;
  custom?: boolean;
}

export interface BlocksResponse {
  blocks: Block[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Funnel template interfaces
export interface FunnelTemplate {
  metadata?: Record<string, any>;
  id: string;
  title: string;
  description: string;
  image: string;
  hint: string;
  stats: { ctr: number; optInRate: number; healthScore: number };
  aiInsight: string;
  components: Component[];
  purpose: string;
  targetAudience: string;
  conversionStrategy: string;
  industry?: string;
  psychologicalTriggers?: string[];
}