import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateProductReviewInputSchema = z.object({
  productName: z.string().min(3).max(100).describe('Product name/title'),
  features: z.string().min(50).describe('Key features/benefits'),
  depth: z.enum(['brief', 'standard', 'detailed']).default('standard'),
  temperature: z.number().min(0).max(1).default(0.6).optional(),
  maxTokens: z.number().min(300).max(1500).default(800).optional()
});

export type GenerateProductReviewInput = z.infer<typeof GenerateProductReviewInputSchema>;

const GenerateProductReviewOutputSchema = z.object({
  review: z.string().min(300).describe('Markdown formatted review')
});

export const generateProductReviewFlow = ai.defineFlow({
  name: 'productReview',
  inputSchema: GenerateProductReviewInputSchema,
  outputSchema: GenerateProductReviewOutputSchema,
}, async (input: GenerateProductReviewInput) => {
  const { productName, features, depth, temperature = 0.6, maxTokens = 800 } = input;
  const prompt = `You are a professional product reviewer with expertise in affiliate marketing, SEO content creation, and consumer psychology. You've written hundreds of high-converting product reviews that rank well in search engines and drive sales.

## Product Analysis Brief
**Product:** ${productName}
**Key Features & Benefits:** ${features}
**Review Depth:** ${depth}

## Your Mission
Create a comprehensive, SEO-optimized product review that builds trust, addresses buyer concerns, and guides readers toward a purchasing decision. Use proven review frameworks and psychological triggers.

## Review Framework
1. **Hook & Context** - Start with a relatable problem or compelling statement
2. **Product Overview** - What it is, who it's for, key value proposition
3. **Detailed Analysis** - Features, benefits, real-world applications
4. **Honest Assessment** - Balanced pros/cons with specific examples
5. **Comparison Context** - How it stacks against alternatives
6. **Final Verdict** - Clear recommendation with reasoning

## Content Requirements
- **SEO-Optimized:** Natural keyword integration, semantic keywords
- **Trust-Building:** Specific details, honest assessment, balanced perspective
- **Conversion-Focused:** Address objections, highlight benefits, clear CTAs
- **Scannable Format:** Headers, bullet points, short paragraphs
- **Engaging Tone:** Conversational yet authoritative

## Psychological Elements to Include
- Social proof indicators
- Scarcity/urgency where appropriate
- Risk reversal (guarantees, returns)
- Benefit-focused language
- Objection handling
- Future pacing (imagine using the product)

## Structure Requirements
- Compelling H1 title with target keyword
- Engaging introduction (hook + preview)
- 4-6 detailed pros with explanations
- 2-3 honest cons with context
- "Who This Is For" section
- "Who Should Skip This" section
- Final verdict with star rating
- Clear call-to-action

## Tone & Style
- Conversational yet professional
- Honest and trustworthy
- Benefit-focused
- Specific and detailed
- Engaging and readable

Generate a comprehensive markdown-formatted review that follows these guidelines and converts readers into buyers.`;

  try {
    const response = await ai.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: prompt,
      config: {
        temperature,
        maxOutputTokens: maxTokens
      },
      output: {
        format: 'text'
      }
    });

    const review = response.text;
    
    if (!validateReviewStructure(review)) {
      throw new Error('Invalid review structure - missing required sections');
    }

    return { review };
  } catch (error) {
    console.error('Review generation failed:', {
      error,
      input: { 
        name: productName.slice(0, 20),
        depth,
        featuresLength: features.length 
      }
    });
    throw new Error(`Review creation error: ${error instanceof Error ? error.message : 'Format validation failed'}`);
  }
});

// Validate markdown structure
function validateReviewStructure(review: string): boolean {
  const requiredHeaders = ['# ', '## Pros', '## Cons', '## Verdict'];
  return requiredHeaders.every(header => review.includes(header));
}