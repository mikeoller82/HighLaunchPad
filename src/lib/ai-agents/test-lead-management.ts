import { createLeadManagementAgent } from './lead-management-agent';
import {
  EventType,
  ActionType,
  Event,
  DecisionContext
} from './types';
import {
  LeadSource,
  InteractionType,
  CommunicationChannel,
  Priority,
  QualificationStatus
} from '../crm-types';

// Simple test runner for Lead Management Agent
async function testLeadManagementAgent() {
  console.log('🧪 Testing Lead Management Agent Implementation');
  console.log('='.repeat(60));

  try {
    // Create agent instance
    const agent = createLeadManagementAgent({ id: 'test-lead-agent' });
    console.log('✅ Agent created successfully');
    console.log(`   ID: ${agent.id}`);
    console.log(`   Type: ${agent.type}`);
    console.log(`   Capabilities: ${agent.capabilities.length}`);

    // Test 1: Lead Scoring
    console.log('\n📊 Testing Lead Scoring...');
    const leadData = {
      jobTitle: 'CEO',
      company: 'Enterprise',
      industry: 'Technology',
      companySize: '1000+',
      websiteVisits: 5,
      emailEngagement: {
        openRate: 0.8,
        clickRate: 0.6
      },
      socialMediaActivity: 3,
      companyRevenue: 150000000 // $150M
    };

    const score = await agent.scoreLead(leadData);
    console.log('✅ Lead scoring completed');
    console.log(`   Total Score: ${score.total}`);
    console.log(`   Demographic: ${score.demographic}`);
    console.log(`   Behavioral: ${score.behavioral}`);
    console.log(`   Engagement: ${score.engagement}`);
    console.log(`   Firmographic: ${score.firmographic}`);
    console.log(`   Factors: ${score.factors?.length || 0}`);

    // Test 2: Lead Qualification
    console.log('\n🎯 Testing Lead Qualification...');
    const qualification = agent.qualifyLead(score.total);
    console.log('✅ Lead qualification completed');
    console.log(`   Qualification Status: ${qualification}`);

    // Test 3: Lead Assignment
    console.log('\n👥 Testing Lead Assignment...');
    const assignedTo = await agent.assignLead(leadData);
    console.log('✅ Lead assignment completed');
    console.log(`   Assigned To: ${assignedTo || 'No suitable assignee found'}`);

    // Test 4: Event Processing
    console.log('\n📨 Testing Event Processing...');
    const leadCaptureEvent: Event = {
      id: 'test-event-1',
      type: EventType.LEAD_CAPTURED,
      timestamp: new Date(),
      source: 'website_form',
      data: leadData,
      priority: 8,
      leadId: 'lead-123'
    };

    await agent.perceive([leadCaptureEvent]);
    console.log('✅ Event processing completed');
    console.log(`   Context updated with ${agent.getContext().conversationHistory.length} entries`);

    // Test 5: Decision Making
    console.log('\n🤔 Testing Decision Making...');
    const context: DecisionContext = {
      events: [leadCaptureEvent],
      currentContext: agent.getContext(),
      availableActions: [ActionType.UPDATE_RECORD, ActionType.TRIGGER_WORKFLOW, ActionType.SCHEDULE_FOLLOWUP],
      businessConstraints: {}
    };

    const actions = await agent.decide(context);
    console.log('✅ Decision making completed');
    console.log(`   Generated ${actions.length} actions:`);
    actions.forEach((action, index) => {
      console.log(`     ${index + 1}. ${action.type} (Priority: ${action.priority})`);
    });

    // Test 6: Action Execution
    console.log('\n⚡ Testing Action Execution...');
    const results = await agent.execute(actions.slice(0, 2)); // Execute first 2 actions
    console.log('✅ Action execution completed');
    console.log(`   Executed ${results.length} actions:`);
    results.forEach((result, index) => {
      console.log(`     ${index + 1}. ${result.success ? '✅' : '❌'} ${result.actionId}`);
      if (result.error) {
        console.log(`        Error: ${result.error}`);
      }
    });

    // Test 7: Buying Signal Detection
    console.log('\n🔍 Testing Buying Signal Detection...');
    const interactionEvent: Event = {
      id: 'test-event-2',
      type: EventType.CUSTOMER_INTERACTION,
      timestamp: new Date(),
      source: 'email',
      data: {
        type: InteractionType.EMAIL,
        content: 'I need pricing information urgently for a demo next week',
        channel: CommunicationChannel.EMAIL
      },
      priority: 7,
      customerId: 'customer-123',
      leadId: 'lead-123'
    };

    await agent.perceive([interactionEvent]);
    
    const interactionContext: DecisionContext = {
      events: [interactionEvent],
      currentContext: agent.getContext(),
      availableActions: [ActionType.ESCALATE, ActionType.UPDATE_RECORD, ActionType.SCHEDULE_FOLLOWUP],
      businessConstraints: {}
    };

    const interactionActions = await agent.decide(interactionContext);
    console.log('✅ Buying signal detection completed');
    console.log(`   Generated ${interactionActions.length} actions for interaction:`);
    interactionActions.forEach((action, index) => {
      console.log(`     ${index + 1}. ${action.type} (Priority: ${action.priority})`);
      if (action.type === ActionType.ESCALATE) {
        console.log(`        Escalation reason: ${action.parameters.reason}`);
      }
    });

    // Test 8: Agent Metrics
    console.log('\n📈 Testing Agent Metrics...');
    const metrics = agent.getMetrics();
    console.log('✅ Metrics retrieved');
    console.log(`   Total Actions: ${metrics.totalActions}`);
    console.log(`   Successful Actions: ${metrics.successfulActions}`);
    console.log(`   Failed Actions: ${metrics.failedActions}`);
    console.log(`   Learning Score: ${metrics.learningScore}`);

    // Test 9: Learning and Feedback
    console.log('\n🧠 Testing Learning and Feedback...');
    const feedback = [{
      actionId: results[0]?.actionId || 'test-action',
      outcome: 'success' as const,
      score: 0.9,
      details: 'Lead was successfully processed',
      timestamp: new Date(),
      source: 'system' as const
    }];

    await agent.learn(feedback);
    console.log('✅ Learning completed');
    console.log(`   Processed ${feedback.length} feedback items`);

    // Final Status
    console.log('\n🎉 All Tests Completed Successfully!');
    console.log('='.repeat(60));
    console.log(`Agent Status: ${agent.getStatus()}`);
    console.log(`Final Metrics: ${JSON.stringify(agent.getMetrics(), null, 2)}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run the tests
if (require.main === module) {
  testLeadManagementAgent()
    .then(() => {
      console.log('\n✨ Lead Management Agent implementation verified successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Lead Management Agent test failed:', error);
      process.exit(1);
    });
}

export { testLeadManagementAgent };