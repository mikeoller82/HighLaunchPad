import { NextRequest, NextResponse } from 'next/server';
import { nurturingEngine } from '@/lib/ai-agents/nurturing-automation-engine';
import { emailMarketingIntegration } from '@/lib/ai-agents/email-marketing-integration';
import { createLeadManagementAgent } from '@/lib/ai-agents/lead-management-agent';
import { EventType, ActionType } from '@/lib/ai-agents/types';
import { QualificationStatus } from '@/lib/crm-types';

// ============================================================================
// NURTURING AUTOMATION API ENDPOINTS
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_sequence':
        return await handleCreateSequence(data);
      case 'process_step':
        return await handleProcessStep(data);
      case 'detect_signals':
        return await handleDetectSignals(data);
      case 'send_email':
        return await handleSendEmail(data);
      case 'escalate_lead':
        return await handleEscalateLead(data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in nurturing API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const leadId = searchParams.get('leadId');
    const sequenceId = searchParams.get('sequenceId');

    switch (action) {
      case 'get_sequence_status':
        return await handleGetSequenceStatus(sequenceId);
      case 'get_lead_signals':
        return await handleGetLeadSignals(leadId);
      case 'get_email_tracking':
        return await handleGetEmailTracking(searchParams.get('messageId'));
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in nurturing API GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// ACTION HANDLERS
// ============================================================================

async function handleCreateSequence(data: any) {
  try {
    const { lead, context } = data;

    // Validate required data
    if (!lead || !lead.id) {
      return NextResponse.json(
        { error: 'Lead data is required' },
        { status: 400 }
      );
    }

    // Create decision context
    const decisionContext = {
      events: [{
        id: `create_sequence_${Date.now()}`,
        type: EventType.LEAD_CAPTURED,
        timestamp: new Date(),
        source: 'nurturing_api',
        data: lead,
        priority: 2
      }],
      currentContext: context || {
        sessionId: `session_${Date.now()}`,
        conversationHistory: [lead],
        availableActions: [ActionType.SEND_MESSAGE, ActionType.CREATE_TASK],
        businessRules: {},
        performanceMetrics: {
          totalActions: 0,
          successfulActions: 0,
          failedActions: 0,
          averageResponseTime: 0,
          learningScore: 0.5
        },
        lastUpdated: new Date()
      },
      availableActions: [ActionType.SEND_MESSAGE, ActionType.CREATE_TASK],
      businessConstraints: {}
    };

    // Create nurturing sequence
    const actions = await nurturingEngine.createNurturingSequence(lead, decisionContext);

    return NextResponse.json({
      success: true,
      message: 'Nurturing sequence created successfully',
      data: {
        leadId: lead.id,
        actionsCreated: actions.length,
        actions: actions.map(action => ({
          id: action.id,
          type: action.type,
          priority: action.priority,
          scheduledFor: action.parameters.scheduledFor
        }))
      }
    });

  } catch (error) {
    console.error('Error creating nurturing sequence:', error);
    return NextResponse.json(
      { error: 'Failed to create nurturing sequence' },
      { status: 500 }
    );
  }
}

async function handleProcessStep(data: any) {
  try {
    const { sequenceId, context } = data;

    if (!sequenceId) {
      return NextResponse.json(
        { error: 'Sequence ID is required' },
        { status: 400 }
      );
    }

    // Create decision context
    const decisionContext = {
      events: [{
        id: `process_step_${Date.now()}`,
        type: EventType.WORKFLOW_TRIGGERED,
        timestamp: new Date(),
        source: 'nurturing_api',
        data: { sequenceId },
        priority: 2
      }],
      currentContext: context || {
        sessionId: `session_${Date.now()}`,
        conversationHistory: [],
        availableActions: [ActionType.SEND_MESSAGE],
        businessRules: {},
        performanceMetrics: {
          totalActions: 0,
          successfulActions: 0,
          failedActions: 0,
          averageResponseTime: 0,
          learningScore: 0.5
        },
        lastUpdated: new Date()
      },
      availableActions: [ActionType.SEND_MESSAGE, ActionType.CREATE_TASK],
      businessConstraints: {}
    };

    // Process nurturing step
    const actions = await nurturingEngine.processNurturingStep(sequenceId, decisionContext);

    return NextResponse.json({
      success: true,
      message: 'Nurturing step processed successfully',
      data: {
        sequenceId,
        actionsCreated: actions.length,
        actions: actions.map(action => ({
          id: action.id,
          type: action.type,
          priority: action.priority
        }))
      }
    });

  } catch (error) {
    console.error('Error processing nurturing step:', error);
    return NextResponse.json(
      { error: 'Failed to process nurturing step' },
      { status: 500 }
    );
  }
}

async function handleDetectSignals(data: any) {
  try {
    const { lead, interactionData, context } = data;

    if (!lead || !interactionData) {
      return NextResponse.json(
        { error: 'Lead and interaction data are required' },
        { status: 400 }
      );
    }

    // Create decision context
    const decisionContext = {
      events: [{
        id: `detect_signals_${Date.now()}`,
        type: EventType.CUSTOMER_INTERACTION,
        timestamp: new Date(),
        source: 'nurturing_api',
        data: interactionData,
        priority: 2
      }],
      currentContext: context || {
        sessionId: `session_${Date.now()}`,
        conversationHistory: [lead],
        availableActions: [ActionType.ESCALATE],
        businessRules: {},
        performanceMetrics: {
          totalActions: 0,
          successfulActions: 0,
          failedActions: 0,
          averageResponseTime: 0,
          learningScore: 0.5
        },
        lastUpdated: new Date()
      },
      availableActions: [ActionType.ESCALATE, ActionType.SCHEDULE_FOLLOWUP],
      businessConstraints: {}
    };

    // Detect buying signals
    const buyingSignals = await nurturingEngine.detectBuyingSignals(
      lead,
      interactionData,
      decisionContext
    );

    // Create escalation triggers if needed
    const escalationActions = await nurturingEngine.createEscalationTriggers(
      lead,
      buyingSignals,
      decisionContext
    );

    return NextResponse.json({
      success: true,
      message: 'Buying signals detected successfully',
      data: {
        leadId: lead.id,
        signalsDetected: buyingSignals.length,
        signals: buyingSignals.map(signal => ({
          type: signal.type,
          strength: signal.strength,
          description: signal.description,
          detectedAt: signal.detectedAt
        })),
        escalationActions: escalationActions.length,
        actions: escalationActions.map(action => ({
          id: action.id,
          type: action.type,
          priority: action.priority
        }))
      }
    });

  } catch (error) {
    console.error('Error detecting buying signals:', error);
    return NextResponse.json(
      { error: 'Failed to detect buying signals' },
      { status: 500 }
    );
  }
}

async function handleSendEmail(data: any) {
  try {
    const { lead, content, sequenceId, stepId } = data;

    if (!lead || !content) {
      return NextResponse.json(
        { error: 'Lead and content are required' },
        { status: 400 }
      );
    }

    // Send email via integration
    const result = await emailMarketingIntegration.sendNurturingEmail(
      lead,
      content,
      sequenceId || `manual_${Date.now()}`,
      stepId || `step_${Date.now()}`
    );

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email sent successfully' : 'Failed to send email',
      data: {
        leadId: lead.id,
        messageId: result.messageId,
        trackingId: result.trackingId,
        deliveredAt: result.deliveredAt,
        error: result.error
      }
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

async function handleEscalateLead(data: any) {
  try {
    const { lead, reason, signals, urgency } = data;

    if (!lead || !reason) {
      return NextResponse.json(
        { error: 'Lead and escalation reason are required' },
        { status: 400 }
      );
    }

    // Create lead management agent to handle escalation
    const leadAgent = createLeadManagementAgent();

    // Create escalation event
    const escalationEvent = {
      id: `escalation_${Date.now()}`,
      type: EventType.CUSTOMER_INTERACTION,
      timestamp: new Date(),
      source: 'nurturing_api',
      data: {
        leadId: lead.id,
        escalationReason: reason,
        buyingSignals: signals || [],
        urgency: urgency || 'medium'
      },
      priority: urgency === 'urgent' ? 1 : 2
    };

    // Process escalation
    const result = await leadAgent.processEvent(escalationEvent);

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Lead escalated successfully' : 'Failed to escalate lead',
      data: {
        leadId: lead.id,
        escalationReason: reason,
        actionsCreated: result.actions?.length || 0,
        confidence: result.confidence,
        reasoning: result.reasoning
      }
    });

  } catch (error) {
    console.error('Error escalating lead:', error);
    return NextResponse.json(
      { error: 'Failed to escalate lead' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET HANDLERS
// ============================================================================

async function handleGetSequenceStatus(sequenceId: string | null) {
  try {
    if (!sequenceId) {
      return NextResponse.json(
        { error: 'Sequence ID is required' },
        { status: 400 }
      );
    }

    // Mock sequence status - in production, this would query the database
    const sequenceStatus = {
      id: sequenceId,
      status: 'active',
      currentStep: 2,
      totalSteps: 5,
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      nextActionAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      completedSteps: [
        { stepId: 'welcome_email', completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { stepId: 'value_proposition_email', completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) }
      ]
    };

    return NextResponse.json({
      success: true,
      data: sequenceStatus
    });

  } catch (error) {
    console.error('Error getting sequence status:', error);
    return NextResponse.json(
      { error: 'Failed to get sequence status' },
      { status: 500 }
    );
  }
}

async function handleGetLeadSignals(leadId: string | null) {
  try {
    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Mock buying signals - in production, this would query the database
    const buyingSignals = [
      {
        type: 'pricing_inquiry',
        strength: 0.8,
        description: 'Customer inquired about pricing',
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        source: 'nurturing_automation_engine'
      },
      {
        type: 'demo_request',
        strength: 0.9,
        description: 'Lead requested a product demo',
        detectedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        source: 'lead_management_agent'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        leadId,
        signalsCount: buyingSignals.length,
        signals: buyingSignals
      }
    });

  } catch (error) {
    console.error('Error getting lead signals:', error);
    return NextResponse.json(
      { error: 'Failed to get lead signals' },
      { status: 500 }
    );
  }
}

async function handleGetEmailTracking(messageId: string | null) {
  try {
    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Get email tracking data
    const trackingData = await emailMarketingIntegration.getEmailTrackingData(messageId);

    if (!trackingData) {
      return NextResponse.json(
        { error: 'Tracking data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: trackingData
    });

  } catch (error) {
    console.error('Error getting email tracking:', error);
    return NextResponse.json(
      { error: 'Failed to get email tracking data' },
      { status: 500 }
    );
  }
}

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'email_webhook':
        await emailMarketingIntegration.processEmailWebhook(data);
        return NextResponse.json({ success: true });
      default:
        return NextResponse.json(
          { error: 'Invalid webhook type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}