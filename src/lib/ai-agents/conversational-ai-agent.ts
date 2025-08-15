import { BaseAgent } from './base-agent';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  AgentType,
  EventType,
  ActionType,
  Event,
  Action,
  ExecutionResult,
  Feedback,
  DecisionContext,
  AgentConfiguration
} from './types';

export class ConversationalAIAgent extends BaseAgent {
  protected async processEvents(events: Event[]): Promise<void> {
    console.log(`ConversationalAIAgent ${this.id} processing ${events.length} events`);
    
    for (const event of events) {
      if (event.type === EventType.CUSTOMER_INTERACTION) {
        this.context.conversationHistory.push({
          type: 'conversation',
          timestamp: event.timestamp,
          data: event.data
        });
      }
    }
  }

  protected async makeDecisions(context: DecisionContext): Promise<Action[]> {
    const actions: Action[] = [];
    
    for (const event of context.events) {
      if (event.type === EventType.CUSTOMER_INTERACTION) {
        const response = await this.generateResponse(event);
        
        actions.push({
          id: `ai_response_${event.id}_${Date.now()}`,
          type: ActionType.SEND_MESSAGE,
          agentId: this.id,
          timestamp: new Date(),
          parameters: {
            customerId: event.customerId,
            message: response.message,
            confidence: response.confidence,
            intent: response.detectedIntent,
            channel: event.data.channel || 'chat'
          },
          priority: 8
        });

        // If confidence is low, escalate to human
        if (response.confidence < 0.7) {
          actions.push({
            id: `escalate_low_confidence_${event.id}_${Date.now()}`,
            type: ActionType.ESCALATE,
            agentId: this.id,
            timestamp: new Date(),
            parameters: {
              customerId: event.customerId,
              reason: 'Low confidence AI response',
              confidence: response.confidence,
              originalMessage: event.data.message
            },
            priority: 7
          });
        }
      }
    }

    return actions;
  }

  protected async executeActions(actions: Action[]): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];

    for (const action of actions) {
      try {
        let result: any = {};

        switch (action.type) {
          case ActionType.SEND_MESSAGE:
            result = await this.sendAIResponse(action.parameters);
            break;
          case ActionType.ESCALATE:
            result = await this.escalateToHuman(action.parameters);
            break;
          default:
            throw new Error(`Unsupported action type: ${action.type}`);
        }

        results.push({
          actionId: action.id,
          success: true,
          result,
          timestamp: new Date()
        });
      } catch (error) {
        results.push({
          actionId: action.id,
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date()
        });
      }
    }

    return results;
  }

  protected async processFeedback(feedback: Feedback[]): Promise<void> {
    console.log(`ConversationalAIAgent ${this.id} processing ${feedback.length} feedback items`);
    
    // Learn from conversation feedback to improve responses
    for (const fb of feedback) {
      if (fb.outcome === 'success' && fb.score && fb.score > 0.8) {
        console.log(`High-quality AI response: ${fb.actionId}`);
      } else if (fb.outcome === 'failure') {
        console.log(`Poor AI response: ${fb.actionId} - ${fb.details}`);
      }
    }
  }

  private async generateResponse(event: Event): Promise<{
    message: string;
    confidence: number;
    detectedIntent: string;
  }> {
    const userMessage = event.data.message || '';
    const intent = this.detectIntent(userMessage);
    const confidence = this.calculateConfidence(userMessage, intent);
    
    try {
      // Get user's API key from localStorage (client-side) or environment/event data (server-side)
      let apiKey: string | null = null;
      
      if (typeof window !== 'undefined') {
        // Client-side: get from localStorage
        try {
          apiKey = localStorage.getItem('user_gemini_api_key');
        } catch (error) {
          console.warn('Failed to access localStorage for API key:', error);
        }
      }
      
      // Fallback to environment variable or event data if no user key found
      if (!apiKey) {
        apiKey = process.env.GEMINI_API_KEY || event.data.apiKey || null;
      }
      
      if (!apiKey) {
        throw new Error('API key not configured. Please set your Gemini API key in settings to enable AI responses.');
      }

      // Create AI instance with rate limiting awareness
      const userAI = genkit({
        plugins: [
          googleAI({ apiKey }),
        ],
      });

      const conversationHistory = this.context.conversationHistory
        .slice(-5) // Last 5 interactions for context
        .map(h => `${h.type}: ${JSON.stringify(h.data)}`)
        .join('\n');

      const prompt = this.buildConversationalPrompt(userMessage, intent, conversationHistory, event.data);

      const response = await userAI.generate({
        model: googleAI.model('gemini-2.0-flash-exp'),
        prompt: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      });

      const aiResponse = response.text;
      
      if (!aiResponse) {
        throw new Error('AI API returned empty response');
      }

      return {
        message: aiResponse,
        confidence: Math.min(0.95, confidence + 0.2), // Boost confidence for AI responses
        detectedIntent: intent
      };

    } catch (error) {
      console.error('AI response generation failed:', error);
      
      // Instead of fallback responses, throw the error so the unified service can handle it properly
      if (error instanceof Error && error.message.includes('API key')) {
        throw new Error('API key not configured. Please set your Gemini API key in settings to enable AI responses.');
      }
      
      throw new Error(`AI response generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'greeting';
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      return 'pricing_inquiry';
    }
    
    if (lowerMessage.includes('feature') || lowerMessage.includes('capability') || lowerMessage.includes('function')) {
      return 'feature_question';
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
      return 'support_request';
    }
    
    if (lowerMessage.includes('demo') || lowerMessage.includes('trial') || lowerMessage.includes('show me')) {
      return 'demo_request';
    }
    
    return 'general_inquiry';
  }

  private calculateConfidence(message: string, intent: string): number {
    // Simple confidence calculation based on keyword matches
    const keywords = {
      'greeting': ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      'pricing_inquiry': ['price', 'cost', 'pricing', 'how much', 'expensive'],
      'feature_question': ['feature', 'capability', 'function', 'can you', 'does it'],
      'support_request': ['help', 'support', 'problem', 'issue', 'error'],
      'demo_request': ['demo', 'trial', 'show me', 'see it', 'preview']
    };

    const intentKeywords = keywords[intent as keyof typeof keywords] || [];
    const lowerMessage = message.toLowerCase();
    
    const matchCount = intentKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
    const confidence = Math.min(0.95, 0.5 + (matchCount * 0.15));
    
    return confidence;
  }

  private buildConversationalPrompt(userMessage: string, intent: string, conversationHistory: string, eventData: any): string {
    const currentTime = new Date().toLocaleString();
    const customerInfo = eventData.customerInfo ? JSON.stringify(eventData.customerInfo) : 'Not available';
    
    return `You are an expert customer service AI assistant with deep knowledge of business solutions, CRM systems, and customer success. You're helpful, professional, and focused on providing value to customers.

## Current Context
**Time:** ${currentTime}
**Customer Message:** "${userMessage}"
**Detected Intent:** ${intent}
**Channel:** ${eventData.channel || 'chat'}
**Customer Info:** ${customerInfo}

## Recent Conversation History
${conversationHistory || 'No previous conversation history'}

## Your Role & Capabilities
You represent a comprehensive business platform that includes:
- Advanced CRM and lead management
- Marketing automation and email campaigns  
- Sales pipeline management and forecasting
- Customer interaction tracking and analytics
- AI-powered business insights and reporting
- Integration with popular business tools
- Workflow automation and task management

## Response Guidelines
1. **Be Helpful & Professional**: Provide clear, actionable information
2. **Stay Contextual**: Reference the conversation history when relevant
3. **Be Specific**: Give concrete examples and next steps when possible
4. **Show Expertise**: Demonstrate knowledge of business processes and pain points
5. **Guide Next Steps**: Always suggest a clear path forward
6. **Maintain Confidence**: Be authoritative but not pushy
7. **Personalize**: Use available customer information to tailor responses
8. **Be Concise**: Keep responses focused and under 200 words

## Intent-Specific Instructions
${this.getIntentSpecificInstructions(intent)}

## Response Requirements
- Address the customer's specific question or concern
- Provide valuable information related to their intent
- Suggest appropriate next steps or actions
- Maintain a professional but friendly tone
- Keep response length appropriate for the channel (${eventData.channel || 'chat'})
- Include relevant business benefits when appropriate

Generate a helpful, professional response that addresses the customer's needs and moves the conversation forward constructively.`;
  }

  private getIntentSpecificInstructions(intent: string): string {
    switch (intent) {
      case 'greeting':
        return `- Welcome the customer warmly
- Ask how you can help them today
- Set a positive, helpful tone for the conversation`;
        
      case 'pricing_inquiry':
        return `- Acknowledge their interest in pricing
- Mention that pricing varies based on needs and scale
- Offer to connect them with sales for detailed pricing
- Highlight value and ROI potential
- Ask about their specific requirements to provide better guidance`;
        
      case 'feature_question':
        return `- Provide specific information about relevant features
- Explain how features solve business problems
- Give concrete examples of feature benefits
- Offer a demo to show features in action
- Ask follow-up questions to understand their specific needs`;
        
      case 'support_request':
        return `- Show empathy and willingness to help
- Ask clarifying questions to understand the issue
- Provide initial troubleshooting steps if appropriate
- Offer to escalate to technical support if needed
- Ensure they feel heard and supported`;
        
      case 'demo_request':
        return `- Express enthusiasm about showing the platform
- Explain the demo process and what they'll see
- Ask about their specific interests or use cases
- Offer to schedule a personalized demo
- Mention that demos are tailored to their business needs`;
        
      default:
        return `- Listen carefully to understand their needs
- Ask clarifying questions to provide better assistance
- Provide relevant information based on their inquiry
- Guide them toward appropriate next steps
- Maintain a helpful, solution-oriented approach`;
    }
  }

  private generateFallbackResponse(intent: string, userMessage: string): {
    message: string;
    confidence: number;
    detectedIntent: string;
  } {
    let response = '';
    
    switch (intent) {
      case 'greeting':
        response = this.generateGreeting();
        break;
      case 'pricing_inquiry':
        response = this.generatePricingResponse();
        break;
      case 'feature_question':
        response = this.generateFeatureResponse(userMessage);
        break;
      case 'support_request':
        response = this.generateSupportResponse();
        break;
      case 'demo_request':
        response = this.generateDemoResponse();
        break;
      default:
        response = this.generateGenericResponse();
        break;
    }

    return {
      message: response,
      confidence: this.calculateConfidence(userMessage, intent),
      detectedIntent: intent
    };
  }

  private generateGreeting(): string {
    const greetings = [
      "Hello! How can I help you today?",
      "Hi there! What can I assist you with?",
      "Welcome! I'm here to help with any questions you have.",
      "Hello! Thanks for reaching out. How may I assist you?"
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private generatePricingResponse(): string {
    const responses = [
      "I'd be happy to help with pricing information! Our plans start at $29/month. Would you like me to connect you with our sales team for detailed pricing?",
      "Great question about pricing! We have several plans to fit different needs. Let me get you connected with someone who can provide detailed pricing information.",
      "For pricing details, I recommend speaking with our sales team who can provide you with a customized quote based on your specific needs."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateFeatureResponse(message: string): string {
    const responses = [
      "That's a great question about our features! Our platform includes comprehensive CRM, automation tools, and analytics. Would you like me to schedule a demo to show you these features in action?",
      "We have extensive features for lead management, customer engagement, and workflow automation. I'd recommend a personalized demo to show you exactly what you're looking for.",
      "Our platform offers a wide range of features. To give you the most relevant information, could you tell me more about your specific use case?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateSupportResponse(): string {
    const responses = [
      "I'm here to help! Can you tell me more about the issue you're experiencing?",
      "I'd be happy to assist you with that. Could you provide more details about what you need help with?",
      "Let me help you resolve that. Can you describe the problem you're facing in more detail?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateDemoResponse(): string {
    const responses = [
      "I'd love to show you our platform! Let me connect you with our team to schedule a personalized demo at your convenience.",
      "Absolutely! A demo is the best way to see our platform in action. I'll get you connected with someone who can schedule that for you.",
      "Great idea! Our demos are tailored to your specific needs. Let me arrange that for you right away."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateGenericResponse(): string {
    const responses = [
      "Thank you for your message. I want to make sure I understand your question correctly. Could you provide a bit more detail?",
      "I'm here to help! Could you tell me more about what you're looking for?",
      "Thanks for reaching out. To give you the best assistance, could you elaborate on your question?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private async sendAIResponse(parameters: any): Promise<any> {
    console.log(`Sending AI response to customer ${parameters.customerId}: ${parameters.message}`);
    
    return {
      responseId: `ai_response_${Date.now()}`,
      customerId: parameters.customerId,
      message: parameters.message,
      confidence: parameters.confidence,
      intent: parameters.intent,
      channel: parameters.channel,
      timestamp: new Date()
    };
  }

  private async escalateToHuman(parameters: any): Promise<any> {
    console.log(`Escalating conversation to human for customer ${parameters.customerId}`);
    
    return {
      escalationId: `escalation_${Date.now()}`,
      customerId: parameters.customerId,
      reason: parameters.reason,
      confidence: parameters.confidence,
      originalMessage: parameters.originalMessage,
      assignedTo: 'human_agent',
      timestamp: new Date()
    };
  }
}

export function createConversationalAIAgent(id: string): ConversationalAIAgent {
  const config: AgentConfiguration = {
    id,
    type: AgentType.CONVERSATIONAL_AI,
    name: `Conversational AI Agent ${id}`,
    description: 'Powers chatbots and conversational interfaces',
    capabilities: [
      {
        name: 'Natural Language Processing',
        description: 'Understands and responds to customer messages',
        requiredPermissions: ['read_conversations', 'send_messages', 'escalate_conversations'],
        supportedEventTypes: [EventType.CUSTOMER_INTERACTION],
        supportedActionTypes: [ActionType.SEND_MESSAGE, ActionType.ESCALATE]
      }
    ],
    enabled: true,
    priority: 8,
    maxConcurrentActions: 20,
    learningEnabled: true,
    configuration: {
      confidenceThreshold: 0.7,
      autoEscalation: true,
      contextWindow: 10,
      responseTimeout: 5000
    }
  };

  return new ConversationalAIAgent(config);
}