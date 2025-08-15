import type { Component } from '@/lib/types';

export interface Template {
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

export const websiteTemplates: Template[] = [
  {
    id: 'saas',
    title: 'SaaS Platform',
    description: 'A modern, professional template for SaaS companies.',
    image: '/images/placeholder.jpg',
    hint: 'This is a hint for the AI to generate content for the SaaS template.',
    aiInsight: 'This template is designed to maximize conversions for SaaS businesses.',
    stats: {
      visitors: '10k',
      leads: '1.2k',
      conversion: '12%',
    },
    components: [
      // --- HEADER ---
      {
        id: 1,
        metadata: {},
        type: 'header',
        content: {
          title: 'CloudFlow Pro',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor"></path></svg>`
          },
          links: [
            { label: 'Product', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Customers', href: '#testimonials' },
            { label: 'FAQ', href: '#faq' }
          ],
          actions: [
            { label: 'Start Free Trial', href: '#cta', style: 'primary' },
            { label: 'Login', href: '#', style: 'secondary' }
          ]
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        }
      },
      // --- HERO ---
      {
        id: 2,
        metadata: {},
        type: 'hero',
        content: {
          title: 'Automate Your Workflow. Grow Faster.',
          subtitle: 'CloudFlow Pro helps SaaS teams save 10+ hours a week with AI-powered automations. No code required.',
          cta: 'Start Free Trial',
          secondaryCta: 'See It In Action',
          socialProof: '10,000+ teams trust CloudFlow Pro',
          image: '/images/hero-dashboard.png',
          badges: [
            { label: '14-day free trial', color: 'green', icon: 'calendar' },
            { label: 'No credit card required', color: 'blue', icon: 'shield-check' }
          ]
        },
        design: {
          theme: 'corporate',
          layout: 'split',
          backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
          textColor: 'text-gray-900',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        }
      },
      // --- BRANDS ---
      {
        id: 3,
        metadata: {},
        type: 'brands',
        content: {
          title: 'Trusted by Leading Companies',
          subtitle: 'Join thousands of businesses automating their success',
          brands: [
            { name: 'TechCorp', logo: '/images/brand-techcorp.png' },
            { name: 'InnovateLabs', logo: '/images/brand-innovatelabs.png' },
            { name: 'GlobalSoft', logo: '/images/brand-globalsoft.png' },
            { name: 'FutureWorks', logo: '/images/brand-futureworks.png' },
            { name: 'NextGen', logo: '/images/brand-nextgen.png' },
            { name: 'ProSolutions', logo: '/images/brand-prosolutions.png' },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-gray-50',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
      // --- FEATURES ---
      {
        id: 4,
        metadata: {},
        type: 'features',
        content: {
          title: 'Why CloudFlow Pro?',
          subtitle: 'Everything you need to automate, optimize, and scale your business operations',
          features: [
            { icon: 'bolt', title: 'AI-Powered Automation', description: 'Automate repetitive tasks and focus on what matters most.' },
            { icon: 'chart-bar', title: 'Real-time Analytics', description: 'Get actionable insights and performance metrics instantly.' },
            { icon: 'lock-closed', title: 'Enterprise Security', description: 'Bank-grade encryption and advanced access controls.' },
            { icon: 'puzzle', title: 'Seamless Integrations', description: 'Connect with 500+ popular tools in one click.' },
            { icon: 'flow', title: 'Custom Workflows', description: 'Build complex automations visually, no code needed.' },
            { icon: 'support', title: '24/7 Support', description: 'Expert help, whenever you need it.' }
          ]
        },
        design: {
          theme: 'corporate',
          layout: 'default',
          backgroundColor: 'bg-white',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        }
      },
      // --- STATS ---
      {
        id: 5,
        metadata: {},
        type: 'stats',
        content: {
          title: 'Trusted by Industry Leaders',
          subtitle: 'Our platform delivers measurable results',
          stats: [
            { value: '10,000+', label: 'Active Users', icon: 'users' },
            { value: '80%', label: 'Time Saved', icon: 'clock' },
            { value: '99.99%', label: 'Uptime', icon: 'shield' },
            { value: '500+', label: 'Integrations', icon: 'globe' },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-white',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
      // --- GALLERY ---
      {
        id: 6,
        metadata: {},
        type: 'gallery',
        content: {
          title: 'See CloudFlow Pro in Action',
          images: [
            { src: '/images/gallery-1.jpg', alt: 'Dashboard Overview' },
            { src: '/images/gallery-2.jpg', alt: 'Automation Builder' },
            { src: '/images/gallery-3.jpg', alt: 'Analytics Panel' },
          ],
        },
        design: {
          theme: 'modern',
          backgroundColor: 'bg-gray-900',
          textColor: 'text-gray-100',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
      // --- TESTIMONIALS ---
      {
        id: 7,
        metadata: {},
        type: 'testimonials',
        content: {
          title: 'Loved by Teams Worldwide',
          testimonials: [
            { quote: 'CloudFlow Pro cut our onboarding time in half and saved us 15+ hours a week.', author: 'Sarah Chen', role: 'VP of Operations, TechCorp', image: '/images/testimonial-sarah.jpg' },
            { quote: 'The automations are so easy, our team was productive on day one.', author: 'Marcus Rodriguez', role: 'CEO, StartupXYZ', image: '/images/testimonial-marcus.jpg' },
            { quote: 'We scaled to 10,000 users with zero downtime. Support is fantastic.', author: 'Emily Watson', role: 'CTO, InnovateLabs', image: '/images/testimonial-emily.jpg' },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-gray-50',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
      // --- PRICING ---
      {
        id: 8,
        metadata: {},
        type: 'pricing',
        content: {
          title: 'Choose Your Plan',
          subtitle: 'Start free, scale as you grow',
          plans: [
            {
              name: 'Starter',
              price: '$0',
              frequency: '/month',
              description: 'Perfect for small teams getting started',
              features: ['Up to 5 users', '100 automations/month', 'Basic integrations', 'Email support'],
              cta: 'Start Free',
              badge: 'Free forever',
            },
            {
              name: 'Professional',
              price: '$49',
              frequency: '/month',
              description: 'For growing businesses that need more power',
              features: ['Up to 25 users', 'Unlimited automations', 'Advanced integrations', 'Priority support', 'Custom workflows'],
              cta: 'Start Trial',
              featured: true,
              badge: 'Most Popular',
              trustSignals: ['14-day free trial', 'No credit card required'],
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              frequency: '',
              description: 'For large organizations with complex needs',
              features: ['Unlimited users', 'White-label options', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
              cta: 'Contact Sales',
              badge: 'Custom',
            },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-white',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
      // --- PROCESS ---
      {
        id: 9,
        metadata: {},
        type: 'process',
        content: {
          title: 'Get Started in Minutes',
          subtitle: 'Simple setup process to get you up and running quickly',
          steps: [
            { number: '01', title: 'Sign Up', description: 'Create your account and choose your plan. No credit card required.' },
            { number: '02', title: 'Connect', description: 'Integrate with your favorite tools in seconds.' },
            { number: '03', title: 'Automate', description: 'Set up your first workflow with our visual builder.' },
            { number: '04', title: 'Grow', description: 'Launch and start saving time immediately.' },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-gray-50',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
      // --- TEAM ---
      {
        id: 10,
        metadata: {},
        type: 'team',
        content: {
          title: 'Meet the CloudFlow Pro Team',
          subtitle: 'The experts behind your automation success',
          members: [
            {
              name: 'Sarah Johnson',
              role: 'CEO & Founder',
              image: '/images/team-sarah.jpg',
              bio: 'Visionary leader with 15+ years in automation',
            },
            {
              name: 'Michael Chen',
              role: 'CTO',
              image: '/images/team-michael.jpg',
              bio: 'AI and automation technology expert',
            },
            {
              name: 'Emily Rodriguez',
              role: 'Head of Product',
              image: '/images/team-emily.jpg',
              bio: 'Product strategist focused on user experience',
            },
            {
              name: 'David Kim',
              role: 'VP of Engineering',
              image: '/images/team-david.jpg',
              bio: 'Engineering leader building scalable solutions',
            },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-white',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
      // --- ACCORDION (FAQ) ---
      {
        id: 11,
        metadata: {},
        type: 'accordion',
        content: {
          title: 'Frequently Asked Questions',
          subtitle: 'Everything you need to know about CloudFlow Pro',
          items: [
            { question: 'How quickly can I get started?', answer: 'You can be up and running in under 5 minutes. Our onboarding wizard guides you every step of the way.' },
            { question: 'Do you offer data migration assistance?', answer: 'Yes! Our team provides free data migration for all new customers.' },
            { question: 'What integrations are available?', answer: 'We support 500+ integrations, including Slack, Zapier, Salesforce, and more.' },
            { question: 'Is my data secure?', answer: 'Absolutely. We use bank-grade encryption, SOC 2 compliance, and regular security audits.' },
          ],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-white',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
      // --- CTA ---
      {
        id: 12,
        metadata: {},
        type: 'cta',
        content: {
          title: 'Ready to Transform Your Workflow?',
          subtitle: 'Join thousands of teams already saving time with CloudFlow Pro',
          primaryCta: 'Start Free Trial',
          secondaryCta: 'Schedule Demo',
          features: ['No credit card required', '14-day free trial', 'Cancel anytime'],
          trustBadges: ['SOC 2 Certified', 'GDPR Compliant', '24/7 Support'],
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-blue-600',
          textColor: 'text-gray-100',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
      // --- CONTACT ---
      {
        id: 13,
        metadata: {},
        type: 'contact',
        content: {
          title: 'Ready to Transform Your Business?',
          description: 'Join thousands of companies already using CloudFlow Pro to automate their success.',
          cta: 'Schedule Demo',
          formId: 'saas-contact',
        },
        design: {
          theme: 'corporate',
          backgroundColor: 'bg-blue-600',
          textColor: 'text-gray-100',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
      // --- FOOTER ---
      {
        id: 14,
        metadata: {},
        type: 'footer',
        content: {
          title: 'CloudFlow Pro',
          description: 'Intelligent automation for modern businesses',
          copyright: '© 2025 CloudFlow Pro. All rights reserved.',
          links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Security', href: '/security' },
            { label: 'API Docs', href: '/docs' },
          ],
        },
        design: {
          theme: 'dark',
          backgroundColor: 'bg-gray-900',
          textColor: 'text-gray-100',
          typography: {},
          colors: {},
          shadows: {},
          borders: {},
          interactions: {}
        },
      },
    ],
  },
  {  id: 'consulting',
  title: 'Advisory Studio',
  description: 'A sleek and modern web template tailored for consulting firms and strategic advisors.',
  image: '/images/placeholder.jpg',
  hint: 'This is a hint for the AI to generate custom, conversion-focused content for a high-end consulting firm website.',
  aiInsight: 'Crafted to boost inbound leads and establish authority in the consulting space.',
  stats: {
    visitors: '8.1k',
    leads: '950',
    conversion: '11.7%',
  },
  components: [
    {
      id: 1,
      metadata: {},
      type: 'header',
      content: {
        title: 'Advisory Studio',
        logo: {
          svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4L44 14v20L24 44L4 34V14L24 4z" fill="currentColor"/><path d="M24 12L36 18v12L24 36L12 30V18L24 12z" fill="white"/></svg>`
        },
        links: [
          { label: 'Solutions', href: '#solutions' },
          { label: 'Case Studies', href: '#cases' },
          { label: 'Experts', href: '#team' },
          { label: 'Resources', href: '#resources' },
          { label: 'Get in Touch', href: '#contact' },
        ],
        actions: [
          { label: 'Book Consultation', href: '#cta', style: 'primary' },
          { label: 'Download Guide', href: '#resources', style: 'secondary' }
        ]
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-white',
        textColor: 'text-gray-900',
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      id: 2,
      metadata: {},
      type: 'hero',
      content: {
        title: 'Elevate Your Competitive Edge',
        subtitle: 'We collaborate with visionary leaders to architect data-backed strategies and drive sustainable growth. Transform challenges into opportunities with proven methodologies.',
        cta: 'Book a Strategy Call',
        secondaryCta: 'See Our Work',
        socialProof: 'Trusted by 200+ Fortune 500 companies',
        image: '/images/consulting-hero.jpg',
        badges: [
          { label: 'Free initial consultation', color: 'blue', icon: 'phone' },
          { label: '98% client satisfaction', color: 'green', icon: 'star' }
        ]
      },
      design: {
        theme: 'elegant',
        layout: 'split',
        backgroundColor: 'bg-gradient-to-tr from-gray-900 to-gray-700',
        textColor: 'text-white',
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      id: 3,
      metadata: {},
      type: 'brands',
      content: {
        title: 'Trusted by Industry Leaders',
        subtitle: 'Join the companies that chose excellence',
        brands: [
          { name: 'Microsoft', logo: '/images/brand-microsoft.png' },
          { name: 'Goldman Sachs', logo: '/images/brand-goldman.png' },
          { name: 'McKinsey', logo: '/images/brand-mckinsey.png' },
          { name: 'Deloitte', logo: '/images/brand-deloitte.png' },
          { name: 'IBM', logo: '/images/brand-ibm.png' },
          { name: 'Accenture', logo: '/images/brand-accenture.png' },
        ],
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-gray-50',
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      id: 4,
      type: 'stats',
      content: {
        title: 'Proven Track Record',
        subtitle: 'Numbers that speak for themselves',
        stats: [
          { value: '200+', label: 'Companies Transformed', icon: 'building' },
          { value: '$2.5B+', label: 'Value Created', icon: 'trending-up' },
          { value: '98%', label: 'Client Satisfaction', icon: 'star' },
          { value: '15+', label: 'Years Experience', icon: 'clock' },
        ],
      },
      design: {
        theme: 'elegant',
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
      metadata: {},
      type: 'features',
      content: {
        title: 'What We Deliver',
        subtitle: 'Customized consulting services for bold business transformations',
        features: [
          {
            icon: 'chart-line',
            title: 'Enterprise Strategy',
            description: 'Frameworks that accelerate growth while aligning with organizational vision and market dynamics'
          },
          {
            icon: 'cog',
            title: 'Tech Enablement',
            description: 'Drive innovation with digital ecosystems, automation, and modernization strategies'
          },
          {
            icon: 'search',
            title: 'Market Intelligence',
            description: 'Strategic insights rooted in data to outmaneuver competition and capture opportunities'
          },
          {
            icon: 'users',
            title: 'Change Navigation',
            description: 'Facilitating smooth transitions during organizational or structural shifts'
          },
          {
            icon: 'shield',
            title: 'Risk Management',
            description: 'Comprehensive risk assessment and mitigation strategies for sustainable growth'
          },
          {
            icon: 'globe',
            title: 'Global Expansion',
            description: 'Navigate international markets with localized strategies and cultural intelligence'
          }
        ],
      },
      design: {
        theme: 'elegant',
        layout: 'default',
        backgroundColor: 'bg-slate-50',
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      id: 6,
      metadata: {},
      type: 'process',
      content: {
        title: 'Our Proven Methodology',
        subtitle: 'A systematic approach to transformation',
        steps: [
          {
            number: '01',
            title: 'Discovery & Assessment',
            description: 'Deep dive into your business challenges, opportunities, and current state analysis'
          },
          {
            number: '02',
            title: 'Strategy Development',
            description: 'Co-create tailored solutions with your leadership team using proven frameworks'
          },
          {
            number: '03',
            title: 'Implementation Planning',
            description: 'Detailed roadmap with milestones, resources, and success metrics'
          },
          {
            number: '04',
            title: 'Execution Support',
            description: 'Hands-on guidance and course correction throughout the transformation'
          },
          {
            number: '05',
            title: 'Results Optimization',
            description: 'Continuous monitoring and refinement to maximize outcomes'
          }
        ]
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-white',
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      id: 7,
      metadata: {},
      type: 'team',
      content: {
        title: 'Meet Our Expert Team',
        subtitle: 'Industry veterans with proven track records',
        members: [
          {
            name: 'Sarah Mitchell',
            role: 'Managing Partner',
            bio: 'Former McKinsey Principal with 15+ years in strategy consulting',
            image: '/images/team-sarah.jpg',
            linkedin: 'https://linkedin.com/in/sarahmitchell'
          },
          {
            name: 'David Chen',
            role: 'Technology Practice Lead',
            bio: 'Ex-Google VP of Engineering, specializes in digital transformation',
            image: '/images/team-david.jpg',
            linkedin: 'https://linkedin.com/in/davidchen'
          },
          {
            name: 'Maria Rodriguez',
            role: 'Change Management Director',
            bio: 'Organizational psychology expert with Fortune 100 experience',
            image: '/images/team-maria.jpg',
            linkedin: 'https://linkedin.com/in/mariarodriguez'
          },
          {
            name: 'James Thompson',
            role: 'Financial Strategy Partner',
            bio: 'Former Goldman Sachs MD, M&A and corporate finance specialist',
            image: '/images/team-james.jpg',
            linkedin: 'https://linkedin.com/in/jamesthompson'
          }
        ]
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-gray-50',
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {}
      },
    },
    {
      id: 8,
      type: 'testimonials',
      content: {
        title: 'What Our Clients Say',
        subtitle: 'Success stories from industry leaders',
        testimonials: [
          {
            quote: 'Advisory Studio transformed our entire go-to-market strategy. Revenue increased 340% in 18 months.',
            author: 'Nina Alvarez',
            role: 'CEO, FinScope Global',
            image: '/images/testimonial-nina.jpg',
            company: 'FinScope Global'
          },
          {
            quote: 'Their digital transformation roadmap saved us $50M and positioned us as an industry leader.',
            author: 'James Rowe',
            role: 'COO, DataWave Systems',
            image: '/images/testimonial-james.jpg',
            company: 'DataWave Systems'
          },
          {
            quote: 'The change management approach was flawless. 95% employee adoption rate within 6 months.',
            author: 'Lisa Park',
            role: 'CHRO, TechCorp International',
            image: '/images/testimonial-lisa.jpg',
            company: 'TechCorp International'
          }
        ],
      },
      design: {
        theme: 'elegant',
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
      type: 'portfolio',
      content: {
        title: 'Case Studies',
        subtitle: 'Real transformations, measurable results',
        projects: [
          {
            title: 'Global Tech Giant Digital Transformation',
            category: 'Technology',
            description: 'Led comprehensive digital transformation resulting in $200M cost savings and 40% efficiency improvement',
            image: '/images/case-tech-transformation.jpg',
            results: ['$200M cost savings', '40% efficiency gain', '6-month timeline'],
            link: '/case-studies/tech-transformation'
          },
          {
            title: 'Financial Services Market Expansion',
            category: 'Strategy',
            description: 'Developed market entry strategy for European expansion, achieving 25% market share in 2 years',
            image: '/images/case-financial-expansion.jpg',
            results: ['25% market share', '€500M revenue', '12 new markets'],
            link: '/case-studies/financial-expansion'
          },
          {
            title: 'Manufacturing Process Optimization',
            category: 'Operations',
            description: 'Redesigned manufacturing processes reducing waste by 60% and increasing output by 35%',
            image: '/images/case-manufacturing.jpg',
            results: ['60% waste reduction', '35% output increase', '$75M savings'],
            link: '/case-studies/manufacturing-optimization'
          }
        ]
      },
      design: {
        theme: 'elegant',
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
      id: 10,
      type: 'pricing',
      content: {
        title: 'Investment Options',
        subtitle: 'Flexible engagement models to fit your needs',
        plans: [
          {
            name: 'Strategic Assessment',
            price: '$25,000',
            frequency: 'one-time',
            description: 'Comprehensive analysis and strategic recommendations',
            features: [
              'Current state assessment',
              'Market opportunity analysis',
              'Strategic roadmap',
              'Executive presentation',
              '30-day follow-up'
            ],
            cta: 'Get Assessment',
            popular: false
          },
          {
            name: 'Transformation Program',
            price: '$150,000',
            frequency: '6-month engagement',
            description: 'Full transformation with implementation support',
            features: [
              'Everything in Assessment',
              'Implementation planning',
              'Change management',
              'Weekly progress reviews',
              'Team training',
              'Success metrics tracking'
            ],
            cta: 'Start Transformation',
            popular: true
          },
          {
            name: 'Strategic Partnership',
            price: 'Custom',
            frequency: 'ongoing',
            description: 'Long-term strategic advisory and support',
            features: [
              'Dedicated strategic advisor',
              'Quarterly strategy reviews',
              'Priority access to experts',
              'Custom research projects',
              'Board presentation support',
              'Crisis management support'
            ],
            cta: 'Discuss Partnership',
            popular: false
          }
        ]
      },
      design: {
        theme: 'elegant',
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
      type: 'faq',
      content: {
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about working with us',
        faqs: [
          {
            question: 'How long does a typical engagement last?',
            answer: 'Engagement duration varies based on scope and complexity. Strategic assessments typically take 4-6 weeks, while full transformations range from 6-18 months. We work with you to define realistic timelines that deliver maximum value.'
          },
          {
            question: 'What industries do you specialize in?',
            answer: 'We have deep expertise across technology, financial services, healthcare, manufacturing, and retail. Our methodology is industry-agnostic, allowing us to apply proven frameworks while incorporating sector-specific insights.'
          },
          {
            question: 'How do you measure success?',
            answer: 'Success metrics are defined collaboratively at the start of each engagement. Common measures include revenue growth, cost reduction, efficiency improvements, market share gains, and employee satisfaction scores. We provide regular progress reports and final impact assessments.'
          },
          {
            question: 'Do you work with international companies?',
            answer: 'Yes, we serve clients globally with offices in New York, London, Singapore, and São Paulo. Our team has extensive experience with cross-cultural dynamics and regulatory environments across major markets.'
          },
          {
            question: 'What makes Advisory Studio different?',
            answer: 'Our unique combination of strategic thinking, implementation expertise, and change management sets us apart. We don\'t just provide recommendations – we partner with you to ensure successful execution and sustainable results.'
          }
        ]
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-slate-50',
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
      type: 'cta',
      content: {
        title: 'Ready to Transform Your Business?',
        subtitle: 'Schedule a complimentary strategy session with our experts',
        description: 'Discover how Advisory Studio can help you navigate challenges, capture opportunities, and achieve sustainable growth. Our initial consultation is always free and provides immediate value.',
        primaryCta: 'Book Free Consultation',
        secondaryCta: 'Download Case Studies',
        benefits: [
          'Free 60-minute strategy session',
          'Custom opportunity assessment',
          'No obligation or sales pressure',
          'Immediate actionable insights'
        ]
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-gradient-to-r from-gray-900 to-gray-700',
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
      id: 13,
      type: 'contact',
      content: {
        title: 'Get in Touch',
        subtitle: 'Multiple ways to connect with our team',
        contactInfo: {
          phone: '+1 (555) 123-4567',
          email: 'hello@advisorystudio.com',
          address: '123 Business District, New York, NY 10001'
        },
        offices: [
          { city: 'New York', address: '123 Business District, NY 10001', phone: '+1 (555) 123-4567' },
          { city: 'London', address: '456 Canary Wharf, London E14 5AB', phone: '+44 20 7123 4567' },
          { city: 'Singapore', address: '789 Marina Bay, Singapore 018956', phone: '+65 6123 4567' }
        ],
        form: {
          fields: ['name', 'email', 'company', 'message'],
          submitText: 'Send Message'
        }
      },
      design: {
        theme: 'elegant',
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
      id: 14,
      type: 'footer',
      content: {
        title: 'Advisory Studio',
        description: 'Transforming businesses through strategic excellence',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Careers', href: '/careers' },
          { label: 'Press', href: '/press' }
        ],
        social: [
          { platform: 'linkedin', url: 'https://linkedin.com/company/advisorystudio' },
          { platform: 'twitter', url: 'https://twitter.com/advisorystudio' },
          { platform: 'youtube', url: 'https://youtube.com/advisorystudio' }
        ],
        contact: {
          email: 'hello@advisorystudio.com',
          phone: '+1 (555) 123-4567'
        }
      },
      design: {
        theme: 'elegant',
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
      type: 'portfolio',
      content: {
        title: 'Case Study Highlights',
        subtitle: 'Strategic outcomes we’ve driven for forward-thinking businesses',
        projects: [
          {
            title: 'AI-Driven Efficiency',
            category: 'Digital Strategy',
            image: '/images/placeholder.jpg?w=400&h=300&fit=crop',
            description: 'Automated internal workflows, reducing overhead by 35%',
          },
          {
            title: 'International Growth',
            category: 'Market Expansion',
            image: '/images/placeholder.jpg?w=400&h=300&fit=crop',
            description: 'Entered 4 new markets in 9 months with 400% growth',
          },
          {
            title: 'Lean Operations',
            category: 'Process Design',
            image: '/images/placeholder.jpg?w=400&h=300&fit=crop',
            description: 'Saved $2.1M annually through systems optimization',
          },
          {
            title: 'Organizational Reset',
            category: 'Change Strategy',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
            description: 'Supported a 6,000-person restructure with zero downtime',
          },
        ],
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-slate-100',
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
      type: 'counter',
      content: {
        title: 'Impact Metrics',
        subtitle: 'Driving results at scale',
        counters: [
          { number: '600+', label: 'Projects Delivered', suffix: '' },
          { number: '165%', label: 'Avg ROI', suffix: '' },
          { number: '99%', label: 'Satisfaction Score', suffix: '' },
          { number: '30+', label: 'Sectors Served', suffix: '' },
        ],
      },
      design: {
        theme: 'elegant',
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
        title: 'Advisory Packages',
        subtitle: 'Flexible service models designed for growth',
        plans: [
          {
            name: 'Intro Strategy Call',
            price: '$495',
            frequency: '',
            description: 'An exploratory session with a senior consultant.',
            features: [
              '60-minute session',
              'Quick assessment',
              'High-level roadmap',
              'Strategic brief follow-up',
            ],
            cta: 'Get Started',
          },
          {
            name: 'Growth Partner',
            price: '$4,800',
            frequency: '/mo',
            description: 'Ongoing strategic support and performance monitoring.',
            features: [
              'Weekly syncs',
              '24/7 priority access',
              'Analytics dashboard',
              'Quarterly planning',
            ],
            cta: 'Join Now',
            featured: true,
          },
          {
            name: 'Custom Engagement',
            price: 'Contact',
            frequency: '',
            description: 'A fully tailored project with defined milestones.',
            features: [
              'Full-stack consulting',
              'Custom team assembly',
              'Weekly reporting',
              'Success metrics guarantee',
            ],
            cta: 'Let’s Talk',
          },
        ],
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-slate-50',
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
      type: 'faq',
      content: {
        title: 'Top Questions',
        faqs: [
          {
            question: 'Who are your ideal clients?',
            answer: 'We work with mid-market to enterprise companies undergoing strategic growth or transformation.',
          },
          {
            question: 'What’s included in the monthly retainer?',
            answer: 'Strategic sessions, access to specialists, ongoing optimization, and detailed performance tracking.',
          },
          {
            question: 'Do you offer short-term projects?',
            answer: 'Yes. We offer outcome-focused engagements with a clear scope and deliverables.',
          },
        ],
      },
      design: {
        theme: 'elegant',
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
      type: 'counter',
      content: {
        title: 'Key Outcomes',
        subtitle: 'Proof through performance',
        counters: [
          { number: '180+', label: 'Clients Supported', suffix: '' },
          { number: '99%', label: 'Retention Rate', suffix: '%' },
          { number: '$700M', label: 'Revenue Enabled', suffix: '' },
          { number: '12', label: 'Years Consulting', suffix: '+' },
        ],
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-slate-100',
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
        title: 'Project Portfolio',
        subtitle: 'Highlights from our recent engagements',
        images: [
          { src: '/images/placeholder.jpg?w=400&h=300&fit=crop', alt: 'Case Study A', caption: 'Efficiency Playbook' },
          { src: 'https://images.unsplash.com/photo-1556742044-1a7b7a46a9b2?w=400&h=300&fit=crop', alt: 'Case Study B', caption: 'New Market Launch' },
          { src: 'https://images.unsplash.com/photo-1556742044-1a7b7a46a9b2?w=400&h=300&fit=crop', alt: 'Case Study C', caption: 'Product Realignment' },
          { src: '/images/placeholder.jpg?w=400&h=300&fit=crop', alt: 'Case Study D', caption: 'Global Expansion' },
        ],
      },
      design: {
        theme: 'elegant',
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
        title: 'Meet the Experts',
        subtitle: 'Advisors with deep industry knowledge',
        members: [
          { name: 'Carla Bennett', role: 'Principal Partner', bio: '25 years in organizational strategy & innovation' },
          { name: 'Mark Li', role: 'Digital Strategist', bio: 'Specialist in enterprise tech integrations' },
          { name: 'Olivia Moore', role: 'Analytics Consultant', bio: 'Mastermind in market research & modeling' },
          { name: 'Dev Patel', role: 'Transformation Lead', bio: 'Change champion across Fortune 500s' },
        ],
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-slate-50',
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
        title: 'How We Work',
        subtitle: 'Our end-to-end consulting journey',
        steps: [
          { number: '01', title: 'Initial Assessment', description: 'Align on objectives and outcomes' },
          { number: '02', title: 'Research & Modeling', description: 'In-depth analysis and forecasting' },
          { number: '03', title: 'Strategic Design', description: 'Bespoke strategy development' },
          { number: '04', title: 'Execution & Oversight', description: 'Hands-on implementation with continuous feedback' },
          { number: '05', title: 'Scaling Success', description: 'Iterative optimization for compounding growth' },
        ],
      },
      design: {
        theme: 'elegant',
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
      id: 13,
      type: 'stats',
      content: {
        title: 'Client Achievements',
        subtitle: 'Delivering measurable impact',
        stats: [
          { value: '40%', label: 'Cost Reduction', icon: 'trending-down' },
          { value: '60%', label: 'Productivity Gain', icon: 'zap' },
          { value: '2x', label: 'Time to Market', icon: 'clock' },
          { value: '99%', label: 'Client Retention', icon: 'user-check' },
        ],
      },
      design: {
        theme: 'elegant',
        backgroundColor: 'bg-slate-50',
        typography: undefined,
        colors: undefined,
        shadows: undefined,
        borders: undefined,
        interactions: undefined
      },
      metadata: undefined
    },
    {
      id: 15, type: 'reviews',
      content: {
        title: 'Client Feedback',
        subtitle: 'Hear directly from our partners',
        reviews: [
          {
            rating: 5,
            text: 'Their clarity and process made all the difference. We’ve doubled our revenue since working together.',
            author: 'Lauren Keller',
            company: 'InsightPath',
          },
          {
            rating: 5,
            text: 'Our best strategic partnership by far. They deliver results and elevate our internal teams.',
            author: 'Greg Martin',
            company: 'Everline Group',
          },
          {
            rating: 5,
            text: 'Professional, responsive, and incredibly smart — the whole experience was top-notch.',
            author: 'Emily Tran',
            company: 'Nova Ventures',
          },
        ],
      },
      design: {
        theme: 'elegant',
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
      id: 16, type: 'cta',
      content: {
        title: 'Let’s Unlock Your Next Stage',
        subtitle: 'Discover how our advisory team can move your business forward.',
        primaryCta: 'Schedule a Call',
        secondaryCta: 'Explore Services',
        features: ['Complimentary Discovery Session', 'Custom Growth Roadmap', 'Expert Recommendations'],
      },
      design: {
        theme: 'elegant',
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
      id: 50, type: 'footer',
      content: {
        title: 'Advisory Studio',
        description: 'Empowering business evolution through strategic excellence',
        copyright: '© 2025 Advisory Studio. All rights reserved.',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Use', href: '/terms' },
          { label: 'Join Our Team', href: '/careers' },
        ],
      },
      design: {
        theme: 'dark',
        backgroundColor: 'bg-gray-800',
        textColor: 'text-gray-300',
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
    id: 'ecommerce',
    title: 'StyleHub Store',
    description: 'Premium e-commerce template with advanced product showcase and conversion optimization.',
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
            { label: 'Free shipping over $75', color: 'green', icon: 'truck' },
            { label: '30-day returns', color: 'blue', icon: 'refresh' },
            { label: 'Secure checkout', color: 'purple', icon: 'shield-check' }
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
          benefits: [
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
            '30-day returns',
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
          copyright: '© 2025 StyleHub. All rights reserved.',
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
            { label: 'Award-winning agency', color: 'gold', icon: 'trophy' },
            { label: '200+ projects delivered', color: 'purple', icon: 'briefcase' },
            { label: 'Free consultation', color: 'pink', icon: 'phone' }
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
              description: 'Complete brand transformation resulting in 400% increase in brand recognition and 250% sales growth',
              image: '/images/portfolio-techstart.jpg',
              results: ['400% brand recognition', '250% sales increase', '6-month timeline'],
              link: '/portfolio/techstart-rebrand'
            },
            {
              title: 'GlobalCorp E-commerce Platform',
              category: 'Web Design',
              description: 'Modern e-commerce platform with advanced UX resulting in 180% conversion rate improvement',
              image: '/images/portfolio-globalcorp.jpg',
              results: ['180% conversion increase', '45% bounce rate reduction', '3-month delivery'],
              link: '/portfolio/globalcorp-ecommerce'
            },
            {
              title: 'InnovateNow Campaign',
              category: 'Digital Marketing',
              description: 'Multi-channel digital campaign achieving 300% ROI and 2M+ impressions across platforms',
              image: '/images/portfolio-innovatenow.jpg',
              results: ['300% ROI', '2M+ impressions', '150% engagement increase'],
              link: '/portfolio/innovatenow-campaign'
            },
            {
              title: 'StartupXYZ Motion Graphics',
              category: 'Video & Animation',
              description: 'Brand video series generating 5M+ views and establishing thought leadership in the industry',
              image: '/images/portfolio-startupxyz.jpg',
              results: ['5M+ video views', '500% social growth', '2-week production'],
              link: '/portfolio/startupxyz-video'
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
                '2 revision rounds',
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
                'SEO optimization',
                '3-month timeline'
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
        metadata: {},
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
          copyright: '© 2025 Pixel Perfect Agency. All rights reserved.',
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
      {
        id: 6,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'How long does a project typically take?',
              answer: 'A typical brand identity project takes 2-4 weeks, while a website design project takes 6-8 weeks. We will provide a detailed timeline for your specific project.'
            },
            {
              question: 'What is your design process?',
              answer: 'We follow a collaborative process that includes discovery, design, feedback, and launch. We work closely with you every step of the way to ensure we create a final product that you love.'
            },
            {
              question: 'Do you offer ongoing support?',
              answer: 'Yes, we offer a range of support packages to ensure your website and brand stay up-to-date.'
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
        id: 7, 
        metadata: {},
        type: 'contact',
        content: {
          title: 'Ready to Create Something Amazing?',
          description: 'Let\'s discuss your project and explore how we can bring your vision to life.',
          cta: 'Start Your Project',
          formId: 'agency-contact'
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-gradient-to-r from-purple-600 to-pink-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        }
      },
      { 
        id: 8, 
        metadata: {},
        type: 'footer',
        content: {
          title: 'Pixel Perfect',
          description: 'Creating digital experiences that matter',
          copyright: '© 2025 Pixel Perfect Agency. All rights reserved.',
          links: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Careers', href: '/careers' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-black', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        }
      },
    ],
  },
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
            { label: 'Licensed & Insured', color: 'green', icon: 'shield-check' },
            { label: '25+ years experience', color: 'orange', icon: 'star' },
            { label: 'Free estimates', color: 'blue', icon: 'calculator' }
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
              results: ['5,000 sq ft', 'LEED Certified', '6-month completion'],
              link: '/projects/luxury-estate'
            },
            {
              title: 'Downtown Office Complex',
              category: 'Commercial',
              description: '50,000 sq ft office building with modern design and energy-efficient systems',
              image: '/images/project-office-complex.jpg',
              results: ['50,000 sq ft', 'Energy Star Rated', '18-month timeline'],
              link: '/projects/office-complex'
            },
            {
              title: 'Historic Building Renovation',
              category: 'Renovation',
              description: 'Restored 1920s building preserving historical character while adding modern functionality',
              image: '/images/project-historic-renovation.jpg',
              results: ['Historic preservation', 'Modern upgrades', '12-month restoration'],
              link: '/projects/historic-renovation'
            },
            {
              title: 'Industrial Warehouse',
              category: 'Industrial',
              description: '100,000 sq ft warehouse facility with advanced logistics and safety systems',
              image: '/images/project-warehouse.jpg',
              results: ['100,000 sq ft', 'Advanced logistics', '10-month build'],
              link: '/projects/warehouse'
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
          copyright: '© 2025 BuildCraft Pro. All rights reserved.',
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
      {
        id: 6,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'How long have you been in business?',
              answer: 'We have been in business for over 25 years, serving the community with quality construction services.'
            },
            {
              question: 'Are you licensed and insured?',
              answer: 'Yes, we are fully licensed and insured. We would be happy to provide you with our credentials upon request.'
            },
            {
              question: 'Do you offer a warranty?',
              answer: 'Yes, we offer a comprehensive warranty on all of our work. We stand behind the quality of our construction and are committed to your satisfaction.'
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
        id: 7,
        type: 'contact',
        content: {
          title: 'Ready to Start Your Project?',
          description: 'Get a free consultation and detailed quote for your construction project.',
          cta: 'Request Quote',
          formId: 'construction-contact'
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
        id: 8,
        type: 'footer',
        content: {
          title: 'BuildCraft Pro',
          description: 'Building excellence since 1998',
          copyright: '© 2025 BuildCraft Pro. All rights reserved.',
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
  {
    id: 'fitness-wellness',
    title: 'Fitness & Wellness',
    description: 'An energetic, inspiring template for gyms, trainers, and wellness coaches.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    hint: 'This is a hint for the AI to generate content for the fitness & wellness template.',
    aiInsight: 'This template is designed to motivate and engage potential clients.',
    stats: {
      visitors: '7k',
      leads: '800',
      conversion: '11.5%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'FitZone Elite',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8L32 16L24 24L16 16L24 8Z" fill="currentColor"/><path d="M24 24L32 32L24 40L16 32L24 24Z" fill="currentColor"/></svg>`
          },
          links: [
            { label: 'Classes', href: '#classes' },
            { label: 'Training', href: '#training' },
            { label: 'Nutrition', href: '#nutrition' },
            { label: 'Membership', href: '#membership' },
            { label: 'About', href: '#about' },
          ],
          actions: [
            { label: 'Start Free Trial', href: '#trial', style: 'primary' },
            { label: 'Schedule Tour', href: '#tour', style: 'secondary' }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-green-50', textColor: 'text-gray-900',
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
          title: 'Transform Your Body, Transform Your Life',
          subtitle: 'Join FitZone Elite and discover the strongest, healthiest version of yourself with our expert trainers, cutting-edge facilities, and supportive community.',
          cta: 'Start Free Trial',
          secondaryCta: 'Schedule Tour',
          socialProof: '2,000+ members achieving their goals',
          image: '/images/fitness-hero.jpg',
          badges: [
            { label: '7-day free trial', color: 'green', icon: 'calendar' },
            { label: 'No commitment', color: 'blue', icon: 'shield-check' },
            { label: 'Expert trainers', color: 'orange', icon: 'user-group' }
          ]
        },
        design: {
          theme: 'energetic', layout: 'split', backgroundColor: 'bg-gradient-to-r from-green-500 to-emerald-600', textColor: 'text-white',
          typography: undefined,
          colors: undefined,
          shadows: undefined,
          borders: undefined,
          interactions: undefined
        },
        metadata: undefined
      },
      {
        id: 24,
        type: 'stats',
        content: {
          title: 'Proven Results',
          subtitle: 'Numbers that showcase our member success',
          stats: [
            { value: '2,000+', label: 'Active Members', icon: 'users' },
            { value: '95%', label: 'Member Retention', icon: 'heart' },
            { value: '50+', label: 'Classes Per Week', icon: 'calendar' },
            { value: '15+', label: 'Expert Trainers', icon: 'award' },
          ],
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
        id: 3,
        type: 'features',
        content: {
          title: 'Why Choose FitZone Elite',
          subtitle: 'Everything you need for your fitness journey',
          features: [
            {
              icon: 'user-check',
              title: 'Expert Personal Training',
              description: 'Certified trainers create personalized workout plans tailored to your goals and fitness level'
            },
            {
              icon: 'users',
              title: 'Group Fitness Classes',
              description: 'High-energy classes including HIIT, yoga, spinning, and strength training for all levels'
            },
            {
              icon: 'apple',
              title: 'Nutrition Coaching',
              description: 'Customized meal plans and nutrition guidance to fuel your fitness transformation'
            },
            {
              icon: 'dumbbell',
              title: 'State-of-the-Art Equipment',
              description: 'Latest fitness technology and equipment in a clean, motivating environment'
            },
            {
              icon: 'heart',
              title: 'Recovery & Wellness',
              description: 'Sauna, massage therapy, and recovery programs to optimize your performance'
            },
            {
              icon: 'handshake',
              title: 'Community Support',
              description: 'Supportive community of like-minded individuals on their fitness journey'
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
        id: 4,
        type: 'pricing',
        content: {
          title: 'Membership Plans',
          subtitle: 'Choose the plan that fits your lifestyle',
          plans: [
            {
              name: 'Basic',
              price: '$29',
              frequency: '/month',
              description: 'Perfect for getting started',
              features: ['Gym access', 'Group classes', 'Locker room', 'Basic equipment'],
              cta: 'Join Basic'
            },
            {
              name: 'Premium',
              price: '$59',
              frequency: '/month',
              description: 'Most popular choice',
              features: ['Everything in Basic', 'Personal training sessions', 'Nutrition coaching', 'Recovery amenities', 'Guest passes'],
              cta: 'Join Premium',
              featured: true
            },
            {
              name: 'Elite',
              price: '$99',
              frequency: '/month',
              description: 'Ultimate fitness experience',
              features: ['Everything in Premium', 'Unlimited personal training', 'Meal prep service', 'Massage therapy', 'VIP amenities'],
              cta: 'Join Elite'
            }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-green-50',
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
          title: 'Our Community',
          subtitle: 'Join thousands of happy members',
          counters: [
            { number: '2k', label: 'Members', suffix: '+' },
            { number: '50', label: 'Classes per Week', suffix: '+' },
            { number: '10', label: 'Trainers', suffix: '+' },
            { number: '5', label: 'Locations', suffix: '' }
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
        id: 6,
        type: 'gallery',
        content: {
          title: 'Our Facilities',
          subtitle: 'State-of-the-art equipment and amenities',
          images: [
            { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', alt: 'Facility 1', caption: 'Weight Room' },
            { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', alt: 'Facility 2', caption: 'Cardio Room' },
            { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', alt: 'Facility 3', caption: 'Yoga Studio' },
            { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', alt: 'Facility 4', caption: 'Locker Room' }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-green-50',
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
        type: 'team',
        content: {
          title: 'Our Trainers',
          subtitle: 'Certified experts to help you reach your goals',
          members: [
            { name: 'John Doe', role: 'Head Trainer', bio: 'Certified personal trainer with 10+ years of experience.' },
            { name: 'Jane Smith', role: 'Yoga Instructor', bio: 'Certified yoga instructor with a passion for wellness.' },
            { name: 'Peter Jones', role: 'HIIT Instructor', bio: 'Certified HIIT instructor who will push you to your limits.' },
            { name: 'Mary Williams', role: 'Nutritionist', bio: 'Certified nutritionist who will help you create a healthy eating plan.' }
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
        id: 8,
        type: 'process',
        content: {
          title: 'Our Process',
          subtitle: 'How we help you achieve your fitness goals',
          steps: [
            { number: '01', title: 'Consultation', description: 'We start with a free consultation to understand your goals.' },
            { number: '02', title: 'Assessment', description: 'We assess your current fitness level and create a baseline.' },
            { number: '03', title: 'Plan', description: 'We create a personalized fitness plan to help you reach your goals.' },
            { number: '04', title: 'Training', description: 'We guide you through your workouts and provide support.' },
            { number: '05', 'title': 'Results', 'description': 'We track your progress and celebrate your success.' }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-green-50',
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
        type: 'stats',
        content: {
          title: 'Our Impact',
          subtitle: 'The results of our members',
          stats: [
            { value: '2k+', label: 'Members', icon: 'users' },
            { value: '50+', label: 'Classes', icon: 'award' },
            { value: '10+', label: 'Trainers', icon: 'users' },
            { value: '5', label: 'Locations', icon: 'map-pin' }
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
        type: 'reviews',
        content: {
          title: 'What Our Members Say',
          subtitle: 'Testimonials from our happy members',
          reviews: [
            { rating: 5, text: 'I have been a member of FitZone Elite for a year and I have never been happier. The trainers are amazing and the community is so supportive.', author: 'John Doe', company: '' },
            { rating: 5, text: 'I love the variety of classes at FitZone Elite. I never get bored and I am always challenged.', author: 'Jane Doe', company: '' }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-green-50',
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
        type: 'cta',
        content: {
          title: 'Ready to Get Started?',
          subtitle: 'Join FitZone Elite today and start your fitness journey.',
          primaryCta: 'Join Now',
          secondaryCta: 'View Classes',
          features: ['Free 7-day trial', 'No commitment', 'Cancel anytime']
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-green-600', textColor: 'text-white',
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
        type: 'footer',
        content: {
          title: 'FitZone Elite',
          description: 'Your transformation starts here',
          copyright: '© 2025 FitZone Elite. All rights reserved.',
          links: [
            { label: 'Class Schedule', href: '/schedule' },
            { label: 'Membership', href: '/membership' },
            { label: 'Locations', href: '/locations' },
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
      {
        id: 6,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'What are your hours?',
              answer: 'We are open 24/7, so you can work out whenever it is convenient for you.'
            },
            {
              question: 'Do you offer childcare?',
              answer: 'Yes, we offer childcare for children ages 6 months to 12 years. Please see our childcare page for more details.'
            },
            {
              question: 'Can I try the gym before I join?',
              answer: 'Yes, we offer a free 7-day trial. Come in and see everything we have to offer.'
            }
          ]
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-green-50',
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
          title: 'Ready to Start Your Transformation?',
          description: 'Book a free consultation and tour our facilities. Your fitness journey starts here.',
          cta: 'Book Free Tour',
          formId: 'fitness-contact'
        },
        design: {
          theme: 'energetic', backgroundColor: 'bg-green-600', textColor: 'text-white',
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
          title: 'FitZone Elite',
          description: 'Your transformation starts here',
          copyright: '© 2025 FitZone Elite. All rights reserved.',
          links: [
            { label: 'Class Schedule', href: '/schedule' },
            { label: 'Membership', href: '/membership' },
            { label: 'Locations', href: '/locations' },
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
    id: 'real-estate',
    title: 'Real Estate',
    description: 'A polished, professional template for real estate agents and agencies.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059ee41f',
    hint: 'This is a hint for the AI to generate content for the real estate template.',
    aiInsight: 'This template is optimized for showcasing property listings and capturing leads.',
    stats: {
      visitors: '9k',
      leads: '1k',
      conversion: '11%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'Premier Properties',
          logo: {
            svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4L44 20v20L24 44L4 40V20L24 4z" fill="currentColor"/><path d="M24 12L36 22v14L24 36L12 32V22L24 12z" fill="white"/></svg>`
          },
          links: [
            { label: 'Buy', href: '#buy' },
            { label: 'Sell', href: '#sell' },
            { label: 'Rent', href: '#rent' },
            { label: 'About', href: '#about' },
            { label: 'Market Reports', href: '#reports' },
          ],
          actions: [
            { label: 'Free Home Valuation', href: '#valuation', style: 'primary' },
            { label: 'Contact Agent', href: '#contact', style: 'secondary' }
          ]
        },
        design: {
          theme: 'luxury', backgroundColor: 'bg-amber-50', textColor: 'text-gray-900',
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
          title: 'Find Your Dream Home',
          subtitle: 'Discover exceptional properties in prime locations. Our expert agents provide personalized service to help you find the perfect home or investment.',
          cta: 'Search Properties',
          secondaryCta: 'Get Free Valuation',
          socialProof: '$2.5B+ in sales volume',
          image: '/images/luxury-home-hero.jpg',
          badges: [
            { label: 'Top 1% of agents', color: 'gold', icon: 'trophy' },
            { label: 'Average 14 days to sell', color: 'green', icon: 'clock' },
            { label: '98% client satisfaction', color: 'blue', icon: 'star' }
          ]
        },
        design: {
          theme: 'luxury', layout: 'split', backgroundColor: 'bg-amber-50',
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
          title: 'Market-Leading Results',
          subtitle: 'Numbers that speak for our expertise',
          stats: [
            { value: '$2.5B+', label: 'Total Sales Volume', icon: 'dollar-sign' },
            { value: '1,200+', label: 'Homes Sold', icon: 'home' },
            { value: '14', label: 'Average Days on Market', icon: 'calendar' },
            { value: '98%', label: 'Client Satisfaction', icon: 'star' },
          ],
        },
        design: {
          theme: 'luxury',
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
        type: 'gallery',
        content: {
          title: 'Featured Properties',
          subtitle: 'Exceptional homes in prime locations',
          images: [
            {
              src: '/images/property-1.jpg',
              alt: 'Modern Downtown Condo',
              category: 'Condo',
              price: '$850,000',
              details: '2 bed, 2 bath • 1,200 sq ft • Downtown'
            },
            {
              src: '/images/property-2.jpg',
              alt: 'Luxury Family Home',
              category: 'House',
              price: '$1,250,000',
              details: '4 bed, 3 bath • 2,800 sq ft • Suburbs'
            },
            {
              src: '/images/property-3.jpg',
              alt: 'Waterfront Villa',
              category: 'Villa',
              price: '$2,100,000',
              details: '5 bed, 4 bath • 4,200 sq ft • Waterfront'
            },
            {
              src: '/images/property-4.jpg',
              alt: 'Investment Property',
              category: 'Investment',
              price: '$650,000',
              details: '3 bed, 2 bath • 1,800 sq ft • Growing Area'
            },
          ],
        },
        design: {
          theme: 'luxury',
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
        id: 10,
        type: 'team',
        content: {
          title: 'Meet Our Expert Agents',
          subtitle: 'Dedicated professionals with deep market knowledge',
          members: [
            {
              name: 'Jennifer Martinez',
              role: 'Senior Real Estate Agent',
              bio: 'Top 1% agent with 12+ years experience. Specializes in luxury homes and investment properties.',
              image: '/images/agent-jennifer.jpg',
              phone: '(555) 123-4567',
              email: 'jennifer@premierproperties.com',
              specialties: ['Luxury Homes', 'Investment Properties', 'First-Time Buyers']
            },
            {
              name: 'Robert Chen',
              role: 'Commercial Real Estate Specialist',
              bio: 'Expert in commercial properties with $500M+ in transactions. Former investment banker.',
              image: '/images/agent-robert.jpg',
              phone: '(555) 234-5678',
              email: 'robert@premierproperties.com',
              specialties: ['Commercial', 'Investment Analysis', 'Development']
            },
            {
              name: 'Sarah Williams',
              role: 'Residential Sales Manager',
              bio: 'Award-winning agent specializing in family homes and relocations. 15+ years experience.',
              image: '/images/agent-sarah.jpg',
              phone: '(555) 345-6789',
              email: 'sarah@premierproperties.com',
              specialties: ['Family Homes', 'Relocations', 'New Construction']
            }
          ]
        },
        design: {
          theme: 'luxury',
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
        id: 3,
        type: 'testimonials',
        content: {
          title: 'Client Success Stories',
          testimonials: [
            {
              quote: 'Premier Properties found us our dream home in just 3 weeks. Their market knowledge and dedication are unmatched.',
              author: 'Michael & Sarah Johnson',
              role: 'Home Buyers'
            },
            {
              quote: 'They sold our house for 15% above asking price in 5 days. Incredible marketing and negotiation skills.',
              author: 'David Kim',
              role: 'Home Seller'
            }
          ]
        },
        design: {
          theme: 'luxury', backgroundColor: 'bg-amber-50',
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
          subtitle: 'Solutions for every need',
          plans: [
            {
              name: 'Buyer Representation',
              price: 'Free',
              frequency: '',
              description: 'Let us help you find your dream home.',
              features: ['Personalized property search', 'Expert negotiation', 'Transaction management', 'Closing assistance'],
              cta: 'Get Started'
            },
            {
              name: 'Seller Representation',
              price: 'Commission-Based',
              frequency: '',
              description: 'Let us help you sell your home for the best price.',
              features: ['Professional photography', 'Marketing campaign', 'Open houses', 'Expert negotiation'],
              cta: 'Get Started',
              featured: true
            },
            {
              name: 'Rental Assistance',
              price: 'Free',
              frequency: '',
              description: 'Let us help you find the perfect rental.',
              features: ['Personalized property search', 'Lease negotiation', 'Application assistance', 'Move-in coordination'],
              cta: 'Get Started'
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
        id: 6,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'How much do you charge?',
              answer: 'Our services are free for buyers and renters. For sellers, we charge a commission based on the sale price of the home.'
            },
            {
              question: 'What areas do you serve?',
              answer: 'We serve the entire metropolitan area. Please contact us for more information about a specific neighborhood.'
            },
            {
              question: 'How long does it take to find a home?',
              answer: 'The time it takes to find a home varies depending on your needs and the market. We will work with you to find the right home as quickly as possible.'
            }
          ]
        },
        design: {
          theme: 'luxury', backgroundColor: 'bg-amber-50',
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
          title: 'Ready to Make Your Move?',
          description: 'Contact our expert agents for a free consultation and market analysis.',
          cta: 'Get Free Consultation',
          formId: 'realestate-contact'
        },
        design: {
          theme: 'luxury', backgroundColor: 'bg-amber-600', textColor: 'text-white',
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
          title: 'Premier Properties',
          description: 'Your trusted real estate partner',
          copyright: '© 2025 Premier Properties. All rights reserved.',
          links: [
            { label: 'Listings', href: '/listings' },
            { label: 'Market Reports', href: '/reports' },
            { label: 'Agents', href: '/agents' },
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
  {
    id: 'online-learning',
    title: 'Online Learning',
    description: 'A clean, engaging template for online courses and educational content.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c64c1a248bf',
    hint: 'This is a hint for the AI to generate content for the online learning template.',
    aiInsight: 'This template is designed to provide a seamless learning experience.',
    stats: {
      visitors: '15k',
      leads: '1.8k',
      conversion: '12%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'EduMaster Academy',
          links: [
            { label: 'Courses', href: '#courses' },
            { label: 'Instructors', href: '#instructors' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Login', href: '#login' },
          ],
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-indigo-50', textColor: 'text-gray-900',
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
          title: 'Master New Skills, Advance Your Career',
          subtitle: 'Learn from industry experts with our comprehensive online courses. Interactive lessons, real-world projects, and lifetime access.',
          cta: 'Browse Courses',
          secondaryCta: 'Free Trial',
          socialProof: '50,000+ students enrolled'
        },
        design: {
          theme: 'modern', layout: 'centered', backgroundColor: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600', textColor: 'text-white',
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
          title: 'Why Choose EduMaster Academy',
          subtitle: 'The complete learning experience',
          features: [
            {
              title: 'Expert Instructors',
              description: 'Learn from industry professionals with years of real-world experience'
            },
            {
              title: 'Interactive Learning',
              description: 'Hands-on projects, quizzes, and assignments that reinforce your knowledge'
            },
            {
              title: 'Flexible Schedule',
              description: 'Study at your own pace with lifetime access to course materials'
            },
            {
              title: 'Career Support',
              description: 'Job placement assistance and career guidance from our dedicated team'
            },
            {
              title: 'Certificates',
              description: 'Industry-recognized certificates upon successful course completion'
            },
            {
              title: 'Community',
              description: 'Connect with fellow learners and instructors in our vibrant community'
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
        type: 'pricing',
        content: {
          title: 'Learning Plans',
          subtitle: 'Choose the plan that fits your goals',
          plans: [
            {
              name: 'Basic',
              price: '$19',
              frequency: '/month',
              description: 'Essential courses for beginners',
              features: ['Access to 50+ courses', 'Basic support', 'Mobile app access', 'Course certificates'],
              cta: 'Start Learning'
            },
            {
              name: 'Pro',
              price: '$39',
              frequency: '/month',
              description: 'Advanced learning with mentorship',
              features: ['Access to 200+ courses', 'Priority support', 'Live workshops', 'Career guidance', '1-on-1 mentoring'],
              cta: 'Go Pro',
              featured: true
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              frequency: '',
              description: 'Team training solutions',
              features: ['Unlimited course access', 'Custom content', 'Team analytics', 'Dedicated support', 'API access'],
              cta: 'Contact Sales'
            }
          ]
        },
        design: {
          theme: 'modern', backgroundColor: 'bg-indigo-50',
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
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'How long do I have access to courses?',
              answer: 'You have lifetime access to all courses you enroll in. Learn at your own pace without any time pressure.'
            },
            {
              question: 'Are the certificates recognized by employers?',
              answer: 'Yes, our certificates are industry-recognized and accepted by thousands of employers worldwide.'
            },
            {
              question: 'Can I get a refund if I\'m not satisfied?',
              answer: 'We offer a 30-day money-back guarantee. If you\'re not completely satisfied, we\'ll refund your payment.'
            },
            {
              question: 'Do you offer corporate training?',
              answer: 'Yes, we provide customized training solutions for teams and organizations. Contact our sales team for details.'
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
        type: 'footer',
        content: {
          title: 'EduMaster Academy',
          description: 'Empowering learners worldwide',
          copyright: '© 2025 EduMaster Academy. All rights reserved.',
          links: [
            { label: 'Course Catalog', href: '/courses' },
            { label: 'Student Support', href: '/support' },
            { label: 'Become Instructor', href: '/teach' },
            { label: 'About Us', href: '/about' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-indigo-900', textColor: 'text-white',
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
            { label: 'Michelin recommended', color: 'gold', icon: 'star' },
            { label: 'Family-owned since 1985', color: 'amber', icon: 'heart' },
            { label: 'Fresh daily ingredients', color: 'green', icon: 'leaf' }
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
          copyright: '© 2025 Bella Vista Restaurant. All rights reserved.',
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
    id: 'personal-portfolio',
    title: 'Personal Portfolio',
    description: 'A sleek, modern template for showcasing your work and skills.',
    image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546',
    hint: 'This is a hint for the AI to generate content for the personal portfolio template.',
    aiInsight: 'This template is perfect for making a great first impression.',
    stats: {
      visitors: '4k',
      leads: '400',
      conversion: '10%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'Alex Morgan',
          links: [
            { label: 'Work', href: '#work' },
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#skills' },
            { label: 'Contact', href: '#contact' },
          ],
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-slate-50', textColor: 'text-gray-900',
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
          title: 'Creative Designer & Developer',
          subtitle: 'I craft beautiful digital experiences that combine stunning design with seamless functionality. Let\'s bring your vision to life.',
          cta: 'View My Work',
          secondaryCta: 'Get In Touch'
        },
        design: { theme: 'elegant', layout: 'centered', backgroundColor: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900', textColor: 'text-white', typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} },
        metadata: undefined
      },
      {
        id: 3,
        type: 'features',
        content: {
          title: 'What I Do',
          subtitle: 'My areas of expertise',
          features: [
            {
              title: 'UI/UX Design',
              description: 'Creating intuitive and beautiful user interfaces that enhance user experience'
            },
            {
              title: 'Web Development',
              description: 'Building responsive, fast, and scalable websites using modern technologies'
            },
            {
              title: 'Brand Identity',
              description: 'Developing cohesive brand identities that tell your story and connect with audiences'
            },
            {
              title: 'Mobile Apps',
              description: 'Designing and developing mobile applications for iOS and Android platforms'
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
        type: 'testimonials',
        content: {
          title: 'Client Testimonials',
          testimonials: [
            {
              quote: 'Alex delivered exactly what we needed. The design is beautiful and the website performs flawlessly.',
              author: 'Jennifer Lee',
              role: 'CEO, StartupCo'
            },
            {
              quote: 'Working with Alex was a pleasure. Professional, creative, and always delivers on time.',
              author: 'Michael Brown',
              role: 'Marketing Director'
            }
          ]
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-slate-50',
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
          title: 'My Services',
          subtitle: 'Let\'s work together',
          plans: [
            {
              name: 'UI/UX Design',
              price: '$50',
              frequency: '/hour',
              description: 'Creating intuitive and beautiful user interfaces.',
              features: ['Wireframing', 'Prototyping', 'User testing', 'Visual design'],
              cta: 'Hire Me'
            },
            {
              name: 'Web Development',
              price: '$75',
              frequency: '/hour',
              description: 'Building responsive, fast, and scalable websites.',
              features: ['Front-end development', 'Back-end development', 'Database design', 'Deployment'],
              cta: 'Hire Me',
              featured: true
            },
            {
              name: 'Brand Identity',
              price: '$1,500',
              frequency: '',
              description: 'Developing cohesive brand identities.',
              features: ['Logo design', 'Color palette', 'Typography', 'Brand guidelines'],
              cta: 'Hire Me'
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
              question: 'What is your availability?',
              answer: 'I am currently available for freelance projects. Please contact me to discuss your project in more detail.'
            },
            {
              question: 'What is your design process?',
              answer: 'I follow a collaborative process that includes discovery, design, feedback, and launch. I work closely with you every step of the way to ensure we create a final product that you love.'
            },
            {
              question: 'What technologies do you use?',
              answer: 'I am proficient in a variety of technologies, including HTML, CSS, JavaScript, React, Node.js, and more. I am always learning and expanding my skillset.'
            }
          ]
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-slate-50',
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
          title: 'Let\'s Work Together',
          description: 'Have a project in mind? I\'d love to hear about it and discuss how we can bring your ideas to life.',
          cta: 'Start a Project',
          formId: 'portfolio-contact'
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-slate-900', textColor: 'text-white',
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
          title: 'Alex Morgan',
          description: 'Creative Designer & Developer',
          copyright: '© 2025 Alex Morgan. All rights reserved.',
          links: [
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'Resume', href: '/resume' },
            { label: 'Blog', href: '/blog' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-slate-800', textColor: 'text-slate-200',
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
            { label: 'Board-certified doctors', color: 'blue', icon: 'user-check' },
            { label: '24/7 emergency care', color: 'red', icon: 'heart' },
            { label: 'Insurance accepted', color: 'green', icon: 'shield-check' }
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
          copyright: '© 2025 MediCare Plus. All rights reserved.',
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
    id: 'nonprofit',
    title: 'Nonprofit',
    description: 'A heartfelt, inspiring template for nonprofit organizations.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433',
    hint: 'This is a hint for the AI to generate content for the nonprofit template.',
    aiInsight: 'This template is designed to raise awareness and drive donations.',
    stats: {
      visitors: '5k',
      leads: '1k',
      conversion: '20%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'Hope Foundation',
          links: [
            { label: 'Our Mission', href: '#mission' },
            { label: 'Programs', href: '#programs' },
            { label: 'Volunteer', href: '#volunteer' },
            { label: 'Donate', href: '#donate' },
          ],
        },
        design: {
          theme: 'warm', backgroundColor: 'bg-green-50', textColor: 'text-gray-900',
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
          title: 'Building Hope, Changing Lives',
          subtitle: 'Join us in our mission to provide education, healthcare, and opportunities to underserved communities around the world. Together, we can make a lasting difference.',
          cta: 'Donate Now',
          secondaryCta: 'Learn More',
          socialProof: '50,000+ lives impacted'
        },
        design: {
          theme: 'warm', layout: 'centered', backgroundColor: 'bg-gradient-to-r from-green-600 to-emerald-600', textColor: 'text-white',
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
          title: 'Our Impact Areas',
          subtitle: 'Creating positive change through focused programs',
          features: [
            {
              title: 'Education',
              description: 'Building schools and providing educational resources to children in remote communities'
            },
            {
              title: 'Healthcare',
              description: 'Mobile clinics and health programs bringing medical care to those who need it most'
            },
            {
              title: 'Clean Water',
              description: 'Installing water wells and sanitation systems to provide access to clean, safe water'
            },
            {
              title: 'Economic Development',
              description: 'Microfinance and skills training programs to help families build sustainable livelihoods'
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
        id: 4,
        type: 'testimonials',
        content: {
          title: 'Stories of Hope',
          testimonials: [
            {
              quote: 'Thanks to Hope Foundation, my daughter can now attend school. Education has given our family hope for a better future.',
              author: 'Maria Santos',
              role: 'Beneficiary, Guatemala'
            },
            {
              quote: 'The clean water well in our village has transformed our community. Children are healthier and women have more time for other activities.',
              author: 'Joseph Kimani',
              role: 'Village Leader, Kenya'
            }
          ]
        },
        design: {
          theme: 'warm', backgroundColor: 'bg-green-50',
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
          title: 'Our Programs',
          subtitle: 'Help us make a difference',
          plans: [
            {
              name: 'Education',
              price: '$25',
              frequency: '/month',
              description: 'Provide a child with school supplies for a year.',
              features: ['Pencils', 'Notebooks', 'Backpack', 'Textbooks'],
              cta: 'Donate'
            },
            {
              name: 'Healthcare',
              price: '$50',
              frequency: '/month',
              description: 'Provide a family with access to basic healthcare.',
              features: ['Vaccinations', 'Check-ups', 'Medication', 'Health education'],
              cta: 'Donate',
              featured: true
            },
            {
              name: 'Clean Water',
              price: '$100',
              frequency: '/month',
              description: 'Provide a village with access to clean water.',
              features: ['Well construction', 'Water filters', 'Sanitation training', 'Hygiene education'],
              cta: 'Donate'
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
              question: 'Is my donation tax-deductible?',
              answer: 'Yes, we are a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the fullest extent of the law.'
            },
            {
              question: 'How much of my donation goes to the cause?',
              answer: 'We are proud to say that 90% of every donation goes directly to our programs. The remaining 10% is used for administrative costs.'
            },
            {
              question: 'Can I volunteer?',
              answer: 'Yes, we are always looking for volunteers to help us with our programs. Please see our volunteer page for more information.'
            }
          ]
        },
        design: {
          theme: 'warm', backgroundColor: 'bg-green-50',
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
          title: 'Ready to Make a Difference?',
          description: 'Your support can change lives. Donate today or volunteer with us to create lasting impact in communities worldwide.',
          cta: 'Donate Now',
          formId: 'nonprofit-contact'
        },
        design: {
          theme: 'warm', backgroundColor: 'bg-green-600', textColor: 'text-white',
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
          title: 'Hope Foundation',
          description: 'Building hope, changing lives since 2010',
          copyright: '© 2025 Hope Foundation. All rights reserved.',
          links: [
            { label: 'Annual Report', href: '/report' },
            { label: 'Transparency', href: '/transparency' },
            { label: 'Volunteer', href: '/volunteer' },
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
  {
    id: 'law-firm',
    title: 'Law Firm',
    description: 'A professional, authoritative template for law firms and legal professionals.',
    image: 'https://images.unsplash.com/photo-1589994965851-a8f483d515f1',
    hint: 'This is a hint for the AI to generate content for the law firm template.',
    aiInsight: 'This template is designed to establish credibility and attract clients.',
    stats: {
      visitors: '6k',
      leads: '500',
      conversion: '8.3%',
    },
    components: [
      {
        id: 1,
        type: 'header',
        content: {
          title: 'Sterling & Associates',
          links: [
            { label: 'Practice Areas', href: '#practice' },
            { label: 'Attorneys', href: '#attorneys' },
            { label: 'Results', href: '#results' },
            { label: 'Contact', href: '#contact' },
          ],
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-slate-50', textColor: 'text-gray-900',
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
          title: 'Experienced Legal Representation You Can Trust',
          subtitle: 'For over 30 years, Sterling & Associates has provided exceptional legal services with a track record of successful outcomes for our clients.',
          cta: 'Free Consultation',
          secondaryCta: 'Our Results',
          socialProof: '$500M+ recovered for clients'
        },
        design: {
          theme: 'elegant', layout: 'split', backgroundColor: 'bg-gradient-to-r from-slate-800 to-slate-600', textColor: 'text-white',
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
          title: 'Our Practice Areas',
          subtitle: 'Comprehensive legal services across multiple disciplines',
          features: [
            {
              title: 'Personal Injury',
              description: 'Aggressive representation for accident victims with a proven track record of maximum settlements'
            },
            {
              title: 'Corporate Law',
              description: 'Strategic business counsel for mergers, acquisitions, contracts, and regulatory compliance'
            },
            {
              title: 'Criminal Defense',
              description: 'Experienced defense attorneys protecting your rights in state and federal criminal matters'
            },
            {
              title: 'Family Law',
              description: 'Compassionate guidance through divorce, custody, and other sensitive family legal issues'
            },
            {
              title: 'Real Estate',
              description: 'Complete real estate legal services from transactions to litigation and zoning matters'
            },
            {
              title: 'Estate Planning',
              description: 'Comprehensive estate planning and probate services to protect your legacy'
            }
          ]
        },
        design: { theme: 'elegant', layout: 'default', backgroundColor: 'bg-white', typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} },
        metadata: undefined
      },
      {
        id: 4,
        type: 'testimonials',
        content: {
          title: 'Client Success Stories',
          testimonials: [
            {
              quote: 'Sterling & Associates fought tirelessly for my case. Their expertise and dedication resulted in a settlement that exceeded my expectations.',
              author: 'Jennifer Adams',
              role: 'Personal Injury Client'
            },
            {
              quote: 'The team provided excellent guidance through our complex merger. Their attention to detail and strategic thinking was invaluable.',
              author: 'Michael Chen',
              role: 'Corporate Client'
            }
          ]
        },
        design: { theme: 'elegant', backgroundColor: 'bg-slate-50', typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} },
        metadata: undefined
      },
      {
        id: 5,
        type: 'pricing',
        content: {
          title: 'Our Services',
          subtitle: 'Legal solutions for your needs',
          plans: [
            {
              name: 'Personal Injury',
              price: 'Contingency',
              frequency: '',
              description: 'No fee unless we win your case.',
              features: ['Free consultation', 'No upfront costs', 'Aggressive representation', 'Proven track record'],
              cta: 'Free Consultation'
            },
            {
              name: 'Corporate Law',
              price: 'Varies',
              frequency: '',
              description: 'Strategic business counsel.',
              features: ['Mergers & acquisitions', 'Contracts', 'Regulatory compliance', 'Intellectual property'],
              cta: 'Free Consultation',
              featured: true
            },
            {
              name: 'Criminal Defense',
              price: 'Varies',
              frequency: '',
              description: 'Experienced defense attorneys.',
              features: ['State & federal crimes', 'DUI/DWI', 'Drug offenses', 'White collar crimes'],
              cta: 'Free Consultation'
            }
          ]
        },
        design: { theme: 'elegant', backgroundColor: 'bg-white', typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} },
        metadata: undefined
      },
      {
        id: 6,
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            {
              question: 'How much do you charge?',
              answer: 'We offer a variety of fee structures depending on the type of case. We offer free consultations to discuss your case and our fees.'
            },
            {
              question: 'What areas of law do you practice?',
              answer: 'We practice in a wide range of areas, including personal injury, corporate law, criminal defense, family law, real estate, and estate planning.'
            },
            {
              question: 'How long have you been in practice?',
              answer: 'Our firm has been in practice for over 30 years. Our attorneys have a combined experience of over 100 years.'
            }
          ]
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-slate-50',
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
          title: 'Need Legal Representation?',
          description: 'Contact us today for a free consultation. We\'ll review your case and explain your legal options.',
          cta: 'Free Consultation',
          formId: 'lawfirm-contact'
        },
        design: {
          theme: 'elegant', backgroundColor: 'bg-slate-800', textColor: 'text-white',
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
          title: 'Sterling & Associates',
          description: 'Excellence in legal representation since 1993',
          copyright: '© 2025 Sterling & Associates. All rights reserved.',
          links: [
            { label: 'Attorney Profiles', href: '/attorneys' },
            { label: 'Case Results', href: '/results' },
            { label: 'Legal Resources', href: '/resources' },
            { label: 'Contact', href: '/contact' },
          ]
        },
        design: {
          theme: 'dark', backgroundColor: 'bg-slate-900', textColor: 'text-white',
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
          copyright: '© 2025 AutoMax Motors. All rights reserved.',
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
          copyright: '© 2025 LUXE Boutique. All rights reserved.',
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
          copyright: '© 2025 Wanderlust Adventures. All rights reserved.',
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
          copyright: '© 2025 ComponentHub. All rights reserved.',
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
  }
];