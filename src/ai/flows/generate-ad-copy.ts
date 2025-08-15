import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateAdCopyInputSchema = z.object({
  product: z.string().min(3).describe('Product/service to advertise'),
  audience: z.string().min(3).describe('Target demographic/psychographic'),
  platform: z.enum(['Facebook', 'Instagram', 'Google Ads', 'LinkedIn', 'TikTok']).describe('Advertising platform'),
  temperature: z.number().min(0).max(1).default(0.7).optional(),
  variants: z.number().min(3).max(5).default(3).optional(),
  apiKey: z.string().min(1).describe('User API key for Google AI')
});

export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const GenerateAdCopyOutputSchema = z.object({
  headlines: z.array(z.string()).describe('5 compelling headline variations using different psychological triggers'),
  primaryText: z.string().describe('Comprehensive 200-400 word primary advertising copy with storytelling and emotional hooks'),
  descriptions: z.array(z.string()).describe('3 detailed description variations with different psychological angles')
}).describe('High-converting structured ad copy output');



export async function generateAdCopy(input: GenerateAdCopyInput) {
  const { product, audience, platform, temperature = 0.7, apiKey } = input;
  
  // Create a dynamic AI instance with the user's API key
  const userAI = genkit({
    plugins: [
      googleAI({ apiKey }),
    ],
  });

  const prompt = `You are a world-class copywriter and direct response marketing expert with 20+ years of experience creating billion-dollar ad campaigns. You've worked with top brands and understand the psychology of persuasion at the deepest level.

## Campaign Brief
**Product/Service:** ${product}
**Target Audience:** ${audience}
**Platform:** ${platform}

## Your Mission
Create a complete, high-converting ad campaign that combines proven direct response principles with modern psychological triggers. This isn't just copy—it's a persuasion system designed to move people from scroll to sale.

## Platform-Specific Guidelines & Optimization
${platform === 'Facebook' ? `
- Headlines: 25-40 characters (mobile-first, thumb-stopping power)
- Primary text: 150-300 words with strong hook in first 125 characters
- Use pattern interrupts, social proof, and curiosity gaps
- Include strategic emojis for visual breaks and engagement
- Focus on scroll-stopping visuals and emotional triggers
- Leverage Facebook's social nature with community language
` : platform === 'Google Ads' ? `
- Headlines: 30 characters max per headline (search-intent focused)
- Descriptions: 90 characters max (benefit-driven, action-oriented)
- Include high-intent keywords naturally
- Focus on immediate problem-solving and clear value
- Use urgency and scarcity when appropriate
- Match search intent with solution-focused language
` : platform === 'LinkedIn' ? `
- Professional, authority-building tone with personality
- Focus on business ROI, efficiency gains, and career advancement
- Use industry-specific language and insider knowledge
- Emphasize credibility, case studies, and social proof
- 200-400 word primary text with thought leadership angle
- Professional networking and growth mindset language
` : platform === 'Instagram' ? `
- Visual-first copy that complements imagery
- Lifestyle-focused, aspirational messaging
- Use hashtag-friendly language and trending phrases
- Story-driven content with personal connection
- Shorter, punchier copy with strong visual appeal
` : platform === 'TikTok' ? `
- Trend-aware, authentic, conversational tone
- Hook within first 3 seconds of copy
- Use current slang and platform-native language
- Focus on entertainment value mixed with selling
- Short, punchy, meme-worthy phrases
` : `
- Platform-optimized copy with native feel
- Engaging, scroll-stopping content
- Clear value proposition with emotional appeal
- Strong visual and psychological appeal
`}

## Advanced Copywriting Frameworks & Psychology
- AIDA + Emotional Amplification (Attention → Interest → Desire → Action)
- PAS with Solution Stacking (Problem → Agitation → Solution + Bonus Solutions)
- Before/After/Bridge with Transformation Stories
- Social proof layering (testimonials, numbers, authority)
- Scarcity and urgency with ethical persuasion
- Benefit-driven messaging with feature translation
- Loss aversion and gain framing
- Authority positioning and credibility markers
- Community and belonging triggers
- Curiosity gaps and open loops

## Content Requirements - LONGER, BETTER COPY
- Generate EXACTLY 5 headline variations using different psychological triggers:
  * Curiosity-driven headline
  * Benefit-focused headline  
  * Problem/solution headline
  * Social proof headline
  * Urgency/scarcity headline

- Create 1 comprehensive primary text (200-400 words) that includes:
  * Attention-grabbing hook (first 1-2 sentences)
  * Problem identification and agitation
  * Solution presentation with unique mechanism
  * Social proof or credibility markers
  * Benefit stacking with emotional triggers
  * Risk reversal or guarantee mention
  * Clear, compelling call-to-action
  * Storytelling elements that create connection

- Generate EXACTLY 3 description variations with different psychological angles:
  * Benefit-focused description
  * Problem-solution description  
  * Social proof/testimonial description

## Quality Standards
- Every word must earn its place - no filler content
- Use power words and emotional triggers strategically
- Include specific numbers, percentages, or timeframes when possible
- Create curiosity gaps that demand attention
- Use conversational, human language (avoid corporate speak)
- Include sensory language and vivid imagery
- Build desire through transformation promises
- Address objections preemptively
- Create urgency without being pushy

## Response Format (JSON)
Return ONLY a valid JSON object with this exact structure:
{
  "headlines": ["headline1", "headline2", "headline3", "headline4", "headline5"],
  "primaryText": "comprehensive 200-400 word primary ad copy with storytelling, emotional hooks, social proof, and compelling CTA",
  "descriptions": ["description1", "description2", "description3"]
}

Do not include any text before or after the JSON. The response must be valid JSON that can be parsed directly.`;

  try {
    // Add retry logic and better error handling
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await userAI.generate({
          model: googleAI.model('gemini-2.0-flash'),
          prompt: prompt,
          config: {
            temperature,
            maxOutputTokens: 2000
          },
          output: {
            format: 'json',
            schema: GenerateAdCopyOutputSchema
          }
        });

        console.log('Raw AI response:', response);

        const output = response.output;
        
        if (!output?.headlines?.length || !output.primaryText || !output.descriptions?.length) {
          console.error('Invalid ad copy structure:', output);
          throw new Error('Invalid ad copy structure received');
        }

        return {
          headlines: output.headlines,
          primaryText: output.primaryText,
          descriptions: output.descriptions
        };
      } catch (error) {
        console.error(`Ad copy generation attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    // If all retries failed, return a fallback response
    console.error('All retry attempts failed, returning fallback');
    return {
      headlines: [
        `Transform Your ${product} Experience Today`,
        `The Ultimate ${product} Solution for ${audience}`,
        `Why ${audience} Choose Our ${product}`,
        `Get Results with Our Proven ${product}`,
        `Join Thousands Using Our ${product}`
      ],
      primaryText: `Discover how our ${product} is specifically designed for ${audience}. With proven results and satisfied customers, we're here to help you achieve your goals. Don't wait - start your journey today and see the difference our solution can make for your business.`,
      descriptions: [
        `Perfect ${product} solution for ${audience} - get started today!`,
        `Join thousands of satisfied customers using our ${product}`,
        `Transform your business with our proven ${product} system`
      ]
    };
  } catch (error) {
    console.error('Ad copy generation failed:', error);
    // Return fallback even on complete failure
    return {
      headlines: [
        `Transform Your Business Today`,
        `The Ultimate Solution You've Been Looking For`,
        `Why Smart Business Owners Choose Us`,
        `Get Results with Our Proven System`,
        `Join Thousands of Satisfied Customers`
      ],
      primaryText: `Discover how our solution can transform your business. With proven results and satisfied customers, we're here to help you achieve your goals. Don't wait - start your journey today and see the difference we can make.`,
      descriptions: [
        `Perfect solution for your business - get started today!`,
        `Join thousands of satisfied customers`,
        `Transform your business with our proven system`
      ]
    };
  }
}
