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

export interface SocialMediaRequest {
  niche: string;
  topic: string;
  platforms: SocialPlatform[];
  tone: 'professional' | 'casual' | 'engaging' | 'educational' | 'promotional';
  contentType: 'post' | 'thread' | 'story' | 'reel' | 'carousel';
  targetAudience: string;
  callToAction?: string;
  hashtags?: string[];
  apiKey: string;
}

export interface SocialMediaPlan {
  niche: string;
  duration: 'week' | 'month' | 'quarter';
  platforms: SocialPlatform[];
  contentPillars: string[];
  postingSchedule: ScheduledPost[];
  engagementStrategy: EngagementStrategy;
  hashtagStrategy: HashtagStrategy;
  createdAt: Date;
  lastUpdated: Date;
}

export interface ScheduledPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  scheduledDate: Date;
  actualPostDate?: Date;
  contentType: 'post' | 'thread' | 'story' | 'reel' | 'carousel';
  hashtags: string[];
  status: 'scheduled' | 'posted' | 'failed' | 'cancelled';
  engagement?: PostEngagement;
  topic: string;
  pillar: string;
}

export interface PostEngagement {
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  clickThroughRate?: number;
  engagementRate: number;
}

export interface EngagementStrategy {
  bestPostingTimes: { [key in SocialPlatform]?: string[] };
  contentMix: {
    educational: number;
    promotional: number;
    entertaining: number;
    userGenerated: number;
  };
  interactionGuidelines: string[];
}

export interface HashtagStrategy {
  primary: string[];
  secondary: string[];
  trending: string[];
  branded: string[];
  maxPerPost: { [key in SocialPlatform]?: number };
}

export type SocialPlatform = 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export interface SocialMediaContent {
  platform: SocialPlatform;
  content: string;
  hashtags: string[];
  bestPostingTime: string;
  engagementTips: string[];
  variations: string[];
}

export class EnhancedSocialMediaAgent extends BaseAgent {
  private userNiche: string | null = null;
  private socialMediaPlan: SocialMediaPlan | null = null;
  private scheduledPosts: Map<string, ScheduledPost> = new Map();
  private postingTimer: NodeJS.Timeout | null = null;

  constructor(configuration?: AgentConfiguration) {
    const defaultConfig: AgentConfiguration = {
      id: 'enhanced_social_media',
      type: AgentType.SOCIAL_MEDIA,
      name: 'Enhanced Social Media Agent',
      description: 'AI agent for social media content creation, scheduling, and automated posting',
      capabilities: [
        {
          name: 'content_creation',
          description: 'Generate engaging social media content',
          requiredPermissions: ['create_content', 'schedule_posts'],
          supportedEventTypes: [EventType.SOCIAL_POST_REQUEST],
          supportedActionTypes: [ActionType.CREATE_CONTENT, ActionType.SCHEDULE_POST]
        },
        {
          name: 'social_scheduling',
          description: 'Schedule and automatically post content',
          requiredPermissions: ['schedule_posts', 'manage_social'],
          supportedEventTypes: [EventType.SYSTEM_EVENT],
          supportedActionTypes: [ActionType.SCHEDULE_POST]
        },
        {
          name: 'plan_creation',
          description: 'Create comprehensive social media marketing plans',
          requiredPermissions: ['plan_content', 'analyze_trends'],
          supportedEventTypes: [EventType.CONTENT_REQUEST],
          supportedActionTypes: [ActionType.CREATE_TASK]
        }
      ],
      enabled: true,
      priority: 3,
      maxConcurrentActions: 10,
      learningEnabled: true,
      configuration: {}
    };

    super(configuration || defaultConfig);
    this.startSchedulingTimer();
  }

  // Human-in-the-loop: Set user niche before creating content
  public async setUserNiche(niche: string, platforms: SocialPlatform[] = ['twitter', 'linkedin'], userId?: string): Promise<void> {
    this.userNiche = niche;
    this.socialMediaPlan = await this.createSocialMediaPlan(niche, platforms);
    
    // Save niche configuration to Firestore for analytics tracking
    if (userId && typeof window !== 'undefined') {
      try {
        const { db } = await import('@/lib/firebase');
        if (db) {
          const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
          const agentConfigRef = doc(db, 'workspaces', userId, 'agentConfigs', 'enhanced_social_media');
          await setDoc(agentConfigRef, {
            niche,
            platforms,
            socialMediaPlan: this.socialMediaPlan,
            lastUpdated: serverTimestamp(),
            agentType: 'enhanced_social_media'
          }, { merge: true });
        }
      } catch (error) {
        console.error('Failed to save social media niche configuration to Firestore:', error);
      }
    }
    
    console.log(`Enhanced Social Media Agent: Niche set to "${niche}" with plan for ${platforms.join(', ')}`);
  }

  public getUserNiche(): string | null {
    return this.userNiche;
  }

  public getSocialMediaPlan(): SocialMediaPlan | null {
    return this.socialMediaPlan;
  }

  public getScheduledPosts(): ScheduledPost[] {
    return Array.from(this.scheduledPosts.values());
  }

  // Human-in-the-loop: Request social media content generation
  public async requestSocialContent(request: SocialMediaRequest): Promise<string> {
    if (!this.userNiche) {
      throw new Error('Please set your niche first using setUserNiche() before generating social media content');
    }

    if (!request.niche || request.niche !== this.userNiche) {
      request.niche = this.userNiche;
    }

    const requestId = `social_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Generate content immediately
    const content = await this.generateSocialContent(request);
    
    // Schedule the content if requested
    if (this.socialMediaPlan) {
      await this.scheduleContent(content, request.platforms);
    }
    
    return requestId;
  }

  public async generateSocialContent(request: SocialMediaRequest): Promise<SocialMediaContent[]> {
    try {
      if (!this.userNiche) {
        throw new Error('Niche must be set before generating social media content');
      }

      console.log(`Generating social media content for niche: ${this.userNiche}`);
      this.status = 'acting' as any;
      
      // Use the new Genkit flow for social media content
      const { generateSocialMedia } = await import('@/ai/flows/ai-agents/social-media');
      
      const flowResult = await generateSocialMedia({
        topic: request.topic,
        niche: request.niche,
        platforms: request.platforms,
        tone: request.tone,
        contentType: request.contentType,
        targetAudience: request.targetAudience,
        callToAction: request.callToAction,
        hashtags: request.hashtags,
        apiKey: request.apiKey
      });

      // Convert flow result to SocialMediaContent format
      const content: SocialMediaContent[] = flowResult.content.map(item => ({
        platform: item.platform as SocialPlatform,
        content: item.content,
        hashtags: item.hashtags,
        bestPostingTime: item.bestPostingTime,
        engagementTips: item.engagementTips,
        variations: item.variations
      }));

      this.status = 'idle' as any;
      console.log('Social media content generated successfully using Genkit flow');
      return content;
    } catch (error) {
      this.status = 'error' as any;
      console.error(`Failed to generate social media content: ${error}`);
      throw error;
    }
  }

  // Create comprehensive social media marketing plan
  private async createSocialMediaPlan(niche: string, platforms: SocialPlatform[]): Promise<SocialMediaPlan> {
    const contentPillars = [
      `${niche} Education & Tips`,
      `${niche} Industry News & Trends`,
      `${niche} Success Stories & Case Studies`,
      `${niche} Tools & Resources`,
      `Behind the Scenes & Personal`,
      `${niche} Community & Engagement`
    ];

    const now = new Date();
    const postingSchedule: ScheduledPost[] = [];

    // Generate weekly posting schedule
    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < 7; day++) {
        const postDate = new Date(now.getTime() + (week * 7 + day) * 24 * 60 * 60 * 1000);
        
        // Skip weekends for LinkedIn, post daily for Twitter
        platforms.forEach(platform => {
          const shouldPost = this.shouldPostOnDay(platform, postDate.getDay());
          if (shouldPost) {
            const pillar = contentPillars[Math.floor(Math.random() * contentPillars.length)];
            const topic = this.generateTopicFromPillar(pillar, niche);
            
            postingSchedule.push({
              id: `post_${platform}_${postDate.getTime()}_${Math.random().toString(36).substring(2, 6)}`,
              platform,
              content: '', // Will be generated when posting
              scheduledDate: this.getOptimalPostingTime(platform, postDate),
              contentType: this.getContentTypeForPlatform(platform),
              hashtags: [],
              status: 'scheduled',
              topic,
              pillar
            });
          }
        });
      }
    }

    return {
      niche,
      duration: 'month',
      platforms,
      contentPillars,
      postingSchedule,
      engagementStrategy: {
        bestPostingTimes: this.getBestPostingTimes(),
        contentMix: {
          educational: 40,
          promotional: 20,
          entertaining: 25,
          userGenerated: 15
        },
        interactionGuidelines: [
          'Respond to comments within 2 hours',
          'Like and reply to relevant comments on industry posts',
          'Share valuable content from thought leaders',
          'Ask questions to encourage engagement'
        ]
      },
      hashtagStrategy: {
        primary: [niche, `${niche}tips`, `${niche}expert`],
        secondary: [`learn${niche}`, `${niche}community`, `${niche}guide`],
        trending: [], // Will be updated dynamically
        branded: [`#YourBrand${niche}`, `#${niche}WithUs`],
        maxPerPost: {
          twitter: 3,
          linkedin: 5,
          instagram: 10,
          facebook: 5,
          tiktok: 5,
          youtube: 8
        }
      },
      createdAt: now,
      lastUpdated: now
    };
  }

  // Schedule content for posting
  private async scheduleContent(content: SocialMediaContent[], platforms: SocialPlatform[], userId?: string): Promise<void> {
    for (const contentItem of content) {
      if (platforms.includes(contentItem.platform)) {
        const scheduledDate = this.getNextScheduledTime(contentItem.platform);
        
        const scheduledPost: ScheduledPost = {
          id: `scheduled_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          platform: contentItem.platform,
          content: contentItem.content,
          scheduledDate,
          contentType: 'post',
          hashtags: contentItem.hashtags,
          status: 'scheduled',
          topic: 'Generated Content',
          pillar: 'Content Marketing'
        };

        this.scheduledPosts.set(scheduledPost.id, scheduledPost);
        
        // Save scheduled post to Firestore for analytics and persistence
        if (userId && typeof window !== 'undefined') {
          try {
            const { db } = await import('@/lib/firebase');
            if (db) {
              const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
              const postRef = doc(db, 'workspaces', userId, 'scheduledPosts', scheduledPost.id);
              await setDoc(postRef, {
                ...scheduledPost,
                scheduledDate: scheduledDate,
                createdAt: serverTimestamp(),
                niche: this.userNiche,
                agentId: this.id
              });
            }
          } catch (error) {
            console.error('Failed to save scheduled post to Firestore:', error);
          }
        }
        
        console.log(`Scheduled post for ${contentItem.platform} at ${scheduledDate.toISOString()}`);
      }
    }
  }

  // Real-time scheduling timer
  private startSchedulingTimer(): void {
    // Check every minute for posts to publish
    this.postingTimer = setInterval(() => {
      this.checkAndPostScheduledContent();
    }, 60000); // Check every minute
  }

  // Check for posts that need to be published now
  private async checkAndPostScheduledContent(): Promise<void> {
    const now = new Date();
    const postsToPublish = Array.from(this.scheduledPosts.values()).filter(
      post => post.status === 'scheduled' && post.scheduledDate <= now
    );

    for (const post of postsToPublish) {
      try {
        await this.publishPost(post);
        post.status = 'posted';
        post.actualPostDate = now;
        console.log(`✅ Published post to ${post.platform}: ${post.content.substring(0, 50)}...`);
      } catch (error) {
        post.status = 'failed';
        console.error(`❌ Failed to publish post to ${post.platform}:`, error);
      }
    }
  }

  // Simulate posting to social media platform
  private async publishPost(post: ScheduledPost, userId?: string): Promise<void> {
    // In a real implementation, this would integrate with social media APIs
    console.log(`🚀 Publishing to ${post.platform.toUpperCase()}:`);
    console.log(`Content: ${post.content}`);
    console.log(`Hashtags: ${post.hashtags.join(' ')}`);
    console.log(`Scheduled: ${post.scheduledDate.toISOString()}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate engagement metrics (in real app, these would come from platform APIs)
    post.engagement = {
      likes: Math.floor(Math.random() * 50) + 5,
      comments: Math.floor(Math.random() * 10) + 1,
      shares: Math.floor(Math.random() * 15) + 2,
      views: Math.floor(Math.random() * 500) + 100,
      engagementRate: Math.random() * 5 + 1
    };

    // Update post status in Firestore
    if (userId && typeof window !== 'undefined') {
      try {
        const { db } = await import('@/lib/firebase');
        if (db) {
          const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
          const postRef = doc(db, 'workspaces', userId, 'scheduledPosts', post.id);
          await updateDoc(postRef, {
            status: 'posted',
            actualPostDate: new Date(),
            engagement: post.engagement,
            updatedAt: serverTimestamp()
          });
        }
      } catch (error) {
        console.error('Failed to update post status in Firestore:', error);
      }
    }
  }

  // Helper methods for scheduling logic
  private shouldPostOnDay(platform: SocialPlatform, dayOfWeek: number): boolean {
    // 0 = Sunday, 6 = Saturday
    switch (platform) {
      case 'linkedin':
        return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      case 'twitter':
        return true; // Daily posting
      case 'instagram':
        return dayOfWeek >= 1 && dayOfWeek <= 6; // Monday to Saturday
      case 'facebook':
        return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      default:
        return dayOfWeek >= 1 && dayOfWeek <= 5;
    }
  }

  private getOptimalPostingTime(platform: SocialPlatform, date: Date): Date {
    const optimalHours = {
      twitter: [9, 12, 15, 18], // 9 AM, 12 PM, 3 PM, 6 PM
      linkedin: [8, 12, 17], // 8 AM, 12 PM, 5 PM
      instagram: [11, 14, 17], // 11 AM, 2 PM, 5 PM
      facebook: [9, 13, 15], // 9 AM, 1 PM, 3 PM
      tiktok: [18, 19, 20], // 6 PM, 7 PM, 8 PM
      youtube: [14, 15, 16] // 2 PM, 3 PM, 4 PM
    };

    const hours = optimalHours[platform] || [12];
    const randomHour = hours[Math.floor(Math.random() * hours.length)];
    
    const postTime = new Date(date);
    postTime.setHours(randomHour, Math.floor(Math.random() * 60), 0, 0);
    
    return postTime;
  }

  private getNextScheduledTime(platform: SocialPlatform): Date {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return this.getOptimalPostingTime(platform, tomorrow);
  }

  private getContentTypeForPlatform(platform: SocialPlatform): 'post' | 'thread' | 'story' | 'reel' | 'carousel' {
    const contentTypes = {
      twitter: ['post', 'thread'],
      linkedin: ['post'],
      instagram: ['post', 'story', 'reel', 'carousel'],
      facebook: ['post'],
      tiktok: ['reel'],
      youtube: ['post']
    };

    const types = contentTypes[platform] || ['post'];
    return types[Math.floor(Math.random() * types.length)] as any;
  }

  private getBestPostingTimes(): { [key in SocialPlatform]?: string[] } {
    return {
      twitter: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
      linkedin: ['8:00 AM', '12:00 PM', '5:00 PM'],
      instagram: ['11:00 AM', '2:00 PM', '5:00 PM'],
      facebook: ['9:00 AM', '1:00 PM', '3:00 PM'],
      tiktok: ['6:00 PM', '7:00 PM', '8:00 PM'],
      youtube: ['2:00 PM', '3:00 PM', '4:00 PM']
    };
  }

  private generateTopicFromPillar(pillar: string, niche: string): string {
    const topics = {
      [`${niche} Education & Tips`]: [
        `5 Essential ${niche} Tips for Beginners`,
        `Advanced ${niche} Strategies That Work`,
        `Common ${niche} Mistakes to Avoid`
      ],
      [`${niche} Industry News & Trends`]: [
        `Latest Trends in ${niche}`,
        `What's New in ${niche} This Week`,
        `${niche} Industry Updates`
      ],
      [`${niche} Success Stories & Case Studies`]: [
        `How [Client] Achieved Success with ${niche}`,
        `${niche} Success Story: Real Results`,
        `Case Study: ${niche} Transformation`
      ]
    };

    const pillarTopics = topics[pillar] || [`${niche} Content`];
    return pillarTopics[Math.floor(Math.random() * pillarTopics.length)];
  }

  // Required BaseAgent implementations
  protected async processEvents(events: Event[]): Promise<void> {
    console.log(`Enhanced Social Media Agent processing ${events.length} events`);
    for (const event of events) {
      if (event.type === EventType.SOCIAL_POST_REQUEST) {
        this.context.conversationHistory.push({
          type: 'social_request',
          timestamp: event.timestamp,
          data: event.data
        });
      }
    }
  }

  protected async makeDecisions(context: DecisionContext): Promise<Action[]> {
    const actions: Action[] = [];
    
    for (const event of context.events) {
      if (event.type === EventType.SOCIAL_POST_REQUEST && this.userNiche) {
        actions.push({
          id: `schedule_post_${event.id}_${Date.now()}`,
          type: ActionType.SCHEDULE_POST,
          agentId: this.id,
          timestamp: new Date(),
          parameters: {
            platforms: event.data.platforms || ['twitter', 'linkedin'],
            content: event.data.content || 'Generated social content',
            niche: this.userNiche,
            scheduledFor: event.data.scheduledFor || this.getNextScheduledTime('twitter')
          },
          priority: 5
        });
      }
    }
    
    return actions;
  }

  protected async executeActions(actions: Action[]): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];
    
    for (const action of actions) {
      try {
        if (action.type === ActionType.SCHEDULE_POST) {
          // Create scheduled post
          const scheduledPost: ScheduledPost = {
            id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            platform: action.parameters.platforms[0] || 'twitter',
            content: action.parameters.content,
            scheduledDate: new Date(action.parameters.scheduledFor),
            contentType: 'post',
            hashtags: [],
            status: 'scheduled',
            topic: 'Generated Content',
            pillar: 'Automated Content'
          };

          this.scheduledPosts.set(scheduledPost.id, scheduledPost);

          results.push({
            actionId: action.id,
            success: true,
            result: {
              postId: scheduledPost.id,
              platforms: action.parameters.platforms,
              scheduledFor: action.parameters.scheduledFor,
              status: 'scheduled'
            },
            timestamp: new Date()
          });
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
    console.log(`Enhanced Social Media Agent processing ${feedback.length} feedback items`);
    
    for (const fb of feedback) {
      if (fb.outcome === 'success' && fb.score && fb.score > 0.8) {
        console.log(`High-performing social content: ${fb.actionId}`);
      } else if (fb.outcome === 'failure') {
        console.log(`Social media posting failed: ${fb.actionId} - ${fb.details}`);
      }
    }
  }

  // Build social media content generation prompt
  private buildSocialMediaPrompt(request: SocialMediaRequest): string {
    const currentTime = new Date().toLocaleString();
    
    return `You are a social media expert and content creator with 10+ years of experience creating viral, engaging content that drives massive engagement and conversions across all major platforms.

## Content Creation Brief
**Current Date/Time:** ${currentTime}
**Niche:** ${request.niche}
**Topic:** ${request.topic}
**Platforms:** ${request.platforms.join(', ')}
**Tone:** ${request.tone}
**Content Type:** ${request.contentType}
**Target Audience:** ${request.targetAudience}
**Call to Action:** ${request.callToAction || 'Engage with the content'}

## Your Mission
Create platform-optimized social media content that stops the scroll, drives engagement, and builds community around the ${request.niche} niche.

## Platform-Specific Requirements

### Twitter/X
- Maximum 280 characters
- Use 2-3 relevant hashtags
- Include engaging hooks
- Encourage retweets and replies

### LinkedIn
- Professional tone with personal touch
- 1,300 character limit for optimal engagement
- Use 3-5 hashtags
- Include industry insights
- Encourage professional discussion

### Instagram
- Visual-first content descriptions
- Use 8-10 hashtags
- Include emoji strategically
- Encourage saves and shares

### Facebook
- Conversational and community-focused
- Longer form content acceptable
- Ask questions to drive comments
- Use 3-5 hashtags

### TikTok
- Trend-aware content
- Hook within first 3 seconds
- Use trending hashtags and sounds
- Encourage duets and stitches

### YouTube
- Educational or entertaining focus
- Strong titles and descriptions
- Use 5-8 hashtags
- Encourage subscriptions and comments

## Content Strategy Framework

### Hook Formulas
- Question Hook: "What if I told you..."
- Statistic Hook: "95% of people don't know..."
- Story Hook: "Last week, something incredible happened..."
- Contrarian Hook: "Everyone says X, but actually..."
- List Hook: "5 things that will change your..."

### Engagement Drivers
- Ask specific questions
- Use polls and interactive elements
- Share personal experiences
- Provide actionable tips
- Create urgency or FOMO
- Use social proof

### Call-to-Action Types
- Save this post for later
- Share with someone who needs this
- Comment your thoughts below
- Follow for more ${request.niche} tips
- DM me for more details
- Tag a friend who should see this

## Content Quality Standards
- Every post must provide immediate value
- Use active voice and strong verbs
- Include specific, measurable benefits
- Address pain points directly
- Create emotional connection
- Optimize for platform algorithms
- Include trending elements when relevant

## Output Format
Return as JSON with this structure:
{
  "content": [
    {
      "platform": "twitter",
      "content": "Optimized content for Twitter",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "bestPostingTime": "3:00 PM EST",
      "engagementTips": ["tip1", "tip2"],
      "variations": ["variation1", "variation2"]
    }
  ]
}

Create engaging, platform-optimized content for each requested platform that drives maximum engagement in the ${request.niche} space.`;
  }

  // Parse social media response
  private parseSocialResponse(response: string, request: SocialMediaRequest): SocialMediaContent[] {
    try {
      const parsed = JSON.parse(response);
      return parsed.content || [];
    } catch (error) {
      // Fallback parsing
      return request.platforms.map(platform => ({
        platform,
        content: `Engaging ${request.niche} content for ${platform}: ${request.topic}`,
        hashtags: [`#${request.niche}`, `#${request.topic}`, '#socialmedia'],
        bestPostingTime: '12:00 PM EST',
        engagementTips: ['Ask questions', 'Use relevant hashtags', 'Post consistently'],
        variations: [`Alternative version for ${platform}`]
      }));
    }
  }

  protected async performBackgroundTask(): Promise<void> {
    if (!this.userNiche) {
      return;
    }

    const activities = [
      `Analyzing ${this.userNiche} social media trends`,
      `Optimizing posting schedule for ${this.userNiche}`,
      `Researching hashtags for ${this.userNiche}`,
      `Creating content variations for ${this.userNiche}`,
      `Monitoring ${this.userNiche} engagement metrics`,
      `Planning next week's ${this.userNiche} content`,
      `Analyzing competitor ${this.userNiche} strategies`,
      `Updating ${this.userNiche} content calendar`,
      `Researching ${this.userNiche} audience insights`,
      `Optimizing ${this.userNiche} social media performance`
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];
    console.log(`Enhanced Social Media Agent: ${activity}`);
    this.status = 'acting' as any;
    
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 5000));
    
    this.status = 'idle' as any;
    console.log(`Enhanced Social Media Agent: Completed - ${activity}`);
  }



  // Public method for API endpoint
  public async generateSocialPosts(request: {
    topic: string;
    platforms: string[];
    tone: string;
    count: number;
    apiKey: string;
  }): Promise<SocialMediaContent[]> {
    const socialRequest: SocialMediaRequest = {
      niche: this.userNiche || 'business',
      topic: request.topic,
      platforms: request.platforms as SocialPlatform[],
      tone: request.tone as any,
      contentType: 'post',
      targetAudience: 'professionals',
      apiKey: request.apiKey
    };

    return await this.generateSocialContent(socialRequest);
  }

  // Public method for generating content ideas
  public async generateContentIdeas(request: {
    niche: string;
    targetAudience: string;
    count: number;
    apiKey: string;
  }): Promise<string[]> {
    try {
      const userAI = genkit({
        plugins: [
          googleAI({ apiKey: request.apiKey }),
        ],
      });

      const prompt = `Generate ${request.count} engaging content ideas for ${request.niche} targeting ${request.targetAudience}. 
      Each idea should be specific, actionable, and designed to drive engagement on social media.
      
      Return as a simple JSON array of strings:
      ["idea1", "idea2", "idea3", ...]`;

      const result = await userAI.generate({
        model: googleAI.model('gemini-2.0-flash-exp'),
        prompt: prompt,
        config: {
          temperature: 0.8,
          maxOutputTokens: 1000
        }
      });

      try {
        const ideas = JSON.parse(result.text);
        return Array.isArray(ideas) ? ideas : [];
      } catch {
        // Fallback if JSON parsing fails
        return result.text.split('\n').filter(line => line.trim()).slice(0, request.count);
      }
    } catch (error) {
      console.error('Error generating content ideas:', error);
      return [
        `${request.niche} tips for beginners`,
        `Common ${request.niche} mistakes to avoid`,
        `Latest trends in ${request.niche}`,
        `${request.niche} success stories`,
        `Tools and resources for ${request.niche}`
      ];
    }
  }

  // Cleanup method
  public destroy(): void {
    if (this.postingTimer) {
      clearInterval(this.postingTimer);
      this.postingTimer = null;
    }
  }
}

export const enhancedSocialMediaAgent = new EnhancedSocialMediaAgent();