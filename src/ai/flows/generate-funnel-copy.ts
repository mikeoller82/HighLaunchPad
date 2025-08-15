import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateFunnelCopyInputSchema = z.object({
  productDescription: z.string().min(20).describe('Detailed product/service description'),
  copyType: z.enum([
    'Hero Headline', 
    'Feature Description', 
    'CTA Button Text',
    'Value Proposition',
    'Testimonial Quote'
  ]).describe('Type of marketing copy to generate'),
  userPrompt: z.string().min(10).describe('Specific creative direction'),
  temperature: z.number().min(0).max(1).default(0.7).optional(),
  maxLength: z.number().min(10).max(300).default(120).optional(),
  apiKey: z.string().min(1).describe('User API key for Google AI')
});

export type GenerateFunnelCopyInput = z.infer<typeof GenerateFunnelCopyInputSchema>;

const GenerateFunnelCopyOutputSchema = z.object({
  generatedCopy: z.string().min(10).max(300).describe('Resulting marketing copy')
});

export async function generateFunnelCopy(input: GenerateFunnelCopyInput) {
  const { productDescription, copyType, userPrompt, temperature = 0.7, maxLength = 120, apiKey } = input;
  
  // Create a dynamic AI instance with the user's API key
  const userAI = genkit({
    plugins: [
      googleAI({ apiKey }),
    ],
  });

  const prompt = `# Funnel Copy Brief

## Product
${productDescription}

## Copy Type
${copyType}

## Creative Direction
${userPrompt}

## Requirements
- Length: ${maxLength} characters max
- Clear value proposition
- Strong ${copyType === 'CTA Button Text' ? 'action-oriented' : 'attention-grabbing'} language

## Response Format
{"generatedCopy": "..."}`;

  try {
    const response = await userAI.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: prompt,
      config: {
        temperature,
        maxOutputTokens: maxLength + 50
      },
      output: {
        format: 'json',
        schema: GenerateFunnelCopyOutputSchema
      }
    });

    if (!response.output?.generatedCopy || 
        response.output.generatedCopy.length > maxLength) {
      throw new Error('Invalid copy length or format received');
    }

    return response.output;
  } catch (error) {
    console.error('Funnel copy generation failed:', {
      error,
      input: { copyType, promptLength: userPrompt.length }
    });
    throw new Error(`Copy creation error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

