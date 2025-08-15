
import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateDashboardInsightsInputSchema = z.object({
  metrics: z.object({
    clicks: z.number().min(0).describe('Total click-through events'),
    conversions: z.number().min(0).describe('Successful conversions'),
    commission: z.number().min(0).describe('Total earnings from conversions')
  }),
  funnels: z.array(z.object({
    name: z.string().min(1).describe('Funnel name/identifier'),
    ctr: z.number().min(0).max(100).describe('Click-through rate percentage'),
    optInRate: z.number().min(0).max(100).describe('Opt-in conversion rate percentage')
  })).optional().describe('Conversion funnel metrics'),
  temperature: z.number().min(0).max(1).default(0.5).optional(),
  apiKey: z.string().min(1).describe('User API key for Google AI').optional()
});

export type GenerateDashboardInsightsInput = z.infer<typeof GenerateDashboardInsightsInputSchema>;

const GenerateDashboardInsightsOutputSchema = z.object({
  insights: z.array(z.string().min(80).max(300)).min(2).max(3)
    .describe('Detailed analytical observations with specific data insights and professional marketing analysis'),
  recommendations: z.array(z.object({
    title: z.string().min(15).max(60).describe('Action-oriented recommendation title'),
    description: z.string().min(120).max(300).describe('Detailed description with expected outcomes and specific implementation steps'),
    ctaText: z.string().min(8).max(25).describe('Clear, action-oriented button text'),
    ctaLink: z.string().startsWith('/').describe('Internal app path for the recommended action'),
    icon: z.enum(['Lightbulb', 'BarChart', 'TrendingUp', 'Settings']).describe('Relevant icon for the recommendation type')
  })).min(1).max(2).describe('Actionable recommendations for immediate implementation')
});

export async function generateDashboardInsights(input: GenerateDashboardInsightsInput) {
  const { metrics, funnels, temperature = 0.5, apiKey } = input;
  
  // Use a fallback API key if none provided (for backward compatibility)
  const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;
  
  if (!effectiveApiKey) {
    throw new Error('API key is required for dashboard insights');
  }
  
  // Create a dynamic AI instance with the API key
  const userAI = genkit({
    plugins: [
      googleAI({ apiKey: effectiveApiKey }),
    ],
  });

  const funnelData = funnels?.length ? 
    `## Funnel Metrics
${JSON.stringify(funnels, null, 2)}` : 
    'No funnel data available';

  const prompt = `You are an elite digital marketing analyst and growth strategist with 15+ years of experience optimizing affiliate marketing campaigns and conversion funnels. You've helped businesses scale from zero to millions in revenue.

## HighLaunchPad Performance Analysis

### Current Metrics
${JSON.stringify(metrics, null, 2)}

### Funnel Performance Data
${funnelData}

## Your Mission
Analyze this affiliate marketing performance data and provide actionable insights that will drive immediate improvements. Focus on conversion optimization, traffic quality, and revenue growth opportunities.

## Analysis Framework
Apply these proven methodologies:
- **Conversion Rate Optimization (CRO)** principles
- **Customer Acquisition Cost (CAC)** analysis  
- **Lifetime Value (LTV)** optimization
- **Funnel performance** benchmarking
- **Traffic quality** assessment
- **Revenue per visitor** optimization

## Insights Requirements (Generate 2-3)
Create professional, data-driven insights that:
- Identify specific performance patterns and trends
- Compare against industry benchmarks when relevant
- Highlight both opportunities and potential issues
- Use specific numbers and percentages from the data
- Provide context for what the metrics mean for business growth
- Sound like they come from an experienced marketing analyst

## Recommendations Requirements (Generate 1-2)
Create actionable recommendations with:

**Title Guidelines (10-60 characters):**
- Action-oriented and specific
- Focus on the primary benefit or outcome
- Use power words like "Optimize," "Boost," "Improve," "Scale"

**Description Guidelines (100-300 characters):**
- Explain the specific action to take
- Include expected outcomes or benefits
- Reference relevant metrics or benchmarks
- Make it feel urgent and valuable
- Address the "why" behind the recommendation

**CTA Link Guidelines:**
- Must start with "/" (internal app paths only)
- Point to relevant sections of the app:
  - "/dashboard/funnels" for funnel optimization
  - "/dashboard/ai-tools" for content creation
  - "/dashboard/links" for link management
  - "/dashboard/email" for email marketing
  - "/dashboard/social-scheduler" for social media
  - "/dashboard/settings" for account settings

**Icon Guidelines:**
- Use only: "Lightbulb", "BarChart", "TrendingUp", "Settings"
- Match the recommendation type:
  - "Lightbulb" for creative/content recommendations
  - "BarChart" for analytics/tracking improvements
  - "TrendingUp" for growth/optimization strategies
  - "Settings" for technical/configuration changes

## Context for Analysis
- This is an affiliate marketing platform
- Users create funnels, manage links, and track conversions
- Focus on actionable improvements they can implement immediately
- Consider both beginner and advanced optimization strategies
- Emphasize ROI and measurable outcomes

## Response Format
Return ONLY valid JSON following this exact schema:
{
  "insights": [
    "Professional insight 1 with specific data analysis...",
    "Professional insight 2 with actionable observations...",
    "Professional insight 3 with growth opportunities..."
  ],
  "recommendations": [
    {
      "title": "Action-oriented title",
      "description": "Detailed description with expected outcomes and specific steps to take for maximum impact.",
      "ctaText": "Clear action button text",
      "ctaLink": "/dashboard/relevant-section",
      "icon": "RelevantIcon"
    }
  ]
}`;

  try {
    const response = await userAI.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: prompt,
      config: {
        temperature,
        maxOutputTokens: 1500
      },
      output: {
        format: 'json',
        schema: GenerateDashboardInsightsOutputSchema
      }
    });

    if (!response.output || 
        response.output.insights.length < 2 ||
        response.output.recommendations.length < 1) {
      throw new Error('Invalid insights structure received');
    }

    return response.output;
  } catch (error) {
    console.error('Insights generation failed:', {
      error,
      input: { metrics, funnels: funnels?.length }
    });
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
