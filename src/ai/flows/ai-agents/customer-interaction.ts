import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const CustomerInteractionInputSchema = z.object({
  customerMessage: z.string().describe('Customer message or inquiry'),
  conversationHistory: z.array(z.object({
    role: z.enum(['customer', 'agent']),
    message: z.string(),
    timestamp: z.string()
  })).optional().describe('Previous conversation history'),
  customerProfile: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
    previousInteractions: z.number().default(0),
    leadScore: z.number().optional(),
    urgency: z.enum(['low', 'medium', 'high']).default('medium')
  }).optional().describe('Customer profile information'),
  context: z.object({
    product: z.string().optional(),
    department: z.enum(['sales', 'support', 'billing', 'technical']).default('support'),
    businessHours: z.boolean().default(true),
    language: z.string().default('en')
  }).optional().describe('Interaction context'),
  apiKey: z.string().describe('User API key for Google AI')
});

const CustomerInteractionOutputSchema = z.object({
  response: z.string().describe('AI-generated response to customer'),
  sentiment: z.enum(['positive', 'neutral', 'negative']).describe('Customer sentiment analysis'),
  intent: z.string().describe('Detected customer intent'),
  urgency: z.enum(['low', 'medium', 'high']).describe('Interaction urgency level'),
  suggestedActions: z.array(z.object({
    action: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
    description: z.string()
  })).describe('Suggested follow-up actions'),
  escalationRequired: z.boolean().describe('Whether human escalation is needed'),
  buyingSignals: z.array(z.object({
    signal: z.string(),
    strength: z.number().min(0).max(1),
    description: z.string()
  })).describe('Detected buying signals'),
  nextBestAction: z.string().describe('Recommended next action'),
  responseTime: z.string().describe('Recommended response timeframe'),
  tags: z.array(z.string()).describe('Conversation tags for categorization')
});

export async function customerInteractionFlow(input: z.infer<typeof CustomerInteractionInputSchema>) {
    const { customerMessage, conversationHistory, customerProfile, context, apiKey } = input;

    const historyContext = conversationHistory?.map(h => 
      `${h.role.toUpperCase()}: ${h.message}`
    ).join('\n') || 'No previous conversation history';

    const customerContext = customerProfile ? `
Customer Profile:
- Name: ${customerProfile.name || 'Unknown'}
- Company: ${customerProfile.company || 'Unknown'}
- Industry: ${customerProfile.industry || 'Unknown'}
- Previous Interactions: ${customerProfile.previousInteractions}
- Lead Score: ${customerProfile.leadScore || 'Not scored'}
- Urgency: ${customerProfile.urgency}
` : 'No customer profile available';

    const prompt = `You are an expert customer service AI agent with deep knowledge of customer psychology, sales, and support best practices. You excel at understanding customer needs, detecting buying signals, and providing exceptional service.

## Current Interaction
**Customer Message:** ${customerMessage}
**Department:** ${context?.department || 'support'}
**Business Hours:** ${context?.businessHours ? 'Yes' : 'No'}
**Language:** ${context?.language || 'English'}

## Conversation History
${historyContext}

## Customer Context
${customerContext}

## Your Mission
Analyze this customer interaction and provide:
1. A helpful, empathetic response that addresses their needs
2. Sentiment analysis of the customer's message
3. Intent detection and urgency assessment
4. Buying signal detection with strength ratings
5. Suggested follow-up actions with priorities
6. Escalation recommendations if needed

## Response Guidelines
- Be empathetic and understanding
- Provide clear, actionable solutions
- Use positive language and tone
- Address concerns proactively
- Offer additional value when appropriate
- Maintain professional yet friendly demeanor
- Detect and respond to emotional cues
- Identify opportunities for upselling/cross-selling

## Sentiment Analysis Framework
- **Positive:** Happy, satisfied, excited, grateful
- **Neutral:** Informational, routine, factual
- **Negative:** Frustrated, angry, disappointed, confused

## Intent Categories
- Information seeking
- Problem resolution
- Purchase inquiry
- Feature request
- Complaint/issue
- Billing question
- Technical support
- Account management

## Buying Signal Detection
Look for signals like:
- Pricing inquiries
- Feature comparisons
- Timeline questions
- Decision-maker involvement
- Urgency indicators
- Budget discussions
- Implementation questions

## Escalation Triggers
- High negative sentiment
- Complex technical issues
- Billing disputes
- Legal concerns
- VIP customers
- Threats or abuse

Provide a comprehensive analysis and response that demonstrates expert customer service skills.`;

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
        temperature: 0.6,
        maxOutputTokens: 2000
      }
    });

    // Analyze the customer message for sentiment and intent
    const sentiment = analyzeSentiment(customerMessage);
    const intent = detectIntent(customerMessage);
    const urgency = assessUrgency(customerMessage, customerProfile);
    const buyingSignals = detectBuyingSignals(customerMessage);
    const escalationRequired = shouldEscalate(customerMessage, sentiment, customerProfile);

    // Generate suggested actions based on analysis
    const suggestedActions = generateSuggestedActions(intent, sentiment, urgency, buyingSignals);

    // Generate appropriate response
    const aiResponse = generateResponse(customerMessage, sentiment, intent, context);

    return {
      response: aiResponse,
      sentiment,
      intent,
      urgency,
      suggestedActions,
      escalationRequired,
      buyingSignals,
      nextBestAction: determineNextBestAction(intent, sentiment, buyingSignals),
      responseTime: determineResponseTime(urgency, context?.businessHours),
      tags: generateTags(intent, sentiment, urgency, context?.department)
    };
}

function analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'wonderful', 'fantastic', 'happy', 'satisfied', 'thank'];
  const negativeWords = ['terrible', 'awful', 'hate', 'frustrated', 'angry', 'disappointed', 'problem', 'issue', 'broken', 'wrong'];
  
  const lowerMessage = message.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
    return 'pricing_inquiry';
  }
  if (lowerMessage.includes('how to') || lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return 'support_request';
  }
  if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('order')) {
    return 'purchase_intent';
  }
  if (lowerMessage.includes('feature') || lowerMessage.includes('functionality') || lowerMessage.includes('capability')) {
    return 'feature_inquiry';
  }
  if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('error')) {
    return 'problem_resolution';
  }
  if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('invoice')) {
    return 'billing_inquiry';
  }
  
  return 'general_inquiry';
}

function assessUrgency(message: string, profile?: any): 'low' | 'medium' | 'high' {
  const lowerMessage = message.toLowerCase();
  const urgentWords = ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'now'];
  const hasUrgentWords = urgentWords.some(word => lowerMessage.includes(word));
  
  if (hasUrgentWords) return 'high';
  if (profile?.leadScore && profile.leadScore > 80) return 'high';
  if (lowerMessage.includes('soon') || lowerMessage.includes('quickly')) return 'medium';
  
  return 'low';
}

function detectBuyingSignals(message: string) {
  const signals = [];
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    signals.push({
      signal: 'pricing_inquiry',
      strength: 0.7,
      description: 'Customer asking about pricing'
    });
  }
  
  if (lowerMessage.includes('when') && (lowerMessage.includes('start') || lowerMessage.includes('begin'))) {
    signals.push({
      signal: 'timeline_inquiry',
      strength: 0.8,
      description: 'Customer asking about implementation timeline'
    });
  }
  
  if (lowerMessage.includes('demo') || lowerMessage.includes('trial')) {
    signals.push({
      signal: 'demo_request',
      strength: 0.9,
      description: 'Customer requesting demo or trial'
    });
  }
  
  return signals;
}

function shouldEscalate(message: string, sentiment: string, profile?: any): boolean {
  const lowerMessage = message.toLowerCase();
  const escalationTriggers = ['legal', 'lawyer', 'sue', 'refund', 'cancel', 'manager', 'supervisor'];
  
  if (sentiment === 'negative' && escalationTriggers.some(trigger => lowerMessage.includes(trigger))) {
    return true;
  }
  
  if (profile?.leadScore && profile.leadScore > 90) {
    return true; // High-value customers get escalated
  }
  
  return false;
}

function generateSuggestedActions(intent: string, sentiment: string, urgency: string, buyingSignals: any[]) {
  const actions = [];
  
  if (intent === 'pricing_inquiry') {
    actions.push({
      action: 'send_pricing_information',
      priority: 'high' as const,
      description: 'Send detailed pricing information and schedule demo'
    });
  }
  
  if (sentiment === 'negative') {
    actions.push({
      action: 'follow_up_satisfaction',
      priority: 'high' as const,
      description: 'Follow up to ensure customer satisfaction'
    });
  }
  
  if (buyingSignals.length > 0) {
    actions.push({
      action: 'schedule_sales_call',
      priority: 'high' as const,
      description: 'Schedule sales call to discuss requirements'
    });
  }
  
  if (urgency === 'high') {
    actions.push({
      action: 'immediate_response',
      priority: 'high' as const,
      description: 'Provide immediate response and escalate if needed'
    });
  }
  
  return actions;
}

function generateResponse(message: string, sentiment: string, intent: string, context?: any): string {
  const responses = {
    pricing_inquiry: "Thank you for your interest in our pricing! I'd be happy to provide you with detailed information about our plans and help you find the best option for your needs. Let me get that information for you right away.",
    support_request: "I'm here to help you with that! Let me look into your request and provide you with the best solution. Can you provide a bit more detail about what you're trying to accomplish?",
    purchase_intent: "That's fantastic! I'm excited to help you get started. Let me walk you through our options and find the perfect solution for your needs.",
    problem_resolution: "I understand your concern and I'm here to help resolve this for you. Let me investigate this issue and get back to you with a solution as quickly as possible.",
    general_inquiry: "Thank you for reaching out! I'm happy to help answer your questions and provide any information you need."
  };
  
  const baseResponse = responses[intent as keyof typeof responses] || responses.general_inquiry;
  
  if (sentiment === 'negative') {
    return `I sincerely apologize for any inconvenience you've experienced. ${baseResponse} Your satisfaction is our top priority, and I'm committed to making this right.`;
  }
  
  if (sentiment === 'positive') {
    return `Thank you so much for your kind words! ${baseResponse} It's customers like you that make what we do so rewarding.`;
  }
  
  return baseResponse;
}

function determineNextBestAction(intent: string, sentiment: string, buyingSignals: any[]): string {
  if (buyingSignals.length > 0) {
    return 'Schedule sales consultation to discuss requirements and next steps';
  }
  
  if (intent === 'pricing_inquiry') {
    return 'Send pricing information and offer product demo';
  }
  
  if (sentiment === 'negative') {
    return 'Follow up to ensure issue resolution and customer satisfaction';
  }
  
  return 'Continue conversation and gather more information about customer needs';
}

function determineResponseTime(urgency: string, businessHours?: boolean): string {
  if (urgency === 'high') {
    return businessHours ? 'Within 15 minutes' : 'Within 1 hour';
  }
  
  if (urgency === 'medium') {
    return businessHours ? 'Within 2 hours' : 'Within 4 hours';
  }
  
  return businessHours ? 'Within 24 hours' : 'Next business day';
}

function generateTags(intent: string, sentiment: string, urgency: string, department?: string): string[] {
  const tags = [intent, sentiment, urgency];
  
  if (department) {
    tags.push(department);
  }
  
  return tags;
}