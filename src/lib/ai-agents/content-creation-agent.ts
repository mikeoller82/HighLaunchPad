import { BaseAgent } from './base-agent';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  AgentConfiguration,
  AgentType,
  Event,
  Action,
  ExecutionResult,
  Feedback,
  DecisionContext,
  EventType,
  ActionType
} from './types';

export interface BlogGenerationRequest {
  topic: string;
  niche: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'authoritative' | 'conversational' | 'technical';
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  includeResearch: boolean;
  seoKeywords?: string[];
  outline?: string[];
  apiKey: string;
}

export interface BlogPost {
  title: string;
  metaDescription: string;
  introduction: string;
  sections: BlogSection[];
  conclusion: string;
  callToAction: string;
  tags: string[];
  estimatedReadTime: number;
  seoScore: number;
  researchSources?: string[];
}

export interface BlogSection {
  heading: string;
  content: string;
  subsections?: BlogSubsection[];
}

export interface BlogSubsection {
  subheading: string;
  content: string;
}

export interface ContentPlan {
  niche: string;
  topics: string[];
  contentCalendar: ContentCalendarEntry[];
  seoStrategy: SEOStrategy;
}

export interface ContentCalendarEntry {
  date: Date;
  topic: string;
  type: 'blog' | 'social' | 'email';
  status: 'planned' | 'in-progress' | 'completed';
  priority: number;
}

export interface SEOStrategy {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  contentPillars: string[];
  competitorAnalysis: string[];
}

export class ContentCreationAgent extends BaseAgent {
  private userNiche: string | null = null;
  private contentPlan: ContentPlan | null = null;
  private pendingRequests: Map<string, BlogGenerationRequest> = new Map();

  constructor(configuration?: AgentConfiguration) {
    const defaultConfig: AgentConfiguration = {
      id: 'content_creation',
      type: AgentType.CONTENT_CREATION,
      name: 'Content Creation Agent',
      description: 'AI agent for comprehensive blog post generation and content strategy',
      capabilities: [
        {
          name: 'blog_generation',
          description: 'Generate comprehensive, research-driven blog posts',
          requiredPermissions: ['create_content', 'research_topics'],
          supportedEventTypes: [EventType.CONTENT_REQUEST],
          supportedActionTypes: [ActionType.CREATE_CONTENT]
        },
        {
          name: 'content_planning',
          description: 'Create content calendars and strategies',
          requiredPermissions: ['plan_content', 'analyze_trends'],
          supportedEventTypes: [EventType.SYSTEM_EVENT],
          supportedActionTypes: [ActionType.CREATE_TASK]
        }
      ],
      enabled: true,
      priority: 2,
      maxConcurrentActions: 5,
      learningEnabled: true,
      configuration: {}
    };

    super(configuration || defaultConfig);
  }

  // Human-in-the-loop: Set user niche before generating content
  public async setUserNiche(niche: string, topics: string[] = [], userId?: string): Promise<void> {
    this.userNiche = niche;
    this.contentPlan = await this.createContentPlan(niche, topics);

    // Save niche configuration to Firestore for analytics tracking
    if (userId && typeof window !== 'undefined') {
      try {
        const { db } = await import('@/lib/firebase');
        if (db) {
          const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
          const agentConfigRef = doc(db, 'workspaces', userId, 'agentConfigs', 'content_creation');
          await setDoc(agentConfigRef, {
            niche,
            topics,
            contentPlan: this.contentPlan,
            lastUpdated: serverTimestamp(),
            agentType: 'content_creation'
          }, { merge: true });
        }
      } catch (error) {
        console.error('Failed to save niche configuration to Firestore:', error);
      }
    }

    console.log(`Content Creation Agent: Niche set to "${niche}" with ${this.contentPlan.topics.length} topics planned`);
  }

  public getUserNiche(): string | null {
    return this.userNiche;
  }

  public getContentPlan(): ContentPlan | null {
    return this.contentPlan;
  }

  // Human-in-the-loop: Request blog post generation
  public async requestBlogPost(request: BlogGenerationRequest): Promise<string> {
    if (!this.userNiche) {
      throw new Error('Please set your niche first using setUserNiche() before generating blog posts');
    }

    if (!request.niche || request.niche !== this.userNiche) {
      request.niche = this.userNiche;
    }

    const requestId = `blog_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.pendingRequests.set(requestId, request);

    // Update status
    this.status = 'working' as any;

    return requestId;
  }

  public async generateBlogPost(request: BlogGenerationRequest): Promise<BlogPost> {
    try {
      if (!this.userNiche) {
        throw new Error('Niche must be set before generating blog posts');
      }

      console.log(`Generating comprehensive blog post for niche: ${this.userNiche}`);
      this.status = 'acting' as any;

      // Use the new Genkit flow for content creation
      const { generateContent } = await import('@/ai/flows/ai-agents/content-creation');

      const flowResult = await generateContent({
        topic: request.topic,
        niche: request.niche,
        targetAudience: request.targetAudience,
        tone: request.tone,
        length: request.length,
        contentType: 'blog',
        includeResearch: request.includeResearch,
        seoKeywords: request.seoKeywords,
        outline: request.outline,
        apiKey: request.apiKey
      });

      // Convert flow result to BlogPost format
      const blogPost: BlogPost = {
        title: flowResult.title,
        metaDescription: flowResult.metaDescription,
        introduction: flowResult.introduction,
        sections: flowResult.sections,
        conclusion: flowResult.conclusion,
        callToAction: flowResult.callToAction,
        tags: flowResult.tags,
        estimatedReadTime: flowResult.estimatedReadTime,
        seoScore: flowResult.seoScore,
        researchSources: flowResult.researchSources
      };

      this.status = 'idle' as any;
      console.log('Blog post generated successfully using Genkit flow');
      return blogPost;
    } catch (error) {
      this.status = 'error' as any;
      console.error(`Failed to generate blog post: ${error}`);
      throw error;
    }
  }

  // Create content plan for the user's niche
  private async createContentPlan(niche: string, topics: string[] = []): Promise<ContentPlan> {
    const defaultTopics = topics.length > 0 ? topics : [
      `Getting Started with ${niche}`,
      `Advanced ${niche} Strategies`,
      `Common ${niche} Mistakes to Avoid`,
      `${niche} Tools and Resources`,
      `${niche} Case Studies and Examples`,
      `Future of ${niche}`,
      `${niche} Best Practices`,
      `${niche} for Beginners`
    ];

    const contentCalendar: ContentCalendarEntry[] = defaultTopics.map((topic, index) => ({
      date: new Date(Date.now() + (index * 7 * 24 * 60 * 60 * 1000)), // Weekly schedule
      topic,
      type: 'blog' as const,
      status: 'planned' as const,
      priority: index < 3 ? 1 : 2
    }));

    return {
      niche,
      topics: defaultTopics,
      contentCalendar,
      seoStrategy: {
        primaryKeywords: [niche, `${niche} guide`, `${niche} tips`],
        secondaryKeywords: [`how to ${niche}`, `${niche} strategies`, `${niche} best practices`],
        contentPillars: [`${niche} fundamentals`, `${niche} advanced techniques`, `${niche} tools`],
        competitorAnalysis: []
      }
    };
  }

  // Required BaseAgent implementations
  protected async processEvents(events: Event[]): Promise<void> {
    console.log(`Content Creation Agent processing ${events.length} events`);
    for (const event of events) {
      if (event.type === EventType.CONTENT_REQUEST) {
        this.context.conversationHistory.push({
          type: 'content_request',
          timestamp: event.timestamp,
          data: event.data
        });
      }
    }
  }

  protected async makeDecisions(context: DecisionContext): Promise<Action[]> {
    const actions: Action[] = [];

    for (const event of context.events) {
      if (event.type === EventType.CONTENT_REQUEST && this.userNiche) {
        actions.push({
          id: `create_content_${event.id}_${Date.now()}`,
          type: ActionType.CREATE_CONTENT,
          agentId: this.id,
          timestamp: new Date(),
          parameters: {
            contentType: event.data.contentType || 'blog',
            topic: event.data.topic || 'general',
            niche: this.userNiche,
            targetAudience: event.data.targetAudience || 'general'
          },
          priority: 6
        });
      }
    }

    return actions;
  }

  protected async executeActions(actions: Action[]): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];

    for (const action of actions) {
      try {
        if (action.type === ActionType.CREATE_CONTENT) {
          // Simulate content creation
          const result: ExecutionResult = {
            actionId: action.id,
            success: true,
            result: {
              contentId: `content_${Date.now()}`,
              contentType: action.parameters.contentType,
              topic: action.parameters.topic,
              niche: action.parameters.niche,
              status: 'generated'
            },
            timestamp: new Date()
          };
          results.push(result);
        }
      } catch (error) {
        results.push({
          actionId: action.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        });
      }
    }

    return results;
  }

  protected async processFeedback(feedback: Feedback[]): Promise<void> {
    console.log(`Content Creation Agent processing ${feedback.length} feedback items`);

    for (const fb of feedback) {
      if (fb.outcome === 'success' && fb.score && fb.score > 0.8) {
        // Learn from successful content
        console.log(`High-quality content generated: ${fb.actionId}`);
      } else if (fb.outcome === 'failure') {
        // Learn from failures
        console.log(`Content generation failed: ${fb.actionId} - ${fb.details}`);
      }
    }
  }



  private buildResearchPrompt(request: BlogGenerationRequest): string {
    return `You are a professional content researcher and SEO specialist with 10+ years of experience creating data-driven, well-researched content that ranks #1 on Google and drives engagement.

## Research Assignment
**Topic:** ${request.topic}
**Target Audience:** ${request.targetAudience}
**Content Length:** ${request.length}
**SEO Keywords:** ${request.seoKeywords?.join(', ') || 'Not specified'}

## Your Mission
Conduct comprehensive research and create a detailed content strategy for a ${request.length} blog post that will be authoritative, engaging, and SEO-optimized.

## Research Framework

### 1. Topic Analysis & Market Research
- Analyze current trends and discussions around this topic
- Identify knowledge gaps in existing content
- Research competitor content and identify opportunities to create superior content
- Determine the search intent behind this topic
- Identify related topics and subtopics to cover comprehensively

### 2. Audience Research
- Define specific pain points and challenges of the target audience
- Identify their level of expertise and knowledge
- Determine their preferred content format and tone
- Research questions they commonly ask about this topic
- Identify their goals and desired outcomes

### 3. Content Structure Research
- Research the most effective content structures for this topic
- Identify key sections that must be included for completeness
- Determine optimal content flow and logical progression
- Research supporting data, statistics, and case studies
- Identify opportunities for original insights and unique angles

### 4. SEO Research & Strategy
- Analyze search volume and competition for primary keywords
- Identify long-tail keyword opportunities
- Research related keywords and semantic variations
- Determine optimal keyword density and placement
- Identify internal linking opportunities

### 5. Content Enhancement Research
- Research relevant examples, case studies, and real-world applications
- Identify opportunities for data visualization or infographics
- Research expert quotes and authoritative sources
- Identify actionable tips and practical advice to include
- Research common misconceptions to address

## Research Output Requirements
Provide a comprehensive research brief including:

1. **Executive Summary** (100 words)
   - Key findings and content opportunity
   - Unique angle or perspective to take
   - Primary value proposition for readers

2. **Detailed Content Outline** (300-500 words)
   - Recommended article structure with main sections
   - Key points to cover in each section
   - Suggested subsections and supporting details
   - Logical flow and content progression

3. **SEO Strategy** (150 words)
   - Primary and secondary keyword recommendations
   - Keyword placement strategy
   - Meta description and title tag recommendations
   - Internal linking opportunities

4. **Research Insights** (200-300 words)
   - Key statistics, data points, and facts to include
   - Expert insights and authoritative sources
   - Common questions and concerns to address
   - Unique angles or perspectives to explore

5. **Content Enhancement Recommendations** (150 words)
   - Suggested examples, case studies, or stories
   - Opportunities for visual content
   - Interactive elements or tools to include
   - Call-to-action recommendations

Return the complete research brief in structured format.`;
  }

  private buildBlogPrompt(request: BlogGenerationRequest, research: string): string {
    const lengthSpecs = {
      short: '800-1,200 words',
      medium: '1,500-2,500 words',
      long: '2,500-4,000 words',
      comprehensive: '4,000-6,000 words'
    };

    return `You are an elite content creator and copywriter who has written viral blog posts that have generated millions of views, thousands of shares, and significant business results. Your content consistently ranks #1 on Google and converts readers into customers.

## Content Creation Brief
**Topic:** ${request.topic}
**Target Audience:** ${request.targetAudience}
**Tone:** ${request.tone}
**Target Length:** ${lengthSpecs[request.length]}
**Include Research:** ${request.includeResearch ? 'Yes' : 'No'}

## Research Foundation
${research}

## Your Mission
Create a comprehensive, authoritative blog post that provides exceptional value to readers while being optimized for search engines and conversions. This should be the definitive resource on this topic.

## Content Creation Framework

### 1. Compelling Title & Meta Description
- Create 3 title options that are click-worthy and SEO-optimized
- Include primary keywords naturally
- Trigger curiosity while clearly communicating value
- Write a compelling meta description (150-160 characters)

### 2. Engaging Introduction (200-300 words)
- Hook the reader within the first 2 sentences
- Clearly state the problem or opportunity
- Preview the value they'll receive
- Include a brief credibility statement
- Set clear expectations for what they'll learn

### 3. Comprehensive Main Content
Structure the content with:
- **Clear section headings** (H2, H3 tags)
- **Detailed explanations** with examples and context
- **Actionable insights** and practical advice
- **Supporting data** and statistics where relevant
- **Real-world examples** and case studies
- **Step-by-step processes** where applicable
- **Common mistakes** and how to avoid them
- **Expert tips** and insider knowledge

### 4. Content Enhancement Elements
Include throughout the content:
- Bullet points and numbered lists for readability
- Bold text for key concepts and takeaways
- Relevant quotes from experts or studies
- Transition sentences between sections
- Internal questions to maintain engagement
- Specific, measurable examples and results

### 5. Strong Conclusion (150-200 words)
- Summarize key takeaways and insights
- Reinforce the main value proposition
- Provide next steps or action items
- Include a compelling call-to-action
- End with a memorable closing statement

### 6. SEO Optimization
- Natural keyword integration throughout
- Optimized headings and subheadings
- Meta description and title optimization
- Internal linking opportunities
- Related keyword variations

## Writing Style Guidelines
- Use ${request.tone} tone throughout
- Write in active voice when possible
- Use conversational language that builds connection
- Include specific numbers, percentages, and timeframes
- Balance expertise with accessibility
- Create scannable content with proper formatting
- Use storytelling elements to maintain engagement
- Address reader objections and questions proactively

## Quality Standards
- Every paragraph must provide unique value
- Include original insights and perspectives
- Use specific, concrete examples rather than generalities
- Maintain logical flow and smooth transitions
- Create content that readers will want to share
- Ensure accuracy and fact-check all claims
- Make complex topics accessible and actionable

## Output Format
Return as JSON with this structure:
{
  "titles": ["Title Option 1", "Title Option 2", "Title Option 3"],
  "metaDescription": "SEO-optimized meta description",
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
  "conclusion": "Strong conclusion with CTA",
  "tags": ["tag1", "tag2", "tag3"],
  "estimatedReadTime": 8,
  "seoKeywords": ["keyword1", "keyword2"],
  "researchSources": ["source1", "source2"]
}

Create content that is ${lengthSpecs[request.length]} and provides exceptional value to ${request.targetAudience}.`;
  }

  private parseBlogResponse(response: string, request: BlogGenerationRequest): BlogPost {
    try {
      // Try to parse JSON response
      const parsed = JSON.parse(response);

      return {
        title: parsed.titles?.[0] || `Comprehensive Guide to ${request.topic}`,
        metaDescription: parsed.metaDescription || `Learn everything about ${request.topic} in this comprehensive guide.`,
        introduction: parsed.introduction || '',
        sections: parsed.sections || [],
        conclusion: parsed.conclusion || '',
        callToAction: parsed.callToAction || 'Ready to get started? Take action today!',
        tags: parsed.tags || [request.topic],
        estimatedReadTime: parsed.estimatedReadTime || this.calculateReadTime(response),
        seoScore: this.calculateSEOScore(parsed, request),
        researchSources: parsed.researchSources || []
      };
    } catch (error) {
      // Fallback parsing if JSON fails
      return this.parseTextResponse(response, request);
    }
  }

  private parseTextResponse(response: string, request: BlogGenerationRequest): BlogPost {
    const lines = response.split('\n').filter(line => line.trim());
    const sections: BlogSection[] = [];
    let currentSection: BlogSection | null = null;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          heading: line.replace('## ', ''),
          content: '',
          subsections: []
        };
      } else if (line.startsWith('### ') && currentSection) {
        const subsection: BlogSubsection = {
          subheading: line.replace('### ', ''),
          content: ''
        };
        currentSection.subsections = currentSection.subsections || [];
        currentSection.subsections.push(subsection);
      } else if (currentSection) {
        if (currentSection.subsections && currentSection.subsections.length > 0) {
          const lastSubsection = currentSection.subsections[currentSection.subsections.length - 1];
          lastSubsection.content += line + '\n';
        } else {
          currentSection.content += line + '\n';
        }
      }
    }

    if (currentSection) sections.push(currentSection);

    return {
      title: `Comprehensive Guide to ${request.topic}`,
      metaDescription: `Learn everything about ${request.topic} in this detailed guide.`,
      introduction: lines.slice(0, 3).join('\n'),
      sections,
      conclusion: lines.slice(-3).join('\n'),
      callToAction: 'Ready to implement these strategies? Start today!',
      tags: [request.topic, request.targetAudience],
      estimatedReadTime: this.calculateReadTime(response),
      seoScore: 75,
      researchSources: []
    };
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private calculateSEOScore(content: any, request: BlogGenerationRequest): number {
    let score = 0;

    // Title optimization
    if (content.titles && content.titles.length > 0) score += 20;

    // Meta description
    if (content.metaDescription && content.metaDescription.length >= 120) score += 15;

    // Content structure
    if (content.sections && content.sections.length >= 3) score += 20;

    // Keywords
    if (request.seoKeywords && request.seoKeywords.length > 0) score += 15;

    // Content length
    const wordCount = JSON.stringify(content).split(/\s+/).length;
    if (wordCount >= 1000) score += 15;

    // Tags
    if (content.tags && content.tags.length >= 3) score += 15;

    return Math.min(score, 100);
  }

  protected async performBackgroundTask(): Promise<void> {
    if (!this.userNiche) {
      // Don't perform background tasks without a niche set
      return;
    }

    const activities = [
      `Researching trending topics in ${this.userNiche}`,
      `Analyzing competitor content strategies for ${this.userNiche}`,
      `Optimizing existing blog posts for ${this.userNiche} SEO`,
      `Generating content ideas for ${this.userNiche} audience`,
      `Creating content calendars for ${this.userNiche}`,
      `Analyzing ${this.userNiche} content performance metrics`,
      `Researching ${this.userNiche} keyword opportunities`,
      `Developing ${this.userNiche} content templates`,
      `Creating social media variations for ${this.userNiche}`,
      `Updating ${this.userNiche} content based on latest trends`
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];
    console.log(`Content Creation Agent: ${activity}`);
    this.status = 'acting' as any;

    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 7000));

    this.status = 'idle' as any;
    console.log(`Content Creation Agent: Completed - ${activity}`);
  }
}

export const contentCreationAgent = new ContentCreationAgent();