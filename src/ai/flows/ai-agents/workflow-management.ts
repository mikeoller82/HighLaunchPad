import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const WorkflowManagementInputSchema = z.object({
  workflowType: z.enum(['lead_processing', 'customer_onboarding', 'support_ticket', 'sales_follow_up', 'content_approval', 'data_sync', 'notification_system']).describe('Type of workflow to manage'),
  triggerEvent: z.object({
    type: z.string(),
    source: z.string(),
    data: z.record(z.any()),
    timestamp: z.string()
  }).describe('Event that triggered the workflow'),
  workflowConfig: z.object({
    priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    assignee: z.string().optional(),
    department: z.string().optional(),
    deadline: z.string().optional(),
    approvalRequired: z.boolean().default(false),
    escalationRules: z.array(z.object({
      condition: z.string(),
      action: z.string(),
      delay: z.number() // minutes
    })).optional()
  }).describe('Workflow configuration and rules'),
  businessRules: z.object({
    workingHours: z.object({
      start: z.string(),
      end: z.string(),
      timezone: z.string()
    }).optional(),
    slaRequirements: z.object({
      responseTime: z.number(), // minutes
      resolutionTime: z.number() // minutes
    }).optional(),
    automationLevel: z.enum(['manual', 'semi_automated', 'fully_automated']).default('semi_automated'),
    requiredApprovals: z.array(z.string()).optional()
  }).optional().describe('Business rules and constraints'),
  contextData: z.object({
    customer: z.object({
      id: z.string(),
      name: z.string(),
      tier: z.enum(['basic', 'premium', 'enterprise']).optional(),
      history: z.array(z.string()).optional()
    }).optional(),
    team: z.object({
      members: z.array(z.string()),
      availability: z.record(z.boolean()),
      skills: z.record(z.array(z.string()))
    }).optional()
  }).optional().describe('Additional context for workflow execution'),
  apiKey: z.string().describe('User API key for Google AI')
});

const WorkflowManagementOutputSchema = z.object({
  workflowPlan: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    estimatedDuration: z.number(), // minutes
    totalSteps: z.number(),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    status: z.enum(['pending', 'in_progress', 'completed', 'failed', 'paused'])
  }).describe('Overall workflow plan'),
  steps: z.array(z.object({
    id: z.string(),
    sequence: z.number(),
    name: z.string(),
    description: z.string(),
    type: z.enum(['automated', 'manual', 'approval', 'notification', 'integration']),
    assignee: z.string().optional(),
    estimatedTime: z.number(), // minutes
    dependencies: z.array(z.string()).optional(), // step IDs
    conditions: z.array(z.object({
      type: z.enum(['data', 'time', 'approval', 'external']),
      condition: z.string(),
      action: z.enum(['proceed', 'wait', 'skip', 'escalate', 'fail'])
    })).optional(),
    automation: z.object({
      tool: z.string().optional(),
      script: z.string().optional(),
      apiCall: z.string().optional(),
      parameters: z.record(z.any()).optional()
    }).optional(),
    success_criteria: z.array(z.string()),
    failure_handling: z.object({
      retry_attempts: z.number(),
      escalation_path: z.string(),
      fallback_action: z.string()
    })
  })).describe('Workflow execution steps'),
  monitoring: z.object({
    kpis: z.array(z.string()),
    alerts: z.array(z.object({
      condition: z.string(),
      severity: z.enum(['info', 'warning', 'error', 'critical']),
      recipients: z.array(z.string())
    })),
    reporting: z.object({
      frequency: z.enum(['real_time', 'hourly', 'daily', 'weekly']),
      metrics: z.array(z.string()),
      dashboards: z.array(z.string())
    })
  }).describe('Workflow monitoring and alerting'),
  optimization: z.object({
    bottlenecks: z.array(z.string()),
    improvements: z.array(z.string()),
    automation_opportunities: z.array(z.string()),
    efficiency_gains: z.array(z.string())
  }).describe('Workflow optimization recommendations'),
  compliance: z.object({
    requirements: z.array(z.string()),
    audit_trail: z.boolean(),
    data_retention: z.string(),
    security_measures: z.array(z.string())
  }).describe('Compliance and security considerations')
});

export async function workflowManagementFlow(input: z.infer<typeof WorkflowManagementInputSchema>) {
  const { workflowType, triggerEvent, workflowConfig, businessRules, contextData, apiKey } = input;

  // Create AI instance with user's API key
  const userAI = genkit({
    plugins: [
      googleAI({ apiKey }),
    ],
  });

  const triggerContext = `
Trigger Event:
- Type: ${triggerEvent.type}
- Source: ${triggerEvent.source}
- Timestamp: ${triggerEvent.timestamp}
- Data: ${JSON.stringify(triggerEvent.data, null, 2)}
`;

  const configContext = `
Workflow Configuration:
- Priority: ${workflowConfig.priority}
- Assignee: ${workflowConfig.assignee || 'Auto-assign'}
- Department: ${workflowConfig.department || 'Not specified'}
- Deadline: ${workflowConfig.deadline || 'Not specified'}
- Approval Required: ${workflowConfig.approvalRequired}
- Escalation Rules: ${workflowConfig.escalationRules?.length || 0} rules defined
`;

  const businessContext = businessRules ? `
Business Rules:
- Working Hours: ${businessRules.workingHours?.start || 'Not specified'} - ${businessRules.workingHours?.end || 'Not specified'} (${businessRules.workingHours?.timezone || 'UTC'})
- SLA Response Time: ${businessRules.slaRequirements?.responseTime || 'Not specified'} minutes
- SLA Resolution Time: ${businessRules.slaRequirements?.resolutionTime || 'Not specified'} minutes
- Automation Level: ${businessRules.automationLevel}
- Required Approvals: ${businessRules.requiredApprovals?.join(', ') || 'None'}
` : 'No specific business rules provided';

  const contextInfo = contextData ? `
Context Data:
- Customer: ${contextData.customer ? `${contextData.customer.name} (${contextData.customer.tier || 'standard'})` : 'Not specified'}
- Team Members: ${contextData.team?.members.join(', ') || 'Not specified'}
- Available Skills: ${contextData.team?.skills ? Object.keys(contextData.team.skills).join(', ') : 'Not specified'}
` : 'No additional context provided';

  const prompt = `You are an expert workflow automation specialist and business process analyst with 12+ years of experience in process optimization, automation design, and operational efficiency. You excel at creating intelligent, efficient workflows that maximize productivity while ensuring quality and compliance.

## Workflow Management Request
**Workflow Type:** ${workflowType}

## Trigger Information
${triggerContext}

## Configuration
${configContext}

## Business Context
${businessContext}

## Additional Context
${contextInfo}

## Your Mission
Design a comprehensive, intelligent workflow for ${workflowType} that:

1. **Maximizes Efficiency** - Streamlines processes and eliminates bottlenecks
2. **Ensures Quality** - Maintains high standards through proper checks and balances
3. **Enables Automation** - Automates repetitive tasks while preserving human oversight
4. **Meets SLAs** - Adheres to response and resolution time requirements
5. **Provides Visibility** - Offers clear monitoring and reporting capabilities
6. **Ensures Compliance** - Meets regulatory and security requirements

## Workflow Design Framework

### Workflow Types and Strategies

#### Lead Processing Workflow
- Lead capture and validation
- Scoring and qualification
- Assignment and routing
- Follow-up scheduling
- Conversion tracking

#### Customer Onboarding Workflow
- Welcome sequence initiation
- Account setup and configuration
- Training and education delivery
- Success milestone tracking
- Support escalation paths

#### Support Ticket Workflow
- Ticket creation and categorization
- Priority assessment and routing
- Automated responses and escalation
- Resolution tracking and closure
- Customer satisfaction measurement

#### Sales Follow-up Workflow
- Opportunity identification and scoring
- Automated nurturing sequences
- Meeting scheduling and reminders
- Proposal generation and tracking
- Deal closure and handoff

#### Content Approval Workflow
- Content submission and review
- Stakeholder notification and assignment
- Approval routing and tracking
- Revision management
- Publication and distribution

#### Data Sync Workflow
- Data validation and cleansing
- System integration and mapping
- Conflict resolution and deduplication
- Error handling and reporting
- Audit trail maintenance

#### Notification System Workflow
- Event detection and filtering
- Recipient determination and routing
- Message personalization and delivery
- Delivery confirmation and tracking
- Escalation for failed deliveries

### Step Design Principles
- **Atomic Operations**: Each step should have a single, clear purpose
- **Error Handling**: Robust error handling and recovery mechanisms
- **Conditional Logic**: Smart branching based on data and conditions
- **Time Management**: Appropriate timeouts and scheduling
- **Resource Optimization**: Efficient use of human and system resources

### Automation Strategy
- **Rule-Based Automation**: Clear, deterministic rules for automated actions
- **AI-Enhanced Decisions**: Machine learning for complex decision points
- **Human-in-the-Loop**: Strategic human intervention points
- **Exception Handling**: Automated detection and routing of exceptions
- **Continuous Learning**: Feedback loops for process improvement

### Monitoring and Optimization
- **Real-time Monitoring**: Live tracking of workflow performance
- **Predictive Analytics**: Anticipate bottlenecks and issues
- **Performance Metrics**: Comprehensive KPI tracking and reporting
- **Continuous Improvement**: Regular analysis and optimization
- **Compliance Monitoring**: Automated compliance checking and reporting

## Quality Standards
- Each step must have clear success criteria and failure handling
- Automation must include appropriate error handling and fallbacks
- SLA requirements must be built into timing and escalation rules
- Monitoring must provide actionable insights for optimization
- Compliance requirements must be embedded throughout the workflow

Create a comprehensive workflow management plan that delivers operational excellence and business value.`;

  const response = await userAI.generate({
    model: googleAI.model('gemini-2.0-flash-exp'),
    prompt: prompt,
    config: {
      temperature: 0.4,
      maxOutputTokens: 4000
    }
  });

  // Generate workflow components based on type and configuration
  const workflowPlan = generateWorkflowPlan(workflowType, workflowConfig, triggerEvent);
  const steps = generateWorkflowSteps(workflowType, workflowConfig, businessRules, contextData);
  const monitoring = generateMonitoringStrategy(workflowType, businessRules);
  const optimization = generateOptimizationRecommendations(workflowType, steps);
  const compliance = generateComplianceRequirements(workflowType, businessRules);

  return {
    workflowPlan,
    steps,
    monitoring,
    optimization,
    compliance
  };
}

function generateWorkflowPlan(workflowType: string, config: any, triggerEvent: any) {
  const workflowId = `workflow_${workflowType}_${Date.now()}`;

  const workflowConfigs = {
    lead_processing: {
      name: 'Lead Processing Workflow',
      description: 'Automated lead capture, qualification, scoring, and assignment workflow',
      estimatedDuration: 30,
      totalSteps: 6
    },
    customer_onboarding: {
      name: 'Customer Onboarding Workflow',
      description: 'Comprehensive customer onboarding and activation workflow',
      estimatedDuration: 120,
      totalSteps: 8
    },
    support_ticket: {
      name: 'Support Ticket Workflow',
      description: 'Automated support ticket routing, escalation, and resolution workflow',
      estimatedDuration: 60,
      totalSteps: 7
    },
    sales_follow_up: {
      name: 'Sales Follow-up Workflow',
      description: 'Automated sales opportunity nurturing and follow-up workflow',
      estimatedDuration: 45,
      totalSteps: 5
    },
    content_approval: {
      name: 'Content Approval Workflow',
      description: 'Multi-stage content review, approval, and publication workflow',
      estimatedDuration: 240,
      totalSteps: 6
    },
    data_sync: {
      name: 'Data Synchronization Workflow',
      description: 'Automated data validation, transformation, and synchronization workflow',
      estimatedDuration: 15,
      totalSteps: 4
    },
    notification_system: {
      name: 'Notification System Workflow',
      description: 'Intelligent notification routing and delivery workflow',
      estimatedDuration: 5,
      totalSteps: 3
    }
  };

  const workflowConfig = workflowConfigs[workflowType as keyof typeof workflowConfigs] || workflowConfigs.lead_processing;

  return {
    id: workflowId,
    name: workflowConfig.name,
    description: workflowConfig.description,
    estimatedDuration: workflowConfig.estimatedDuration,
    totalSteps: workflowConfig.totalSteps,
    priority: config.priority,
    status: 'pending' as const
  };
}

function generateWorkflowSteps(workflowType: string, config: any, businessRules?: any, contextData?: any) {
  const stepTemplates = {
    lead_processing: [
      {
        name: 'Lead Validation',
        description: 'Validate lead data completeness and quality',
        type: 'automated' as const,
        estimatedTime: 2,
        automation: {
          tool: 'Data Validation Service',
          script: 'validate_lead_data.js',
          parameters: { required_fields: ['email', 'name', 'company'] }
        },
        conditions: []
      },
      {
        name: 'Lead Scoring',
        description: 'Calculate lead score based on demographic and behavioral data',
        type: 'automated' as const,
        estimatedTime: 3,
        automation: {
          tool: 'Lead Scoring Engine',
          apiCall: '/api/lead-scoring',
          parameters: { scoring_model: 'default' }
        },
        conditions: []
      },
      {
        name: 'Lead Assignment',
        description: 'Assign lead to appropriate sales representative',
        type: 'automated' as const,
        estimatedTime: 1,
        conditions: [
          {
            type: 'data' as const,
            condition: 'lead_score > 70',
            action: 'proceed' as const
          }
        ]
      },
      {
        name: 'Initial Outreach',
        description: 'Send personalized initial outreach email',
        type: 'automated' as const,
        estimatedTime: 2,
        automation: {
          tool: 'Email Automation Platform',
          parameters: { template: 'initial_outreach', personalization: true }
        },
        conditions: []
      },
      {
        name: 'Follow-up Scheduling',
        description: 'Schedule follow-up tasks for sales representative',
        type: 'automated' as const,
        estimatedTime: 1,
        conditions: []
      },
      {
        name: 'CRM Update',
        description: 'Update CRM with lead processing results',
        type: 'automated' as const,
        estimatedTime: 1,
        automation: {
          tool: 'CRM Integration',
          apiCall: '/api/crm/update-lead'
        },
        conditions: []
      }
    ],
    customer_onboarding: [
      {
        name: 'Welcome Email',
        description: 'Send personalized welcome email with next steps',
        type: 'automated' as const,
        estimatedTime: 2,
        conditions: [],
        automation: {
          tool: 'Email Service',
          parameters: { template: 'welcome_email' }
        }
      },
      {
        name: 'Account Setup',
        description: 'Create customer accounts and configure initial settings',
        type: 'automated' as const,
        estimatedTime: 10,
        conditions: [],
        automation: {
          tool: 'Account Management System',
          apiCall: '/api/accounts/create'
        }
      },
      {
        name: 'Onboarding Call Scheduling',
        description: 'Schedule onboarding call with customer success team',
        type: 'manual' as const,
        estimatedTime: 15,
        conditions: [],
        automation: undefined
      },
      {
        name: 'Training Material Delivery',
        description: 'Deliver relevant training materials and resources',
        type: 'automated' as const,
        estimatedTime: 5,
        conditions: [],
        automation: {
          tool: 'Content Delivery System',
          parameters: { content_type: 'training_materials' }
        }
      },
      {
        name: 'Progress Check',
        description: 'Check customer progress and engagement',
        type: 'automated' as const,
        estimatedTime: 3,
        conditions: [],
        automation: {
          tool: 'Analytics Service',
          apiCall: '/api/analytics/progress'
        }
      },
      {
        name: 'Success Milestone Tracking',
        description: 'Track and celebrate customer success milestones',
        type: 'automated' as const,
        estimatedTime: 5,
        conditions: [],
        automation: {
          tool: 'Milestone Tracker',
          parameters: { milestone_type: 'onboarding' }
        }
      },
      {
        name: 'Feedback Collection',
        description: 'Collect feedback on onboarding experience',
        type: 'automated' as const,
        estimatedTime: 10,
        conditions: [],
        automation: {
          tool: 'Survey System',
          parameters: { survey_type: 'onboarding_feedback' }
        }
      },
      {
        name: 'Handoff to Account Management',
        description: 'Transfer customer to ongoing account management',
        type: 'manual' as const,
        estimatedTime: 30,
        conditions: [],
        automation: undefined
      }
    ],
    support_ticket: [
      {
        name: 'Ticket Creation',
        description: 'Create support ticket with proper categorization',
        type: 'automated' as const,
        estimatedTime: 1,
        conditions: [],
        automation: {
          tool: 'Ticketing System',
          apiCall: '/api/tickets/create'
        }
      },
      {
        name: 'Priority Assessment',
        description: 'Assess ticket priority based on customer tier and issue type',
        type: 'automated' as const,
        estimatedTime: 2,
        conditions: [],
        automation: {
          tool: 'Priority Engine',
          parameters: { assessment_model: 'customer_tier_based' }
        }
      },
      {
        name: 'Agent Assignment',
        description: 'Assign ticket to appropriate support agent',
        type: 'automated' as const,
        estimatedTime: 1,
        conditions: [],
        automation: {
          tool: 'Agent Assignment System',
          apiCall: '/api/agents/assign'
        }
      },
      {
        name: 'Initial Response',
        description: 'Send initial response acknowledging the ticket',
        type: 'automated' as const,
        estimatedTime: 1,
        conditions: [],
        automation: {
          tool: 'Auto-Response System',
          parameters: { template: 'ticket_acknowledgment' }
        }
      },
      {
        name: 'Issue Investigation',
        description: 'Investigate and diagnose the reported issue',
        type: 'manual' as const,
        estimatedTime: 30,
        conditions: [],
        automation: undefined
      },
      {
        name: 'Resolution Implementation',
        description: 'Implement solution and communicate with customer',
        type: 'manual' as const,
        estimatedTime: 20,
        conditions: [],
        automation: undefined
      },
      {
        name: 'Ticket Closure',
        description: 'Close ticket and collect customer satisfaction feedback',
        type: 'automated' as const,
        estimatedTime: 5,
        conditions: [],
        automation: {
          tool: 'Ticket Management System',
          parameters: { closure_survey: true }
        }
      }
    ]
  };

  const templates = stepTemplates[workflowType as keyof typeof stepTemplates] || stepTemplates.lead_processing;

  return templates.map((template, index) => ({
    id: `step_${index + 1}_${Date.now()}`,
    sequence: index + 1,
    name: template.name,
    description: template.description,
    type: template.type,
    assignee: config.assignee || 'auto-assign',
    estimatedTime: template.estimatedTime,
    dependencies: index > 0 ? [`step_${index}_${Date.now()}`] : undefined,
    conditions: template.conditions || [],
    automation: template.automation,
    success_criteria: [
      'Step completed successfully',
      'Data validated and processed',
      'Next step triggered appropriately'
    ],
    failure_handling: {
      retry_attempts: 3,
      escalation_path: 'supervisor',
      fallback_action: 'manual_intervention'
    }
  }));
}

function generateMonitoringStrategy(workflowType: string, businessRules?: any) {
  const kpis = [
    'Workflow completion rate',
    'Average processing time',
    'Error rate',
    'SLA compliance rate',
    'Customer satisfaction score'
  ];

  const alerts = [
    {
      condition: 'Workflow processing time exceeds SLA',
      severity: 'warning' as const,
      recipients: ['workflow_manager', 'team_lead']
    },
    {
      condition: 'Workflow failure rate > 5%',
      severity: 'error' as const,
      recipients: ['workflow_manager', 'technical_team']
    },
    {
      condition: 'Critical workflow step fails',
      severity: 'critical' as const,
      recipients: ['workflow_manager', 'on_call_engineer']
    }
  ];

  const reporting = {
    frequency: 'daily' as const,
    metrics: [
      'Total workflows processed',
      'Success rate',
      'Average processing time',
      'Bottleneck identification',
      'Resource utilization'
    ],
    dashboards: [
      'Workflow Performance Dashboard',
      'SLA Compliance Dashboard',
      'Error Analysis Dashboard'
    ]
  };

  return {
    kpis,
    alerts,
    reporting
  };
}

function generateOptimizationRecommendations(workflowType: string, steps: any[]) {
  const bottlenecks = [
    'Manual approval steps causing delays',
    'External API dependencies with high latency',
    'Resource contention during peak hours'
  ];

  const improvements = [
    'Implement parallel processing for independent steps',
    'Add caching for frequently accessed data',
    'Optimize database queries and API calls',
    'Implement smart routing based on workload'
  ];

  const automation_opportunities = [
    'Automate data validation and cleansing',
    'Implement AI-powered decision making',
    'Add predictive analytics for resource planning',
    'Automate routine communications and notifications'
  ];

  const efficiency_gains = [
    'Reduce manual intervention by 60%',
    'Decrease average processing time by 40%',
    'Improve error detection and handling',
    'Increase throughput by 50%'
  ];

  return {
    bottlenecks,
    improvements,
    automation_opportunities,
    efficiency_gains
  };
}

function generateComplianceRequirements(workflowType: string, businessRules?: any) {
  const requirements = [
    'Data privacy and protection compliance (GDPR, CCPA)',
    'Audit trail maintenance for all workflow actions',
    'Access control and authorization verification',
    'Data retention policy enforcement'
  ];

  const security_measures = [
    'Encrypted data transmission and storage',
    'Role-based access control',
    'Regular security audits and assessments',
    'Incident response and breach notification procedures'
  ];

  return {
    requirements,
    audit_trail: true,
    data_retention: '7 years for financial data, 3 years for operational data',
    security_measures
  };
}