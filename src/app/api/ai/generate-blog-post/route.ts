import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface BlogGenerationRequest {
  topic: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'authoritative' | 'conversational' | 'technical';
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  seoKeywords?: string[];
  includeResearch: boolean;
  outline?: string[];
  industry?: string;
  competitorAnalysis?: boolean;
  includeExamples?: boolean;
  callToActionType?: 'newsletter' | 'product' | 'service' | 'download' | 'contact';
  apiKey: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BlogGenerationRequest = await request.json();
    
    // Validate required fields
    if (!body.topic || !body.targetAudience || !body.apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, targetAudience, and apiKey are required' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(body.apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Step 1: Generate comprehensive research and outline
    const researchPrompt = buildResearchPrompt(body);
    const researchResult = await model.generateContent(researchPrompt);
    const research = await researchResult.response.text();

    // Step 2: Generate the complete blog post
    const blogPrompt = buildBlogPrompt(body, research);
    const blogResult = await model.generateContent(blogPrompt);
    const blogContent = await blogResult.response.text();

    // Step 3: Parse and structure the response
    const parsedBlog = parseBlogResponse(blogContent, body);

    return NextResponse.json({
      success: true,
      data: parsedBlog,
      research: research,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp',
        requestId: crypto.randomUUID()
      }
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function buildResearchPrompt(request: BlogGenerationRequest): string {
  return `You are a world-class content researcher and SEO strategist with 15+ years of experience creating data-driven content that consistently ranks #1 on Google and drives massive engagement.

## Research Assignment
**Topic:** ${request.topic}
**Target Audience:** ${request.targetAudience}
**Industry:** ${request.industry || 'General'}
**Content Length:** ${request.length}
**SEO Keywords:** ${request.seoKeywords?.join(', ') || 'To be determined'}
**Include Research:** ${request.includeResearch ? 'Yes' : 'No'}
**Competitor Analysis:** ${request.competitorAnalysis ? 'Yes' : 'No'}

## Your Mission
Conduct comprehensive research and create a detailed content strategy that will result in the most authoritative, engaging, and SEO-optimized blog post on this topic.

## Research Framework

### 1. Topic Deep Dive & Market Analysis
- Analyze current trends and discussions around "${request.topic}"
- Identify knowledge gaps in existing content
- Research what questions people are asking about this topic
- Determine the search intent and user journey
- Identify unique angles and perspectives to explore
- Research related topics and subtopics for comprehensive coverage

### 2. Audience Intelligence
For ${request.targetAudience}:
- Define specific pain points, challenges, and goals
- Identify their level of expertise and knowledge
- Research their preferred content formats and communication style
- Determine what motivates them to take action
- Identify common objections and concerns they have
- Research their typical customer journey and touchpoints

### 3. Content Strategy & Structure
- Research the most effective content structures for this topic
- Identify must-have sections for comprehensive coverage
- Determine optimal content flow and logical progression
- Research supporting data, statistics, and case studies
- Identify opportunities for original insights and thought leadership
- Plan for visual content and interactive elements

### 4. SEO Research & Optimization Strategy
- Analyze search volume and competition for primary keywords
- Identify long-tail keyword opportunities and semantic variations
- Research featured snippet opportunities and voice search optimization
- Determine optimal keyword density and natural placement strategies
- Identify internal linking opportunities and content clusters
- Research competitor content gaps and opportunities

### 5. Content Enhancement Research
${request.includeResearch ? `
- Research relevant statistics, data points, and industry reports
- Identify authoritative sources and expert quotes
- Find recent studies and research findings
- Collect industry benchmarks and trend data
- Research case studies and success stories
` : ''}
${request.includeExamples ? `
- Research real-world examples and practical applications
- Identify success stories and case studies
- Find common use cases and scenarios
- Research tools, resources, and actionable tips
` : ''}
${request.competitorAnalysis ? `
- Analyze top-ranking competitor content
- Identify content gaps and opportunities for differentiation
- Research competitor strengths and weaknesses
- Find opportunities to create superior content
` : ''}

## Research Output Requirements

### 1. Executive Summary (150 words)
- Key research findings and content opportunity
- Unique value proposition and differentiation strategy
- Primary audience insights and content approach
- Expected outcomes and success metrics

### 2. Comprehensive Content Outline (400-600 words)
- Detailed article structure with main sections and subsections
- Key points and supporting details for each section
- Logical content flow and reader journey
- Opportunities for engagement and interaction
- Visual content and multimedia recommendations

### 3. SEO Strategy & Keywords (200 words)
- Primary keyword and semantic variations
- Long-tail keyword opportunities
- Keyword placement and density recommendations
- Meta title and description suggestions
- Featured snippet optimization opportunities
- Internal linking strategy

### 4. Research Insights & Data (300-400 words)
${request.includeResearch ? `
- Key statistics, data points, and industry facts
- Authoritative sources and expert insights
- Recent studies and research findings
- Industry benchmarks and trend analysis
- Supporting evidence for key claims
` : `
- Key insights and best practices
- Proven strategies and methodologies
- Common challenges and solutions
- Success factors and implementation tips
`}

### 5. Content Enhancement Strategy (200 words)
- Examples, case studies, and stories to include
- Visual content opportunities (infographics, charts, images)
- Interactive elements and engagement tactics
- Social proof and credibility indicators
- Call-to-action strategy and placement

Return the complete research brief in a structured, actionable format that will guide the creation of exceptional content.`;
}

function buildBlogPrompt(request: BlogGenerationRequest, research: string): string {
  const lengthSpecs = {
    short: '800-1,200 words with 4-6 main sections',
    medium: '1,500-2,500 words with 6-8 main sections',
    long: '2,500-4,000 words with 8-12 main sections',
    comprehensive: '4,000-6,000+ words with 12+ sections and comprehensive analysis'
  };

  const toneGuidelines = {
    professional: 'Formal, authoritative, business-focused. Use industry terminology and maintain credibility.',
    casual: 'Friendly, conversational, approachable. Use everyday language and personal touches.',
    authoritative: 'Expert-level, data-driven, definitive. Establish thought leadership and expertise.',
    conversational: 'Direct, engaging, personal. Write as if having a one-on-one conversation.',
    technical: 'Detailed, precise, methodical. Include technical specifications and implementation details.'
  };

  return `You are an elite content creator and copywriter who has written viral blog posts generating millions of views, thousands of shares, and significant business results. Your content consistently ranks #1 on Google and converts readers into customers.

## Content Creation Brief
**Topic:** ${request.topic}
**Target Audience:** ${request.targetAudience}
**Tone:** ${request.tone} - ${toneGuidelines[request.tone]}
**Target Length:** ${lengthSpecs[request.length]}
**Industry Context:** ${request.industry || 'General'}
**Call-to-Action Type:** ${request.callToActionType || 'newsletter'}

## Research Foundation
${research}

## Your Mission
Create a comprehensive, authoritative blog post that becomes the definitive resource on "${request.topic}" for ${request.targetAudience}. This content should provide exceptional value, rank #1 on Google, and drive meaningful engagement and conversions.

## Content Creation Framework

### 1. Compelling Titles & Meta Description
Create 3 title variations that are:
- 50-60 characters for optimal SEO
- Include primary keywords naturally
- Trigger curiosity, urgency, or promise clear value
- Stand out from existing content
- Appeal specifically to ${request.targetAudience}

Write a meta description (150-160 characters) that:
- Includes primary keyword
- Creates urgency or curiosity
- Promises clear value or outcome
- Encourages clicks with action words

### 2. Engaging Introduction (250-350 words)
- Hook readers within the first 2 sentences with a surprising statistic, provocative question, or compelling story
- Clearly articulate the problem, opportunity, or question being addressed
- Preview the specific value and outcomes readers will receive
- Include a brief credibility statement or social proof
- Set clear expectations for the content journey
- Create an open loop that compels continued reading

### 3. Comprehensive Main Content
Structure with clear hierarchy and flow:

**Section Requirements:**
- Each main section should be 300-800 words
- Start with compelling, keyword-optimized subheadings (H2)
- Include subsections (H3) for complex topics
- Provide specific, actionable insights and advice
- Include relevant examples, case studies, or data points
- End each section with a key takeaway or transition

**Content Enhancement Elements:**
- Use bullet points and numbered lists for readability
- Include relevant statistics and data points
- Add expert quotes or authoritative sources
- Provide step-by-step processes where applicable
- Address common mistakes and how to avoid them
- Include practical tips and insider knowledge
- Use bold text for key concepts and takeaways
- Create smooth transitions between sections

### 4. Visual Content Integration
Throughout the content, suggest opportunities for:
- Infographics to visualize data or processes
- Screenshots or diagrams for step-by-step guides
- Charts or graphs for statistics and comparisons
- Images that support and enhance the narrative
- Interactive elements like checklists or calculators

### 5. Strong Conclusion & Call-to-Action (200-300 words)
- Summarize the key insights and value provided
- Reinforce the main transformation or outcome
- Provide clear, specific next steps for readers
- Include a compelling call-to-action for ${request.callToActionType || 'newsletter signup'}
- End with a memorable, shareable closing statement
- Create urgency or scarcity where appropriate

## Advanced Writing Techniques

### Engagement Optimization
- Use the ${request.tone} tone consistently throughout
- Write in active voice when possible
- Include rhetorical questions to maintain engagement
- Use storytelling elements and narrative structure
- Create pattern interrupts to maintain attention
- Address reader objections proactively
- Include social proof and credibility indicators

### SEO Optimization
- Integrate keywords naturally throughout the content
- Use semantic keywords and related terms
- Optimize headings and subheadings for search
- Create content that answers common questions
- Include long-tail keyword variations
- Structure content for featured snippets
- Optimize for voice search queries

### Conversion Optimization
- Include multiple micro-commitments throughout
- Use psychological triggers like scarcity and social proof
- Address common objections and concerns
- Provide clear value before asking for action
- Create multiple touchpoints for engagement
- Use persuasive language and power words
- Include risk reversal and guarantees where appropriate

## Quality Standards
- Every paragraph must provide unique, actionable value
- Include specific numbers, percentages, and timeframes
- Use concrete examples rather than abstract concepts
- Ensure accuracy and fact-check all claims
- Make complex topics accessible and implementable
- Create content that readers will want to share
- Maintain logical flow and smooth transitions
- Address the full spectrum of reader questions and concerns

## Output Format
Return as JSON with this exact structure:
{
  "titles": ["Title Option 1", "Title Option 2", "Title Option 3"],
  "metaDescription": "SEO-optimized meta description",
  "tableOfContents": ["Section 1", "Section 2", "Section 3", ...],
  "introduction": "Complete introduction paragraph",
  "sections": [
    {
      "heading": "Main Section Title",
      "content": "Detailed section content with formatting",
      "subsections": [
        {
          "subheading": "Subsection Title",
          "content": "Subsection content"
        }
      ]
    }
  ],
  "conclusion": "Complete conclusion with CTA",
  "tags": ["relevant", "tags", "for", "post"],
  "seoKeywords": ["primary", "secondary", "keywords"],
  "socialMediaSnippets": ["Tweet-ready snippet 1", "LinkedIn snippet", "Facebook snippet"],
  "keyTakeaways": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"],
  "estimatedReadTime": 12,
  "wordCount": 2500,
  "researchSources": ["Source 1", "Source 2", "Source 3"]
}

Create content that is ${lengthSpecs[request.length]} and provides exceptional value to ${request.targetAudience} while maintaining a ${request.tone} tone throughout.`;
}

function parseBlogResponse(response: string, request: BlogGenerationRequest): any {
  try {
    // Try to parse JSON response first
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Ensure all required fields are present
      return {
        titles: parsed.titles || [`Comprehensive Guide to ${request.topic}`],
        metaDescription: parsed.metaDescription || `Learn everything about ${request.topic} in this detailed guide for ${request.targetAudience}.`,
        tableOfContents: parsed.tableOfContents || [],
        introduction: parsed.introduction || '',
        sections: parsed.sections || [],
        conclusion: parsed.conclusion || '',
        tags: parsed.tags || [request.topic, request.targetAudience],
        seoKeywords: parsed.seoKeywords || request.seoKeywords || [request.topic],
        socialMediaSnippets: parsed.socialMediaSnippets || [],
        keyTakeaways: parsed.keyTakeaways || [],
        estimatedReadTime: parsed.estimatedReadTime || calculateReadTime(response),
        wordCount: parsed.wordCount || calculateWordCount(response),
        researchSources: parsed.researchSources || []
      };
    }
  } catch (error) {
    console.error('JSON parsing failed, using fallback parsing:', error);
  }

  // Fallback parsing for non-JSON responses
  return parseTextResponse(response, request);
}

function parseTextResponse(response: string, request: BlogGenerationRequest): any {
  const lines = response.split('\n').filter(line => line.trim());
  const sections: any[] = [];
  let currentSection: any = null;
  let introduction = '';
  let conclusion = '';
  
  // Extract introduction (first few paragraphs)
  const introEnd = Math.min(5, Math.floor(lines.length * 0.1));
  introduction = lines.slice(0, introEnd).join('\n');
  
  // Extract conclusion (last few paragraphs)
  const conclusionStart = Math.max(lines.length - 5, Math.floor(lines.length * 0.9));
  conclusion = lines.slice(conclusionStart).join('\n');
  
  // Parse sections
  for (let i = introEnd; i < conclusionStart; i++) {
    const line = lines[i];
    
    if (line.startsWith('## ') || line.startsWith('# ')) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        heading: line.replace(/^#+\s/, ''),
        content: '',
        subsections: []
      };
    } else if (line.startsWith('### ') && currentSection) {
      const subsection = {
        subheading: line.replace('### ', ''),
        content: ''
      };
      currentSection.subsections.push(subsection);
    } else if (currentSection) {
      if (currentSection.subsections.length > 0) {
        const lastSubsection = currentSection.subsections[currentSection.subsections.length - 1];
        lastSubsection.content += line + '\n';
      } else {
        currentSection.content += line + '\n';
      }
    }
  }
  
  if (currentSection) sections.push(currentSection);

  return {
    titles: [`Complete Guide to ${request.topic}`, `${request.topic}: Everything You Need to Know`, `Master ${request.topic}: A Comprehensive Guide`],
    metaDescription: `Discover everything about ${request.topic} in this comprehensive guide designed for ${request.targetAudience}. Get actionable insights and expert tips.`,
    tableOfContents: sections.map(s => s.heading),
    introduction,
    sections,
    conclusion,
    tags: [request.topic, request.targetAudience, request.industry || 'guide'].filter(Boolean),
    seoKeywords: request.seoKeywords || [request.topic],
    socialMediaSnippets: [
      `Just published a comprehensive guide on ${request.topic}! 🚀`,
      `Everything you need to know about ${request.topic} in one place.`,
      `New blog post: Master ${request.topic} with this detailed guide.`
    ],
    keyTakeaways: [
      `Understanding ${request.topic} is crucial for ${request.targetAudience}`,
      'Implementation requires careful planning and execution',
      'Regular monitoring and optimization are essential for success'
    ],
    estimatedReadTime: calculateReadTime(response),
    wordCount: calculateWordCount(response),
    researchSources: []
  };
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function calculateWordCount(content: string): number {
  return content.split(/\s+/).filter(word => word.length > 0).length;
}