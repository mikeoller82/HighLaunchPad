import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const JourneyOrchestrationInputSchema = z.object({
  customerData: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
    leadScore: z.number().optional(),
    stage: z.enum(['awareness', 'consideration', 'decision', 'purchase', 'retention', 'advocacy']),
    lastInteraction: z.string().optional(),
    preferences: z.object({
      communicationChannel: z.enum(['email', 'sms', 'phone', 'social']).optional(),
      frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
      contentType: z.array(z.string()).optional()
    }).optional()
  }).describe('Customer information for journey orchestration'),
  journeyType: z.enum(['onboarding', 'nurturing', 'retention', 'winback', 'upsell', 'advocacy']).describe('Type of customer journey'),
  triggerEvent: z.object({
    type: z.string(),
    timestamp: z.string(),
    data: z.record(z.any()).optional()
  }).describe('Event that triggered the journey'),
  businessRules: z.object({
    maxTouchpoints: z.number().default(10),
    journeyDuration: z.number().default(30), // days
    allowedChannels: z.array(z.string()).default(['email', 'sms']),
    businessHours: z.boolean().default(true),
    respectUnsubscribe: z.boolean().default(true)
  }).optional().describe('Business rules and constraints'),
  goals: z.array(z.object({
    metric: z.string(),
    target: z.number(),
    timeframe: z.number() // days
  })).optional().describe('Journey success metrics'),
  apiKey: z.string().describe('User API key for Google AI')
});

const JourneyOrchestrationOutputSchema = z.object({
  journeyPlan: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    estimatedDuration: z.number(), // days
    totalTouchpoints: z.number(),
    expectedOutcome: z.string()
  }).describe('Overall journey plan'),
  touchpoints: z.array(z.object({
    id: z.string(),
    sequence: z.number(),
    type: z.enum(['email', 'sms', 'call', 'social', 'notification', 'task']),
    channel: z.string(),
    timing: z.object({
      delay: z.number(), // hours from previous touchpoint
      scheduledTime: z.string().optional(),
      timezone: z.string().default('UTC')
    }),
    content: z.object({
      subject: z.string().optional(),
      message: z.string(),
      callToAction: z.string().optional(),
      personalization: z.array(z.string())
    }),
    conditions: z.array(z.object({
      type: z.enum(['engagement', 'behavior', 'time', 'score']),
      operator: z.enum(['equals', 'greater_than', 'less_than', 'contains']),
      value: z.string(),
      action: z.enum(['continue', 'skip', 'branch', 'exit'])
    })).optional(),
    success_metrics: z.array(z.string())
  })).describe('Sequence of customer touchpoints'),
  branches: z.array(z.object({
    id: z.string(),
    condition: z.string(),
    description: z.string(),
    alternativePath: z.array(z.string()) // touchpoint IDs
  })).optional().describe('Conditional journey branches'),
  exitCriteria: z.array(z.object({
    condition: z.string(),
    action: z.enum(['complete', 'pause', 'transfer']),
    description: z.string()
  })).describe('Journey exit conditions'),
  personalization: z.object({
    variables: z.array(z.string()),
    dynamicContent: z.array(z.string()),
    recommendations: z.array(z.string())
  }).describe('Personalization elements'),
  optimization: z.object({
    testingStrategy: z.string(),
    kpis: z.array(z.string()),
    improvementAreas: z.array(z.string())
  }).describe('Journey optimization recommendations')
});

export async function journeyOrchestrationFlow(input: z.infer<typeof JourneyOrchestrationInputSchema>) {
    const { customerData, journeyType, triggerEvent, businessRules, goals, apiKey } = input;
    
    // Create AI instance with user's API key
    const userAI = genkit({
      plugins: [
        googleAI({ apiKey }),
      ],
    });

    const customerContext = `
Customer Profile:
- ID: ${customerData.id}
- Name: ${customerData.name || 'Unknown'}
- Email: ${customerData.email}
- Company: ${customerData.company || 'Unknown'}
- Industry: ${customerData.industry || 'Unknown'}
- Lead Score: ${customerData.leadScore || 'Not scored'}
- Current Stage: ${customerData.stage}
- Last Interaction: ${customerData.lastInteraction || 'None'}
- Preferences: ${JSON.stringify(customerData.preferences || {}, null, 2)}
`;

    const businessContext = businessRules ? `
Business Rules:
- Max Touchpoints: ${businessRules.maxTouchpoints}
- Journey Duration: ${businessRules.journeyDuration} days
- Allowed Channels: ${businessRules.allowedChannels.join(', ')}
- Business Hours Only: ${businessRules.businessHours}
- Respect Unsubscribe: ${businessRules.respectUnsubscribe}
` : 'No specific business rules provided';

    const goalsContext = goals ? `
Journey Goals:
${goals.map(g => `- ${g.metric}: ${g.target} within ${g.timeframe} days`).join('\n')}
` : 'No specific goals defined';

    const prompt = `You are an expert customer journey orchestration specialist with 10+ years of experience in marketing automation, customer experience design, and behavioral psychology. You excel at creating personalized, multi-channel customer journeys that drive engagement and conversions.

## Journey Orchestration Request
**Journey Type:** ${journeyType}
**Trigger Event:** ${triggerEvent.type} at ${triggerEvent.timestamp}
**Trigger Data:** ${JSON.stringify(triggerEvent.data || {}, null, 2)}

## Customer Context
${customerContext}

## Business Context
${businessContext}

## Goals and Objectives
${goalsContext}

## Your Mission
Design a comprehensive, personalized customer journey for ${journeyType} that:

1. **Maximizes Engagement** - Creates meaningful touchpoints that resonate with the customer
2. **Drives Desired Outcomes** - Guides customers toward specific goals and conversions
3. **Respects Preferences** - Honors customer communication preferences and boundaries
4. **Optimizes Timing** - Delivers messages at optimal times for maximum impact
5. **Enables Personalization** - Incorporates dynamic content and personalization
6. **Includes Optimization** - Provides testing and improvement strategies

## Journey Design Framework

### Journey Types and Strategies

#### Onboarding Journey
- Welcome sequence with product education
- Progressive feature introduction
- Success milestone celebrations
- Support and guidance touchpoints

#### Nurturing Journey
- Educational content delivery
- Trust-building communications
- Social proof and testimonials
- Gradual sales progression

#### Retention Journey
- Value reinforcement messages
- Usage optimization tips
- Loyalty program communications
- Feedback collection

#### Winback Journey
- Re-engagement campaigns
- Special offers and incentives
- Problem resolution outreach
- Alternative solution suggestions

#### Upsell Journey
- Usage analysis and recommendations
- Feature upgrade suggestions
- Success story sharing
- Limited-time offers

#### Advocacy Journey
- Referral program invitations
- Case study participation requests
- Review and testimonial requests
- Community engagement opportunities

### Touchpoint Design Principles
- **Relevance**: Every touchpoint must provide value
- **Timing**: Optimal timing based on customer behavior
- **Channel**: Right message through preferred channel
- **Personalization**: Tailored to individual customer
- **Progression**: Logical flow toward desired outcome

### Personalization Elements
- Dynamic content based on customer data
- Behavioral triggers and responses
- Industry-specific messaging
- Role-based communications
- Preference-driven channel selection

### Optimization Strategy
- A/B testing for key touchpoints
- Performance monitoring and analytics
- Continuous improvement based on data
- Feedback loop integration
- Success metric tracking

## Quality Standards
- Each touchpoint must have clear purpose and value
- Timing must be optimized for customer engagement
- Content must be personalized and relevant
- Journey must respect customer preferences
- Exit criteria must be clearly defined
- Success metrics must be measurable

Create a comprehensive journey orchestration plan that delivers exceptional customer experiences and drives business results.`;

    const response = await userAI.generate({
      model: googleAI.model('gemini-2.0-flash-exp'),
      prompt: prompt,
      config: {
        temperature: 0.6,
        maxOutputTokens: 4000
      }
    });

    // Generate journey plan based on type and customer data
    const journeyPlan = generateJourneyPlan(journeyType, customerData, businessRules);
    const touchpoints = generateTouchpoints(journeyType, customerData, businessRules);
    const branches = generateBranches(journeyType, touchpoints);
    const exitCriteria = generateExitCriteria(journeyType, goals);
    const personalization = generatePersonalizationStrategy(customerData);
    const optimization = generateOptimizationStrategy(journeyType, goals);

    return {
      journeyPlan,
      touchpoints,
      branches,
      exitCriteria,
      personalization,
      optimization
    };
}

function generateJourneyPlan(journeyType: string, customerData: any, businessRules?: any) {
  const journeyId = `journey_${journeyType}_${Date.now()}`;
  
  const journeyConfigs = {
    onboarding: {
      name: 'Customer Onboarding Journey',
      description: 'Welcome new customers and guide them through initial product setup and usage',
      estimatedDuration: 14,
      totalTouchpoints: 7,
      expectedOutcome: 'Successful product adoption and first value realization'
    },
    nurturing: {
      name: 'Lead Nurturing Journey',
      description: 'Educate and build trust with prospects to move them toward purchase decision',
      estimatedDuration: 21,
      totalTouchpoints: 8,
      expectedOutcome: 'Qualified lead ready for sales engagement'
    },
    retention: {
      name: 'Customer Retention Journey',
      description: 'Maintain engagement and prevent churn through value reinforcement',
      estimatedDuration: 30,
      totalTouchpoints: 6,
      expectedOutcome: 'Renewed subscription or continued engagement'
    },
    winback: {
      name: 'Customer Winback Journey',
      description: 'Re-engage inactive customers and encourage return to active usage',
      estimatedDuration: 14,
      totalTouchpoints: 5,
      expectedOutcome: 'Reactivated customer or clear closure'
    },
    upsell: {
      name: 'Upsell Opportunity Journey',
      description: 'Present upgrade opportunities based on usage patterns and needs',
      estimatedDuration: 10,
      totalTouchpoints: 4,
      expectedOutcome: 'Successful upgrade or expansion'
    },
    advocacy: {
      name: 'Customer Advocacy Journey',
      description: 'Convert satisfied customers into brand advocates and referral sources',
      estimatedDuration: 21,
      totalTouchpoints: 6,
      expectedOutcome: 'Active brand advocate generating referrals'
    }
  };

  const config = journeyConfigs[journeyType as keyof typeof journeyConfigs] || journeyConfigs.nurturing;
  
  return {
    id: journeyId,
    name: config.name,
    description: config.description,
    estimatedDuration: businessRules?.journeyDuration || config.estimatedDuration,
    totalTouchpoints: Math.min(businessRules?.maxTouchpoints || 10, config.totalTouchpoints),
    expectedOutcome: config.expectedOutcome
  };
}

function generateTouchpoints(journeyType: string, customerData: any, businessRules?: any) {
  const preferredChannel = customerData.preferences?.communicationChannel || 'email';
  const allowedChannels = businessRules?.allowedChannels || ['email', 'sms'];
  
  const touchpointTemplates = {
    onboarding: [
      {
        sequence: 1,
        type: 'email' as const,
        delay: 0,
        subject: 'Welcome to [Company]! Let\'s get you started',
        message: `Hi ${customerData.name || 'there'}! Welcome to our platform. We're excited to help you achieve your goals. Here's what to expect in your first week...`,
        callToAction: 'Complete your profile setup',
        timing: 'immediate'
      },
      {
        sequence: 2,
        type: 'email' as const,
        delay: 24,
        subject: 'Your quick start guide is here',
        message: 'Ready to dive in? Here\'s your personalized quick start guide to help you get the most value from day one.',
        callToAction: 'Start your first project',
        timing: '24 hours'
      },
      {
        sequence: 3,
        type: 'email' as const,
        delay: 72,
        subject: 'How are things going?',
        message: 'It\'s been a few days since you joined us. How\'s your experience so far? Need any help getting started?',
        callToAction: 'Schedule a help session',
        timing: '3 days'
      }
    ],
    nurturing: [
      {
        sequence: 1,
        type: 'email' as const,
        delay: 0,
        subject: 'Thanks for your interest in [Product]',
        message: `Hi ${customerData.name || 'there'}! Thanks for showing interest in our solution. Here's some valuable information to help you evaluate your options.`,
        callToAction: 'Download our buyer\'s guide',
        timing: 'immediate'
      },
      {
        sequence: 2,
        type: 'email' as const,
        delay: 48,
        subject: 'How [Company] solved a similar challenge',
        message: 'I thought you might find this case study interesting - it shows how a company in your industry overcame similar challenges.',
        callToAction: 'Read the full case study',
        timing: '2 days'
      }
    ],
    retention: [
      {
        sequence: 1,
        type: 'email' as const,
        delay: 0,
        subject: 'We miss you! Here\'s what you\'ve been missing',
        message: 'We noticed you haven\'t been active lately. Here are some new features and improvements we\'ve made that you might find valuable.',
        callToAction: 'Explore new features',
        timing: 'immediate'
      }
    ]
  };

  const templates = touchpointTemplates[journeyType as keyof typeof touchpointTemplates] || touchpointTemplates.nurturing;
  
  return templates.map((template, index) => ({
    id: `touchpoint_${index + 1}_${Date.now()}`,
    sequence: template.sequence,
    type: allowedChannels.includes(preferredChannel) ? preferredChannel as any : 'email' as any,
    channel: allowedChannels.includes(preferredChannel) ? preferredChannel : 'email',
    timing: {
      delay: template.delay,
      scheduledTime: undefined,
      timezone: 'UTC'
    },
    content: {
      subject: template.subject,
      message: template.message,
      callToAction: template.callToAction,
      personalization: [
        'customer_name',
        'company_name',
        'industry',
        'last_interaction'
      ]
    },
    conditions: [
      {
        type: 'engagement' as const,
        operator: 'greater_than' as const,
        value: '0',
        action: 'continue' as const
      }
    ],
    success_metrics: [
      'open_rate',
      'click_rate',
      'conversion_rate'
    ]
  }));
}

function generateBranches(journeyType: string, touchpoints: any[]) {
  const branches = [];

  // Engagement-based branching
  branches.push({
    id: `branch_engagement_${Date.now()}`,
    condition: 'High engagement (opened and clicked)',
    description: 'Customer shows high engagement - accelerate journey',
    alternativePath: touchpoints.slice(0, 2).map(t => t.id) // Skip some touchpoints
  });

  // Low engagement branching
  branches.push({
    id: `branch_low_engagement_${Date.now()}`,
    condition: 'Low engagement (no opens in 3 touchpoints)',
    description: 'Customer shows low engagement - try different approach',
    alternativePath: [touchpoints[touchpoints.length - 1]?.id] // Jump to final touchpoint
  });

  return branches;
}

function generateExitCriteria(journeyType: string, goals?: any[]) {
  const exitCriteria = [];

  // Goal achievement
  if (goals && goals.length > 0) {
    exitCriteria.push({
      condition: 'Primary goal achieved',
      action: 'complete' as const,
      description: 'Customer has achieved the primary journey objective'
    });
  }

  // Unsubscribe
  exitCriteria.push({
    condition: 'Customer unsubscribes',
    action: 'complete' as const,
    description: 'Respect customer preference to stop communications'
  });

  // Conversion
  exitCriteria.push({
    condition: 'Customer converts/purchases',
    action: 'transfer' as const,
    description: 'Move customer to post-purchase journey'
  });

  // Time limit
  exitCriteria.push({
    condition: 'Journey duration exceeded',
    action: 'pause' as const,
    description: 'Journey has reached maximum duration without conversion'
  });

  return exitCriteria;
}

function generatePersonalizationStrategy(customerData: any) {
  const variables = [
    'customer_name',
    'company_name',
    'industry',
    'lead_score',
    'last_interaction_date',
    'preferred_channel'
  ];

  const dynamicContent = [
    'Industry-specific case studies',
    'Role-based feature highlights',
    'Personalized product recommendations',
    'Custom pricing information',
    'Relevant blog content'
  ];

  const recommendations = [
    'Use customer name in all communications',
    'Reference their company and industry when relevant',
    'Adapt content based on their current journey stage',
    'Respect their communication channel preferences',
    'Include relevant social proof from similar customers'
  ];

  return {
    variables,
    dynamicContent,
    recommendations
  };
}

function generateOptimizationStrategy(journeyType: string, goals?: any[]) {
  const testingStrategy = 'Implement A/B testing on subject lines, send times, and call-to-action buttons. Test different content approaches for each customer segment.';

  const kpis = [
    'Email open rates',
    'Click-through rates',
    'Conversion rates',
    'Journey completion rates',
    'Time to conversion',
    'Customer satisfaction scores'
  ];

  const improvementAreas = [
    'Optimize send times based on customer timezone and behavior',
    'Improve subject line performance through testing',
    'Enhance personalization with dynamic content',
    'Reduce journey length for high-intent customers',
    'Add more interactive content elements',
    'Implement predictive analytics for better timing'
  ];

  return {
    testingStrategy,
    kpis,
    improvementAreas
  };
}