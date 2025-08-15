import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const DataIntegrationInputSchema = z.object({
  integrationType: z.enum(['crm_sync', 'email_sync', 'social_sync', 'analytics_sync', 'payment_sync', 'custom_api']).describe('Type of data integration'),
  sourceSystem: z.object({
    name: z.string(),
    type: z.string(),
    endpoint: z.string().optional(),
    credentials: z.record(z.string()).optional(),
    dataFormat: z.enum(['json', 'xml', 'csv', 'api']).default('json')
  }).describe('Source system information'),
  targetSystem: z.object({
    name: z.string(),
    type: z.string(),
    endpoint: z.string().optional(),
    credentials: z.record(z.string()).optional(),
    dataFormat: z.enum(['json', 'xml', 'csv', 'api']).default('json')
  }).describe('Target system information'),
  dataMapping: z.object({
    fields: z.array(z.object({
      source: z.string(),
      target: z.string(),
      transformation: z.string().optional(),
      required: z.boolean().default(false)
    })),
    filters: z.array(z.object({
      field: z.string(),
      operator: z.enum(['equals', 'contains', 'greater_than', 'less_than', 'not_null']),
      value: z.string()
    })).optional(),
    validation: z.array(z.object({
      field: z.string(),
      rule: z.string(),
      errorMessage: z.string()
    })).optional()
  }).describe('Data mapping and transformation rules'),
  syncConfig: z.object({
    frequency: z.enum(['real_time', 'hourly', 'daily', 'weekly', 'manual']).default('daily'),
    batchSize: z.number().default(100),
    retryAttempts: z.number().default(3),
    errorHandling: z.enum(['skip', 'retry', 'stop']).default('retry'),
    duplicateHandling: z.enum(['skip', 'update', 'create_new']).default('update')
  }).describe('Synchronization configuration'),
  businessRules: z.object({
    dataRetention: z.number().optional(), // days
    privacyCompliance: z.array(z.string()).optional(),
    auditLogging: z.boolean().default(true),
    dataEncryption: z.boolean().default(true)
  }).optional().describe('Business rules and compliance'),
  apiKey: z.string().describe('User API key for Google AI')
});

const DataIntegrationOutputSchema = z.object({
  integrationPlan: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    complexity: z.enum(['low', 'medium', 'high']),
    estimatedTime: z.number(), // hours
    prerequisites: z.array(z.string())
  }).describe('Integration plan overview'),
  dataFlow: z.object({
    steps: z.array(z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['extract', 'transform', 'validate', 'load', 'notify']),
      description: z.string(),
      dependencies: z.array(z.string()).optional(),
      estimatedTime: z.number() // minutes
    })),
    errorHandling: z.array(z.object({
      step: z.string(),
      errorType: z.string(),
      action: z.string(),
      notification: z.boolean()
    })),
    rollbackPlan: z.string()
  }).describe('Data flow and processing steps'),
  technicalSpecs: z.object({
    apiEndpoints: z.array(z.object({
      method: z.string(),
      url: z.string(),
      headers: z.record(z.string()),
      authentication: z.string()
    })),
    dataTransformations: z.array(z.object({
      field: z.string(),
      transformation: z.string(),
      example: z.string()
    })),
    validationRules: z.array(z.object({
      field: z.string(),
      rule: z.string(),
      errorMessage: z.string()
    }))
  }).describe('Technical implementation specifications'),
  monitoring: z.object({
    healthChecks: z.array(z.string()),
    performanceMetrics: z.array(z.string()),
    alerting: z.array(z.object({
      condition: z.string(),
      severity: z.enum(['info', 'warning', 'error', 'critical']),
      recipients: z.array(z.string())
    })),
    reporting: z.object({
      frequency: z.string(),
      metrics: z.array(z.string()),
      dashboards: z.array(z.string())
    })
  }).describe('Monitoring and alerting configuration'),
  security: z.object({
    authentication: z.string(),
    authorization: z.string(),
    dataEncryption: z.string(),
    auditTrail: z.boolean(),
    complianceChecks: z.array(z.string())
  }).describe('Security and compliance measures'),
  testing: z.object({
    testCases: z.array(z.object({
      scenario: z.string(),
      input: z.string(),
      expectedOutput: z.string(),
      validation: z.string()
    })),
    performanceTests: z.array(z.string()),
    securityTests: z.array(z.string())
  }).describe('Testing strategy and test cases')
});

export async function dataIntegrationFlow(input: z.infer<typeof DataIntegrationInputSchema>) {
    const { integrationType, sourceSystem, targetSystem, dataMapping, syncConfig, businessRules, apiKey } = input;
    
    // Create AI instance with user's API key
    const userAI = genkit({
      plugins: [
        googleAI({ apiKey }),
      ],
    });

    const sourceContext = `
Source System:
- Name: ${sourceSystem.name}
- Type: ${sourceSystem.type}
- Endpoint: ${sourceSystem.endpoint || 'Not specified'}
- Data Format: ${sourceSystem.dataFormat}
`;

    const targetContext = `
Target System:
- Name: ${targetSystem.name}
- Type: ${targetSystem.type}
- Endpoint: ${targetSystem.endpoint || 'Not specified'}
- Data Format: ${targetSystem.dataFormat}
`;

    const mappingContext = `
Data Mapping:
- Fields: ${dataMapping.fields.length} field mappings defined
- Filters: ${dataMapping.filters?.length || 0} filters applied
- Validations: ${dataMapping.validation?.length || 0} validation rules
`;

    const syncContext = `
Sync Configuration:
- Frequency: ${syncConfig.frequency}
- Batch Size: ${syncConfig.batchSize}
- Retry Attempts: ${syncConfig.retryAttempts}
- Error Handling: ${syncConfig.errorHandling}
- Duplicate Handling: ${syncConfig.duplicateHandling}
`;

    const businessContext = businessRules ? `
Business Rules:
- Data Retention: ${businessRules.dataRetention || 'Not specified'} days
- Privacy Compliance: ${businessRules.privacyCompliance?.join(', ') || 'Not specified'}
- Audit Logging: ${businessRules.auditLogging}
- Data Encryption: ${businessRules.dataEncryption}
` : 'No specific business rules provided';

    const prompt = `You are an expert data integration architect and ETL specialist with 12+ years of experience in enterprise data integration, API development, and system interoperability. You excel at designing robust, scalable data integration solutions that ensure data quality, security, and compliance.

## Data Integration Request
**Integration Type:** ${integrationType}

## Source System
${sourceContext}

## Target System
${targetContext}

## Data Mapping
${mappingContext}

## Synchronization Configuration
${syncContext}

## Business Context
${businessContext}

## Your Mission
Design a comprehensive data integration solution for ${integrationType} that:

1. **Ensures Data Quality** - Implements robust validation and cleansing processes
2. **Maintains Performance** - Optimizes for speed and efficiency at scale
3. **Provides Reliability** - Includes error handling, retry logic, and monitoring
4. **Ensures Security** - Implements proper authentication, encryption, and compliance
5. **Enables Monitoring** - Provides comprehensive observability and alerting
6. **Supports Maintenance** - Includes testing, documentation, and rollback procedures

## Integration Design Framework

### Integration Types and Strategies

#### CRM Sync Integration
- Contact and lead synchronization
- Activity and interaction tracking
- Deal and opportunity management
- Custom field mapping and validation
- Real-time or batch processing

#### Email Sync Integration
- Contact list synchronization
- Campaign performance data
- Engagement metrics tracking
- Unsubscribe and preference management
- Deliverability monitoring

#### Social Sync Integration
- Profile and connection data
- Engagement metrics and analytics
- Content performance tracking
- Audience insights and demographics
- Multi-platform data aggregation

#### Analytics Sync Integration
- Event tracking and measurement
- Conversion funnel analysis
- User behavior and journey mapping
- Performance metrics aggregation
- Custom dimension and metric sync

#### Payment Sync Integration
- Transaction and payment data
- Subscription and billing information
- Revenue and financial metrics
- Customer payment preferences
- Compliance and audit trails

#### Custom API Integration
- Flexible endpoint configuration
- Custom authentication methods
- Tailored data transformation
- Specific business logic implementation
- Scalable architecture design

### Data Flow Design Principles
- **Extract**: Efficient data retrieval from source systems
- **Transform**: Intelligent data mapping and cleansing
- **Validate**: Comprehensive data quality checks
- **Load**: Optimized data insertion and updates
- **Monitor**: Real-time tracking and alerting

### Error Handling Strategy
- **Graceful Degradation**: System continues operating with partial failures
- **Retry Logic**: Intelligent retry with exponential backoff
- **Dead Letter Queues**: Failed records for manual review
- **Circuit Breakers**: Prevent cascade failures
- **Rollback Procedures**: Safe recovery mechanisms

### Security and Compliance
- **Authentication**: OAuth, API keys, or certificate-based auth
- **Authorization**: Role-based access control
- **Encryption**: Data in transit and at rest
- **Audit Logging**: Comprehensive activity tracking
- **Compliance**: GDPR, CCPA, SOX, HIPAA as applicable

### Performance Optimization
- **Batch Processing**: Optimal batch sizes for throughput
- **Parallel Processing**: Concurrent data streams
- **Caching**: Strategic data caching for performance
- **Rate Limiting**: Respect API limits and quotas
- **Connection Pooling**: Efficient resource utilization

## Quality Standards
- All data transformations must be reversible and auditable
- Error handling must provide clear, actionable error messages
- Performance must meet specified SLA requirements
- Security measures must follow industry best practices
- Monitoring must provide proactive alerting and insights

Create a comprehensive data integration solution that delivers reliable, secure, and performant data synchronization.`;

    const response = await userAI.generate({
      model: googleAI.model('gemini-2.0-flash-exp'),
      prompt: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 4000
      }
    });

    // Generate integration components
    const integrationPlan = generateIntegrationPlan(integrationType, sourceSystem, targetSystem);
    const dataFlow = generateDataFlow(integrationType, dataMapping, syncConfig);
    const technicalSpecs = generateTechnicalSpecs(sourceSystem, targetSystem, dataMapping);
    const monitoring = generateMonitoringConfig(integrationType, syncConfig);
    const security = generateSecurityConfig(businessRules);
    const testing = generateTestingStrategy(integrationType, dataMapping);

    return {
      integrationPlan,
      dataFlow,
      technicalSpecs,
      monitoring,
      security,
      testing
    };
}

function generateIntegrationPlan(integrationType: string, sourceSystem: any, targetSystem: any) {
  const integrationId = `integration_${integrationType}_${Date.now()}`;
  
  const complexityMap = {
    crm_sync: 'medium',
    email_sync: 'low',
    social_sync: 'medium',
    analytics_sync: 'high',
    payment_sync: 'high',
    custom_api: 'medium'
  };

  const timeEstimates = {
    crm_sync: 40,
    email_sync: 20,
    social_sync: 35,
    analytics_sync: 60,
    payment_sync: 80,
    custom_api: 50
  };

  const prerequisites = {
    crm_sync: ['CRM API access', 'Field mapping documentation', 'Test environment'],
    email_sync: ['Email platform API keys', 'Contact list access', 'Webhook configuration'],
    social_sync: ['Social platform API access', 'OAuth configuration', 'Rate limit understanding'],
    analytics_sync: ['Analytics platform access', 'Event tracking setup', 'Custom dimension configuration'],
    payment_sync: ['Payment gateway API access', 'PCI compliance review', 'Webhook endpoint setup'],
    custom_api: ['API documentation', 'Authentication credentials', 'Test environment access']
  };

  return {
    id: integrationId,
    name: `${sourceSystem.name} to ${targetSystem.name} Integration`,
    description: `${integrationType.replace('_', ' ').toUpperCase()} integration between ${sourceSystem.name} and ${targetSystem.name}`,
    complexity: complexityMap[integrationType as keyof typeof complexityMap] as 'low' | 'medium' | 'high',
    estimatedTime: timeEstimates[integrationType as keyof typeof timeEstimates],
    prerequisites: prerequisites[integrationType as keyof typeof prerequisites] || ['API access', 'Documentation', 'Test environment']
  };
}

function generateDataFlow(integrationType: string, dataMapping: any, syncConfig: any) {
  const steps = [
    {
      id: 'extract_data',
      name: 'Data Extraction',
      type: 'extract' as const,
      description: 'Extract data from source system using API or database connection',
      estimatedTime: 5
    },
    {
      id: 'transform_data',
      name: 'Data Transformation',
      type: 'transform' as const,
      description: 'Apply field mappings, data cleansing, and business rules',
      dependencies: ['extract_data'],
      estimatedTime: 10
    },
    {
      id: 'validate_data',
      name: 'Data Validation',
      type: 'validate' as const,
      description: 'Validate data quality, completeness, and business rules',
      dependencies: ['transform_data'],
      estimatedTime: 3
    },
    {
      id: 'load_data',
      name: 'Data Loading',
      type: 'load' as const,
      description: 'Load validated data into target system',
      dependencies: ['validate_data'],
      estimatedTime: 7
    },
    {
      id: 'notify_completion',
      name: 'Completion Notification',
      type: 'notify' as const,
      description: 'Send notifications and update monitoring systems',
      dependencies: ['load_data'],
      estimatedTime: 1
    }
  ];

  const errorHandling = [
    {
      step: 'extract_data',
      errorType: 'Connection timeout',
      action: 'Retry with exponential backoff',
      notification: true
    },
    {
      step: 'transform_data',
      errorType: 'Data format error',
      action: 'Log error and skip record',
      notification: false
    },
    {
      step: 'validate_data',
      errorType: 'Validation failure',
      action: 'Move to error queue for review',
      notification: true
    },
    {
      step: 'load_data',
      errorType: 'Target system error',
      action: 'Rollback transaction and retry',
      notification: true
    }
  ];

  const rollbackPlan = 'In case of critical failure, stop processing, rollback any partial changes, notify administrators, and preserve failed records for manual review and reprocessing.';

  return {
    steps,
    errorHandling,
    rollbackPlan
  };
}

function generateTechnicalSpecs(sourceSystem: any, targetSystem: any, dataMapping: any) {
  const apiEndpoints = [
    {
      method: 'GET',
      url: `${sourceSystem.endpoint || 'https://api.source.com'}/data`,
      headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json'
      },
      authentication: 'OAuth 2.0 Bearer Token'
    },
    {
      method: 'POST',
      url: `${targetSystem.endpoint || 'https://api.target.com'}/data`,
      headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json'
      },
      authentication: 'OAuth 2.0 Bearer Token'
    }
  ];

  const dataTransformations = dataMapping.fields.map((field: any) => ({
    field: field.target,
    transformation: field.transformation || `Direct mapping from ${field.source}`,
    example: `${field.source} -> ${field.target}`
  }));

  const validationRules = dataMapping.validation?.map((validation: any) => ({
    field: validation.field,
    rule: validation.rule,
    errorMessage: validation.errorMessage
  })) || [
    {
      field: 'email',
      rule: 'Valid email format',
      errorMessage: 'Email must be in valid format'
    },
    {
      field: 'required_fields',
      rule: 'Not null or empty',
      errorMessage: 'Required fields cannot be empty'
    }
  ];

  return {
    apiEndpoints,
    dataTransformations,
    validationRules
  };
}

function generateMonitoringConfig(integrationType: string, syncConfig: any) {
  const healthChecks = [
    'Source system connectivity',
    'Target system connectivity',
    'Authentication token validity',
    'Data pipeline status',
    'Error queue size'
  ];

  const performanceMetrics = [
    'Records processed per minute',
    'Success rate percentage',
    'Average processing time',
    'Error rate',
    'Data latency'
  ];

  const alerting = [
    {
      condition: 'Error rate > 5%',
      severity: 'warning' as const,
      recipients: ['integration_team', 'data_team']
    },
    {
      condition: 'Integration failure',
      severity: 'critical' as const,
      recipients: ['integration_team', 'on_call_engineer']
    },
    {
      condition: 'Data latency > 1 hour',
      severity: 'error' as const,
      recipients: ['integration_team']
    }
  ];

  const reporting = {
    frequency: syncConfig.frequency === 'real_time' ? 'hourly' : 'daily',
    metrics: [
      'Total records processed',
      'Success/failure rates',
      'Performance trends',
      'Error analysis',
      'System health status'
    ],
    dashboards: [
      'Integration Performance Dashboard',
      'Data Quality Dashboard',
      'System Health Dashboard'
    ]
  };

  return {
    healthChecks,
    performanceMetrics,
    alerting,
    reporting
  };
}

function generateSecurityConfig(businessRules?: any) {
  return {
    authentication: 'OAuth 2.0 with refresh tokens and secure token storage',
    authorization: 'Role-based access control with principle of least privilege',
    dataEncryption: 'TLS 1.3 for data in transit, AES-256 for data at rest',
    auditTrail: businessRules?.auditLogging !== false,
    complianceChecks: businessRules?.privacyCompliance || [
      'GDPR data protection',
      'Data retention policies',
      'Access logging and monitoring',
      'Secure credential management'
    ]
  };
}

function generateTestingStrategy(integrationType: string, dataMapping: any) {
  const testCases = [
    {
      scenario: 'Successful data sync',
      input: 'Valid source data with all required fields',
      expectedOutput: 'Data successfully loaded to target system',
      validation: 'Verify record count and data integrity'
    },
    {
      scenario: 'Invalid data handling',
      input: 'Source data with missing required fields',
      expectedOutput: 'Records moved to error queue with appropriate error messages',
      validation: 'Verify error handling and logging'
    },
    {
      scenario: 'Duplicate data handling',
      input: 'Duplicate records in source data',
      expectedOutput: 'Duplicates handled according to configuration',
      validation: 'Verify duplicate detection and resolution'
    },
    {
      scenario: 'Large batch processing',
      input: 'Large dataset exceeding normal batch size',
      expectedOutput: 'Data processed in multiple batches successfully',
      validation: 'Verify performance and memory usage'
    }
  ];

  const performanceTests = [
    'Load testing with maximum expected data volume',
    'Stress testing with 150% of normal load',
    'Endurance testing over extended periods',
    'Spike testing with sudden load increases'
  ];

  const securityTests = [
    'Authentication and authorization testing',
    'Data encryption verification',
    'SQL injection and XSS prevention',
    'Rate limiting and DDoS protection'
  ];

  return {
    testCases,
    performanceTests,
    securityTests
  };
}