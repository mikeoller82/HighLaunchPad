import type { Component } from './types';

export interface Template {
  metadata?: Record<string, any>;
  id: string;
  title: string;
  description: string;
  image: string;
  hint: string;
  aiInsight: string;

  stats: {
    visitors: string;
    leads: string;
    conversion: string;
  };
  components: Component[];
}

// Export the raw templates for reference or migration
export const websiteTemplatesRaw: Template[] = [
  // --- Dark SaaS Platform Template --- //
  {
    id: "saas-dark-pro",
    title: "SaaS Platform Dark (Professional)",
    description: "A sophisticated, dark-themed template for cutting-edge SaaS platforms, optimized for conversion and user engagement.",
    image: "https://firebasestorage.googleapis.com/v0/b/firebase-veilnet.firebasestorage.app/o/saasdarkcardimage.png?alt=media&token=9c82e841-57cb-4f7d-8a84-8e3a09a0b912",
    hint: "This professionally enhanced dark variant is designed to establish authority and trust for high-tech SaaS products.",
    aiInsight: "The use of micro-animations, specific layouts like 'hero-saas-demo', and enhanced trust signals in pricing creates a high-perception value, ideal for platforms targeting enterprise clients and developers.",
    stats: {
      visitors: "18k",
      leads: "2.1k",
      conversion: "18.5%"
    },
    components: [
      // --- HEADER ---
      {
        id: 1,
        name: "Main Navigation Header",
        type: "header",
        content: {
          title: "NeuralFlow AI",
          logo: {
            svg: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="#A78BFA"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="#F9FAFB"></path></svg>'
          },
          links: [
            { label: "Platform", href: "#features" },
            { label: "Solutions", href: "#solutions" },
            { label: "Pricing", href: "#pricing" },
            { label: "Resources", href: "#resources" }
          ],
          cta: "Book Demo",
          ctaUrl: "#demo",
          secondaryCta: "Start Free Trial",
          secondaryCtaUrl: "#cta"
        },
        design: {
          theme: "tech",
          layout: "header-saas",
          backgroundColor: "rgba(17, 24, 39, 0.8)",
          textColor: "#F9FAFB",
          accentColor: "#A78BFA",
          glassEffect: true,
          position: { type: "sticky", top: 0, zIndex: 50 },
          border: { width: 1, color: "rgba(55, 65, 81, 0.5)", style: "solid" },
          padding: { top: 16, bottom: 16 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        tracking: {
          events: [
            { trigger: "click", action: "click_header_cta", label: "Book Demo" },
            { trigger: "click", action: "click_header_trial", label: "Start Free Trial" }
          ]
        },
        metadata: undefined
      },
      // --- HERO ---
      {
        id: 2,
        name: "Primary Hero",
        type: "hero",
        content: {
          title: "The Operating System for Business Intelligence",
          subtitle: "NeuralFlow transforms your business processes with intelligent, self-learning automation. Deploy custom AI agents in minutes, not months, and unlock unparalleled efficiency.",
          cta: "Start Building for Free",
          secondaryCta: "Watch 2-Min Demo",
          socialProof: "Over 50,000 AI agents deployed by teams at Stripe, Notion, and Vercel",
          badges: [
            { label: "No-Code AI Builder", color: "#A78BFA" },
            { label: "SOC 2 Type II Security", color: "#34D399" }
          ]
        },
        design: {
          theme: "dark",
          layout: "hero-saas-demo",
          backgroundColor: "#111827",
          backgroundImage: "https://firebasestorage.googleapis.com/v0/b/firebase-veilnet.firebasestorage.app/o/hero1darksaas.png?alt=media&token=f6fa7e06-e939-4c42-81ee-3cfc47293721",
          backgroundSize: "cover",
          backgroundPosition: "center",
          textColor: "#F9FAFB",
          accentColor: "#A78BFA",
          techElements: true,
          animation: { type: "fadeIn", duration: 1000 },
          padding: { top: 100, bottom: 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        variants: [
          {
            id: "v2-benefit-focus",
            name: "Benefit-focused Headline",
            content: {
              title: "Reduce Operational Costs by 85% with AI Automation",
              subtitle: "Stop wasting resources on repetitive tasks. NeuralFlow's AI agents handle complex workflows, freeing your team to focus on strategic growth."
            },
            weight: 0.5
          }
        ],
        metadata: undefined
      },
      // --- BRANDS ---
      {
        id: 3,
        name: "Social Proof - Brands",
        type: "brands",
        content: {
          title: "Trusted by the World's Most Innovative Companies",
          brands: [
            { name: "Microsoft", logo: "/images/brand-microsoft-dark.svg" },
            { name: "Stripe", logo: "/images/brand-stripe-dark.svg" },
            { name: "Shopify", logo: "/images/brand-shopify-dark.svg" },
            { name: "Notion", logo: "/images/brand-notion-dark.svg" },
            { name: "Discord", logo: "/images/brand-discord-dark.svg" },
            { name: "Vercel", logo: "/images/brand-vercel-dark.svg" }
          ]
        },
        design: {
          theme: "dark",
          backgroundColor: "#111827",
          padding: { top: 60, bottom: 80 },
          animation: { type: "fadeInUp", duration: 800, delay: 200 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- FEATURES ---
      {
        id: 4,
        name: "Platform Features",
        type: "features",
        content: {
          title: "A Radically Better Way to Automate",
          subtitle: "NeuralFlow provides an end-to-end solution for building, deploying, and managing enterprise-grade AI agents.",
          features: [
            { icon: "brain-circuit", title: "Intelligent Agents", description: "Deploy AI agents that learn and adapt to your business processes automatically.", color: "#A78BFA" },
            { icon: "zap", title: "Visual No-Code Builder", description: "Go from idea to deployed AI agent in under 10 minutes. No coding required.", color: "#34D399" },
            { icon: "shield-lock", title: "Enterprise-Grade Security", description: "SOC 2 compliant with end-to-end encryption and granular access controls.", color: "#FBBF24" },
            { icon: "share-network", title: "Universal Integrations", description: "Connect to any API, database, or service with our extensive integration library.", color: "#60A5FA" },
            { icon: "chart-pie", title: "Real-time Analytics", description: "Monitor performance and ROI with detailed insights and customizable dashboards.", color: "#F472B6" },
            { icon: "users-group", title: "Collaborative Workflows", description: "Built for teams with role-based access, version history, and shared workspaces.", color: "#A78BFA" }
          ]
        },
        design: {
          theme: "tech",
          layout: "features-saas",
          backgroundColor: "#1F2937",
          textColor: "#D1D5DB",
          animation: { type: "staggerChildren", duration: 500 },
          padding: { top: 80, bottom: 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- STATS ---
      {
        id: 5,
        name: "Key Performance Metrics",
        type: "stats",
        content: {
          stats: [
            { value: "50k+", label: "Agents Deployed", description: "Across 15 countries" },
            { value: "85%", label: "Average Cost Reduction", description: "In operational tasks" },
            { value: "10x", label: "Faster Processing", description: "Compared to manual workflows" },
            { value: "99.99%", label: "Guaranteed Uptime", description: "Backed by our SLA" }
          ]
        },
        design: {
          theme: "professional",
          layout: "stats-professional",
          backgroundColor: "#111827",
          textColor: "#F9FAFB",
          accentColor: "#A78BFA",
          animation: { type: "counterAnimate", duration: 2000 },
          padding: { top: 60, bottom: 60 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- TESTIMONIALS ---
      {
        id: 6,
        name: "Customer Testimonials",
        type: "testimonials",
        content: {
          title: "Don't Just Take Our Word For It",
          subtitle: "See how leading engineering and operations teams are winning with NeuralFlow.",
          testimonials: [
            { quote: "NeuralFlow didn't just automate tasks, it transformed our entire support pipeline. The AI agents handle complex queries with a 95% success rate, something I didn't think was possible.", author: "Sarah Kim", role: "CTO, TechFlow", image: "/images/testimonial-sarah-dark.jpg", rating: 5, verified: true, results: "80% workload reduction", logo: "/images/brand-techflow-dark.svg" },
            { quote: "We deployed 15 AI agents in our first week. The ROI was immediate and the developer experience is best-in-class. It's the first AI platform that feels like it was built by engineers, for engineers.", author: "Marcus Chen", role: "Head of Engineering, DataCorp", image: "/images/testimonial-marcus-dark.jpg", rating: 5, verified: true, results: "90% faster time-to-market", logo: "/images/brand-datacorp-dark.svg" },
            { quote: "This is the 'aha' moment for enterprise AI. We've connected NeuralFlow to our data warehouse and internal tools, creating a central nervous system for our operations.", author: "Emily Rodriguez", role: "VP of Operations, ScaleUp", image: "/images/testimonial-emily-dark.jpg", rating: 5, verified: true, results: "10x increase in workflow speed", logo: "/images/brand-scaleup-dark.svg" }
          ]
        },
        design: {
          theme: "dark",
          layout: "testimonials-saas",
          backgroundColor: "#1F2937",
          textColor: "#D1D5DB",
          trustIndicators: true,
          padding: { top: 80, bottom: 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- PRICING ---
      {
        id: 7,
        name: "Pricing Plans",
        type: "pricing",
        content: {
          title: "Scale Your AI Operations",
          subtitle: "Flexible pricing that grows with you. Start for free, then upgrade as you scale.",
          plans: [
            {
              name: "Starter",
              price: "$29",
              frequency: "/mo",
              description: "For individuals and small teams dipping their toes in AI automation.",
              features: ["5 AI Agents", "10,000 Operations/mo", "Standard Integrations", "Community Support"],
              cta: "Start 14-Day Trial",
              bestFor: "Startups & Hobbyists"
            },
            {
              name: "Professional",
              price: "$99",
              frequency: "/mo",
              description: "For growing businesses scaling their automation and efficiency.",
              features: ["Unlimited AI Agents", "100,000 Operations/mo", "Premium Integrations", "Priority Email Support", "Advanced Analytics"],
              cta: "Start 14-Day Trial",
              featured: true,
              badge: "Most Popular",
              bestFor: "Growing Businesses",
              guarantee: "30-day money-back guarantee"
            },
            {
              name: "Enterprise",
              price: "Custom",
              description: "For large organizations requiring advanced security, support, and scale.",
              features: ["Unlimited Operations", "Dedicated Infrastructure", "SSO & SAML Login", "24/7 Dedicated Support", "Custom Integrations & SLA"],
              cta: "Contact Sales",
              bestFor: "Large-Scale Operations",
              roi: "Dedicated ROI analysis"
            }
          ]
        },
        design: {
          theme: "tech",
          layout: "pricing-saas",
          backgroundColor: "#111827",
          textColor: "#D1D5DB",
          accentColor: "#A78BFA",
          padding: { top: 80, bottom: 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- FAQ ---
      {
        id: 8,
        name: "Frequently Asked Questions",
        type: "faq",
        content: {
          title: "Have Questions?",
          subtitle: "We have answers. Here are some of the most common questions we get.",
          faqs: [
            { question: "What counts as an 'operation'?", answer: "An operation is a single action performed by an AI agent, such as reading an email, updating a database, or calling an API. We provide generous limits and clear usage dashboards." },
            { question: "Can I integrate with my custom software?", answer: "Yes. Our platform has a robust API and webhook system, allowing you to connect to virtually any internal tool or service. Our Enterprise plan includes hands-on integration support." },
            { question: "How secure is my data?", answer: "Security is our top priority. We are SOC 2 Type II compliant, encrypt all data at rest and in transit, and provide features like role-based access control (RBAC) and single sign-on (SSO) on our Enterprise plan." },
            { question: "What kind of support can I expect?", answer: "All plans include access to our extensive documentation and community forums. The Professional plan adds priority email support, and the Enterprise plan includes a dedicated account manager and 24/7 support channels." }
          ]
        },
        design: {
          theme: "dark",
          layout: "faq-accordion",
          backgroundColor: "#1F2937",
          padding: { top: 80, bottom: 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- CTA ---
      {
        id: 9,
        name: "Final Call-to-Action",
        type: "cta",
        content: {
          title: "Ready to Deploy Your First AI Agent?",
          subtitle: "Start building in our free sandbox today. See the power of NeuralFlow in action and transform your business in minutes.",
          cta: "Start Your Free 14-Day Trial",
          secondaryCta: "Talk to an Expert",
          guaranteeText: "No credit card required. No-risk, cancel anytime."
        },
        design: {
          theme: "energetic",
          layout: "cta-saas",
          backgroundColor: "linear-gradient(90deg, #A78BFA 0%, #60A5FA 100%)",
          textColor: "#FFFFFF",
          shadow: { enabled: true, color: "rgba(167, 139, 250, 0.4)", blur: 30, spread: -10, y: 10 },
          padding: { top: 80, bottom: 80 },
          animation: { type: "pulseGlow" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- FOOTER ---
      {
        id: 10,
        name: "Main Footer",
        type: "footer",
        content: {
          logo: {
            svg: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="#A78BFA"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="#F9FAFB"></path></svg>'
          },
          description: "The Operating System for Business Intelligence.",
          links: [
            { label: "Platform", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Security", href: "/security" },
            { label: "API Docs", href: "/docs" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" }
          ],
          socials: {
            twitter: "https://twitter.com/neuralflow",
            linkedin: "https://linkedin.com/company/neuralflow",
            github: "https://github.com/neuralflow"
          },
          copyright: "© 2024 NeuralFlow AI, Inc. All rights reserved."
        },
        design: {
          theme: "dark",
          backgroundColor: "#111827",
          textColor: "#9CA3AF",
          padding: { top: 60, bottom: 60 },
          border: { width: 1, color: "#374151", style: "solid" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      }
    ]
  },
  {
    id: "saas-light-pro",
    title: "SaaS Platform (Professional)",
    description: "A clean, professional, and conversion-optimized template for modern B2B SaaS companies.",
    image: "https://firebasestorage.googleapis.com/v0/b/firebase-veilnet.firebasestorage.app/o/saaslightcardimage.png?alt=media&token=877b629c-8515-4673-9097-42289c09d57a",
    hint: "This professionally enhanced light variant is designed to build trust and clearly communicate value for a B2B SaaS audience.",
    aiInsight: "By using specific layouts like 'hero-saas-demo', adding micro-animations, and enriching trust signals in testimonials and pricing, this template is structured to maximize demo requests and trial sign-ups.",
    stats: {
      visitors: "15k",
      leads: "1.8k",
      conversion: "15.5%"
    },
    components: [
      // --- HEADER ---
      {
        id: 1,
        name: "Main Navigation Header",
        type: "header",
        content: {
          title: "CloudFlow Pro",
          logo: {
            svg: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="#3B82F6"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="#1F2937"></path></svg>'
          },
          links: [
            { label: "Product", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Customers", href: "#testimonials" },
            { label: "FAQ", href: "#faq" }
          ],
          cta: "Start Free Trial",
          ctaUrl: "#cta",
          secondaryCta: "Sign In",
          secondaryCtaUrl: "/login"
        },
        design: {
          theme: "professional",
          layout: "header-saas",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          textColor: "#111827",
          accentColor: "#3B82F6",
          glassEffect: true,
          position: { type: "sticky", top: 0, zIndex: 50 },
          border: { width: 1, color: "rgba(229, 231, 235, 0.8)", style: "solid" },
          padding: { top: 16, bottom: 16 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        tracking: {
          events: [
            { trigger: "click", action: "click_header_trial", label: "Start Free Trial" }
          ]
        },
        metadata: undefined
      },
      // --- HERO ---
      {
        id: 2,
        name: "Primary Hero",
        type: "hero",
        content: {
          title: "The Command Center for Your Entire Business",
          subtitle: "CloudFlow Pro centralizes your workflows, data, and teams with AI-powered automation. Save 10+ hours per week, guaranteed.",
          cta: {
            primary: "Start 14-Day Free Trial",
            secondary: "Watch Demo",
            note: "No credit card required."
          },
          socialProof: "Join 10,000+ teams at companies like InnovateLabs & TechCorp",
          image: "https://firebasestorage.googleapis.com/v0/b/firebase-veilnet.firebasestorage.app/o/herodashboard-light-pro.png?alt=media&token=c23068e1-512c-47bc-88b9-5cc8e6c7702f",
          imageAlt: "Screenshot of the CloudFlow Pro dashboard showing analytics and workflows"
        },
        design: {
          theme: "professional",
          layout: "hero-saas-demo",
          backgroundColor: "#F9FAFB",
          textColor: "#1F2937",
          accentColor: "#3B82F6",
          animation: { type: "fadeIn", duration: 1000 },
          padding: { top: 100, bottom: 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        variants: [
          {
            id: "v2-problem-focus",
            name: "Problem-focused Headline",
            content: {
              title: "Stop Juggling Apps. Start Automating.",
              subtitle: "Tired of context switching? CloudFlow Pro integrates all your tools into one command center with AI-powered automation."
            },
            weight: 0.5
          }
        ],
        metadata: undefined
      },
      // --- BRANDS ---
      {
        id: 3,
        name: "Social Proof - Brands",
        type: "brands",
        content: {
          title: "Trusted by the Industry's Best",
          brands: [
            { name: "TechCorp", logo: "/images/brand-techcorp-light.svg" },
            { name: "InnovateLabs", logo: "/images/brand-innovatelabs-light.svg" },
            { name: "GlobalSoft", logo: "/images/brand-globalsoft-light.svg" },
            { name: "FutureWorks", logo: "/images/brand-futureworks-light.svg" },
            { name: "NextGen", logo: "/images/brand-nextgen-light.svg" }
          ]
        },
        design: {
          theme: "light",
          backgroundColor: "#F9FAFB",
          padding: { top: 60, bottom: 80 },
          animation: { type: "fadeInUp", duration: 800, delay: 200 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- FEATURES ---
      {
        id: 4,
        name: "Core Platform Features",
        type: "features",
        content: {
          title: "Everything You Need. Nothing You Don't.",
          subtitle: "CloudFlow Pro is designed to be powerful, yet intuitive. Scale your operations with a platform that works for you.",
          features: [
            { icon: "bolt", title: "AI Workflow Builder", description: "Visually create complex automations in minutes. Let our AI suggest optimizations.", color: "#3B82F6" },
            { icon: "chart-bar", title: "Performance Dashboards", description: "Get real-time, actionable insights into your processes and team productivity.", color: "#10B981" },
            { icon: "shield-check", title: "Enterprise-Grade Security", description: "SOC 2 Type II compliant with granular permissions and 99.99% uptime SLA.", color: "#F59E0B" },
            { icon: "puzzle-piece", title: "500+ Integrations", description: "Connect your entire tech stack with our one-click integration marketplace.", color: "#6366F1" }
          ]
        },
        design: {
          theme: "professional",
          layout: "features-saas",
          backgroundColor: "#FFFFFF",
          textColor: "#374151",
          animation: { type: "staggerChildren", duration: 500 },
          padding: { top: 80, bottom: 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- TESTIMONIALS ---
      {
        id: 5,
        name: "Customer Love",
        type: "testimonials",
        content: {
          title: "Why Our Customers Love CloudFlow Pro",
          subtitle: "Don't just take our word for it. Here's what our users are saying.",
          testimonials: [
            { quote: "CloudFlow Pro cut our team's administrative work by 15 hours a week. It's the highest ROI software we've ever purchased. The platform paid for itself in the first month.", author: "Sarah Chen", role: "VP of Operations, TechCorp", image: "/images/testimonial-sarah.jpg", rating: 5, verified: true, results: "Saved 15+ hours/week", logo: "/images/brand-techcorp-light.svg" },
            { quote: "The visual automation builder is a game-changer. Our non-technical team members were building and deploying workflows on day one. It's incredibly empowering.", author: "Marcus Rodriguez", role: "CEO, StartupXYZ", image: "/images/testimonial-marcus.jpg", rating: 5, verified: true, results: "Productivity up 40%", logo: "/images/brand-startupxyz-light.svg" },
            { quote: "We scaled from 1,000 to 10,000 users without a single issue. The reliability and support are second to none. I can sleep at night knowing our infrastructure is solid.", author: "Emily Watson", role: "CTO, InnovateLabs", image: "/images/testimonial-emily.jpg", rating: 5, verified: true, results: "Scaled 10x with 99.99% uptime", logo: "/images/brand-innovatelabs-light.svg" }
          ]
        },
        design: {
          theme: "light",
          layout: "testimonials-saas",
          backgroundColor: "#F9FAFB",
          trustIndicators: true,
          padding: { top: 80, bottom: 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- PRICING ---
      {
        id: 6,
        name: "Pricing Plans",
        type: "pricing",
        content: {
          title: "Plans That Scale With You",
          subtitle: "Start for free, then upgrade as your business grows. No hidden fees. No contracts.",
          plans: [
            {
              name: "Starter",
              price: "$49",
              frequency: "/mo",
              description: "For small teams and startups looking to automate core tasks.",
              features: ["10 Active Workflows", "5,000 Tasks/mo", "Standard Integrations", "Email Support"],
              cta: "Start 14-Day Trial",
              bestFor: "Teams of 2-10"
            },
            {
              name: "Professional",
              price: "$99",
              frequency: "/mo",
              description: "For growing businesses that need more power and collaboration.",
              features: ["Unlimited Workflows", "50,000 Tasks/mo", "Premium Integrations", "Priority Support", "Advanced Analytics"],
              cta: "Start 14-Day Trial",
              featured: true,
              badge: "Most Popular",
              bestFor: "Growing Businesses",
              guarantee: "30-day money-back guarantee"
            },
            {
              name: "Enterprise",
              price: "Custom",
              description: "For large organizations with advanced security and support needs.",
              features: ["Unlimited Tasks", "SAML/SSO", "Dedicated Account Manager", "Custom Integrations", "Uptime SLA"],
              cta: "Contact Sales",
              enterprise: true,
              bestFor: "Large-Scale Operations"
            }
          ]
        },
        design: {
          theme: "professional",
          layout: "pricing-saas",
          backgroundColor: "#FFFFFF",
          accentColor: "#3B82F6",
          padding: { top: 80, bottom: 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- FAQ ---
      {
        id: 7,
        name: "Frequently Asked Questions",
        type: "faq",
        content: {
          title: "Your Questions, Answered",
          subtitle: "Have more questions? Our team is always here to help.",
          faqs: [
            { question: "What is considered a 'task'?", answer: "A task is a single action within a workflow, like sending an email or updating a CRM record. Our plans offer generous allowances, and it's easy to track your usage." },
            { question: "Can I change my plan later?", answer: "Absolutely. You can upgrade, downgrade, or cancel your plan at any time from your account dashboard with just a few clicks." },
            { question: "What happens after my 14-day trial ends?", answer: "We'll notify you before your trial expires. You can then choose a paid plan to continue using CloudFlow Pro or your account will be paused." },
            { question: "Do you offer support for setting up workflows?", answer: "Yes! All plans come with access to our detailed documentation and tutorials. Our Professional and Enterprise plans include priority support to help you build and optimize your automations." }
          ]
        },
        design: {
          theme: "light",
          layout: "faq-detailed",
          backgroundColor: "#F9FAFB",
          padding: { top: 80, bottom: 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- CTA ---
      {
        id: 8,
        name: "Final Call-to-Action",
        type: "cta",
        content: {
          title: "Start Automating in 5 Minutes",
          subtitle: "See for yourself how CloudFlow Pro can transform your business. Start your free, no-risk 14-day trial today.",
          primaryCta: "Sign Up for Free",
          secondaryCta: "Book a Live Demo",
          guaranteeText: "No credit card required. Cancel anytime."
        },
        design: {
          theme: "energetic",
          layout: "cta-saas",
          backgroundColor: "#2563EB",
          backgroundImage: "linear-gradient(45deg, #3B82F6 0%, #60A5FA 100%)",
          textColor: "#FFFFFF",
          shadow: { enabled: true, color: "rgba(59, 130, 246, 0.4)", blur: 30, spread: -10, y: 10 },
          padding: { top: 80, bottom: 80 },
          animation: { type: "pulse" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      // --- FOOTER ---
      {
        id: 9,
        name: "Main Footer",
        type: "footer",
        content: {
          logo: {
            svg: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="#9CA3AF"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="#6B7280"></path></svg>'
          },
          description: "The command center for your entire business.",
          links: [
            { label: "Product", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Customers", href: "#testimonials" },
            { label: "API Docs", href: "/docs" },
            { label: "Security", href: "/security" },
            { label: "Privacy", href: "/privacy" }
          ],
          socials: {
            twitter: "https://twitter.com/cloudflow",
            linkedin: "https://linkedin.com/company/cloudflow"
          },
          copyright: "© 2024 CloudFlow Pro, Inc. All rights reserved."
        },
        design: {
          theme: "light",
          backgroundColor: "#FFFFFF",
          textColor: "#6B7280",
          padding: { top: 60, bottom: 60 },
          border: { width: 1, color: "#E5E7EB", style: "solid" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      }
    ]
  },

  {
    id: "ecommerce",
    title: "Premium E-commerce",
    description: "A conversion-optimized, visually stunning template for luxury and lifestyle e-commerce brands.",
    image: "/images/ecommerce-template-preview.jpg",
    hint: "This template combines luxury aesthetics with proven e-commerce conversion tactics to maximize sales and customer lifetime value.",
    aiInsight:
      "Engineered for high-converting e-commerce with social proof, urgency triggers, and seamless checkout experiences that increase AOV by 35%.",
    stats: {
      visitors: "45k",
      leads: "8.2k",
      conversion: "18.2%",
    },
    components: [
      {
        id: 1,
        type: "header",
        content: {
          title: "LUXE Collection",
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8L40 16v16L24 40L8 32V16L24 8z" fill="currentColor"/><path d="M24 14L34 18v10L24 34L14 28V18L24 14z" fill="white"/></svg>`,
          },
          links: [
            { label: "New Arrivals", href: "#new-arrivals" },
            { label: "Collections", href: "#collections" },
            { label: "Sale", href: "#sale" },
            { label: "About", href: "#about" },
            { label: "Reviews", href: "#reviews" },
          ],
          actions: [
            { label: "VIP Access", href: "#vip", style: "primary" },
            { label: "Account", href: "#account", style: "secondary" },
          ],
          features: [
            { title: "Free Shipping", description: "Free shipping over $150" },
            { title: "Easy Returns", description: "30-day returns" },
            { title: "VIP Support", description: "24/7 concierge" },
          ],
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-white/95 backdrop-blur-sm",
          textColor: "text-gray-900",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: "hero",
        content: {
          title: "Curated Luxury for the Modern Connoisseur",
          subtitle: "Discover exclusive collections from emerging designers and established luxury houses. Each piece is carefully selected for its exceptional craftsmanship, timeless appeal, and ability to elevate your personal style.",
          cta: "Explore Collections",
          secondaryCta: "Join VIP Club",
          socialProof: "100,000+ satisfied customers worldwide • Featured in Vogue, Elle & Harper's Bazaar",
          image: "/images/luxury-fashion-hero.jpg",
          badges: [
            { label: "Free shipping worldwide", color: "gold" },
            { label: "Authenticated luxury", color: "emerald" },
            { label: "30-day returns", color: "blue" },
            { label: "VIP concierge service", color: "purple" },
          ],
          offer: {
            text: "New customers save 15% + free shipping",
            code: "WELCOME15",
            expiry: "Limited time offer",
          },
        },
        design: {
          theme: "luxury",
          layout: "split",
          backgroundColor: "bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: "brands",
        content: {
          title: "Curated from the World's Finest Houses",
          subtitle: "Exclusive partnerships with luxury brands and emerging designers",
          brands: [
            { name: "Hermès", logo: "/images/brand-hermes.svg" },
            { name: "Chanel", logo: "/images/brand-chanel.svg" },
            { name: "Gucci", logo: "/images/brand-gucci.svg" },
            { name: "Prada", logo: "/images/brand-prada.svg" },
            { name: "Saint Laurent", logo: "/images/brand-ysl.svg" },
            { name: "Bottega Veneta", logo: "/images/brand-bottega.svg" },
          ],
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: "stats",
        content: {
          title: "Trusted by Luxury Enthusiasts Worldwide",
          subtitle: "Numbers that reflect our commitment to excellence",
          stats: [
            { value: "100k+", label: "Global Customers", icon: "users" },
            { value: "4.9/5", label: "Customer Rating", icon: "star" },
            { value: "98%", label: "Authenticity Guarantee", icon: "shield-check" },
            { value: "24/7", label: "Concierge Support", icon: "headphones" },
          ],
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-gray-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: "gallery",
        content: {
          title: "New Arrivals & Bestsellers",
          subtitle: "Discover the latest additions to our curated collection",
          images: [
            {
              src: "/images/product-luxury-handbag.jpg",
              alt: "Designer Handbag",
              category: "Handbags",
              title: "Signature Leather Tote",
              price: "$2,850",
              originalPrice: "$3,200",
              badge: "Limited Edition",
              rating: 4.9,
              reviews: 127,
            },
            {
              src: "/images/product-silk-scarf.jpg",
              alt: "Silk Scarf",
              category: "Accessories",
              title: "Hand-Painted Silk Scarf",
              price: "$485",
              badge: "New Arrival",
              rating: 5.0,
              reviews: 43,
            },
            {
              src: "/images/product-designer-dress.jpg",
              alt: "Evening Dress",
              category: "Dresses",
              title: "Couture Evening Gown",
              price: "$4,200",
              badge: "Exclusive",
              rating: 4.8,
              reviews: 89,
            },
            {
              src: "/images/product-luxury-watch.jpg",
              alt: "Luxury Watch",
              category: "Jewelry",
              title: "Swiss Automatic Watch",
              price: "$8,500",
              originalPrice: "$9,200",
              badge: "Sale",
              rating: 4.9,
              reviews: 156,
            },
            {
              src: "/images/product-cashmere-coat.jpg",
              alt: "Cashmere Coat",
              category: "Outerwear",
              title: "Pure Cashmere Coat",
              price: "$1,850",
              badge: "Bestseller",
              rating: 4.7,
              reviews: 203,
            },
            {
              src: "/images/product-designer-shoes.jpg",
              alt: "Designer Shoes",
              category: "Footwear",
              title: "Handcrafted Leather Pumps",
              price: "$950",
              badge: "New",
              rating: 4.8,
              reviews: 91,
            },
          ],
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: "features",
        content: {
          title: "The LUXE Experience",
          subtitle: "Luxury shopping redefined for the modern customer",
          features: [
            {
              icon: "gem",
              title: "Authenticated Luxury",
              description: "Every item is verified by our team of luxury experts and comes with a certificate of authenticity. Shop with complete confidence knowing you're getting genuine luxury pieces.",
            },
            {
              icon: "truck",
              title: "White-Glove Delivery",
              description: "Complimentary worldwide shipping with signature packaging. Express delivery available, plus personal shopping and styling consultations for VIP members.",
            },
            {
              icon: "heart-handshake",
              title: "Personal Styling Service",
              description: "Work with our certified stylists to curate the perfect wardrobe. Virtual consultations available, with personalized recommendations based on your style and lifestyle.",
            },
            {
              icon: "shield-check",
              title: "Lifetime Guarantee",
              description: "Comprehensive warranty on all purchases including free repairs, maintenance services, and satisfaction guarantee. Your investment in luxury is protected for life.",
            },
            {
              icon: "crown",
              title: "VIP Membership Benefits",
              description: "Exclusive access to limited editions, private sales, early access to new collections, and invitations to exclusive fashion events and trunk shows.",
            },
            {
              icon: "refresh-cw",
              title: "Flexible Returns",
              description: "60-day return policy with free return shipping. Unworn items in original condition can be returned or exchanged with no questions asked.",
            },
          ],
        },
        design: {
          theme: "luxury",
          layout: "default",
          backgroundColor: "bg-gray-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: "reviews",
        content: {
          title: "What Our Customers Say",
          subtitle: "Real reviews from luxury enthusiasts worldwide",
          overallRating: 4.9,
          totalReviews: 15847,
          reviews: [
            {
              rating: 5,
              title: "Exceptional quality and service!",
              content: "I've been shopping luxury for years, and LUXE Collection consistently exceeds expectations. The authentication process gives me complete confidence, and the personal styling service is incredible.",
              author: "Isabella M.",
              location: "New York, NY",
              verified: true,
              date: "3 days ago",
              helpful: 47,
              purchase: "Hermès Kelly Bag",
            },
            {
              rating: 5,
              title: "Best luxury shopping experience online",
              content: "The white-glove delivery service is amazing - my Chanel bag arrived in the most beautiful packaging. The VIP concierge helped me find the perfect piece for my collection.",
              author: "Sophia L.",
              location: "London, UK",
              verified: true,
              date: "1 week ago",
              helpful: 32,
              purchase: "Chanel Classic Flap Bag",
            },
            {
              rating: 5,
              title: "Authentic luxury, incredible curation",
              content: "Every piece I've purchased has been absolutely perfect. The curation is impeccable - they only carry the most beautiful, timeless pieces. Worth every penny.",
              author: "Emma R.",
              location: "Paris, France",
              verified: true,
              date: "2 weeks ago",
              helpful: 28,
              purchase: "Saint Laurent Dress",
            },
            {
              rating: 4,
              title: "Outstanding customer service",
              content: "Had an issue with sizing and their customer service team went above and beyond to make it right. Free exchanges, personal styling advice, and they even held a limited edition piece for me.",
              author: "Charlotte K.",
              location: "Tokyo, Japan",
              verified: true,
              date: "3 weeks ago",
              helpful: 19,
              purchase: "Gucci Handbag",
            },
          ],
          trustSignals: [
            "Verified purchases only",
            "Real customer photos",
            "Detailed authenticity process",
            "Satisfaction guaranteed",
          ],
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: "pricing",
        content: {
          title: "VIP Membership Tiers",
          subtitle: "Unlock exclusive benefits and personalized luxury experiences",
          plans: [
            {
              name: "Classic",
              price: "Free",
              frequency: "",
              description: "Essential luxury shopping benefits",
              features: [
                "Free shipping over $150",
                "30-day returns",
                "Authentication guarantee",
                "Basic customer support",
                "Access to sales events",
                "Style inspiration content",
              ],
              cta: "Join Free",
              popular: false,
            },
            {
              name: "VIP",
              price: "$199",
              frequency: "/year",
              description: "Enhanced luxury experience with personal service",
              features: [
                "Everything in Classic",
                "Free shipping on all orders",
                "60-day returns",
                "Priority customer support",
                "Personal styling consultations",
                "Early access to new arrivals",
                "Exclusive member-only pieces",
                "10% off all purchases",
              ],
              cta: "Upgrade to VIP",
              popular: true,
              badge: "Most Popular",
              savings: "Save up to $500/year",
            },
            {
              name: "Platinum",
              price: "$499",
              frequency: "/year",
              description: "Ultimate luxury experience with white-glove service",
              features: [
                "Everything in VIP",
                "Dedicated personal shopper",
                "Private trunk shows",
                "Complimentary alterations",
                "Concierge services",
                "Exclusive event invitations",
                "First access to limited editions",
                "15% off all purchases",
                "Complimentary gift wrapping",
              ],
              cta: "Join Platinum",
              popular: false,
              badge: "Ultimate Luxury",
              exclusive: true,
            },
          ],
          additionalInfo: {
            guarantee: "30-day satisfaction guarantee",
            cancellation: "Cancel anytime",
            upgrade: "Upgrade or downgrade anytime",
          },
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-gray-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: "testimonials",
        content: {
          title: "Featured in Leading Fashion Publications",
          subtitle: "Recognition from the world's most prestigious fashion media",
          testimonials: [
            {
              quote: "LUXE Collection has revolutionized luxury e-commerce with their impeccable curation and authentication process. A must-visit destination for serious luxury collectors.",
              author: "Anna Wintour",
              role: "Editor-in-Chief, Vogue",
              image: "/images/testimonial-anna-wintour.jpg",
            },
            {
              quote: "The future of luxury retail is here. LUXE Collection combines the convenience of online shopping with the personalized service of the world's finest boutiques.",
              author: "Suzy Menkes",
              role: "Fashion Critic & Journalist",
              image: "/images/testimonial-suzy-menkes.jpg",
            },
            {
              quote: "LUXE Collection's commitment to authenticity and customer experience sets the gold standard for luxury e-commerce. Their VIP service is unparalleled.",
              author: "Tim Blanks",
              role: "Fashion Critic",
              image: "/images/testimonial-tim-blanks.jpg",
            },
          ],
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: "newsletter",
        content: {
          title: "Join the Inner Circle",
          subtitle: "Get exclusive access to new arrivals, private sales, and style insights",
          description: "Be the first to discover limited edition pieces, receive personalized styling tips from our experts, and enjoy exclusive member benefits including early access to sales and special events.",
          benefits: [
            "First access to new collections",
            "Exclusive member-only sales up to 40% off",
            "Personal styling tips and trend reports",
            "Invitations to private events and trunk shows",
            "Complimentary shipping on your next order",
          ],
          placeholder: "Enter your email address",
          buttonText: "Join VIP List",
          privacyText: "We respect your privacy. Unsubscribe at any time.",
          incentive: {
            offer: "15% off your first purchase",
            code: "WELCOME15",
          },
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 11,
        type: "accordion",
        content: {
          title: "Frequently Asked Questions",
          subtitle: "Everything you need to know about shopping with LUXE Collection",
          items: [
            {
              question: "How do you guarantee authenticity?",
              answer: "Every item undergoes rigorous authentication by our team of luxury experts who have decades of experience with high-end fashion. We use advanced authentication techniques including material analysis, construction examination, and provenance verification. Each purchase comes with a certificate of authenticity and our lifetime guarantee.",
            },
            {
              question: "What is your return and exchange policy?",
              answer: "We offer a generous 60-day return policy for VIP members (30 days for Classic members). Items must be in original condition with tags attached. We provide free return shipping and can arrange for pickup service. Exchanges are processed immediately, and refunds are issued within 3-5 business days.",
            },
            {
              question: "Do you offer international shipping?",
              answer: "Yes, we ship worldwide with complimentary white-glove delivery service. International orders are fully insured and tracked. Delivery times vary by location but typically range from 2-7 business days. All customs duties and taxes are handled by us for a seamless experience.",
            },
            {
              question: "What makes your personal styling service unique?",
              answer: "Our certified stylists have worked with luxury brands and high-profile clients. They provide personalized consultations via video call or in-person (in select cities), create custom lookbooks, and can coordinate complete wardrobe overhauls. VIP and Platinum members receive priority access and discounted styling sessions.",
            },
            {
              question: "How does the VIP membership work?",
              answer: "VIP membership provides enhanced benefits including free shipping on all orders, extended return periods, priority customer support, personal styling consultations, early access to new arrivals, and exclusive discounts. Membership pays for itself quickly through savings and exclusive access to limited pieces.",
            },
            {
              question: "Do you offer payment plans for high-value items?",
              answer: "Yes, we partner with premium financing services to offer flexible payment options for purchases over $1,000. Options include 0% APR for qualified customers, extended payment terms, and layaway services for limited edition pieces. All financing is handled securely and confidentially.",
            },
          ],
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-gray-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 12,
        type: "cta",
        content: {
          title: "Discover Your Next Luxury Obsession",
          subtitle: "Join 100,000+ discerning customers who trust LUXE Collection for authentic luxury",
          description: "Experience the future of luxury shopping with our curated collections, authentication guarantee, and white-glove service. New customers receive 15% off their first purchase plus complimentary shipping.",
          primaryCta: "Start Shopping",
          secondaryCta: "Join VIP Club",
          benefits: [
            "15% off your first purchase",
            "Free worldwide shipping",
            "Authentication guarantee",
            "60-day returns for VIP members",
            "Personal styling consultation",
          ],
          urgency: "Limited time: New customer offer expires in 48 hours",
          socialProof: "2,847 customers shopped in the last 24 hours",
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 13,
        type: "footer",
        content: {
          title: "LUXE Collection",
          description: "Curated luxury for the modern connoisseur",
          copyright: "© 2025 LUXE Collection. All rights reserved.",
          links: [
            { label: "Size Guide", href: "/size-guide" },
            { label: "Authentication", href: "/authentication" },
            { label: "Shipping & Returns", href: "/shipping" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Careers", href: "/careers" },
          ],
          social: [
            { platform: "instagram", url: "https://instagram.com/luxecollection" },
            { platform: "pinterest", url: "https://pinterest.com/luxecollection" },
            { platform: "facebook", url: "https://facebook.com/luxecollection" },
          ],
          contact: {
            email: "concierge@luxecollection.com",
            phone: "+1 (555) 123-LUXE",
            hours: "24/7 VIP Concierge Service",
          },
          certifications: ["SSL Secured", "Verified Authentic", "Luxury Certified"],
        },
        design: {
          theme: "luxury",
          backgroundColor: "bg-gray-900",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  {
    id: "consulting",
    title: "Strategic Advisory",
    description: "A sophisticated, results-driven template for elite consulting firms and strategic advisors.",
    image: "/images/consulting-template-preview.jpg",
    hint: "This template positions consulting firms as trusted strategic partners with proven methodologies and measurable results.",
    aiInsight:
      "Designed to establish authority and credibility through case studies, thought leadership, and clear ROI demonstrations that convert high-value prospects.",
    stats: {
      visitors: "12.5k",
      leads: "1.8k",
      conversion: "14.4%",
    },
    components: [
      {
        id: 1,
        type: "header",
        content: {
          title: "Meridian Strategic",
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4L44 14v20L24 44L4 34V14L24 4z" fill="currentColor"/><path d="M24 12L36 18v12L24 36L12 30V18L24 12z" fill="white"/></svg>`,
          },
          links: [
            { label: "Expertise", href: "#expertise" },
            { label: "Case Studies", href: "#results" },
            { label: "Insights", href: "#insights" },
            { label: "Team", href: "#team" },
            { label: "Contact", href: "#contact" },
          ],
          actions: [
            { label: "Schedule Consultation", href: "#consultation", style: "primary" },
            { label: "Download Insights", href: "#resources", style: "secondary" },
          ],
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-white/95 backdrop-blur-sm",
          textColor: "text-gray-900",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: "hero",
        content: {
          title: "Transform Strategy Into Sustainable Competitive Advantage",
          subtitle: "We partner with visionary leaders to architect breakthrough strategies that deliver measurable results. Our proven methodologies have generated over $5B in value for Fortune 500 companies and high-growth enterprises.",
          cta: "Explore Our Impact",
          secondaryCta: "Schedule Strategy Session",
          socialProof: "$5B+ in client value created • 500+ transformations • 98% client retention",
          image: "/images/consulting-boardroom-strategy.jpg",
          badges: [
            { label: "Fortune 500 trusted", color: "gold" },
            { label: "McKinsey alumni team", color: "blue" },
            { label: "Guaranteed ROI", color: "emerald" },
          ],
        },
        design: {
          theme: "elegant",
          layout: "split",
          backgroundColor: "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50",
          textColor: "text-gray-900",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: "brands",
        content: {
          title: "Trusted by Global Industry Leaders",
          subtitle: "We've transformed strategy for companies that define their industries",
          brands: [
            { name: "Goldman Sachs", logo: "/images/brand-goldman-sachs.svg" },
            { name: "McKinsey & Company", logo: "/images/brand-mckinsey.svg" },
            { name: "Boston Consulting Group", logo: "/images/brand-bcg.svg" },
            { name: "Bain & Company", logo: "/images/brand-bain.svg" },
            { name: "Deloitte", logo: "/images/brand-deloitte.svg" },
            { name: "PwC", logo: "/images/brand-pwc.svg" },
          ],
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: "stats",
        content: {
          title: "Results That Define Excellence",
          subtitle: "Our track record speaks to our commitment to client success",
          stats: [
            { value: "$5B+", label: "Client Value Created", icon: "trending-up" },
            { value: "500+", label: "Strategic Transformations", icon: "target" },
            { value: "98%", label: "Client Retention Rate", icon: "award" },
            { value: "25+", label: "Years Combined Experience", icon: "clock" },
          ],
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-slate-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: "features",
        content: {
          title: "Strategic Capabilities That Drive Results",
          subtitle: "Comprehensive consulting services designed for transformational impact",
          features: [
            {
              icon: "lightbulb",
              title: "Strategic Planning & Execution",
              description: "Develop and implement comprehensive strategies that align organizational capabilities with market opportunities, ensuring sustainable competitive advantage and measurable growth.",
            },
            {
              icon: "trending-up",
              title: "Digital Transformation",
              description: "Navigate complex digital landscapes with data-driven strategies that modernize operations, enhance customer experience, and unlock new revenue streams.",
            },
            {
              icon: "users",
              title: "Organizational Excellence",
              description: "Transform culture, optimize structures, and develop leadership capabilities that enable organizations to execute strategy and adapt to changing market conditions.",
            },
            {
              icon: "globe",
              title: "Market Entry & Expansion",
              description: "Strategic market analysis and entry strategies that minimize risk while maximizing growth potential in new geographic and product markets.",
            },
            {
              icon: "zap",
              title: "Operational Optimization",
              description: "Streamline processes, eliminate inefficiencies, and implement best practices that reduce costs while improving quality and customer satisfaction.",
            },
            {
              icon: "shield",
              title: "Risk Management & Compliance",
              description: "Comprehensive risk assessment and mitigation strategies that protect value while enabling bold strategic moves and innovation.",
            },
          ],
        },
        design: {
          theme: "elegant",
          layout: "default",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: "process",
        content: {
          title: "Our Proven Strategic Methodology",
          subtitle: "A systematic approach refined through 500+ successful engagements",
          steps: [
            {
              number: "01",
              title: "Strategic Assessment",
              description: "Comprehensive analysis of current state, competitive landscape, and market dynamics to identify key opportunities and challenges.",
              icon: "search",
              deliverables: ["Market analysis", "Competitive assessment", "Capability audit"],
            },
            {
              number: "02",
              title: "Strategy Design",
              description: "Collaborative development of breakthrough strategies using proven frameworks and innovative thinking methodologies.",
              icon: "lightbulb",
              deliverables: ["Strategic roadmap", "Business model design", "Value proposition"],
            },
            {
              number: "03",
              title: "Implementation Planning",
              description: "Detailed execution plans with clear milestones, resource requirements, and success metrics to ensure flawless delivery.",
              icon: "map",
              deliverables: ["Implementation roadmap", "Resource plan", "Success metrics"],
            },
            {
              number: "04",
              title: "Change Management",
              description: "Comprehensive change management to ensure organizational alignment and successful adoption of new strategies.",
              icon: "users",
              deliverables: ["Change strategy", "Communication plan", "Training programs"],
            },
            {
              number: "05",
              title: "Performance Optimization",
              description: "Continuous monitoring and optimization to maximize results and adapt to changing market conditions.",
              icon: "trending-up",
              deliverables: ["Performance dashboard", "Optimization recommendations", "Ongoing support"],
            },
          ],
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-slate-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: "portfolio",
        content: {
          title: "Transformational Case Studies",
          subtitle: "Real results from strategic partnerships that redefined industries",
          projects: [
            {
              title: "Global Technology Giant: Digital Transformation",
              category: "Digital Strategy",
              description: "Led comprehensive digital transformation for Fortune 50 technology company, resulting in $2.5B revenue increase and 40% operational efficiency improvement.",
              image: "/images/case-study-tech-transformation.jpg",
              results: ["$2.5B revenue increase", "40% efficiency improvement", "18-month transformation"],
              client: "Fortune 50 Technology Company",
              industry: "Technology",
              challenge: "Legacy systems hindering innovation and growth",
              solution: "End-to-end digital transformation with AI integration",
              link: "/case-studies/tech-transformation",
            },
            {
              title: "Private Equity Portfolio: Value Creation Strategy",
              category: "Value Creation",
              description: "Developed and executed value creation strategy across 12-company portfolio, achieving 3.2x average return and successful exits within 4 years.",
              image: "/images/case-study-pe-value-creation.jpg",
              results: ["3.2x average return", "12 successful exits", "4-year timeline"],
              client: "Top-Tier Private Equity Firm",
              industry: "Financial Services",
              challenge: "Maximizing portfolio company value and exit potential",
              solution: "Comprehensive value creation across operational and strategic dimensions",
              link: "/case-studies/pe-value-creation",
            },
            {
              title: "Healthcare System: Strategic Restructuring",
              category: "Organizational Transformation",
              description: "Restructured multi-billion dollar healthcare system, improving patient outcomes by 35% while reducing costs by $500M annually.",
              image: "/images/case-study-healthcare-restructuring.jpg",
              results: ["35% improved outcomes", "$500M cost reduction", "24-month implementation"],
              client: "Multi-Billion Healthcare System",
              industry: "Healthcare",
              challenge: "Rising costs with declining patient satisfaction",
              solution: "Strategic restructuring with focus on patient-centered care",
              link: "/case-studies/healthcare-restructuring",
            },
          ],
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: "team",
        content: {
          title: "World-Class Strategic Expertise",
          subtitle: "Former partners from top-tier consulting firms with proven track records",
          members: [
            {
              name: "Alexandra Sterling",
              role: "Managing Partner & Founder",
              bio: "Former McKinsey Senior Partner with 20+ years leading strategic transformations for Fortune 100 companies. Harvard MBA, specialized in digital strategy and organizational change.",
              image: "/images/team-alexandra-sterling.jpg",
              linkedin: "https://linkedin.com/in/alexandrasterling",
              expertise: ["Digital Transformation", "Strategic Planning", "Change Management"],
              education: "Harvard Business School MBA, Stanford BS Engineering",
              experience: "Former McKinsey Senior Partner, 20+ years consulting",
            },
            {
              name: "Marcus Chen",
              role: "Senior Partner, Technology Practice",
              bio: "Ex-BCG Principal and former Google VP of Strategy. Leads our technology and digital transformation practice with deep expertise in AI, cloud, and platform strategies.",
              image: "/images/team-marcus-chen.jpg",
              linkedin: "https://linkedin.com/in/marcuschen",
              expertise: ["Technology Strategy", "AI Implementation", "Platform Business Models"],
              education: "Wharton MBA, MIT BS Computer Science",
              experience: "Former BCG Principal, Ex-Google VP Strategy",
            },
            {
              name: "Sarah Rodriguez",
              role: "Senior Partner, Operations Excellence",
              bio: "Former Bain Partner specializing in operational transformation and performance improvement. Led 100+ cost reduction and efficiency programs across industries.",
              image: "/images/team-sarah-rodriguez.jpg",
              linkedin: "https://linkedin.com/in/sarahrodriguez",
              expertise: ["Operational Excellence", "Cost Optimization", "Process Redesign"],
              education: "Kellogg MBA, UC Berkeley BS Industrial Engineering",
              experience: "Former Bain Partner, 15+ years operations consulting",
            },
            {
              name: "David Thompson",
              role: "Senior Partner, Financial Strategy",
              bio: "Former Goldman Sachs Managing Director and Deloitte Partner. Specializes in M&A strategy, capital allocation, and value creation for private equity and corporate clients.",
              image: "/images/team-david-thompson.jpg",
              linkedin: "https://linkedin.com/in/davidthompson",
              expertise: ["M&A Strategy", "Capital Allocation", "Value Creation"],
              education: "Columbia MBA, Princeton BA Economics",
              experience: "Former Goldman Sachs MD, Ex-Deloitte Partner",
            },
          ],
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-slate-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: "testimonials",
        content: {
          title: "Client Success Stories",
          subtitle: "Hear from leaders who transformed their organizations with our partnership",
          testimonials: [
            {
              quote: "Meridian Strategic didn't just provide recommendations – they became true strategic partners. Their methodology and execution support helped us achieve a 300% increase in market valuation within 18 months.",
              author: "Jennifer Walsh",
              role: "CEO, TechVentures Global",
              image: "/images/testimonial-jennifer-walsh.jpg",
              company: "TechVentures Global",
            },
            {
              quote: "The strategic transformation led by Meridian was flawless. They helped us navigate a complex market entry that resulted in $1.2B in new revenue and established us as the market leader in under two years.",
              author: "Robert Kim",
              role: "Chairman & CEO, GlobalManufacturing Corp",
              image: "/images/testimonial-robert-kim.jpg",
              company: "GlobalManufacturing Corp",
            },
            {
              quote: "Working with Meridian Strategic was transformational for our organization. Their change management approach achieved 95% employee adoption of new processes, and we saw immediate improvements in both efficiency and morale.",
              author: "Lisa Park",
              role: "Chief Operating Officer, HealthSystem Alliance",
              image: "/images/testimonial-lisa-park.jpg",
              company: "HealthSystem Alliance",
            },
          ],
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: "pricing",
        content: {
          title: "Strategic Partnership Models",
          subtitle: "Flexible engagement structures designed to maximize your ROI",
          plans: [
            {
              name: "Strategic Assessment",
              price: "$75,000",
              frequency: "6-8 week engagement",
              description: "Comprehensive strategic analysis and recommendations",
              features: [
                "Current state assessment",
                "Competitive landscape analysis",
                "Strategic opportunity identification",
                "Detailed recommendations report",
                "Executive presentation",
                "30-day implementation support",
              ],
              cta: "Start Assessment",
              popular: false,
              deliverables: ["Strategic assessment report", "Implementation roadmap", "Executive presentation"],
            },
            {
              name: "Transformation Program",
              price: "$350,000",
              frequency: "6-12 month engagement",
              description: "End-to-end strategic transformation with implementation support",
              features: [
                "Everything in Strategic Assessment",
                "Detailed implementation planning",
                "Change management support",
                "Weekly progress reviews",
                "Team training and development",
                "Performance tracking and optimization",
                "Dedicated project manager",
                "C-suite advisory support",
              ],
              cta: "Begin Transformation",
              popular: true,
              badge: "Most Comprehensive",
              roi: "Average 5:1 ROI within 12 months",
            },
            {
              name: "Strategic Partnership",
              price: "Custom",
              frequency: "Ongoing relationship",
              description: "Long-term strategic advisory and implementation partnership",
              features: [
                "Dedicated senior partner",
                "Quarterly strategic reviews",
                "Ongoing implementation support",
                "Priority access to expertise",
                "Custom research and analysis",
                "Board presentation support",
                "Crisis management support",
                "Unlimited strategic consultation",
              ],
              cta: "Discuss Partnership",
              popular: false,
              enterprise: true,
            },
          ],
          additionalInfo: {
            guarantee: "Results guarantee or fee adjustment",
            paymentTerms: "Flexible payment structures available",
            customization: "All engagements customized to client needs",
          },
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-slate-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 11,
        type: "accordion",
        content: {
          title: "Strategic Partnership FAQ",
          subtitle: "Everything you need to know about working with Meridian Strategic",
          items: [
            {
              question: "What makes Meridian Strategic different from other consulting firms?",
              answer: "Our difference lies in our proven methodology, senior-level engagement, and results guarantee. Unlike traditional consulting firms, our partners personally lead every engagement, ensuring you get top-tier expertise throughout the project. We also offer a results guarantee – if we don't deliver the agreed-upon outcomes, we adjust our fees accordingly.",
            },
            {
              question: "How do you ensure successful implementation of strategic recommendations?",
              answer: "Implementation is where most strategies fail, which is why we don't just provide recommendations – we partner with you through execution. Our approach includes detailed implementation planning, change management support, regular progress reviews, and hands-on support until results are achieved. We also provide training to your internal teams to ensure sustainability.",
            },
            {
              question: "What industries and company sizes do you work with?",
              answer: "We work with mid-market to Fortune 500 companies across technology, healthcare, financial services, manufacturing, and retail industries. Our sweet spot is companies with $100M+ in revenue facing complex strategic challenges that require senior-level expertise and proven methodologies.",
            },
            {
              question: "How do you measure and guarantee results?",
              answer: "We establish clear, measurable success criteria at the beginning of every engagement, including financial metrics, operational improvements, and strategic milestones. We provide regular progress reports and final impact assessments. Our results guarantee means that if we don't achieve the agreed-upon outcomes, we adjust our fees to reflect the actual value delivered.",
            },
            {
              question: "What is the typical timeline for seeing results?",
              answer: "While every engagement is unique, our clients typically see initial results within 60-90 days and full impact within 6-12 months. Strategic assessments provide immediate insights and quick wins, while comprehensive transformations deliver sustained results over 12-24 months. We focus on both short-term improvements and long-term strategic advantage.",
            },
            {
              question: "Do you work with private equity firms and their portfolio companies?",
              answer: "Yes, we have extensive experience working with private equity firms and their portfolio companies. We understand the unique pressures of PE ownership and focus on strategies that drive rapid value creation, operational improvements, and successful exits. Our PE clients have achieved an average 3.2x return on their investments.",
            },
          ],
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 12,
        type: "cta",
        content: {
          title: "Ready to Transform Your Strategic Advantage?",
          subtitle: "Schedule a confidential consultation with our senior partners to explore how we can accelerate your growth and competitive position.",
          description: "In our initial consultation, we'll assess your strategic challenges, share relevant case studies, and outline a customized approach to achieve your objectives. This consultation is complimentary and provides immediate value regardless of whether we work together.",
          primaryCta: "Schedule Consultation",
          secondaryCta: "Download Case Studies",
          benefits: [
            "Complimentary 90-minute strategy session",
            "Custom strategic assessment",
            "Relevant case study examples",
            "No obligation or sales pressure",
          ],
          urgency: "Limited availability - Senior partners personally conduct all consultations",
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 13,
        type: "footer",
        content: {
          title: "Meridian Strategic",
          description: "Transforming strategy into sustainable competitive advantage",
          copyright: "© 2025 Meridian Strategic. All rights reserved.",
          links: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Careers", href: "/careers" },
            { label: "Press", href: "/press" },
            { label: "Contact", href: "/contact" },
          ],
          social: [
            { platform: "linkedin", url: "https://linkedin.com/company/meridianstrategic" },
            { platform: "twitter", url: "https://twitter.com/meridianstrat" },
          ],
          contact: {
            email: "partners@meridianstrategic.com",
            phone: "+1 (555) 123-4567",
            address: "One World Trade Center, New York, NY 10007",
          },
          offices: [
            { city: "New York", address: "One World Trade Center, NY 10007" },
            { city: "San Francisco", address: "555 California Street, CA 94104" },
            { city: "London", address: "1 Canada Square, London E14 5AB" },
          ],
        },
        design: {
          theme: "elegant",
          backgroundColor: "bg-slate-900",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  {
    id: 'executive-coaching',
    title: 'Executive Leadership Development',
    description: 'A premium, results-driven template for executive coaches and leadership development consultants.',
    image: '/images/executive-coaching-template-preview.jpg',
    hint: 'This template positions executive coaches as trusted advisors who transform leaders and drive organizational success.',
    aiInsight: 'Designed with authority-building elements and success stories that convert high-level executives into coaching clients through credibility and proven results.',
    stats: {
      visitors: '9.8k',
      leads: '1.2k',
      conversion: '12.2%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'Apex Leadership',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8L32 20H40L24 40L8 20H16L24 8Z" fill="currentColor"/><path d="M24 16L28 24H32L24 32L16 24H20L24 16Z" fill="white"/></svg>`
          },
          links: [
            { label: 'Coaching', href: '#coaching' },
            { label: 'Programs', href: '#programs' },
            { label: 'Results', href: '#results' },
            { label: 'About', href: '#about' },
            { label: 'Resources', href: '#resources' }
          ],
          actions: [
            { label: 'Book Discovery Call', href: '#discovery', style: 'primary' },
            { label: 'Leadership Assessment', href: '#assessment', style: 'secondary' }
          ]
        },
        design: {
          theme: 'executive',
          backgroundColor: 'bg-white/95 backdrop-blur-sm',
          textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Transform Your Leadership, Transform Your Organization',
          subtitle: 'Elite executive coaching for visionary leaders who demand exceptional results. I partner with C-suite executives and senior leaders to unlock their full potential, drive organizational transformation, and achieve breakthrough performance that defines industry leadership.',
          cta: 'Schedule Discovery Call',
          secondaryCta: 'View Success Stories',
          socialProof: '200+ executives coached • $5B+ in organizational value created • 95% client satisfaction',
          image: '/images/executive-coaching-boardroom.jpg',
          badges: [
            { label: 'ICF Master Certified', color: 'gold' },
            { label: 'Fortune 500 trusted', color: 'blue' },
            { label: 'Proven ROI', color: 'emerald' },
            { label: '20+ years experience', color: 'purple' }
          ]
        },
        design: {
          theme: 'executive',
          layout: 'split',
          backgroundColor: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
          textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'stats',
        content: {
          title: 'Leadership Transformation Results',
          subtitle: 'Measurable impact on leaders and organizations',
          stats: [
            { value: '200+', label: 'Executives Coached', icon: 'users' },
            { value: '$5B+', label: 'Organizational Value Created', icon: 'trending-up' },
            { value: '95%', label: 'Client Satisfaction Rate', icon: 'star' },
            { value: '85%', label: 'Promotion Rate', icon: 'arrow-up' },
          ],
        },
        design: {
          theme: 'executive',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'features',
        content: {
          title: 'Comprehensive Leadership Development',
          subtitle: 'Holistic approach to executive excellence and organizational impact',
          features: [
            {
              icon: 'target',
              title: 'Strategic Leadership Coaching',
              description: 'One-on-one executive coaching focused on strategic thinking, decision-making, and visionary leadership that drives organizational transformation and competitive advantage.'
            },
            {
              icon: 'users',
              title: 'Team Performance Optimization',
              description: 'Develop high-performing leadership teams through improved communication, collaboration, and alignment around strategic objectives and organizational culture.'
            },
            {
              icon: 'trending-up',
              title: 'Change Leadership Mastery',
              description: 'Master the art of leading organizational change, transformation initiatives, and cultural shifts that drive sustainable business results and employee engagement.'
            },
            {
              icon: 'brain',
              title: 'Executive Presence Development',
              description: 'Enhance your executive presence, communication skills, and influence to inspire confidence, build trust, and lead with authentic authority at the highest levels.'
            },
            {
              icon: 'compass',
              title: 'Values-Based Leadership',
              description: 'Align personal values with leadership actions to create authentic, purpose-driven leadership that inspires teams and drives meaningful organizational impact.'
            },
            {
              icon: 'award',
              title: 'Performance Acceleration',
              description: 'Accelerate career advancement and organizational impact through personalized development plans, skill enhancement, and strategic positioning for success.'
            }
          ]
        },
        design: {
          theme: 'executive',
          layout: 'default',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'process',
        content: {
          title: 'The Apex Leadership Method',
          subtitle: 'Proven framework for executive transformation and organizational impact',
          steps: [
            {
              number: '01',
              title: 'Leadership Assessment',
              description: 'Comprehensive 360-degree assessment of leadership capabilities, strengths, blind spots, and organizational impact.',
              icon: 'search',
              deliverables: ['Leadership assessment report', '360-degree feedback', 'Development priorities'],
              timeline: '2 weeks'
            },
            {
              number: '02',
              title: 'Vision & Strategy Alignment',
              description: 'Define personal leadership vision, align with organizational strategy, and establish clear development objectives.',
              icon: 'eye',
              deliverables: ['Leadership vision statement', 'Development roadmap', 'Success metrics'],
              timeline: '1 week'
            },
            {
              number: '03',
              title: 'Intensive Coaching Program',
              description: 'Regular one-on-one coaching sessions focused on skill development, behavioral change, and leadership effectiveness.',
              icon: 'users',
              deliverables: ['Weekly coaching sessions', 'Action plans', 'Progress tracking'],
              timeline: '6-12 months'
            },
            {
              number: '04',
              title: 'Real-World Application',
              description: 'Apply new leadership skills in real business situations with ongoing support and feedback for maximum impact.',
              icon: 'zap',
              deliverables: ['Implementation support', 'Feedback sessions', 'Course corrections'],
              timeline: 'Ongoing'
            },
            {
              number: '05',
              title: 'Sustainable Excellence',
              description: 'Embed new leadership behaviors and continue development for sustained high performance and organizational impact.',
              icon: 'trending-up',
              deliverables: ['Sustainability plan', 'Ongoing support', 'Continuous improvement'],
              timeline: 'Long-term'
            }
          ]
        },
        design: {
          theme: 'executive',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'testimonials',
        content: {
          title: 'Transformational Success Stories',
          subtitle: 'Hear from executives who achieved breakthrough results',
          testimonials: [
            {
              quote: 'Working with Apex Leadership was transformational for both me personally and our organization. The coaching helped me develop the strategic thinking and leadership presence needed to successfully lead our $2B acquisition and integration.',
              author: 'Jennifer Walsh',
              role: 'CEO, TechGlobal Industries',
              image: '/images/testimonial-jennifer-walsh-ceo.jpg',
              company: 'Fortune 500 Technology',
              results: 'Led $2B acquisition, 40% team engagement increase'
            },
            {
              quote: 'The leadership development program completely changed how I approach strategic decision-making and team leadership. Within 6 months, our division achieved record performance and I was promoted to the C-suite.',
              author: 'Marcus Chen',
              role: 'Chief Operating Officer, GlobalManufacturing',
              image: '/images/testimonial-marcus-chen-coo.jpg',
              company: 'Manufacturing Conglomerate',
              results: 'Promoted to C-suite, record division performance'
            },
            {
              quote: 'The coaching helped me navigate the most challenging period in our company\'s history. The change leadership skills I developed were instrumental in our successful turnaround and return to profitability.',
              author: 'Sarah Rodriguez',
              role: 'President, FinanceFirst Corp',
              image: '/images/testimonial-sarah-rodriguez-president.jpg',
              company: 'Financial Services',
              results: 'Successful turnaround, return to profitability'
            }
          ],
        },
        design: {
          theme: 'executive',
          backgroundColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'pricing',
        content: {
          title: 'Executive Development Investment',
          subtitle: 'Flexible coaching programs designed for executive success',
          plans: [
            {
              name: 'Leadership Intensive',
              price: '$15,000',
              frequency: '3-month program',
              description: 'Focused coaching for specific leadership challenges and skill development',
              features: [
                '12 one-on-one coaching sessions',
                'Leadership assessment and 360 feedback',
                'Personalized development plan',
                'Email and phone support',
                'Progress tracking and reporting',
                'Resource library access'
              ],
              cta: 'Start Intensive',
              popular: false,
              bestFor: 'Specific skill development'
            },
            {
              name: 'Executive Transformation',
              price: '$35,000',
              frequency: '6-month program',
              description: 'Comprehensive leadership development for significant transformation',
              features: [
                '24 one-on-one coaching sessions',
                'Comprehensive leadership assessment',
                '360-degree feedback process',
                'Team coaching sessions included',
                'Unlimited email and phone support',
                'Quarterly progress reviews',
                'Custom leadership tools',
                'Executive presence development'
              ],
              cta: 'Begin Transformation',
              popular: true,
              badge: 'Most Comprehensive',
              roi: 'Average 500% ROI on leadership effectiveness'
            },
            {
              name: 'C-Suite Partnership',
              price: '$75,000',
              frequency: '12-month partnership',
              description: 'Ongoing strategic partnership for C-suite executives and senior leaders',
              features: [
                'Unlimited coaching sessions',
                'Strategic advisory support',
                'Board presentation coaching',
                'Crisis leadership support',
                'Team development programs',
                'Organizational culture consulting',
                'Executive retreat facilitation',
                'Succession planning support',
                'Priority access and response'
              ],
              cta: 'Discuss Partnership',
              popular: false,
              enterprise: true,
              guarantee: 'Satisfaction guarantee or program adjustment'
            }
          ],
          additionalInfo: {
            assessment: 'Complimentary leadership assessment included',
            flexibility: 'Flexible scheduling around executive calendars',
            confidentiality: 'Complete confidentiality guaranteed'
          }
        },
        design: {
          theme: 'executive',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'accordion',
        content: {
          title: 'Executive Coaching Questions',
          subtitle: 'Everything you need to know about executive leadership development',
          items: [
            {
              question: 'What makes your executive coaching approach unique?',
              answer: 'My approach combines 20+ years of C-suite experience with ICF Master Certified coaching credentials. I focus on both personal leadership development and organizational impact, ensuring that individual growth translates into measurable business results. My clients don\'t just become better leaders – they drive transformational organizational change.'
            },
            {
              question: 'How do you measure the success of executive coaching?',
              answer: 'Success is measured through multiple metrics including 360-degree feedback improvements, achievement of specific leadership objectives, organizational performance indicators, team engagement scores, and career advancement. We establish clear success criteria at the beginning and track progress throughout the engagement.'
            },
            {
              question: 'What types of executives do you typically work with?',
              answer: 'I work with C-suite executives, senior VPs, and high-potential leaders in Fortune 500 companies and fast-growing organizations. My clients typically face complex leadership challenges such as organizational transformation, team performance issues, strategic decision-making, or preparation for increased responsibilities.'
            },
            {
              question: 'How confidential is the executive coaching process?',
              answer: 'Complete confidentiality is guaranteed. All coaching conversations, assessments, and development plans remain strictly confidential between coach and client. I adhere to ICF ethical guidelines and can provide additional confidentiality agreements as needed. Trust and confidentiality are foundational to effective executive coaching.'
            },
            {
              question: 'What is the typical timeline for seeing results?',
              answer: 'Most executives begin seeing initial results within 30-60 days, with significant transformation typically occurring within 3-6 months. However, sustainable leadership change and organizational impact often require 6-12 months of consistent development. The timeline varies based on individual goals and organizational complexity.'
            },
            {
              question: 'Do you provide coaching for entire leadership teams?',
              answer: 'Yes, I offer team coaching and leadership team development programs. These can be combined with individual executive coaching for maximum impact. Team coaching focuses on improving collaboration, communication, strategic alignment, and collective leadership effectiveness to drive organizational performance.'
            }
          ],
        },
        design: {
          theme: 'executive',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: 'cta',
        content: {
          title: 'Ready to Elevate Your Leadership Impact?',
          subtitle: 'Join 200+ executives who transformed their leadership and organizations',
          description: 'Schedule a confidential discovery call to explore your leadership challenges and discuss how executive coaching can accelerate your success and organizational impact. This complimentary session provides immediate value and insights.',
          primaryCta: 'Schedule Discovery Call',
          secondaryCta: 'Download Leadership Guide',
          benefits: [
            'Complimentary 60-minute discovery session',
            'Personalized leadership insights',
            'Custom development recommendations',
            'No obligation or sales pressure'
          ],
          urgency: 'Limited availability - Only 5 new clients per quarter',
          socialProof: 'Trusted by Fortune 500 executives worldwide'
        },
        design: {
          theme: 'executive',
          backgroundColor: 'bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: 'footer',
        content: {
          title: 'Apex Leadership',
          description: 'Transforming leaders, transforming organizations',
          copyright: '© 2025 Apex Leadership. All rights reserved.',
          links: [
            { label: 'Leadership Resources', href: '/resources' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Speaking', href: '/speaking' },
            { label: 'Media Kit', href: '/media' }
          ],
          social: [
            { platform: 'linkedin', url: 'https://linkedin.com/in/apexleadership' },
            { platform: 'twitter', url: 'https://twitter.com/apexleadership' }
          ],
          contact: {
            email: 'coaching@apexleadership.com',
            phone: '+1 (555) 123-APEX',
            calendar: 'Schedule at calendly.com/apexleadership'
          },
          credentials: ['ICF Master Certified Coach', 'Harvard Business School', '20+ Years C-Suite Experience']
        },
        design: {
          theme: 'executive',
          backgroundColor: 'bg-gray-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  {
    id: 'cybersecurity',
    title: 'Enterprise Cybersecurity',
    description: 'A trust-focused, security-first template for cybersecurity consulting firms and managed security service providers.',
    image: '/images/cybersecurity-template-preview.jpg',
    hint: 'This template emphasizes trust, expertise, and proven security solutions to convert enterprise prospects into long-term security partners.',
    aiInsight: 'Engineered with security psychology and compliance focus that converts enterprise decision-makers through threat awareness and solution confidence.',
    stats: {
      visitors: '15.2k',
      leads: '2.1k',
      conversion: '13.8%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'CyberShield Pro',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4L40 12V28C40 36 32 42 24 44C16 42 8 36 8 28V12L24 4Z" fill="currentColor"/><path d="M24 12L32 16V28C32 32 28 36 24 38C20 36 16 32 16 28V16L24 12Z" fill="white"/></svg>`
          },
          links: [
            { label: 'Solutions', href: '#solutions' },
            { label: 'Threat Intel', href: '#intelligence' },
            { label: 'Compliance', href: '#compliance' },
            { label: 'Resources', href: '#resources' },
            { label: 'Contact', href: '#contact' }
          ],
          actions: [
            { label: 'Security Assessment', href: '#assessment', style: 'primary' },
            { label: 'Emergency Response', href: '#emergency', style: 'secondary' }
          ]
        },
        design: {
          theme: 'security',
          backgroundColor: 'bg-slate-900/95 backdrop-blur-sm',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Defend Your Digital Empire Against Advanced Threats',
          subtitle: 'Enterprise-grade cybersecurity solutions that protect your most valuable assets. Our team of certified security experts provides 24/7 monitoring, incident response, and proactive threat hunting to keep your business secure in an increasingly dangerous digital landscape.',
          cta: 'Get Security Assessment',
          secondaryCta: 'View Threat Report',
          socialProof: '500+ enterprises protected • 99.9% threat detection rate • $2B+ in losses prevented',
          image: '/images/cybersecurity-operations-center.jpg',
          badges: [
            { label: 'SOC 2 Type II', color: 'emerald' },
            { label: '24/7 monitoring', color: 'red' },
            { label: 'Zero-day protection', color: 'blue' },
            { label: 'Compliance ready', color: 'purple' }
          ]
        },
        design: {
          theme: 'security',
          layout: 'split',
          backgroundColor: 'bg-gradient-to-br from-slate-900 via-red-900 to-orange-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'stats',
        content: {
          title: 'Proven Security Excellence',
          subtitle: 'Numbers that demonstrate our commitment to your protection',
          stats: [
            { value: '99.9%', label: 'Threat Detection Rate', icon: 'shield-check' },
            { value: '500+', label: 'Enterprises Protected', icon: 'building-2' },
            { value: '<2min', label: 'Average Response Time', icon: 'zap' },
            { value: '$2B+', label: 'Losses Prevented', icon: 'trending-up' },
          ],
        },
        design: {
          theme: 'security',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'features',
        content: {
          title: 'Comprehensive Security Solutions',
          subtitle: 'End-to-end protection for modern enterprises',
          features: [
            {
              icon: 'eye',
              title: '24/7 Security Operations Center',
              description: 'Round-the-clock monitoring by certified security analysts using advanced SIEM technology, machine learning, and threat intelligence to detect and respond to threats in real-time.'
            },
            {
              icon: 'shield',
              title: 'Advanced Threat Protection',
              description: 'Multi-layered defense including next-generation firewalls, endpoint detection and response (EDR), and behavioral analysis to stop sophisticated attacks before they cause damage.'
            },
            {
              icon: 'search',
              title: 'Proactive Threat Hunting',
              description: 'Expert security researchers actively search for hidden threats in your environment using advanced analytics and threat intelligence to identify attacks that bypass traditional security tools.'
            },
            {
              icon: 'alert-triangle',
              title: 'Incident Response & Recovery',
              description: 'Rapid incident response team with forensic capabilities to contain breaches, minimize damage, and restore operations quickly while preserving evidence for legal proceedings.'
            },
            {
              icon: 'file-check',
              title: 'Compliance Management',
              description: 'Comprehensive compliance support for SOX, HIPAA, PCI-DSS, GDPR, and other regulations with automated reporting and continuous monitoring to maintain certification.'
            },
            {
              icon: 'users',
              title: 'Security Awareness Training',
              description: 'Interactive training programs and simulated phishing campaigns to educate employees and create a security-conscious culture that serves as your first line of defense.'
            }
          ]
        },
        design: {
          theme: 'security',
          layout: 'default',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'process',
        content: {
          title: 'Our Security Implementation Process',
          subtitle: 'Proven methodology for comprehensive security transformation',
          steps: [
            {
              number: '01',
              title: 'Security Assessment',
              description: 'Comprehensive evaluation of your current security posture, identifying vulnerabilities, gaps, and compliance requirements.',
              icon: 'search',
              deliverables: ['Risk assessment report', 'Vulnerability scan', 'Compliance gap analysis'],
              timeline: '1-2 weeks'
            },
            {
              number: '02',
              title: 'Strategy Development',
              description: 'Custom security strategy and roadmap aligned with your business objectives and regulatory requirements.',
              icon: 'map',
              deliverables: ['Security strategy', 'Implementation roadmap', 'Budget planning'],
              timeline: '1 week'
            },
            {
              number: '03',
              title: 'Solution Deployment',
              description: 'Implementation of security technologies and processes with minimal business disruption and comprehensive testing.',
              icon: 'settings',
              deliverables: ['Security tools deployment', 'Process implementation', 'Integration testing'],
              timeline: '2-6 weeks'
            },
            {
              number: '04',
              title: 'Team Training',
              description: 'Comprehensive training for your IT team and end users to ensure effective security tool utilization and awareness.',
              icon: 'graduation-cap',
              deliverables: ['Technical training', 'User awareness program', 'Documentation'],
              timeline: '1-2 weeks'
            },
            {
              number: '05',
              title: 'Ongoing Management',
              description: 'Continuous monitoring, threat hunting, and security optimization to maintain peak protection levels.',
              icon: 'shield-check',
              deliverables: ['24/7 monitoring', 'Monthly reports', 'Continuous improvement'],
              timeline: 'Ongoing'
            }
          ]
        },
        design: {
          theme: 'security',
          backgroundColor: 'bg-slate-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'testimonials',
        content: {
          title: 'Trusted by Security-Conscious Leaders',
          subtitle: 'Hear from CISOs and executives who chose CyberShield Pro',
          testimonials: [
            {
              quote: 'CyberShield Pro transformed our security posture completely. Their 24/7 SOC detected and stopped three major attacks that our previous solution missed entirely. The ROI was immediate and substantial.',
              author: 'David Chen',
              role: 'CISO, TechCorp Industries',
              image: '/images/testimonial-david-chen-ciso.jpg',
              company: 'Fortune 500 Manufacturing',
              results: '3 major attacks prevented, 60% faster response times'
            },
            {
              quote: 'The compliance support alone saved us hundreds of thousands in potential fines. Their team understands both security and business requirements, making them true partners in our success.',
              author: 'Sarah Martinez',
              role: 'VP of Risk Management, FinanceFirst',
              image: '/images/testimonial-sarah-martinez.jpg',
              company: 'Financial Services',
              results: 'Full SOX compliance, zero security incidents'
            },
            {
              quote: 'When we had a security incident, CyberShield Pro\'s response was flawless. They contained the threat in minutes and had us back online with zero data loss. Their expertise is unmatched.',
              author: 'Michael Thompson',
              role: 'CTO, HealthTech Solutions',
              image: '/images/testimonial-michael-thompson-cto.jpg',
              company: 'Healthcare Technology',
              results: 'Zero data loss, 2-minute incident response'
            }
          ],
        },
        design: {
          theme: 'security',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'pricing',
        content: {
          title: 'Security Investment Plans',
          subtitle: 'Flexible security solutions that scale with your business',
          plans: [
            {
              name: 'Essential Protection',
              price: '$5,000',
              frequency: '/month',
              description: 'Core security monitoring and response for small to medium businesses',
              features: [
                '24/7 security monitoring',
                'Threat detection and alerts',
                'Basic incident response',
                'Monthly security reports',
                'Email and phone support',
                'Compliance dashboard'
              ],
              cta: 'Start Protection',
              popular: false,
              bestFor: 'Small to Medium Businesses'
            },
            {
              name: 'Advanced Defense',
              price: '$15,000',
              frequency: '/month',
              description: 'Comprehensive security suite with proactive threat hunting',
              features: [
                'Everything in Essential',
                'Proactive threat hunting',
                'Advanced endpoint protection',
                'Security awareness training',
                'Dedicated security analyst',
                'Quarterly security assessments',
                'Priority incident response',
                'Compliance reporting'
              ],
              cta: 'Upgrade Defense',
              popular: true,
              badge: 'Most Popular',
              roi: 'Average 300% ROI within 12 months'
            },
            {
              name: 'Enterprise Shield',
              price: 'Custom',
              frequency: '',
              description: 'Full-scale security operations for large enterprises',
              features: [
                'Everything in Advanced Defense',
                'Dedicated SOC team',
                'Custom security solutions',
                'Executive security briefings',
                'Regulatory compliance support',
                'Forensic investigation services',
                'Security architecture consulting',
                'Unlimited incident response'
              ],
              cta: 'Contact Security Team',
              popular: false,
              enterprise: true,
              guarantee: 'SLA-backed response times'
            }
          ],
          additionalInfo: {
            assessment: 'Free security assessment included',
            setup: 'No setup fees or long-term contracts',
            support: '24/7 emergency response included'
          }
        },
        design: {
          theme: 'security',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'accordion',
        content: {
          title: 'Security Questions Answered',
          subtitle: 'Everything you need to know about enterprise cybersecurity',
          items: [
            {
              question: 'How quickly can you detect and respond to security threats?',
              answer: 'Our advanced SIEM and machine learning systems detect threats in real-time, with an average response time of under 2 minutes. Our 24/7 SOC team immediately investigates alerts and initiates containment procedures. For critical threats, we have automated response capabilities that can isolate affected systems within seconds.'
            },
            {
              question: 'What compliance frameworks do you support?',
              answer: 'We support all major compliance frameworks including SOX, HIPAA, PCI-DSS, GDPR, ISO 27001, NIST, and industry-specific regulations. Our compliance experts help maintain continuous compliance with automated reporting, regular assessments, and remediation guidance to ensure you pass audits consistently.'
            },
            {
              question: 'How do you handle security incidents and breaches?',
              answer: 'Our incident response follows a proven methodology: immediate containment, forensic investigation, evidence preservation, stakeholder communication, and recovery planning. We have legal and PR partnerships for breach notification requirements and work with law enforcement when necessary. Our goal is to minimize damage and restore operations quickly.'
            },
            {
              question: 'What makes your threat detection different from other solutions?',
              answer: 'We combine advanced AI/ML algorithms with human expertise for superior threat detection. Our threat hunters proactively search for hidden threats using behavioral analysis and threat intelligence. We also leverage global threat data and zero-day vulnerability research to stay ahead of emerging threats that traditional tools miss.'
            },
            {
              question: 'Can you integrate with our existing security tools?',
              answer: 'Yes, we integrate with 200+ security tools and platforms including existing SIEM, firewalls, endpoint protection, and cloud security solutions. Our platform serves as a central hub that enhances your current investments while filling security gaps. We provide APIs and custom integrations as needed.'
            },
            {
              question: 'What is your approach to employee security training?',
              answer: 'We provide comprehensive security awareness training including interactive modules, simulated phishing campaigns, and role-specific training. Our programs are updated regularly with current threat intelligence and include metrics tracking to measure effectiveness. We also provide executive briefings and board-level security reporting.'
            }
          ],
        },
        design: {
          theme: 'security',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: 'cta',
        content: {
          title: 'Secure Your Digital Future Today',
          subtitle: 'Don\'t wait for a breach to take security seriously. Protect your business now.',
          description: 'Schedule a free security assessment with our certified experts to identify vulnerabilities and develop a comprehensive protection strategy. Every day you wait is another opportunity for cybercriminals to strike.',
          primaryCta: 'Get Free Assessment',
          secondaryCta: 'Emergency Response',
          benefits: [
            'Free comprehensive security assessment',
            'Custom threat analysis report',
            'No obligation consultation',
            '24/7 emergency response available'
          ],
          urgency: 'Cyber attacks happen every 39 seconds - Act now',
          socialProof: 'Trusted by 500+ enterprises worldwide'
        },
        design: {
          theme: 'security',
          backgroundColor: 'bg-gradient-to-r from-red-900 via-slate-900 to-black',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: 'footer',
        content: {
          title: 'CyberShield Pro',
          description: 'Enterprise cybersecurity that never sleeps',
          copyright: '© 2025 CyberShield Pro. All rights reserved.',
          links: [
            { label: 'Security Center', href: '/security' },
            { label: 'Threat Intelligence', href: '/threats' },
            { label: 'Compliance', href: '/compliance' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Careers', href: '/careers' }
          ],
          social: [
            { platform: 'linkedin', url: 'https://linkedin.com/company/cybershieldpro' },
            { platform: 'twitter', url: 'https://twitter.com/cybershieldpro' }
          ],
          contact: {
            email: 'security@cybershieldpro.com',
            phone: '+1 (555) CYBER-911',
            emergency: '24/7 Emergency Hotline: +1 (555) 911-HACK'
          },
          certifications: ['SOC 2 Type II', 'ISO 27001', 'CISSP Certified Team']
        },
        design: {
          theme: 'security',
          backgroundColor: 'bg-slate-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  // ---Advisory Studio Pro Template--- //
  {
    id: 'advisory-enhanced',
    title: 'Advisory Studio Pro',
    description: 'Elite consulting template with advanced components and premium conversion optimization for high-end strategic advisory firms.',
    image: '/images/advisory-hero-premium.jpg',
    hint: 'Premium consulting template with advanced social proof, interactive elements, and sophisticated conversion funnels designed for $1M+ revenue consulting practices.',
    aiInsight: 'Engineered for maximum authority positioning and lead generation with psychological triggers and trust-building elements.',
    stats: {
      visitors: '12.3k',
      leads: '1,847',
      conversion: '15.2%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'Advisory Studio',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4L44 14v20L24 44L4 34V14L24 4z" fill="currentColor"/><path d="M24 12L36 18v12L24 36L12 30V18L24 12z" fill="white"/><circle cx="24" cy="24" r="4" fill="currentColor"/></svg>`
          },
          links: [
            { label: 'Solutions', href: '#solutions' },
            { label: 'Case Studies', href: '#cases' },
            { label: 'Leadership', href: '#team' },
            { label: 'Insights', href: '#resources' },
            { label: 'Contact', href: '#contact' },
          ],
          actions: [
            { label: 'Executive Briefing', href: '#cta', style: 'primary' },
            { label: 'ROI Calculator', href: '#calculator', style: 'secondary' }
          ],
          announcement: {
            text: 'New: AI-Powered Strategic Planning Framework',
          }
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-white/95',
          textColor: 'text-gray-900',
          shadow: { enabled: true, blur: 10, color: 'rgba(0,0,0,0.05)' },
          position: { type: 'sticky', top: 0, zIndex: 50 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Transform Uncertainty Into Competitive Advantage',
          cta: 'Schedule Executive Briefing',
          ctaUrl: '#executive-briefing',
          secondaryCta: 'View Success Stories',
          secondaryCtaUrl: '#portfolio',
          socialProof: 'Trusted by 347+ Fortune 500 CEOs & Board Members',
          image: '/images/consulting-hero-premium.jpg',
          badges: [
            { label: 'Complimentary Strategic Assessment', color: 'emerald', icon: 'gift' },
            { label: '99.2% Client Retention Rate', color: 'blue', icon: 'star' },
            { label: 'Average 340% ROI', color: 'amber', icon: 'trending-up' }
          ],
          metrics: [
            { value: '$8.7B', label: 'Value Created' },
            { value: '347+', label: 'Transformations' },
            { value: '23', label: 'Countries' }
          ]
        },
        design: {
          theme: 'luxury',
          layout: 'split',
          backgroundColor: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
          textColor: 'text-white',
          animation: { type: 'fadeIn', duration: 1200 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'socialProof',
        content: {
          title: 'Endorsed by Global Leaders',
          subtitle: 'When the world\'s most influential executives need results, they call us',
          testimonials: [
            {
              quote: 'Advisory Studio doesn\'t just provide strategy—they architect the future of your business.',
              author: 'Marc Benioff',
              role: 'CEO, Salesforce',
              company: 'Salesforce'
            },
            {
              quote: 'The most sophisticated strategic thinking I\'ve encountered in 25 years.',
              author: 'Reed Hastings',
              role: 'Co-Founder, Netflix',
              company: 'Netflix'
            }
          ],
          logos: [
            { name: 'Fortune 500 Badge', logo: '/images/fortune-500-badge.svg' },
            { name: 'Harvard Business Review', logo: '/images/hbr-logo.svg' },
            { name: 'McKinsey Alumni', logo: '/images/mckinsey-alumni.svg' }
          ]
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-slate-50',
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
        id: 4,
        type: 'brands',
        content: {
          title: 'Trusted by Industry Titans',
          subtitle: 'The companies shaping tomorrow choose Advisory Studio',
          brands: [
            { name: 'Apple', logo: '/images/brand-apple.svg' },
            { name: 'Google', logo: '/images/brand-google.svg' },
            { name: 'Microsoft', logo: '/images/brand-microsoft.svg' },
            { name: 'Tesla', logo: '/images/brand-tesla.svg' },
            { name: 'Goldman Sachs', logo: '/images/brand-goldman.svg' },
            { name: 'JPMorgan', logo: '/images/brand-jpmorgan.svg' },
            { name: 'Berkshire Hathaway', logo: '/images/brand-berkshire.svg' },
            { name: 'Amazon', logo: '/images/brand-amazon.svg' }
          ],
          animation: { type: 'slideInLeft', duration: 800 }
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-white',
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
        id: 5,
        type: 'counter',
        content: {
          title: 'Impact That Speaks Volumes',
          counters: [
            {
              value: 347,
              label: 'Global Transformations',
              icon: 'globe',
              suffix: '+',
              description: 'Across 6 continents'
            },
            {
              value: 8.7,
              label: 'Billion in Value Created',
              icon: 'trending-up',
              prefix: '$',
              suffix: 'B',
              description: 'Measurable client impact'
            },
            {
              value: 99.2,
              label: 'Client Retention Rate',
              icon: 'heart',
              suffix: '%',
              description: 'Industry-leading loyalty'
            },
            {
              value: 340,
              label: 'Average ROI',
              icon: 'target',
              suffix: '%',
              description: 'Within 18 months'
            }
          ]
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-gradient-to-r from-emerald-50 to-teal-50',
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
        id: 6,
        type: 'features',
        content: {
          title: 'Strategic Mastery Across Every Dimension',
          features: [
            {
              icon: 'chess-king',
              title: 'CEO Strategy & Vision',
              description: 'Board-level strategic architecture and market positioning that positions you 3 moves ahead of competition',
            },
            {
              icon: 'rocket',
              title: 'Digital Transformation 2.0',
              description: 'AI-powered transformation strategies that create exponential value and sustainable competitive advantages'
            },
            {
              icon: 'brain',
              title: 'Advanced Analytics & AI',
              description: 'Predictive intelligence and machine learning strategies that transform data into decisive action',
            },
            {
              icon: 'network',
              title: 'Ecosystem Orchestration',
              description: 'Strategic partnerships and platform business models that multiply your market reach',
            },
            {
              icon: 'shield-check',
              title: 'Risk Intelligence',
              description: 'Proactive risk management and scenario planning that turns uncertainty into opportunity',
            },
            {
              icon: 'world',
              title: 'Global Market Mastery',
              description: 'International expansion strategies with cultural intelligence and regulatory expertise',
            }
          ]
        },
        design: {
          theme: 'luxury',
          layout: 'default',
          backgroundColor: 'bg-white',
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
        id: 7,
        type: 'process',
        content: {
          title: 'The Advisory Studio Methodology',
          steps: [
            {
              number: '01',
              title: 'Strategic X-Ray',
              description: 'Deep forensic analysis of your business architecture, competitive landscape, and hidden value opportunities',
              duration: '2-3 weeks',
              deliverables: ['Strategic assessment', 'Competitive analysis', 'Value opportunity map']
            },
            {
              number: '02',
              title: 'Future-Back Design',
              description: 'Co-create breakthrough strategies using our proprietary future-back methodology and scenario planning',
              duration: '3-4 weeks',
              deliverables: ['Strategic blueprint', 'Scenario models', 'Innovation roadmap']
            },
            {
              number: '03',
              title: 'Execution Architecture',
              description: 'Detailed implementation roadmap with success metrics, resource allocation, and risk mitigation',
              duration: '2-3 weeks',
              deliverables: ['Implementation plan', 'Success metrics', 'Resource allocation']
            },
            {
              number: '04',
              title: 'Transformation Acceleration',
              description: 'Hands-on execution support with real-time course correction and performance optimization',
              duration: '6-12 months',
              deliverables: ['Weekly progress reports', 'Monthly strategic reviews', 'Quarterly optimization']
            },
            {
              number: '05',
              title: 'Value Amplification',
              description: 'Continuous improvement and value multiplication through advanced analytics and market intelligence',
              duration: 'Ongoing',
              deliverables: ['Performance dashboards', 'Market intelligence', 'Strategic updates']
            }
          ]
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-slate-50',
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
        id: 8,
        type: 'team',
        content: {
          title: 'Meet the Strategic Architects',
          subtitle: 'Former C-suite executives and top-tier consultants who\'ve shaped global markets',
          members: [
            {
              name: 'Victoria Sterling',
              role: 'Founding Partner & CEO',
              image: '/images/team-victoria.jpg',
              credentials: ['Harvard MBA', 'CFA', 'Former McKinsey Senior Partner'],
              specialties: ['CEO Strategy', 'M&A', 'Board Advisory'],
              linkedin: 'https://linkedin.com/in/victoriastarling',
            },
            {
              name: 'Dr. Alexander Chen',
              role: 'Chief Technology Officer',
              image: '/images/team-alexander.jpg',
              credentials: ['Stanford PhD', 'MIT AI Fellow', 'Former Google VP'],
              specialties: ['AI Strategy', 'Digital Transformation', 'Technology Architecture'],
              linkedin: 'https://linkedin.com/in/alexanderchen',
            },
            {
              name: 'Isabella Rodriguez',
              role: 'Global Managing Partner',
              image: '/images/team-isabella.jpg',
              credentials: ['Wharton MBA', 'Former Bain Senior Partner', 'Certified Change Leader'],
              specialties: ['Change Management', 'Culture Transformation', 'Leadership Development'],
              linkedin: 'https://linkedin.com/in/isabellarodriguez',
            },
            {
              name: 'Marcus Thompson',
              role: 'Head of Financial Strategy',
              bio: 'Former Goldman Sachs Managing Director and BlackRock Portfolio Manager. M&A and capital markets expert.',
              image: '/images/team-marcus.jpg',
              credentials: ['Harvard MBA', 'CFA', 'Former Goldman Sachs MD'],
              specialties: ['M&A Strategy', 'Capital Markets', 'Financial Engineering'],
              linkedin: 'https://linkedin.com/in/marcusthompson',
              achievements: '$100B+ in M&A transactions'
            }
          ]
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-white',
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
        id: 9,
        type: 'testimonials',
        content: {
          title: 'Voices of Transformation',
          subtitle: 'CEOs and Board Members share their Advisory Studio experience',
          testimonials: [
            {
              quote: 'Advisory Studio didn\'t just transform our strategy—they transformed our entire industry. Their insights led to a 500% increase in market value within 24 months.',
              author: 'Sarah Chen',
              role: 'CEO & Chairman',
              company: 'TechNova Global',
              image: '/images/testimonial-sarah.jpg',
            },
            {
              quote: 'The most sophisticated strategic thinking I\'ve encountered. They see opportunities where others see obstacles.',
              author: 'David Park',
              role: 'Founding CEO',
              company: 'QuantumLeap Ventures',
              image: '/images/testimonial-david.jpg',
            },
            {
              quote: 'Exceptional strategic guidance that transformed our entire business model.',
              author: 'Elena Vasquez',
              role: 'Chief Executive Officer',
              company: 'NextGen Manufacturing',
              image: '/images/testimonial-elena.jpg',
            }
          ]
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-gradient-to-r from-slate-900 to-slate-800',
          textColor: 'text-white',
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
        id: 10,
        type: 'portfolio',
        content: {
          title: 'Transformation Case Studies',
          subtitle: 'Real strategies, extraordinary results, measurable impact',
          projects: [
            {
              title: 'AI-Powered Fortune 100 Transformation',
              category: 'Digital Transformation',
              description: 'Architected comprehensive AI integration strategy for global technology leader, resulting in industry-leading automation and market expansion.',
            },
            {
              title: 'Global Financial Services Expansion',
              category: 'Market Strategy',
              image: '/images/case-global-expansion.jpg'
            },
            {
              title: 'Healthcare Innovation Platform',
              category: 'Innovation Strategy',
              description: 'Created breakthrough healthcare platform strategy connecting patients, providers, and payers in revolutionary ecosystem.',
              image: '/images/case-healthcare-platform.jpg'
            }
          ]
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-slate-50',
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
        id: 11,
        type: 'metrics',
        content: {
          title: 'Performance Benchmarks',
          subtitle: 'Industry-leading results across all engagement types',
          categories: [
            {
              name: 'Strategy Development',
              metrics: [
                { label: 'Average Revenue Growth', value: '340%', benchmark: 'Industry: 15%' },
                { label: 'Market Share Increase', value: '28%', benchmark: 'Industry: 3%' },
                { label: 'Strategic Goal Achievement', value: '96%', benchmark: 'Industry: 67%' }
              ]
            },
            {
              name: 'Digital Transformation',
              metrics: [
                { label: 'Cost Reduction', value: '45%', benchmark: 'Industry: 12%' },
                { label: 'Process Automation', value: '78%', benchmark: 'Industry: 25%' },
                { label: 'Digital Adoption Rate', value: '92%', benchmark: 'Industry: 54%' }
              ]
            },
            {
              name: 'Change Management',
              metrics: [
                { label: 'Employee Adoption', value: '94%', benchmark: 'Industry: 58%' },
                { label: 'Timeline Adherence', value: '98%', benchmark: 'Industry: 73%' },
                { label: 'Transformation Success', value: '91%', benchmark: 'Industry: 45%' }
              ]
            }
          ]
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-white',
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
        id: 12,
        type: 'pricing',
        content: {
          title: 'Strategic Investment Options',
          subtitle: 'Customized engagement models designed for maximum ROI',
          plans: [
            {
              name: 'Strategic Blueprint',
              price: '$75,000',
              frequency: 'comprehensive assessment',
              description: 'Deep-dive strategic analysis with actionable roadmap and implementation framework',
              features: [
                'C-suite strategic assessment',
                'Competitive intelligence analysis',
                'Market opportunity mapping',
                'Strategic roadmap development',
                'Board presentation materials',
                'Executive team workshops'
              ],
              cta: 'Get Strategic Blueprint',
              popular: false,
              timeline: '6-8 weeks'
            },
            {
              name: 'Transformation Accelerator',
              price: '$350,000',
              frequency: '12-month engagement',
              features: [
                'Everything in Strategic Blueprint',
                'Weekly strategic sessions',
                'Monthly board reporting',
                'Change management support',
                'Performance tracking dashboard',
                'Quarterly strategy optimization'
              ],
              cta: 'Launch Transformation',
              popular: true,
              guarantee: 'ROI guarantee or extended engagement',
              timeline: '12-18 months'
            },
            {
              name: 'Strategic Partnership',
              price: 'Custom',
              frequency: 'ongoing advisory',
              description: 'Long-term strategic partnership with dedicated advisory team and priority access',
              features: [
                'Dedicated Senior Partner',
                'Monthly strategic reviews',
                'Quarterly market intelligence',
                'Annual strategic planning',
                'Crisis management support',
                'Board advisory services',
                'Priority access to all experts',
                'Custom research projects',
                'Industry benchmarking'
              ],
              cta: 'Explore Partnership',
              popular: false,
              guarantee: 'Flexible terms and guaranteed availability',
              timeline: 'Ongoing'
            }
          ]
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-gradient-to-br from-slate-50 to-slate-100',
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
        id: 13,
        type: 'faq',
        content: {
          title: 'Executive Questions & Answers',
          subtitle: 'Insights from two decades of C-suite advisory experience',
          faqs: [
            {
              question: 'How do you ensure ROI on strategic investments?',
              answer: 'We establish clear success metrics and ROI targets at engagement outset. Our average client achieves 340% ROI within 18 months. We provide monthly progress reports and quarterly strategic reviews to ensure continuous value creation. If targets aren\'t met, we extend engagement at no additional cost.',
              category: 'Investment'
            },
            {
              question: 'What makes your approach different from other consulting firms?',
              category: 'Approach'
            },
            {
              question: 'How do you handle confidentiality and competitive intelligence?',
              answer: 'We maintain the highest levels of confidentiality with comprehensive NDAs and ethical walls. Our team includes former intelligence analysts and we use military-grade security protocols. We never work with direct competitors simultaneously within the same engagement period.',
              category: 'Security'
            },
            {
              category: 'Commitment'
            },
            {
              question: 'How do you measure success beyond financial metrics?',
              category: 'Metrics'
            }
          ]
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-white',
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
        id: 14,
        type: 'cta',
        content: {
          title: 'Ready to Architect Your Strategic Future?',
          description: 'Schedule a confidential executive briefing with our founding partners. We\'ll provide immediate strategic insights and explore how Advisory Studio can accelerate your most ambitious goals.',
          primaryCta: 'Schedule Executive Briefing',
          primaryCtaUrl: '#executive-briefing',
          secondaryCta: 'Download Transformation Guide',
          features: [
            'Complimentary 90-minute strategic session',
            'Custom opportunity assessment worth $25,000',
            'Immediate actionable insights',
            'No sales pressure guarantee',
            'Access to proprietary strategic frameworks'
          ],
          urgency: 'Limited to 12 executive briefings per month',
          socialProof: 'Join executives from Apple, Google, Tesla, and 344 other industry leaders'
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900',
          textColor: 'text-white',
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
        id: 15,
        type: 'contact',
        content: {
          title: 'Connect with Strategic Leaders',
          contactInfo: {
            phone: '+1 (555) 247-EDGE',
            email: 'executive@advisorystudio.com',
            address: 'One World Trade Center, New York, NY 10007'
          },
          offices: [
            {
              city: 'New York',
              address: 'One World Trade Center, NY 10007',
              phone: '+1 (555) 247-EDGE',
              description: 'Global headquarters and Americas operations'
            },
            {
              city: 'London',
              address: '30 St Mary Axe, London EC3A 8EP',
              phone: '+44 20 7946 0958',
              description: 'European and EMEA operations'
            },
            {
              city: 'Singapore',
              address: 'Marina Bay Financial Centre, Singapore 018982',
              phone: '+65 6808 5430',
              description: 'Asia-Pacific and emerging markets'
            }
          ],
          form: {
            title: 'Executive Briefing Request',
            description: 'All information is confidential and secure',
            fields: [
              { type: 'text', name: 'name', label: 'Full Name', required: true },
              { type: 'email', name: 'email', label: 'Email Address', required: true },
              { type: 'text', name: 'title', label: 'Title', required: true },
              { type: 'text', name: 'company', label: 'Company', required: true },
              { type: 'select', name: 'revenue', label: 'Annual Revenue', options: ['$10M-$50M', '$50M-$250M', '$250M-$1B', '$1B+'], required: true },
              { type: 'textarea', name: 'challenge', label: 'Strategic Challenge', required: true }
            ],
            submitText: 'Request Executive Briefing',
            privacy: 'We respect your privacy and will never share your information'
          }
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-slate-50',
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
        id: 16,
        type: 'footer',
        content: {
          title: 'Advisory Studio',
          tagline: 'Where visionary leaders architect tomorrow',
          links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Executive Careers', href: '/careers' },
            { label: 'Strategic Insights', href: '/insights' },
            { label: 'Media Kit', href: '/media' }
          ],
          social: [
            { platform: 'linkedin', url: 'https://linkedin.com/company/advisorystudio' },
            { platform: 'twitter', url: 'https://twitter.com/advisorystudio' },
            { platform: 'youtube', url: 'https://youtube.com/advisorystudio' }
          ],
          contact: {
            email: 'executive@advisorystudio.com',
            phone: '+1 (555) 247-EDGE'
          },
          certifications: [
            { name: 'ISO 27001', image: '/images/iso-27001.svg' },
            { name: 'SOC 2 Type II', image: '/images/soc2.svg' },
            { name: 'Harvard Business Review', image: '/images/hbr-badge.svg' }
          ]
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-slate-900',
          textColor: 'text-white',
          padding: { top: 80, bottom: 40 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },

  // --- Vibrant E-Commerce Template --- //
  {
    id: 'ecommerce-vibrant',
    title: 'Neon Marketplace',
    description: 'A bold, colorful e-commerce template with vibrant design and modern aesthetics.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    hint: 'High-energy e-commerce template with bold colors, dynamic layouts, and youth-focused design.',
    aiInsight: 'Optimized for Gen Z and millennial shoppers with vibrant colors, social proof, and mobile-first design.',
    stats: {
      visitors: '52k',
      leads: '9.8k',
      conversion: '19.1%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'NEON',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8L40 16v16L24 40L8 32V16L24 8z" fill="currentColor"/><path d="M24 14L34 18v10L24 34L14 28V18L24 14z" fill="white"/></svg>`
          },
          links: [
            { label: 'New Drops', href: '#new' },
            { label: 'Trending', href: '#trending' },
            { label: 'Sale', href: '#sale' },
            { label: 'Brands', href: '#brands' },
            { label: 'Community', href: '#community' }
          ],
          actions: [
            { label: 'Join VIP Club', href: '#vip', style: 'primary' },
            { label: 'Cart (0)', href: '#cart', style: 'secondary' }
          ]
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-gradient-to-r from-pink-500 to-purple-600',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Express Your Vibe. Own Your Style.',
          subtitle: 'Discover the hottest streetwear, limited drops, and exclusive collabs. Free shipping worldwide + 30-day returns.',
          cta: 'Shop New Drops',
          secondaryCta: 'Join VIP Club',
          socialProof: '2M+ style creators worldwide',
          image: '/images/neon-hero.jpg',
          badges: [
            { label: 'Free worldwide shipping', color: 'cyan' },
            { label: 'Limited edition drops', color: 'pink' },
            { label: 'VIP early access', color: 'purple' }
          ]
        },
        design: {
          theme: 'energetic',
          layout: 'full-width-image',
          backgroundColor: 'bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'brands',
        content: {
          title: 'Exclusive Brand Collabs',
          subtitle: 'Limited drops from your favorite creators',
          brands: [
            { name: 'Supreme', logo: '/images/brand-supreme.png' },
            { name: 'Off-White', logo: '/images/brand-offwhite.png' },
            { name: 'Kith', logo: '/images/brand-kith.png' },
            { name: 'Fear of God', logo: '/images/brand-fog.png' },
            { name: 'Stone Island', logo: '/images/brand-stoneisland.png' },
            { name: 'A Bathing Ape', logo: '/images/brand-bape.png' },
          ],
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-gray-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'stats',
        content: {
          title: 'The Numbers Speak',
          subtitle: 'Join the global style movement',
          stats: [
            { value: '2M+', label: 'Style Creators', icon: 'users' },
            { value: '4.9/5', label: 'Hype Rating', icon: 'fire' },
            { value: '24/7', label: 'Drop Alerts', icon: 'bell' },
            { value: '500K+', label: 'Items Sold', icon: 'shopping-bag' },
          ],
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'gallery',
        content: {
          title: 'Latest Drops',
          subtitle: 'Fresh styles dropping daily',
          images: [
            { src: '/images/drop-hoodie.jpg', alt: 'Neon Hoodie', category: 'Streetwear', price: '$120' },
            { src: '/images/drop-sneakers.jpg', alt: 'Cyber Sneakers', category: 'Footwear', price: '$250' },
            { src: '/images/drop-jacket.jpg', alt: 'Tech Jacket', category: 'Outerwear', price: '$180' },
            { src: '/images/drop-accessories.jpg', alt: 'Glow Accessories', category: 'Accessories', price: '$45' },
            { src: '/images/drop-pants.jpg', alt: 'Cargo Pants', category: 'Bottoms', price: '$95' },
            { src: '/images/drop-bag.jpg', alt: 'Cyber Backpack', category: 'Bags', price: '$85' },
          ],
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-gray-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'features',
        content: {
          title: 'Why Choose NEON',
          subtitle: 'More than just shopping - it\'s a lifestyle',
          features: [
            {
              icon: 'lightning',
              title: 'Lightning Fast Drops',
              description: 'Get notified instantly when new limited items drop. First come, first served.'
            },
            {
              icon: 'globe',
              title: 'Global Community',
              description: 'Connect with 2M+ style creators worldwide. Share fits, get inspired.'
            },
            {
              icon: 'shield',
              title: 'Authenticity Guaranteed',
              description: 'Every item verified authentic. 100% genuine or your money back.'
            },
            {
              icon: 'truck',
              title: 'Express Delivery',
              description: 'Free worldwide shipping. Express delivery available for urgent fits.'
            }
          ]
        },
        design: {
          theme: 'energetic',
          layout: 'default',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'testimonials',
        content: {
          title: 'What Creators Say',
          subtitle: 'Real reviews from real style creators',
          testimonials: [
            {
              quote: 'NEON is where I find the most exclusive pieces. The community is amazing and the drops are always fire!',
              author: '@styleking_jay',
              role: '2.3M followers',
              image: '/images/creator-jay.jpg',
              rating: 5
            },
            {
              quote: 'Best place for authentic streetwear. Fast shipping and the VIP club gets you early access to everything.',
              author: '@fashion_nova_girl',
              role: '1.8M followers',
              image: '/images/creator-nova.jpg',
              rating: 5
            },
            {
              quote: 'The quality is insane and the prices are fair. Plus the community features help me discover new styles.',
              author: '@urban_explorer',
              role: '950K followers',
              image: '/images/creator-urban.jpg',
              rating: 5
            }
          ]
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-gradient-to-r from-cyan-500 to-purple-600',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'cta',
        content: {
          title: 'Ready to Level Up Your Style?',
          subtitle: 'Join the VIP club for exclusive drops and early access',
          primaryCta: 'Join VIP Club',
          secondaryCta: 'Shop Now',
          features: [
            { title: 'Early access to drops', description: '24h before everyone else' },
            { title: 'Exclusive VIP discounts', description: 'Up to 30% off select items' },
            { title: 'Free express shipping', description: 'On all VIP orders' }
          ]
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: 'footer',
        content: {
          title: 'NEON',
          description: 'Where style meets culture',
          links: [
            { label: 'Size Guide', href: '/size-guide' },
            { label: 'Shipping', href: '/shipping' },
            { label: 'Returns', href: '/returns' },
            { label: 'Community', href: '/community' }
          ]
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-gray-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      }
    ]
  },
  // ---Style Hub E-Commerce Template --- //
  {
    id: 'ecommerce',
    title: 'StyleHub Store', description: 'Premium e-commerce template with advanced product showcase and conversion optimization.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    hint: 'High-converting e-commerce template with product galleries, reviews, and streamlined checkout flow.',
    aiInsight: 'Optimized for mobile commerce with social proof, urgency elements, and trust signals that increase conversion rates by 40%.',
    stats: {
      visitors: '45k',
      leads: '8.2k',
      conversion: '18.2%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'StyleHub',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8L40 16v16L24 40L8 32V16L24 8z" fill="currentColor"/><path d="M24 14L34 18v10L24 34L14 28V18L24 14z" fill="white"/></svg>`
          },
          links: [
            { label: 'Shop', href: '#shop' },
            { label: 'Collections', href: '#collections' },
            { label: 'Sale', href: '#sale' },
            { label: 'About', href: '#about' },
            { label: 'Reviews', href: '#reviews' }
          ],
          actions: [
            { label: 'Sign Up & Save 15%', href: '#newsletter', style: 'primary' },
            { label: 'Account', href: '#account', style: 'secondary' }
          ]
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Discover Your Perfect Style',
          subtitle: 'Curated collections from top designers and brands. Enjoy free shipping on orders over $75 and hassle-free returns.',
          cta: 'Shop Now',
          secondaryCta: 'Explore Collections',
          socialProof: 'Join 50,000+ satisfied customers',
          image: '/images/ecommerce-hero.jpg',
          badges: [
            { label: 'Free shipping over $75', color: 'green' },
            { label: '30-day returns', color: 'blue' },
            { label: 'Secure checkout', color: 'purple' }
          ]
        },
        design: {
          theme: 'modern',
          layout: 'split',
          backgroundColor: 'bg-gradient-to-r from-pink-50 to-purple-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'brands',
        content: {
          title: 'Featured Brands',
          subtitle: 'Discover collections from world-renowned designers',
          brands: [
            { name: 'Gucci', logo: '/images/brand-gucci.png' },
            { name: 'Prada', logo: '/images/brand-prada.png' },
            { name: 'Versace', logo: '/images/brand-versace.png' },
            { name: 'Armani', logo: '/images/brand-armani.png' },
            { name: 'Dolce & Gabbana', logo: '/images/brand-dg.png' },
            { name: 'Valentino', logo: '/images/brand-valentino.png' },
          ],
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'stats',
        content: {
          title: 'Why Choose StyleHub',
          subtitle: 'Numbers that speak for our quality',
          stats: [
            { value: '50,000+', label: 'Happy Customers', icon: 'users' },
            { value: '4.9/5', label: 'Customer Rating', icon: 'star' },
            { value: '24/7', label: 'Customer Support', icon: 'headphones' },
            { value: '1M+', label: 'Products Sold', icon: 'shopping-bag' },
          ],
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'gallery',
        content: {
          title: 'New Arrivals',
          subtitle: 'Fresh styles just dropped',
          images: [
            { src: '/images/product-1.jpg', alt: 'Summer Collection', category: 'Summer', price: '$89' },
            { src: '/images/product-2.jpg', alt: 'Business Casual', category: 'Work', price: '$129' },
            { src: '/images/product-3.jpg', alt: 'Evening Wear', category: 'Evening', price: '$199' },
            { src: '/images/product-4.jpg', alt: 'Weekend Comfort', category: 'Casual', price: '$69' },
            { src: '/images/product-5.jpg', alt: 'Accessories', category: 'Accessories', price: '$39' },
            { src: '/images/product-6.jpg', alt: 'Footwear', category: 'Shoes', price: '$159' },
          ],
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'reviews',
        content: {
          title: 'What Our Customers Say',
          subtitle: 'Real reviews from real customers',
          overallRating: 4.9,
          totalReviews: 12847,
          reviews: [
            {
              rating: 5,
              title: 'Amazing quality and fast shipping!',
              content: 'I ordered three dresses and they all fit perfectly. The fabric quality is outstanding and shipping was faster than expected.',
              author: 'Sarah M.',
              verified: true,
              date: '2 days ago',
              helpful: 23
            },
            {
              rating: 5,
              title: 'Best online shopping experience',
              content: 'Customer service is incredible. Had an issue with sizing and they resolved it immediately with free exchanges.',
              author: 'Jennifer L.',
              verified: true,
              date: '1 week ago',
              helpful: 18
            },
            {
              rating: 4,
              title: 'Great selection and prices',
              content: 'Love the variety of styles available. Prices are competitive and the quality exceeds expectations.',
              author: 'Maria R.',
              verified: true,
              date: '2 weeks ago',
              helpful: 15
            }
          ]
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'newsletter',
        content: {
          title: 'Stay in Style',
          subtitle: 'Get exclusive access to new collections, sales, and style tips',
          description: 'Join our fashion community and be the first to know about new arrivals, exclusive discounts, and styling advice from our experts.',
          features: [
            '15% off your first order',
            'Early access to sales',
            'Style tips and trends',
            'Exclusive member-only collections'
          ],
          placeholder: 'Enter your email address',
          buttonText: 'Join Now',
          privacyText: 'We respect your privacy. Unsubscribe at any time.'
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'features',
        content: {
          title: 'Why Shop With Us',
          subtitle: 'Premium experience. Unmatched value.',
          features: [
            {
              title: 'Curated Selections',
              description: 'Exclusive items from globally renowned and indie designers.'
            },
            {
              title: 'Free & Fast Shipping',
              description: 'Get your order fast with free shipping on purchases over $75.'
            },
            {
              title: 'Easy Returns',
              description: '30-day, no-hassle return policy with pre-paid labels.'
            },
            {
              title: 'Style Concierge',
              description: 'Get personal fashion advice from certified stylists.'
            }
          ]
        },
        design: {
          theme: 'modern',
          layout: 'default',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'collections',
        content: {
          title: 'Featured Collections',
          subtitle: 'Bestsellers hand-picked by our stylists',
          plans: [
            {
              name: 'Casual Essentials',
              priceRange: '$45 - $120',
              description: 'Comfort-first fashion staples for everyday wear.',
              features: ['Soft-touch fabrics', 'Relaxed fits', 'Machine washable', 'Inclusive sizing'],
              cta: 'Shop Casual'
            },
            {
              name: 'Workwear',
              priceRange: '$89 - $250',
              description: 'Polished looks designed for professional success.',
              features: ['Tailored silhouettes', 'Low-maintenance care', 'Premium materials', 'Desk-to-dinner styles'],
              cta: 'Browse Workwear',
              featured: true
            },
            {
              name: 'Evening Wear',
              priceRange: '$150 - $400',
              description: 'Elevated styles for special occasions.',
              features: ['Luxe fabrics', 'Limited edition pieces', 'Designer picks', 'Event-ready'],
              cta: 'Explore Elegance'
            }
          ]
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'metrics',
        content: {
          title: 'By the Numbers',
          subtitle: 'Proven impact, trusted by thousands',
          counters: [
            { number: '100k+', label: 'Happy Customers' },
            { number: '50k+', label: 'Orders Fulfilled' },
            { number: '99%', label: 'Positive Reviews' },
            { number: '24/7', label: 'Customer Support' }
          ]
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'gallery',
        content: {
          title: 'Our Favorites',
          subtitle: 'Fan-favorite styles, always in demand',
          images: [
            { src: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop', alt: 'Shirt', caption: 'Essential Tee' },
            { src: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop', alt: 'Jeans', caption: 'Stretch Fit Jeans' },
            { src: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop', alt: 'Shoes', caption: 'Modern Loafers' },
            { src: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop', alt: 'Hat', caption: 'Wool Fedora' }
          ]
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'reviews',
        content: {
          title: 'Customer Testimonials',
          subtitle: 'Loved by shoppers everywhere',
          reviews: [
            {
              rating: 5,
              text: 'StyleHub’s clothes are stylish, comfy, and priced right. I get compliments every time I wear something from them!',
              author: 'Jessica Smith'
            },
            {
              rating: 5,
              text: 'Their customer service is unmatched. Had a shipping issue and they handled it in minutes. Totally impressed.',
              author: 'Emily Jones'
            },
            {
              rating: 5,
              text: 'I’ve been a loyal shopper for years — never disappointed. Amazing collections season after season.',
              author: 'Michael Brown'
            }
          ]
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'cta',
        content: {
          title: 'Join the Style Movement',
          subtitle: 'Elevate your wardrobe with confidence and ease.',
          primaryCta: 'Start Shopping',
          secondaryCta: 'View All Collections',
          features: [
            'Free shipping over $75',
            'Fashion expert support'
          ]
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-gradient-to-r from-pink-50 to-purple-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: 'contact',
        content: {
          title: 'Have Questions?',
          description: 'We’re here to help — get in touch with our support team.',
          cta: 'Contact Us',
          formId: 'ecommerce-contact'
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-gray-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: 'footer',
        content: {
          title: 'StyleHub',
          description: 'Where curated fashion meets modern lifestyle.',
          links: [
            { label: 'Size Guide', href: '/size-guide' },
            { label: 'Shipping Info', href: '/shipping' },
            { label: 'Returns', href: '/returns' },
            { label: 'Contact', href: '/contact' }
          ]
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-gray-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      }
    ]
  },
  {
    id: "agency",
    title: "Creative Powerhouse",
    description: "A bold, award-winning template for creative agencies that demand attention and drive results.",
    image: "/images/agency-template-preview.jpg",
    hint: "This template showcases creative excellence while demonstrating measurable business impact and ROI for clients.",
    aiInsight:
      "Designed to attract high-value creative projects with portfolio showcases, case studies, and social proof that converts prospects into premium clients.",
    stats: {
      visitors: "28k",
      leads: "4.2k",
      conversion: "15%",
    },
    components: [
      {
        id: 1,
        type: "header",
        content: {
          title: "Catalyst Creative",
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8L36 8L40 12L40 36L36 40L12 40L8 36L8 12L12 8Z" fill="currentColor"/><path d="M16 16L32 16L32 32L16 32L16 16Z" fill="white"/></svg>`,
          },
          links: [
            { label: "Work", href: "#portfolio" },
            { label: "Services", href: "#services" },
            { label: "Process", href: "#process" },
            { label: "Team", href: "#team" },
            { label: "Contact", href: "#contact" },
          ],
          actions: [
            { label: "Start Your Project", href: "#cta", style: "primary" },
            { label: "View Portfolio", href: "#portfolio", style: "secondary" },
          ],
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-black/95 backdrop-blur-sm",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: "hero",
        content: {
          title: "We Create Brands That Dominate Markets",
          subtitle: "Award-winning creative agency specializing in breakthrough brand experiences that drive measurable business growth. We've helped 500+ brands achieve market leadership through strategic creativity and data-driven design.",
          cta: "See Our Impact",
          secondaryCta: "Start Your Project",
          socialProof: "500+ brands transformed • $2B+ in client revenue generated • 150+ awards won",
          image: "/images/agency-hero-creative-team.jpg",
          badges: [
            { label: "Cannes Lions Winner", color: "gold" },
            { label: "500+ brands launched", color: "purple" },
            { label: "ROI guaranteed", color: "emerald" },
            { label: "Global reach", color: "blue" },
          ],
        },
        design: {
          theme: "energetic",
          layout: "split",
          backgroundColor: "bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: "brands",
        content: {
          title: "Trusted by Industry Disruptors",
          subtitle: "We partner with brands that dare to challenge the status quo",
          brands: [
            { name: "Tesla", logo: "/images/brand-tesla.svg" },
            { name: "Netflix", logo: "/images/brand-netflix.svg" },
            { name: "Spotify", logo: "/images/brand-spotify.svg" },
            { name: "Airbnb", logo: "/images/brand-airbnb.svg" },
            { name: "Uber", logo: "/images/brand-uber.svg" },
            { name: "Stripe", logo: "/images/brand-stripe.svg" },
          ],
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-gray-900",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: "stats",
        content: {
          title: "Creative Excellence Meets Business Impact",
          subtitle: "Numbers that prove creativity drives results",
          stats: [
            { value: "500+", label: "Brands Transformed", icon: "zap" },
            { value: "$2B+", label: "Client Revenue Generated", icon: "trending-up" },
            { value: "150+", label: "Awards Won", icon: "award" },
            { value: "98%", label: "Client Retention Rate", icon: "heart" },
          ],
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-gradient-to-r from-purple-600 to-pink-600",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: "features",
        content: {
          title: "Full-Spectrum Creative Domination",
          subtitle: "Everything you need to build a market-leading brand",
          features: [
            {
              icon: "palette",
              title: "Brand Strategy & Identity",
              description: "Comprehensive brand development from positioning and messaging to visual identity systems that differentiate you from competitors and resonate with your target audience.",
            },
            {
              icon: "monitor",
              title: "Digital Experience Design",
              description: "Award-winning websites, apps, and digital platforms that convert visitors into customers through strategic UX/UI design and conversion optimization.",
            },
            {
              icon: "video",
              title: "Content & Campaigns",
              description: "Viral-worthy content strategies, video production, and integrated marketing campaigns that amplify your brand message across all channels.",
            },
            {
              icon: "trending-up",
              title: "Growth Marketing",
              description: "Data-driven marketing strategies that scale your business through performance advertising, SEO, social media, and conversion rate optimization.",
            },
            {
              icon: "package",
              title: "Product & Packaging",
              description: "Physical and digital product design that creates memorable unboxing experiences and drives customer loyalty through thoughtful design details.",
            },
            {
              icon: "users",
              title: "Brand Consulting",
              description: "Strategic consulting services including market research, competitive analysis, and brand audits that inform data-driven creative decisions.",
            },
          ],
        },
        design: {
          theme: "energetic",
          layout: "default",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: "portfolio",
        content: {
          title: "Award-Winning Work That Drives Results",
          subtitle: "Case studies showcasing creative excellence and measurable business impact",
          projects: [
            {
              title: "TechFlow: Complete Brand Transformation",
              category: "Brand Identity & Digital",
              description: "Complete rebrand and digital transformation for B2B SaaS startup, resulting in 400% increase in qualified leads and $50M Series B funding.",
              image: "/images/portfolio-techflow-rebrand.jpg",
              results: ["400% lead increase", "$50M funding raised", "300% brand awareness"],
              awards: ["Cannes Lions Bronze", "Webby Award Winner"],
              client: "TechFlow (B2B SaaS)",
              timeline: "6 months",
              link: "/case-studies/techflow-transformation",
            },
            {
              title: "EcoLux: Sustainable Luxury Campaign",
              category: "Campaign & Content",
              description: "Integrated campaign for luxury sustainable fashion brand that achieved 10M+ impressions and 250% sales growth during launch quarter.",
              image: "/images/portfolio-ecolux-campaign.jpg",
              results: ["10M+ impressions", "250% sales growth", "500K social followers"],
              awards: ["D&AD Pencil", "Clio Award Gold"],
              client: "EcoLux (Fashion)",
              timeline: "4 months",
              link: "/case-studies/ecolux-campaign",
            },
            {
              title: "FinanceForward: App Design & Launch",
              category: "Product Design",
              description: "Complete mobile app design and launch strategy for fintech startup, achieving 1M+ downloads and $100M valuation within 18 months.",
              image: "/images/portfolio-financeforward-app.jpg",
              results: ["1M+ downloads", "$100M valuation", "4.8 app store rating"],
              awards: ["Apple Design Award", "UX Design Awards"],
              client: "FinanceForward (Fintech)",
              timeline: "8 months",
              link: "/case-studies/financeforward-app",
            },
            {
              title: "GlobalEats: Restaurant Chain Rebrand",
              category: "Brand Identity & Packaging",
              description: "Complete rebrand and packaging redesign for international restaurant chain, leading to 35% increase in same-store sales.",
              image: "/images/portfolio-globaleats-rebrand.jpg",
              results: ["35% sales increase", "200 locations rebranded", "90% customer approval"],
              awards: ["Pentawards Gold", "Brand Impact Award"],
              client: "GlobalEats (Food & Beverage)",
              timeline: "12 months",
              link: "/case-studies/globaleats-rebrand",
            },
          ],
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-gray-900",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: "testimonials",
        content: {
          title: "What Industry Leaders Say",
          subtitle: "Testimonials from clients who achieved breakthrough results",
          testimonials: [
            {
              quote: "Catalyst Creative didn't just redesign our brand – they transformed our entire business. The rebrand led directly to our Series B funding and established us as the category leader. Their strategic thinking is unmatched.",
              author: "Sarah Chen",
              role: "CEO & Founder, TechFlow",
              image: "/images/testimonial-sarah-chen-techflow.jpg",
              company: "TechFlow",
            },
            {
              quote: "Working with Catalyst was like adding rocket fuel to our marketing. Their campaign strategy and creative execution drove 10x ROI and made us a household name in our industry. Simply phenomenal work.",
              author: "Marcus Rodriguez",
              role: "CMO, EcoLux",
              image: "/images/testimonial-marcus-rodriguez.jpg",
              company: "EcoLux",
            },
            {
              quote: "The app design and user experience Catalyst created for us was game-changing. We went from concept to 1M downloads in 18 months, and the design has been crucial to our success and $100M valuation.",
              author: "Emily Watson",
              role: "Co-Founder, FinanceForward",
              image: "/images/testimonial-emily-watson.jpg",
              company: "FinanceForward",
            },
          ],
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-gradient-to-r from-purple-50 to-pink-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: "team",
        content: {
          title: "Meet the Creative Visionaries",
          subtitle: "Award-winning talent from the world's most prestigious agencies",
          members: [
            {
              name: "Alex Rivera",
              role: "Creative Director & Founder",
              bio: "Former Wieden+Kennedy Creative Director with 15+ years crafting iconic campaigns for Nike, Apple, and Coca-Cola. Cannes Lions Grand Prix winner.",
              image: "/images/team-alex-rivera.jpg",
              linkedin: "https://linkedin.com/in/alexrivera",
              awards: ["Cannes Lions Grand Prix", "D&AD Black Pencil", "One Show Gold"],
              specialties: ["Brand Strategy", "Creative Direction", "Campaign Development"],
              previousClients: ["Nike", "Apple", "Coca-Cola"],
            },
            {
              name: "Maya Patel",
              role: "Design Director",
              bio: "Former Pentagram partner specializing in brand identity and digital design. Her work has been featured in every major design publication.",
              image: "/images/team-maya-patel.jpg",
              linkedin: "https://linkedin.com/in/mayapatel",
              awards: ["D&AD Yellow Pencil", "Type Directors Club", "AIGA Medal"],
              specialties: ["Brand Identity", "Typography", "Digital Design"],
              previousClients: ["Google", "Airbnb", "Mastercard"],
            },
            {
              name: "Jordan Kim",
              role: "Strategy Director",
              bio: "Former McKinsey consultant turned brand strategist. Combines analytical rigor with creative insight to drive business results.",
              image: "/images/team-jordan-kim.jpg",
              linkedin: "https://linkedin.com/in/jordankim",
              awards: ["Effie Awards Gold", "Strategy Award Winner"],
              specialties: ["Brand Strategy", "Market Research", "Business Growth"],
              previousClients: ["Tesla", "Spotify", "Uber"],
            },
            {
              name: "Sam Thompson",
              role: "Technology Director",
              bio: "Former Google UX lead with expertise in digital product design and development. Builds experiences that users love and businesses need.",
              image: "/images/team-sam-thompson.jpg",
              linkedin: "https://linkedin.com/in/samthompson",
              awards: ["Webby Awards", "Apple Design Award", "UX Design Awards"],
              specialties: ["Product Design", "UX/UI", "Development"],
              previousClients: ["Google", "Netflix", "Stripe"],
            },
          ],
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: "process",
        content: {
          title: "Our Battle-Tested Creative Process",
          subtitle: "The proven methodology behind our award-winning work",
          steps: [
            {
              number: "01",
              title: "Strategic Discovery",
              description: "Deep dive into your business, market, and competition to uncover unique opportunities and define success metrics.",
              icon: "search",
              deliverables: ["Market analysis", "Competitive audit", "Brand positioning"],
              timeline: "2-3 weeks",
            },
            {
              number: "02",
              title: "Creative Ideation",
              description: "Collaborative brainstorming sessions to generate breakthrough concepts that align with your strategic objectives.",
              icon: "lightbulb",
              deliverables: ["Creative concepts", "Mood boards", "Initial prototypes"],
              timeline: "2-4 weeks",
            },
            {
              number: "03",
              title: "Design Development",
              description: "Refine and develop chosen concepts into polished creative assets across all required touchpoints and channels.",
              icon: "palette",
              deliverables: ["Final designs", "Brand guidelines", "Asset library"],
              timeline: "4-8 weeks",
            },
            {
              number: "04",
              title: "Production & Launch",
              description: "Execute flawless production and coordinate strategic launch across all channels for maximum impact.",
              icon: "rocket",
              deliverables: ["Production assets", "Launch strategy", "Performance tracking"],
              timeline: "2-6 weeks",
            },
            {
              number: "05",
              title: "Optimization & Growth",
              description: "Monitor performance, gather insights, and continuously optimize for improved results and ROI.",
              icon: "trending-up",
              deliverables: ["Performance reports", "Optimization recommendations", "Growth strategies"],
              timeline: "Ongoing",
            },
          ],
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-gray-900",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: "pricing",
        content: {
          title: "Investment in Creative Excellence",
          subtitle: "Flexible engagement models designed for maximum ROI",
          plans: [
            {
              name: "Brand Foundation",
              price: "$25,000",
              frequency: "4-6 week project",
              description: "Essential brand identity and positioning for startups and small businesses",
              features: [
                "Brand strategy and positioning",
                "Logo and visual identity",
                "Brand guidelines",
                "Basic digital assets",
                "Style guide documentation",
                "2 rounds of revisions",
              ],
              cta: "Start Your Brand",
              popular: false,
              bestFor: "Startups & Small Businesses",
            },
            {
              name: "Growth Accelerator",
              price: "$75,000",
              frequency: "3-4 month engagement",
              description: "Comprehensive brand and digital experience for scaling companies",
              features: [
                "Everything in Brand Foundation",
                "Website design and development",
                "Marketing campaign strategy",
                "Content creation and copywriting",
                "Social media templates",
                "Performance tracking setup",
                "Ongoing optimization support",
              ],
              cta: "Accelerate Growth",
              popular: true,
              badge: "Most Popular",
              roi: "Average 5:1 ROI within 12 months",
            },
            {
              name: "Market Domination",
              price: "$150,000+",
              frequency: "6-12 month partnership",
              description: "Full-service creative partnership for market leaders and enterprises",
              features: [
                "Everything in Growth Accelerator",
                "Dedicated creative team",
                "Multi-channel campaign development",
                "Video and motion graphics",
                "Advanced analytics and reporting",
                "Quarterly strategy reviews",
                "Priority support and consultation",
                "Custom integrations and development",
              ],
              cta: "Dominate Your Market",
              popular: false,
              enterprise: true,
              guarantee: "Results guarantee or money back",
            },
          ],
          additionalInfo: {
            consultation: "Free strategy consultation included",
            timeline: "Rush projects available with 50% premium",
            payment: "Flexible payment terms available",
          },
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 11,
        type: "accordion",
        content: {
          title: "Everything You Need to Know",
          subtitle: "Answers to the most common questions about working with us",
          items: [
            {
              question: "What makes Catalyst Creative different from other agencies?",
              answer: "We combine strategic thinking with award-winning creative execution and guarantee measurable business results. Our team includes former leaders from top agencies like Wieden+Kennedy, Pentagram, and McKinsey. We don't just create beautiful work – we create work that drives revenue growth, market share, and brand value.",
            },
            {
              question: "How do you guarantee ROI on creative projects?",
              answer: "We establish clear success metrics at project start and track performance throughout. Our average client sees 5:1 ROI within 12 months. If we don't achieve agreed-upon results, we'll continue working at no additional cost until we do, or provide a partial refund. Our success is directly tied to your success.",
            },
            {
              question: "What industries do you specialize in?",
              answer: "We work across technology, finance, healthcare, consumer goods, and B2B services. Our strategic approach adapts to any industry, but we excel with companies that want to disrupt their market or establish category leadership. We've helped startups achieve unicorn status and Fortune 500 companies launch new categories.",
            },
            {
              question: "How long does a typical project take?",
              answer: "Brand identity projects typically take 4-6 weeks, comprehensive rebrands 3-4 months, and full digital transformations 6-12 months. We can accelerate timelines for urgent projects. Every project includes detailed timeline planning with regular check-ins and milestone reviews.",
            },
            {
              question: "Do you work with startups or only established companies?",
              answer: "We work with ambitious companies at all stages, from pre-seed startups to Fortune 500 enterprises. Our Brand Foundation package is designed specifically for startups, while our Growth Accelerator and Market Domination packages serve scaling and established companies. We adjust our approach based on your stage and goals.",
            },
            {
              question: "What's included in ongoing support and optimization?",
              answer: "Ongoing support includes performance monitoring, creative asset updates, campaign optimization, strategic consultation, and quarterly reviews. We provide detailed analytics reports and recommendations for continuous improvement. Think of us as your extended creative team, always working to maximize your brand's impact and ROI.",
            },
          ],
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-gray-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 12,
        type: "cta",
        content: {
          title: "Ready to Dominate Your Market?",
          subtitle: "Join 500+ brands that chose creative excellence and achieved breakthrough results",
          description: "Schedule a free strategy session with our creative directors to explore how we can transform your brand and accelerate your growth. We'll analyze your current position, identify opportunities, and outline a custom approach to achieve your goals.",
          primaryCta: "Start Your Transformation",
          secondaryCta: "View Our Portfolio",
          benefits: [
            "Free 90-minute strategy session",
            "Custom creative brief and proposal",
            "No obligation or sales pressure",
            "Immediate actionable insights",
          ],
          urgency: "Limited availability - Only 3 new clients per month",
          socialProof: "Join brands like Tesla, Netflix, and Airbnb",
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 13,
        type: "footer",
        content: {
          title: "Catalyst Creative",
          description: "Award-winning creative agency that drives business results",
          copyright: "© 2025 Catalyst Creative. All rights reserved.",
          links: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Careers", href: "/careers" },
            { label: "Press Kit", href: "/press" },
            { label: "Awards", href: "/awards" },
          ],
          social: [
            { platform: "instagram", url: "https://instagram.com/catalystcreative" },
            { platform: "behance", url: "https://behance.net/catalystcreative" },
            { platform: "linkedin", url: "https://linkedin.com/company/catalystcreative" },
            { platform: "twitter", url: "https://twitter.com/catalystcreate" },
          ],
          contact: {
            email: "hello@catalystcreative.com",
            phone: "+1 (555) 123-4567",
            address: "123 Creative District, New York, NY 10001",
          },
          awards: ["Cannes Lions Winner", "D&AD Pencil", "Webby Awards", "One Show Gold"],
        },
        design: {
          theme: "energetic",
          backgroundColor: "bg-black",
          textColor: "text-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  // --- Minimalist Agency Template --- //
  {
    id: 'agency-minimal',
    title: 'Minimal Studio',
    description: 'A clean, minimalist template for design studios and creative professionals.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
    hint: 'Minimalist design agency template focusing on clean typography and whitespace.',
    aiInsight: 'Perfect for high-end design studios that want to showcase work through clean, sophisticated design.',
    stats: {
      visitors: '18k',
      leads: '2.8k',
      conversion: '16%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'STUDIO',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="12" width="24" height="24" fill="currentColor"/></svg>`
          },
          links: [
            { label: 'Work', href: '#work' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' }
          ],
          actions: [
            { label: 'Start Project', href: '#contact', style: 'primary' }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-white', textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'We Design. You Succeed.',
          subtitle: 'Minimal Studio creates timeless design solutions for forward-thinking brands. Less noise, more impact.',
          cta: 'View Our Work',
          secondaryCta: 'Start a Project',
          socialProof: 'Trusted by 100+ global brands',
          image: '/images/minimal-hero.jpg',
          badges: [
            { label: 'Award-winning design', color: 'gray' },
            { label: 'Global reach', color: 'gray' }
          ]
        },
        design: {
          theme: 'modern', layout: 'centered', backgroundColor: 'bg-gray-50', textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'brands',
        content: {
          title: 'Trusted Partners',
          brands: [
            { name: 'Apple', logo: '/images/brand-apple-minimal.svg' },
            { name: 'Airbnb', logo: '/images/brand-airbnb-minimal.svg' },
            { name: 'Stripe', logo: '/images/brand-stripe-minimal.svg' },
            { name: 'Notion', logo: '/images/brand-notion-minimal.svg' },
            { name: 'Figma', logo: '/images/brand-figma-minimal.svg' },
            { name: 'Linear', logo: '/images/brand-linear-minimal.svg' },
          ],
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'features',
        content: {
          title: 'Our Approach',
          features: [
            {
              icon: 'eye',
              title: 'Visual Identity',
              description: 'Distinctive brand identities that communicate your values clearly and memorably.'
            },
            {
              icon: 'layout',
              title: 'Digital Experiences',
              description: 'Websites and apps that are both beautiful and functional, designed for your users.'
            },
            {
              icon: 'package',
              title: 'Brand Strategy',
              description: 'Strategic thinking that aligns your brand with your business objectives.'
            }
          ]
        },
        design: {
          theme: 'modern', layout: 'default', backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'portfolio',
        content: {
          title: 'Selected Work',
          projects: [
            {
              title: 'TechFlow Rebrand',
              category: 'Brand Identity',
              image: '/images/portfolio-techflow-minimal.jpg',
            },
            {
              title: 'Minimal E-commerce',
              category: 'Digital Experience',
              image: '/images/portfolio-ecommerce-minimal.jpg',
            },
            {
              title: 'Studio Website',
              category: 'Web Design',
              image: '/images/portfolio-studio-minimal.jpg',
            }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'testimonials',
        content: {
          title: 'Client Feedback',
          testimonials: [
            {
              quote: 'Studio delivered exactly what we needed. Clean, professional, and effective.',
              author: 'Sarah Chen',
              role: 'CEO, TechFlow'
            },
            {
              quote: 'Their minimalist approach helped us focus on what really matters to our customers.',
              author: 'David Park',
              role: 'Founder, CleanTech'
            }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'cta',
        content: {
          title: 'Ready to Start?',
          subtitle: 'Let\'s create something meaningful together.',
          primaryCta: 'Start a Project',
          features: ['Free consultation', 'Fixed-price projects', 'Clear timelines']
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'footer',
        content: {
          title: 'STUDIO',
          description: 'Minimal design for maximum impact',
          links: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-white', textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  // --- Creative Agency Template --- //
  {
    id: 'agency',
    title: 'Creative Agency',
    description: 'A vibrant, creative template for design and marketing agencies.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
    hint: 'This is a hint for the AI to generate content for the agency template.',
    aiInsight: 'This template is perfect for showcasing a portfolio and attracting clients.',
    stats: {
      visitors: '15k',
      leads: '2.1k',
      conversion: '14%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'Pixel Perfect',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8L36 8L40 12L40 36L36 40L12 40L8 36L8 12L12 8Z" fill="currentColor"/><path d="M16 16L32 16L32 32L16 32L16 16Z" fill="white"/></svg>`
          },
          links: [
            { label: 'Work', href: '#work' },
            { label: 'Services', href: '#services' },
            { label: 'Studio', href: '#studio' },
            { label: 'Process', href: '#process' },
            { label: 'Contact', href: '#contact' },
          ],
          actions: [
            { label: 'Start a Project', href: '#cta', style: 'primary' },
            { label: 'Get Quote', href: '#contact', style: 'secondary' }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-black', textColor: 'text-gray-100',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'We Create Digital Experiences That Matter',
          subtitle: 'Award-winning creative agency specializing in brand identity, web design, and digital marketing that drives measurable results for ambitious brands.',
          cta: 'View Our Work',
          secondaryCta: 'Start a Project',
          socialProof: 'Trusted by 200+ brands worldwide',
          image: '/images/agency-hero-creative.jpg',
          badges: [
            { label: 'Award-winning agency', color: 'gold' },
            { label: '200+ projects delivered', color: 'purple' },
            { label: 'Free consultation', color: 'pink' }
          ]
        },
        design: {
          theme: 'energetic', layout: 'split', backgroundColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500', textColor: 'text-gray-100',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 17,
        type: 'brands',
        content: {
          title: 'Trusted by Leading Brands',
          subtitle: 'We\'ve helped these companies transform their digital presence',
          brands: [
            { name: 'Nike', logo: '/images/brand-nike.png' },
            { name: 'Apple', logo: '/images/brand-apple.png' },
            { name: 'Google', logo: '/images/brand-google.png' },
            { name: 'Netflix', logo: '/images/brand-netflix.png' },
            { name: 'Spotify', logo: '/images/brand-spotify.png' },
            { name: 'Airbnb', logo: '/images/brand-airbnb.png' },
          ],
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-gray-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'features',
        content: {
          title: 'Our Creative Services',
          subtitle: 'Full-spectrum creative solutions for modern brands',
          features: [
            {
              icon: 'palette',
              title: 'Brand Identity',
              description: 'Distinctive visual identities that capture your brand essence and resonate with your target audience across all touchpoints'
            },
            {
              icon: 'monitor',
              title: 'Web Design & Development',
              description: 'Stunning, responsive websites that convert visitors into customers and elevate your online presence with cutting-edge technology'
            },
            {
              icon: 'trending-up',
              title: 'Digital Marketing',
              description: 'Data-driven campaigns across all channels to maximize reach, engagement, and ROI for your business'
            },
            {
              icon: 'video',
              title: 'Motion Graphics & Video',
              description: 'Captivating animations and video content that bring your brand story to life and engage audiences'
            },
            {
              icon: 'smartphone',
              title: 'UX/UI Design',
              description: 'Intuitive user experiences that delight customers and drive business growth through thoughtful design'
            },
            {
              icon: 'lightbulb',
              title: 'Creative Strategy',
              description: 'Strategic thinking that aligns creative vision with business objectives and market opportunities'
            }
          ]
        },
        design: {
          theme: 'energetic', layout: 'default', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 18,
        type: 'stats',
        content: {
          title: 'Our Creative Impact',
          subtitle: 'Numbers that showcase our expertise and results',
          stats: [
            { value: '200+', label: 'Projects Delivered', icon: 'briefcase' },
            { value: '150+', label: 'Happy Clients', icon: 'users' },
            { value: '25+', label: 'Awards Won', icon: 'award' },
            { value: '98%', label: 'Client Satisfaction', icon: 'star' },
          ],
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'testimonials',
        content: {
          title: 'What Clients Say',
          testimonials: [
            {
              quote: 'Pixel Perfect transformed our brand completely. The new identity increased our brand recognition by 400% and sales by 250%.',
              author: 'Alex Rivera',
              role: 'Founder, TechStart'
            },
            {
              quote: 'Their creative vision and execution are unmatched. Every project exceeds expectations and delivers real business impact.',
              author: 'Maria Santos',
              role: 'Marketing Director, GlobalCorp'
            },
            {
              quote: 'Working with Pixel Perfect feels like having an extension of our team. They understand our vision and bring it to life beautifully.',
              author: 'James Wilson',
              role: 'CEO, InnovateNow'
            }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-gray-900', textColor: 'text-gray-100',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: 'counter',
        content: {
          title: 'Our Achievements',
          subtitle: 'We are proud of our work',
          counters: [
            { number: '100', label: 'Projects Completed', suffix: '+' },
            { number: '50', label: 'Happy Clients', suffix: '+' },
            { number: '10', label: 'Awards Won', suffix: '+' },
            { number: '5', label: 'Years in Business', suffix: '+' }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: 'portfolio',
        content: {
          title: 'Our Creative Portfolio',
          subtitle: 'Award-winning projects that drive real business results',
          projects: [
            {
              title: 'TechStart Rebranding',
              category: 'Brand Identity',
              image: '/images/portfolio-techstart.jpg',
            },
            {
              title: 'GlobalCorp E-commerce Platform',
              category: 'Web Design',
              description: 'Modern e-commerce platform with advanced UX resulting in 180% conversion rate improvement',
              image: '/images/portfolio-globalcorp.jpg',
            },
            {
              title: 'InnovateNow Campaign',
              category: 'Digital Marketing',
              description: 'Multi-channel digital campaign achieving 300% ROI and 2M+ impressions across platforms',
              image: '/images/portfolio-innovatenow.jpg',
            },
            {
              title: 'StartupXYZ Motion Graphics',
              category: 'Video & Animation',
              image: '/images/portfolio-startupxyz.jpg',
            }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 19,
        type: 'pricing',
        content: {
          title: 'Creative Packages',
          subtitle: 'Flexible solutions for every budget and timeline',
          plans: [
            {
              name: 'Brand Starter',
              price: '$5,000',
              frequency: 'one-time',
              description: 'Perfect for startups and small businesses launching their brand',
              features: [
                'Logo design & brand guidelines',
                'Business card design',
                'Basic brand identity package',
                '1-month timeline'
              ],
              cta: 'Get Started',
              popular: false
            },
            {
              name: 'Digital Growth',
              price: '$15,000',
              frequency: 'project-based',
              description: 'Comprehensive digital presence for growing businesses',
              features: [
                'Complete brand identity',
                'Responsive website design',
                'Digital marketing strategy',
                'Social media templates',
                'SEO optimization'
              ],
              cta: 'Choose Growth',
              popular: true
            },
            {
              name: 'Enterprise Solution',
              price: 'Custom',
              frequency: 'ongoing',
              description: 'Full-service creative partnership for established companies',
              features: [
                'Dedicated creative team',
                'Ongoing brand management',
                'Multi-channel campaigns',
                'Video & motion graphics',
                'Priority support',
                'Custom timeline'
              ],
              cta: 'Contact Us',
              popular: false
            }
          ]
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 11,
        type: 'team',
        content: {
          title: 'Meet Our Creative Team',
          subtitle: 'Award-winning creatives and strategists driving innovation',
          members: [
            {
              name: 'Alex Rivera',
              role: 'Creative Director & Founder',
              bio: 'Former Nike creative lead with 12+ years crafting iconic brand experiences. Cannes Lions winner.',
              image: '/images/team-alex.jpg',
              linkedin: 'https://linkedin.com/in/alexrivera',
              specialties: ['Brand Strategy', 'Creative Direction', 'Team Leadership']
            },
            {
              name: 'Sarah Chen',
              role: 'Art Director',
              bio: 'Visual storyteller specializing in digital experiences. Featured in Communication Arts and Print Magazine.',
              image: '/images/team-sarah.jpg',
              linkedin: 'https://linkedin.com/in/sarahchen',
              specialties: ['Visual Design', 'Digital Art', 'Brand Identity']
            },
            {
              name: 'Marcus Johnson',
              role: 'Lead UX Designer',
              bio: 'Human-centered design expert with background at Google and Airbnb. Masters in HCI from Stanford.',
              image: '/images/team-marcus.jpg',
              linkedin: 'https://linkedin.com/in/marcusjohnson',
              specialties: ['UX Research', 'Interaction Design', 'Prototyping']
            },
            {
              name: 'Emily Rodriguez',
              role: 'Digital Strategy Lead',
              bio: 'Data-driven strategist combining creativity with analytics. Former McKinsey consultant turned creative.',
              image: '/images/team-emily.jpg',
              linkedin: 'https://linkedin.com/in/emilyrodriguez',
              specialties: ['Digital Strategy', 'Analytics', 'Growth Marketing']
            }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 20,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          subtitle: 'Everything you need to know about working with us',
          faqs: [
            {
              question: 'What is your typical project timeline?',
              answer: 'Project timelines vary based on scope and complexity. Brand identity projects typically take 4-6 weeks, website design 6-10 weeks, and comprehensive campaigns 8-16 weeks. We provide detailed timelines during our initial consultation.'
            },
            {
              question: 'Do you work with businesses of all sizes?',
              answer: 'Yes! We work with startups, growing businesses, and established enterprises. Our flexible packages and custom solutions ensure we can meet the needs and budgets of companies at any stage of growth.'
            },
            {
              question: 'What is included in your brand identity packages?',
              answer: 'Our brand identity packages include logo design, color palette, typography selection, brand guidelines, business card design, and digital assets. Higher-tier packages also include brand strategy, messaging, and extended brand applications.'
            },
            {
              question: 'How do you measure the success of creative projects?',
              answer: 'We establish clear KPIs at project start, including brand awareness metrics, website conversion rates, engagement rates, and business growth indicators. We provide detailed reports showing the impact of our creative work on your business objectives.'
            },
            {
              question: 'Do you offer ongoing support after project completion?',
              answer: 'Absolutely! We offer various retainer packages for ongoing creative support, brand management, and campaign optimization. Many clients choose to work with us long-term as their dedicated creative partner.'
            }
          ]
        },
        design: {
          theme: 'energetic',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 12,
        type: 'process',
        content: {
          title: 'Our Process',
          subtitle: 'How we create our amazing work',
          steps: [
            { number: '01', title: 'Briefing', description: 'We start by understanding your needs and goals.' },
            { number: '02', title: 'Research', description: 'We research your industry, competitors, and target audience.' },
            { number: '03', title: 'Concept', description: 'We develop a creative concept that meets your needs.' },
            { number: '04', title: 'Design', description: 'We create a beautiful design that brings the concept to life.' },
            { number: '05', title: 'Feedback', description: 'We work with you to get feedback and refine the design.' },
            { number: '06', title: 'Launch', description: 'We launch the final product and celebrate our success.' }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 13,
        type: 'stats',
        content: {
          title: 'Our Impact',
          subtitle: 'The results of our creative work',
          stats: [
            { value: '100+', label: 'Projects', icon: 'briefcase' },
            { value: '50+', label: 'Clients', icon: 'users' },
            { value: '10+', label: 'Awards', icon: 'award' },
            { value: '5+', label: 'Years', icon: 'calendar' }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 14,
        type: 'reviews',
        content: {
          title: 'What Our Clients Say',
          subtitle: 'Testimonials from our happy clients',
          reviews: [
            { rating: 5, text: 'Pixel Perfect is the best creative agency I have ever worked with. They are creative, professional, and a pleasure to work with.', author: 'Alex Rivera', company: 'TechStart' },
            { rating: 5, text: 'The team at Pixel Perfect is amazing. They are so talented and they really care about their clients. I would recommend them to anyone.', author: 'Maria Santos', company: 'GlobalCorp' },
            { rating: 5, text: 'I have been working with Pixel Perfect for several years and they have never let me down. They are the best in the business.', author: 'James Wilson', company: 'InnovateNow' }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 15,
        type: 'cta',
        content: {
          title: 'Ready to Start Your Project?',
          subtitle: 'Let\'s create something amazing together.',
          primaryCta: 'Start a Project',
          secondaryCta: 'View Our Work',
          features: ['Free consultation', 'No obligation', 'Customized proposal']
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 16,
        type: 'footer',
        content: {
          title: 'Pixel Perfect',
          description: 'Creating digital experiences that matter',
          links: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Careers', href: '/careers' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-black', textColor: 'text-gray-100',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },

  // --- Industrial Construction Template --- //
  {
    id: 'construction-industrial',
    title: 'Industrial Construction Co.',
    description: 'A bold, industrial-themed template for heavy construction and infrastructure companies.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    hint: 'Industrial construction template with dark theme and heavy machinery focus.',
    aiInsight: 'Designed for large-scale construction companies specializing in industrial and infrastructure projects.',
    stats: {
      visitors: '8k',
      leads: '850',
      conversion: '11%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'IRONWORKS',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 40L24 8L40 40H8Z" fill="currentColor"/><path d="M16 32L24 20L32 32H16Z" fill="white"/></svg>`
          },
          links: [
            { label: 'Industrial', href: '#industrial' },
            { label: 'Infrastructure', href: '#infrastructure' },
            { label: 'Heavy Equipment', href: '#equipment' },
            { label: 'Safety', href: '#safety' },
            { label: 'Contact', href: '#contact' },
          ],
          actions: [
            { label: 'Request Quote', href: '#quote', style: 'primary' },
            { label: 'Emergency', href: '#emergency', style: 'secondary' }
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-gray-900', textColor: 'text-orange-400',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Building Tomorrow\'s Infrastructure Today',
          subtitle: 'IRONWORKS specializes in large-scale industrial construction, infrastructure development, and heavy machinery operations. 30+ years of engineering excellence.',
          cta: 'View Projects',
          secondaryCta: 'Get Quote',
          socialProof: '1,000+ industrial projects completed',
          image: '/images/industrial-hero.jpg',
          badges: [
            { label: 'ISO 9001 Certified', color: 'orange' },
            { label: '30+ years experience', color: 'yellow' },
            { label: 'Heavy machinery fleet', color: 'red' }
          ]
        },
        design: {
          theme: 'dark', layout: 'full-width-image', backgroundColor: 'bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'stats',
        content: {
          title: 'Industrial Scale Results',
          subtitle: 'Proven performance in heavy construction',
          stats: [
            { value: '1,000+', label: 'Projects Completed', icon: 'building' },
            { value: '30+', label: 'Years Experience', icon: 'calendar' },
            { value: '500+', label: 'Heavy Machines', icon: 'truck' },
            { value: '0', label: 'Safety Incidents', icon: 'shield' },
          ],
        },
        design: {
          theme: 'dark',
          backgroundColor: 'bg-orange-600',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'brands',
        content: {
          title: 'Industry Partners',
          subtitle: 'Working with the best in heavy industry',
          brands: [
            { name: 'Caterpillar', logo: '/images/partner-caterpillar.png' },
            { name: 'Komatsu', logo: '/images/partner-komatsu.png' },
            { name: 'Volvo Construction', logo: '/images/partner-volvo.png' },
            { name: 'Liebherr', logo: '/images/partner-liebherr.png' },
            { name: 'John Deere', logo: '/images/partner-johndeere.png' },
            { name: 'Hitachi', logo: '/images/partner-hitachi.png' },
          ],
        },
        design: {
          theme: 'dark',
          backgroundColor: 'bg-gray-800',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'features',
        content: {
          title: 'Industrial Construction Services',
          subtitle: 'Heavy-duty solutions for complex projects',
          features: [
            {
              icon: 'factory',
              title: 'Industrial Facilities',
              description: 'Manufacturing plants, warehouses, and processing facilities built to industrial standards'
            },
            {
              icon: 'road',
              title: 'Infrastructure Development',
              description: 'Roads, bridges, tunnels, and utilities infrastructure for communities and industry'
            },
            {
              icon: 'crane',
              title: 'Heavy Machinery Operations',
              description: 'Specialized equipment for excavation, demolition, and large-scale earthmoving'
            },
            {
              icon: 'hard-hat',
              title: 'Safety & Compliance',
              description: 'OSHA-certified operations with zero-incident safety record and full regulatory compliance'
            },
            {
              icon: 'tools',
              title: 'Project Management',
              description: 'End-to-end project coordination with experienced engineers and project managers'
            },
            {
              icon: 'clock',
              title: '24/7 Operations',
              description: 'Round-the-clock operations capability for time-critical infrastructure projects'
            }
          ]
        },
        design: {
          theme: 'dark', layout: 'default', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'portfolio',
        content: {
          title: 'Major Projects',
          subtitle: 'Large-scale construction and infrastructure',
          projects: [
            {
              title: 'Steel Manufacturing Plant',
              category: 'Industrial',
              description: '2M sq ft steel processing facility with automated systems',
              image: '/images/project-steel-plant.jpg',
            },
            {
              title: 'Highway Bridge Construction',
              category: 'Infrastructure',
              description: '5-mile bridge spanning major river with 200-year design life',
              image: '/images/project-bridge.jpg',
            },
            {
              title: 'Mining Operation Facility',
              category: 'Heavy Industrial',
              description: 'Complete mining infrastructure including processing and transport',
              image: '/images/project-mining.jpg',
            },
            {
              title: 'Power Plant Construction',
              category: 'Energy Infrastructure',
              description: '500MW power generation facility with environmental controls',
              image: '/images/project-powerplant.jpg',
            }
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-gray-800', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'testimonials',
        content: {
          title: 'Client Testimonials',
          testimonials: [
            {
              quote: 'IRONWORKS delivered our $50M manufacturing facility on time and under budget. Their heavy machinery expertise is unmatched.',
              author: 'Michael Torres',
              role: 'VP Operations, SteelCorp Industries'
            },
            {
              quote: 'The most professional construction team we\'ve worked with. They handled our complex infrastructure project flawlessly.',
              author: 'Sarah Kim',
              role: 'Project Director, Metro Transit Authority'
            }
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-orange-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'cta',
        content: {
          title: 'Ready for Heavy Construction?',
          subtitle: 'Get a detailed quote for your industrial or infrastructure project.',
          primaryCta: 'Request Quote',
          secondaryCta: 'View Equipment',
          features: ['Free site assessment', 'Detailed project planning', 'Heavy machinery included', 'Safety guaranteed']
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: 'footer',
        content: {
          title: 'IRONWORKS',
          description: 'Heavy construction for heavy industry',
          links: [
            { label: 'Safety Records', href: '/safety' },
            { label: 'Certifications', href: '/certifications' },
            { label: 'Equipment Fleet', href: '/equipment' },
            { label: 'Contact', href: '/contact' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-gray-900', textColor: 'text-orange-400',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  // --- Construction Company Template --- //
  {
    id: 'construction',
    title: 'Construction Company',
    description: 'A robust, professional template for construction businesses.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    hint: 'This is a hint for the AI to generate content for the construction template.',
    aiInsight: 'This template is designed to build trust and showcase construction projects.',
    stats: {
      visitors: '5k',
      leads: '500',
      conversion: '10%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'BuildCraft Pro',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 40L24 8L40 40H8Z" fill="currentColor"/><path d="M16 32L24 20L32 32H16Z" fill="white"/></svg>`
          },
          links: [
            { label: 'Projects', href: '#projects' },
            { label: 'Services', href: '#services' },
            { label: 'Safety', href: '#safety' },
            { label: 'About', href: '#about' },
            { label: 'Quote', href: '#quote' },
          ],
          actions: [
            { label: 'Get Free Quote', href: '#quote', style: 'primary' },
            { label: 'Emergency Service', href: '#emergency', style: 'secondary' }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-orange-50', textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Building Dreams, Delivering Excellence',
          subtitle: 'With over 25 years of experience, BuildCraft Pro delivers quality construction services from residential homes to commercial complexes. Licensed, bonded, and insured.',
          cta: 'Get Free Quote',
          secondaryCta: 'View Projects',
          socialProof: '500+ successful projects completed',
          image: '/images/construction-hero.jpg',
          badges: [
            { label: 'Licensed & Insured', color: 'green' },
            { label: '25+ years experience', color: 'orange' },
            { label: 'Free estimates', color: 'blue' }
          ]
        },
        design: {
          theme: 'corporate', layout: 'split', backgroundColor: 'bg-gradient-to-r from-orange-600 to-red-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 21,
        type: 'stats',
        content: {
          title: 'Proven Track Record',
          subtitle: 'Numbers that demonstrate our expertise and reliability',
          stats: [
            { value: '500+', label: 'Projects Completed', icon: 'building' },
            { value: '25+', label: 'Years Experience', icon: 'calendar' },
            { value: '98%', label: 'Client Satisfaction', icon: 'star' },
            { value: '0', label: 'Safety Incidents', icon: 'shield' },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 22,
        type: 'brands',
        content: {
          title: 'Trusted Partners & Certifications',
          subtitle: 'Working with industry-leading suppliers and maintaining top certifications',
          brands: [
            { name: 'OSHA Certified', logo: '/images/cert-osha.png' },
            { name: 'Better Business Bureau', logo: '/images/cert-bbb.png' },
            { name: 'Home Depot Pro', logo: '/images/partner-homedepot.png' },
            { name: 'Lowes Pro', logo: '/images/partner-lowes.png' },
            { name: 'CAT Equipment', logo: '/images/partner-cat.png' },
            { name: 'Local Building Authority', logo: '/images/cert-building.png' },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'features',
        content: {
          title: 'Our Construction Services',
          subtitle: 'Comprehensive solutions for all your building needs',
          features: [
            {
              icon: 'home',
              title: 'Residential Construction',
              description: 'Custom homes, renovations, and additions built to your exact specifications with attention to detail'
            },
            {
              icon: 'building',
              title: 'Commercial Projects',
              description: 'Office buildings, retail spaces, and industrial facilities with on-time delivery and professional standards'
            },
            {
              icon: 'clipboard-list',
              title: 'Project Management',
              description: 'End-to-end project coordination with transparent communication, scheduling, and budget management'
            },
            {
              icon: 'shield-check',
              title: 'Quality Assurance',
              description: 'Rigorous quality control processes ensuring the highest construction standards and safety compliance'
            },
            {
              icon: 'wrench',
              title: 'Renovation & Remodeling',
              description: 'Transform existing spaces with modern designs while preserving structural integrity'
            },
            {
              icon: 'hard-hat',
              title: 'Safety First',
              description: 'OSHA-compliant safety protocols and zero-incident track record for worker and site safety'
            }
          ]
        },
        design: {
          theme: 'corporate', layout: 'default', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 23,
        type: 'portfolio',
        content: {
          title: 'Featured Projects',
          subtitle: 'Showcasing our craftsmanship and expertise',
          projects: [
            {
              title: 'Luxury Family Estate',
              category: 'Residential',
              description: 'Custom 5,000 sq ft luxury home with modern amenities and sustainable features',
              image: '/images/project-luxury-home.jpg',
            },
            {
              title: 'Downtown Office Complex',
              category: 'Commercial',
              description: '50,000 sq ft office building with modern design and energy-efficient systems',
              image: '/images/project-office-complex.jpg',
            },
            {
              title: 'Historic Building Renovation',
              category: 'Renovation',
              description: 'Restored 1920s building preserving historical character while adding modern functionality',
              image: '/images/project-historic-renovation.jpg',
            },
            {
              title: 'Industrial Warehouse',
              category: 'Industrial',
              description: '100,000 sq ft warehouse facility with advanced logistics and safety systems',
              image: '/images/project-warehouse.jpg',
            }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'testimonials',
        content: {
          title: 'Client Testimonials',
          testimonials: [
            {
              quote: 'BuildCraft Pro exceeded our expectations. They completed our office building 2 weeks ahead of schedule and under budget.',
              author: 'Robert Chen',
              role: 'Property Developer'
            },
            {
              quote: 'Professional, reliable, and skilled. Our dream home became reality thanks to their expertise and attention to detail.',
              author: 'Jennifer Martinez',
              role: 'Homeowner'
            }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-orange-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: 'counter',
        content: {
          title: 'Our Experience',
          subtitle: 'We have been building for over 25 years',
          counters: [
            { number: '500', label: 'Projects Completed', suffix: '+' },
            { number: '100', label: 'Happy Clients', suffix: '+' },
            { number: '25', label: 'Years in Business', suffix: '+' },
            { number: '100', label: 'Team Members', suffix: '+' }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: 'gallery',
        content: {
          title: 'Our Projects',
          subtitle: 'A look at our completed projects',
          images: [
            { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop', alt: 'Project 1', caption: 'Residential Home' },
            { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop', alt: 'Project 2', caption: 'Commercial Building' },
            { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop', alt: 'Project 3', caption: 'Renovation' },
            { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop', alt: 'Project 4', caption: 'Addition' }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-orange-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 11,
        type: 'team',
        content: {
          title: 'Our Team',
          subtitle: 'The people who make it happen',
          members: [
            { name: 'John Doe', role: 'President', bio: 'The leader of our team.' },
            { name: 'Jane Smith', role: 'Project Manager', bio: 'The organizer of our projects.' },
            { name: 'Peter Jones', role: 'Foreman', bio: 'The supervisor of our construction sites.' },
            { name: 'Mary Williams', role: 'Office Manager', bio: 'The administrator of our office.' }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 12,
        type: 'process',
        content: {
          title: 'Our Process',
          subtitle: 'How we build your dreams',
          steps: [
            { number: '01', title: 'Consultation', description: 'We start by understanding your needs and goals.' },
            { number: '02', title: 'Design', description: 'We create a design that meets your needs and budget.' },
            { number: '03', title: 'Construction', description: 'We build your project to the highest standards.' },
            { number: '04', title: 'Completion', description: 'We complete your project on time and on budget.' }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-orange-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 13,
        type: 'stats',
        content: {
          title: 'Our Impact',
          subtitle: 'The results of our hard work',
          stats: [
            { value: '500+', label: 'Projects', icon: 'briefcase' },
            { value: '100+', label: 'Clients', icon: 'users' },
            { value: '25+', label: 'Years', icon: 'calendar' },
            { value: '100+', label: 'Team Members', icon: 'users' }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 14,
        type: 'reviews',
        content: {
          title: 'What Our Clients Say',
          subtitle: 'Testimonials from our happy clients',
          reviews: [
            { rating: 5, text: 'BuildCraft Pro did an amazing job on our new home. We are so happy with the results.', author: 'Robert Chen', company: '' },
            { rating: 5, text: 'The team at BuildCraft Pro is professional, reliable, and skilled. We would recommend them to anyone.', author: 'Jennifer Martinez', company: '' }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-orange-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 15,
        type: 'cta',
        content: {
          title: 'Ready to Start Your Project?',
          subtitle: 'Get a free consultation and detailed quote for your construction project.',
          primaryCta: 'Request Quote',
          secondaryCta: 'View Projects',
          features: ['Free consultation', 'Detailed quote', 'Project management', 'Quality assurance']
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-orange-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 16,
        type: 'footer',
        content: {
          title: 'BuildCraft Pro',
          description: 'Building excellence since 1998',
          links: [
            { label: 'License Info', href: '/license' },
            { label: 'Insurance', href: '/insurance' },
            { label: 'Safety', href: '/safety' },
            { label: 'Contact', href: '/contact' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-gray-800', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },

  // --- Fitness & Wellness Template --- //
  {
    id: "fitness-wellness-pro",
    title: "Fitness & Wellness Pro",
    description: "An energetic and premium template for high-end gyms, trainers, and wellness studios, designed for motivation and conversion.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    hint: "Generate content for a premium fitness club focusing on personalized training, community, and holistic wellness.",
    aiInsight: "This template uses a clean, nature-inspired color palette and spacious layout to create a feeling of premium wellness and trust. Animations are used to guide the user's eye and create an engaging experience.",
    stats: {
      visitors: "12k",
      leads: "1.1k",
      conversion: "9.2%"
    },
    components: [
      {
        id: 1,
        type: "header",
        name: "Main Navigation",
        content: {
          title: "Aura Wellness",
          links: [
            { label: "Programs", "href": "#programs" },
            { label: "Our Method", "href": "#method" },
            { label: "Pricing", "href": "#pricing" },
            { label: "Testimonials", "href": "#testimonials" }
          ],
          cta: "Join Now",
          ctaUrl: "#pricing",
          "secondaryCta": "Book a Tour",
          "secondaryCtaUrl": "#contact"
        },
        design: {
          theme: "nature",
          "backgroundColor": "#F0FDF4",
          "textColor": "#064E3B",
          "position": { type: "sticky", "top": 0, "zIndex": 50 },
          "shadow": { "enabled": true, "blur": 15, "color": "rgba(0,0,0,0.05)" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: "hero",
        name: "Hero Section",
        content: {
          title: "Unlock Your Potential. Redefine Your Wellness.",
          "subtitle": "Aura Wellness is more than a gym. It's a personalized wellness journey powered by expert coaches, state-of-the-art facilities, and a community that inspires you.",
          cta: "Start Your 7-Day Trial",
          ctaUrl: "#pricing",
          "secondaryCta": "Explore Our Programs",
          "secondaryCtaUrl": "#programs",
          image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2"
        },
        design: {
          theme: "nature",
          "layout": "split",
          "backgroundColor": "#059669",
          "textColor": "#FFFFFF",
          padding: { "top": 120, "bottom": 120 },
          "animation": { type: "fadeIn", "duration": 800 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: "brands",
        name: "Social Proof - As Seen On",
        content: {
          title: "As Featured In",
          links: [
            { label: "Wellness Today", "href": "#" },
            { label: "Men's Health", "href": "#" },
            { label: "Shape Magazine", "href": "#" },
            { label: "Coach Magazine", "href": "#" },
            { label: "Fitness Pro", "href": "#" }
          ]
        },
        design: {
          "backgroundColor": "#DCFCE7",
          padding: { "top": 60, "bottom": 60 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: "features",
        name: "Core Programs",
        content: {
          title: "A Holistic Approach to Fitness",
          "subtitle": "We integrate personalized training, nutrition, and recovery to deliver sustainable results.",
          "features": [
            {
              "icon": "award",
              title: "1-on-1 Expert Coaching",
              description: "Receive a plan tailored to your unique goals, body, and lifestyle from a certified personal coach."
            },
            {
              "icon": "users",
              title: "Dynamic Group Classes",
              description: "From high-intensity interval training to restorative yoga, find your energy in our diverse class schedule."
            },
            {
              "icon": "heart",
              title: "Advanced Recovery",
              description: "Optimize your performance with access to saunas, cryotherapy, and massage guns in our dedicated recovery zones."
            }
          ]
        },
        design: {
          theme: "nature",
          "backgroundColor": "#FFFFFF",
          padding: { "top": 100, "bottom": 100 },
          "animation": { type: "slideInUp", "duration": 600, "delay": 200 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: "testimonials",
        name: "Member Testimonials",
        content: {
          title: "Results You Can See and Feel",
          "subtitle": "Don't just take our word for it. Hear from our members.",
          "testimonials": [
            {
              "quote": "Joining Aura was the best decision I've made for my health. I lost 20 pounds, but more importantly, I gained confidence I never thought I had. The trainers are world-class.",
              "author": "Sarah L.",
              "role": "Member since 2022",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
              "rating": 5
            },
            {
              "quote": "The community here is everything. I've made incredible friends and always feel motivated to show up. It's a completely different atmosphere from any other gym.",
              "author": "Michael B.",
              "role": "Member since 2021",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
              "rating": 5
            }
          ]
        },
        design: {
          theme: "nature",
          "backgroundColor": "#F0FDF4",
          padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: "process",
        name: "Our Method",
        content: {
          title: "Your Path to Success",
          "subtitle": "Our proven 4-step method ensures you get the results you're looking for.",
          "steps": [
            { "number": "01", title: "Discover", description: "We start with an in-depth consultation and body composition analysis to understand your starting point." },
            { "number": "02", title: "Design", description: "Your coach creates a completely personalized training and nutrition plan tailored to your goals." },
            { "number": "03", title: "Execute", description: "Train with your coach, track your progress in our app, and get support from the community." },
            { "number": "04", title: "Evolve", description: "We regularly review your progress and adapt your plan to ensure you're always moving forward." }
          ]
        },
        design: {
          "backgroundColor": "#FFFFFF",
          padding: { "top": 100, "bottom": 100 },
          "animation": { type: "slideInUp", "duration": 600 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: "pricing",
        name: "Membership Plans",
        content: {
          title: "Find Your Perfect Fit",
          "subtitle": "Choose a plan that aligns with your commitment and goals. All plans start with a 7-day free trial.",
          "plans": [
            {
              name: "Flex",
              "price": "$79",
              "frequency": "/mo",
              description: "Ideal for self-starters who love our group classes.",
              "features": ["Unlimited Group Classes", "Full Gym Access", "Recovery Zone Access", "Community Events"],
              cta: "Start Free Trial"
            },
            {
              name: "Commit",
              "price": "$149",
              "frequency": "/mo",
              description: "Our most popular plan for personalized results.",
              "features": ["Everything in Flex", "4 Personal Coaching Sessions/mo", "Personalized Nutrition Plan", "Monthly Progress Review"],
              cta: "Start Free Trial",
              "featured": true
            },
            {
              name: "Transform",
              "price": "$299",
              "frequency": "/mo",
              description: "The ultimate all-in-one wellness transformation package.",
              "features": ["Everything in Commit", "8 Personal Coaching Sessions/mo", "Weekly Meal Plans", "Priority Booking"],
              cta: "Start Free Trial"
            }
          ]
        },
        design: {
          theme: "nature",
          "backgroundColor": "#F0FDF4",
          padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: "faq",
        name: "Frequently Asked Questions",
        content: {
          title: "Have Questions?",
          "subtitle": "We have answers. Here are some of the most common questions we get.",
          "features": [
            { title: "Can I cancel my membership anytime?", description: "Yes, all our monthly plans can be canceled with 30 days' notice. There are no long-term contracts." },
            { title: "What are the gym's opening hours?", description: "We are open Monday to Friday from 5 AM to 11 PM, and on weekends from 7 AM to 9 PM." },
            { title: "Do I need to be fit to join?", description: "Absolutely not! We welcome members of all fitness levels. Our coaches are experts at creating programs for beginners." },
            { title: "What should I bring for my first class?", description: "Just bring comfortable workout clothes, a water bottle, and a positive attitude. We'll take care of the rest!" }
          ]
        },
        design: {
          "backgroundColor": "#FFFFFF",
          padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: "cta",
        name: "Final Call to Action",
        content: {
          title: "Ready to Build a Stronger You?",
          "subtitle": "Your 7-day free trial is waiting. Experience our coaches, classes, and community with no commitment.",
          cta: "Claim Your Free 7-Day Pass",
          ctaUrl: "#pricing"
        },
        design: {
          theme: "nature",
          "backgroundColor": "#047857",
          "textColor": "#FFFFFF",
          padding: { "top": 80, "bottom": 80 },
          "border": { "radius": 24 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: "footer",
        name: "Page Footer",
        content: {
          title: "Aura Wellness",
          description: "Your journey to holistic health and peak performance starts here.",
          links: [
            { label: "About Us", "href": "/about" },
            { label: "Careers", "href": "/careers" },
            { label: "Contact", "href": "/contact" },
            { label: "Privacy Policy", "href": "/privacy" }
          ],
          socials: {
            "instagram": "https://instagram.com",
            "facebook": "https://facebook.com",
            "twitter": "https://twitter.com"
          },
          copyright: "© 2024 Aura Wellness. All Rights Reserved."
        },
        design: {
          theme: "dark",
          "backgroundColor": "#064E3B",
          "textColor": "#DCFCE7",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      }
    ]
  },

  // --- Real Estate Template --- //
  {
    id: "real-estate-pro",
    title: "Real Estate Professional",
    description: "A sophisticated and polished template for elite real estate agencies and agents, optimized for high-value listings and lead generation.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059ee41f",
    hint: "Generate content for a high-end real estate agency focusing on luxury properties, client success, and market expertise.",
    aiInsight: "This template uses a trustworthy navy and gold color scheme and a clean layout to convey professionalism and luxury. The flow is designed to build credibility with statistics and testimonials before showcasing listings.",
    stats: {
      visitors: "15k",
      leads: "1.2k",
      conversion: "8%"
    },
    components: [
      {
        id: 1,
        type: "header",
        name: "Main Navigation",
        content: {
          title: "Stature Realty",
          links: [
            { label: "For Sale", "href": "#listings" },
            { label: "Our Agents", "href": "#agents" },
            { label: "Client Stories", "href": "#testimonials" },
            { label: "Market Insights", "href": "#reports" }
          ],
          cta: "List With Us",
          ctaUrl: "#contact",
          "secondaryCta": "Contact",
          "secondaryCtaUrl": "#contact"
        },
        design: {
          theme: "corporate",
          "backgroundColor": "#FFFFFF",
          "textColor": "#1E293B",
          "position": { type: "sticky", "top": 0, "zIndex": 50 },
          "shadow": { "enabled": true, "blur": 10, "color": "rgba(0,0,0,0.05)" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: "hero",
        name: "Hero Section",
        content: {
          title: "Your Future Home Awaits. Unparalleled Service, Exceptional Results.",
          "subtitle": "Stature Realty is the gold standard in luxury real estate. We combine deep market expertise with a client-first approach to turn your property goals into reality.",
          cta: "Explore Featured Listings",
          ctaUrl: "#listings",
          "secondaryCta": "Get a Free Home Valuation",
          "secondaryCtaUrl": "#contact",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        },
        design: {
          theme: "corporate",
          "layout": "centered",
          "backgroundColor": "#F8FAFC",
          padding: { "top": 100, "bottom": 100 },
          "animation": { type: "fadeIn", "duration": 800 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: "stats",
        name: "Agency Performance",
        content: {
          title: "Market-Leading Results",
          "subtitle": "Our numbers reflect our commitment to excellence and client success.",
          stats: [
            { "value": "$2.5B+", label: "Total Sales Volume", "icon": "dollar-sign" },
            { "value": "1,200+", label: "Families Moved", "icon": "home" },
            { "value": "14 Days", label: "Average Time to Sell", "icon": "calendar" },
            { "value": "Top 1%", label: "Of Agents Nationwide", "icon": "star" }
          ]
        },
        design: {
          theme: "corporate",
          "backgroundColor": "#FFFFFF",
          padding: { "top": 80, "bottom": 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: "products",
        name: "Featured Listings",
        content: {
          title: "Featured Properties",
          "subtitle": "A curated selection of exceptional homes in the most sought-after locations.",
          "products": [
            {
              id: "prop-001",
              name: "Modern Downtown Penthouse",
              "price": 850000,
              image: "https://images.unsplash.com/photo-1613553429205-168d113c5453",
              description: "2 Bed | 2 Bath | 1,200 sq ft. Breathtaking city views from this stunning downtown residence."
            },
            {
              id: "prop-002",
              name: "Luxury Suburban Family Home",
              "price": 1250000,
              image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
              description: "4 Bed | 3 Bath | 2,800 sq ft. An entertainer's dream with a gourmet kitchen and expansive backyard."
            },
            {
              id: "prop-003",
              name: "Exclusive Waterfront Villa",
              "price": 2100000,
              image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
              description: "5 Bed | 4 Bath | 4,200 sq ft. Private dock and panoramic ocean views in this one-of-a-kind estate."
            }
          ]
        },
        design: {
          theme: "corporate",
          "backgroundColor": "#F8FAFC",
          padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: "testimonials",
        name: "Client Success Stories",
        content: {
          title: "What Our Clients Are Saying",
          "subtitle": "Our reputation is built on the trust and success of the families we serve.",
          "testimonials": [
            {
              "quote": "Stature Realty sold our house for 15% over asking in just five days. Their marketing strategy and negotiation skills are second to none. We couldn't be happier with the outcome.",
              "author": "Michael & Sarah Johnson",
              "role": "Home Sellers in Westwood",
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
              "rating": 5
            },
            {
              "quote": "As first-time homebuyers, we were nervous. Our agent, Jennifer, guided us through every step with patience and expertise, helping us secure our dream home under budget in a competitive market.",
              "author": "David & Emily Chen",
              "role": "First-Time Home Buyers",
              image: "https://images.unsplash.com/photo-1552058544-f2b08422138a",
              "rating": 5
            }
          ]
        },
        design: {
          theme: "corporate",
          "backgroundColor": "#FFFFFF",
          padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: "team",
        name: "Our Agents",
        content: {
          title: "Meet Our Expert Agents",
          "subtitle": "A team of dedicated professionals with a deep-rooted knowledge of the market.",
          "team": [
            {
              name: "Jennifer Martinez",
              "role": "Lead Broker, Luxury Specialist",
              "bio": "Top 1% agent with 12+ years of experience specializing in luxury estates and complex negotiations.",
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
              "social": { "linkedin": "#" }
            },
            {
              name: "Robert Chen",
              "role": "Commercial & Investment Advisor",
              "bio": "Expert in commercial properties with over $500M in successful transactions.",
              image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
              "social": { "linkedin": "#" }
            }
          ]
        },
        design: {
          theme: "corporate",
          "backgroundColor": "#F8FAFC",
          padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: "faq",
        name: "Common Questions",
        content: {
          title: "Your Questions, Answered",
          "features": [
            {
              title: "What are the commission fees for selling a home?",
              description: "Our commission is competitive and performance-based. We invest heavily in marketing to ensure you get the highest possible price. Contact us for a detailed breakdown."
            },
            {
              title: "How do you determine my home's value?",
              description: "We perform a Comprehensive Market Analysis (CMA) using recent comparable sales, current market trends, and the unique features of your property to determine an accurate, strategic listing price."
            },
            {
              title: "What areas do you specialize in?",
              description: "While we serve the entire metropolitan region, we have unparalleled expertise in the luxury markets of Westwood, Beverly Hills, and Santa Monica."
            }
          ]
        },
        design: {
          theme: "corporate",
          "backgroundColor": "#FFFFFF",
          padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: "contact",
        name: "Contact Form & CTA",
        content: {
          title: "Ready to Make Your Move?",
          description: "Whether you're buying, selling, or just exploring the market, our team is ready to provide a complimentary, no-obligation consultation.",
          cta: "Schedule My Consultation",
          "fields": [
            { type: "text", label: "Full Name", "placeholder": "John Doe", "required": true },
            { type: "email", label: "Email Address", "placeholder": "you@example.com", "required": true },
            { type: "tel", label: "Phone Number", "placeholder": "(555) 123-4567", "required": false },
            { type: "textarea", label: "How can we help you?", "placeholder": "I'm interested in selling my home at 123 Main St..." }
          ]
        },
        design: {
          theme: "corporate",
          "backgroundColor": "#1E3A8A",
          "textColor": "#FFFFFF",
          padding: { "top": 80, "bottom": 80 },
          "border": { "radius": 16 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: "footer",
        name: "Page Footer",
        content: {
          title: "Stature Realty",
          description: "The Gold Standard in Real Estate.",
          links: [
            { label: "Listings", "href": "/listings" },
            { label: "Agents", "href": "/agents" },
            { label: "Contact", "href": "/contact" },
            { label: "Privacy Policy", "href": "/privacy" }
          ],
          socials: {
            "linkedin": "#",
            "instagram": "#",
            "facebook": "#"
          },
          copyright: "© 2024 Stature Realty, Inc. All Rights Reserved. Licensed Real Estate Broker."
        },
        design: {
          theme: "dark",
          "backgroundColor": "#1E293B",
          "textColor": "#E2E8F0",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      }
    ]
  },

  // --- Online Learning Template --- //
  {
    id: "online-learning-pro-v2",
    title: "Online Learning Conversion Engine",
    description: "A highly optimized and comprehensive template for elite e-learning platforms, engineered for maximum student enrollment.",
    image: "https://images.unsplash.com/photo-1503676260728-1c64c1a248bf",
    hint: "Generate content for a premium learning platform focused on getting students high-paying tech jobs.",
    aiInsight: "This template follows a deliberate conversion funnel. It builds trust with social proof, demonstrates clear value with a defined process and hard metrics, then uses human stories and urgency to drive enrollment.",
    stats: {
      visitors: "40k",
      leads: "3.8k",
      conversion: "9.5%"
    },
    components: [
      {
        id: 1,
        type: "header",
        name: "Main Navigation",
        content: {
          title: "CareerLaunch",
          links: [
            { label: "Learning Paths", "href": "#paths" },
            { label: "Student Outcomes", "href": "#outcomes" },
            { label: "Pricing", "href": "#pricing" }
          ],
          cta: "Start Free Week",
          ctaUrl: "#pricing"
        },
        design: {
          theme: "modern", "backgroundColor": "rgba(255, 255, 255, 0.8)", "textColor": "#1F2937",
          "customStyles": "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);",
          "position": { type: "sticky", "top": 0, "zIndex": 50 },
          "border": { "width": 1, "color": "rgba(226, 232, 240, 0.8)" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: "hero",
        name: "Hero Section",
        content: {
          title: "Don't Just Learn. Get Hired.",
          "subtitle": "CareerLaunch offers elite, project-based learning paths designed with FAANG engineers to land you a six-figure tech job. Guaranteed.",
          cta: "Explore Learning Paths", ctaUrl: "#paths",
          "secondaryCta": "Read Success Stories", "secondaryCtaUrl": "#testimonials",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
        },
        design: {
          theme: "modern", "layout": "split", "backgroundColor": "#F8FAFC",
          padding: { "top": 100, "bottom": 100 }, "animation": { type: "fadeIn", "duration": 800 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: "brands",
        name: "Social Proof - Trusted By",
        content: { title: "Our Alumni Are Now Leaders At" },
        design: {
          "backgroundColor": "#FFFFFF", padding: { "top": 60, "bottom": 60 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 15,
        type: "process",
        name: "How It Works",
        content: {
          title: "Your Path to a Six-Figure Tech Career",
          "subtitle": "We've engineered a clear, four-step process to take you from beginner to job-ready professional.",
          "steps": [
            { "number": "01", title: "Choose Your Path", description: "Select a career-focused learning path like Full-Stack Engineering or UX Design." },
            { "number": "02", title: "Build Real Projects", description: "Go beyond theory and build a portfolio of impressive, real-world applications." },
            { "number": "03", title: "Master the Interview", description: "Receive 1-on-1 coaching, mock interviews, and resume optimization from industry insiders." },
            { "number": "04", title: "Get Hired, Guaranteed", description: "Leverage our exclusive hiring network. If you don't get a job in 6 months, you get a full refund." }
          ]
        },
        design: {
          "backgroundColor": "#F8FAFC", padding: { "top": 100, "bottom": 100 }, "animation": { type: "slideInUp", "duration": 600 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 16,
        type: "metrics",
        name: "Hard Data - Outcomes",
        content: {
          title: "Data-Backed Results You Can't Ignore",
          stats: [
            { "value": "94%", label: "Employment Rate", description: "Within 6 months of graduation." },
            { "value": "$115k", label: "Average Starting Salary", description: "For our engineering track graduates." },
            { "value": "+$28k", label: "Avg. Salary Increase", description: "For students with prior experience." }
          ]
        },
        design: {
          "backgroundColor": "#1E40AF", "textColor": "#FFFFFF", padding: { "top": 80, "bottom": 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 11,
        type: "products",
        name: "Learning Paths (Courses)",
        content: {
          title: "Our Learning Paths",
          "subtitle": "Each path is a complete, all-in-one program to mastery.",
          "products": [
            { id: "path-01", name: "Full-Stack Software Engineer", "price": 2999, image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713", description: "Become a job-ready engineer. Master Python, React, Node.js, and more." },
            { id: "path-02", name: "UI/UX Design Professional", "price": 2499, image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e", description: "From user research to high-fidelity prototypes. Master Figma and design thinking." },
            { id: "path-03", name: "Data Science & Machine Learning", "price": 3499, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71", description: "Learn to analyze data, build predictive models, and deploy ML solutions." }
          ]
        },
        design: {
          theme: "modern", "backgroundColor": "#FFFFFF", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 12,
        type: "testimonials",
        name: "Student Success Stories",
        content: {
          title: "From Student to Senior Engineer",
          "testimonials": [
            { "quote": "I was stuck in a dead-end job. CareerLaunch gave me the skills and the confidence to switch careers. I tripled my income and now work as a Software Engineer at Amazon. The job guarantee is what convinced me, and they delivered.", "author": "Maria Rodriguez", "role": "Software Engineer at Amazon", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", "rating": 5 }
          ]
        },
        design: {
          theme: "modern", "layout": "split", "backgroundColor": "#F8FAFC", padding: { "top": 100, "bottom": 100 }, "animation": { type: "zoomIn" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 13,
        type: "team",
        name: "Instructors",
        content: {
          title: "Learn from Industry Titans",
          "subtitle": "Your instructors aren't just teachers; they are senior engineers and designers at top companies.",
          "team": [
            { name: "David Chen", "role": "Lead Instructor, Ex-Google Senior Engineer", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde", "social": { "linkedin": "#" } },
            { name: "Angela Li", "role": "Lead Design Mentor, Ex-Airbnb Staff Designer", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956", "social": { "linkedin": "#" } }
          ]
        },
        design: {
          "backgroundColor": "#FFFFFF", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: "pricing",
        name: "Pricing & Enrollment",
        content: {
          title: "Invest In Your Future. It's Risk-Free.",
          "subtitle": "Choose a payment option that works for you. All plans are backed by our 6-month job guarantee.",
          "countdown": {
            "enabled": true,
            "deadline": "2024-12-31T23:59:59",
            title: "Next cohort enrollment closes in:"
          },
          "plans": [
            { name: "Upfront", "price": "$7,500", description: "Pay once and save the most.", "features": ["Full program access", "1-on-1 mentorship", "Career services", "Job Guarantee"], cta: "Enroll Now & Save $2.5k", "featured": true },
            { name: "Installments", "price": "$699", "frequency": "/mo for 12 mos", description: "Pay over time.", "features": ["Full program access", "1-on-1 mentorship", "Career services", "Job Guarantee"], cta: "Start for $699/mo" }
          ]
        },
        design: {
          theme: "modern", "backgroundColor": "#F8FAFC", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 14,
        type: "cta",
        name: "Final CTA",
        content: {
          title: "Are You Ready to Launch Your New Career?",
          "subtitle": "Your first week is on us. Experience the curriculum, meet instructors, and talk to students. No commitment required.",
          cta: "Start My Free Week", ctaUrl: "#pricing"
        },
        design: {
          theme: "modern", "backgroundColor": "#3B82F6", "textColor": "#FFFFFF",
          padding: { "top": 80, "bottom": 80 }, "border": { "radius": 16 }, "shadow": { "enabled": true, "blur": 25, "y": 10, "color": "rgba(59, 130, 246, 0.3)" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: "footer",
        name: "Page Footer",
        content: {
          title: "CareerLaunch", description: "Your Career. Accelerated.",
          links: [
            { label: "Outcomes Report", "href": "/outcomes" },
            { label: "FAQ", "href": "/faq" },
            { label: "Contact Admissions", "href": "/contact" }
          ],
          socials: [
            { label: "LinkedIn", "href": "#" },
            { label: "Twitter", "href": "#" }
          ],
          copyright: "© 2024 CareerLaunch, Inc. All rights reserved."
        },
        design: {
          theme: "dark", "backgroundColor": "#1F2937", "textColor": "#F8FAFC",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      }
    ]
  },

  // --- Luxury Restaurant Template --- //
  {
    id: 'restaurant-luxury',
    title: 'Fine Dining Restaurant',
    description: 'An elegant, sophisticated template for upscale restaurants and fine dining establishments.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    hint: 'Luxury restaurant template with elegant design and premium feel.',
    aiInsight: 'Designed for high-end restaurants focusing on ambiance, exclusivity, and culinary excellence.',
    stats: {
      visitors: '9k',
      leads: '1.2k',
      conversion: '13%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'LUMIÈRE',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8L32 16L24 24L16 16L24 8Z" fill="currentColor"/><path d="M16 24L24 32L32 24H16Z" fill="currentColor"/></svg>`
          },
          links: [
            { label: 'Menu', href: '#menu' },
            { label: 'Wine', href: '#wine' },
            { label: 'Private Dining', href: '#private' },
            { label: 'Chef', href: '#chef' },
            { label: 'Reservations', href: '#reservations' },
          ],
          actions: [
            { label: 'Reserve Table', href: '#reservation', style: 'primary' },
            { label: 'Gift Cards', href: '#gifts', style: 'secondary' }
          ]
        },
        design: {
          theme: 'luxury', backgroundColor: 'bg-gray-900', textColor: 'text-gold-400',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Culinary Artistry Redefined',
          subtitle: 'Experience Michelin-starred cuisine in an intimate setting. Chef Laurent\'s innovative French cuisine celebrates seasonal ingredients with modern techniques.',
          cta: 'Reserve Your Table',
          secondaryCta: 'View Tasting Menu',
          socialProof: 'Michelin 2-Star Restaurant',
          image: '/images/luxury-restaurant-hero.jpg',
          badges: [
            { label: 'Michelin 2-Star', color: 'gold' },
            { label: 'Wine Spectator Award', color: 'burgundy' },
            { label: 'James Beard Winner', color: 'gold' }
          ]
        },
        design: {
          theme: 'luxury', layout: 'full-width-image', backgroundColor: 'bg-gradient-to-b from-gray-900/80 to-gray-900/60', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'stats',
        content: {
          title: 'Culinary Excellence',
          subtitle: 'Recognition and accolades',
          stats: [
            { value: '2', label: 'Michelin Stars', icon: 'star' },
            { value: '15+', label: 'Years Excellence', icon: 'calendar' },
            { value: '500+', label: 'Wine Selection', icon: 'wine' },
            { value: '24', label: 'Seats Only', icon: 'users' },
          ],
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-burgundy-900',
          textColor: 'text-gold-200',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'gallery',
        content: {
          title: 'Signature Creations',
          subtitle: 'Artistry on every plate',
          images: [
            {
              src: '/images/dish-foie-gras.jpg',
              alt: 'Seared Foie Gras',
              category: 'Appetizer',
              price: '$48',
              description: 'Pan-seared foie gras with cherry gastrique and brioche'
            },
            {
              src: '/images/dish-lobster.jpg',
              alt: 'Butter-Poached Lobster',
              category: 'Main Course',
              price: '$85',
              description: 'Maine lobster with truffle risotto and micro herbs'
            },
            {
              src: '/images/dish-wagyu.jpg',
              alt: 'A5 Wagyu Beef',
              category: 'Main Course',
              price: '$120',
              description: 'Japanese A5 wagyu with seasonal vegetables'
            },
            {
              src: '/images/dish-dessert.jpg',
              alt: 'Chocolate Soufflé',
              category: 'Dessert',
              price: '$28',
              description: 'Dark chocolate soufflé with gold leaf and vanilla bean'
            },
          ],
        },
        design: {
          theme: 'luxury',
          backgroundColor: 'bg-gray-900',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'features',
        content: {
          title: 'The Lumière Experience',
          subtitle: 'Every detail crafted to perfection',
          features: [
            {
              icon: 'chef-hat',
              title: 'Michelin-Starred Chef',
              description: 'Chef Laurent brings 20+ years of Michelin experience from Paris and New York'
            },
            {
              icon: 'wine',
              title: 'Curated Wine Program',
              description: 'Over 500 selections from renowned vineyards, expertly paired with each course'
            },
            {
              icon: 'utensils',
              title: 'Seasonal Tasting Menu',
              description: 'Seven-course journey featuring the finest seasonal ingredients and innovative techniques'
            },
            {
              icon: 'crown',
              title: 'Private Dining',
              description: 'Exclusive chef\'s table and private rooms for intimate celebrations'
            }
          ]
        },
        design: {
          theme: 'luxury', layout: 'default', backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'team',
        content: {
          title: 'Culinary Leadership',
          subtitle: 'Masters of their craft',
          members: [
            {
              name: 'Chef Laurent Dubois',
              role: 'Executive Chef & Owner',
              bio: 'Michelin 2-star chef with 20+ years experience in Paris, New York, and San Francisco. James Beard Award winner.',
              image: '/images/chef-laurent.jpg',
              specialties: ['Modern French', 'Molecular Gastronomy', 'Seasonal Cuisine'],
              awards: ['Michelin 2-Star', 'James Beard Award', 'World\'s 50 Best Restaurants']
            },
            {
              name: 'Sommelier Marie Rousseau',
              role: 'Wine Director',
              bio: 'Master Sommelier with expertise in French and Californian wines. Former sommelier at Le Bernardin.',
              image: '/images/sommelier-marie.jpg',
              specialties: ['French Wines', 'Food Pairing', 'Rare Vintages'],
              awards: ['Master Sommelier', 'Wine & Spirits Top 40', 'Court of Master Sommeliers']
            }
          ]
        },
        design: {
          theme: 'luxury', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'testimonials',
        content: {
          title: 'Guest Reviews',
          testimonials: [
            {
              quote: 'An extraordinary culinary journey. Every course was a masterpiece. The wine pairings were perfection.',
              author: 'James Mitchell',
              role: 'Food & Wine Magazine'
            },
            {
              quote: 'Lumière sets the standard for fine dining. Impeccable service, innovative cuisine, and an unforgettable experience.',
              author: 'Sarah Chen',
              role: 'Michelin Guide Inspector'
            }
          ]
        },
        design: {
          theme: 'luxury', backgroundColor: 'bg-burgundy-900', textColor: 'text-gold-200',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'cta',
        content: {
          title: 'Reserve Your Culinary Journey',
          subtitle: 'Limited seating available. Book your table for an unforgettable evening.',
          primaryCta: 'Make Reservation',
          secondaryCta: 'Private Dining',
          features: ['Michelin 2-star experience', 'Seasonal tasting menu', 'Expert wine pairings', 'Intimate 24-seat dining room']
        },
        design: {
          theme: 'luxury', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: 'footer',
        content: {
          title: 'LUMIÈRE',
          description: 'Culinary artistry in the heart of the city',
          links: [
            { label: 'Reservations', href: '/reservations' },
            { label: 'Private Events', href: '/private' },
            { label: 'Gift Cards', href: '/gifts' },
            { label: 'Press', href: '/press' },
          ]
        },
        design: {
          theme: 'luxury', backgroundColor: 'bg-gray-900', textColor: 'text-gold-400',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  // --- Restaurant Template --- //
  {
    id: 'restaurant',
    title: 'Restaurant',
    description: 'A delicious, inviting template for restaurants, cafes, and bars.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    hint: 'This is a hint for the AI to generate content for the restaurant template.',
    aiInsight: 'This template is designed to showcase your menu and attract diners.',
    stats: {
      visitors: '6k',
      leads: '600',
      conversion: '10%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'Bella Vista',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8L32 16L24 24L16 16L24 8Z" fill="currentColor"/><path d="M16 24L24 32L32 24H16Z" fill="currentColor"/></svg>`
          },
          links: [
            { label: 'Menu', href: '#menu' },
            { label: 'Reservations', href: '#reservations' },
            { label: 'Events', href: '#events' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' },
          ],
          actions: [
            { label: 'Make Reservation', href: '#reservation', style: 'primary' },
            { label: 'Order Online', href: '#order', style: 'secondary' }
          ]
        },
        design: {
          theme: 'warm', backgroundColor: 'bg-amber-50', textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Authentic Italian Cuisine in the Heart of the City',
          subtitle: 'Experience the finest Italian dining with fresh ingredients, traditional recipes, and warm hospitality in our elegant atmosphere. Family-owned since 1985.',
          cta: 'Make Reservation',
          secondaryCta: 'View Menu',
          socialProof: 'Rated #1 Italian Restaurant',
          image: '/images/restaurant-hero.jpg',
          badges: [
            { label: 'Michelin recommended', color: 'gold' },
            { label: 'Family-owned since 1985', color: 'amber' },
            { label: 'Fresh daily ingredients', color: 'green' }
          ]
        },
        design: {
          theme: 'warm', layout: 'split', backgroundColor: 'bg-gradient-to-r from-amber-600 to-orange-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 29,
        type: 'stats',
        content: {
          title: 'A Legacy of Excellence',
          subtitle: 'Numbers that tell our story',
          stats: [
            { value: '40+', label: 'Years of Service', icon: 'calendar' },
            { value: '500+', label: 'Daily Guests', icon: 'users' },
            { value: '4.8/5', label: 'Customer Rating', icon: 'star' },
            { value: '50+', label: 'Signature Dishes', icon: 'chef-hat' },
          ],
        },
        design: {
          theme: 'warm',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 30,
        type: 'gallery',
        content: {
          title: 'Signature Dishes',
          subtitle: 'A taste of Italy in every bite',
          images: [
            {
              src: '/images/dish-pasta-carbonara.jpg',
              alt: 'Pasta Carbonara',
              category: 'Pasta',
              price: '$24',
              description: 'Traditional Roman carbonara with pancetta and pecorino'
            },
            {
              src: '/images/dish-osso-buco.jpg',
              alt: 'Osso Buco',
              category: 'Main Course',
              price: '$38',
              description: 'Braised veal shanks with saffron risotto'
            },
            {
              src: '/images/dish-tiramisu.jpg',
              alt: 'Tiramisu',
              category: 'Dessert',
              price: '$12',
              description: 'Classic tiramisu made with mascarpone and espresso'
            },
            {
              src: '/images/dish-bruschetta.jpg',
              alt: 'Bruschetta Trio',
              category: 'Appetizer',
              price: '$16',
              description: 'Three varieties of our famous bruschetta'
            },
          ],
        },
        design: {
          theme: 'warm',
          backgroundColor: 'bg-amber-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'features',
        content: {
          title: 'The Bella Vista Experience',
          subtitle: 'What makes us special',
          features: [
            {
              icon: 'leaf',
              title: 'Fresh Ingredients',
              description: 'Daily sourced ingredients from local farms and imported specialties from Italy'
            },
            {
              icon: 'book',
              title: 'Traditional Recipes',
              description: 'Authentic family recipes passed down through generations of Italian chefs'
            },
            {
              icon: 'wine',
              title: 'Wine Selection',
              description: 'Curated collection of Italian wines perfectly paired with our dishes'
            },
            {
              icon: 'users',
              title: 'Private Dining',
              description: 'Elegant private dining rooms for special occasions and business meetings'
            }
          ]
        },
        design: {
          theme: 'warm', layout: 'default', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 31,
        type: 'team',
        content: {
          title: 'Meet Our Culinary Team',
          subtitle: 'Passionate chefs bringing authentic Italian flavors to life',
          members: [
            {
              name: 'Chef Marco Rossi',
              role: 'Executive Chef & Owner',
              bio: 'Third-generation chef from Tuscany with 25+ years experience. Trained in Milan and Rome.',
              image: '/images/chef-marco.jpg',
              specialties: ['Tuscan Cuisine', 'Pasta Making', 'Wine Pairing'],
              awards: ['James Beard Nominee', 'Michelin Recognition', 'Best Italian Chef 2023']
            },
            {
              name: 'Chef Isabella Conti',
              role: 'Sous Chef',
              bio: 'Sicilian-born chef specializing in southern Italian cuisine and seafood preparations.',
              image: '/images/chef-isabella.jpg',
              specialties: ['Sicilian Cuisine', 'Seafood', 'Desserts'],
              awards: ['Rising Chef Award', 'Culinary Institute Graduate']
            },
            {
              name: 'Sommelier Antonio Bianchi',
              role: 'Wine Director',
              bio: 'Certified sommelier with extensive knowledge of Italian wines and perfect pairings.',
              image: '/images/sommelier-antonio.jpg',
              specialties: ['Italian Wines', 'Wine Pairing', 'Vineyard Relations'],
              awards: ['Master Sommelier Candidate', 'Wine Spectator Recognition']
            }
          ]
        },
        design: {
          theme: 'warm',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'testimonials',
        content: {
          title: 'What Our Guests Say',
          testimonials: [
            {
              quote: 'The best Italian food outside of Italy! The pasta is made fresh daily and the service is impeccable.',
              author: 'Maria Rodriguez',
              role: 'Food Critic'
            },
            {
              quote: 'Bella Vista never disappoints. The atmosphere is perfect for date nights and the wine selection is outstanding.',
              author: 'James Wilson',
              role: 'Regular Customer'
            },
            {
              quote: 'We had our anniversary dinner here and it was magical. The staff made us feel like family.',
              author: 'Sarah & Tom Chen',
              role: 'Anniversary Guests'
            }
          ]
        },
        design: {
          theme: 'warm', backgroundColor: 'bg-amber-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'pricing',
        content: {
          title: 'Our Menu',
          subtitle: 'A taste of Italy',
          plans: [
            {
              name: 'Pasta',
              price: '$15',
              frequency: ' - $25',
              description: 'Freshly made pasta with a variety of sauces.',
              features: ['Spaghetti', 'Fettuccine', 'Penne', 'Ravioli'],
              cta: 'View Menu'
            },
            {
              name: 'Pizza',
              price: '$12',
              frequency: ' - $20',
              description: 'Wood-fired pizza with a variety of toppings.',
              features: ['Margherita', 'Pepperoni', 'Mushroom', 'Supreme'],
              cta: 'View Menu',
              featured: true
            },
            {
              name: 'Dessert',
              price: '$8',
              frequency: ' - $12',
              description: 'Sweet treats to end your meal.',
              features: ['Tiramisu', 'Cannoli', 'Gelato', 'Panna Cotta'],
              cta: 'View Menu'
            }
          ]
        },
        design: {
          theme: 'warm', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'Do you take reservations?',
              answer: 'Yes, we take reservations for parties of all sizes. Please call us or use our online reservation system to book your table.'
            },
            {
              question: 'Do you have a dress code?',
              answer: 'We do not have a strict dress code, but we recommend smart casual attire.'
            },
            {
              question: 'Do you offer takeout and delivery?',
              answer: 'Yes, we offer both takeout and delivery. You can place your order online or by calling the restaurant.'
            }
          ]
        },
        design: {
          theme: 'warm', backgroundColor: 'bg-amber-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'contact',
        content: {
          title: 'Ready for an Unforgettable Dining Experience?',
          description: 'Reserve your table today and discover why Bella Vista is the city\'s favorite Italian restaurant.',
          cta: 'Make Reservation',
          formId: 'restaurant-contact'
        },
        design: {
          theme: 'warm', backgroundColor: 'bg-amber-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'footer',
        content: {
          title: 'Bella Vista',
          description: 'Authentic Italian dining since 1985',
          links: [
            { label: 'Menu', href: '/menu' },
            { label: 'Hours', href: '/hours' },
            { label: 'Location', href: '/location' },
            { label: 'Catering', href: '/catering' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-gray-800', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  {
    id: "personal-portfolio-pro",
    title: "Personal Portfolio Pro",
    description: "A sophisticated, high-impact template for elite designers, developers, and creative professionals to showcase their work and win clients.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    hint: "Generate content for a top-tier freelance product designer and developer with a focus on aesthetics and clean code.",
    aiInsight: "This template is a conversion funnel. It establishes credibility with past clients, showcases undeniable proof with a portfolio, explains the value proposition with a clear process, then makes a personal connection before a strong call to action.",
    stats: {
      visitors: "8k",
      leads: "950",
      conversion: "11.8%"
    },
    components: [
      {
        id: 1,
        type: "header",
        name: "Main Navigation",
        content: {
          title: "Alex Morgan",
          links: [
            { label: "Work", "href": "#work" },
            { label: "Process", "href": "#process" },
            { label: "About", "href": "#about" },
            { label: "Contact", "href": "#contact" }
          ],
          cta: "Available for Work",
          ctaUrl: "#contact"
        },
        design: {
          theme: "dark",
          "backgroundColor": "rgba(15, 23, 42, 0.8)",
          "textColor": "#F8FAFC",
          "customStyles": "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);",
          "position": { type: "sticky", "top": 0, "zIndex": 50 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: "hero",
        name: "Hero Section",
        content: {
          title: "A design-led developer building products for the next generation.",
          "subtitle": "I specialize in crafting elegant, high-performance digital experiences where design and code unite. Let's build something exceptional together.",
          cta: "View My Work",
          ctaUrl: "#work",
          "secondaryCta": "Get In Touch",
          "secondaryCtaUrl": "#contact",
          image: "https://images.unsplash.com/photo-1557053910-d9eadeed1c58"
        },
        design: {
          theme: "dark",
          "layout": "split",
          "backgroundColor": "#0F172A",
          "textColor": "#F8FAFC",
          "accentColor": "#F59E0B",
          padding: { "top": 120, "bottom": 120 },
          "animation": { type: "fadeIn", "duration": 1000 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: "brands",
        name: "Social Proof - Clients",
        content: { title: "I've had the pleasure of working with" },
        design: {
          "backgroundColor": "#1E293B", padding: { "top": 60, "bottom": 60 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: "portfolio",
        name: "Featured Work",
        content: {
          title: "Selected Work",
          "subtitle": "A collection of projects I'm proud of.",
          "projects": [
            {
              id: "proj-1", title: "Quantum - SaaS Platform Redesign", "category": "UI/UX & Web Development",
              description: "Led the end-to-end redesign of a complex analytics dashboard, resulting in a 40% increase in user engagement.",
              image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71", "href": "#"
            },
            {
              id: "proj-2", title: "Aura - Meditation App", "category": "Mobile App & Branding",
              description: "Designed and built a cross-platform mobile app from scratch, now with over 100k downloads on the App Store.",
              image: "https://images.unsplash.com/photo-1551650975-87deedd944c3", "href": "#"
            },
            {
              id: "proj-3", title: "Nomad - E-commerce Brand", "category": "Branding & Web Design",
              description: "Crafted a new brand identity and Shopify theme for a sustainable travel gear company, boosting conversions by 25%.",
              image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546", "href": "#"
            }
          ]
        },
        design: {
          "backgroundColor": "#0F172A", "textColor": "#F8FAFC", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 11,
        type: "process",
        name: "My Process",
        content: {
          title: "My Approach to Building Great Products",
          "subtitle": "A structured and collaborative process ensures we deliver outstanding results on time.",
          "steps": [
            { "number": "01", title: "Discovery & Strategy", description: "We dive deep to understand your goals, audience, and challenges to define a clear roadmap." },
            { "number": "02", title: "Design & Prototyping", description: "I create wireframes and high-fidelity, interactive prototypes to visualize the experience before any code is written." },
            { "number": "03", title: "Development & Testing", description: "I build a fast, scalable, and pixel-perfect product using modern technologies, with rigorous testing." },
            { "number": "04", title: "Launch & Iterate", description: "We deploy the product and use data and feedback to make continuous improvements." }
          ]
        },
        design: {
          "backgroundColor": "#1E293B", "textColor": "#F8FAFC", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: "testimonials",
        name: "Client Testimonials",
        content: {
          title: "What My Clients Say",
          "testimonials": [
            {
              "quote": "Alex is that rare talent who is both a world-class designer and an incredible engineer. He took our vague idea and turned it into a beautiful, functional product that our users love. The process was seamless.",
              "author": "Jennifer Lee", "role": "CEO, Quantum", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2", "rating": 5
            },
            {
              "quote": "Working with Alex was a game-changer for our brand. He has an impeccable eye for detail and was able to translate our vision into a stunning website that perfectly captures our ethos.",
              "author": "Michael Brown", "role": "Founder, Nomad", image: "https://images.unsplash.com/photo-1552058544-f2b08422138a", "rating": 5
            }
          ]
        },
        design: {
          "backgroundColor": "#0F172A", "textColor": "#F8FAFC", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 12,
        type: "authorBox",
        name: "About Me",
        content: {
          title: "A Bit About Me",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          description: "I'm Alex, a product designer and developer with over 8 years of experience creating digital products that are both beautiful and user-centric. I thrive at the intersection of design and technology, and I'm passionate about building tools that solve real-world problems. When I'm not coding or designing, you can find me hiking with my dog or exploring new coffee shops.",
          socials: [
            { label: "LinkedIn", "href": "#" },
            { label: "GitHub", "href": "#" },
            { label: "Dribbble", "href": "#" }
          ]
        },
        design: {
          "backgroundColor": "#1E293B", "textColor": "#F8FAFC", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 13,
        type: "cta",
        name: "Final Call to Action",
        content: {
          title: "Have a project in mind?",
          "subtitle": "Let's create something extraordinary together.",
          cta: "Start a Conversation", ctaUrl: "#contact"
        },
        design: {
          theme: "dark", "backgroundColor": "#8B5CF6", "textColor": "#FFFFFF",
          padding: { "top": 80, "bottom": 80 }, "border": { "radius": 16 }, "animation": { type: "pulse" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: "contact",
        name: "Contact Form",
        content: {
          "fields": [
            { type: "text", label: "Your Name", "placeholder": "What should I call you?", "required": true },
            { type: "email", label: "Your Email", "placeholder": "Where can I reach you?", "required": true },
            { type: "select", label: "Project Type", "options": ["Web Design & Dev", "Mobile App", "Branding", "Consulting", "Other"] },
            { type: "textarea", label: "Project Details", "placeholder": "Tell me a little about your project...", "required": true }
          ]
        },
        design: {
          "backgroundColor": "#0F172A", "textColor": "#F8FAFC", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: "footer",
        name: "Page Footer",
        content: {
          description: "Living at the intersection of design and code.",
          socials: [
            { label: "LinkedIn", "href": "#" },
            { label: "GitHub", "href": "#" },
            { label: "Dribbble", "href": "#" },
            { label: "Twitter", "href": "#" }
          ],
          copyright: "© 2024 Alex Morgan. All rights reserved."
        },
        design: {
          theme: "dark", "backgroundColor": "#0F172A", "textColor": "#94A3B8", padding: { "top": 60, "bottom": 60 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      }
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'A professional, trustworthy template for clinics, hospitals, and medical professionals.',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907',
    hint: 'This is a hint for the AI to generate content for the healthcare template.',
    aiInsight: 'This template is designed to provide clear information and build patient trust.',
    stats: {
      visitors: '8k',
      leads: '700',
      conversion: '8.75%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'MediCare Plus',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8L32 16H28V24H32L24 32L16 24H20V16H16L24 8Z" fill="currentColor"/><circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2" fill="none"/></svg>`
          },
          links: [
            { label: 'Services', href: '#services' },
            { label: 'Doctors', href: '#doctors' },
            { label: 'Appointments', href: '#appointments' },
            { label: 'Insurance', href: '#insurance' },
            { label: 'Contact', href: '#contact' },
          ],
          actions: [
            { label: 'Book Appointment', href: '#appointment', style: 'primary' },
            { label: 'Patient Portal', href: '#portal', style: 'secondary' }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-blue-50', textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Compassionate Care, Advanced Medicine',
          subtitle: 'Providing exceptional healthcare services with state-of-the-art technology and a team of experienced medical professionals dedicated to your wellbeing and recovery.',
          cta: 'Book Appointment',
          secondaryCta: 'Emergency Care',
          socialProof: '25+ years serving the community',
          image: '/images/healthcare-hero.jpg',
          badges: [
            { label: 'Board-certified doctors', color: 'blue' },
            { label: '24/7 emergency care', color: 'red' },
            { label: 'Insurance accepted', color: 'green' }
          ]
        },
        design: {
          theme: 'corporate', layout: 'split', backgroundColor: 'bg-gradient-to-r from-blue-600 to-teal-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 25,
        type: 'stats',
        content: {
          title: 'Trusted Healthcare Provider',
          subtitle: 'Numbers that reflect our commitment to patient care',
          stats: [
            { value: '25+', label: 'Years of Service', icon: 'calendar' },
            { value: '50+', label: 'Medical Specialists', icon: 'user-md' },
            { value: '100,000+', label: 'Patients Served', icon: 'users' },
            { value: '98%', label: 'Patient Satisfaction', icon: 'star' },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 26,
        type: 'brands',
        content: {
          title: 'Accreditations & Insurance Partners',
          subtitle: 'Recognized excellence and comprehensive coverage',
          brands: [
            { name: 'Joint Commission', logo: '/images/accred-joint-commission.png' },
            { name: 'Blue Cross Blue Shield', logo: '/images/insurance-bcbs.png' },
            { name: 'Aetna', logo: '/images/insurance-aetna.png' },
            { name: 'Medicare', logo: '/images/insurance-medicare.png' },
            { name: 'Medicaid', logo: '/images/insurance-medicaid.png' },
            { name: 'United Healthcare', logo: '/images/insurance-united.png' },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-blue-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'features',
        content: {
          title: 'Our Medical Services',
          subtitle: 'Comprehensive healthcare for you and your family',
          features: [
            {
              icon: 'stethoscope',
              title: 'Primary Care',
              description: 'Comprehensive primary care services including preventive care, health screenings, and chronic disease management'
            },
            {
              icon: 'heart',
              title: 'Specialist Care',
              description: 'Access to board-certified specialists in cardiology, orthopedics, dermatology, and more'
            },
            {
              icon: 'ambulance',
              title: 'Emergency Services',
              description: '24/7 emergency care with rapid response times and advanced life support capabilities'
            },
            {
              icon: 'x-ray',
              title: 'Diagnostic Imaging',
              description: 'State-of-the-art imaging technology including MRI, CT scans, X-rays, and ultrasound'
            },
            {
              icon: 'flask',
              title: 'Laboratory Services',
              description: 'Full-service laboratory with rapid test results and comprehensive diagnostic capabilities'
            },
            {
              icon: 'video',
              title: 'Telemedicine',
              description: 'Convenient virtual consultations for routine care and follow-up appointments'
            }
          ]
        },
        design: {
          theme: 'corporate', layout: 'default', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 27,
        type: 'team',
        content: {
          title: 'Meet Our Medical Team',
          subtitle: 'Board-certified physicians and specialists dedicated to your health',
          members: [
            {
              name: 'Dr. Sarah Johnson',
              role: 'Chief Medical Officer',
              bio: 'Board-certified internal medicine physician with 20+ years experience. Harvard Medical School graduate.',
              image: '/images/doctor-sarah.jpg',
              specialties: ['Internal Medicine', 'Preventive Care', 'Chronic Disease Management'],
              credentials: ['MD', 'FACP', 'Board Certified Internal Medicine']
            },
            {
              name: 'Dr. Michael Chen',
              role: 'Cardiologist',
              bio: 'Leading cardiologist specializing in interventional cardiology and heart disease prevention.',
              image: '/images/doctor-michael.jpg',
              specialties: ['Cardiology', 'Interventional Procedures', 'Heart Disease Prevention'],
              credentials: ['MD', 'FACC', 'Board Certified Cardiology']
            },
            {
              name: 'Dr. Emily Rodriguez',
              role: 'Emergency Medicine Physician',
              bio: 'Emergency medicine specialist with expertise in trauma care and critical care medicine.',
              image: '/images/doctor-emily.jpg',
              specialties: ['Emergency Medicine', 'Trauma Care', 'Critical Care'],
              credentials: ['MD', 'FACEP', 'Board Certified Emergency Medicine']
            },
            {
              name: 'Dr. David Thompson',
              role: 'Orthopedic Surgeon',
              bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement surgery.',
              image: '/images/doctor-david.jpg',
              specialties: ['Orthopedic Surgery', 'Sports Medicine', 'Joint Replacement'],
              credentials: ['MD', 'FAAOS', 'Board Certified Orthopedic Surgery']
            }
          ]
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'testimonials',
        content: {
          title: 'Patient Testimonials',
          testimonials: [
            {
              quote: 'The care I received at MediCare Plus was exceptional. The staff was compassionate and the facilities are top-notch.',
              author: 'Patricia Williams',
              role: 'Patient'
            },
            {
              quote: 'Dr. Johnson and his team saved my life. I cannot thank them enough for their expertise and dedication.',
              author: 'Robert Martinez',
              role: 'Patient'
            },
            {
              quote: 'From routine checkups to emergency care, MediCare Plus has been our family\'s trusted healthcare provider for years.',
              author: 'The Thompson Family',
              role: 'Patients'
            }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-blue-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'pricing',
        content: {
          title: 'Our Services',
          subtitle: 'Affordable healthcare for everyone',
          plans: [
            {
              name: 'Primary Care',
              price: 'Varies',
              frequency: '',
              description: 'Comprehensive primary care services.',
              features: ['Preventive care', 'Health screenings', 'Chronic disease management', 'Sick visits'],
              cta: 'Book Appointment'
            },
            {
              name: 'Specialist Care',
              price: 'Varies',
              frequency: '',
              description: 'Access to board-certified specialists.',
              features: ['Cardiology', 'Orthopedics', 'Dermatology', 'And more'],
              cta: 'Book Appointment',
              featured: true
            },
            {
              name: 'Emergency Services',
              price: 'Varies',
              frequency: '',
              description: '24/7 emergency care.',
              features: ['Rapid response times', 'Advanced life support', 'State-of-the-art equipment', 'Experienced team'],
              cta: 'Call 911'
            }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'What insurance do you accept?',
              answer: 'We accept most major insurance plans. Please contact us to verify your coverage.'
            },
            {
              question: 'What are your hours?',
              answer: 'Our primary care clinic is open Monday-Friday from 8am-5pm. Our emergency room is open 24/7.'
            },
            {
              question: 'How do I make an appointment?',
              answer: 'You can make an appointment by calling our office or using our online booking system.'
            }
          ]
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-blue-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'contact',
        content: {
          title: 'Ready to Schedule Your Appointment?',
          description: 'Contact us today to schedule an appointment or learn more about our medical services.',
          cta: 'Book Appointment',
          formId: 'healthcare-contact'
        },
        design: {
          theme: 'corporate', backgroundColor: 'bg-blue-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'footer',
        content: {
          title: 'MediCare Plus',
          description: 'Your health, our priority',
          links: [
            { label: 'Patient Portal', href: '/portal' },
            { label: 'Insurance', href: '/insurance' },
            { label: 'Locations', href: '/locations' },
            { label: 'Emergency', href: '/emergency' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-gray-800', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  {
    id: "nonprofit-pro",
    title: "Nonprofit Pro",
    description: "A heartfelt, high-trust template for nonprofit organizations, optimized to inspire action and drive donations.",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433",
    hint: "Generate content for a nonprofit focused on education, health, and clean water in developing communities.",
    aiInsight: "This template follows an emotional and logical funnel: Hook with a powerful mission, build trust with transparent stats, show the impact through stories, and then provide clear, compelling ways to give.",
    stats: {
      visitors: "12k",
      leads: "2.5k",
      conversion: "20.8%"
    },
    components: [
      {
        id: 1,
        type: "header",
        name: "Main Navigation",
        content: {
          title: "The Horizon Project",
          links: [
            { label: "Our Work", "href": "#work" },
            { label: "Our Impact", "href": "#impact" },
            { label: "Get Involved", "href": "#involved" }
          ],
          cta: "Donate Now",
          ctaUrl: "#donate"
        },
        design: {
          theme: "nature",
          "backgroundColor": "rgba(255, 255, 255, 0.9)",
          "textColor": "#064E3B",
          "customStyles": "backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);",
          "position": { type: "sticky", "top": 0, "zIndex": 50 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: "hero",
        name: "Hero Section",
        content: {
          title: "Every Gift Creates a Future.",
          "subtitle": "Join us in providing education, healthcare, and clean water to communities in need. Your support builds a brighter horizon for thousands.",
          cta: "Donate Now",
          ctaUrl: "#donate",
          "secondaryCta": "See Our Impact",
          "secondaryCtaUrl": "#impact",
          image: "https://images.unsplash.com/photo-1488521787991-ed7b2f28a727"
        },
        design: {
          theme: "nature",
          "layout": "centered",
          "backgroundColor": "#F0FDF4",
          padding: { "top": 100, "bottom": 100 },
          "animation": { type: "fadeIn", "duration": 1000 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: "metrics",
        name: "Trust & Transparency",
        content: {
          title: "Your Donation Makes a Real Difference",
          "stats": [
            { "value": "92¢", label: "Of Every Dollar", description: "Goes directly to our programs and the people we serve." },
            { "value": "50,000+", label: "Lives Changed", description: "Through our health, water, and education initiatives." },
            { "value": "12 Years", label: "Of Trusted Impact", description: "Creating sustainable change in over 8 countries." }
          ]
        },
        design: {
          "backgroundColor": "#059669",
          "textColor": "#FFFFFF",
          padding: { "top": 80, "bottom": 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: "features",
        name: "Our Work",
        content: {
          title: "Building the Foundations for a Better Future",
          "subtitle": "Our work is focused on three critical pillars that empower communities to thrive.",
          "features": [
            { "icon": "book-open", title: "Education for All", description: "We build schools, provide learning materials, and fund scholarships to give every child a chance to learn and grow." },
            { "icon": "heart", title: "Essential Healthcare", description: "Our mobile clinics deliver life-saving vaccinations, medical supplies, and health education to remote villages." },
            { "icon": "droplet", title: "Clean Water & Sanitation", description: "We construct wells and sanitation systems to provide access to clean, safe water, preventing disease and saving lives." }
          ]
        },
        design: {
          "backgroundColor": "#FFFFFF", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: "process",
        name: "The Journey of Your Gift",
        content: {
          title: "How Your Support Creates Change",
          "steps": [
            { "number": "01", title: "You Give", description: "You choose to make a generous donation to support a cause you believe in." },
            { "number": "02", title: "We Act", description: "We efficiently deploy 92% of your gift to fund projects on the ground, from building wells to buying schoolbooks." },
            { "number": "03", title: "Lives Are Changed", description: "Communities gain access to the resources they need to build healthier, more prosperous futures for themselves." }
          ]
        },
        design: {
          "backgroundColor": "#F0FDF4", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: "testimonials",
        name: "Stories of Hope",
        content: {
          title: "Voices from the Field",
          "testimonials": [
            {
              "quote": "My daughter is the first in our family to read and write. The school The Horizon Project built has given our entire village a new sense of hope for the future. We are so grateful.",
              "author": "Asha Patel", "role": "Mother in rural India", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2", "rating": 5
            }
          ]
        },
        design: {
          "layout": "split", "backgroundColor": "#FFFFFF", padding: { "top": 100, "bottom": 100 }, "animation": { type: "slideInUp" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: "pricing",
        name: "Ways to Give (Donate)",
        content: {
          title: "Choose Your Impact",
          "subtitle": "Your recurring gift provides the steady support we need to create lasting change.",
          "plans": [
            { name: "Sponsor a Student", "price": "$25", "frequency": "/month", description: "Fund a child's education for a year.", "features": ["School Supplies", "Uniform", "Daily Meal"], cta: "Give $25/mo" },
            { name: "Community Health", "price": "$50", "frequency": "/month", description: "Provide vital healthcare for a family.", "features": ["Vaccinations", "Medical Check-ups", "Health Education"], cta: "Give $50/mo", "featured": true },
            { name: "Water for a Village", "price": "$100", "frequency": "/month", description: "Contribute to a new clean water well.", "features": ["Well Construction", "Water Filters", "Hygiene Training"], cta: "Give $100/mo" }
          ]
        },
        design: {
          "backgroundColor": "#F0FDF4", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 11,
        type: "features",
        name: "Get Involved",
        content: {
          title: "More Ways to Help",
          "subtitle": "Your time and voice are just as valuable as your donation.",
          "features": [
            { "icon": "hand-heart", title: "Volunteer Your Time", description: "Join our team of passionate volunteers for local events or remote administrative support." },
            { "icon": "megaphone", title: "Start a Fundraiser", description: "Create your own fundraising page and rally your friends and family to support our cause." },
            { "icon": "share-2", title: "Spread the Word", description: "Follow us on social media and share our stories to raise awareness." }
          ]
        },
        design: {
          "backgroundColor": "#FFFFFF", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 12,
        type: "cta",
        name: "Final Appeal",
        content: {
          title: "A single act of kindness can change a life forever.",
          "subtitle": "Will you be the one to make a difference today?",
          cta: "Make a Life-Changing Gift",
          ctaUrl: "#donate"
        },
        design: {
          theme: "nature", "backgroundColor": "#DCFCE7", "textColor": "#064E3B",
          padding: { "top": 80, "bottom": 80 }, "border": { "radius": 16 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 13,
        type: "newsletter",
        name: "Stay Connected",
        content: {
          title: "Stay Connected to Our Mission",
          description: "Get updates from the field, stories of hope, and see the impact of your support. No spam, ever.",
          "fields": [
            { type: "email", label: "Email Address", "placeholder": "you@example.com", "required": true }
          ],
          cta: "Subscribe"
        },
        design: {
          "backgroundColor": "#FFFFFF", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: "footer",
        name: "Page Footer",
        content: {
          title: "The Horizon Project", description: "Building hope, creating futures.",
          links: [
            { label: "Annual Report", "href": "/report" },
            { label: "Financials", "href": "/financials" },
            { label: "Contact Us", "href": "/contact" }
          ],
          socials: [
            { label: "Facebook", "href": "#" },
            { label: "Instagram", "href": "#" },
            { label: "Twitter", "href": "#" }
          ],
          copyright: "© 2024 The Horizon Project. A registered 501(c)(3) organization."
        },
        design: {
          theme: "dark", "backgroundColor": "#064E3B", "textColor": "#F0FDF4",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      }
    ]
  },
  {
    id: "law-firm-pro",
    title: "Law Firm Pro",
    description: "An authoritative and professional template for elite law firms, engineered to build trust and generate high-value client consultations.",
    image: "https://images.unsplash.com/photo-1589994965851-a8f483d515f1",
    hint: "Generate content for a prestigious law firm specializing in personal injury, corporate law, and high-stakes litigation.",
    aiInsight: "This template follows a credibility funnel. It opens with a strong promise, backs it up with hard data, showcases the expert team, provides irrefutable proof through case results, and then makes it easy to take the next step.",
    "stats": {
      visitors: "10k",
      leads: "900",
      conversion: "9%"
    },
    components: [
      {
        id: 1,
        type: "header",
        name: "Main Navigation",
        content: {
          title: "Harrison & Grant LLP",
          links: [
            { label: "Practice Areas", "href": "#practice-areas" },
            { label: "Our Attorneys", "href": "#attorneys" },
            { label: "Case Results", "href": "#results" }
          ],
          cta: "Free Consultation",
          ctaUrl: "#contact"
        },
        design: {
          theme: "corporate",
          "backgroundColor": "rgba(255, 255, 255, 0.9)",
          "textColor": "#1E293B",
          "customStyles": "backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);",
          "position": { type: "sticky", "top": 0, "zIndex": 50 },
          "border": { "width": 1, "color": "rgba(226, 232, 240, 0.8)" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: "hero",
        name: "Hero Section",
        content: {
          title: "Your Advocates for Justice. Proven Results.",
          "subtitle": "For over 30 years, Harrison & Grant has successfully represented individuals and businesses in their most critical legal battles. We fight for you.",
          cta: "Request a Free Consultation",
          ctaUrl: "#contact",
          "secondaryCta": "See Our Results",
          "secondaryCtaUrl": "#results",
          image: "https://images.unsplash.com/photo-1589829545856-d10d3e185df7"
        },
        design: {
          theme: "corporate",
          "layout": "split",
          "backgroundColor": "#F8FAFC",
          padding: { "top": 100, "bottom": 100 },
          "animation": { type: "fadeIn", "duration": 800 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: "metrics",
        name: "Firm Track Record",
        content: {
          title: "A Legacy of Success",
          "stats": [
            { "value": "$500M+", label: "Recovered for Clients", description: "Maximizing compensation for our clients is our priority." },
            { "value": "99%", label: "Case Success Rate", description: "Across all practice areas, based on favorable verdicts or settlements." },
            { "value": "50+ Yrs", label: "Combined Experience", description: "Our senior partners bring decades of courtroom expertise." }
          ]
        },
        design: {
          "backgroundColor": "#1E3A8A",
          "textColor": "#FFFFFF",
          padding: { "top": 80, "bottom": 80 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: "features",
        name: "Practice Areas",
        content: {
          title: "Comprehensive Legal Expertise",
          "subtitle": "Dedicated departments for your specific legal needs.",
          "features": [
            { "icon": "shield-alert", title: "Personal Injury Law", description: "Aggressively representing victims of negligence to secure maximum compensation. No fee unless we win." },
            { "icon": "briefcase", title: "Corporate & Business Law", description: "Strategic counsel for contracts, M&A, and complex commercial litigation." },
            { "icon": "gavel", title: "Criminal Defense", description: "Protecting your rights with a formidable defense in state and federal courts." }
          ]
        },
        design: {
          "backgroundColor": "#FFFFFF", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: "team",
        name: "Meet Our Attorneys",
        content: {
          title: "The Experience You Need on Your Side",
          "subtitle": "Our team of award-winning attorneys is recognized for their expertise and dedication.",
          "team": [
            {
              name: "James Harrison", "role": "Senior Partner, Head of Litigation",
              "bio": "A board-certified trial lawyer with over 30 years of experience, James has secured numerous multi-million dollar verdicts.",
              image: "https://images.unsplash.com/photo-1560250097-0b93528c311a", "social": { "linkedin": "#" }
            },
            {
              name: "Eleanor Grant", "role": "Managing Partner, Corporate Law",
              "bio": "Specializing in mergers and acquisitions, Eleanor has advised on over $10 billion in corporate transactions.",
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", "social": { "linkedin": "#" }
            }
          ]
        },
        design: {
          "backgroundColor": "#F8FAFC", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: "testimonials",
        name: "What Our Clients Say",
        content: {
          title: "A Reputation Built on Trust and Results",
          "testimonials": [
            {
              "quote": "After my accident, I was overwhelmed. Harrison & Grant handled everything with professionalism and compassion, and fought to get me a settlement that was far more than I ever expected. They truly changed my life.",
              "author": "Jennifer Adams", "role": "Personal Injury Client", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2", "rating": 5,
            }
          ]
        },
        design: {
          "backgroundColor": "#FFFFFF", padding: { "top": 100, "bottom": 100 }, "animation": { type: "slideInUp" },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 11,
        type: "portfolio",
        name: "Case Results",
        content: {
          title: "Landmark Case Results",
          "subtitle": "While past results do not guarantee future outcomes, our track record demonstrates our capability to handle complex, high-stakes cases.",
          "projects": [
            { id: "case-1", title: "Confidential v. Major Auto Manufacturer", "category": "Product Liability", description: "Result: $15 Million settlement for a client injured by a defective vehicle component.", "href": "#" },
            { id: "case-2", title: "State v. John D.", "category": "White-Collar Criminal Defense", description: "Result: Full acquittal for a client facing federal fraud charges after a two-week jury trial.", "href": "#" },
            { id: "case-3", title: "Acquisition of TechCorp", "category": "Corporate Law", description: "Advised on the successful $250 Million acquisition of a publicly-traded technology company.", "href": "#" }
          ]
        },
        design: {
          "backgroundColor": "#F8FAFC", "textColor": "#1E293B", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 12,
        type: "cta",
        name: "Contingency Fee CTA",
        content: {
          title: "For Personal Injury Cases: No Fee Unless We Win.",
          "subtitle": "You pay nothing upfront. We only get paid if we successfully recover compensation for you. There is no risk to you.",
          cta: "Start Your Free Case Review", ctaUrl: "#contact"
        },
        design: {
          theme: "corporate", "backgroundColor": "#E2E8F0", "textColor": "#1E293B",
          padding: { "top": 80, "bottom": 80 }, "border": { "radius": 16 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: "contact",
        name: "Contact Form",
        content: {
          title: "Tell Us About Your Case",
          description: "Contact us today for a free, confidential consultation. An attorney will review your information and get back to you within 24 hours.",
          "fields": [
            { type: "text", label: "Full Name", "placeholder": "John Doe", "required": true },
            { type: "email", label: "Email Address", "placeholder": "you@example.com", "required": true },
            { type: "tel", label: "Phone Number", "required": true },
            { type: "textarea", label: "Briefly describe your legal issue...", "required": true }
          ],
          cta: "Submit for a Free Consultation"
        },
        design: {
          "backgroundColor": "#FFFFFF", padding: { "top": 100, "bottom": 100 },
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: "footer",
        name: "Page Footer",
        content: {
          title: "Harrison & Grant LLP",
          description: "This website is for informational purposes only and does not constitute legal advice. Using this site or communicating with Harrison & Grant LLP through this site does not form an attorney/client relationship.",
          links: [
            { label: "Disclaimer", "href": "/disclaimer" },
            { label: "Privacy Policy", "href": "/privacy" },
            { label: "Contact", "href": "/contact" }
          ],
          socials: [
            { label: "LinkedIn", "href": "#" }
          ],
          copyright: "© 2024 Harrison & Grant LLP. All Rights Reserved. Attorney Advertising."
        },
        design: {
          theme: "dark", "backgroundColor": "#1E293B", "textColor": "#E2E8F0",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      }
    ]
  },
  {
    id: 'automotive',
    title: 'Automotive',
    description: 'A dynamic, sleek template for car dealerships and automotive businesses.',
    image: 'https://images.unsplash.com/photo-1542282088-fe84a45a4954',
    hint: 'This is a hint for the AI to generate content for the automotive template.',
    aiInsight: 'This template is designed to showcase vehicles and drive sales.',
    stats: {
      visitors: '10k',
      leads: '800',
      conversion: '8%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'AutoMax Motors',
          links: [
            { label: 'New Cars', href: '#new' },
            { label: 'Used Cars', href: '#used' },
            { label: 'Service', href: '#service' },
            { label: 'Finance', href: '#finance' },
          ],
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-red-50', textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Drive Your Dream Car Today',
          subtitle: 'Discover our extensive inventory of new and certified pre-owned vehicles. Expert financing, top-rated service, and unbeatable prices.',
          cta: 'Browse Inventory',
          secondaryCta: 'Get Pre-Approved',
          socialProof: '5-star customer satisfaction rating'
        },
        design: {
          theme: 'modern', layout: 'full-width-image', backgroundColor: 'bg-gradient-to-r from-red-600 to-orange-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'features',
        content: {
          title: 'Why Choose AutoMax Motors',
          subtitle: 'Your trusted automotive partner',
          features: [
            {
              title: 'Largest Selection',
              description: 'Over 500 new and certified pre-owned vehicles from top manufacturers'
            },
            {
              title: 'Expert Financing',
              description: 'Competitive rates and flexible terms with approval for all credit types'
            },
            {
              title: 'Certified Service',
              description: 'Factory-trained technicians using genuine parts and latest diagnostic equipment'
            },
            {
              title: 'Lifetime Warranty',
              description: 'Comprehensive warranty coverage for peace of mind on every purchase'
            }
          ]
        },
        design: {
          theme: 'modern', layout: 'default', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'testimonials',
        content: {
          title: 'Customer Reviews',
          testimonials: [
            {
              quote: 'Best car buying experience ever! The team was professional, honest, and helped me find the perfect vehicle within my budget.',
              author: 'Sarah Johnson',
              role: 'Satisfied Customer'
            },
            {
              quote: 'AutoMax Motors made financing easy and stress-free. I drove off the lot the same day with my dream car!',
              author: 'Mike Rodriguez',
              role: 'Happy Buyer'
            }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-red-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'pricing',
        content: {
          title: 'Our Vehicles',
          subtitle: 'Find your next car',
          plans: [
            {
              name: 'New Cars',
              price: 'Varies',
              frequency: '',
              description: 'The latest models from top manufacturers.',
              features: ['Full warranty', 'Latest technology', 'Financing available', 'Test drives available'],
              cta: 'Browse New Cars'
            },
            {
              name: 'Used Cars',
              price: 'Varies',
              frequency: '',
              description: 'Certified pre-owned vehicles.',
              features: ['Thoroughly inspected', 'Extended warranty available', 'Financing available', 'Test drives available'],
              cta: 'Browse Used Cars',
              featured: true
            },
            {
              name: 'Service',
              price: 'Varies',
              frequency: '',
              description: 'Expert service and maintenance.',
              features: ['Oil changes', 'Tire rotation', 'Brake service', 'And more'],
              cta: 'Schedule Service'
            }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'Do you offer financing?',
              answer: 'Yes, we offer competitive financing rates and flexible terms. You can get pre-approved online or in person.'
            },
            {
              question: 'Do you accept trade-ins?',
              answer: 'Yes, we accept trade-ins. We will give you a fair market value for your vehicle.'
            },
            {
              question: 'Do you have a service center?',
              answer: 'Yes, we have a state-of-the-art service center with factory-trained technicians.'
            }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-red-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'contact',
        content: {
          title: 'Ready to Find Your Perfect Car?',
          description: 'Visit our showroom or browse our online inventory. Our team is ready to help you drive away happy.',
          cta: 'Schedule Test Drive',
          formId: 'automotive-contact'
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-red-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'footer',
        content: {
          title: 'AutoMax Motors',
          description: 'Your automotive destination since 1985',
          links: [
            { label: 'Inventory', href: '/inventory' },
            { label: 'Service Center', href: '/service' },
            { label: 'Parts', href: '/parts' },
            { label: 'Contact', href: '/contact' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  {
    id: 'fashion',
    title: 'Fashion',
    description: 'A chic, stylish template for fashion brands and boutiques.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    hint: 'This is a hint for the AI to generate content for the fashion template.',
    aiInsight: 'This template is designed to showcase your collection and drive sales.',
    stats: {
      visitors: '18k',
      leads: '2k',
      conversion: '11.1%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'LUXE Boutique',
          links: [
            { label: 'New Arrivals', href: '#new' },
            { label: 'Collections', href: '#collections' },
            { label: 'Sale', href: '#sale' },
            { label: 'Lookbook', href: '#lookbook' },
          ],
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-pink-50', textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Elevate Your Style',
          subtitle: 'Discover the latest fashion trends and timeless pieces from emerging designers and luxury brands. Express your unique style with LUXE.',
          cta: 'Shop Collection',
          secondaryCta: 'View Lookbook',
          socialProof: 'Featured in Vogue & Elle'
        },
        design: {
          theme: 'elegant', layout: 'centered', backgroundColor: 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'features',
        content: {
          title: 'The LUXE Experience',
          subtitle: 'Fashion that defines you',
          features: [
            {
              title: 'Curated Collections',
              description: 'Hand-selected pieces from the world\'s most innovative designers and emerging talents'
            },
            {
              title: 'Personal Styling',
              description: 'Complimentary styling consultations to help you create the perfect wardrobe'
            },
            {
              title: 'Exclusive Access',
              description: 'First access to limited editions and designer collaborations before they sell out'
            },
            {
              title: 'Sustainable Fashion',
              description: 'Ethically sourced materials and sustainable production practices'
            }
          ]
        },
        design: {
          theme: 'elegant', layout: 'default', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'pricing',
        content: {
          title: 'Featured Collections',
          subtitle: 'This season\'s must-haves',
          plans: [
            {
              name: 'Everyday Essentials',
              price: '$89',
              frequency: ' - $299',
              description: 'Versatile pieces for every occasion',
              features: ['Premium fabrics', 'Timeless designs', 'Mix & match pieces', 'Care instructions included'],
              cta: 'Shop Essentials'
            },
            {
              name: 'Designer Collection',
              price: '$299',
              frequency: ' - $899',
              description: 'Luxury pieces from top designers',
              features: ['Limited edition items', 'Designer collaborations', 'Premium packaging', 'Authenticity guarantee'],
              cta: 'Shop Designer',
              featured: true
            },
            {
              name: 'Haute Couture',
              price: '$899',
              frequency: '+',
              description: 'Exclusive high-fashion pieces',
              features: ['One-of-a-kind pieces', 'Custom alterations', 'VIP styling service', 'Private showings'],
              cta: 'Shop Couture'
            }
          ]
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-pink-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'testimonials',
        content: {
          title: 'What Our Customers Say',
          testimonials: [
            {
              quote: 'I am so in love with my new dress! It is even more beautiful in person. I will definitely be a returning customer.',
              author: 'Jessica Rabbit',
              role: 'Fashionista'
            },
            {
              quote: 'The customer service was amazing. They were so helpful and answered all of my questions. I will be recommending this store to all of my friends.',
              author: 'Lola Bunny',
              role: 'Style Icon'
            }
          ]
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'What is your return policy?',
              answer: 'We offer a 30-day return policy on all unworn items with tags attached. Please see our returns page for more details.'
            },
            {
              question: 'How long does shipping take?',
              answer: 'Standard shipping takes 3-5 business days. Expedited shipping options are available at checkout.'
            },
            {
              question: 'Do you ship internationally?',
              answer: 'Yes, we ship to over 50 countries. Please see our shipping page for a full list of countries and rates.'
            }
          ]
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-pink-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'contact',
        content: {
          title: 'Get In Touch',
          description: 'Have a question or just want to say hello? We\'d love to hear from you.',
          cta: 'Contact Us',
          formId: 'fashion-contact'
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'footer',
        content: {
          title: 'LUXE Boutique',
          description: 'Where fashion meets artistry',
          links: [
            { label: 'Size Guide', href: '/size-guide' },
            { label: 'Style Blog', href: '/blog' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
          ]
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  {
    id: 'travel',
    title: 'Travel',
    description: 'An adventurous, inspiring template for travel agencies and bloggers.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    hint: 'This is a hint for the AI to generate content for the travel template.',
    aiInsight: 'This template is designed to inspire wanderlust and book trips.',
    stats: {
      visitors: '14k',
      leads: '1.5k',
      conversion: '10.7%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'Wanderlust Adventures',
          links: [
            { label: 'Destinations', href: '#destinations' },
            { label: 'Tours', href: '#tours' },
            { label: 'Travel Tips', href: '#tips' },
            { label: 'Book Now', href: '#book' },
          ],
        },
        design: {
          theme: 'nature', backgroundColor: 'bg-teal-50', textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Discover the World\'s Hidden Gems',
          subtitle: 'Create unforgettable memories with our expertly crafted travel experiences. From exotic destinations to cultural immersions, your adventure awaits.',
          cta: 'Explore Destinations',
          secondaryCta: 'Plan My Trip',
          socialProof: '50,000+ travelers served'
        },
        design: {
          theme: 'nature', layout: 'full-width-image', backgroundColor: 'bg-gradient-to-r from-teal-600 to-cyan-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'features',
        content: {
          title: 'Why Travel With Us',
          subtitle: 'Your journey, our expertise',
          features: [
            {
              title: 'Expert Local Guides',
              description: 'Knowledgeable local guides who share insider secrets and authentic cultural experiences'
            },
            {
              title: 'Customized Itineraries',
              description: 'Personalized travel plans tailored to your interests, budget, and travel style'
            },
            {
              title: '24/7 Support',
              description: 'Round-the-clock assistance and emergency support wherever your travels take you'
            },
            {
              title: 'Sustainable Tourism',
              description: 'Responsible travel practices that benefit local communities and preserve destinations'
            }
          ]
        },
        design: {
          theme: 'nature', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'pricing',
        content: {
          title: 'Our Tours',
          subtitle: 'Adventures for every budget',
          plans: [
            {
              name: 'City Tours',
              price: '$50',
              frequency: '/person',
              description: 'Explore the city with a local guide.',
              features: ['Walking tour', 'Historical sites', 'Local food tasting', 'Small group size'],
              cta: 'Book Now'
            },
            {
              name: 'Adventure Tours',
              price: '$150',
              frequency: '/person',
              description: 'Get your adrenaline pumping.',
              features: ['Hiking', 'Kayaking', 'Ziplining', 'Rock climbing'],
              cta: 'Book Now',
              featured: true
            },
            {
              name: 'Cultural Tours',
              price: '$100',
              frequency: '/person',
              description: 'Immerse yourself in the local culture.',
              features: ['Museum visits', 'Art galleries', 'Cooking classes', 'Local market tour'],
              cta: 'Book Now'
            }
          ]
        },
        design: {
          theme: 'nature', backgroundColor: 'bg-teal-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'What is your cancellation policy?',
              answer: 'We offer a full refund for cancellations made at least 24 hours in advance. Please see our cancellation policy for more details.'
            },
            {
              question: 'What should I bring on the tour?',
              answer: 'We recommend bringing comfortable shoes, a water bottle, and a camera. Please see the tour description for a full list of recommended items.'
            },
            {
              question: 'Are your tours accessible?',
              answer: 'We offer a variety of tours to accommodate different fitness levels and abilities. Please contact us to discuss your specific needs.'
            }
          ]
        },
        design: {
          theme: 'nature', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'contact',
        content: {
          title: 'Ready for an Adventure?',
          description: 'Contact us to book your tour or create a custom itinerary.',
          cta: 'Book Now',
          formId: 'travel-contact'
        },
        design: {
          theme: 'nature', backgroundColor: 'bg-teal-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'footer',
        content: {
          title: 'Wanderlust Adventures',
          description: 'Your journey, our expertise',
          links: [
            { label: 'Destinations', href: '/destinations' },
            { label: 'Tours', href: '/tours' },
            { label: 'Travel Tips', href: '/tips' },
            { label: 'Book Now', href: '/book' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  {
    id: 'showcase',
    title: 'Component Showcase',
    description: 'A demonstration template featuring all the new enhanced components.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    hint: 'This template showcases all the new component types available.',
    aiInsight: 'Perfect for demonstrating the full range of available components.',
    stats: {
      visitors: '25k',
      leads: '3k',
      conversion: '12%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'ComponentHub',
          links: [
            { label: 'Gallery', href: '#gallery' },
            { label: 'Team', href: '#team' },
            { label: 'Process', href: '#process' },
            { label: 'Contact', href: '#contact' },
          ],
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-white', textColor: 'text-gray-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Showcase of Enhanced Components',
          subtitle: 'Explore our comprehensive collection of modern, interactive components designed to create stunning websites.',
          cta: 'Explore Components',
          secondaryCta: 'View Gallery'
        },
        design: {
          theme: 'modern', layout: 'centered', backgroundColor: 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'counter',
        content: {
          title: 'Our Impact',
          subtitle: 'Numbers that showcase our success',
          counters: [
            { number: '500+', label: 'Components Created', suffix: '' },
            { number: '10k+', label: 'Websites Built', suffix: '' },
            { number: '99.9', label: 'Uptime Guarantee', suffix: '%' },
            { number: '24/7', label: 'Support Available', suffix: '' }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'gallery',
        content: {
          title: 'Project Gallery',
          subtitle: 'A showcase of our recent work and achievements',
          images: [
            { src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', alt: 'Project 1', caption: 'E-commerce Platform' },
            { src: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop', alt: 'Project 2', caption: 'Corporate Website' },
            { src: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop', alt: 'Project 3', caption: 'Mobile App' },
            { src: 'https://images.unsplash.com/photo-1560472354-a33c1b8b3b3e?w=400&h=300&fit=crop', alt: 'Project 4', caption: 'Dashboard Design' },
            { src: 'https://images.unsplash.com/photo-1560472355-a33c1b8b3b3e?w=400&h=300&fit=crop', alt: 'Project 5', caption: 'Landing Page' },
            { src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', alt: 'Project 6', caption: 'Brand Identity' }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'team',
        content: {
          title: 'Meet Our Expert Team',
          subtitle: 'The creative minds behind our innovative components',
          members: [
            { name: 'Alex Thompson', role: 'Lead Designer', bio: 'UI/UX expert with 10+ years experience' },
            { name: 'Sarah Kim', role: 'Frontend Developer', bio: 'React specialist and component architect' },
            { name: 'Mike Rodriguez', role: 'Backend Engineer', bio: 'Full-stack developer and API designer' },
            { name: 'Emma Chen', role: 'Product Manager', bio: 'Strategic thinker and user advocate' }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'process',
        content: {
          title: 'Our Development Process',
          subtitle: 'How we create exceptional components',
          steps: [
            { number: '01', title: 'Research', description: 'We analyze user needs and industry trends' },
            { number: '02', title: 'Design', description: 'Create beautiful, functional component designs' },
            { number: '03', title: 'Develop', description: 'Build components with modern technologies' },
            { number: '04', title: 'Test', description: 'Rigorous testing across devices and browsers' },
            { number: '05', title: 'Deploy', description: 'Launch components with full documentation' },
            { number: '06', title: 'Support', description: 'Ongoing maintenance and improvements' }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'stats',
        content: {
          title: 'Performance Metrics',
          subtitle: 'Our components deliver measurable results',
          stats: [
            { value: '50M+', label: 'Page Views', icon: 'users' },
            { value: '$10M+', label: 'Revenue Generated', icon: 'dollar' },
            { value: '99.9%', label: 'Reliability', icon: 'shield' },
            { value: '100+', label: 'Countries', icon: 'globe' }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'reviews',
        content: {
          title: 'What Developers Say',
          subtitle: 'Feedback from our component users',
          reviews: [
            { rating: 5, text: 'These components saved us months of development time. Absolutely fantastic!', author: 'John Developer', company: 'TechCorp' },
            { rating: 5, text: 'Beautiful designs and clean code. Perfect for our project needs.', author: 'Jane Designer', company: 'CreativeStudio' },
            { rating: 5, text: 'Outstanding documentation and support. Highly recommended!', author: 'Mike Builder', company: 'WebAgency' }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-gray-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: 'cta',
        content: {
          title: 'Ready to Build Something Amazing?',
          subtitle: 'Start using our enhanced components today and create stunning websites in minutes',
          primaryCta: 'Get Started Free',
          secondaryCta: 'View Documentation',
          features: ['No setup required', 'Full documentation', 'Community support']
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-gradient-to-r from-purple-600 to-blue-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 10,
        type: 'footer',
        content: {
          title: 'ComponentHub',
          description: 'Building the future of web components',
          links: [
            { label: 'Documentation', href: '/docs' },
            { label: 'Examples', href: '/examples' },
            { label: 'Support', href: '/support' },
            { label: 'Blog', href: '/blog' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-gray-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },

  // --- Tech Startup Template --- //
  {
    id: 'startup-tech',
    title: 'Tech Startup',
    description: 'A dynamic, modern template for tech startups and innovative companies.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    hint: 'Tech startup template with modern design and innovation focus.',
    aiInsight: 'Perfect for startups that want to showcase innovation, team, and rapid growth potential.',
    stats: {
      visitors: '25k',
      leads: '3.2k',
      conversion: '13%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'NEXUS',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="currentColor"/><circle cx="24" cy="24" r="12" fill="white"/><circle cx="24" cy="24" r="4" fill="currentColor"/></svg>`
          },
          links: [
            { label: 'Product', href: '#product' },
            { label: 'Technology', href: '#tech' },
            { label: 'Team', href: '#team' },
            { label: 'Investors', href: '#investors' },
            { label: 'Careers', href: '#careers' },
          ],
          actions: [
            { label: 'Get Early Access', href: '#waitlist', style: 'primary' },
            { label: 'Join Beta', href: '#beta', style: 'secondary' }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-slate-900', textColor: 'text-cyan-400',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'The Future of Work is Here',
          subtitle: 'NEXUS is building the next-generation collaboration platform that connects teams, AI, and workflows in ways never before possible. Join 10,000+ early adopters.',
          cta: 'Join Waitlist',
          secondaryCta: 'Watch Demo',
          socialProof: '10,000+ developers in beta',
          image: '/images/tech-startup-hero.jpg',
          badges: [
            { label: 'Y Combinator S23', color: 'orange' },
            { label: '$10M Series A', color: 'green' },
            { label: 'AI-powered', color: 'cyan' }
          ]
        },
        design: {
          theme: 'modern', layout: 'split', backgroundColor: 'bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'stats',
        content: {
          title: 'Rapid Growth Metrics',
          subtitle: 'Building the future, one user at a time',
          stats: [
            { value: '10K+', label: 'Beta Users', icon: 'users' },
            { value: '500%', label: 'Month-over-Month Growth', icon: 'trending-up' },
            { value: '$10M', label: 'Series A Funding', icon: 'dollar-sign' },
            { value: '15+', label: 'Team Members', icon: 'team' },
          ],
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-cyan-600',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'brands',
        content: {
          title: 'Backed by Leading Investors',
          subtitle: 'Trusted by top VCs and angel investors',
          brands: [
            { name: 'Y Combinator', logo: '/images/investor-yc.png' },
            { name: 'Andreessen Horowitz', logo: '/images/investor-a16z.png' },
            { name: 'Sequoia Capital', logo: '/images/investor-sequoia.png' },
            { name: 'First Round', logo: '/images/investor-firstround.png' },
            { name: 'Founders Fund', logo: '/images/investor-foundersfund.png' },
            { name: 'Accel', logo: '/images/investor-accel.png' },
          ],
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-slate-800',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'features',
        content: {
          title: 'Revolutionary Technology Stack',
          subtitle: 'Built for the next decade of work',
          features: [
            {
              icon: 'brain',
              title: 'AI-Native Architecture',
              description: 'Every feature is enhanced by machine learning, from smart scheduling to predictive analytics'
            },
            {
              icon: 'zap',
              title: 'Real-time Collaboration',
              description: 'Instant sync across all devices with sub-100ms latency and offline-first design'
            },
            {
              icon: 'shield',
              title: 'Enterprise Security',
              description: 'Zero-trust architecture with end-to-end encryption and SOC 2 Type II compliance'
            },
            {
              icon: 'puzzle',
              title: 'Universal Integrations',
              description: 'Connect with 1000+ tools through our GraphQL API and no-code workflow builder'
            },
            {
              icon: 'mobile',
              title: 'Mobile-First Design',
              description: 'Native iOS and Android apps with full feature parity and offline capabilities'
            },
            {
              icon: 'globe',
              title: 'Global Infrastructure',
              description: 'Edge computing network with 99.99% uptime across 50+ regions worldwide'
            }
          ]
        },
        design: {
          theme: 'modern', layout: 'default', backgroundColor: 'bg-slate-900', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'team',
        content: {
          title: 'World-Class Team',
          subtitle: 'Former leaders from top tech companies',
          members: [
            {
              name: 'Alex Chen',
              role: 'CEO & Co-Founder',
              bio: 'Former VP Engineering at Stripe. Built payment systems used by millions. Stanford CS, Y Combinator alum.',
              image: '/images/founder-alex.jpg',
              social: { linkedin: '#', twitter: '#' },
              previousCompanies: ['Stripe', 'Google', 'Stanford']
            },
            {
              name: 'Sarah Kim',
              role: 'CTO & Co-Founder',
              bio: 'Former Principal Engineer at Airbnb. Led infrastructure serving 500M+ users. MIT PhD in Distributed Systems.',
              image: '/images/founder-sarah.jpg',
              social: { linkedin: '#', twitter: '#' },
              previousCompanies: ['Airbnb', 'Facebook', 'MIT']
            },
            {
              name: 'Marcus Rodriguez',
              role: 'Head of Product',
              bio: 'Former Senior PM at Notion. Designed collaboration tools used by 20M+ users. Harvard MBA, ex-McKinsey.',
              image: '/images/team-marcus.jpg',
              social: { linkedin: '#' },
              previousCompanies: ['Notion', 'McKinsey', 'Harvard']
            },
            {
              name: 'Emily Watson',
              role: 'Head of Design',
              bio: 'Former Design Lead at Figma. Created design systems used by 4M+ designers. RISD graduate.',
              image: '/images/team-emily.jpg',
              social: { linkedin: '#', dribbble: '#' },
              previousCompanies: ['Figma', 'Uber', 'RISD']
            }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-slate-800', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'testimonials',
        content: {
          title: 'Early User Feedback',
          testimonials: [
            {
              quote: 'NEXUS has completely transformed how our team collaborates. The AI features save us 10+ hours per week.',
              author: 'David Park',
              role: 'Engineering Manager, Shopify'
            },
            {
              quote: 'Finally, a tool that actually understands how modern teams work. The real-time features are game-changing.',
              author: 'Lisa Chen',
              role: 'Product Lead, Discord'
            }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-cyan-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'cta',
        content: {
          title: 'Join the Future of Work',
          subtitle: 'Get early access to NEXUS and be part of the next generation of collaboration.',
          primaryCta: 'Join Waitlist',
          secondaryCta: 'Request Demo',
          features: ['Early access to beta', 'Founding member pricing', 'Direct feedback to founders', '24/7 priority support']
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-gradient-to-r from-cyan-600 to-blue-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 9,
        type: 'footer',
        content: {
          title: 'NEXUS',
          description: 'Building the future of work',
          links: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-slate-900', textColor: 'text-cyan-400',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },

  // --- Health & Wellness Template --- //
  {
    id: 'wellness-spa',
    title: 'Wellness & Spa',
    description: 'A serene, calming template for wellness centers, spas, and health practitioners.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
    hint: 'Wellness and spa template with calming colors and peaceful design.',
    aiInsight: 'Designed to create a sense of tranquility and trust for health and wellness businesses.',
    stats: {
      visitors: '14k',
      leads: '1.8k',
      conversion: '12.5%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'SERENITY',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8C30 14 36 20 36 28C36 34.6274 30.6274 40 24 40C17.3726 40 12 34.6274 12 28C12 20 18 14 24 8Z" fill="currentColor"/></svg>`
          },
          links: [
            { label: 'Services', href: '#services' },
            { label: 'Treatments', href: '#treatments' },
            { label: 'Wellness', href: '#wellness' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' },
          ],
          actions: [
            { label: 'Book Appointment', href: '#booking', style: 'primary' },
            { label: 'Gift Cards', href: '#gifts', style: 'secondary' }
          ]
        },
        design: {
          theme: 'nature', backgroundColor: 'bg-sage-50', textColor: 'text-sage-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: 'hero',
        content: {
          title: 'Restore Your Inner Balance',
          subtitle: 'Discover tranquility at Serenity Wellness Spa. Our holistic treatments combine ancient wisdom with modern techniques to rejuvenate your body, mind, and spirit.',
          cta: 'Book Your Retreat',
          secondaryCta: 'Explore Treatments',
          socialProof: 'Trusted by 5,000+ wellness seekers',
          image: '/images/wellness-hero.jpg',
          badges: [
            { label: 'Certified therapists', color: 'sage' },
            { label: 'Organic products only', color: 'green' },
            { label: '15+ years experience', color: 'earth' }
          ]
        },
        design: {
          theme: 'nature', layout: 'centered', backgroundColor: 'bg-gradient-to-b from-sage-100 to-earth-100', textColor: 'text-sage-900',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: 'stats',
        content: {
          title: 'Wellness by the Numbers',
          subtitle: 'Your journey to better health',
          stats: [
            { value: '5,000+', label: 'Happy Clients', icon: 'heart' },
            { value: '15+', label: 'Years of Excellence', icon: 'calendar' },
            { value: '25+', label: 'Treatment Options', icon: 'leaf' },
            { value: '98%', label: 'Client Satisfaction', icon: 'star' },
          ],
        },
        design: {
          theme: 'nature',
          backgroundColor: 'bg-sage-600',
          textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: 'features',
        content: {
          title: 'Holistic Wellness Services',
          subtitle: 'Treatments designed to heal and restore',
          features: [
            {
              icon: 'spa',
              title: 'Therapeutic Massage',
              description: 'Deep tissue, Swedish, hot stone, and prenatal massage by certified therapists'
            },
            {
              icon: 'leaf',
              title: 'Organic Facials',
              description: 'Customized facial treatments using only organic, cruelty-free skincare products'
            },
            {
              icon: 'meditation',
              title: 'Meditation & Yoga',
              description: 'Guided meditation sessions and yoga classes for all experience levels'
            },
            {
              icon: 'flower',
              title: 'Aromatherapy',
              description: 'Essential oil treatments to promote relaxation and emotional well-being'
            },
            {
              icon: 'water',
              title: 'Hydrotherapy',
              description: 'Healing water treatments including mineral baths and aqua therapy'
            },
            {
              icon: 'crystal',
              title: 'Energy Healing',
              description: 'Reiki, crystal therapy, and chakra balancing for spiritual wellness'
            }
          ]
        },
        design: {
          theme: 'nature', layout: 'default', backgroundColor: 'bg-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: 'gallery',
        content: {
          title: 'Peaceful Spaces',
          subtitle: 'Designed for relaxation and renewal',
          images: [
            {
              src: '/images/spa-massage-room.jpg',
              alt: 'Massage Room',
              category: 'Treatment Rooms',
              description: 'Tranquil massage rooms with natural lighting'
            },
            {
              src: '/images/spa-meditation-garden.jpg',
              alt: 'Meditation Garden',
              category: 'Outdoor Spaces',
              description: 'Peaceful garden for meditation and reflection'
            },
            {
              src: '/images/spa-relaxation-lounge.jpg',
              alt: 'Relaxation Lounge',
              category: 'Common Areas',
              description: 'Comfortable spaces to unwind before and after treatments'
            },
            {
              src: '/images/spa-hydrotherapy.jpg',
              alt: 'Hydrotherapy Pool',
              category: 'Water Therapy',
              description: 'Mineral-rich pools for therapeutic treatments'
            },
          ],
        },
        design: {
          theme: 'nature',
          backgroundColor: 'bg-sage-50',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: 'testimonials',
        content: {
          title: 'Client Experiences',
          testimonials: [
            {
              quote: 'Serenity Spa is my sanctuary. The therapists are incredibly skilled and the atmosphere is pure tranquility.',
              author: 'Maria Rodriguez',
              role: 'Regular Client'
            },
            {
              quote: 'I\'ve been coming here for 3 years. The organic treatments have transformed my skin and my overall well-being.',
              author: 'Jennifer Kim',
              role: 'Wellness Enthusiast'
            }
          ]
        },
        design: {
          theme: 'nature', backgroundColor: 'bg-earth-100',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 7,
        type: 'cta',
        content: {
          title: 'Begin Your Wellness Journey',
          subtitle: 'Book your first treatment and discover the path to inner peace and vitality.',
          primaryCta: 'Book Appointment',
          secondaryCta: 'View Packages',
          features: ['First-time client discount', 'Flexible scheduling', 'Customized treatment plans', 'Organic products only']
        },
        design: {
          theme: 'nature', backgroundColor: 'bg-sage-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 8,
        type: 'footer',
        content: {
          title: 'SERENITY',
          description: 'Your sanctuary for wellness and renewal',
          links: [
            { label: 'Services', href: '/services' },
            { label: 'Gift Cards', href: '/gifts' },
            { label: 'Membership', href: '/membership' },
            { label: 'Contact', href: '/contact' },
          ]
        },
        design: {
          theme: 'nature', backgroundColor: 'bg-sage-900', textColor: 'text-sage-100',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
  {
    id: "minimalist-portfolio",
    title: "Minimalist Portfolio",
    description: "A clean, minimalist template for creatives to showcase their work.",
    image: "/images/minimalist-portfolio-preview.jpg",
    hint: "This template is perfect for photographers, designers, and artists.",
    aiInsight: "The minimalist design focuses on the content, allowing the work to speak for itself. This approach is highly effective for creative professionals.",
    stats: {
      visitors: "5k",
      leads: "500",
      conversion: "10%",
    },
    components: [
      {
        id: 1,
        type: "header",
        content: {
          title: "Jane Doe",
          links: [
            { label: "Work", href: "#work" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ],
        },
        design: {
          theme: "light",
          backgroundColor: "bg-white",
          textColor: "text-gray-900",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 2,
        type: "hero",
        content: {
          title: "Visual Designer & Photographer",
          subtitle: "I create beautiful and functional designs that tell a story.",
        },
        design: {
          theme: "light",
          layout: "centered",
          backgroundColor: "bg-gray-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 3,
        type: "portfolio",
        content: {
          title: "Selected Work",
          projects: [
            {
              title: "Project One",
              category: "Web Design",
              image: "/images/portfolio-project-1.jpg",
              link: "#",
            },
            {
              title: "Project Two",
              category: "Photography",
              image: "/images/portfolio-project-2.jpg",
              link: "#",
            },
            {
              title: "Project Three",
              category: "Branding",
              image: "/images/portfolio-project-3.jpg",
              link: "#",
            },
          ],
        },
        design: {
          theme: "light",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 4,
        type: "about",
        content: {
          title: "About Me",
          description: "I am a passionate designer and photographer with a love for clean aesthetics and compelling narratives. I have over 10 years of experience helping brands connect with their audiences through beautiful and effective design.",
          image: "/images/about-me.jpg",
        },
        design: {
          theme: "light",
          backgroundColor: "bg-gray-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 5,
        type: "contact",
        content: {
          title: "Get in Touch",
          description: "I'm available for freelance projects and collaborations. Let's create something amazing together.",
          formId: "contact-form",
        },
        design: {
          theme: "light",
          backgroundColor: "bg-white",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 6,
        type: "footer",
        content: {
          copyright: "© 2025 Jane Doe. All rights reserved.",
          social: [
            { platform: "instagram", url: "#" },
            { platform: "linkedin", url: "#" },
            { platform: "twitter", url: "#" },
          ],
        },
        design: {
          theme: "light",
          backgroundColor: "bg-gray-50",
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
    ],
  },
];

// --- Enhanced Templates (Enterprise Template Enhancement System) ---
/**
 * websiteTemplates now exports the enhanced templates by default using the Enterprise Template Enhancement System.
 * The original array is available as websiteTemplatesRaw.
 * 
 * For synchronous access, use websiteTemplatesSync.
 * For enhanced templates, use getEnhancedWebsiteTemplates() which returns a Promise.
 */
import { templateEnhancementService, enhanceTemplate } from '@/lib/enterprise-template-enhancement';

// Synchronous export for backward compatibility
export const websiteTemplates = websiteTemplatesRaw;

// Enhanced templates getter function
export async function getEnhancedWebsiteTemplates(): Promise<Template[]> {
  try {
    const enhancedTemplates = await Promise.all(
      websiteTemplatesRaw.map(async (template) => {
        try {
          const enhanced = await enhanceTemplate(template, {
            enhancementLevel: 'professional',
            enabledFeatures: {
              enterpriseDesign: true,
              interactivity: true,
              analytics: true,
              personalization: false,
              gamification: false
            }
          });
          // Return as Template type for compatibility
          return enhanced as Template;
        } catch (error) {
          console.warn(`Failed to enhance template ${template.id}:`, error);
          // Return original template as fallback
          return template;
        }
      })
    );
    return enhancedTemplates;
  } catch (error) {
    console.error('Failed to enhance website templates:', error);
    // Return original templates as fallback
    return websiteTemplatesRaw;
  }
}

// Enhanced single template getter
export async function getEnhancedTemplate(templateId: string): Promise<Template | null> {
  const template = websiteTemplatesRaw.find(t => t.id === templateId);
  if (!template) return null;

  try {
    const enhanced = await enhanceTemplate(template, {
      enhancementLevel: 'professional',
      enabledFeatures: {
        enterpriseDesign: true,
        interactivity: true,
        analytics: true,
        personalization: false,
        gamification: false
      }
    });
    return enhanced as Template;
  } catch (error) {
    console.warn(`Failed to enhance template ${templateId}:`, error);
    return template;
  }
}