'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function suggestCTAs(input: { context: string; apiKey: string }) {
  const genAI = new GoogleGenerativeAI(input.apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are a conversion optimization expert who has tested thousands of CTAs and increased click-through rates by 300%+ for major brands. You understand the psychology of action and what makes people click.

## CTA Optimization Brief
**Context/Scenario:** ${input.context}

## Your Mission
Create 5 high-converting call-to-action phrases that compel immediate action. These CTAs should feel natural, remove friction, and create urgency while being platform-agnostic.

## CTA Psychology Framework
Apply these proven psychological triggers:

**1. Action-Oriented Language**
- Use strong, specific action verbs (Get, Start, Discover, Unlock, Access)
- Avoid weak words (Submit, Click Here, Learn More)
- Create momentum with power words

**2. Value-First Messaging**
- Lead with the benefit, not the action
- Make the value proposition crystal clear
- Focus on what they GET, not what they GIVE

**3. Urgency & Scarcity**
- Include time-sensitive language when appropriate
- Create fear of missing out (FOMO)
- Use words like "Now," "Today," "Limited"

**4. Friction Reduction**
- Remove barriers with words like "Free," "Instant," "No Commitment"
- Make it feel easy and risk-free
- Address common objections preemptively

**5. Personalization**
- Use "Your" language to make it personal
- Reference their specific situation or needs
- Create ownership before they even click

## CTA Variations to Create
Generate 5 different approaches:

1. **Benefit-Focused CTA:** Lead with the primary value/outcome
2. **Urgency-Driven CTA:** Create time-sensitive action
3. **Risk-Free CTA:** Remove barriers and objections
4. **Curiosity-Based CTA:** Create intrigue and discovery
5. **Direct Action CTA:** Clear, straightforward command

## Optimization Guidelines
- **Length:** 2-6 words maximum (under 40 characters)
- **Clarity:** Instantly understandable action
- **Specificity:** Avoid generic phrases
- **Emotion:** Trigger excitement or urgency
- **Simplicity:** One clear action per CTA
- **Testing:** Each should be A/B test worthy

## Power Words to Consider
**Action:** Get, Start, Discover, Unlock, Access, Claim, Grab, Secure
**Value:** Free, Instant, Exclusive, Limited, Premium, Guaranteed
**Urgency:** Now, Today, Limited, Last Chance, Ending Soon
**Benefit:** Save, Earn, Win, Gain, Boost, Transform, Achieve

## Quality Standards
- Each CTA must create immediate desire to click
- Remove any ambiguity about what happens next
- Feel natural within the given context
- Work across all platforms and devices
- Pass the "grandmother test" (anyone can understand it)

Return as a JSON array of 5 optimized CTAs: ["CTA 1", "CTA 2", "CTA 3", "CTA 4", "CTA 5"]`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text);
  } catch {
    // Fallback if JSON parsing fails
    return text.split('\n').filter(line => line.trim()).slice(0, 5);
  }
}

export async function generateProductReview(input: { productName: string; features: string; apiKey: string }) {
  const genAI = new GoogleGenerativeAI(input.apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are a professional product reviewer with 10+ years of experience writing in-depth, honest reviews for major publications. Your reviews are known for being thorough, balanced, and genuinely helpful to consumers making purchasing decisions.

## Product Review Assignment
**Product:** ${input.productName}
**Key Features:** ${input.features}

## Your Mission
Write a comprehensive, SEO-optimized product review that provides genuine value to readers while building trust and authority. This should be the kind of review that ranks #1 on Google and converts browsers into buyers.

## Review Structure & Requirements

### Introduction (150-200 words)
- Hook the reader with a compelling opening statement
- Briefly introduce the product and its main purpose
- Share your testing methodology and time spent with the product
- Set expectations for what the review will cover
- Include a brief verdict preview to keep readers engaged

### Detailed Analysis (400-600 words)
**What We Loved (Pros) - 4-6 detailed points:**
- Go beyond surface-level features to real-world benefits
- Include specific examples and use cases
- Mention measurable improvements or results
- Compare to competitors where relevant
- Use sensory language and vivid descriptions

**Areas for Improvement (Cons) - 2-4 honest points:**
- Be fair but honest about limitations
- Suggest who might not be the ideal customer
- Mention any learning curve or setup challenges
- Address common complaints from other users
- Provide context for why these might not be deal-breakers

### Real-World Testing (200-300 words)
- Share specific scenarios where you tested the product
- Include before/after comparisons where applicable
- Mention any surprises (positive or negative)
- Discuss long-term durability or performance
- Address how it performs under different conditions

### Value Assessment (100-150 words)
- Analyze price vs. value proposition
- Compare to similar products in the market
- Discuss different budget considerations
- Mention any ongoing costs or requirements
- Assess ROI for business products

### Final Verdict (100-150 words)
- Clear recommendation with specific use cases
- Mention ideal customer profile
- Include confidence level in recommendation
- Suggest alternatives if this isn't the right fit
- End with a memorable closing statement

## Writing Style Guidelines
- Use conversational, authoritative tone
- Include specific numbers, percentages, and timeframes
- Write in first person to build personal connection
- Use subheadings for easy scanning
- Include transition sentences between sections
- Balance enthusiasm with honest criticism
- Use power words and emotional triggers appropriately

## SEO Optimization
- Include product name naturally throughout
- Use relevant keywords from the features list
- Create scannable content with bullet points
- Include comparison phrases and buying intent keywords
- Write meta-description worthy opening paragraph

Return the complete review as markdown content (800-1200 words total).`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  return { review: response.text() };
}

export async function generateProductHook(input: { productDescription: string; emotion: string; apiKey: string }) {
  const genAI = new GoogleGenerativeAI(input.apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are a viral marketing specialist and copywriting expert who has created hooks that generated millions of views and thousands of conversions. You understand the psychology of scroll-stopping content and what makes people take action.

## Hook Creation Brief
**Product/Offer:** ${input.productDescription}
**Target Emotion:** ${input.emotion}

## Your Mission
Create 5 irresistible product hooks that stop the scroll, trigger the target emotion, and compel immediate action. These hooks should work across all social platforms and feel native to each environment.

## Hook Psychology Framework
Based on the target emotion "${input.emotion}", apply these psychological triggers:

${input.emotion === 'Curiosity' ? `
**Curiosity-Driven Hooks:**
- Create information gaps that demand closure
- Use pattern interrupts and unexpected statements
- Tease secrets, insider knowledge, or hidden truths
- Use "What if..." or "Imagine if..." scenarios
- Reference surprising statistics or counterintuitive facts
` : input.emotion === 'Urgency' ? `
**Urgency-Driven Hooks:**
- Create time-sensitive scenarios
- Use scarcity and limited availability
- Reference missed opportunities and regret
- Include specific deadlines and countdowns
- Emphasize "last chance" or "final opportunity"
` : input.emotion === 'Transformation' ? `
**Transformation-Driven Hooks:**
- Show dramatic before/after scenarios
- Use "From X to Y" transformation language
- Reference life-changing moments and breakthroughs
- Include specific timeframes for results
- Paint vivid pictures of the new reality
` : input.emotion === 'Pain Point' ? `
**Pain Point-Driven Hooks:**
- Agitate existing frustrations and problems
- Use "tired of..." or "sick of..." language
- Reference common struggles and daily annoyances
- Amplify the cost of inaction
- Create urgency around solving the problem
` : input.emotion === 'Contrarian' ? `
**Contrarian-Driven Hooks:**
- Challenge conventional wisdom
- Use "Everyone thinks... but actually..."
- Reference industry myths and misconceptions
- Position as the "truth they don't want you to know"
- Create us-vs-them mentality
` : `
**Emotion-Driven Hooks:**
- Trigger the specific emotion through vivid language
- Use sensory words and emotional descriptors
- Create relatable scenarios and situations
- Reference universal human experiences
- Build emotional connection before logical appeal
`}

## Hook Structure Variations
Create hooks using these proven formulas:

1. **Question Hook:** Start with a compelling question that demands an answer
2. **Statistic Hook:** Lead with a surprising or shocking number
3. **Story Hook:** Begin a narrative that creates immediate investment
4. **Contrarian Hook:** Challenge a common belief or assumption
5. **Benefit Hook:** Lead with the most compelling outcome or result

## Platform Optimization
- **Length:** 10-25 words for maximum impact
- **Language:** Conversational, platform-native tone
- **Formatting:** Consider how it looks in feeds and stories
- **Engagement:** Include elements that encourage comments/shares
- **Clarity:** Instantly understandable without context

## Quality Standards
- Each hook must be scroll-stopping within 3 seconds
- Include specific, measurable benefits when possible
- Use power words and emotional triggers strategically
- Avoid generic or overused phrases
- Create curiosity gaps that demand resolution
- Make the value proposition crystal clear
- Use active voice and strong action words

## Hook Testing Criteria
Ask yourself for each hook:
- Would this stop me mid-scroll?
- Does it trigger the target emotion immediately?
- Is the value proposition clear?
- Would I want to know more?
- Does it feel authentic and not salesy?

Return as a JSON array of 5 compelling hooks: ["Hook 1", "Hook 2", "Hook 3", "Hook 4", "Hook 5"]`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    const hooks = JSON.parse(text);
    return { hooks };
  } catch {
    // Fallback if JSON parsing fails
    const hooks = text.split('\n').filter(line => line.trim()).slice(0, 5);
    return { hooks };
  }
}

export async function generateEmailContent(input: { objective: string; tone: string; productDetails: string; apiKey: string }) {
  const genAI = new GoogleGenerativeAI(input.apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are an elite email marketing specialist with 15+ years of experience creating campaigns that achieve 40%+ open rates and 20%+ click-through rates. You've generated millions in revenue through email marketing for top brands.

## Campaign Brief
**Primary Objective:** ${input.objective}
**Tone of Voice:** ${input.tone}
**Product/Offer Details:** ${input.productDetails}

## Your Mission
Create a high-converting email campaign that cuts through inbox noise, builds genuine engagement, and drives action. Apply advanced email psychology, deliverability best practices, and conversion optimization.

## Subject Line Strategy (Generate 5 variations)
Create subject lines using these proven psychological triggers:
1. **Curiosity Gap** - Create intrigue without revealing everything (e.g., "The secret they don't want you to know...")
2. **Urgency/Scarcity** - Time-sensitive or limited availability (e.g., "24 hours left...")
3. **Benefit-Driven** - Clear value proposition (e.g., "Save 50% on...")
4. **Personal/Direct** - Feels like a personal message (e.g., "Quick question for you...")
5. **Social Proof** - Leverages others' experiences (e.g., "10,000+ customers love this...")

## Subject Line Optimization Rules
- 30-50 characters for mobile optimization
- Avoid spam trigger words (FREE, URGENT, !!!)
- Use power words and emotional triggers
- Include specific numbers when relevant
- Create pattern interrupts that stand out

## Email Body Framework (400-800 words)
Structure using the AIDA+ framework:

**ATTENTION (Opening Hook - First 2 sentences)**
- Pattern interrupt or compelling statement
- Personalized greeting that feels genuine
- Immediate value or intrigue that hooks the reader

**INTEREST (Value Proposition - 2-3 paragraphs)**
- Clear benefit statement addressing their specific pain
- Use storytelling elements or case studies
- Address the "what's in it for me" question immediately
- Include specific, measurable outcomes

**DESIRE (Social Proof & Benefits - 2-3 paragraphs)**
- Specific results, testimonials, or success stories
- Stack multiple benefits with emotional triggers
- Address common objections preemptively
- Use sensory language and vivid imagery
- Include risk reversal (guarantees, money-back offers)

**ACTION (Clear CTA - Final paragraph)**
- Single, clear call-to-action (not multiple competing CTAs)
- Create urgency or scarcity ethically
- Remove friction and make next step obvious
- Use action-oriented language

## Advanced Email Psychology Elements to Include
- Reciprocity (provide free value first)
- Social proof (testimonials, user counts, reviews)
- Authority (credentials, expertise, media mentions)
- Scarcity (limited time/quantity - be specific)
- Commitment (small asks that lead to bigger ones)
- Loss aversion (what they'll miss out on)
- Personalization (use "you" language, specific details)

## Formatting for Maximum Engagement
- Short paragraphs (2-3 sentences max)
- Bullet points for easy scanning
- White space for visual breathing room
- Mobile-first design considerations
- Strategic use of bold text for emphasis
- Conversational, human tone (avoid corporate speak)

## Quality Standards
- Every sentence must advance the sale
- Use specific numbers and timeframes
- Include emotional triggers and power words
- Address the reader's internal dialogue
- Create curiosity gaps that demand attention
- Build trust through transparency and authenticity
- Make the offer irresistible and time-sensitive

Return as JSON:
{
  "subjectLines": ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5"],
  "body": "Comprehensive 400-800 word email body with storytelling, emotional hooks, social proof, and compelling CTA"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text);
  } catch {
    // Fallback if JSON parsing fails
    return {
      subjectLines: ["Check out our latest offer!", "Don't miss this opportunity", "Special deal just for you"],
      body: "We're excited to share something special with you..."
    };
  }
}

export async function generateImage(input: { prompt: string; apiKey: string }) {
  // Note: Google AI doesn't support image generation directly
  // This would need to be implemented with a different service
  throw new Error('Image generation not yet implemented with Google AI');
}