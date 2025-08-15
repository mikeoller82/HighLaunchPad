import type { Component } from './types';
import { defaultContent } from './default-content';

interface CoachingProgramConfig {
  coach: {
    name: string;
    title: string;
    image: string;
    credentials: string[];
    achievements: Array<{ stat: string; label: string }>;
  };
  program: {
    name: string;
    duration: string;
    cohortSize: number;
    nextStartDate: string;
    spotsRemaining: number;
    price: number;
    totalValue: number;
  };
}

const coachingConfig: CoachingProgramConfig = {
  coach: {
    name: 'Sarah Chen',
    title: 'Elite Performance Coach & 7-Figure Entrepreneur',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    credentials: [
      'ICF Certified Master Coach',
      'Psychology Degree, Stanford University',
      'Built & sold 2 seven-figure companies',
      'Forbes "30 Under 30" recipient',
      'NYT Bestselling Author'
    ],
    achievements: [
      { stat: '5,000+', label: 'Lives Transformed' },
      { stat: '7-Figure', label: 'Businesses Built' },
      { stat: '98%', label: 'Success Rate' },
      { stat: '500K+', label: 'Podcast Downloads' }
    ]
  },
  program: {
    name: 'Elite Mindset Academy',
    duration: '90 Days',
    cohortSize: 25,
    nextStartDate: 'March 1st, 2025',
    spotsRemaining: 8,
    price: 2997,
    totalValue: 12179
  }
};

export interface FunnelTemplate {
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
}

let componentId = 1;
const getNextId = () => componentId++;

/* ------------------------------------------------------------------ */
/*  ENHANCED TEMPLATE 1: QUIZ LEAD MAGNET - Modern Interactive Assessment */
/* ------------------------------------------------------------------ */
const modernQuizLeadMagnetFunnel: Component[] = [
    {
      metadata: {},
      id: getNextId(),
      type: "header",
      name: "AI Assessment Header",
      content: {
        title: "ProfitGenius AI",
        logo: {
          svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7L12 12L22 7" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V12" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        links: [
          { label: "How It Works", href: "#process" },
          { label: "Success Stories", href: "#testimonials" },
          { label: "About The AI", href: "#about" }
        ],
        cta: "Start Free Assessment",
        ctaUrl: "#quiz"
      },
      design: {
        theme: "tech",
        layout: "header-professional",
        backgroundColor: "rgba(30, 41, 59, 0.85)",
        textColor: "#f1f5f9",
        accentColor: "#10b981",
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {},
        glassEffect: true,
        position: { type: "sticky", top: 0, zIndex: 50 },
        border: { width: 1, color: "rgba(51, 65, 85, 0.5)" },
        animation: { type: "fadeInDown", duration: 800 }
      },
      tracking: {
        events: [
          { trigger: "click", action: "click_header_cta", label: "Start Free Assessment" }
        ]
      }
    },
    {
      metadata: {},
      id: getNextId(),
      type: "hero",
      name: "AI Assessment Hero",
      content: {
        title: "Are You Leaving Hidden Profits On The Table?",
        subtitle: "Uncover your #1 profit leak in 60 seconds. Our proprietary AI analyzes your business model against 50,000+ successful companies to reveal the hidden growth opportunities your competitors are already using to dominate.",
        cta: {
          primary: "Take the Free AI Assessment",
          secondary: "Watch 2-Min Demo",
          note: "Get your personalized profit report instantly."
        },
        image: "https://firebasestorage.googleapis.com/v0/b/firebase-veilnet.firebasestorage.app/o/ai-assessment-hero.png?alt=media&token=c1110729-e58f-4ed3-9118-2c2e01df2220",
        imageAlt: "Advanced AI business analytics and profit optimization dashboard",
        socialProof: "📈 Join 50,000+ businesses who have unlocked their profit potential",
        urgency: "⏰ Limited Time: Your free, personalized AI report is ready in 60 seconds."
      },
      design: {
        theme: "tech",
        layout: "hero-ai-assessment",
        backgroundColor: "#0f172a",
        backgroundImage: "radial-gradient(circle at top, rgba(30, 41, 59, 0.8), #0f172a), url('/images/grid-pattern.svg')",
        textColor: "#f8fafc",
        accentColor: "#10b981",
        animation: { type: "pulseGlow", delay: 500 },
        techElements: true,
        padding: { top: 100, bottom: 100 },
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
      variants: [
        {
          id: "v2-question-headline",
          name: "Question-based Headline",
          content: {
            title: "What's The One Thing Holding Your Business Back?",
            subtitle: "Our AI can tell you in 60 seconds. We analyze your business model against 50,000+ successful companies to find the #1 constraint limiting your growth—and give you a clear plan to fix it."
          },
          weight: 0.5
        }
      ],
      // ...existing code...
    },
    {
      metadata: {},
      id: getNextId(),
      type: "media",
      content: {},
      design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {}, theme: "dark", backgroundColor: "#0f172a", padding: { top: 0, bottom: 80 }, animation: { type: "fadeInUp", duration: 800, delay: 200 } },
    },
    {
      metadata: {},
      id: getNextId(),
      type: "brands",
      name: "Social Proof - As Seen On",
      content: {
        title: "Powering Insights for Industry Leaders",
        brands: [
          { name: "Forbes", logo: "/images/logo-forbes-dark.svg" },
          { name: "Inc.", logo: "/images/logo-inc-dark.svg" },
          { name: "TechCrunch", logo: "/images/logo-techcrunch-dark.svg" },
          { name: "Entrepreneur", logo: "/images/logo-entrepreneur-dark.svg" },
          { name: "Fast Company", logo: "/images/logo-fastcompany-dark.svg" }
        ]
      },
      design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {}, theme: "dark", backgroundColor: "#0f172a", padding: { top: 0, bottom: 80 }, animation: { type: "fadeInUp", duration: 800, delay: 200 } }
    },
    {
      metadata: {},
      id: getNextId(),
      type: "process",
      name: "AI Assessment Process",
      content: {
        title: "From Uncertainty to a Clear Growth Plan in Minutes",
        subtitle: "Our 3-step process uses advanced AI to deliver actionable clarity.",
        features: [
          {
            icon: "clipboard-check",
            title: "1. Take the 60-Second Assessment",
            description: "Answer a few strategic questions. Our adaptive AI personalizes the quiz for maximum accuracy.",
            benefit: "Personalized questions",
            timeframe: "60 seconds"
          },
          {
            icon: "cpu-chip",
            title: "2. Get Instant AI Analysis",
            description: "Our algorithm analyzes your answers against millions of data points, identifying patterns competitors miss.",
            benefit: "AI-driven insights",
            timeframe: "Instant analysis"
          },
          {
            icon: "document-chart-bar",
            title: "3. Unlock Your Custom Blueprint",
            description: "Receive a step-by-step report detailing your top 3 profit opportunities and implementation strategies.",
            benefit: "Actionable roadmap",
            timeframe: "15-page report"
          }
        ]
      },
      design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {}, theme: "professional", layout: "process-detailed", backgroundColor: "#f8fafc", textColor: "#1e293b", animation: { type: "staggerChildren", duration: 500 }, shadow: { enabled: true, blur: 40, color: "rgba(100, 116, 139, 0.1)" }, padding: { top: 80, bottom: 80 } },
    },
    {
      metadata: {},
      id: getNextId(),
      type: "guarantee",
      name: "Our Ironclad Promise",
      content: {
        title: "Take The Assessment With Confidence",
        guarantees: [
          { icon: "lock-closed", title: "100% Confidential", description: "Your business data is encrypted and never shared. Your privacy is our absolute priority." },
          { icon: "light-bulb", title: "Actionable Insights", description: "We don't just give you data; we give you a clear, step-by-step plan to increase profits." },
          { icon: "gift", title: "Completely Free", description: "This is not a trial. Get your full, comprehensive AI-powered report at zero cost." }
        ]
      },
      design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {}, theme: "professional", layout: "guarantee-detailed", backgroundColor: "#f1f5f9", textColor: "#1e293b", padding: { top: 80, bottom: 80 } },
    },
    {
      metadata: {},
      id: getNextId(),
      type: "quiz",
      name: "AI Profit Assessment Quiz",
      content: {
        title: "Start Your AI-Powered Profit Assessment",
        subtitle: "Answer these 5 questions to generate your personalized 15-page profit optimization report.",
        progressIndicator: true,
        questions: [
          { question: "What's your current monthly revenue range?", options: ["Pre-Revenue / Startup", "Under $10K", "$10K - $50K", "$50K - $250K", "$250K+"], type: "single-choice", helpText: "Helps our AI calibrate recommendations to your business size." },
          { question: "What is your primary business model?", options: ["E-commerce", "SaaS/Software", "Service-Based (Agency, Consulting)", "Info-Product/Coaching", "Other"], type: "single-choice", helpText: "Different models have unique profit levers." },
          { question: "What's your single biggest growth challenge right now?", options: ["Getting More Leads", "Converting Leads to Sales", "Keeping Customers Longer", "Low Profit Margins", "Scaling My Team/Operations"], type: "single-choice", helpText: "We'll prioritize solutions for your most pressing need." },
          { question: "How confident are you in your current pricing strategy?", options: ["1 (Clueless)", "2 (Uncertain)", "3 (It's okay)", "4 (Confident)", "5 (Mastered)"], type: "single-choice-scale", helpText: "Pricing is often the fastest path to more profit." }
        ]
      },
      design: {
        theme: "modern",
        layout: "quiz-premium",
        backgroundColor: "#ffffff",
        accentColor: "#10b981",
        border: { width: 1, color: "#e2e8f0" },
        shadow: { enabled: true, blur: 50, color: "rgba(100, 116, 139, 0.15)" },
        animation: { type: "fadeInUp", duration: 600 },
        padding: { top: 60, bottom: 60 },
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      metadata: {},
      id: getNextId(),
      type: "testimonials",
      name: "Success Stories",
      content: {
        title: "From Report to Real-World Results",
        subtitle: "See how entrepreneurs turned their AI-generated insights into massive profit.",
        testimonials: [
          { quote: "The assessment pinpointed a pricing leak that was costing us over $8k a month. We adjusted our tiers based on the AI's advice and saw a 35% revenue lift in 60 days.", author: "Jenna Carter", role: "Founder, InnovateSaaS", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face", logo: "/images/logo-innovatesaas-dark.svg", metric: "+35%", results: "Revenue Lift", verified: true },
          { quote: "I was burning money on the wrong marketing channels. The AI report showed me exactly where my most profitable customers were hiding. We re-allocated our ad spend and our ROAS tripled.", author: "Marcus Thorne", role: "CEO, UrbanVogue", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face", logo: "/images/logo-urbanvogue-dark.svg", metric: "3x", results: "Return on Ad Spend", verified: true }
        ]
      },
      design: {
        theme: "luxury",
        layout: "testimonials-results",
        backgroundColor: "#1e293b",
        textColor: "#e2e8f0",
        glassEffect: true,
        padding: { top: 80, bottom: 80 },
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      metadata: {},
      id: getNextId(),
      type: "stats",
      name: "Impact Analytics",
      content: {
        stats: [
          { value: "$28,700", label: "Avg. Annual Profit Found", icon: "currency-dollar" },
          { value: "92%", label: "Users Find a 'Quick Win'", icon: "sparkles" },
          { value: "4.9/5", label: "Average User Rating", icon: "star" },
          { value: "7 Min", label: "Avg. Time to Act on Insight", icon: "clock" }
        ]
      },
      design: {
        theme: "professional",
        layout: "stats-professional",
        backgroundColor: "#f8fafc",
        textColor: "#1e293b",
        accentColor: "#10b981",
        animation: { type: "counterAnimate", duration: 2000, delay: 200 },
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      metadata: {},
      id: getNextId(),
      type: "faq",
      name: "Frequently Asked Questions",
      content: {
        title: "Still Have Questions?",
        subtitle: "We've got answers to the most common queries.",
        faqs: [
          { question: "How accurate is the AI analysis?", answer: "Our AI is trained on a proprietary dataset of over 50,000 businesses and is continuously updated. While it provides high-probability strategies, results depend on your implementation." },
          { question: "Is my business data secure?", answer: "Yes. We use end-to-end encryption. Your data is used solely to generate your report and is never shared or sold. See our Privacy Policy for more." },
          { question: "What happens after I get the report?", answer: "The report is yours to keep and implement. You'll also have the option to book a complimentary call with a profit strategist to discuss your results in more detail." }
        ]
      },
      design: {
        theme: "light",
        layout: "faq-accordion",
        backgroundColor: "#FFFFFF",
        padding: { top: 80, bottom: 80 },
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      metadata: {},
      id: getNextId(),
      type: "cta",
      name: "Final CTA",
      content: {
        title: "Your Personalized Profit Blueprint is One Click Away",
        subtitle: "Stop guessing what will grow your business and start knowing. Get your free, data-driven action plan now.",
        cta: "Generate My Free AI Analysis",
        ctaUrl: "#quiz",
        guaranteeText: "100% Free & Confidential. No credit card required, ever."
      },
      design: {
        theme: "energetic",
        layout: "cta-final",
        backgroundColor: "#10b981",
        backgroundImage: "linear-gradient(45deg, #10b981, #0d9488)",
        textColor: "#ffffff",
        animation: { type: "pulseGlow", duration: 2500 },
        shadow: { enabled: true, blur: 40, color: "rgba(16, 185, 129, 0.4)" },
        padding: { top: 80, bottom: 80 },
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      metadata: {},
      id: getNextId(),
      type: "footer",
      name: "Funnel Footer",
      content: {
        logo: {
          svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7L12 12L22 7" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V12" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        description: "ProfitGenius AI - Data-Driven Growth.",
        copyright: "© 2025 ProfitGenius AI. All Rights Reserved.",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" }
        ]
      },
      design: {
        theme: "dark",
        backgroundColor: "#0f172a",
        textColor: "#94a3b8",
        padding: { top: 40, bottom: 40 },
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    }
  ];


/* ------------------------------------------------------------------ */
/*  ENHANCED TEMPLATE 2: SCARCITY FLASH SALE - Ultra-High Converting Urgency */
/* ------------------------------------------------------------------ */

const premiumScarcityFlashSaleFunnel: Component[] = [
  {
    metadata: {},
    id: getNextId(),
    type: 'header',
    name: 'Flash Sale Header',
    content: {
      title: 'DIGITAL EMPIRE ACADEMY',
      subtitle: 'Premium Business Training & Systems',
      links: [
        { label: 'Flash Offer', href: '#offer' },
        { label: 'Exclusive Bonuses', href: '#bonuses' },
        { label: 'Success Stories', href: '#testimonials' },
        { label: 'Secure Access', href: '#purchase' }
      ]
    },
    design: {
      theme: 'urgent',
      backgroundColor: '#dc2626',
      backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
      textColor: '#ffffff',
      layout: 'sticky-header',
      shadow: { enabled: true, color: 'rgba(220, 38, 38, 0.3)', blur: 15 },
      animation: { type: 'slideInDown', duration: 800 },
      urgencyElements: true,
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    }
  },
  {
    metadata: {},
    id: getNextId(),
    type: 'countdown',
    name: 'Flash Sale Countdown',
    content: {
      title: '🚨 EMERGENCY FLASH SALE - ENDING SOON!',
      subtitle: 'Last 24 hours to get 75% OFF our proven $10K/month system',
      endDate: '2025-03-16T23:59:59',
      urgencyMessage: 'This exact price will NEVER be available again after midnight!',
      scarcityMessage: 'Only 47 spots remaining at this price',
      cta: 'Secure Your Spot Now',
      ctaUrl: '#purchase',
      features: [
        '🔥 75% OFF - Save $400 instantly',
        '⚡ Instant access to all 12 modules',
        '🎁 $450 worth of exclusive bonuses',
        '🛡️ 30-day money-back guarantee',
        '♾️ Lifetime access + future updates'
      ]
    },
    design: {
      theme: 'urgent',
      backgroundColor: '#dc2626',
      backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
      textColor: '#ffffff',
      layout: 'countdown-premium',
      animation: { type: 'pulse', duration: 2000 },
      urgencyElements: true,
      shadow: { enabled: true, blur: 20, color: 'rgba(220, 38, 38, 0.4)' },
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    }
  },
  {
    metadata: {},
    id: getNextId(),
    type: 'hero',
    name: 'Flash Sale Hero',
    content: {
      title: '🔥 FLASH SALE: Complete Digital Empire Building System',
      subtitle: 'Everything you need to build a consistent $10K/month online business from scratch. This comprehensive system includes 12 modules of proven strategies, templates, and tools used by successful entrepreneurs worldwide. Normally $497, get lifetime access TODAY for just $97! This offer expires at midnight.',
      cta: 'SECURE YOUR SPOT NOW',
      ctaUrl: '#purchase',
      secondaryCta: 'See Full Training Breakdown',
      secondaryCtaUrl: '#features',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop',
      imageAlt: 'Digital business empire building system and training materials',
      urgency: '⏰ WARNING: Only 47 spots left at this price',
      socialProof: '✅ 1,247+ students enrolled in the last 48 hours',
      guaranteeText: '🛡️ 30-day money-back guarantee + lifetime access',
      badges: [
        { label: '75% OFF Today Only', color: 'red', icon: 'percent' },
        { label: '30-Day Guarantee', color: 'green', icon: 'shield-check' },
        { label: 'Instant Access', color: 'blue', icon: 'zap' },
        { label: 'Lifetime Updates', color: 'purple', icon: 'infinity' }
      ]
    },
    design: {
      theme: 'urgent',
      layout: 'hero-urgency',
      backgroundColor: '#fef2f2',
      backgroundImage: 'linear-gradient(135deg, #fef2f2 0%, #fef3c7 50%, #fef7cd 100%)',
      textColor: '#1e40af',
      accentColor: '#dc2626',
      animation: { type: 'slideInUp', duration: 1000, delay: 200 },
      urgencyElements: true,
      professionalLayout: true,
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {}
    }
  },
  {
    id: getNextId(),
    type: 'pricing',
    name: 'Flash Sale Pricing',
    content: {
      title: '💥 Flash Sale Pricing - Save $400 Today',
      subtitle: 'Compare what you get vs. what everyone else pays tomorrow',
      plans: [
        {
          name: 'Tomorrow\'s Price',
          price: '$497',
          frequency: 'Regular pricing starts tomorrow',
          description: 'What new customers pay after this sale',
          features: [
            '12-Module Video Course (15+ hours)',
            'Downloadable Templates & Worksheets',
            'Private Community Access',
            'Email Support'
          ],
          cta: 'Not Available',
          ctaUrl: '#',
          disabled: true,
          strikethrough: true,
          badge: 'Regular Price'
        },
        {
          name: 'FLASH SALE ONLY',
          price: '$97',
          frequency: 'Limited time - expires at midnight',
          description: 'Save $400 + get exclusive bonuses worth $450',
          features: [
            '✅ 12-Module Video Course (15+ hours)',
            '✅ 50+ Templates & Worksheets',
            '✅ Private VIP Community Access',
            '✅ Priority Email & Chat Support',
            '🎁 BONUS: 1-on-1 Strategy Call ($200 value)',
            '🎁 BONUS: Advanced Funnel Templates ($150 value)',
            '🎁 BONUS: Traffic Generation Toolkit ($100 value)',
            '🎁 BONUS: Email Marketing Swipe Files ($97 value)',
            '🔥 Lifetime access + future updates'
          ],
          cta: 'GET INSTANT ACCESS',
          ctaUrl: '#purchase',
          featured: true,
          badge: 'BEST VALUE',
          savings: 'Save $400 + $450 in bonuses',
          urgency: 'Expires in 23h 47m'
        }
      ]
    },
    design: {
      theme: 'urgent',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      layout: 'pricing-comparison',
      animation: { type: 'zoomIn', duration: 800, delay: 200 },
      cardStyle: 'pricing-urgent',
      shadow: { enabled: true, blur: 20, color: 'rgba(0,0,0,0.1)' },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'testimonials',
    name: 'Student Success Stories',
    content: {
      title: '🌟 Student Success Stories - Real Results',
      subtitle: 'See what happens when you implement our proven system',
      testimonials: [
        {
          quote: 'I was skeptical about another course, but this delivered! Hit my first $10K month in 8 weeks using the exact traffic strategies. The ROI is insane!',
          author: 'Sarah Johnson',
          role: 'Online Coach',
          company: 'Sarah\'s Success Academy',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070&auto=format&fit=crop',
          results: '$10K in 8 weeks',
          verified: true
        },
        {
          quote: 'This course paid for itself in 2 weeks! The email sequences alone generated $15,400 in my first 60 days. Best investment I\'ve ever made.',
          author: 'David Chen',
          role: 'E-commerce Owner',
          company: 'Chen Digital Products',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop',
          results: '$15,400 in 60 days',
          verified: true
        }
      ]
    },
    design: {
      theme: 'urgent',
      backgroundColor: '#dc2626',
      backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #7c3aed 100%)',
      textColor: '#ffffff',
      layout: 'testimonials-results',
      animation: { type: 'slideInLeft', duration: 800, delay: 200 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'cta',
    name: 'Final Flash Sale CTA',
    content: {
      title: '🚨 Last Chance - Sale Ends at Midnight!',
      subtitle: 'Don\'t miss out on this exclusive 75% discount. This price will never be available again.',
      cta: 'SECURE YOUR SPOT NOW',
      ctaUrl: '#purchase',
      guarantee: '🛡️ 30-day money-back guarantee + lifetime access'
    },
    design: {
      theme: 'urgent',
      layout: 'cta-final',
      backgroundColor: '#dc2626',
      backgroundImage: 'linear-gradient(45deg, #dc2626, #ea580c)',
      textColor: '#ffffff',
      animation: { type: 'pulse', duration: 1500 },
      shadow: { enabled: true, blur: 40, color: 'rgba(220, 38, 38, 0.4)' },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'footer',
    name: 'Flash Sale Footer',
    content: {
      copyright: '© 2025 Digital Empire Academy. All rights reserved.',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' }
      ],
      socials: [
        { label: 'Facebook', href: '#' },
        { label: 'Instagram', href: '#' }
      ]
    },
    design: {
      theme: 'urgent',
      backgroundColor: '#1e293b',
      textColor: '#94a3b8',
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  }
];

/* ------------------------------------------------------------------ */
/*  ENHANCED TEMPLATE 3: COACHING PROGRAM - High-Ticket Service Sales */
/* ------------------------------------------------------------------ */

const eliteCoachingProgramFunnel: Component[] = [
  {
    id: getNextId(),
    type: 'header',
    name: 'Coaching Program Header',
    content: {
      title: coachingConfig.program.name,
      logo: {
        svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9 4.5V9.5L12 12L15 9.5V4.5L12 2Z" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12L9 14.5V19.5L12 22L15 19.5V14.5L12 12Z" stroke="#c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 4.5L5 2L9 4.5V9.5L5 12L2 9.5V4.5Z" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 4.5L19 2L22 4.5V9.5L19 12L15 9.5V4.5Z" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      },
      links: [
        { label: 'The Transformation', href: '#program' },
        { label: 'Your Coach', href: '#coach' },
        { label: 'Results', href: '#testimonials' }
      ],
      cta: 'Apply Now',
      ctaUrl: '#application'
    },
    design: {
      theme: 'premium-coaching',
      layout: 'header-premium',
      backgroundColor: 'rgba(30, 41, 59, 0.85)',
      textColor: '#f1f5f9',
      accentColor: '#c084fc',
      glassEffect: true,
      position: { type: 'sticky', top: 0, zIndex: 50 },
      border: { width: 1, color: 'rgba(71, 85, 105, 0.5)' },
      animation: { type: 'fadeInDown', duration: 800 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'hero',
    name: 'Coaching Program Hero',
    content: {
      title: 'This Is Your Invitation to Join the 1% Who Actually Achieve Their Dreams',
      subtitle: `The ${coachingConfig.program.name} is an exclusive, application-only ${coachingConfig.program.duration} transformation for high-achievers ready to shatter their limits. We are accepting only ${coachingConfig.program.cohortSize} dedicated individuals for this cohort.`,
      cta: {
        primary: 'Apply For Your Spot (Limited)',
        secondary: 'Watch Success Stories',
        note: 'Applications close when all spots are filled.'
      },
      image: coachingConfig.coach.image,
      imageAlt: `${coachingConfig.coach.name} - ${coachingConfig.coach.title}`,
      urgency: `⏰ Next Cohort Starts ${coachingConfig.program.nextStartDate} | Only ${coachingConfig.program.spotsRemaining} Spots Remain`,
      socialProof: `✅ Over ${coachingConfig.coach.achievements[0].stat} lives transformed through this exact framework.`
    },
    design: {
      theme: 'premium-coaching',
      layout: 'hero-coaching',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      accentColor: '#7c3aed',
      animation: { type: 'fadeIn', duration: 1000, delay: 200 },
      shadow: { enabled: true, color: 'rgba(124, 58, 237, 0.1)', blur: 50 },
      padding: { top: 100, bottom: 100 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'problem_agitation',
    name: 'Problem Agitation Section',
    content: {
      title: 'Does This Sound Familiar?',
      subtitle: 'You\'re successful on paper, but you know you\'re capable of so much more.',
      features: [
        { title: 'Hitting an Income Ceiling', description: 'You work harder, but your income stays the same. You feel stuck in a loop.' },
        { title: 'Lack of Clarity', description: 'You have big goals, but the exact path to get there feels foggy and uncertain.' },
        { title: 'Playing Small', description: 'You see others making bigger moves and wonder what secret they know that you don\'t.' },
        { title: 'Wasted Potential', description: 'The deepest fear is not failure, but looking back in 10 years with regret for not going all-in.' }
      ]
    },
    design: {
      theme: 'coaching',
      layout: 'problem-grid',
      backgroundColor: '#f1f5f9',
      textColor: '#1e293b',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'about_coach',
    name: 'Coach Authority Section',
    content: {
      title: 'Your Guide on This Transformation is Not a Theorist. She\'s a Practitioner.',
      coach: {
        name: coachingConfig.coach.name,
        title: coachingConfig.coach.title,
        image: coachingConfig.coach.image,
        bio: `${coachingConfig.coach.name} has dedicated her life to helping ambitious individuals break through their limitations and achieve extraordinary results. With a unique blend of psychology, business strategy, and mindset mastery, she has guided thousands to their breakthrough moments. She built her own 8-figure business using the same principles she teaches in this program.`,
        credentials: coachingConfig.coach.credentials,
        achievements: coachingConfig.coach.achievements,
        quote: 'Your current reality is a reflection of your past thoughts. To change your reality, you must first upgrade your mind.'
      }
    },
    design: {
      theme: 'premium-coaching',
      layout: 'coach-authority-premium',
      backgroundColor: '#111827',
      textColor: '#e2e8f0',
      accentColor: '#c084fc',
      animation: { type: 'fadeInUp', duration: 800 },
      padding: { top: 100, bottom: 100 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'program_curriculum',
    name: 'Program Curriculum',
    content: {
      title: `The ${coachingConfig.program.duration} Transformation Blueprint`,
      subtitle: 'This isn\'t just information. It\'s a proven system for total identity-level change.',
      features: [
        { module: 'Phase 1: The Foundation (Weeks 1-4)', title: 'Mindset & Identity Engineering', description: 'Systematically dismantle the limiting beliefs, fears, and subconscious patterns that have held you back for years. Install the identity of the person who achieves your goals effortlessly.', icon: 'brain-circuit' },
        { module: 'Phase 2: The Machine (Weeks 5-8)', title: 'High-Performance Systems', description: 'Implement the daily routines, strategic planning frameworks, and energy management protocols used by world-class CEOs and athletes to operate at peak capacity.', icon: 'rocket-launch' },
        { module: 'Phase 3: The Amplifier (Weeks 9-12)', title: 'Wealth & Impact Multiplication', description: 'Learn the advanced strategies for leveraging your time, scaling your income, and building a network that opens doors to opportunities you can\'t yet imagine.', icon: 'currency-dollar' }
      ]
    },
    design: {
      theme: 'coaching',
      layout: 'curriculum-comprehensive',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      animation: { type: 'staggerChildren', duration: 500 },
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'success_stories',
    name: 'Success Stories',
    content: {
      title: 'These Were Real People. Now They Are Real Results.',
      subtitle: 'This program creates transformations. Here is the proof.',
      testimonials: [
        { quote: 'Sarah\'s program didn\'t just change my business—it rewired my entire operating system. I went from a stressed-out entrepreneur to a calm, focused 7-figure CEO in 18 months.', author: 'Michael Rodriguez', role: 'Founder, TechAvant', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', results: 'Achieved 7-Figure Revenue', verified: true, beforeAfter: { before: 'Stuck at $50K/year', after: 'Exited at $7M' } },
        { quote: 'I thought I needed better marketing. Sarah showed me I needed a better mindset. The financial results were a side effect of becoming a different person. This was worth 100x the investment.', author: 'Jennifer Chen', role: 'E-commerce CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face', results: '5x Income, 10x Freedom', verified: true, beforeAfter: { before: 'Working 80 hrs/week', after: 'Working 20 hrs/week' } }
      ]
    },
    design: {
      theme: 'premium-coaching',
      layout: 'success-stories-immersive',
      backgroundColor: '#1e293b',
      textColor: '#ffffff',
      accentColor: '#c084fc',
      padding: { top: 100, bottom: 100 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'investment_breakdown',
    name: 'Investment Details',
    content: {
      title: 'Your Investment in a New Future',
      subtitle: 'This is not a cost. It\'s an investment in the highest-return asset you have: yourself.',
      plans: [
        {
          name: coachingConfig.program.name,
          price: '$2,997',
          priceRange: 'Or 3 payments of $1,200',
          description: `The complete ${coachingConfig.program.duration} transformation program.`,
          deliverables: [
            '12 Weeks of Live Group Coaching with Sarah',
            'Private Mastermind Community Access (Priceless)',
            'Personal 1-on-1 Success Coach',
            'Lifetime Access to All Program Materials & Recordings',
            'The High-Performance Habit Toolkit'
          ],
          cta: 'Apply To Join The Elite',
          ctaUrl: '#application',
          featured: true,
          badge: 'Application Only',
          urgency: `Only ${coachingConfig.program.spotsRemaining} spots remain in this cohort`,
          roi: 'Most clients see a 10x ROI within 12 months.',
          features: []
        }
      ]
    },
    design: {
      theme: 'luxury',
      layout: 'pricing-comparison',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#7c3aed',
      animation: { type: 'zoomIn', duration: 800, delay: 200 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'guarantee',
    name: 'The Transformation Guarantee',
    content: {
      title: 'Our "You Can\'t Lose" Guarantee',
      guarantees: [
        { icon: 'check-badge', title: 'The Results Guarantee', description: 'Fully implement the system and attend the calls. If you don\'t at least 2x your investment within 6 months, we\'ll coach you for free until you do.' },
        { icon: 'arrow-uturn-left', title: 'The Action-Taker\'s Refund', description: 'If after the first 14 days you\'ve done the work and feel it\'s not for you, show us your work and we\'ll give you a full refund. No questions asked.' }
      ]
    },
    design: {
      theme: 'premium-coaching',
      layout: 'guarantee-coaching',
      backgroundColor: '#f1f5f9',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'application_process',
    name: 'Application Process',
    content: {
      title: 'Ready to Claim Your New Reality?',
      subtitle: 'This is your final step. We only accept applicants who are truly committed to transformation.',
      description: 'Due to the intensive, high-touch nature of this program, admission is by application only. This ensures every member of the cohort is a high-caliber individual ready to elevate themselves and the group.',
      fields: [
        { type: 'text', label: 'Full Name', required: true, placeholder: 'Your Name' },
        { type: 'email', label: 'Email Address', required: true, placeholder: 'you@example.com' },
        { type: 'textarea', label: 'What is your single biggest professional goal for the next 12 months?', required: true },
        { type: 'textarea', label: 'Why is now the right time for you to make this transformation?', required: true }
      ],
      cta: 'Submit My Application',
      guaranteeText: 'We respect your privacy. Your application will be reviewed personally by our team within 48 hours.'
    },
    design: {
      theme: 'luxury',
      layout: 'application-premium',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      accentColor: '#7c3aed',
      animation: { type: 'fadeInUp', duration: 800 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'footer',
    name: 'Coaching Footer',
    content: {
      copyright: `© 2025 ${coachingConfig.program.name}. A ${coachingConfig.coach.name} Program. All rights reserved.`,
      description: 'This is not just another course. This is your new beginning.',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' }
      ],
      socials: {
        linkedin: '#',
        instagram: '#'
      }
    },
    design: {
      theme: 'dark',
      backgroundColor: '#111827',
      textColor: '#94a3b8',
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  }
];

/* ------------------------------------------------------------------ */
/*  ENHANCED TEMPLATE 4: EVERGREEN WEBINAR - Education-Based Selling */
/* ------------------------------------------------------------------ */

const evergreenWebinarFunnel: Component[] = [
  {
    id: getNextId(),
    type: 'header',
    name: 'Webinar Header',
    content: {
      title: 'Profit Breakthrough Masterclass',
      logo: {
        svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20V10M18 20V4M6 20V16" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      },
      cta: 'Register Free',
      ctaUrl: '#register'
    },
    design: {
      theme: 'professional',
      layout: 'header-professional',
      backgroundColor: 'rgba(30, 64, 175, 0.9)',
      textColor: '#ffffff',
      accentColor: '#facc15',
      glassEffect: true,
      position: { type: 'sticky', top: 0, zIndex: 50 },
      border: { width: 1, color: 'rgba(29, 78, 216, 0.5)' },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'hero',
    name: 'Webinar Registration Hero',
    content: {
      title: 'FREE TRAINING: The 3 Profit Leaks Quietly Costing Your Business $10k+ Every Month',
      subtitle: 'In the next 60 minutes, I\'ll reveal the exact, counter-intuitive strategies 7-figure businesses use to plug these leaks and double their revenue—without spending a dollar more on ads.',
      cta: 'Yes, Reserve My FREE Seat!',
      ctaUrl: '#register',
      guaranteeText: '100% Free Training | No credit card required, ever.',
      socialProof: 'Join 50,000+ Entrepreneurs Who Have Transformed Their Bottom Line'
    },
    design: {
      theme: 'urgent',
      layout: 'hero-urgency',
      backgroundColor: '#f0f9ff',
      textColor: '#1e3a8a',
      accentColor: '#f59e0b',
      padding: { top: 80, bottom: 40 },
      animation: { type: 'fadeIn', duration: 1000 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'countdown',
    name: 'Urgency Countdown',
    content: {
      title: 'Next LIVE Training Starts In:',
      endDate: '2024-09-15T18:00:00Z', // Example: Set to a dynamic future date
      scarcityMessage: 'Limited to 200 attendees to allow for Q&A. Spots are filling fast!'
    },
    design: {
      theme: 'urgent',
      layout: 'countdown-premium',
      backgroundColor: '#f0f9ff',
      textColor: '#1e3a8a',
      accentColor: '#d97706',
      padding: { top: 0, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'brands',
    name: 'Social Proof - As Seen In',
    content: {
      title: 'The strategies you\'ll learn have been featured in:',
      brands: [
        { name: 'Forbes', logo: '/images/logo-forbes-light.svg' },
        { name: 'Inc.', logo: '/images/logo-inc-light.svg' },
        { name: 'Entrepreneur', logo: '/images/logo-entrepreneur-light.svg' },
        { name: 'Business Insider', logo: '/images/logo-businessinsider-light.svg' }
      ]
    },
    design: {
      theme: 'professional',
      backgroundColor: '#f8fafc',
      padding: { top: 60, bottom: 60 },
      border: { width: 1, color: '#e2e8f0' },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'problem_agitation',
    name: 'Webinar Problem Agitation',
    content: {
      title: 'Are You Making These Costly Mistakes?',
      subtitle: 'Most business owners are working harder, not smarter, and leaving massive profits on the table.',
      features: [
        { icon: 'magnifying-glass-circle', title: 'Guessing at Your Prices', description: 'Leaving money on the table with every single sale because you lack a clear pricing strategy.' },
        { icon: 'funnel', title: 'Leaky Conversion Funnel', description: 'Paying for ads and traffic that never convert because of simple, fixable mistakes on your website.' },
        { icon: 'arrow-trending-down', title: 'Ignoring Existing Customers', description: 'Constantly chasing new leads while ignoring the goldmine of repeat business right under your nose.' }
      ]
    },
    design: {
      theme: 'professional',
      layout: 'problem-grid',
      backgroundColor: '#ffffff',
      textColor: '#1e3a8a',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'features',
    name: 'What You\'ll Learn',
    content: {
      title: 'Here’s a Preview of What You’ll Discover:',
      subtitle: 'This isn\'t theory. This is a playbook of actionable strategies.',
      features: [
        { icon: 'currency-dollar', title: 'The "Profit Maximizer" Pricing Model', description: 'The simple psychological switch that allows you to increase prices by 30-50% and have customers thank you for it.', benefit: 'Instantly boost revenue per sale.' },
        { icon: 'arrows-pointing-in', title: 'The "One-Page" Conversion Fix', description: 'A single, overlooked page on your website that can be optimized in under an hour to triple your lead conversion rate.', benefit: 'Get more leads from existing traffic.' },
        { icon: 'arrow-path-rounded-square', title: 'The "7-Day" Follow-Up Sequence', description: 'The automated email sequence that reactivates past customers and generates a flood of repeat purchases.', benefit: 'Create predictable, recurring revenue.' }
      ]
    },
    design: {
      theme: 'professional',
      layout: 'features-detailed',
      backgroundColor: '#f8fafc',
      animation: { type: 'staggerChildren', duration: 500 },
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'coach_authority',
    name: 'Instructor Bio',
    content: {
      title: 'Meet Your Instructor',
      coach: {
        name: 'David Sterling',
        title: 'Business Growth Strategist & 3x Founder',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
        bio: 'After building and selling two 7-figure businesses, David discovered that a few key profit levers were responsible for 80% of his success. He has since dedicated his career to teaching these powerful, often-overlooked strategies to fellow entrepreneurs.',
        achievements: [
          { stat: '$25M+', label: 'In revenue generated for clients' },
          { stat: '50,000+', label: 'Entrepreneurs trained' },
          { stat: '3x', label: 'Successful business exits' }
        ]
      }
    },
    design: {
      theme: 'executive',
      layout: 'coach-authority-premium',
      backgroundColor: '#ffffff',
      textColor: '#1e3a8a',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'testimonials',
    name: 'Webinar Testimonials',
    content: {
      title: 'Don\'t Just Take Our Word For It...',
      testimonials: [
        { quote: 'I implemented the pricing strategy from the webinar and landed a $15,000 client the next week. That one tip was worth more than a full year of business school.', author: 'Maria Garcia', role: 'Marketing Consultant', metric: '+$15,000', results: 'In New Client Revenue' },
        { quote: 'My conversion rate was stuck at 1%. After David\'s training, I made one change to my opt-in page and it jumped to 5%. This webinar is pure gold.', author: 'Sam Chen', role: 'E-commerce Store Owner', metric: '+400%', results: 'Increase in Lead Conversion' }
      ]
    },
    design: {
      theme: 'professional',
      layout: 'testimonials-carousel',
      backgroundColor: '#dbeafe',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'contact',
    name: 'Webinar Registration Form',
    content: {
      title: 'Secure Your FREE Seat Now & Unlock Your Profit Breakthrough',
      subtitle: 'Spots are limited to ensure a quality experience. Claim yours before they\'re gone!',
      fields: [
        { type: 'text', label: 'First Name', placeholder: 'Enter your first name', required: true },
        { type: 'email', label: 'Best Email Address', placeholder: 'Enter your email to get access link', required: true }
      ],
      cta: 'Register for the FREE Training!',
      guaranteeText: 'We hate spam and will never share your email. 100% secure.'
    },
    design: {
      theme: 'urgent',
      layout: 'form-centered',
      backgroundColor: '#ffffff',
      accentColor: '#f59e0b',
      border: { width: 2, color: '#facc15', radius: 12 },
      shadow: { enabled: true, blur: 40, color: 'rgba(245, 158, 11, 0.2)' },
      padding: { top: 60, bottom: 60 },
      animation: { type: 'pulse' },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'faq',
    name: 'Webinar FAQ',
    content: {
      title: 'Your Questions Answered',
      faqs: [
        { question: 'Is this really free?', answer: 'Yes, 100% free. My goal is to provide immense value. At the end, I will make a special offer for those who want to work more closely with me, but the training itself is packed with actionable strategies you can use immediately.' },
        { question: 'Will there be a replay?', answer: 'Yes, but only for a limited time and only for those who register. I highly recommend attending live to get the full experience and participate in the Q&A.' },
        { question: 'How long is the training?', answer: 'The masterclass is approximately 60 minutes, followed by a live Q&A session where I will answer your specific questions.' }
      ]
    },
    design: {
      theme: 'professional',
      layout: 'faq-detailed',
      backgroundColor: '#f8fafc',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'footer',
    name: 'Webinar Footer',
    content: {
      copyright: '© 2025 Sterling Growth Strategies. All rights reserved.',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms', href: '/terms' }
      ]
    },
    design: {
      theme: 'dark',
      backgroundColor: '#111827',
      textColor: '#9ca3af',
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  }
];

/* ------------------------------------------------------------------ */
/*  ENHANCED TEMPLATE 5: PRODUCT LAUNCH - Anticipation Builder */
/* ------------------------------------------------------------------ */

const productLaunchSequenceFunnel: Component[] = [
  {
    id: getNextId(),
    type: 'header',
    name: 'Launch Header',
    content: {
      title: 'Project Singularity',
      logo: {
        svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#a855f7" stroke-width="2"/><path d="M12 2V22" stroke="#a855f7" stroke-width="2" stroke-dasharray="2 4"/><path d="M2 12H22" stroke="#a855f7" stroke-width="2" stroke-dasharray="2 4"/></svg>'
      },
      cta: 'Join The Waitlist',
      ctaUrl: '#waitlist'
    },
    design: {
      theme: 'tech',
      layout: 'header-premium',
      backgroundColor: 'rgba(17, 24, 39, 0.85)',
      textColor: '#f1f5f9',
      accentColor: '#a855f7',
      glassEffect: true,
      position: { type: 'sticky', top: 0, zIndex: 50 },
      border: { width: 1, color: 'rgba(55, 65, 81, 0.5)' },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'hero',
    name: 'Launch Announcement',
    content: {
      title: 'The Way You Work Is About to Become Obsolete.',
      subtitle: 'For years, you\'ve been forced to juggle scattered apps, fragmented data, and inefficient workflows. On October 26th, we\'re launching a new paradigm. A single source of truth that will 10x your productivity.',
      cta: {
        primary: 'Join the VIP Waitlist & Get 50% Off',
        note: 'Founders\' pricing is strictly limited to the VIP list.'
      },
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop',
      imageAlt: 'Futuristic interface representing a new paradigm of work'
    },
    design: {
      theme: 'tech',
      layout: 'hero-split-premium',
      backgroundColor: '#111827',
      textColor: '#f8fafc',
      accentColor: '#a855f7',
      animation: { type: 'fadeIn', duration: 1000 },
      padding: { top: 100, bottom: 100 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'problem_agitation',
    name: 'Agitate The Problem',
    content: {
      title: 'Why Your Current Toolkit is Failing You',
      subtitle: 'You\'re working harder, not smarter. The tools you use are the cause.',
      features: [
        { icon: 'puzzle-piece', title: 'Scattered Information', description: 'Key data is spread across 5-10 different apps, making a single source of truth impossible.' },
        { icon: 'arrow-down-on-square-stack', title: 'Endless Context Switching', description: 'Constant app-switching kills your focus and drains your mental energy, costing you hours per day.' },
        { icon: 'exclamation-triangle', title: 'Manual, Repetitive Work', description: 'You\'re stuck doing low-value, repetitive tasks that should be automated, capping your potential.' }
      ]
    },
    design: {
      theme: 'professional',
      layout: 'problem-grid',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'features',
    name: 'Hint at the Solution',
    content: {
      title: 'Imagine a World Where Your Workflow is... Effortless.',
      subtitle: 'Project Singularity is being built to deliver on this promise.',
      features: [
        { icon: 'bolt', title: 'Instantly Unified', description: 'Connect all your tools in minutes to create a single, intelligent command center for your entire business.' },
        { icon: 'brain-circuit', title: 'Proactively Intelligent', description: 'Our AI doesn\'t just show you data; it surfaces the insights you need, before you even ask for them.' },
        { icon: 'play-circle', title: 'Seamlessly Automated', description: 'Automate complex, multi-app workflows with a simple, natural language interface. If you can say it, you can automate it.' }
      ]
    },
    design: {
      theme: 'tech',
      layout: 'features-saas',
      backgroundColor: '#111827',
      textColor: '#e2e8f0',
      accentColor: '#a855f7',
      animation: { type: 'staggerChildren', duration: 500 },
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'coach_authority',
    name: 'Meet the Visionary',
    content: {
      title: 'Meet The Visionary Behind Project Singularity',
      coach: {
        name: 'Dr. Alena Petrova',
        title: 'Founder & Lead Architect',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
        bio: 'A former lead engineer at Google AI, Alena grew frustrated with the fragmented nature of enterprise software. She left to build the platform she always wished she had: a truly unified, intelligent workspace. Project Singularity is the culmination of that vision.',
        achievements: [
          { stat: '12', label: 'Patents in AI & workflow automation' },
          { stat: '2x', label: 'Founder with a previous successful exit' }
        ]
      }
    },
    design: {
      theme: 'executive',
      layout: 'coach-authority-premium',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'countdown',
    name: 'Launch Countdown',
    content: {
      title: 'The Revolution Begins In:',
      endDate: '2025-10-26T12:00:00Z',
      scarcityMessage: 'Join the waitlist to lock in your founder\'s discount.'
    },
    design: {
      theme: 'urgent',
      layout: 'countdown-premium',
      backgroundColor: '#1e293b',
      textColor: '#ffffff',
      accentColor: '#a855f7',
      animation: { type: 'pulse', duration: 2000 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'cta',
    name: 'VIP Waitlist Signup',
    content: {
      title: 'Join the VIP List. Lock In Your Founder\'s Discount.',
      subtitle: 'Be the first to get access and receive an exclusive 50% discount at launch. This offer will not be available to the public.',
      guaranteeText: 'You\'ll get: ✅ Early Access | ✅ 50% Off For Life | ✅ Exclusive Updates',
      fields: [
        { type: 'email', label: 'Email Address', placeholder: 'Enter your best email', required: true }
      ],
      cta: 'Secure My Spot & Discount'
    },
    design: {
      theme: 'modern',
      layout: 'cta-final',
      backgroundColor: '#ffffff',
      accentColor: '#a855f7',
      border: { width: 2, color: '#a855f7', radius: 12 },
      shadow: { enabled: true, blur: 50, color: 'rgba(168, 85, 247, 0.2)' },
      padding: { top: 60, bottom: 60 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'faq',
    name: 'Launch FAQ',
    content: {
      title: 'Your Questions, Answered',
      faqs: [
        { question: 'What exactly is Project Singularity?', answer: 'It is a new type of intelligent workspace that unifies all your apps, documents, and workflows into a single, AI-powered command center.' },
        { question: 'Who is this for?', answer: 'It\'s for founders, executives, and power users who are tired of software fragmentation and want to reclaim their time and focus.' },
        { question: 'What is the benefit of joining the VIP list?', answer: 'VIP list members get first access to the platform before the public launch, and a permanent 50% "Founder\'s Discount" on any plan they choose. This discount will never be offered again.' }
      ]
    },
    design: {
      theme: 'professional',
      layout: 'faq-detailed',
      backgroundColor: '#f8fafc',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'footer',
    name: 'Launch Footer',
    content: {
      copyright: '© 2025 Singularity Labs Inc. A new era of work is coming.',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Contact', href: 'mailto:hello@singularity.com' }
      ]
    },
    design: {
      theme: 'dark',
      backgroundColor: '#111827',
      textColor: '#9ca3af',
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  }
];

/*----
------------------------------------------------------------*/
/* ENHANCED TEMPLATE 6: FREE SHIPPING - Free Shipping */
/* ----------------------------------------------------------------*/
const freeShippingOfferFunnel: Component[] = [
  {
    id: getNextId(),
    type: 'header',
    name: 'Free Shipping Funnel Header',
    content: {
      title: 'AuraGlow Serum',
      logo: {
        svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="#fde047" stroke-width="2"/><path d="M12 5a3 3 0 013 3" stroke="#fde047" stroke-width="2" stroke-linecap="round"/></svg>'
      },
      cta: 'Claim My Bottle',
      ctaUrl: '#offer'
    },
    design: {
      theme: 'wellness',
      layout: 'header-professional',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      textColor: '#44403c',
      accentColor: '#ca8a04',
      glassEffect: true,
      position: { type: 'sticky', top: 0, zIndex: 50 },
      border: { width: 1, color: 'rgba(245, 245, 244, 0.8)' },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'hero',
    name: 'Product Hero',
    content: {
      title: 'Finally Get The "Glass Skin" Glow You’ve Dreamed Of (And Yes, We’ll Cover The Shipping)',
      subtitle: 'Our #1 best-selling AuraGlow Serum, packed with our proprietary Bio-Retinoid Complex™, is finally back in stock. For a limited time, get it delivered to your door with FREE shipping.',
      cta: {
        primary: 'Claim My Serum + Free Shipping',
        note: 'Limited quantities available for this batch.'
      },
      image: 'https://images.unsplash.com/photo-1620916566398-39f168a7673b?q=80&w=400&auto=format&fit=crop',
      imageAlt: 'A beautiful bottle of AuraGlow Bio-Active Serum'
    },
    design: {
      theme: 'luxury',
      layout: 'hero-product',
      backgroundColor: '#fefce8',
      textColor: '#44403c',
      accentColor: '#ca8a04',
      animation: { type: 'fadeIn', duration: 1000 },
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'brands',
    name: 'As Featured In',
    content: {
      title: 'As Featured In:',
      brands: [
        { name: 'Vogue', logo: '/images/logo-vogue-light.svg' },
        { name: 'Allure', logo: '/images/logo-allure-light.svg' },
        { name: 'Harper\'s Bazaar', logo: '/images/logo-bazaar-light.svg' },
        { name: 'Women\'s Health', logo: '/images/logo-womenshealth-light.svg' }
      ]
    },
    design: {
      theme: 'light',
      backgroundColor: '#fefce8',
      padding: { top: 0, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'problem_agitation',
    name: 'The Problem',
    content: {
      title: 'Tired of a Skincare Graveyard Under Your Sink?',
      subtitle: 'You’ve tried everything, but dullness, uneven tone, and fine lines persist.',
      features: [
        { icon: 'face-frown', title: 'Dull, Lifeless Skin', description: 'Your skin lacks that vibrant, youthful glow, no matter how much you moisturize.' },
        { icon: 'swatch', title: 'Uneven Skin Tone', description: 'Stubborn dark spots and redness make you feel like you have to wear foundation.' },
        { icon: 'magnifying-glass', title: 'Visible Fine Lines', description: 'You’re noticing more fine lines around your eyes and mouth that betray your age.' }
      ]
    },
    design: {
      theme: 'wellness',
      layout: 'problem-grid',
      backgroundColor: '#ffffff',
      textColor: '#44403c',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'features',
    name: 'The Solution (Product Features)',
    content: {
      title: 'AuraGlow: The All-in-One Solution Backed By Science',
      subtitle: 'We combined three potent, clinically-proven ingredients into one super-serum.',
      features: [
        { icon: 'atom', title: 'Hyalu-Cellular Complex™', description: 'A breakthrough form of Hyaluronic Acid that holds 1000x its weight in water, delivering deep, multi-layer hydration for a visible plumping effect.', scientificBacking: 'Clinically shown to increase skin hydration by 150% in 7 days.' },
        { icon: 'leaf', title: 'Bio-Retinoid Peptides', description: 'A plant-based retinol alternative that provides all the line-smoothing benefits of retinol without the irritation, redness, or peeling.', scientificBacking: 'Reduces the appearance of fine lines by 45% in 8 weeks.' },
        { icon: 'sparkles', title: 'Stabilized Vitamin C-Ester', description: 'A powerful, oil-soluble form of Vitamin C that visibly brightens the skin, fades dark spots, and provides potent antioxidant protection.', scientificBacking: '9 out of 10 users reported a more even, radiant skin tone.' }
      ]
    },
    design: {
      theme: 'professional',
      layout: 'features-scientific',
      backgroundColor: '#fefce8',
      animation: { type: 'staggerChildren', duration: 500 },
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'before_after',
    name: 'Visual Proof',
    content: {
      title: 'Seeing Is Believing. Real Customers, Real Results.',
      subtitle: 'These are unretouched photos from AuraGlow users after 60 days.',
      testimonials: [
        {
          beforeAfter: { before: '/images/before-1.jpg', after: '/images/after-1.jpg' },
          author: 'Jessica M.',
          quote: 'I haven\'t felt confident enough to go without foundation in years. Now, I barely wear it. My skin has never looked this good.'
        },
        {
          beforeAfter: { before: '/images/before-2.jpg', after: '/images/after-2.jpg' },
          author: 'Sarah L.',
          quote: 'The fine lines around my eyes have dramatically softened. This is the first product that has ever delivered on its promises.'
        }
      ]
    },
    design: {
      theme: 'wellness',
      layout: 'before-after-split',
      backgroundColor: '#ffffff',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'products',
    name: 'The Offer',
    content: {
      title: 'Claim Your AuraGlow Serum Today',
      subtitle: 'Includes Our 60-Day "Love Your Glow" Guarantee & FREE Shipping',
      products: [
        {
          id: 'auraglow-serum',
          name: 'AuraGlow Bio-Active Serum',
          price: 49,
          image: 'https://images.unsplash.com/photo-1620916566398-39f168a7673b?q=80&w=400&auto=format&fit=crop',
          description: 'One 30ml bottle (60-day supply) of our best-selling serum.'
        }
      ],
      features: [
        'Dramatically Boosts Hydration',
        'Reduces Appearance of Fine Lines',
        'Visibly Brightens & Evens Tone',
        '✅ FREE U.S. Shipping Included',
        '🎁 BONUS: The Ultimate Skincare Guide (PDF)'
      ],
      cta: 'Yes, Send My Serum! (with FREE Shipping)'
    },
    design: {
      theme: 'luxury',
      layout: 'product-pricing',
      backgroundColor: '#fefce8',
      accentColor: '#ca8a04',
      border: { width: 2, color: '#fde047', radius: 12 },
      shadow: { enabled: true, blur: 40, color: 'rgba(202, 138, 4, 0.2)' },
      padding: { top: 60, bottom: 60 },
      animation: { type: 'pulseGlow' },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'guarantee',
    name: 'The Guarantee',
    content: {
      title: 'Our 60-Day "Love Your Glow" Guarantee',
      guaranteeText: 'Try AuraGlow for a full 60 days. If you don\'t see a noticeable improvement in your skin\'s hydration, radiance, and texture—or if you\'re not absolutely thrilled for any reason—simply send us an email. We\'ll refund your full purchase price, no questions asked. You can even keep the bottle. That\'s how confident we are that you\'ll love your results.',
      image: '/images/seal-of-guarantee.png'
    },
    design: {
      theme: 'professional',
      layout: 'guarantee-comprehensive',
      backgroundColor: '#ffffff',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'faq',
    name: 'Frequently Asked Questions',
    content: {
      title: 'Your Questions, Answered',
      faqs: [
        { question: 'Is AuraGlow safe for sensitive skin?', answer: 'Yes! Our formula was designed to be gentle yet effective. The Bio-Retinoid Complex provides the benefits of retinol without the common irritation. We always recommend a patch test first, just to be safe.' },
        { question: 'How long until I see results?', answer: 'Many users report a noticeable increase in hydration and a "dewy" glow within the first 7-10 days. More significant results, like the reduction of fine lines and dark spots, are typically seen after 6-8 weeks of consistent use.' },
        { question: 'What is your shipping & return policy?', answer: 'We offer free standard shipping on all U.S. orders. If you\'re not 100% satisfied within 60 days, just email our support team for a full, hassle-free refund.' }
      ]
    },
    design: {
      theme: 'light',
      layout: 'faq-accordion',
      backgroundColor: '#fefce8',
      padding: { top: 80, bottom: 80 },
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'footer',
    name: 'Funnel Footer',
    content: {
      copyright: '© 2025 AuraBeauty Inc. All Rights Reserved.',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Contact Us', href: '/contact' }
      ]
    },
    design: {
      theme: 'dark',
      backgroundColor: '#1c1917',
      textColor: '#a8a29e',
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  }
];
/* -----
------------------------------------------------------------- */
/*  ENHANCED TEMPLATE 7: SAAS DEMO - Software Product Showcase */
/* ------------------------------------------------------------------ */

const saasDemoFunnel: Component[] = [
  {
    id: getNextId(),
    type: 'header',
    name: 'SaaS Header',
    content: {
      title: 'PROFITMAX AI',
      subtitle: 'AI-Powered Business Intelligence Platform',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Demo', href: '#demo' },
        { label: 'Start Free Trial', href: '#trial' }
      ]
    },
    design: {
      theme: 'tech',
      backgroundColor: '#1e293b',
      textColor: '#ffffff',
      layout: 'sticky-header',
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'hero',
    name: 'SaaS Hero',
    content: {
      title: 'Increase Your Revenue by 40% with AI-Powered Insights',
      subtitle: 'ProfitMax AI analyzes your business data in real-time and provides actionable recommendations to boost your bottom line. Join 10,000+ businesses already using our platform.',
      cta: 'Start Free 14-Day Trial',
      ctaUrl: '#trial',
      secondaryCta: 'Watch Demo',
      secondaryCtaUrl: '#demo',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop',
      socialProof: '✅ Trusted by 10,000+ businesses worldwide'
    },
    design: {
      theme: 'tech',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      layout: 'hero-split',
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'features',
    name: 'Platform Features',
    content: {
      title: 'Powerful Features That Drive Results',
      features: [
        {
          title: '🤖 AI-Powered Analytics',
          description: 'Advanced machine learning algorithms analyze your data and identify profit opportunities'
        },
        {
          title: '📊 Real-Time Dashboards',
          description: 'Beautiful, customizable dashboards that give you insights at a glance'
        },
        {
          title: '🔗 Easy Integrations',
          description: 'Connect with 100+ popular business tools in just a few clicks'
        },
        {
          title: '📱 Mobile App',
          description: 'Access your data and insights anywhere with our native mobile apps'
        }
      ]
    },
    design: {
      theme: 'tech',
      backgroundColor: '#ffffff',
      layout: 'grid-2x2',
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'pricing',
    name: 'SaaS Pricing',
    content: {
      title: 'Simple, Transparent Pricing',
      plans: [
        {
          name: 'Starter',
          price: '$29',
          frequency: 'per month',
          features: [
            'Up to 1,000 data points',
            'Basic analytics',
            'Email support',
            '5 integrations'
          ],
          cta: 'Start Free Trial'
        },
        {
          name: 'Professional',
          price: '$99',
          frequency: 'per month',
          features: [
            'Up to 10,000 data points',
            'Advanced AI analytics',
            'Priority support',
            'Unlimited integrations',
            'Custom dashboards'
          ],
          cta: 'Start Free Trial',
          featured: true
        },
        {
          name: 'Enterprise',
          price: '$299',
          frequency: 'per month',
          features: [
            'Unlimited data points',
            'White-label solution',
            'Dedicated account manager',
            'Custom integrations',
            'Advanced security'
          ],
          cta: 'Contact Sales'
        }
      ]
    },
    design: {
      theme: 'tech',
      backgroundColor: '#f8fafc',
      layout: 'pricing-comparison',
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  },
  {
    id: getNextId(),
    type: 'contact',
    name: 'Free Trial Signup',
    content: {
      title: 'Start Your Free 14-Day Trial',
      subtitle: 'No credit card required',
      fields: [
        { type: 'text', label: 'Full Name', required: true },
        { type: 'email', label: 'Work Email', required: true },
        { type: 'text', label: 'Company Name', required: true }
      ],
      cta: 'Start Free Trial'
    },
    design: {
      theme: 'tech',
      backgroundColor: '#1e293b',
      textColor: '#ffffff',
      layout: 'form-centered',
      typography: undefined,
      colors: undefined,
      shadows: undefined,
      borders: undefined,
      interactions: undefined
    },
    metadata: undefined
  }
];

/* ------------------------------------------------------------------ */
/*  TEMPLATE EXPORTS AND CONFIGURATION */
/* ------------------------------------------------------------------ */

export const funnelTemplates: FunnelTemplate[] = [
  {
    id: 'ai-quiz-lead-magnet',
    title: 'AI-Powered Quiz Lead Magnet',
    description: 'Interactive assessment that generates personalized reports to capture high-quality leads',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=400&auto=format&fit=crop',
    hint: 'Perfect for consultants, coaches, and service providers who want to demonstrate expertise while capturing leads',
    stats: { ctr: 8.7, optInRate: 47.3, healthScore: 94 },
    aiInsight: 'Quiz funnels have 3x higher engagement than static lead magnets. The personalization creates immediate value.',
    components: modernQuizLeadMagnetFunnel,
    purpose: 'Lead Generation & Qualification',
    targetAudience: 'Business owners seeking growth insights',
    conversionStrategy: 'Value-first approach with personalized AI analysis'
  },
  {
    id: 'flash-sale-scarcity',
    title: 'Flash Sale Scarcity Funnel',
    description: 'High-converting urgency-driven sales funnel with countdown timers and limited availability',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop',
    hint: 'Ideal for digital products, courses, and limited-time offers that need immediate action',
    stats: { ctr: 12.4, optInRate: 23.8, healthScore: 89 },
    aiInsight: 'Scarcity and urgency can increase conversions by 300% when used authentically with real deadlines.',
    components: premiumScarcityFlashSaleFunnel,
    purpose: 'Direct Sales & Revenue Generation',
    targetAudience: 'Buyers ready to purchase with urgency motivation',
    conversionStrategy: 'Scarcity-driven urgency with social proof and guarantees'
  },
  {
    id: 'elite-coaching-program',
    title: 'Elite Coaching Program Funnel',
    description: 'High-ticket coaching and consulting program with application process and exclusivity',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400&auto=format&fit=crop',
    hint: 'Perfect for premium coaching programs, masterminds, and high-value consulting services',
    stats: { ctr: 6.2, optInRate: 34.7, healthScore: 96 },
    aiInsight: 'Exclusivity and social proof are key for high-ticket offers. Application process pre-qualifies serious buyers.',
    components: eliteCoachingProgramFunnel,
    purpose: 'High-Ticket Sales & Client Acquisition',
    targetAudience: 'Ambitious entrepreneurs and high-achievers',
    conversionStrategy: 'Exclusivity-based positioning with results-focused messaging'
  },
  {
    id: 'webinar-evergreen',
    title: 'Evergreen Webinar Funnel',
    description: 'Automated webinar sequence that sells on autopilot with just-in-time registration',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&auto=format&fit=crop',
    hint: 'Great for educational content that builds trust before presenting an offer',
    stats: { ctr: 9.1, optInRate: 41.2, healthScore: 91 },
    aiInsight: 'Webinars that teach first, sell second have 40% higher conversion rates than pitch-heavy presentations.',
    components: evergreenWebinarFunnel,
    purpose: 'Education-Based Selling',
    targetAudience: 'Learning-oriented prospects who prefer education before purchase',
    conversionStrategy: 'Value-first education leading to natural product introduction'
  },
  {
    id: 'product-launch-sequence',
    title: 'Product Launch Sequence',
    description: 'Multi-day launch campaign with anticipation building and social proof',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop',
    hint: 'Perfect for new product launches that need maximum impact and buzz',
    stats: { ctr: 11.3, optInRate: 38.9, healthScore: 87 },
    aiInsight: 'Launch sequences that build anticipation over 5-7 days generate 250% more sales than single-day launches.',
    components: productLaunchSequenceFunnel,
    purpose: 'Product Launch & Buzz Generation',
    targetAudience: 'Early adopters and existing audience members',
    conversionStrategy: 'Anticipation building with exclusive early access'
  },
  {
    id: 'free-plus-shipping',
    title: 'Free + Shipping Offer',
    description: 'Low-barrier entry offer that covers shipping costs and builds customer list',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=400&auto=format&fit=crop',
    hint: 'Excellent for physical products and building a customer base for future offers',
    stats: { ctr: 15.7, optInRate: 28.4, healthScore: 83 },
    aiInsight: 'Free + shipping offers have 5x higher conversion than traditional lead magnets and create paying customers.',
    components: freeShippingOfferFunnel,
    purpose: 'Customer Acquisition & List Building',
    targetAudience: 'Cold traffic and new prospects',
    conversionStrategy: 'Low-risk, high-value offer with immediate gratification'
  },
  {
    id: 'saas-demo-funnel',
    title: 'SaaS Demo & Trial Funnel',
    description: 'Software product showcase with feature highlights and free trial signup',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop',
    hint: 'Perfect for SaaS products, software tools, and subscription-based services',
    stats: { ctr: 7.8, optInRate: 32.1, healthScore: 92 },
    aiInsight: 'SaaS funnels that focus on value demonstration before pricing see 45% higher trial-to-paid conversion.',
    components: saasDemoFunnel,
    purpose: 'SaaS Trial Conversion & Customer Acquisition',
    targetAudience: 'Business decision-makers evaluating software solutions',
    conversionStrategy: 'Feature-benefit demonstration with low-friction trial signup'
  }
];

export default funnelTemplates;

// Export for backward compatibility
export const enhancedFunnelTemplates = funnelTemplates;

// Helper function to get funnel components by ID
export function getFunnelComponentsById(templateId: string): Component[] | null {
  const template = funnelTemplates.find(t => t.id === templateId);
  return template ? template.components : null;
}

// Helper function to get template by ID
export function getTemplateById(templateId: string): FunnelTemplate | null {
  return funnelTemplates.find(t => t.id === templateId) || null;
}