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

export class WorkflowManagementAgent extends BaseAgent {
  protected async processEvents(events: Event[]): Promise<void> {
    console.log(`WorkflowManagementAgent ${this.id} processing ${events.length} events`);
    
    for (const event of events) {
      if (event.type === EventType.WORKFLOW_TRIGGERED) {
        this.context.conversationHistory.push({
          type: 'workflow_execution',
          timestamp: event.timestamp,
          data: event.data
        });
      }
    }
  }

  protected async makeDecisions(context: DecisionContext): Promise<Action[]> {
    const actions: Action[] = [];
    
    for (const event of context.events) {
      if (event.type === EventType.WORKFLOW_TRIGGERED) {
        const workflowActions = await this.planWorkflowExecution(event);
        actions.push(...workflowActions);
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
          case ActionType.EXECUTE_WORKFLOW:
            result = await this.executeWorkflow(action.parameters);
            break;
          case ActionType.CREATE_TASK:
            result = await this.createTask(action.parameters);
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
    console.log(`WorkflowManagementAgent ${this.id} processing ${feedback.length} feedback items`);
  }

  private async planWorkflowExecution(event: Event): Promise<Action[]> {
    const actions: Action[] = [];
    
    // Execute the workflow
    actions.push({
      id: `execute_workflow_${event.id}_${Date.now()}`,
      type: ActionType.EXECUTE_WORKFLOW,
      agentId: this.id,
      timestamp: new Date(),
      parameters: {
        workflowId: event.data.workflowId,
        workflowType: event.data.workflowType,
        triggerData: event.data
      },
      priority: 7
    });

    // Create follow-up tasks if needed
    if (event.data.createTasks) {
      actions.push({
        id: `create_tasks_${event.id}_${Date.now()}`,
        type: ActionType.CREATE_TASK,
        agentId: this.id,
        timestamp: new Date(),
        parameters: {
          workflowId: event.data.workflowId,
          taskType: 'workflow_followup',
          assignedTo: event.data.assignedTo || 'system'
        },
        priority: 5
      });
    }

    return actions;
  }

  private async executeWorkflow(parameters: any): Promise<any> {
    console.log(`Executing workflow ${parameters.workflowId} of type ${parameters.workflowType}`);
    
    // Get AI-optimized workflow steps
    const steps = await this.getAIOptimizedWorkflowSteps(parameters.workflowType, parameters.triggerData);
    const executedSteps = [];
    
    for (const step of steps) {
      executedSteps.push({
        stepId: step.id,
        stepName: step.name,
        status: 'completed',
        executedAt: new Date(),
        aiOptimized: step.aiOptimized || false,
        description: step.description
      });
    }

    return {
      workflowId: parameters.workflowId,
      workflowType: parameters.workflowType,
      status: 'completed',
      executedSteps,
      duration: Math.floor(Math.random() * 5000) + 1000, // 1-6 seconds
      timestamp: new Date(),
      aiOptimizations: steps.filter(s => s.aiOptimized).length
    };
  }

  private async createTask(parameters: any): Promise<any> {
    console.log(`Creating task for workflow ${parameters.workflowId}`);
    return {
      taskId: `task_${Date.now()}`,
      workflowId: parameters.workflowId,
      taskType: parameters.taskType,
      assignedTo: parameters.assignedTo,
      status: 'pending',
      timestamp: new Date()
    };
  }

  private async getAIOptimizedWorkflowSteps(workflowType: string, triggerData: any): Promise<Array<{ id: string; name: string; description: string; aiOptimized: boolean }>> {
    try {
      // Get API key from environment
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('No API key available, using default workflow steps');
        return this.getDefaultWorkflowSteps(workflowType);
      }

      // Create AI instance
      const userAI = genkit({
        plugins: [
          googleAI({ apiKey }),
        ],
      });

      const prompt = this.buildWorkflowOptimizationPrompt(workflowType, triggerData);

      const response = await userAI.generate({
        model: googleAI.model('gemini-2.0-flash-exp'),
        prompt: prompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      });

      const aiResponse = response.text;
      const optimizedSteps = this.parseAIWorkflowSteps(aiResponse, workflowType);
      
      return optimizedSteps.length > 0 ? optimizedSteps : this.getDefaultWorkflowSteps(workflowType);

    } catch (error) {
      console.error('AI workflow optimization failed:', error);
      return this.getDefaultWorkflowSteps(workflowType);
    }
  }

  private buildWorkflowOptimizationPrompt(workflowType: string, triggerData: any): string {
    const currentTime = new Date().toLocaleString();
    
    return `You are a workflow automation expert with 15+ years of experience in business process optimization, automation design, and efficiency improvement. You specialize in creating optimized, AI-enhanced workflows that maximize efficiency and outcomes.

## Workflow Optimization Context
**Current Time:** ${currentTime}
**Workflow Type:** ${workflowType}
**Trigger Data:** ${JSON.stringify(triggerData, null, 2)}

## Your Mission
Analyze the workflow type and trigger data to create an optimized sequence of 4-8 specific, actionable workflow steps that:
1. Maximize efficiency and automation
2. Minimize manual intervention
3. Ensure high success rates
4. Include intelligent decision points
5. Leverage AI capabilities where appropriate

## Workflow Type Guidelines

### ${workflowType.toUpperCase()} Optimization:
${this.getWorkflowTypeGuidelines(workflowType)}

## Optimization Principles
- **Automation First**: Prioritize automated steps over manual ones
- **Intelligent Routing**: Include conditional logic and smart routing
- **Error Handling**: Build in error detection and recovery steps
- **Performance Monitoring**: Include checkpoints and validation steps
- **User Experience**: Ensure smooth, seamless user experience
- **Scalability**: Design steps that work at scale

## Response Format
Provide exactly 4-8 optimized workflow steps in this format:

**STEP 1: [Step Name]**
Description: [Detailed description of what this step does and why it's optimized]

**STEP 2: [Step Name]**
Description: [Detailed description of what this step does and why it's optimized]

[Continue for all steps...]

## Quality Standards
Each step must be:
- **Specific**: Clear what action is taken
- **Measurable**: Defined success criteria
- **Actionable**: Can be automated or executed systematically
- **Relevant**: Directly contributes to workflow success
- **Time-bound**: Has clear timing or sequence

Generate optimized workflow steps that leverage AI capabilities and modern automation best practices.`;
  }

  private getWorkflowTypeGuidelines(workflowType: string): string {
    switch (workflowType) {
      case 'lead_nurturing':
        return `- Focus on progressive value delivery and relationship building
- Include personalization and segmentation logic
- Implement engagement tracking and optimization
- Build in lead scoring and qualification checkpoints
- Design multi-channel touchpoint sequences
- Include automated follow-up and escalation paths`;

      case 'customer_onboarding':
        return `- Prioritize quick wins and early value realization
- Include setup validation and success checkpoints
- Design progressive feature introduction
- Build in support and guidance mechanisms
- Include success metrics tracking and optimization
- Create feedback loops for continuous improvement`;

      case 'deal_progression':
        return `- Focus on removing friction and accelerating decisions
- Include stakeholder engagement and buy-in steps
- Build in competitive differentiation and value reinforcement
- Design risk mitigation and objection handling
- Include pipeline health monitoring and alerts
- Create automated follow-up and escalation triggers`;

      case 'workflow_followup':
        return `- Focus on ensuring completion and quality
- Include validation and verification steps
- Build in performance measurement and reporting
- Design continuous improvement and optimization
- Include stakeholder communication and updates
- Create documentation and knowledge capture`;

      default:
        return `- Focus on efficiency and automation opportunities
- Include error handling and recovery mechanisms  
- Build in monitoring and performance tracking
- Design scalable and repeatable processes
- Include validation and quality checkpoints
- Create clear success criteria and outcomes`;
    }
  }

  private parseAIWorkflowSteps(response: string, workflowType: string): Array<{ id: string; name: string; description: string; aiOptimized: boolean }> {
    const steps: Array<{ id: string; name: string; description: string; aiOptimized: boolean }> = [];
    
    const lines = response.split('\n').filter(line => line.trim());
    let currentStep: any = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Look for step headers
      if (trimmedLine.match(/^\*\*STEP \d+:/)) {
        // Save previous step if exists
        if (currentStep) {
          steps.push(currentStep);
        }
        
        // Start new step
        const stepMatch = trimmedLine.match(/^\*\*STEP \d+:\s*(.+?)\*\*$/);
        if (stepMatch) {
          currentStep = {
            id: `ai_step_${steps.length + 1}`,
            name: stepMatch[1].trim(),
            description: '',
            aiOptimized: true
          };
        }
      } else if (trimmedLine.startsWith('Description:') && currentStep) {
        currentStep.description = trimmedLine.replace('Description:', '').trim();
      } else if (currentStep && trimmedLine.length > 10 && !trimmedLine.includes('**')) {
        // Add to description if it's content
        currentStep.description += (currentStep.description ? ' ' : '') + trimmedLine;
      }
    }
    
    // Add final step
    if (currentStep) {
      steps.push(currentStep);
    }
    
    // Ensure we have at least some steps
    return steps.length > 0 ? steps.slice(0, 8) : this.getDefaultWorkflowSteps(workflowType);
  }

  private getDefaultWorkflowSteps(workflowType: string): Array<{ id: string; name: string; description: string; aiOptimized: boolean }> {
    const workflowSteps = {
      'lead_nurturing': [
        { id: 'step1', name: 'Send welcome email', description: 'Send personalized welcome email to new lead', aiOptimized: false },
        { id: 'step2', name: 'Add to nurture sequence', description: 'Add lead to appropriate nurturing sequence', aiOptimized: false },
        { id: 'step3', name: 'Schedule follow-up', description: 'Schedule automated follow-up based on engagement', aiOptimized: false }
      ],
      'customer_onboarding': [
        { id: 'step1', name: 'Send onboarding materials', description: 'Send welcome package and setup instructions', aiOptimized: false },
        { id: 'step2', name: 'Schedule setup call', description: 'Schedule onboarding call with customer success', aiOptimized: false },
        { id: 'step3', name: 'Create support ticket', description: 'Create support ticket for technical setup', aiOptimized: false }
      ],
      'deal_progression': [
        { id: 'step1', name: 'Update deal stage', description: 'Update CRM with new deal stage information', aiOptimized: false },
        { id: 'step2', name: 'Notify sales team', description: 'Send notification to relevant sales team members', aiOptimized: false },
        { id: 'step3', name: 'Schedule next action', description: 'Schedule appropriate next action based on stage', aiOptimized: false }
      ]
    };

    return workflowSteps[workflowType as keyof typeof workflowSteps] || [
      { id: 'step1', name: 'Execute default workflow', description: 'Execute standard workflow process', aiOptimized: false }
    ];
  }
}

export function createWorkflowManagementAgent(id: string): WorkflowManagementAgent {
  const config: AgentConfiguration = {
    id,
    type: AgentType.WORKFLOW_MANAGEMENT,
    name: `Workflow Management Agent ${id}`,
    description: 'Automates business processes and workflows',
    capabilities: [
      {
        name: 'Workflow Automation',
        description: 'Executes and manages automated workflows',
        requiredPermissions: ['execute_workflows', 'create_tasks', 'manage_processes'],
        supportedEventTypes: [EventType.WORKFLOW_TRIGGERED],
        supportedActionTypes: [ActionType.EXECUTE_WORKFLOW, ActionType.CREATE_TASK]
      }
    ],
    enabled: true,
    priority: 6,
    maxConcurrentActions: 10,
    learningEnabled: true,
    configuration: {
      parallelExecution: true,
      errorHandling: 'retry_with_backoff',
      maxRetries: 3
    }
  };

  return new WorkflowManagementAgent(config);
}