// Industry-specific funnel template variations
// Provides specialized templates for different industries with relevant content and psychology

import type { Component, FunnelTemplate } from './types';
import { generateIndustryContext } from './smart-placeholder-engine';
import { generateDynamicContent } from './dynamic-dates';

// Healthcare industry templates
export const healthcareTemplates = {
  'health-consultation-funnel': {
    id: 'health-consultation-funnel',
    title: 'Healthcare Consultation Funnel',
    description: 'Professional healthcare consultation booking with patient-focused messaging and trust elements.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=400&auto=format&fit=crop',
    hint: 'Perfect for medical practices, telehealth services, and healthcare consultants',
    stats: { ctr: 7.2, optInRate: 34.5, healthScore: 92 },
    aiInsight: 'Healthcare funnels require trust-building, professional credibility, and clear privacy assurances.',
    industry: 'healthcare',
    components: [
      {
        id: 1,
        type: 'header',
        name: 'Healthcare Header',
        content: {
          title: 'Professional Healthcare Consultation',
          logo: { svg: '<svg>...</svg>' },
          links: [
            { label: 'Our Services', href: '/services' },
            { label: 'Patient Resources', href: '/resources' },
            { label: 'Book Consultation', href: '/consultation' }
          ],
          cta: 'Schedule Consultation',
          ctaUrl: '/book-consultation'
        },
        design: { theme: 'medical', backgroundColor: '#ffffff', textColor: '#1e40af', accentColor: '#059669' }
      },
      {
        id: 2,
        type: 'hero',
        name: 'Healthcare Hero',
        content: {
          title: 'Expert Healthcare Consultation From The Comfort of Your Home',
          subtitle: 'Board-certified physicians providing personalized care through secure, HIPAA-compliant telehealth consultations. Get professional medical advice without the wait times or travel.',
          cta: 'Book Your Consultation',
          ctaUrl: '/book-consultation',
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=400&auto=format&fit=crop',
          socialProof: '✅ Trusted by 10,000+ patients nationwide',
          badges: [
            { label: 'HIPAA Compliant', color: 'green', icon: 'shield-check' },
            { label: 'Board Certified', color: 'blue', icon: 'award' },
            { label: '24/7 Available', color: 'purple', icon: 'clock' }
          ]
        }
      },
      {
        id: 3,
        type: 'trust_indicators',
        name: 'Medical Credentials',
        content: {
          title: 'Your Health is in Expert Hands',
          credentials: [
            { title: 'Board Certified Physicians', description: 'All our doctors are board-certified in their specialties' },
            { title: 'HIPAA Compliant Platform', description: 'Your privacy and data security are our top priorities' },
            { title: '10+ Years Experience', description: 'Combined decades of medical practice and patient care' },
            { title: 'Insurance Accepted', description: 'We work with most major insurance providers' }
          ]
        }
      }
    ],
    psychologicalTriggers: ['trust', 'authority', 'convenience', 'security'],
    legalRequirements: ['HIPAA compliance', 'medical disclaimers', 'licensing information']
  }
};

// Finance industry templates
export const financeTemplates = {
  'financial-planning-funnel': {
    id: 'financial-planning-funnel',
    title: 'Financial Planning Consultation Funnel',
    description: 'Professional financial advisory funnel with market insights and wealth-building focus.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400&auto=format&fit=crop',
    hint: 'Ideal for financial advisors, wealth managers, and investment consultants',
    stats: { ctr: 8.9, optInRate: 28.7, healthScore: 89 },
    aiInsight: 'Financial funnels need credibility, risk disclaimers, and focus on security and growth.',
    industry: 'finance',
    components: [
      {
        id: 1,
        type: 'header',
        name: 'Finance Header',
        content: {
          title: 'Wealth Management Solutions',
          subtitle: 'Secure Your Financial Future',
          links: [
            { label: 'Investment Services', href: '/investments' },
            { label: 'Retirement Planning', href: '/retirement' },
            { label: 'Free Consultation', href: '/consultation' }
          ],
          cta: 'Get Free Financial Review',
          ctaUrl: '/financial-review'
        }
      },
      {
        id: 2,
        type: 'hero',
        name: 'Finance Hero', 
        content: {
          title: 'Build Generational Wealth With Strategic Financial Planning',
          subtitle: 'Our certified financial planners help high-net-worth individuals and families preserve and grow their wealth through personalized investment strategies and comprehensive financial planning.',
          cta: 'Schedule Free Consultation',
          ctaUrl: '/schedule-consultation',
          badges: [
            { label: 'SEC Registered', color: 'blue', icon: 'shield-check' },
            { label: 'Fiduciary Duty', color: 'green', icon: 'heart' },
            { label: '$500M+ Managed', color: 'purple', icon: 'trending-up' }
          ]
        }
      },
      {
        id: 3,
        type: 'market_insights',
        name: 'Market Analysis',
        content: {
          title: 'Current Market Opportunities',
          insights: [
            { metric: '8.2%', label: 'Average Portfolio Growth', trend: 'up' },
            { metric: '94%', label: 'Client Satisfaction Rate', trend: 'stable' },
            { metric: '$2.3M', label: 'Average Client Net Worth', trend: 'up' }
          ],
          disclaimer: 'Past performance does not guarantee future results. All investments carry risk of loss.'
        }
      }
    ],
    psychologicalTriggers: ['financial security', 'wealth aspiration', 'expert authority', 'risk mitigation'],
    legalRequirements: ['SEC compliance', 'risk disclaimers', 'fiduciary disclosures']
  }
};

// Real Estate industry templates  
export const realEstateTemplates = {
  'property-valuation-funnel': {
    id: 'property-valuation-funnel',
    title: 'Property Valuation & Listing Funnel',
    description: 'Real estate funnel for property valuations, market analysis, and listing generation.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop',
    hint: 'Perfect for real estate agents, brokers, and property investment companies',
    stats: { ctr: 9.1, optInRate: 42.3, healthScore: 87 },
    aiInsight: 'Real estate funnels focus on local market expertise, property values, and investment potential.',
    industry: 'realestate',
    components: [
      {
        id: 1,
        type: 'header',
        name: 'Real Estate Header',
        content: {
          title: 'Premium Real Estate Services',
          subtitle: 'Your Local Market Expert',
          links: [
            { label: 'Buy', href: '/buy' },
            { label: 'Sell', href: '/sell' },
            { label: 'Market Report', href: '/market-report' },
            { label: 'Free Valuation', href: '/valuation' }
          ],
          cta: 'Get Property Value',
          ctaUrl: '/property-valuation'
        }
      },
      {
        id: 2,
        type: 'hero',
        name: 'Real Estate Hero',
        content: {
          title: 'Discover Your Home\'s True Market Value in Minutes',
          subtitle: 'Get an accurate, AI-powered property valuation based on recent sales, market trends, and local expertise. Our certified appraisers provide comprehensive reports for buying, selling, or refinancing decisions.',
          cta: 'Get Free Property Valuation',
          ctaUrl: '/get-valuation',
          socialProof: '✅ Over 5,000 properties valued in the last 12 months',
          urgency: '🏠 Market conditions are changing daily - get your valuation now'
        }
      },
      {
        id: 3,
        type: 'market_stats',
        name: 'Local Market Data',
        content: {
          title: 'Current Market Conditions',
          stats: [
            { value: '15%', label: 'Average Price Increase (YoY)', trend: 'up' },
            { value: '18 days', label: 'Average Days on Market', trend: 'down' },
            { value: '97%', label: 'List to Sale Price Ratio', trend: 'stable' },
            { value: '234', label: 'Properties Sold This Month', trend: 'up' }
          ],
          marketInsight: 'Seller\'s market conditions with high demand and limited inventory driving competitive pricing.'
        }
      }
    ],
    psychologicalTriggers: ['investment potential', 'market timing', 'local expertise', 'property pride'],
    legalRequirements: ['license disclosure', 'fair housing compliance', 'accurate market data']
  }
};

// Education industry templates
export const educationTemplates = {
  'online-course-funnel': {
    id: 'online-course-funnel', 
    title: 'Online Course Enrollment Funnel',
    description: 'Educational course funnel with curriculum highlights, instructor credibility, and learning outcomes.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop',
    hint: 'Ideal for online educators, course creators, and educational institutions',
    stats: { ctr: 11.2, optInRate: 38.9, healthScore: 91 },
    aiInsight: 'Education funnels emphasize learning outcomes, instructor expertise, and career advancement.',
    industry: 'education',
    components: [
      {
        id: 1,
        type: 'header',
        name: 'Education Header',
        content: {
          title: 'Professional Development Academy',
          subtitle: 'Advance Your Career',
          links: [
            { label: 'Courses', href: '/courses' },
            { label: 'Instructors', href: '/instructors' },
            { label: 'Success Stories', href: '/success-stories' },
            { label: 'Enroll Now', href: '/enroll' }
          ]
        }
      },
      {
        id: 2,
        type: 'hero',
        name: 'Education Hero',
        content: {
          title: 'Master In-Demand Skills That Accelerate Your Career Growth',
          subtitle: 'Join 50,000+ professionals who have advanced their careers through our comprehensive, industry-recognized certification programs. Learn from expert practitioners and get hands-on experience with real-world projects.',
          cta: 'View Course Catalog',
          ctaUrl: '/courses',
          badges: [
            { label: 'Industry Certified', color: 'blue', icon: 'award' },
            { label: '95% Job Placement', color: 'green', icon: 'trending-up' },
            { label: 'Lifetime Access', color: 'purple', icon: 'infinity' }
          ]
        }
      },
      {
        id: 3,
        type: 'learning_outcomes',
        name: 'Course Benefits',
        content: {
          title: 'What You\'ll Achieve',
          outcomes: [
            { outcome: 'Industry-recognized certification', description: 'Earn credentials that employers value and recognize' },
            { outcome: 'Portfolio of real projects', description: 'Build a professional portfolio with hands-on project work' },
            { outcome: 'Career advancement support', description: 'Get job placement assistance and career coaching' },
            { outcome: 'Professional network access', description: 'Connect with industry leaders and fellow professionals' }
          ]
        }
      }
    ],
    psychologicalTriggers: ['career advancement', 'skill mastery', 'certification value', 'professional network'],
    legalRequirements: ['accreditation information', 'job placement statistics', 'refund policies']
  }
};

// Fitness industry templates
export const fitnessTemplates = {
  'fitness-transformation-funnel': {
    id: 'fitness-transformation-funnel',
    title: 'Fitness Transformation Program Funnel',
    description: 'Health and fitness program funnel with transformation stories and personalized coaching.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop',
    hint: 'Perfect for personal trainers, fitness coaches, and wellness programs',
    stats: { ctr: 12.8, optInRate: 35.6, healthScore: 88 },
    aiInsight: 'Fitness funnels focus on transformation, motivation, and personalized results.',
    industry: 'fitness',
    components: [
      {
        id: 1,
        type: 'header',
        name: 'Fitness Header',
        content: {
          title: 'Transform Your Body & Life',
          subtitle: 'Professional Fitness Coaching',
          links: [
            { label: 'Programs', href: '/programs' },
            { label: 'Transformations', href: '/transformations' },
            { label: 'Nutrition', href: '/nutrition' },
            { label: 'Start Today', href: '/start' }
          ]
        }
      },
      {
        id: 2,
        type: 'hero',
        name: 'Fitness Hero',
        content: {
          title: 'Transform Your Body in 90 Days With Our Proven System',
          subtitle: 'Join thousands who have achieved lasting results through our science-based fitness and nutrition program. Get personalized workouts, meal plans, and 1-on-1 coaching support.',
          cta: 'Start My Transformation',
          ctaUrl: '/transformation-program',
          socialProof: '✅ 10,000+ successful transformations',
          guarantee: '💪 100% satisfaction guarantee or money back'
        }
      },
      {
        id: 3,
        type: 'transformation_proof',
        name: 'Success Stories',
        content: {
          title: 'Real People, Real Results',
          transformations: [
            { name: 'Sarah M.', result: 'Lost 35 lbs in 12 weeks', beforeAfter: { before: '/before1.jpg', after: '/after1.jpg' } },
            { name: 'Mike R.', result: 'Gained 15 lbs muscle in 16 weeks', beforeAfter: { before: '/before2.jpg', after: '/after2.jpg' } }
          ]
        }
      }
    ],
    psychologicalTriggers: ['body transformation', 'health motivation', 'social proof', 'personal coaching'],
    legalRequirements: ['health disclaimers', 'fitness safety warnings', 'nutrition guidance']
  }
};

// Utility functions to merge industry templates with base templates
export function getIndustryTemplate(industry: string, templateType: string): Partial<FunnelTemplate> | null {
  const industryMap: Record<string, any> = {
    healthcare: healthcareTemplates,
    finance: financeTemplates,
    realestate: realEstateTemplates,
    education: educationTemplates,
    fitness: fitnessTemplates
  };

  const templates = industryMap[industry];
  return templates ? templates[templateType] || null : null;
}

export function enhanceTemplateWithIndustryContent(
  baseTemplate: FunnelTemplate,
  industry: string
): FunnelTemplate {
  const industryContext = generateIndustryContext(industry);
  const dynamicContent = generateDynamicContent(baseTemplate.id);

  // Industry-specific content adjustments
  const industryAdjustments: Record<string, any> = {
    healthcare: {
      trustIndicators: ['HIPAA Compliant', 'Licensed Professionals', 'Secure Platform'],
      callToActionStyle: 'professional',
      requiredDisclaimer: 'This information is not intended to replace professional medical advice.'
    },
    finance: {
      trustIndicators: ['SEC Registered', 'Fiduciary Duty', 'Insured Accounts'],
      callToActionStyle: 'conservative',
      requiredDisclaimer: 'Investment products are not FDIC insured and may lose value.'
    },
    realestate: {
      trustIndicators: ['Licensed Agent', 'MLS Member', 'Local Expert'],
      callToActionStyle: 'urgent',
      requiredDisclaimer: 'Equal Housing Opportunity'
    },
    education: {
      trustIndicators: ['Accredited Institution', 'Industry Certified', 'Job Placement Support'],
      callToActionStyle: 'aspirational',
      requiredDisclaimer: 'Individual results may vary'
    },
    fitness: {
      trustIndicators: ['Certified Trainers', 'Science-Based', 'Proven Results'],
      callToActionStyle: 'motivational',
      requiredDisclaimer: 'Consult your physician before starting any exercise program'
    }
  };

  const adjustments = industryAdjustments[industry] || {};

  return {
    ...baseTemplate,
    industry,
    components: baseTemplate.components.map(component => ({
      ...component,
      content: {
        ...component.content,
        trustIndicators: adjustments.trustIndicators,
        disclaimer: adjustments.requiredDisclaimer,
        ...dynamicContent
      },
      design: {
        ...(component.design || {}),
        callToActionStyle: adjustments.callToActionStyle,
        typography: (component.design && component.design.typography) || {},
        colors: (component.design && component.design.colors) || {},
        shadows: (component.design && component.design.shadows) || {},
        borders: (component.design && component.design.borders) || {},
        interactions: (component.design && component.design.interactions) || {}
      }
    }))
  };
}

// Get all available industry templates
export function getAllIndustryTemplates(): Record<string, any> {
  return {
    healthcare: healthcareTemplates,
    finance: financeTemplates,
    realestate: realEstateTemplates,
    education: educationTemplates,
    fitness: fitnessTemplates
  };
}

// Get industry-specific psychological triggers
export function getIndustryPsychologicalTriggers(industry: string): string[] {
  const triggers: Record<string, string[]> = {
    healthcare: ['health anxiety', 'professional trust', 'convenience', 'privacy', 'expert authority'],
    finance: ['financial security', 'wealth building', 'risk mitigation', 'expert guidance', 'market timing'],
    realestate: ['investment potential', 'market timing', 'local expertise', 'property pride', 'location value'],
    education: ['career advancement', 'skill mastery', 'certification value', 'learning achievement', 'professional growth'],
    fitness: ['body transformation', 'health motivation', 'personal achievement', 'lifestyle change', 'confidence building']
  };

  return triggers[industry] || [];
}

const industryTemplatesExports = {
  healthcareTemplates,
  financeTemplates,
  realEstateTemplates,
  educationTemplates,
  fitnessTemplates,
  getIndustryTemplate,
  enhanceTemplateWithIndustryContent,
  getAllIndustryTemplates,
  getIndustryPsychologicalTriggers
};

export default industryTemplatesExports;