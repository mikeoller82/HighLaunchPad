import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateEmailContentInputSchema = z.object({
  objective: z.string().min(10).describe('Primary goal of the email campaign'),
  tone: z.enum(['enthusiastic', 'professional', 'urgent', 'friendly']).default('professional'),
  productDetails: z.string().min(50).describe('Key features and benefits'),
  temperature: z.number().min(0).max(1).default(0.7).optional(),
  subjectCount: z.number().min(3).max(5).default(3).optional()
});

export type GenerateEmailContentInput = z.infer<typeof GenerateEmailContentInputSchema>;

const GenerateEmailContentOutputSchema = z.object({
  subjectLines: z.array(z.string().min(30).max(60)).length(5)
    .describe('5 optimized subject line variations'),
  body: z.string().min(150).max(500).describe('Persuasive email body copy')
});

export const generateEmailContentFlow = ai.defineFlow({
  name: 'emailContent',
  inputSchema: GenerateEmailContentInputSchema,
  outputSchema: GenerateEmailContentOutputSchema,
}, async (input: GenerateEmailContentInput) => {
  const { objective, tone, productDetails, temperature = 0.7 } = input;
  const prompt = `You are an elite email marketing specialist with a proven track record of creating campaigns that achieve 40%+ open rates and 15%+ click-through rates. You understand email psychology, deliverability, and conversion optimization.

## Campaign Brief
**Primary Objective:** ${objective}
**Tone of Voice:** ${tone}
**Product/Offer Details:** ${productDetails}

## Your Mission
Create a high-converting email campaign that cuts through inbox noise, builds engagement, and drives action. Apply advanced email marketing psychology and proven frameworks.

## Subject Line Strategy
Create 5 subject lines using different psychological triggers:
1. **Curiosity Gap** - Create intrigue without revealing everything
2. **Urgency/Scarcity** - Time-sensitive or limited availability
3. **Benefit-Driven** - Clear value proposition
4. **Personal/Direct** - Feels like a personal message
5. **Social Proof** - Leverages others' experiences

## Subject Line Best Practices
- 30-50 characters for mobile optimization
- Avoid spam trigger words
- Use power words and emotional triggers
- Include numbers when relevant
- Test different angles (problem vs. solution)

## Email Body Framework
Apply the AIDA structure with modern email psychology:

**ATTENTION** (Opening Hook)
- Pattern interrupt or compelling statement
- Personalized greeting
- Immediate value or intrigue

**INTEREST** (Value Proposition)
- Clear benefit statement
- Address specific pain points
- Use storytelling elements

**DESIRE** (Social Proof & Benefits)
- Specific results or outcomes
- Social proof elements
- Risk reversal (guarantees)

**ACTION** (Clear CTA)
- Single, clear call-to-action
- Create urgency or scarcity
- Remove friction

## Email Optimization Elements
- Scannable format (short paragraphs, bullet points)
- Mobile-first design considerations
- Personalization opportunities
- A/B testing variations
- Deliverability best practices

## Psychological Triggers to Include
- Reciprocity (free value)
- Social proof (testimonials, numbers)
- Authority (credentials, expertise)
- Scarcity (limited time/quantity)
- Commitment (small asks first)

## Response Requirements
- 5 subject lines (30-50 characters each)
- Email body (200-400 words)
- ${tone} tone throughout
- Clear, compelling CTA
- Mobile-optimized formatting

Generate email content that converts subscribers into customers.`;

  try {
    const response = await ai.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: prompt,
      config: {
        temperature,
        maxOutputTokens: 1000
      },
      output: {
        format: 'json',
        schema: GenerateEmailContentOutputSchema
      }
    });

    if (!response.output?.subjectLines?.length || !response.output.body) {
      throw new Error('Invalid email content structure received');
    }

    return {
      subjectLines: response.output.subjectLines,
      body: response.output.body
    };
  } catch (error) {
    console.error('Email generation failed:', {
      error,
      input: { objective: objective.slice(0, 50) + '...', tone }
    });
    throw new Error(`Email creation error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
});