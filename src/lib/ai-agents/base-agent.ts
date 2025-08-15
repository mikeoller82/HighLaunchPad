import {
  AIAgent,
  AgentType,
  AgentStatus,
  Event,
  Action,
  ExecutionResult,
  Feedback,
  AgentContext,
  AgentMetrics,
  DecisionContext,
  AgentConfiguration,
  AgentCapability
} from './types';

// Base Agent Implementation
export abstract class BaseAgent implements AIAgent {
  public readonly id: string;
  public readonly type: AgentType;
  public readonly capabilities: AgentCapability[];
  public status: AgentStatus = AgentStatus.IDLE;
  public context: AgentContext;
  public configuration: AgentConfiguration;

  private _metrics: AgentMetrics;
  private _eventQueue: Event[] = [];
  private _actionQueue: Action[] = [];
  private _isProcessing: boolean = false;

  constructor(configuration: AgentConfiguration) {
    this.id = configuration.id;
    this.type = configuration.type;
    this.capabilities = configuration.capabilities;
    this.configuration = configuration;
    
    this.context = {
      sessionId: this.generateSessionId(),
      conversationHistory: [],
      availableActions: this.capabilities.flatMap(cap => cap.supportedActionTypes),
      businessRules: {},
      performanceMetrics: this.initializeMetrics(),
      lastUpdated: new Date()
    };

    this._metrics = this.initializeMetrics();
  }

  // Abstract methods to be implemented by specific agents
  protected abstract processEvents(events: Event[]): Promise<void>;
  protected abstract makeDecisions(context: DecisionContext): Promise<Action[]>;
  protected abstract executeActions(actions: Action[]): Promise<ExecutionResult[]>;
  protected abstract processFeedback(feedback: Feedback[]): Promise<void>;

  // Core lifecycle implementation
  public async perceive(events: Event[]): Promise<void> {
    try {
      this.status = AgentStatus.PERCEIVING;
      this.updateLastActionTime();
      
      // Filter events based on agent capabilities
      const relevantEvents = events.filter(event => 
        this.capabilities.some(cap => cap.supportedEventTypes.includes(event.type))
      );

      if (relevantEvents.length > 0) {
        this._eventQueue.push(...relevantEvents);
        await this.processEvents(relevantEvents);
      }

      this.status = AgentStatus.IDLE;
    } catch (error) {
      this.handleError('perceive', error);
    }
  }

  public async decide(context: DecisionContext): Promise<Action[]> {
    try {
      this.status = AgentStatus.DECIDING;
      this.updateLastActionTime();
      
      const decisions = await this.makeDecisions(context);
      
      // Validate decisions against capabilities
      const validDecisions = decisions.filter(action =>
        this.capabilities.some(cap => cap.supportedActionTypes.includes(action.type))
      );

      this._actionQueue.push(...validDecisions);
      this.status = AgentStatus.IDLE;
      
      return validDecisions;
    } catch (error) {
      this.handleError('decide', error);
      return [];
    }
  }

  public async execute(actions: Action[]): Promise<ExecutionResult[]> {
    try {
      this.status = AgentStatus.ACTING;
      this.updateLastActionTime();
      
      const results = await this.executeActions(actions);
      
      // Update metrics
      results.forEach(result => {
        this._metrics.totalActions++;
        if (result.success) {
          this._metrics.successfulActions++;
        } else {
          this._metrics.failedActions++;
        }
      });

      this.updateAverageResponseTime();
      this.status = AgentStatus.IDLE;
      
      return results;
    } catch (error) {
      this.handleError('execute', error);
      return [];
    }
  }

  public async learn(feedback: Feedback[]): Promise<void> {
    try {
      if (!this.configuration.learningEnabled) {
        return;
      }

      this.status = AgentStatus.LEARNING;
      this.updateLastActionTime();
      
      await this.processFeedback(feedback);
      
      // Update learning score based on feedback
      const avgScore = feedback.reduce((sum, fb) => sum + (fb.score || 0), 0) / feedback.length;
      this._metrics.learningScore = (this._metrics.learningScore + avgScore) / 2;
      
      this.status = AgentStatus.IDLE;
    } catch (error) {
      this.handleError('learn', error);
    }
  }

  // Management methods
  public async start(): Promise<void> {
    if (this.status === AgentStatus.DISABLED) {
      this.status = AgentStatus.IDLE;
      console.log(`Agent ${this.id} started`);
    }
  }

  public async stop(): Promise<void> {
    this.status = AgentStatus.DISABLED;
    this._eventQueue = [];
    this._actionQueue = [];
    console.log(`Agent ${this.id} stopped`);
  }

  public async pause(): Promise<void> {
    if (this.status !== AgentStatus.DISABLED) {
      this.status = AgentStatus.IDLE;
      console.log(`Agent ${this.id} paused`);
    }
  }

  public async resume(): Promise<void> {
    if (this.status === AgentStatus.IDLE) {
      console.log(`Agent ${this.id} resumed`);
    }
  }

  public async reset(): Promise<void> {
    this._eventQueue = [];
    this._actionQueue = [];
    this._metrics = this.initializeMetrics();
    this.context.performanceMetrics = this._metrics;
    this.context.conversationHistory = [];
    this.context.lastUpdated = new Date();
    this.status = AgentStatus.IDLE;
    console.log(`Agent ${this.id} reset`);
  }

  // Status and monitoring
  public getStatus(): AgentStatus {
    return this.status;
  }

  public getMetrics(): AgentMetrics {
    return { ...this._metrics };
  }

  public getContext(): AgentContext {
    return { ...this.context };
  }

  public async updateConfiguration(config: Partial<AgentConfiguration>): Promise<void> {
    this.configuration = { ...this.configuration, ...config };
    console.log(`Agent ${this.id} configuration updated`);
  }

  // Helper methods
  private generateSessionId(): string {
    return `session_${this.id}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private initializeMetrics(): AgentMetrics {
    return {
      totalActions: 0,
      successfulActions: 0,
      failedActions: 0,
      averageResponseTime: 0,
      learningScore: 0.5
    };
  }

  private updateLastActionTime(): void {
    this._metrics.lastActionTime = new Date();
    this.context.lastUpdated = new Date();
  }

  private updateAverageResponseTime(): void {
    // Simple moving average calculation
    const currentTime = Date.now();
    const lastActionTime = this._metrics.lastActionTime?.getTime() || currentTime;
    const responseTime = currentTime - lastActionTime;
    
    if (this._metrics.averageResponseTime === 0) {
      this._metrics.averageResponseTime = responseTime;
    } else {
      this._metrics.averageResponseTime = (this._metrics.averageResponseTime + responseTime) / 2;
    }
  }

  private handleError(operation: string, error: any): void {
    this.status = AgentStatus.ERROR;
    this._metrics.failedActions++;
    console.error(`Agent ${this.id} error in ${operation}:`, error);
    
    // Reset to idle after error handling
    setTimeout(() => {
      if (this.status === AgentStatus.ERROR) {
        this.status = AgentStatus.IDLE;
      }
    }, 1000);
  }

  // Queue management
  protected getEventQueue(): Event[] {
    return [...this._eventQueue];
  }

  protected clearEventQueue(): void {
    this._eventQueue = [];
  }

  protected getActionQueue(): Action[] {
    return [...this._actionQueue];
  }

  protected clearActionQueue(): void {
    this._actionQueue = [];
  }
}