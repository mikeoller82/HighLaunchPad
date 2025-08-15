import { z } from 'zod';

// Note: This is a schema definition file for blog post generation
// The actual generation logic is handled by the API endpoints

// Input schema for blog post generation
export const BlogPostInputSchema = z.object({
  topic: z.string().describe('The main topic or subject of the blog post'),
  targetAudience: z.string().describe('The intended audience for the blog post'),
  tone: z.enum(['professional', 'casual', 'authoritative', 'conversational', 'technical']).describe('The tone of voice for the content'),
  length: z.enum(['short', 'medium', 'long', 'comprehensive']).describe('The desired length of the blog post'),
  seoKeywords: z.array(z.string()).optional().describe('SEO keywords to include in the content'),
  includeResearch: z.boolean().default(true).describe('Whether to include research and data in the post'),
  outline: z.array(z.string()).optional().describe('Specific sections or points to cover'),
  industry: z.string().optional().describe('Specific industry context if applicable'),
  competitorAnalysis: z.boolean().default(false).describe('Whether to include competitor analysis'),
  includeExamples: z.boolean().default(true).describe('Whether to include real-world examples'),
  callToActionType: z.enum(['newsletter', 'product', 'service', 'download', 'contact']).optional().describe('Type of call-to-action to include')
});

// Output schema for the generated blog post
export const BlogPostOutputSchema = z.object({
  title: z.string().describe('The main title of the blog post'),
  alternativeTitles: z.array(z.string()).describe('Alternative title options'),
  metaDescription: z.string().describe('SEO meta description'),
  introduction: z.string().describe('Engaging introduction paragraph'),
  tableOfContents: z.array(z.string()).describe('Table of contents with main sections'),
  sections: z.array(z.object({
    heading: z.string(),
    content: z.string(),
    subsections: z.array(z.object({
      subheading: z.string(),
      content: z.string()
    })).optional()
  })).describe('Main content sections'),
  conclusion: z.string().describe('Conclusion paragraph'),
  callToAction: z.string().describe('Call-to-action section'),
  tags: z.array(z.string()).describe('Relevant tags for the post'),
  seoKeywords: z.array(z.string()).describe('SEO keywords used'),
  estimatedReadTime: z.number().describe('Estimated reading time in minutes'),
  wordCount: z.number().describe('Total word count'),
  researchSources: z.array(z.string()).optional().describe('Research sources and references'),
  socialMediaSnippets: z.array(z.string()).describe('Social media ready snippets'),
  keyTakeaways: z.array(z.string()).describe('Key takeaways from the post')
});

// Length specifications for different blog post types
export const lengthSpecs = {
  short: '800-1,200 words with 3-5 main sections',
  medium: '1,500-2,500 words with 5-7 main sections',
  long: '2,500-4,000 words with 7-10 main sections',
  comprehensive: '4,000-6,000 words with 10+ main sections and deep analysis'
} as const;

// Tone guidelines for different writing styles
export const toneGuidelines = {
  professional: 'Formal, authoritative, and business-focused language. Use industry terminology appropriately.',
  casual: 'Friendly, conversational, and approachable. Use everyday language and personal anecdotes.',
  authoritative: 'Expert-level content with data-driven insights and definitive statements.',
  conversational: 'Direct, engaging, and personal. Write as if speaking to a friend.',
  technical: 'Detailed, precise, and technical. Include specific methodologies and technical details.'
} as const;

// Helper function to calculate reading time
export function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Helper function to extract word count from content
export function calculateWordCount(content: any): number {
  const textContent = JSON.stringify(content);
  return textContent.split(/\s+/).filter(word => word.length > 0).length;
}

export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;
export type BlogPostOutput = z.infer<typeof BlogPostOutputSchema>;