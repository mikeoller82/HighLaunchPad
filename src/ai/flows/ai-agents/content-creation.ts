import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const ContentCreationInputSchema = z.object({
    topic: z.string().describe('The main topic for content creation'),
    niche: z.string().describe('The specific niche or industry'),
    targetAudience: z.string().describe('Target audience for the content'),
    tone: z.enum(['professional', 'casual', 'authoritative', 'conversational', 'technical']).describe('Content tone'),
    length: z.enum(['short', 'medium', 'long', 'comprehensive']).describe('Content length'),
    contentType: z.enum(['blog', 'article', 'guide', 'tutorial', 'case-study']).describe('Type of content'),
    includeResearch: z.boolean().default(true).describe('Include research and data'),
    seoKeywords: z.array(z.string()).optional().describe('SEO keywords to include'),
    outline: z.array(z.string()).optional().describe('Content outline'),
    apiKey: z.string().describe('User API key for Google AI')
});

const ContentCreationOutputSchema = z.object({
    title: z.string().describe('Content title'),
    metaDescription: z.string().describe('SEO meta description'),
    introduction: z.string().describe('Content introduction'),
    sections: z.array(z.object({
        heading: z.string(),
        content: z.string(),
        subsections: z.array(z.object({
            subheading: z.string(),
            content: z.string()
        })).optional()
    })).describe('Main content sections'),
    conclusion: z.string().describe('Content conclusion'),
    callToAction: z.string().describe('Call-to-action'),
    tags: z.array(z.string()).describe('Content tags'),
    estimatedReadTime: z.number().describe('Estimated reading time in minutes'),
    seoScore: z.number().describe('SEO optimization score'),
    researchSources: z.array(z.string()).optional().describe('Research sources')
});

export async function generateContent(input: z.infer<typeof ContentCreationInputSchema>) {
    const { topic, niche, targetAudience, tone, length, contentType, includeResearch, seoKeywords, outline, apiKey } = input;

    // Create AI instance with user's API key
    const userAI = genkit({
        plugins: [
            googleAI({ apiKey }),
        ],
    });

    const lengthSpecs = {
        short: '800-1,200 words',
        medium: '1,500-2,500 words',
        long: '2,500-4,000 words',
        comprehensive: '4,000-6,000 words'
    };

    const prompt = `You are an expert content creator and SEO specialist with 10+ years of experience creating high-quality, engaging content that ranks well and drives conversions.

## Content Brief
**Topic:** ${topic}
**Niche:** ${niche}
**Target Audience:** ${targetAudience}
**Tone:** ${tone}
**Content Type:** ${contentType}
**Target Length:** ${lengthSpecs[length]}
**Include Research:** ${includeResearch ? 'Yes' : 'No'}
**SEO Keywords:** ${seoKeywords?.join(', ') || 'Not specified'}
**Outline:** ${outline?.join(', ') || 'Not specified'}

## Your Mission
Create comprehensive, authoritative ${contentType} content that provides exceptional value to ${targetAudience} while being optimized for search engines and conversions.

## Content Requirements
1. **Compelling Title** - Create an engaging, SEO-optimized title
2. **Meta Description** - Write a compelling 150-160 character meta description
3. **Engaging Introduction** - Hook readers and set expectations
4. **Structured Content** - Well-organized sections with clear headings
5. **Actionable Insights** - Provide practical, implementable advice
6. **Strong Conclusion** - Summarize key points and provide next steps
7. **Compelling CTA** - Include a relevant call-to-action

## Quality Standards
- Every paragraph must provide unique value
- Use specific examples and data points
- Include actionable tips and strategies
- Maintain consistent ${tone} tone throughout
- Optimize for readability and engagement
- Include relevant keywords naturally

Return as JSON with this structure:
{
  "title": "Engaging, SEO-optimized title",
  "metaDescription": "150-160 character meta description",
  "introduction": "Engaging introduction paragraph",
  "sections": [
    {
      "heading": "Section Title",
      "content": "Detailed section content",
      "subsections": [
        {
          "subheading": "Subsection Title",
          "content": "Subsection content"
        }
      ]
    }
  ],
  "conclusion": "Strong conclusion with next steps",
  "callToAction": "Compelling call-to-action",
  "tags": ["tag1", "tag2", "tag3"],
  "estimatedReadTime": 8,
  "seoScore": 85,
  "researchSources": ["source1", "source2"]
}`;

    try {
        const response = await userAI.generate({
            model: googleAI.model('gemini-2.0-flash-exp'),
            prompt: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 4000
            }
        });

        // Try to parse JSON response
        try {
            const parsed = JSON.parse(response.text);
            return {
                title: parsed.title || `${contentType.charAt(0).toUpperCase() + contentType.slice(1)}: ${topic}`,
                metaDescription: parsed.metaDescription || `Comprehensive ${contentType} about ${topic} for ${targetAudience}. Learn everything you need to know about ${niche}.`,
                introduction: parsed.introduction || `Welcome to this comprehensive ${contentType} about ${topic}.`,
                sections: parsed.sections || [],
                conclusion: parsed.conclusion || `This concludes our ${contentType} on ${topic}.`,
                callToAction: parsed.callToAction || `Ready to implement these ${topic} strategies? Start today and see the results!`,
                tags: parsed.tags || [topic, niche, targetAudience, contentType],
                estimatedReadTime: parsed.estimatedReadTime || Math.ceil(response.text.split(/\s+/).length / 200),
                seoScore: parsed.seoScore || 85,
                researchSources: parsed.researchSources || (includeResearch ? [`${niche} industry research`, `${topic} case studies`] : [])
            };
        } catch (parseError) {
            // Fallback parsing if JSON fails
            const content = response.text;
            const wordCount = content.split(/\s+/).length;
            const estimatedReadTime = Math.ceil(wordCount / 200);

            // Extract sections from content (simplified parsing)
            const sections = content.split('\n\n').filter((section: string) => section.trim()).map((section: string, index: number) => ({
                heading: `Section ${index + 1}`,
                content: section.trim(),
                subsections: []
            }));

            return {
                title: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)}: ${topic}`,
                metaDescription: `Comprehensive ${contentType} about ${topic} for ${targetAudience}. Learn everything you need to know about ${niche}.`,
                introduction: sections[0]?.content || `Welcome to this comprehensive ${contentType} about ${topic}.`,
                sections: sections.slice(1, -1),
                conclusion: sections[sections.length - 1]?.content || `This concludes our ${contentType} on ${topic}.`,
                callToAction: `Ready to implement these ${topic} strategies? Start today and see the results!`,
                tags: [topic, niche, targetAudience, contentType],
                estimatedReadTime,
                seoScore: 85,
                researchSources: includeResearch ? [`${niche} industry research`, `${topic} case studies`] : []
            };
        }
    } catch (error) {
        console.error('Content generation failed:', error);
        throw new Error(`Failed to generate content: ${error}`);
    }
}

export type ContentCreationInput = z.infer<typeof ContentCreationInputSchema>;
export type ContentCreationOutput = z.infer<typeof ContentCreationOutputSchema>;