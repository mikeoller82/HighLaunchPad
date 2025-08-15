// Professional template blocks for enhanced website and funnel building
// This file contains reusable content blocks and styling examples

// Color schemes for templates
export const colorSchemes = {
  modern: {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    textMuted: '#6B7280'
  },
  dark: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#F59E0B',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textMuted: '#94A3B8'
  },
  warm: {
    primary: '#DC2626',
    secondary: '#B91C1C',
    accent: '#F59E0B',
    background: '#FFFBEB',
    surface: '#FEF3C7',
    text: '#92400E',
    textMuted: '#065F46'
  },
  nature: {
    primary: '#059669',
    secondary: '#047857',
    accent: '#D97706',
    background: '#F0FDF4',
    surface: '#DCFCE7',
    text: '#064E3B',
    textMuted: '#065F46'
  },
  luxury: {
    primary: '#7C2D12',
    secondary: '#92400E',
    accent: '#F59E0B',
    background: '#FEF7ED',
    surface: '#FED7AA',
    text: '#431407',
    textMuted: '#9A3412'
  }
};

// Professional content examples for different industries
export const contentExamples = {
  saas: {
    headlines: [
      'Transform Your Business with AI-Powered Solutions',
      'Scale Your Operations Without Scaling Your Team',
      'The All-in-One Platform That Actually Works'
    ],
    subheadlines: [
      'Join 50,000+ companies using our platform to automate workflows, boost productivity by 340%, and scale faster than ever before.',
      'Streamline your entire business with one powerful platform. No more juggling multiple tools or manual processes.',
      'Everything you need to run your business efficiently, all in one place. Setup takes 5 minutes, results are immediate.'
    ]
  },
  consulting: {
    headlines: [
      'Scale Your Business to 7-Figures Without Burning Out',
      'Stop Wasting Money on Marketing That Doesn\'t Work',
      'The Growth Strategy That Actually Delivers Results'
    ],
    subheadlines: [
      'Proven strategies used by 500+ entrepreneurs to build profitable, sustainable businesses. Get your custom growth plan in our free strategy session.',
      'Book a complimentary Revenue Acceleration Session and get a custom plan to increase your revenue by 50% in 90 days. Guaranteed.',
      'We\'ve helped 200+ businesses scale from 6 to 7 figures using our proven methodology. Your turn to join them.'
    ]
  },
  ecommerce: {
    headlines: [
      'Premium Quality, Unbeatable Prices',
      'Discover Products You\'ll Actually Love',
      'The Shopping Experience You Deserve'
    ],
    subheadlines: [
      'Discover our curated collection of premium products. Free shipping on orders over $50. 30-day money-back guarantee.',
      'Carefully curated products that combine style, quality, and value. Join thousands of satisfied customers.',
      'Shop with confidence knowing every product is hand-selected for quality and backed by our satisfaction guarantee.'
    ]
  }
};

// Professional feature examples
export const featureExamples = {
  benefits: [
    {
      title: '10x ROI Guarantee',
      description: 'Our clients see an average 10x return on investment within 90 days, or we work for free until you do.',
      icon: '📈',
      stat: '10x',
      statLabel: 'Average ROI'
    },
    {
      title: 'Lightning Fast Setup',
      description: 'Go from signup to first results in under 24 hours. No complex onboarding or lengthy setup processes.',
      icon: '⚡',
      stat: '24hrs',
      statLabel: 'To First Results'
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-level encryption, SOC 2 compliance, and GDPR ready. Your data is always safe and secure.',
      icon: '🔒',
      stat: '99.9%',
      statLabel: 'Uptime SLA'
    }
  ],
  services: [
    {
      title: 'AI-Powered Analytics',
      description: 'Get actionable insights with our advanced AI that analyzes your data and provides recommendations for growth.',
      icon: '🤖',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
    },
    {
      title: 'Seamless Integrations',
      description: 'Connect with 500+ tools and platforms. Set up takes less than 5 minutes with our one-click integrations.',
      icon: '🔗',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31'
    },
    {
      title: '24/7 Expert Support',
      description: 'Our team of experts is available around the clock to help you succeed. Average response time: 2 minutes.',
      icon: '🎧',
      image: 'https://images.unsplash.com/photo-1553484771-371a605b060b'
    }
  ]
};

// Professional testimonial examples
export const testimonialExamples = {
  results: [
    {
      quote: 'This platform increased our conversion rate by 340% in just 3 months. The ROI has been incredible.',
      author: 'Sarah Chen',
      title: 'CEO, TechFlow',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786',
      company: 'TechFlow',
      rating: 5,
      results: '+340% conversion rate'
    },
    {
      quote: 'We went from $50K to $500K ARR in 8 months. The strategies actually work and the support is phenomenal.',
      author: 'Marcus Rodriguez',
      title: 'Founder, GrowthLab',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      company: 'GrowthLab',
      rating: 5,
      results: '$450K ARR increase'
    }
  ],
  social: [
    {
      quote: 'The automation features saved us 20 hours per week. Our team can now focus on high-value activities.',
      author: 'Emily Watson',
      title: 'COO, ScaleUp Inc',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      company: 'ScaleUp Inc',
      rating: 5,
      results: '20 hours saved/week'
    }
  ]
};

// Professional pricing examples
export const pricingExamples = {
  saas: [
    {
      title: 'Starter',
      price: '$29',
      frequency: '/month',
      description: 'Perfect for small teams getting started.',
      features: [
        'Up to 5 team members',
        '10 projects',
        '5GB storage',
        'Email support',
        'Basic analytics',
        'Mobile app access'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      title: 'Professional',
      price: '$79',
      frequency: '/month',
      description: 'For growing businesses that need more power.',
      features: [
        'Up to 25 team members',
        'Unlimited projects',
        '100GB storage',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
        'API access',
        'White-label options'
      ],
      cta: 'Start Free Trial',
      popular: true,
      savings: 'Save 20%'
    }
  ],
  consulting: [
    {
      title: 'Strategy Session',
      price: 'FREE',
      frequency: '',
      description: 'Get a custom growth plan for your business.',
      features: [
        '60-minute strategy call',
        'Business growth audit',
        'Custom action plan',
        'Resource recommendations',
        'No sales pitch guarantee'
      ],
      cta: 'Book Free Call',
      popular: true
    }
  ]
};

// Export all examples
export const templateBlocks = {
  colorSchemes,
  contentExamples,
  featureExamples,
  testimonialExamples,
  pricingExamples
};

export default templateBlocks;