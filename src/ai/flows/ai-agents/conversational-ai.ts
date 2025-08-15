import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const ConversationalAIInputSchema = z.object({
  userMessage: z.string().describe('User message or query'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    message: z.string(),
    timestamp: z.string()
  })).optional().describe('Previous conversation history'),
  userProfile: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
    interests: z.array(z.string()).optional(),
    previousInteractions: z.number().default(0),
    customerType: z.enum(['prospect', 'customer', 'partner']).optional()
  }).optional().describe('User profile information'),
  context: z.object({
    platform: z.enum(['website', 'email', 'social', 'mobile']).default('website'),
    page: z.string().optional(),
    product: z.string().optional(),
    campaign: z.string().optional(),
    intent: z.enum(['support', 'sales', 'information', 'feedback']).optional(),
    businessHours: z.boolean().default(true),
    language: z.string().default('en')
  }).optional().describe('Conversation context'),
  capabilities: z.array(z.enum(['product_info', 'pricing', 'support', 'booking', 'lead_capture', 'recommendations'])).default(['product_info', 'support']).describe('Available AI capabilities'),
  apiKey: z.string().describe('User API key for Google AI')
});

const ConversationalAIOutputSchema = z.object({
  response: z.string().describe('AI assistant response'),
  intent: z.string().describe('Detected user intent'),
  confidence: z.number().min(0).max(100).describe('Response confidence level'),
  sentiment: z.enum(['positive', 'neutral', 'negative']).describe('User sentiment'),
  entities: z.array(z.object({
    entity: z.string(),
    value: z.string(),
    confidence: z.number()
  })).describe('Extracted entities from user message'),
  suggestedActions: z.array(z.object({
    action: z.string(),
    type: z.enum(['follow_up', 'escalate', 'capture_lead', 'schedule', 'provide_info']),
    priority: z.enum(['high', 'medium', 'low'])
  })).describe('Suggested follow-up actions'),
  conversationState: z.object({
    stage: z.enum(['greeting', 'discovery', 'presentation', 'objection_handling', 'closing', 'support']),
    nextBestAction: z.string(),
    completionPercentage: z.number().min(0).max(100)
  }).describe('Current conversation state'),
  personalization: z.object({
    tone: z.enum(['professional', 'friendly', 'casual', 'formal']),
    recommendations: z.array(z.string()),
    customizations: z.array(z.string())
  }).describe('Personalization elements'),
  escalationRequired: z.boolean().describe('Whether human escalation is needed'),
  leadQualification: z.object({
    isQualified: z.boolean(),
    score: z.number().min(0).max(100),
    qualificationFactors: z.array(z.string())
  }).optional().describe('Lead qualification assessment')
});

export async function conversationalAIFlow(input: z.infer<typeof ConversationalAIInputSchema>) {
    const { userMessage, conversationHistory, userProfile, context, capabilities, apiKey } = input;
    
    // Create AI instance with user's API key
    const userAI = genkit({
      plugins: [
        googleAI({ apiKey }),
      ],
    });

    const historyContext = conversationHistory?.map(h => 
      `${h.role.toUpperCase()}: ${h.message}`
    ).join('\n') || 'No previous conversation history';

    const profileContext = userProfile ? `
User Profile:
- Name: ${userProfile.name || 'Unknown'}
- Company: ${userProfile.company || 'Unknown'}
- Industry: ${userProfile.industry || 'Unknown'}
- Interests: ${userProfile.interests?.join(', ') || 'Unknown'}
- Customer Type: ${userProfile.customerType || 'Unknown'}
- Previous Interactions: ${userProfile.previousInteractions}
` : 'No user profile available';

    const contextInfo = context ? `
Conversation Context:
- Platform: ${context.platform}
- Page: ${context.page || 'Unknown'}
- Product: ${context.product || 'Unknown'}
- Campaign: ${context.campaign || 'Unknown'}
- Intent: ${context.intent || 'Unknown'}
- Business Hours: ${context.businessHours}
- Language: ${context.language}
` : 'No context information available';

    const prompt = `You are an advanced conversational AI assistant with expertise in customer service, sales, and support. You excel at understanding user intent, providing helpful responses, and guiding conversations toward positive outcomes.

## Current Conversation
**User Message:** ${userMessage}
**Available Capabilities:** ${capabilities.join(', ')}

## Conversation History
${historyContext}

## User Profile
${profileContext}

## Context Information
${contextInfo}

## Your Mission
Provide an intelligent, helpful response that:
1. Addresses the user's specific question or need
2. Demonstrates understanding of their context and history
3. Guides the conversation toward a positive outcome
4. Maintains appropriate tone and personalization
5. Identifies opportunities for value creation

## Response Guidelines

### Tone and Style
- Be conversational yet professional
- Match the user's communication style
- Use positive, solution-oriented language
- Show empathy and understanding
- Avoid jargon unless appropriate for the user

### Intent Recognition
- Accurately identify what the user is trying to accomplish
- Recognize both explicit and implicit needs
- Understand emotional context and sentiment
- Identify buying signals or support needs

### Personalization
- Reference previous interactions when relevant
- Tailor responses to user's industry/role
- Use appropriate level of technical detail
- Consider user's experience level

### Value Creation
- Provide actionable insights and recommendations
- Offer relevant resources or next steps
- Identify opportunities to help beyond the immediate question
- Build trust through expertise and helpfulness

### Conversation Management
- Guide conversations toward productive outcomes
- Know when to ask clarifying questions
- Recognize when to escalate to human agents
- Maintain conversation flow and context

## Capability-Specific Responses

### Product Information
- Provide detailed, accurate product information
- Explain features and benefits clearly
- Compare options when appropriate
- Address specific use cases

### Pricing
- Present pricing information transparently
- Explain value proposition
- Offer appropriate packages or options
- Handle pricing objections professionally

### Support
- Diagnose issues systematically
- Provide step-by-step solutions
- Escalate complex technical issues
- Follow up on resolution

### Lead Capture
- Qualify leads naturally through conversation
- Gather relevant information progressively
- Identify decision-making authority
- Assess timeline and budget

### Booking/Scheduling
- Offer convenient scheduling options
- Confirm details and expectations
- Provide preparation information
- Send appropriate confirmations

Generate a response that demonstrates expert conversational AI capabilities while achieving the user's goals.`;

    const response = await userAI.generate({
      model: googleAI.model('gemini-2.0-flash-exp'),
      prompt: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    });

    // Analyze user message for intent, sentiment, and entities
    const intent = detectIntent(userMessage, capabilities);
    const sentiment = analyzeSentiment(userMessage);
    const entities = extractEntities(userMessage);
    const confidence = calculateConfidence(userMessage, intent, conversationHistory);
    
    // Determine conversation state and next actions
    const conversationState = determineConversationState(userMessage, conversationHistory, intent);
    const suggestedActions = generateSuggestedActions(intent, sentiment, conversationState, capabilities);
    const personalization = generatePersonalization(userProfile, context, conversationHistory);
    const escalationRequired = shouldEscalate(userMessage, sentiment, intent, conversationHistory);
    
    // Lead qualification if applicable
    const leadQualification = intent.includes('sales') || intent.includes('pricing') ? 
      qualifyLead(userMessage, userProfile, conversationHistory) : undefined;

    // Generate contextual response
    const aiResponse = generateContextualResponse(
      userMessage, 
      intent, 
      sentiment, 
      userProfile, 
      context, 
      conversationHistory,
      response.text
    );

    return {
      response: aiResponse,
      intent,
      confidence,
      sentiment,
      entities,
      suggestedActions,
      conversationState,
      personalization,
      escalationRequired,
      leadQualification
    };
}

function detectIntent(message: string, capabilities: string[]): string {
  const lowerMessage = message.toLowerCase();
  
  // Pricing intent
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing') || lowerMessage.includes('how much')) {
    return 'pricing_inquiry';
  }
  
  // Product information intent
  if (lowerMessage.includes('feature') || lowerMessage.includes('how does') || lowerMessage.includes('what is') || lowerMessage.includes('tell me about')) {
    return 'product_information';
  }
  
  // Support intent
  if (lowerMessage.includes('help') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('not working')) {
    return 'support_request';
  }
  
  // Booking/demo intent
  if (lowerMessage.includes('demo') || lowerMessage.includes('schedule') || lowerMessage.includes('meeting') || lowerMessage.includes('call')) {
    return 'booking_request';
  }
  
  // Sales intent
  if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('sign up') || lowerMessage.includes('get started')) {
    return 'sales_inquiry';
  }
  
  // Comparison intent
  if (lowerMessage.includes('compare') || lowerMessage.includes('vs') || lowerMessage.includes('versus') || lowerMessage.includes('alternative')) {
    return 'comparison_request';
  }
  
  // Feedback intent
  if (lowerMessage.includes('feedback') || lowerMessage.includes('suggestion') || lowerMessage.includes('improve')) {
    return 'feedback_submission';
  }
  
  return 'general_inquiry';
}

function analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'wonderful', 'fantastic', 'happy', 'satisfied', 'impressed', 'awesome'];
  const negativeWords = ['terrible', 'awful', 'hate', 'frustrated', 'angry', 'disappointed', 'problem', 'issue', 'broken', 'wrong', 'bad', 'horrible'];
  
  const lowerMessage = message.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractEntities(message: string) {
  const entities = [];
  const lowerMessage = message.toLowerCase();
  
  // Extract email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = message.match(emailRegex);
  if (emails) {
    emails.forEach(email => {
      entities.push({
        entity: 'email',
        value: email,
        confidence: 0.95
      });
    });
  }
  
  // Extract phone numbers
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  const phones = message.match(phoneRegex);
  if (phones) {
    phones.forEach(phone => {
      entities.push({
        entity: 'phone',
        value: phone,
        confidence: 0.9
      });
    });
  }
  
  // Extract company names (simple heuristic)
  if (lowerMessage.includes('company') || lowerMessage.includes('business') || lowerMessage.includes('organization')) {
    const words = message.split(' ');
    const companyIndex = words.findIndex(word => 
      word.toLowerCase().includes('company') || 
      word.toLowerCase().includes('business') || 
      word.toLowerCase().includes('organization')
    );
    if (companyIndex > 0) {
      entities.push({
        entity: 'company',
        value: words[companyIndex - 1],
        confidence: 0.7
      });
    }
  }
  
  // Extract numbers (potential quantities, prices, etc.)
  const numberRegex = /\b\d+\b/g;
  const numbers = message.match(numberRegex);
  if (numbers) {
    numbers.forEach(number => {
      entities.push({
        entity: 'number',
        value: number,
        confidence: 0.8
      });
    });
  }
  
  return entities;
}

function calculateConfidence(message: string, intent: string, history?: any[]): number {
  let confidence = 60; // Base confidence
  
  // Higher confidence for clear intents
  const clearIntents = ['pricing_inquiry', 'booking_request', 'sales_inquiry'];
  if (clearIntents.includes(intent)) {
    confidence += 20;
  }
  
  // Higher confidence with conversation history
  if (history && history.length > 0) {
    confidence += 10;
  }
  
  // Higher confidence for longer, more detailed messages
  if (message.length > 50) {
    confidence += 10;
  }
  
  // Lower confidence for very short or unclear messages
  if (message.length < 10) {
    confidence -= 20;
  }
  
  return Math.min(95, Math.max(30, confidence));
}

function determineConversationState(message: string, history?: any[], intent?: string) {
  const historyLength = history?.length || 0;
  
  // Determine stage based on conversation flow
  let stage: 'greeting' | 'discovery' | 'presentation' | 'objection_handling' | 'closing' | 'support' = 'greeting';
  let completionPercentage = 0;
  
  if (historyLength === 0) {
    stage = 'greeting';
    completionPercentage = 10;
  } else if (intent === 'support_request') {
    stage = 'support';
    completionPercentage = 30;
  } else if (intent === 'product_information') {
    stage = 'discovery';
    completionPercentage = 40;
  } else if (intent === 'pricing_inquiry') {
    stage = 'presentation';
    completionPercentage = 60;
  } else if (intent === 'sales_inquiry' || intent === 'booking_request') {
    stage = 'closing';
    completionPercentage = 80;
  } else if (historyLength > 3) {
    stage = 'objection_handling';
    completionPercentage = 70;
  }
  
  const nextBestAction = determineNextBestAction(stage, intent);
  
  return {
    stage,
    nextBestAction,
    completionPercentage
  };
}

function determineNextBestAction(stage: string, intent?: string): string {
  switch (stage) {
    case 'greeting':
      return 'Ask discovery questions to understand needs';
    case 'discovery':
      return 'Present relevant product information and benefits';
    case 'presentation':
      return 'Address questions and provide detailed information';
    case 'objection_handling':
      return 'Address concerns and provide reassurance';
    case 'closing':
      return 'Guide toward next steps or conversion';
    case 'support':
      return 'Provide solution or escalate if needed';
    default:
      return 'Continue conversation and gather more information';
  }
}

function generateSuggestedActions(intent: string, sentiment: string, conversationState: any, capabilities: string[]) {
  const actions = [];
  
  // Intent-based actions
  switch (intent) {
    case 'pricing_inquiry':
      actions.push({
        action: 'Provide pricing information and schedule demo',
        type: 'provide_info' as const,
        priority: 'high' as const
      });
      break;
    case 'booking_request':
      actions.push({
        action: 'Schedule meeting or demo',
        type: 'schedule' as const,
        priority: 'high' as const
      });
      break;
    case 'support_request':
      actions.push({
        action: 'Provide support solution or escalate',
        type: 'provide_info' as const,
        priority: 'high' as const
      });
      break;
    case 'sales_inquiry':
      actions.push({
        action: 'Capture lead information and qualify',
        type: 'capture_lead' as const,
        priority: 'high' as const
      });
      break;
  }
  
  // Sentiment-based actions
  if (sentiment === 'negative') {
    actions.push({
      action: 'Address concerns and provide reassurance',
      type: 'follow_up' as const,
      priority: 'high' as const
    });
  }
  
  // Stage-based actions
  if (conversationState.stage === 'closing') {
    actions.push({
      action: 'Present clear next steps and call-to-action',
      type: 'follow_up' as const,
      priority: 'medium' as const
    });
  }
  
  return actions;
}

function generatePersonalization(userProfile?: any, context?: any, history?: any[]) {
  let tone: 'professional' | 'friendly' | 'casual' | 'formal' = 'friendly';
  const recommendations = [];
  const customizations = [];
  
  // Determine tone based on context and profile
  if (context?.platform === 'email' || userProfile?.customerType === 'partner') {
    tone = 'professional';
  } else if (context?.platform === 'social') {
    tone = 'casual';
  }
  
  // Generate recommendations based on profile
  if (userProfile?.industry) {
    recommendations.push(`Industry-specific solutions for ${userProfile.industry}`);
    customizations.push(`Tailored messaging for ${userProfile.industry} sector`);
  }
  
  if (userProfile?.company) {
    recommendations.push(`Enterprise solutions suitable for ${userProfile.company}`);
  }
  
  if (userProfile?.interests) {
    userProfile.interests.forEach((interest: string) => {
      recommendations.push(`Resources related to ${interest}`);
    });
  }
  
  // Default recommendations
  if (recommendations.length === 0) {
    recommendations.push('Getting started guide', 'Best practices documentation', 'Success stories and case studies');
  }
  
  return {
    tone,
    recommendations,
    customizations
  };
}

function shouldEscalate(message: string, sentiment: string, intent: string, history?: any[]): boolean {
  const lowerMessage = message.toLowerCase();
  
  // Escalation triggers
  const escalationKeywords = ['manager', 'supervisor', 'human', 'person', 'speak to someone', 'not helpful', 'frustrated'];
  const hasEscalationKeyword = escalationKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Negative sentiment with multiple interactions
  const multipleNegativeInteractions = sentiment === 'negative' && history && history.length > 2;
  
  // Complex technical issues
  const complexIssue = intent === 'support_request' && lowerMessage.includes('technical') && lowerMessage.includes('error');
  
  return hasEscalationKeyword || multipleNegativeInteractions || complexIssue;
}

function qualifyLead(message: string, userProfile?: any, history?: any[]) {
  let score = 30; // Base score
  const qualificationFactors = [];
  
  // Profile-based qualification
  if (userProfile?.company) {
    score += 20;
    qualificationFactors.push('Has company information');
  }
  
  if (userProfile?.industry) {
    score += 15;
    qualificationFactors.push('Industry identified');
  }
  
  if (userProfile?.customerType === 'prospect') {
    score += 10;
    qualificationFactors.push('Identified as prospect');
  }
  
  // Message-based qualification
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('budget') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    score += 25;
    qualificationFactors.push('Budget/pricing interest');
  }
  
  if (lowerMessage.includes('timeline') || lowerMessage.includes('when') || lowerMessage.includes('soon')) {
    score += 20;
    qualificationFactors.push('Timeline interest');
  }
  
  if (lowerMessage.includes('decision') || lowerMessage.includes('approve') || lowerMessage.includes('authority')) {
    score += 15;
    qualificationFactors.push('Decision-making authority');
  }
  
  // Engagement-based qualification
  if (history && history.length > 2) {
    score += 10;
    qualificationFactors.push('Multiple interactions');
  }
  
  const isQualified = score >= 60;
  
  return {
    isQualified,
    score: Math.min(100, score),
    qualificationFactors
  };
}

function generateContextualResponse(
  message: string, 
  intent: string, 
  sentiment: string, 
  userProfile?: any, 
  context?: any, 
  history?: any[],
  aiResponse?: string
): string {
  const userName = userProfile?.name ? `, ${userProfile.name}` : '';
  
  // Base responses by intent
  const responses = {
    pricing_inquiry: `Thanks for your interest in our pricing${userName}! I'd be happy to provide you with detailed information about our plans and help you find the perfect option for your needs. Let me get that information for you right away.`,
    product_information: `Great question${userName}! I'd love to tell you more about our product features and how they can benefit you. Let me provide you with the details you're looking for.`,
    support_request: `I'm here to help you with that${userName}! Let me look into your request and provide you with the best solution. Can you tell me a bit more about what you're experiencing?`,
    booking_request: `I'd be happy to help you schedule a meeting${userName}! Let me check our availability and find a time that works best for you.`,
    sales_inquiry: `That's fantastic${userName}! I'm excited to help you get started with our solution. Let me walk you through our options and find the perfect fit for your needs.`,
    comparison_request: `Great question${userName}! I'd be happy to help you understand how we compare to other solutions and what makes us unique. Let me provide you with a detailed comparison.`,
    feedback_submission: `Thank you for taking the time to share your feedback${userName}! Your input is incredibly valuable to us and helps us improve our service.`,
    general_inquiry: `Thanks for reaching out${userName}! I'm here to help answer any questions you might have. What would you like to know more about?`
  };
  
  let baseResponse = responses[intent as keyof typeof responses] || responses.general_inquiry;
  
  // Adjust for sentiment
  if (sentiment === 'negative') {
    baseResponse = `I understand your concern${userName}, and I'm here to help make this right. ${baseResponse} Your satisfaction is our top priority.`;
  } else if (sentiment === 'positive') {
    baseResponse = `Thank you for your kind words${userName}! ${baseResponse} It's customers like you that make what we do so rewarding.`;
  }
  
  // Add context-specific information
  if (context?.product) {
    baseResponse += ` I see you're interested in ${context.product}, which is perfect for your needs.`;
  }
  
  if (userProfile?.industry) {
    baseResponse += ` Given your background in ${userProfile.industry}, I can provide industry-specific insights that will be most relevant to you.`;
  }
  
  return baseResponse;
}