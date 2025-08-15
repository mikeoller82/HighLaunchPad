// Psychological triggers and persuasion techniques for funnel templates
// Implements proven behavioral psychology principles to increase conversions

export interface PsychologicalTrigger {
  id: string;
  name: string;
  description: string;
  category: 'urgency' | 'scarcity' | 'social_proof' | 'authority' | 'reciprocity' | 'commitment' | 'liking' | 'loss_aversion';
  implementation: {
    copyExamples: string[];
    visualElements: string[];
    placement: string[];
  };
  effectivenessRating: number; // 1-10
  industryRelevance: string[];
}

export const psychologicalTriggers: PsychologicalTrigger[] = [
  {
    id: 'time_urgency',
    name: 'Time-Based Urgency',
    description: 'Creates pressure to act immediately due to time constraints',
    category: 'urgency',
    implementation: {
      copyExamples: [
        'Offer expires at midnight tonight',
        'Only 24 hours left to claim this bonus',
        'Final hours - don\'t miss out',
        'Act now before it\'s too late'
      ],
      visualElements: ['countdown timers', 'clock icons', 'red alert colors', 'flashing elements'],
      placement: ['hero section', 'call-to-action buttons', 'exit-intent popups', 'email subject lines']
    },
    effectivenessRating: 9,
    industryRelevance: ['ecommerce', 'coaching', 'education', 'saas']
  },

  {
    id: 'quantity_scarcity',
    name: 'Limited Quantity Scarcity',
    description: 'Shows limited availability to trigger fear of missing out',
    category: 'scarcity',
    implementation: {
      copyExamples: [
        'Only 47 spots remaining',
        'Limited to 100 customers',
        'Just 5 left in stock',
        'Nearly sold out - reserve yours now'
      ],
      visualElements: ['progress bars', 'stock counters', 'warning badges', 'inventory displays'],
      placement: ['product pages', 'checkout process', 'pricing sections', 'header announcements']
    },
    effectivenessRating: 8,
    industryRelevance: ['ecommerce', 'events', 'coaching', 'consulting']
  },

  {
    id: 'customer_testimonials',
    name: 'Customer Success Stories',
    description: 'Builds trust through peer validation and social proof',
    category: 'social_proof',
    implementation: {
      copyExamples: [
        'Sarah increased her revenue by 340% in 90 days',
        '10,000+ customers can\'t be wrong',
        'Join thousands of successful entrepreneurs',
        'See what our clients are saying'
      ],
      visualElements: ['testimonial cards', 'star ratings', 'customer photos', 'video testimonials'],
      placement: ['homepage', 'sales pages', 'checkout pages', 'email campaigns']
    },
    effectivenessRating: 9,
    industryRelevance: ['all']
  },

  {
    id: 'expert_authority',
    name: 'Expert Authority',
    description: 'Establishes credibility through expertise, credentials, and achievements',
    category: 'authority',
    implementation: {
      copyExamples: [
        'As featured in Forbes and TechCrunch',
        'Trusted by Fortune 500 companies',
        'Created by industry experts with 20+ years experience',
        'Award-winning solution used by professionals worldwide'
      ],
      visualElements: ['credential badges', 'media logos', 'award symbols', 'expert photos'],
      placement: ['about sections', 'header areas', 'footer', 'landing pages']
    },
    effectivenessRating: 8,
    industryRelevance: ['consulting', 'finance', 'healthcare', 'education']
  },

  {
    id: 'free_value_first',
    name: 'Reciprocity Through Free Value',
    description: 'Provides free value first to trigger reciprocity principle',
    category: 'reciprocity',
    implementation: {
      copyExamples: [
        'Free comprehensive guide worth $297',
        'Complimentary strategy session ($500 value)',
        'No-cost assessment and recommendations',
        'Free bonus materials with purchase'
      ],
      visualElements: ['value badges', 'gift icons', 'bonus callouts', 'free stamps'],
      placement: ['lead magnets', 'email opt-ins', 'bonus sections', 'checkout process']
    },
    effectivenessRating: 8,
    industryRelevance: ['all']
  },

  {
    id: 'loss_aversion_messaging',
    name: 'Loss Aversion Messaging',
    description: 'Focuses on what customers will lose by not taking action',
    category: 'loss_aversion',
    implementation: {
      copyExamples: [
        'Don\'t let your competitors get ahead',
        'Stop leaving money on the table',
        'You can\'t afford to wait any longer',
        'Every day you delay costs you potential profits'
      ],
      visualElements: ['warning symbols', 'competitor comparisons', 'opportunity cost calculators'],
      placement: ['sales pages', 'email campaigns', 'retargeting ads', 'exit-intent popups']
    },
    effectivenessRating: 7,
    industryRelevance: ['business', 'finance', 'consulting', 'saas']
  },

  {
    id: 'commitment_consistency',
    name: 'Commitment and Consistency',
    description: 'Gets small commitments that lead to larger ones',
    category: 'commitment',
    implementation: {
      copyExamples: [
        'Take the first step towards your goals',
        'Commit to your success journey',
        'Join others who are serious about results',
        'Make the decision to invest in yourself'
      ],
      visualElements: ['progress indicators', 'commitment ceremonies', 'goal-setting tools'],
      placement: ['onboarding flows', 'application processes', 'quiz results', 'program signups']
    },
    effectivenessRating: 7,
    industryRelevance: ['coaching', 'education', 'fitness', 'self-improvement']
  },

  {
    id: 'similarity_liking',
    name: 'Similarity and Liking',
    description: 'Creates connection through shared experiences and relatability',
    category: 'liking',
    implementation: {
      copyExamples: [
        'I used to struggle with the same problem',
        'Like you, I was frustrated with slow results',
        'As a fellow entrepreneur, I understand',
        'We\'ve all been where you are right now'
      ],
      visualElements: ['founder stories', 'behind-the-scenes content', 'personal photos'],
      placement: ['about pages', 'email signatures', 'video content', 'case studies']
    },
    effectivenessRating: 6,
    industryRelevance: ['coaching', 'consulting', 'personal brands']
  },

  {
    id: 'bandwagon_effect',
    name: 'Bandwagon Effect',
    description: 'Shows that others are taking action to encourage participation',
    category: 'social_proof',
    implementation: {
      copyExamples: [
        '2,847 people signed up in the last 48 hours',
        'Join the movement of successful entrepreneurs',
        'Be part of the community that\'s changing everything',
        'Don\'t get left behind - everyone is making the switch'
      ],
      visualElements: ['live counters', 'community numbers', 'trending indicators'],
      placement: ['signup forms', 'landing pages', 'social media', 'email campaigns']
    },
    effectivenessRating: 7,
    industryRelevance: ['saas', 'social platforms', 'movements', 'courses']
  },

  {
    id: 'peak_end_rule',
    name: 'Peak-End Rule',
    description: 'Creates memorable peak experiences and positive endings',
    category: 'liking',
    implementation: {
      copyExamples: [
        'Surprise bonus for taking action today',
        'Exclusive gift for our valued customers',
        'Special recognition for top performers',
        'Thank you bonus - we appreciate you'
      ],
      visualElements: ['surprise elements', 'bonus reveals', 'celebration graphics'],
      placement: ['checkout confirmations', 'program completions', 'milestone achievements']
    },
    effectivenessRating: 6,
    industryRelevance: ['all']
  }
];

// Enhanced psychological trigger implementations
export class PsychologicalTriggerEngine {
  private triggers: PsychologicalTrigger[];

  constructor() {
    this.triggers = psychologicalTriggers;
  }

  // Get triggers by category
  getTriggersByCategory(category: string): PsychologicalTrigger[] {
    return this.triggers.filter(trigger => trigger.category === category);
  }

  // Get triggers by industry
  getTriggersByIndustry(industry: string): PsychologicalTrigger[] {
    return this.triggers.filter(trigger => 
      trigger.industryRelevance.includes(industry) || 
      trigger.industryRelevance.includes('all')
    );
  }

  // Get most effective triggers
  getTopTriggers(limit: number = 5): PsychologicalTrigger[] {
    return this.triggers
      .sort((a, b) => b.effectivenessRating - a.effectivenessRating)
      .slice(0, limit);
  }

  // Apply triggers to template content
  enhanceContentWithTriggers(
    content: string, 
    triggerIds: string[], 
    context: { industry?: string; templateType?: string } = {}
  ): string {
    let enhancedContent = content;
    
    triggerIds.forEach(triggerId => {
      const trigger = this.triggers.find(t => t.id === triggerId);
      if (trigger) {
        enhancedContent = this.applyTriggerToContent(enhancedContent, trigger, context);
      }
    });

    return enhancedContent;
  }

  // Apply individual trigger to content
  private applyTriggerToContent(
    content: string, 
    trigger: PsychologicalTrigger, 
    context: { industry?: string; templateType?: string }
  ): string {
    const examples = trigger.implementation.copyExamples;
    const relevantExample = this.selectRelevantExample(examples, context);
    
    // Smart content enhancement based on trigger type
    switch (trigger.category) {
      case 'urgency':
        return this.addUrgencyElements(content, relevantExample);
      case 'scarcity':
        return this.addScarcityElements(content, relevantExample);
      case 'social_proof':
        return this.addSocialProofElements(content, relevantExample);
      case 'authority':
        return this.addAuthorityElements(content, relevantExample);
      case 'reciprocity':
        return this.addReciprocityElements(content, relevantExample);
      default:
        return content;
    }
  }

  private selectRelevantExample(examples: string[], context: any): string {
    // Simple selection for now - could be enhanced with AI/ML
    return examples[Math.floor(Math.random() * examples.length)];
  }

  private addUrgencyElements(content: string, example: string): string {
    // Add urgency messaging to CTAs and headers
    return content.replace(
      /(Get|Buy|Start|Join|Claim)/g, 
      `$1 Now - ${example.split(' ').slice(-3).join(' ')}`
    );
  }

  private addScarcityElements(content: string, example: string): string {
    // Add scarcity messaging
    return content + `\n\n⚠️ ${example}`;
  }

  private addSocialProofElements(content: string, example: string): string {
    // Add social proof
    return content.replace(
      /Join us/g,
      `${example} - Join us`
    );
  }

  private addAuthorityElements(content: string, example: string): string {
    // Add authority indicators
    return content + `\n\n✅ ${example}`;
  }

  private addReciprocityElements(content: string, example: string): string {
    // Add value-first messaging
    return `🎁 Bonus: ${example}\n\n${content}`;
  }

  // Generate trigger recommendations for template
  recommendTriggers(
    templateType: string, 
    industry: string, 
    audience: string
  ): PsychologicalTrigger[] {
    const industryTriggers = this.getTriggersByIndustry(industry);
    const templateSpecificTriggers = this.getTemplateSpecificTriggers(templateType);
    const audienceSpecificTriggers = this.getAudienceSpecificTriggers(audience);

    // Combine and rank recommendations
    const allRecommendations = [
      ...industryTriggers,
      ...templateSpecificTriggers,
      ...audienceSpecificTriggers
    ];

    // Remove duplicates and sort by effectiveness
    const uniqueTriggers = Array.from(
      new Map(allRecommendations.map(t => [t.id, t])).values()
    );

    return uniqueTriggers
      .sort((a, b) => b.effectivenessRating - a.effectivenessRating)
      .slice(0, 5);
  }

  private getTemplateSpecificTriggers(templateType: string): PsychologicalTrigger[] {
    const templateTriggerMap: Record<string, string[]> = {
      'flash-sale': ['time_urgency', 'quantity_scarcity', 'loss_aversion_messaging'],
      'webinar': ['commitment_consistency', 'bandwagon_effect', 'free_value_first'],
      'coaching': ['expert_authority', 'customer_testimonials', 'similarity_liking'],
      'quiz': ['commitment_consistency', 'reciprocity', 'peak_end_rule']
    };

    const triggerIds = templateTriggerMap[templateType] || [];
    return triggerIds.map(id => this.triggers.find(t => t.id === id)).filter(Boolean) as PsychologicalTrigger[];
  }

  private getAudienceSpecificTriggers(audience: string): PsychologicalTrigger[] {
    const audienceTriggerMap: Record<string, string[]> = {
      'entrepreneurs': ['loss_aversion_messaging', 'customer_testimonials', 'expert_authority'],
      'consumers': ['quantity_scarcity', 'bandwagon_effect', 'peak_end_rule'],
      'professionals': ['expert_authority', 'commitment_consistency', 'free_value_first']
    };

    const triggerIds = audienceTriggerMap[audience] || [];
    return triggerIds.map(id => this.triggers.find(t => t.id === id)).filter(Boolean) as PsychologicalTrigger[];
  }
}

// Utility functions
export function getTriggerByName(name: string): PsychologicalTrigger | undefined {
  return psychologicalTriggers.find(trigger => trigger.name === name);
}

export function getTriggerById(id: string): PsychologicalTrigger | undefined {
  return psychologicalTriggers.find(trigger => trigger.id === id);
}

export function getTriggersForIndustry(industry: string): PsychologicalTrigger[] {
  const engine = new PsychologicalTriggerEngine();
  return engine.getTriggersByIndustry(industry);
}

// Enhanced template content with psychological triggers
export function enhanceTemplateWithPsychology(
  template: any,
  industry: string,
  audience: string = 'general'
): any {
  const engine = new PsychologicalTriggerEngine();
  const recommendedTriggers = engine.recommendTriggers(template.id, industry, audience);
  const triggerIds = recommendedTriggers.map(t => t.id);

  return {
    ...template,
    psychologicalTriggers: recommendedTriggers.map(t => t.name),
    components: template.components.map((component: any) => ({
      ...component,
      content: {
        ...component.content,
        // Enhance content with psychological triggers
        enhancedContent: typeof component.content === 'string' 
          ? engine.enhanceContentWithTriggers(component.content, triggerIds, { industry, templateType: template.id })
          : component.content
      }
    }))
  };
}

// Export default engine
export const defaultTriggerEngine = new PsychologicalTriggerEngine();

const psychologicalTriggersExports = {
  psychologicalTriggers,
  PsychologicalTriggerEngine,
  getTriggerByName,
  getTriggerById,
  getTriggersForIndustry,
  enhanceTemplateWithPsychology,
  defaultTriggerEngine
};

export default psychologicalTriggersExports;