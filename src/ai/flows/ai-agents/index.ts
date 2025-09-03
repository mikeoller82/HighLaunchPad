// AI Agent Genkit Flows
// This file exports all the AI agent flows for easy import and usage

export { leadScoringFlow } from './lead-scoring';
export { generateContent } from './content-creation';
export { generateSocialMedia } from './social-media';
export { automationFlow } from './automation';
export { customerInteractionFlow } from './customer-interaction';
export { salesPipelineFlow } from './sales-pipeline';
export { intelligenceReportingFlow } from './intelligence-reporting';
export { conversationalAIFlow } from './conversational-ai';
export { journeyOrchestrationFlow } from './journey-orchestration';
export { workflowManagementFlow } from './workflow-management';
export { dataIntegrationFlow } from './data-integration';

// Type exports for better TypeScript support
// Note: Individual flows export their own input/output types via z.infer<typeof Schema>

// Re-export common schemas and types that might be needed
export * from './lead-scoring';
export * from './content-creation';
export * from './social-media';
export * from './automation';
export * from './customer-interaction';
export * from './sales-pipeline';
export * from './intelligence-reporting';
export * from './conversational-ai';
export * from './journey-orchestration';
export * from './workflow-management';
export * from './data-integration';