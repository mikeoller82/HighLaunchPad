// AI Agent Framework - Main Export File

// Core types and interfaces
export * from './types';

// Base agent implementation
export * from './base-agent';

// Agent registry for management
export * from './agent-registry';

// Orchestration system
export * from './orchestrator';

// Re-export commonly used types for convenience
export type {
  AIAgent,
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

// Export enums as values (not types)
export {
  AgentType,
  AgentStatus,
  EventType,
  ActionType
} from './types';

export type {
  AgentRegistryEntry
} from './agent-registry';

export type {
  OrchestrationRule,
  OrchestrationResult
} from './orchestrator';

// Main framework classes
export { BaseAgent } from './base-agent';
export { AgentRegistry } from './agent-registry';
export { AgentOrchestrator } from './orchestrator';

// Agent management services
export { AgentInitializer } from './agent-initializer';
export { AgentSyncService } from './agent-sync-service';

// Example implementations
export { LeadManagementAgent, createLeadManagementAgent, demonstrateFramework } from './example';

// Content Creation Agent
export { ContentCreationAgent, contentCreationAgent } from './content-creation-agent';

// Enhanced Social Media Agent
export { EnhancedSocialMediaAgent, enhancedSocialMediaAgent } from './enhanced-social-media-agent';

// All Agent Implementations
export { AutomationAgent, createAutomationAgent } from './automation-agent';
export { ConversationalAIAgent, createConversationalAIAgent } from './conversational-ai-agent';
export { CustomerInteractionAgent, createCustomerInteractionAgent } from './customer-interaction-agent';
export { DataIntegrationAgent, createDataIntegrationAgent } from './data-integration-agent';
export { IntelligenceReportingAgent, createIntelligenceReportingAgent } from './intelligence-reporting-agent';
export { JourneyOrchestrationAgent, createJourneyOrchestrationAgent } from './journey-orchestration-agent';
export { SalesPipelineAgent, createSalesPipelineAgent } from './sales-pipeline-agent';
export { WorkflowManagementAgent, createWorkflowManagementAgent } from './workflow-management-agent';

// Unified Agent Service
export { UnifiedAgentService } from './unified-agent-service';
export { TaskExecutionService } from './task-execution-service';