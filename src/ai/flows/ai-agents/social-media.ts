import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const SocialMediaInputSchema = z.object({
  topic: z.string().describe('Topic for social media content'),
  niche: z.string().describe('Specific niche or industry'),
  platforms: z.array(z.enum(['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok', 'youtube'])).describe('Target platforms'),
  tone: z.enum(['professional', 'casual', 'engaging', 'educational', 'promotional']).describe('Content tone'),
  contentType: z.enum(['post', 'thread', 'story', 'reel', 'carousel']).describe('Type of content'),
  targetAudience: z.string().describe('Target audience'),
  callToAction: z.string().optional().describe('Specific call-to-action'),
  hashtags: z.array(z.string()).optional().describe('Suggested hashtags'),
  apiKey: z.string().describe('User API key for Google AI')
});

const SocialMediaOutputSchema = z.object({
  content: z.array(z.object({
    platform: z.string(),
    content: z.string(),
    hashtags: z.array(z.string()),
    bestPostingTime: z.string(),
    engagementTips: z.array(z.string()),
    variations: z.array(z.string())
  })).describe('Platform-optimized social media content'),
  contentIdeas: z.array(z.string()).describe('Additional content ideas'),
  engagementStrategy: z.object({
    bestTimes: z.array(z.string()),
    contentMix: z.object({
      educational: z.number(),
      promotional: z.number(),
      entertaining: z.number()
    }),
    hashtagStrategy: z.array(z.string())
  }).describe('Engagement optimization strategy')
});

export async function generateSocialMedia(input: z.infer<typeof SocialMediaInputSchema>) {
    const { topic, niche, platforms, tone, contentType, targetAudience, callToAction, hashtags, apiKey } = input;

    const prompt = `You are a social media expert and content creator with 10+ years of experience creating viral, engaging content that drives massive engagement and conversions across all major platforms.

## Content Brief
**Topic:** ${topic}
**Niche:** ${niche}
**Platforms:** ${platforms.join(', ')}
**Tone:** ${tone}
**Content Type:** ${contentType}
**Target Audience:** ${targetAudience}
**Call to Action:** ${callToAction || 'Engage with the content'}
**Suggested Hashtags:** ${hashtags?.join(', ') || 'Generate relevant hashtags'}

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
- Use trending hashtags
- Encourage duets and stitches

### YouTube
- Educational or entertaining focus
- Strong titles and descriptions
- Use 5-8 hashtags
- Encourage subscriptions

## Content Strategy Framework
- Hook formulas: Question, Statistic, Story, Contrarian, List
- Engagement drivers: Questions, polls, personal experiences, actionable tips
- Call-to-action types: Save, share, comment, follow, DM

Create platform-optimized content for each requested platform that drives maximum engagement in the ${niche} space.

Return as JSON with the specified structure including content for each platform, engagement tips, and strategy recommendations.`;

    // Create AI instance with user's API key
    const userAI = genkit({
      plugins: [
        googleAI({ apiKey }),
      ],
    });

    const response = await userAI.generate({
      model: googleAI.model('gemini-2.0-flash-exp'),
      prompt: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 3000
      }
    });

    // Parse response and create structured output
    const platformContent = platforms.map(platform => {
      const platformSpecificContent = generatePlatformContent(platform, topic, niche, tone, targetAudience);
      return {
        platform,
        content: platformSpecificContent.content,
        hashtags: platformSpecificContent.hashtags,
        bestPostingTime: platformSpecificContent.bestPostingTime,
        engagementTips: platformSpecificContent.engagementTips,
        variations: platformSpecificContent.variations
      };
    });

    const contentIdeas = [
      `5 Essential ${niche} Tips for ${targetAudience}`,
      `Common ${niche} Mistakes to Avoid`,
      `Latest Trends in ${niche}`,
      `${niche} Success Stories`,
      `Tools and Resources for ${niche}`,
      `Behind the Scenes: ${niche} Process`,
      `${niche} Myths Debunked`,
      `Quick ${niche} Tutorial`,
      `${niche} Industry News`,
      `${niche} Community Spotlight`
    ];

    return {
      content: platformContent,
      contentIdeas,
      engagementStrategy: {
        bestTimes: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
        contentMix: {
          educational: 40,
          promotional: 20,
          entertaining: 40
        },
        hashtagStrategy: [
          `#${niche}`,
          `#${niche}tips`,
          `#${targetAudience}`,
          `#${topic}`,
          '#socialmedia'
        ]
      }
    };
}

function generatePlatformContent(platform: string, topic: string, niche: string, tone: string, targetAudience: string) {
  const baseContent = `Discover the power of ${topic} in ${niche}! Perfect for ${targetAudience} looking to level up their game.`;

  const platformConfigs = {
    twitter: {
      content: `🚀 ${baseContent.substring(0, 200)}... What's your experience with ${topic}? #${niche}`,
      hashtags: [`#${niche}`, `#${topic}`, '#tips'],
      bestPostingTime: '3:00 PM EST',
      engagementTips: ['Ask questions', 'Use relevant hashtags', 'Retweet valuable content'],
      variations: [`Alternative: ${topic} is changing ${niche} forever. Here's why...`, `Thread idea: 5 ways ${topic} transforms ${niche}`]
    },
    linkedin: {
      content: `${baseContent}\n\nAs professionals in ${niche}, we need to understand ${topic}. Here's what I've learned:\n\n• Key insight 1\n• Key insight 2\n• Key insight 3\n\nWhat's your take on ${topic}?`,
      hashtags: [`#${niche}`, `#${topic}`, '#professional', '#insights', '#growth'],
      bestPostingTime: '8:00 AM EST',
      engagementTips: ['Share professional insights', 'Ask thoughtful questions', 'Engage with comments'],
      variations: [`Case study approach: How ${topic} helped our ${niche} team`, `Industry analysis: The future of ${topic} in ${niche}`]
    },
    instagram: {
      content: `✨ ${baseContent}\n\n📸 Swipe to see the transformation!\n\n💡 Pro tip: ${topic} works best when...\n\n👇 Save this post for later!`,
      hashtags: [`#${niche}`, `#${topic}`, '#inspiration', '#tips', '#transformation', '#save', '#share', '#growth', '#success', '#motivation'],
      bestPostingTime: '11:00 AM EST',
      engagementTips: ['Use visual storytelling', 'Include save-worthy tips', 'Add relevant emojis'],
      variations: [`Story version: Quick ${topic} tip for ${niche}`, `Carousel: Step-by-step ${topic} guide`]
    },
    facebook: {
      content: `${baseContent}\n\nI've been working in ${niche} for years, and ${topic} has been a game-changer. Here's why:\n\n[Detailed explanation]\n\nWhat questions do you have about ${topic}? Drop them below! 👇`,
      hashtags: [`#${niche}`, `#${topic}`, '#community', '#discussion', '#tips'],
      bestPostingTime: '1:00 PM EST',
      engagementTips: ['Encourage comments', 'Share personal experiences', 'Create discussion'],
      variations: [`Poll version: What's your biggest ${topic} challenge?`, `Live video idea: ${topic} Q&A session`]
    },
    tiktok: {
      content: `POV: You discover ${topic} in ${niche} 🤯\n\n*shows transformation*\n\nThis changed everything for ${targetAudience}! Try it and let me know 👇`,
      hashtags: [`#${niche}`, `#${topic}`, '#fyp', '#viral', '#tips', '#transformation'],
      bestPostingTime: '7:00 PM EST',
      engagementTips: ['Hook within 3 seconds', 'Use trending sounds', 'Encourage duets'],
      variations: [`Trend version: ${topic} hits different in ${niche}`, `Tutorial: How to use ${topic} in ${niche}`]
    },
    youtube: {
      content: `🎯 The Ultimate ${topic} Guide for ${niche}\n\nIn this video, you'll learn:\n✅ What is ${topic}\n✅ Why it matters for ${targetAudience}\n✅ Step-by-step implementation\n✅ Common mistakes to avoid\n\n👍 Like if this helped you!\n🔔 Subscribe for more ${niche} content!`,
      hashtags: [`#${niche}`, `#${topic}`, '#tutorial', '#guide', '#howto', '#tips', '#education', '#youtube'],
      bestPostingTime: '2:00 PM EST',
      engagementTips: ['Create compelling thumbnails', 'Ask for likes and subscriptions', 'Include timestamps'],
      variations: [`Series idea: ${topic} mastery course`, `Short version: ${topic} in 60 seconds`]
    }
  };

  return platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.twitter;
}