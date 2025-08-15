import type { Block } from './blocks-types';

export const prebuiltBlocks: Block[] = [
  // Header Blocks
  {
    id: 'header-modern',
    name: 'Modern Header',
    description: 'Clean, modern header with navigation and CTA button',
    category: 'headers',
    type: 'header',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
    content: {
      title: 'YourBrand',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Contact', href: '#contact' }
      ],
      cta: 'Get Started',
      ctaUrl: '#signup'
    },
    design: {
      theme: 'modern',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#3b82f6',
      padding: { top: 16, bottom: 16, left: 24, right: 24 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['navigation', 'modern', 'clean'],
    featured: true
  },
  {
    id: 'header-dark',
    name: 'Dark Header',
    description: 'Sleek dark header with gradient background',
    category: 'headers',
    type: 'header',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
    content: {
      title: 'TechFlow',
      links: [
        { label: 'Products', href: '/products' },
        { label: 'Solutions', href: '/solutions' },
        { label: 'Resources', href: '/resources' },
        { label: 'About', href: '/about' }
      ],
      cta: 'Start Free Trial',
      ctaUrl: '/signup'
    },
    design: {
      theme: 'dark',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      accentColor: '#8b5cf6',
      padding: { top: 20, bottom: 20, left: 32, right: 32 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['navigation', 'dark', 'gradient'],
    featured: true
  },

  // Hero Blocks
  {
    id: 'hero-saas',
    name: 'SaaS Hero',
    description: 'Conversion-focused hero section for SaaS products',
    category: 'heroes',
    type: 'hero',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    content: {
      title: 'Transform Your Business with AI-Powered Solutions',
      subtitle: 'Join 50,000+ companies using our platform to automate workflows, boost productivity by 340%, and scale faster than ever before.',
      cta: 'Start Free Trial',
      ctaUrl: '/signup',
      secondaryCta: 'Watch Demo',
      secondaryCtaUrl: '/demo',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
    },
    design: {
      theme: 'modern',
      backgroundColor: '#f8fafc',
      textColor: '#1f2937',
      accentColor: '#3b82f6',
      layout: 'split',
      padding: { top: 80, bottom: 80, left: 24, right: 24 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['saas', 'conversion', 'split-layout'],
    featured: true
  },
  {
    id: 'hero-consulting',
    name: 'Consulting Hero',
    description: 'Authority-building hero for consultants and coaches',
    category: 'heroes',
    type: 'hero',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    content: {
      title: 'Scale Your Business to 7-Figures Without Burning Out',
      subtitle: 'Proven strategies used by 500+ entrepreneurs to build profitable, sustainable businesses. Get your custom growth plan in our free strategy session.',
      cta: 'Book Free Strategy Call',
      ctaUrl: '/book-call',
      secondaryCta: 'Learn More',
      secondaryCtaUrl: '/about',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
    },
    design: {
      theme: 'professional',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#dc2626',
      layout: 'centered',
      padding: { top: 100, bottom: 100, left: 24, right: 24 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['consulting', 'authority', 'centered'],
    featured: true
  },
  {
    id: 'hero-ecommerce',
    name: 'E-commerce Hero',
    description: 'Product-focused hero with strong visual appeal',
    category: 'heroes',
    type: 'hero',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    content: {
      title: 'Premium Quality, Unbeatable Prices',
      subtitle: 'Discover our curated collection of premium products. Free shipping on orders over $50. 30-day money-back guarantee.',
      cta: 'Shop Now',
      ctaUrl: '/shop',
      secondaryCta: 'View Collections',
      secondaryCtaUrl: '/collections',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
    },
    design: {
      theme: 'warm',
      backgroundColor: '#fffbeb',
      textColor: '#92400e',
      accentColor: '#f59e0b',
      layout: 'full-width-image',
      padding: { top: 60, bottom: 60, left: 24, right: 24 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['ecommerce', 'product', 'visual'],
    featured: true
  },

  // Feature Blocks
  {
    id: 'features-grid',
    name: 'Features Grid',
    description: '3-column feature grid with icons and descriptions',
    category: 'features',
    type: 'features',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    content: {
      title: 'Everything You Need to Succeed',
      subtitle: 'Powerful features designed to help you grow your business',
      features: [
        {
          title: '10x ROI Guarantee',
          description: 'Our clients see an average 10x return on investment within 90 days, or we work for free until you do.',
          icon: '📈'
        },
        {
          title: 'Lightning Fast Setup',
          description: 'Go from signup to first results in under 24 hours. No complex onboarding or lengthy setup processes.',
          icon: '⚡'
        },
        {
          title: 'Enterprise Security',
          description: 'Bank-level encryption, SOC 2 compliance, and GDPR ready. Your data is always safe and secure.',
          icon: '🔒'
        }
      ]
    },
    design: {
      theme: 'modern',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#3b82f6',
      padding: { top: 80, bottom: 80, left: 24, right: 24 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['features', 'grid', 'icons'],
    featured: true
  },
  {
    id: 'features-alternating',
    name: 'Alternating Features',
    description: 'Features with alternating image and text layout',
    category: 'features',
    type: 'features',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    content: {
      title: 'Powerful Features for Modern Businesses',
      features: [
        {
          title: 'AI-Powered Analytics',
          description: 'Get actionable insights with our advanced AI that analyzes your data and provides recommendations for growth.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
        },
        {
          title: 'Seamless Integrations',
          description: 'Connect with 500+ tools and platforms. Set up takes less than 5 minutes with our one-click integrations.',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop'
        },
        {
          title: '24/7 Expert Support',
          description: 'Our team of experts is available around the clock to help you succeed. Average response time: 2 minutes.',
          image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&h=400&fit=crop'
        }
      ]
    },
    design: {
      theme: 'modern',
      backgroundColor: '#f8fafc',
      textColor: '#1f2937',
      accentColor: '#3b82f6',
      layout: 'alternating',
      padding: { top: 80, bottom: 80, left: 24, right: 24 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['features', 'alternating', 'images'],
    featured: true
  },

  // Testimonial Blocks
  {
    id: 'testimonials-grid',
    name: 'Testimonials Grid',
    description: 'Social proof with customer testimonials in grid layout',
    category: 'testimonials',
    type: 'testimonials',
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop',
    content: {
      title: 'Trusted by 10,000+ Happy Customers',
      subtitle: 'See what our customers are saying about their results',
      testimonials: [
        {
          quote: 'This platform increased our conversion rate by 340% in just 3 months. The ROI has been incredible.',
          author: 'Sarah Chen',
          role: 'CEO',
          company: 'TechFlow',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
          rating: 5,
          results: '+340% conversion rate'
        },
        {
          quote: 'We went from $50K to $500K ARR in 8 months. The strategies actually work and the support is phenomenal.',
          author: 'Marcus Rodriguez',
          role: 'Founder',
          company: 'GrowthLab',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          rating: 5,
          results: '$450K ARR increase'
        },
        {
          quote: 'The automation features saved us 20 hours per week. Our team can now focus on high-value activities.',
          author: 'Emily Watson',
          role: 'COO',
          company: 'ScaleUp Inc',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
          rating: 5,
          results: '20 hours saved/week'
        }
      ]
    },
    design: {
      theme: 'modern',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#3b82f6',
      padding: { top: 80, bottom: 80, left: 24, right: 24 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['testimonials', 'social-proof', 'grid'],
    featured: true
  },

  // Pricing Blocks
  {
    id: 'pricing-saas',
    name: 'SaaS Pricing',
    description: 'Clean pricing table perfect for SaaS products',
    category: 'pricing',
    type: 'pricing',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    content: {
      title: 'Simple, Transparent Pricing',
      subtitle: 'Choose the plan that fits your needs. Upgrade or downgrade at any time.',
      features: [
        {
          title: 'Starter',
          description: 'Perfect for small teams getting started.',
          icon: '$29/month'
        },
        {
          title: 'Professional',
          description: 'For growing businesses that need more power.',
          icon: '$79/month'
        },
        {
          title: 'Enterprise',
          description: 'Advanced features for large organizations.',
          icon: 'Custom'
        }
      ]
    },
    design: {
      theme: 'modern',
      backgroundColor: '#f8fafc',
      textColor: '#1f2937',
      accentColor: '#3b82f6',
      padding: { top: 80, bottom: 80, left: 24, right: 24 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['pricing', 'saas', 'table'],
    featured: true
  },

  // CTA Blocks
  {
    id: 'cta-urgent',
    name: 'Urgent CTA',
    description: 'High-converting call-to-action with urgency',
    category: 'cta',
    type: 'cta',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    content: {
      title: 'Ready to Transform Your Business?',
      subtitle: 'Join thousands of successful entrepreneurs who have already made the switch. Limited time offer ends soon!',
      cta: 'Get Started Now',
      ctaUrl: '/signup',
      secondaryCta: 'Learn More',
      secondaryCtaUrl: '/about'
    },
    design: {
      theme: 'urgent',
      backgroundColor: '#dc2626',
      textColor: '#ffffff',
      accentColor: '#f59e0b',
      padding: { top: 60, bottom: 60, left: 24, right: 24 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['cta', 'urgent', 'conversion'],
    featured: true
  },

  // Footer Blocks
  {
    id: 'footer-comprehensive',
    name: 'Comprehensive Footer',
    description: 'Complete footer with links, social media, and contact info',
    category: 'footers',
    type: 'footer',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
    content: {
      title: 'YourBrand',
      description: 'Building the future of business automation, one company at a time.',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' }
      ]
    },
    design: {
      theme: 'dark',
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
      accentColor: '#3b82f6',
      padding: { top: 60, bottom: 40, left: 24, right: 24 },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    },
    tags: ['footer', 'comprehensive', 'links'],
    featured: true
  }
];

export const getBlocksByCategory = (category: string) => {
  return prebuiltBlocks.filter(block => block.category === category);
};

export const getFeaturedBlocks = () => {
  return prebuiltBlocks.filter(block => block.featured);
};

export const searchBlocks = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return prebuiltBlocks.filter(block => 
    (block.name?.toLowerCase().includes(lowercaseQuery)) ||
    (block.description?.toLowerCase().includes(lowercaseQuery)) ||
    (block.tags?.some(tag => tag?.toLowerCase().includes(lowercaseQuery)))
  );
};

export const getBlockById = (id: string) => {
  return prebuiltBlocks.find(block => block.id === id);
};