import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';

const EMOTION_OPTIONS = [
  'Urgency', 'Curiosity', 'Transformation',
  'Excitement', 'Fear', 'Trust', 'Exclusivity'
] as const;

const GenerateProductHookInputSchema = z.object({
  productDescription: z.string().min(20).max(500).describe('Detailed product/service description'),
  emotion: z.enum(EMOTION_OPTIONS).describe('Primary emotional trigger'),
  temperature: z.number().min(0).max(1).default(0.8).optional(),
  hookCount: z.number().min(3).max(7).default(5).optional()
});

export type GenerateProductHookInput = z.infer<typeof GenerateProductHookInputSchema>;

const GenerateProductHookOutputSchema = z.object({
  hooks: z.array(z.string().min(15).max(120)).length(5)
    .describe('5 compelling marketing hooks targeting specified emotion')
});

export const generateProductHookFlow = ai.defineFlow({
  name: 'productHooks',
  inputSchema: GenerateProductHookInputSchema,
  outputSchema: GenerateProductHookOutputSchema,
}, async (input: GenerateProductHookInput) => {
  const { productDescription, emotion, temperature = 0.8 } = input;
  const prompt = `# Marketing Hook Brief

## Product
${productDescription}

## Emotional Target
- Primary emotion: ${emotion}
- Psychological triggers: ${getEmotionTriggers(emotion)}

## Requirements
- Generate EXACTLY 5 hooks
- 15-120 characters each
- Platform-agnostic (works for social/ads/email)
- Include power words

## Response Format
{"hooks": ["hook1", "hook2", "hook3", "hook4", "hook5"]}

IMPORTANT: Generate exactly 5 hooks, each between 15-120 characters.`;

  try {
    const response = await ai.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: prompt,
      config: {
        temperature,
        maxOutputTokens: 800
      },
      output: {
        format: 'json',
        schema: GenerateProductHookOutputSchema
      }
    });

    if (!response.output?.hooks || 
        response.output.hooks.length !== 5 ||
        response.output.hooks.some(hook => hook.length < 15 || hook.length > 120)) {
      throw new Error('Invalid hook structure received');
    }

    return {
      hooks: response.output.hooks
    };
  } catch (error) {
    console.error('Hook generation failed:', {
      error,
      input: { emotion, descLength: productDescription.length }
    });
    throw new Error(`Hook creation error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
});

// Helper function for emotion triggers
function getEmotionTriggers(emotion: string): string {
  const triggers: Record<string, string> = {
    Urgency: 'FOMO, scarcity, time sensitivity',
    Curiosity: 'Mystery, questions, knowledge gaps',
    Transformation: 'Before/after, growth, change',
    Excitement: 'Anticipation, novelty, energy',
    Fear: 'Risk avoidance, protection, security',
    Trust: 'Social proof, authority, reliability',
    Exclusivity: 'VIP access, limited availability, elite status'
  };
  return triggers[emotion] || 'emotional engagement';
}
