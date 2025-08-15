
import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const CTA_TYPES = [
  'Action-Oriented', 'Value-Driven', 'Curiosity-Based',
  'Urgency-Creating', 'Benefit-Focused'
] as const;

const SuggestCTAsInputSchema = z.object({
  context: z.string().min(20).max(500).describe('Landing page/ad context'),
  ctaType: z.enum(CTA_TYPES).default('Action-Oriented'),
  count: z.number().min(3).max(7).default(5).optional(),
  maxLength: z.number().min(10).max(60).default(40).optional(),
  temperature: z.number().min(0).max(1).default(0.7).optional(),
  apiKey: z.string().optional()
});

export type SuggestCTAsInput = z.infer<typeof SuggestCTAsInputSchema>;

export const SuggestCTAsOutputSchema = z.array(
  z.string().min(10).max(60)
).length(5).describe('5 compelling call-to-action phrases');

export async function suggestCTAsFlow(input: SuggestCTAsInput) {
  const { context, ctaType, maxLength = 40, temperature = 0.7, apiKey } = input;
  
  // Create a dynamic AI instance with the user's API key
  const userAI = genkit({
    plugins: [
      googleAI({ apiKey }),
    ],
  });
  const prompt = `# CTA Generation Brief

## Context
${context}

## CTA Type
${ctaType}

## Requirements
- Generate EXACTLY 5 CTAs
- ${maxLength} characters max each
- Strong action verbs
- Clear value proposition
- Platform-agnostic

## Response Format
["CTA 1", "CTA 2", "CTA 3", "CTA 4", "CTA 5"]

IMPORTANT: Generate exactly 5 CTAs, each between 10-${maxLength} characters.`;

  try {
    const response = await userAI.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: prompt,
      config: {
        temperature,
        maxOutputTokens: 250
      },
      output: {
        format: 'json',
        schema: SuggestCTAsOutputSchema
      }
    });

    if (!response.output || 
        response.output.length !== 5 ||
        response.output.some((cta: string) => cta.length > maxLength)) {
      throw new Error('Invalid CTA structure received');
    }

    return response.output;
  } catch (error) {
    console.error('CTA generation failed:', {
      error,
      input: { ctaType, contextLength: context.length }
    });
    throw new Error(`CTA suggestion error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}