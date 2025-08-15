// Core AI Agent Framework Types

// Core AI Agent Interface
export interface AIAgent {
  readonly id: string;
  readonly type: AgentType;
  readonly capabilities: AgentCapability[];
  status: AgentStatus;
  context: AgentContext;
  configuration: AgentConfiguration;

  // Core lifecycle methods
  perceive(events: Event[]): Promise<void>;
  decide(context: DecisionContext): Promise<Action[]>;
  execute(actions: Action[]): Promise<ExecutionResult[]>;
  learn(feedback: Feedback[]): Promise<void>;

  // Management methods
  start(): Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  reset(): Promise<void>;

  // Status and monitoring
  getStatus(): AgentStatus;
  getMetrics(): AgentMetrics;
  getContext(): AgentContext;
  updateConfiguration(config: Partial<AgentConfiguration>): Promise<void>;
}

export enum AgentType {
  LEAD_MANAGEMENT = 'lead_management',
  CUSTOMER_INTERACTION = 'customer_interaction',
  SALES_PIPELINE = 'sales_pipeline',
  JOURNEY_ORCHESTRATION = 'journey_orchestration',
  DATA_INTEGRATION = 'data_integration',
  WORKFLOW_MANAGEMENT = 'workflow_management',
  INTELLIGENCE_REPORTING = 'intelligence_reporting',
  CONVERSATIONAL_AI = 'conversational_ai',
  CONTENT_CREATION = 'content_creation',
  SOCIAL_MEDIA = 'social_media',
  AUTOMATION = 'automation'
}

export enum AgentStatus {
  IDLE = 'idle',
  PERCEIVING = 'perceiving',
  DECIDING = 'deciding',
  ACTING = 'acting',
  LEARNING = 'learning',
  ERROR = 'error',
  DISABLED = 'disabled'
}

export enum EventType {
  CUSTOMER_INTERACTION = 'customer_interaction',
  LEAD_CAPTURED = 'lead_captured',
  DEAL_UPDATED = 'deal_updated',
  WORKFLOW_TRIGGERED = 'workflow_triggered',
  DATA_UPDATED = 'data_updated',
  SYSTEM_EVENT = 'system_event',
  AFFILIATE_CLICK = 'affiliate_click',
  AFFILIATE_CONVERSION = 'affiliate_conversion',
  CONTENT_REQUEST = 'content_request',
  SOCIAL_POST_REQUEST = 'social_post_request',
  WORKFLOW_TRIGGER = 'workflow_trigger'
}

export enum ActionType {
  SEND_MESSAGE = 'send_message',
  CREATE_TASK = 'create_task',
  UPDATE_RECORD = 'update_record',
  TRIGGER_WORKFLOW = 'trigger_workflow',
  GENERATE_INSIGHT = 'generate_insight',
  ESCALATE = 'escalate',
  SCHEDULE_FOLLOWUP = 'schedule_followup',
  CREATE_CONTENT = 'create_content',
  SCHEDULE_POST = 'schedule_post',
  EXECUTE_WORKFLOW = 'execute_workflow'
}

export interface Event {
  id: string;
  type: EventType;
  timestamp: Date;
  source: string;
  data: Record<string, any>;
  priority: number;
  customerId?: string;
  leadId?: string;
  dealId?: string;
}

export interface Action {
  id: string;
  type: ActionType;
  agentId: string;
  timestamp: Date;
  parameters: Record<string, any>;
  priority: number;
  dependencies?: string[];
  expectedOutcome?: string;
}

export interface ExecutionResult {
  actionId: string;
  success: boolean;
  result?: any;
  error?: string;
  timestamp: Date;
  metrics?: Record<string, number>;
}

export interface Feedback {
  actionId: string;
  outcome: 'success' | 'failure' | 'partial';
  score?: number;
  details?: string;
  timestamp: Date;
  source: 'system' | 'user' | 'customer';
}

export interface AgentContext {
  sessionId: string;
  customerId?: string;
  leadId?: string;
  dealId?: string;
  conversationHistory: any[];
  availableActions: ActionType[];
  businessRules: Record<string, any>;
  performanceMetrics: AgentMetrics;
  lastUpdated: Date;
}

export interface AgentMetrics {
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  averageResponseTime: number;
  lastActionTime?: Date;
  learningScore: number;
}

export interface DecisionContext {
  events: Event[];
  currentContext: AgentContext;
  availableActions: ActionType[];
  businessConstraints: Record<string, any>;
  historicalData?: any[];
}

export interface AgentCapability {
  name: string;
  description: string;
  requiredPermissions: string[];
  supportedEventTypes: EventType[];
  supportedActionTypes: ActionType[];
}

export interface AgentConfiguration {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  enabled: boolean;
  priority: number;
  maxConcurrentActions: number;
  learningEnabled: boolean;
  configuration: Record<string, any>;
}