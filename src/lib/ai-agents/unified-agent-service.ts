import { AgentRegistry } from './agent-registry';
import { TaskExecutionService } from './task-execution-service';
import { AgentInitializer } from './agent-initializer';
import { WorkspaceInitializer } from './workspace-initializer';
import { withFirestoreErrorHandling } from './firestore-error-handler';
import { AgentStatus } from './types';
import { Firestore, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';

export interface AgentActivity {
  id: string;
  agentId: string;
  type: 'task_execution' | 'autonomous_action' | 'user_interaction';
  description: string;
  timestamp: Date;
  status: 'success' | 'error' | 'in_progress';
  metadata?: Record<string, any>;
}

export interface AgentMetrics {
  agentId: string;
  tasksCompleted: number;
  successRate: number;
  averageExecutionTime: number;
  lastActivity: Date;
  totalExecutions: number;
}

/**
 * Unified service that manages both the new task-based interface
 * and maintains compatibility with existing autonomous agent functionality
 */
export class UnifiedAgentService {
  private static instance: UnifiedAgentService;
  private registry: AgentRegistry;
  private taskService: TaskExecutionService;
  private initializer: AgentInitializer;
  private activityListeners: Map<string, () => void> = new Map();

  private constructor() {
    this.registry = AgentRegistry.getInstance();
    this.taskService = TaskExecutionService.getInstance();
    this.initializer = AgentInitializer.getInstance();
  }

  public static getInstance(): UnifiedAgentService {
    if (!UnifiedAgentService.instance) {
      UnifiedAgentService.instance = new UnifiedAgentService();
    }
    return UnifiedAgentService.instance;
  }

  /**
   * Initialize all agents for a workspace
   * Maintains compatibility with existing initialization patterns
   */
  public async initializeWorkspaceAgents(db: Firestore, userId: string): Promise<void> {
    return withFirestoreErrorHandling(async () => {
      // Step 1: Ensure workspace document and collections exist
      const workspaceInitializer = WorkspaceInitializer.getInstance();
      await workspaceInitializer.initializeWorkspace(db, userId);

      // Step 2: Use existing initializer to maintain compatibility
      if (!this.initializer.getInitializationStatus()) {
        await this.initializer.initializeAllAgents(db, userId);
      }

      // Step 3: Load active agents from Firestore
      await this.registry.loadActiveAgents(db, userId);

      console.log('✅ Unified agent service initialized for workspace:', userId);
    }, 'AI Agents Initialization', userId);
  }

  /**
   * Execute a task through the unified interface
   * This is the new task-based interaction model
   */
  public async executeTask(
    db: Firestore,
    userId: string,
    taskId: string,
    agentId: string,
    additionalData?: Record<string, any>
  ) {
    return this.taskService.executeTask(db, userId, taskId, agentId, additionalData);
  }

  /**
   * Get all available tasks for an agent
   */
  public getAgentTasks(agentId: string) {
    return this.taskService.getTasksForAgent(agentId);
  }

  /**
   * Get recommended tasks based on workspace activity
   */
  public async getRecommendedTasks(db: Firestore, userId: string, agentId: string) {
    return this.taskService.getRecommendedTasks(db, userId, agentId);
  }

  /**
   * Toggle agent status (maintains existing functionality)
   */
  public async toggleAgent(db: Firestore, userId: string, agentId: string, enabled: boolean): Promise<void> {
    // Update Firestore first
    await this.registry.toggleAgentStatus(db, userId, agentId, enabled);

    // Check if agent exists before trying to start/stop
    const agent = this.registry.getAgent(agentId);
    if (!agent) {
      console.warn(`Agent ${agentId} not found in registry during toggle. Skipping start/stop operation.`);
      console.warn('Available agents:', this.registry.getAllAgents().map(a => a.id));

      // Try to reinitialize agents if none are found
      const allAgents = this.registry.getAllAgents();
      if (allAgents.length === 0) {
        console.log('No agents found in registry. Attempting to reinitialize...');
        try {
          await this.initializeWorkspaceAgents(db, userId);
        } catch (error) {
          console.error('Failed to reinitialize agents:', error);
        }
      }
      return;
    }

    // Start or stop the agent
    if (enabled) {
      await this.registry.startAgent(agentId);
    } else {
      await this.registry.stopAgent(agentId);
    }
  }

  /**
   * Get agent status and metrics
   */
  public getAgentStatus(agentId: string): AgentStatus {
    const agent = this.registry.getAgent(agentId);
    return agent?.getStatus() || AgentStatus.IDLE;
  }

  /**
   * Get agent information
   */
  public getAgentInfo(agentId: string) {
    return this.registry.getAgentInfo(agentId);
  }

  /**
   * Get all active agents
   */
  public getActiveAgents(): Record<string, boolean> {
    return this.registry['activeAgents'] || {};
  }

  /**
   * Listen to agent activity in real-time
   */
  public subscribeToAgentActivity(
    db: Firestore,
    userId: string,
    callback: (activities: AgentActivity[]) => void
  ): () => void {
    const activitiesRef = collection(db, 'workspaces', userId, 'agentActivities');
    const activitiesQuery = query(activitiesRef, orderBy('timestamp', 'desc'), limit(50));

    const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as AgentActivity[];

      callback(activities);
    });

    return unsubscribe;
  }

  /**
   * Get agent performance metrics
   */
  public async getAgentMetrics(db: Firestore, userId: string, agentId: string): Promise<AgentMetrics> {
    try {
      // Query real execution history from Firestore using client SDK
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const activitiesRef = collection(db, 'workspaces', userId, 'agentActivities');
      const activitiesQuery = query(activitiesRef, where('agentId', '==', agentId));

      const activitiesSnapshot = await getDocs(activitiesQuery);
      const activities = activitiesSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));

      // Calculate real metrics from activities
      const totalExecutions = activities.length;
      const successfulExecutions = activities.filter((a: any) => a.status === 'success').length;
      const successRate = totalExecutions > 0 ? successfulExecutions / totalExecutions : 0;

      // Get the most recent activity
      const sortedActivities = activities.sort((a: any, b: any) =>
        (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
      );
      const lastActivity = sortedActivities[0]?.timestamp || new Date();

      // Calculate average execution time (if available in activity data)
      const activitiesWithDuration = activities.filter((a: any) => a.executionTime);
      const averageExecutionTime = activitiesWithDuration.length > 0 ?
        activitiesWithDuration.reduce((sum: number, a: any) => sum + (a.executionTime || 0), 0) / activitiesWithDuration.length :
        2500; // Default reasonable execution time

      return {
        agentId,
        tasksCompleted: successfulExecutions,
        successRate: Math.min(1, Math.max(0, successRate)),
        averageExecutionTime: averageExecutionTime,
        lastActivity: lastActivity,
        totalExecutions: totalExecutions
      };
    } catch (error) {
      console.error(`Error fetching metrics for agent ${agentId}:`, error);

      // Fallback to basic metrics if query fails
      return {
        agentId,
        tasksCompleted: 0,
        successRate: 0,
        averageExecutionTime: 2500,
        lastActivity: new Date(),
        totalExecutions: 0
      };
    }
  }

  /**
   * Send a message to an agent (chat interface)
   */
  public async sendMessageToAgent(
    db: Firestore,
    userId: string,
    agentId: string,
    message: string
  ): Promise<string> {
    // Generate session ID for tracking
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Get agent context for hook payload
    const agentContext = this.getAgentContext(agentId);

    // Trigger session started hook
    await this.triggerHook('kiro.agent.session.started', {
      sessionId,
      agentId,
      userId,
      timestamp: new Date(),
      agentName: this.getAgentName(agentId),
      agentType: agentId,
      initialMessage: message,
      sessionContext: {
        agentCapabilities: agentContext.capabilities || [],
        agentDescription: agentContext.description || '',
        workspaceId: userId
      }
    });
    // First, ensure agents are initialized
    if (!this.initializer.getInitializationStatus()) {
      console.log('Agents not initialized, initializing now...');
      await this.initializeWorkspaceAgents(db, userId);
    }

    // Try to get the agent
    let agent = this.registry.getAgent(agentId);

    // If agent not found, try to reinitialize
    if (!agent) {
      console.log(`Agent ${agentId} not found in registry, attempting to reinitialize...`);
      await this.registry.loadActiveAgents(db, userId);
      agent = this.registry.getAgent(agentId);
    }

    // If still not found, provide a fallback response instead of throwing error
    if (!agent) {
      console.warn(`Agent ${agentId} not found in registry. Available agents:`,
        Array.from(this.registry.getAllAgents().keys()));

      // Return a helpful fallback response instead of throwing an error
      const agentName = this.getAgentName(agentId);
      return `Hello! I'm the ${agentName}. I'm currently being initialized. Please try again in a moment, or check that the agent is enabled in your workspace settings.`;
    }

    // Check if agent is active
    if (!this.registry.isActive(agentId)) {
      const agentName = this.getAgentName(agentId);
      return `The ${agentName} is currently disabled. Please enable it in your AI Agents settings to start chatting.`;
    }

    // Process the message and generate a real AI response
    try {
      const response = await this.generateAIResponse(agentId, message, userId);
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // If the error is about missing API key, provide helpful guidance
      if (error instanceof Error && error.message.includes('API key')) {
        const agentName = this.getAgentName(agentId);
        return `I'm ${agentName}, but I need an API key to provide intelligent responses. Please configure your Gemini API key in the settings to enable AI-powered conversations. You can get a free API key from Google AI Studio.`;
      }
      
      // For other errors, provide a more helpful error message instead of placeholder responses
      const agentName = this.getAgentName(agentId);
      return `I'm ${agentName} and I'm experiencing a technical issue right now. Please try again in a moment. If the problem persists, check your API key configuration or contact support. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Generate AI response for agent conversation
   */
  private async generateAIResponse(agentId: string, message: string, userId: string): Promise<string> {
    const actionId = `action_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const startTime = Date.now();

    // Trigger before action hook
    await this.triggerHook('kiro.agent.action.before', {
      actionId,
      agentId,
      userId,
      actionType: 'ai_response_generation',
      timestamp: new Date(),
      inputData: {
        userMessage: message,
        agentContext: this.getAgentContextString(agentId),
        messageLength: message.length
      },
      metadata: {
        sessionId: `session_${Date.now()}`,
        messageId: `msg_${Date.now()}`,
        confidenceThreshold: 0.7
      }
    });

    try {
      // Import the conversational AI flow
      const { conversationalAIFlow } = await import('@/ai/flows/ai-agents/conversational-ai');

      // Get agent context and personality
      const agentName = this.getAgentName(agentId);
      const agentContextString = this.getAgentContextString(agentId);

      // Get user's API key from localStorage (client-side) or environment (server-side)
      let apiKey: string | null = null;
      let keySource: 'user' | 'environment' | 'none' = 'none';
      
      if (typeof window !== 'undefined') {
        // Client-side: get from localStorage
        try {
          apiKey = localStorage.getItem('user_gemini_api_key');
          if (apiKey) {
            keySource = 'user';
          }
        } catch (error) {
          console.warn('Failed to access localStorage for API key:', error);
        }
      }
      
      // Fallback to environment variable if no user key found
      if (!apiKey) {
        apiKey = process.env.GEMINI_API_KEY || null;
        if (apiKey) {
          keySource = 'environment';
        }
      }
      
      // Trigger configuration hook to track API key source
      await this.triggerHook('kiro.agent.configuration.changed', {
        configId: `config_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        agentId,
        userId,
        timestamp: new Date(),
        configurationType: 'api_key_source',
        configurationData: {
          keySource,
          hasUserKey: keySource === 'user',
          hasEnvironmentKey: process.env.GEMINI_API_KEY ? true : false,
          fallbackUsed: keySource === 'environment'
        },
        metadata: {
          sessionId: actionId,
          clientSide: typeof window !== 'undefined'
        }
      });
      
      if (!apiKey) {
        throw new Error('No API key available. Please configure your Gemini API key in settings or set GEMINI_API_KEY environment variable.');
      }

      // Generate response using the conversational AI flow
      const result = await conversationalAIFlow({
        userMessage: message,
        conversationHistory: [], // Could be enhanced to include actual history
        userProfile: {
          name: undefined,
          email: undefined,
          company: undefined,
          industry: undefined,
          interests: [],
          previousInteractions: 0,
          customerType: 'prospect'
        },
        context: {
          platform: 'website',
          page: 'ai-agents-chat',
          product: agentName,
          campaign: undefined,
          intent: 'information',
          businessHours: true,
          language: 'en'
        },
        capabilities: ['product_info', 'support', 'recommendations'],
        apiKey
      });

      // Enhance the response with agent-specific context
      const enhancedResponse = `As your ${agentName}, ${result.response}`;

      // Check for content policy violations
      const violationCheck = await this.checkContentViolations(enhancedResponse, message, agentId, userId);
      if (violationCheck.hasViolation) {
        // Trigger guardrail violation hook
        await this.triggerHook('kiro.agent.guardrail.violation', {
          violationId: `violation_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          agentId,
          userId,
          timestamp: new Date(),
          violationType: violationCheck.type,
          severity: violationCheck.severity,
          context: {
            userMessage: this.redactPII(message),
            attemptedResponse: this.redactPII(enhancedResponse),
            agentContext: agentContextString
          },
          action: 'fallback'
        });

        // Return safe fallback response
        return this.getFallbackResponse(agentId);
      }

      // Trigger after action hook for success
      await this.triggerHook('kiro.agent.action.after', {
        actionId,
        agentId,
        userId,
        actionType: 'ai_response_generation',
        timestamp: new Date(),
        status: 'success',
        executionTime: Date.now() - startTime,
        outputData: {
          response: enhancedResponse,
          confidence: 0.8, // Could be derived from AI model
          fallbackUsed: false
        }
      });

      return enhancedResponse;
    } catch (error) {
      console.error('AI response generation failed:', error);

      // Trigger after action hook for error
      await this.triggerHook('kiro.agent.action.after', {
        actionId,
        agentId,
        userId,
        actionType: 'ai_response_generation',
        timestamp: new Date(),
        status: 'error',
        executionTime: Date.now() - startTime,
        outputData: {
          response: '',
          confidence: 0,
          fallbackUsed: true
        },
        error: {
          type: error instanceof Error ? error.constructor.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      });

      throw error; // Let the caller handle the fallback
    }
  }

  /**
   * Get agent-specific context string for AI responses
   */
  private getAgentContextString(agentId: string): string {
    const contexts: Record<string, string> = {
      'crm': 'You manage leads, contacts, and customer relationships. You can score leads, detect buying signals, assign leads to team members, and track customer interactions.',
      'content': 'You create and optimize content including blog posts, ad copy, email sequences, and social media content. You can also analyze content performance and suggest improvements.',
      'social': 'You manage social media presence across platforms. You can create posts, schedule content, analyze engagement metrics, and develop social media strategies.',
      'automation': 'You handle workflow automation and business process optimization. You can execute workflows, create new automations, and optimize existing processes.',
      'customer_interaction': 'You handle customer communications and support interactions. You can manage conversations, provide support responses, and track customer satisfaction.',
      'sales_pipeline': 'You manage the sales process from lead to close. You can track deals, update pipeline stages, forecast revenue, and identify sales opportunities.',
      'journey_orchestration': 'You coordinate customer journeys across touchpoints. You can design customer paths, trigger appropriate actions, and optimize conversion flows.',
      'data_integration': 'You handle data synchronization and integration between systems. You can connect platforms, sync data, and ensure data consistency.',
      'workflow_management': 'You oversee business workflows and task management. You can create workflows, assign tasks, track progress, and optimize processes.',
      'intelligence_reporting': 'You provide analytics and insights from business data. You can generate reports, identify trends, and provide actionable recommendations.',
      'conversational_ai': 'You handle AI-powered conversations and natural language interactions. You can chat with users, answer questions, and provide intelligent responses.'
    };

    return contexts[agentId] || 'You are a helpful AI agent that assists with various business automation and marketing tasks.';
  }

  /**
   * Get fallback response when AI generation fails
   */
  private getFallbackResponse(agentId: string): string {
    const fallbacks: Record<string, string> = {
      'crm': "I'm here to help with your CRM needs. I can assist with lead management, contact organization, and customer relationship tracking.",
      'content': "I'm ready to help with content creation. I can generate blog posts, ad copy, and marketing materials for your business.",
      'social': "I can help manage your social media presence. Let me know what type of content or scheduling assistance you need.",
      'automation': "I'm here to help automate your business processes. What workflows would you like me to help you with?",
      'default': "I'm here to help! Let me know what you'd like to work on and I'll do my best to assist you."
    };

    return fallbacks[agentId] || fallbacks['default'];
  }

  /**
   * Get human-readable agent name
   */
  private getAgentName(agentId: string): string {
    const agentNames: Record<string, string> = {
      'crm': 'CRM Agent',
      'content': 'Content Creation Agent',
      'social': 'Social Media Agent',
      'automation': 'Automation Agent',
      'customer_interaction': 'Customer Interaction Agent',
      'sales_pipeline': 'Sales Pipeline Agent',
      'journey_orchestration': 'Journey Orchestration Agent',
      'data_integration': 'Data Integration Agent',
      'workflow_management': 'Workflow Management Agent',
      'intelligence_reporting': 'Intelligence & Reporting Agent',
      'conversational_ai': 'Conversational AI Agent'
    };

    return agentNames[agentId] || `${agentId} Agent`;
  }

  /**
   * Get agent context for AI generation
   */
  private getAgentContext(agentId: string) {
    const agentContexts: Record<string, any> = {
      'crm': {
        type: 'LEAD_MANAGEMENT',
        name: 'CRM Agent',
        description: 'AI agent specialized in lead management, scoring, qualification, and customer relationship management',
        capabilities: [
          'Lead scoring and qualification',
          'Customer data analysis',
          'Buying signal detection',
          'Lead assignment and routing',
          'CRM data management',
          'Customer interaction tracking'
        ]
      },
      'content': {
        type: 'CONTENT_CREATION',
        name: 'Content Creation Agent',
        description: 'AI agent specialized in creating, optimizing, and managing content across platforms',
        capabilities: [
          'Blog post generation',
          'SEO content optimization',
          'Content calendar planning',
          'Social media content creation',
          'Content performance analysis',
          'Content strategy development'
        ]
      },
      'social': {
        type: 'SOCIAL_MEDIA',
        name: 'Social Media Agent',
        description: 'AI agent specialized in social media management, engagement, and strategy',
        capabilities: [
          'Social media post creation',
          'Content scheduling and automation',
          'Engagement analysis and optimization',
          'Social media strategy development',
          'Platform-specific content adaptation',
          'Social media performance tracking'
        ]
      },
      'automation': {
        type: 'AUTOMATION',
        name: 'Automation Agent',
        description: 'AI agent specialized in workflow automation and process optimization',
        capabilities: [
          'Workflow design and execution',
          'Process automation setup',
          'Task scheduling and management',
          'Integration management',
          'Performance monitoring',
          'Optimization recommendations'
        ]
      },
      'customer_interaction': {
        type: 'CUSTOMER_INTERACTION',
        name: 'Customer Interaction Agent',
        description: 'AI agent specialized in customer support, communication, and relationship management',
        capabilities: [
          'Customer inquiry handling',
          'Support ticket management',
          'Communication automation',
          'Customer sentiment analysis',
          'Escalation management',
          'Customer satisfaction tracking'
        ]
      },
      'sales_pipeline': {
        type: 'SALES_PIPELINE',
        name: 'Sales Pipeline Agent',
        description: 'AI agent specialized in sales process management and revenue optimization',
        capabilities: [
          'Deal tracking and management',
          'Sales pipeline optimization',
          'Revenue forecasting',
          'Sales performance analysis',
          'Opportunity identification',
          'Sales process automation'
        ]
      },
      'journey_orchestration': {
        type: 'JOURNEY_ORCHESTRATION',
        name: 'Journey Orchestration Agent',
        description: 'AI agent specialized in customer journey mapping and experience optimization',
        capabilities: [
          'Customer journey mapping',
          'Touchpoint optimization',
          'Experience personalization',
          'Journey analytics',
          'Cross-channel coordination',
          'Customer lifecycle management'
        ]
      },
      'data_integration': {
        type: 'DATA_INTEGRATION',
        name: 'Data Integration Agent',
        description: 'AI agent specialized in data synchronization and integration across platforms',
        capabilities: [
          'Data synchronization',
          'API integration management',
          'Data validation and cleaning',
          'Integration monitoring',
          'Data flow optimization',
          'System connectivity management'
        ]
      },
      'workflow_management': {
        type: 'WORKFLOW_MANAGEMENT',
        name: 'Workflow Management Agent',
        description: 'AI agent specialized in business process management and workflow optimization',
        capabilities: [
          'Workflow design and management',
          'Process optimization',
          'Task automation',
          'Resource allocation',
          'Performance monitoring',
          'Efficiency improvements'
        ]
      },
      'intelligence_reporting': {
        type: 'INTELLIGENCE_REPORTING',
        name: 'Intelligence & Reporting Agent',
        description: 'AI agent specialized in analytics, reporting, and business intelligence',
        capabilities: [
          'Analytics report generation',
          'Performance metrics analysis',
          'Trend identification',
          'Predictive insights',
          'Dashboard creation',
          'Data visualization'
        ]
      },
      'conversational_ai': {
        type: 'CONVERSATIONAL_AI',
        name: 'Conversational AI Agent',
        description: 'AI agent specialized in natural language processing and conversational interfaces',
        capabilities: [
          'Natural language understanding',
          'Intent recognition',
          'Response generation',
          'Conversation management',
          'Context awareness',
          'Multi-turn dialogue handling'
        ]
      }
    };

    return agentContexts[agentId] || {
      type: 'GENERAL',
      name: `${agentId} Agent`,
      description: 'AI agent ready to assist with various tasks',
      capabilities: ['General assistance', 'Task execution', 'Information processing']
    };
  }

  /**
   * Check for content policy violations in AI responses
   */
  private async checkContentViolations(response: string, userMessage: string, agentId: string, userId: string): Promise<{
    hasViolation: boolean;
    type?: string;
    severity?: string;
  }> {
    try {
      // Basic content filtering - in production, this would use more sophisticated AI safety models
      const prohibitedPatterns = [
        /\b(password|credit card|ssn|social security)\b/i,
        /\b(hack|exploit|malware|virus)\b/i,
        /\b(illegal|fraud|scam)\b/i
      ];

      for (const pattern of prohibitedPatterns) {
        if (pattern.test(response) || pattern.test(userMessage)) {
          return {
            hasViolation: true,
            type: 'content_policy',
            severity: 'medium'
          };
        }
      }

      // Check for potential PII exposure
      const piiPatterns = [
        /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
        /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ // Email pattern
      ];

      for (const pattern of piiPatterns) {
        if (pattern.test(response)) {
          return {
            hasViolation: true,
            type: 'pii_exposure',
            severity: 'high'
          };
        }
      }

      return { hasViolation: false };
    } catch (error) {
      console.error('Error checking content violations:', error);
      // Err on the side of caution
      return {
        hasViolation: true,
        type: 'safety_check_failed',
        severity: 'medium'
      };
    }
  }

  /**
   * Redact PII from text for logging purposes
   */
  private redactPII(text: string): string {
    try {
      let redacted = text;

      // Redact email addresses
      redacted = redacted.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');

      // Redact phone numbers
      redacted = redacted.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');

      // Redact SSN patterns
      redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]');

      // Redact credit card patterns
      redacted = redacted.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD_REDACTED]');

      return redacted;
    } catch (error) {
      console.error('Error redacting PII:', error);
      return '[REDACTION_FAILED]';
    }
  }

  /**
   * Trigger a hook event for agent system monitoring
   */
  private async triggerHook(eventName: string, payload: any): Promise<void> {
    try {
      // Log the hook event for debugging
      console.log(`🔗 Hook triggered: ${eventName}`, {
        timestamp: new Date().toISOString(),
        event: eventName,
        agentId: payload.agentId,
        userId: payload.userId
      });

      // In a production system, this would integrate with your hook system
      // For now, we'll just log the event
      // TODO: Integrate with actual hook system when available
    } catch (error) {
      console.error(`Failed to trigger hook ${eventName}:`, error);
      // Don't throw - hooks should not break the main flow
    }
  }

  /**
   * Get contextual responses for different agents
   */
  private getAgentResponses(agentId: string, message: string): string[] {
    const agentResponses: Record<string, string[]> = {
      'crm': [
        "I can help you manage your leads and customer relationships. Would you like me to score your recent leads or assign them to team members?",
        "I've analyzed your recent customer interactions. I can detect buying signals or qualify leads for you.",
        "Your CRM data looks good! I can help with lead scoring, assignment, or detecting buying signals."
      ],
      'content': [
        "I'm ready to help with your content creation needs. I can generate blog posts, create content calendars, or optimize existing content for SEO.",
        "What type of content would you like me to create? I can handle blog posts, social media content, or develop a comprehensive content strategy.",
        "I can analyze your content performance and suggest improvements, or create new content based on trending topics in your niche."
      ],
      'social': [
        "I can help manage your social media presence. Would you like me to create posts, schedule content, or analyze your engagement metrics?",
        "Your social media strategy could benefit from some optimization. I can create engaging posts or develop a comprehensive social media plan.",
        "I'm monitoring your social media performance. I can help with content creation, scheduling, or engagement analysis."
      ],
      'automation': [
        "I can help automate your business processes. Would you like me to execute existing workflows or create new automations?",
        "I've identified several processes that could be automated. I can help optimize your workflows and improve efficiency.",
        "Your automation systems are running smoothly. I can execute workflows, create new automations, or optimize existing processes."
      ]
    };

    return agentResponses[agentId] || [
      "I'm here to help! What would you like me to work on?",
      "I can assist with various tasks. Check out the recommended tasks or let me know what you need.",
      "How can I help you today? I have several capabilities that might be useful for your workflow."
    ];
  }

  /**
   * Get agent suggestions based on workspace state
   */
  public async getAgentSuggestions(
    db: Firestore,
    userId: string
  ): Promise<Array<{ agentId: string; taskId: string; reason: string; priority: number }>> {
    // This could be enhanced with actual workspace analysis
    // For now, return some intelligent suggestions
    return [
      {
        agentId: 'crm',
        taskId: 'score_leads',
        reason: 'You have new leads that need scoring',
        priority: 8
      },
      {
        agentId: 'content',
        taskId: 'generate_blog_post',
        reason: 'It\'s been a while since your last blog post',
        priority: 6
      },
      {
        agentId: 'social',
        taskId: 'create_social_posts',
        reason: 'Your social media queue is running low',
        priority: 7
      }
    ];
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this.activityListeners.forEach(unsubscribe => unsubscribe());
    this.activityListeners.clear();
  }
}