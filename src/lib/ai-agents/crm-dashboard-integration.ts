import { EventEmitter } from 'events';
import { LeadManagementAgent } from './lead-management-agent';
import { LeadCaptureService } from './lead-capture-service';
import { DecisionContext, ActionType, AgentMetrics } from './types';
import {
  Lead,
  LeadScore,
  QualificationStatus,
  BuyingSignal,
  NextBestAction,
  Priority
} from '../crm-types';


// Dashboard Integration Configuration
export interface CRMDashboardConfig {
  enableRealTimeUpdates: boolean;
  enableNotifications: boolean;
  enableAutoRefresh: boolean;
  refreshInterval: number; // milliseconds
  notificationThresholds: {
    highScoreThreshold: number;
    hotSignalThreshold: number;
    urgentActionThreshold: number;
  };
}

// Real-time Lead Update
export interface LeadUpdate {
  leadId: string;
  type: 'score_updated' | 'qualification_changed' | 'assignment_changed' | 'buying_signals' | 'action_required';
  data: any;
  timestamp: Date;
  priority: Priority;
}

// Dashboard Notification
export interface DashboardNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  leadId?: string;
  actionRequired?: boolean;
  actions?: NotificationAction[];
  timestamp: Date;
  priority: Priority;
  autoHide?: boolean;
  duration?: number; // milliseconds
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  variant: 'primary' | 'secondary' | 'destructive';
}

// Lead Dashboard Data
export interface LeadDashboardData {
  lead: Lead;
  score: LeadScore;
  qualification: QualificationStatus;
  buyingSignals: BuyingSignal[];
  nextBestActions: NextBestAction[];
  assignmentInfo?: {
    assignedTo: string;
    assignedAt: Date;
    assignmentReason: string;
  };
  realtimeUpdates: LeadUpdate[];
  lastUpdated: Date;
}

// CRM Dashboard Integration Service
export class CRMDashboardIntegration extends EventEmitter {
  private config: CRMDashboardConfig;
  private leadAgent: LeadManagementAgent; // Available for future integration
  private leadCaptureService: LeadCaptureService;
  private activeLeads: Map<string, LeadDashboardData> = new Map();
  private notifications: DashboardNotification[] = [];
  private refreshTimer?: NodeJS.Timeout;

  constructor(
    config: CRMDashboardConfig,
    leadAgent: LeadManagementAgent,
    leadCaptureService: LeadCaptureService
  ) {
    super();
    this.config = config;
    this.leadAgent = leadAgent;
    this.leadCaptureService = leadCaptureService;

    this.setupEventListeners();
    
    if (config.enableAutoRefresh) {
      this.startAutoRefresh();
    }
  }

  // Initialize dashboard integration
  public async initialize(): Promise<void> {
    console.log('🚀 Initializing CRM Dashboard Integration');
    
    // Load existing leads
    await this.loadExistingLeads();
    
    // Setup real-time monitoring
    if (this.config.enableRealTimeUpdates) {
      this.startRealTimeMonitoring();
    }
    
    console.log('✅ CRM Dashboard Integration initialized');
  }

  // Get dashboard data for a specific lead
  public async getLeadDashboardData(leadId: string): Promise<LeadDashboardData | null> {
    const cachedData = this.activeLeads.get(leadId);
    if (cachedData && this.isDataFresh(cachedData.lastUpdated)) {
      return cachedData;
    }

    // Fetch fresh data
    return this.fetchLeadDashboardData(leadId);
  }

  // Get all active leads for dashboard
  public async getAllLeadsDashboardData(): Promise<LeadDashboardData[]> {
    const allData: LeadDashboardData[] = [];
    
    for (const [leadId, data] of Array.from(this.activeLeads.entries())) {
      if (this.isDataFresh(data.lastUpdated)) {
        allData.push(data);
      } else {
        // Refresh stale data
        const freshData = await this.fetchLeadDashboardData(leadId);
        if (freshData) {
          allData.push(freshData);
        }
      }
    }
    
    return allData.sort((a, b) => b.score.total - a.score.total);
  }

  // Process lead scoring update
  public async processLeadScoringUpdate(leadId: string, newScore: LeadScore): Promise<void> {
    const existingData = this.activeLeads.get(leadId);
    if (!existingData) return;

    const oldScore = existingData.score.total;
    const scoreChange = newScore.total - oldScore;

    // Update cached data
    existingData.score = newScore;
    existingData.lastUpdated = new Date();

    // Create update event
    const update: LeadUpdate = {
      leadId,
      type: 'score_updated',
      data: {
        oldScore,
        newScore: newScore.total,
        change: scoreChange,
        factors: {
          engagement: newScore.engagement,
          fit: newScore.fit,
          intent: newScore.intent,
          timing: newScore.timing
        }
      },
      timestamp: new Date(),
      priority: this.getUpdatePriority(scoreChange)
    };

    existingData.realtimeUpdates.unshift(update);
    this.activeLeads.set(leadId, existingData);

    // Emit real-time update
    this.emit('leadScoreUpdated', { leadId, update, data: existingData });

    // Check for high score notification
    if (newScore.total >= this.config.notificationThresholds.highScoreThreshold) {
      await this.createNotification({
        type: 'success',
        title: 'High-Score Lead Detected',
        message: `Lead ${existingData.lead.firstName} ${existingData.lead.lastName} scored ${Math.round(newScore.total)} points`,
        leadId,
        timestamp: new Date(),
        priority: Priority.HIGH,
        autoHide: false,
        actions: [
          {
            id: 'view_lead',
            label: 'View Lead',
            action: 'view_lead',
            variant: 'primary'
          },
          {
            id: 'assign_lead',
            label: 'Assign Now',
            action: 'assign_lead',
            variant: 'secondary'
          }
        ]
      });
    }
  }

  // Process qualification change
  public async processQualificationChange(
    leadId: string, 
    oldQualification: QualificationStatus, 
    newQualification: QualificationStatus
  ): Promise<void> {
    const existingData = this.activeLeads.get(leadId);
    if (!existingData) return;

    // Update cached data
    existingData.qualification = newQualification;
    existingData.lastUpdated = new Date();

    // Create update event
    const update: LeadUpdate = {
      leadId,
      type: 'qualification_changed',
      data: {
        oldQualification,
        newQualification,
        qualificationImproved: this.isQualificationImprovement(oldQualification, newQualification)
      },
      timestamp: new Date(),
      priority: Priority.MEDIUM
    };

    existingData.realtimeUpdates.unshift(update);
    this.activeLeads.set(leadId, existingData);

    // Emit real-time update
    this.emit('leadQualificationChanged', { leadId, update, data: existingData });

    // Create notification for qualification improvement
    if (this.isQualificationImprovement(oldQualification, newQualification)) {
      await this.createNotification({
        type: 'info',
        title: 'Lead Qualification Updated',
        message: `${existingData.lead.firstName} ${existingData.lead.lastName} is now ${newQualification.replace('_', ' ')}`,
        leadId,
        timestamp: new Date(),
        priority: Priority.MEDIUM,
        autoHide: true,
        duration: 5000
      });
    }
  }

  // Process buying signals detection
  public async processBuyingSignals(leadId: string, signals: BuyingSignal[]): Promise<void> {
    const existingData = this.activeLeads.get(leadId);
    if (!existingData) return;

    const hotSignals = signals.filter(s => s.strength >= this.config.notificationThresholds.hotSignalThreshold);

    // Update cached data
    existingData.buyingSignals = signals;
    existingData.lastUpdated = new Date();

    // Create update event
    const update: LeadUpdate = {
      leadId,
      type: 'buying_signals',
      data: {
        totalSignals: signals.length,
        hotSignals: hotSignals.length,
        strongestSignal: signals.reduce((max, signal) => 
          signal.strength > max.strength ? signal : max, signals[0]
        )
      },
      timestamp: new Date(),
      priority: hotSignals.length > 0 ? Priority.HIGH : Priority.MEDIUM
    };

    existingData.realtimeUpdates.unshift(update);
    this.activeLeads.set(leadId, existingData);

    // Emit real-time update
    this.emit('buyingSignalsDetected', { leadId, update, data: existingData });

    // Create notification for hot signals
    if (hotSignals.length > 0) {
      await this.createNotification({
        type: 'warning',
        title: '🔥 Hot Buying Signals Detected',
        message: `${existingData.lead.firstName} ${existingData.lead.lastName} shows ${hotSignals.length} strong buying signal(s)`,
        leadId,
        actionRequired: true,
        timestamp: new Date(),
        priority: Priority.HIGH,
        autoHide: false,
        actions: [
          {
            id: 'contact_now',
            label: 'Contact Now',
            action: 'contact_lead',
            variant: 'primary'
          },
          {
            id: 'schedule_call',
            label: 'Schedule Call',
            action: 'schedule_call',
            variant: 'secondary'
          }
        ]
      });
    }
  }

  // Process lead assignment
  public async processLeadAssignment(
    leadId: string, 
    assignedTo: string, 
    assignmentReason: string
  ): Promise<void> {
    const existingData = this.activeLeads.get(leadId);
    if (!existingData) return;

    // Update cached data
    existingData.assignmentInfo = {
      assignedTo,
      assignedAt: new Date(),
      assignmentReason
    };
    existingData.lastUpdated = new Date();

    // Create update event
    const update: LeadUpdate = {
      leadId,
      type: 'assignment_changed',
      data: {
        assignedTo,
        assignmentReason,
        assignedAt: new Date()
      },
      timestamp: new Date(),
      priority: Priority.MEDIUM
    };

    existingData.realtimeUpdates.unshift(update);
    this.activeLeads.set(leadId, existingData);

    // Emit real-time update
    this.emit('leadAssigned', { leadId, update, data: existingData });

    // Create notification
    await this.createNotification({
      type: 'info',
      title: 'Lead Assigned',
      message: `${existingData.lead.firstName} ${existingData.lead.lastName} assigned to ${assignedTo}`,
      leadId,
      timestamp: new Date(),
      priority: Priority.MEDIUM,
      autoHide: true,
      duration: 3000
    });
  }

  // Get active notifications
  public getNotifications(): DashboardNotification[] {
    return this.notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Dismiss notification
  public dismissNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.emit('notificationDismissed', notificationId);
  }

  // Clear all notifications
  public clearAllNotifications(): void {
    this.notifications = [];
    this.emit('allNotificationsCleared');
  }

  // Get real-time updates for a lead
  public getLeadUpdates(leadId: string, limit: number = 10): LeadUpdate[] {
    const data = this.activeLeads.get(leadId);
    return data ? data.realtimeUpdates.slice(0, limit) : [];
  }

  // Get lead agent for direct access
  public getLeadAgent(): LeadManagementAgent {
    return this.leadAgent;
  }

  // Private methods
  private setupEventListeners(): void {
    // Listen to lead capture events
    this.leadCaptureService.on('leadCaptured', async ({ lead }) => {
      await this.handleNewLead(lead);
    });

    // Note: LeadManagementAgent doesn't extend EventEmitter
    // Event handling would need to be implemented differently
    // or the agent would need to be modified to support events
  }

  private async loadExistingLeads(): Promise<void> {
    // In a real implementation, this would load leads from the database
    console.log('📊 Loading existing leads for dashboard');
  }

  private startRealTimeMonitoring(): void {
    console.log('👁️ Starting real-time lead monitoring');
    
    // Set up periodic checks for lead updates
    setInterval(async () => {
      await this.checkForLeadUpdates();
    }, 5000); // Check every 5 seconds
  }

  private startAutoRefresh(): void {
    this.refreshTimer = setInterval(async () => {
      await this.refreshDashboardData();
    }, this.config.refreshInterval);
  }

  private async checkForLeadUpdates(): Promise<void> {
    // Check for any leads that need updates
    for (const [leadId, data] of Array.from(this.activeLeads.entries())) {
      if (!this.isDataFresh(data.lastUpdated)) {
        await this.fetchLeadDashboardData(leadId);
      }
    }
  }

  private async refreshDashboardData(): Promise<void> {
    console.log('🔄 Refreshing dashboard data');
    this.emit('dashboardRefresh');
  }

  private async handleNewLead(lead: Lead): Promise<void> {
    const dashboardData = await this.createLeadDashboardData(lead);
    this.activeLeads.set(lead.id, dashboardData);
    
    this.emit('newLeadAdded', { leadId: lead.id, data: dashboardData });
    
    // Create notification for new lead
    await this.createNotification({
      type: 'info',
      title: 'New Lead Captured',
      message: `${lead.firstName} ${lead.lastName} from ${lead.company || 'Unknown Company'}`,
      leadId: lead.id,
      timestamp: new Date(),
      priority: Priority.MEDIUM,
      autoHide: true,
      duration: 4000
    });
  }

  private async fetchLeadDashboardData(leadId: string): Promise<LeadDashboardData | null> {
    try {
      // In a real implementation, this would fetch from database
      // For now, return cached data or null
      return this.activeLeads.get(leadId) || null;
    } catch (error) {
      console.error(`❌ Failed to fetch dashboard data for lead ${leadId}:`, error);
      return null;
    }
  }

  private async createLeadDashboardData(lead: Lead): Promise<LeadDashboardData> {
    // Use AI agent to score the lead
    const aiScore = await this.leadAgent.scoreLead(lead);
    
    // Use AI agent to qualify the lead based on score
    const aiQualification = this.leadAgent.qualifyLead(aiScore.total);
    
    // Use AI agent to detect buying signals
    const context: DecisionContext = {
      events: [],
      currentContext: {
        sessionId: `dashboard-${Date.now()}`,
        customerId: lead.userId,
        leadId: lead.id,
        conversationHistory: [],
        availableActions: [ActionType.UPDATE_RECORD, ActionType.SEND_MESSAGE],
        businessRules: {},
        performanceMetrics: {
          totalActions: 0,
          successfulActions: 0,
          failedActions: 0,
          averageResponseTime: 0,
          learningScore: 0
        },
        lastUpdated: new Date()
      },
      availableActions: [ActionType.UPDATE_RECORD, ActionType.SEND_MESSAGE],
      businessConstraints: {},
      historicalData: []
    };
    // Since detectBuyingSignals is private, we'll create a default empty array
    // In a real implementation, this would be exposed as a public method
    const aiBuyingSignals: BuyingSignal[] = [];
    
    // Generate AI-powered next best actions
    const aiNextActions = await this.generateNextBestActions(lead, aiScore, aiQualification);

    return {
      lead,
      score: aiScore,
      qualification: aiQualification,
      buyingSignals: aiBuyingSignals,
      nextBestActions: aiNextActions,
      realtimeUpdates: [],
      lastUpdated: new Date()
    };
  }

  private async createNotification(notification: Omit<DashboardNotification, 'id'>): Promise<void> {
    if (!this.config.enableNotifications) return;

    const fullNotification: DashboardNotification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      ...notification
    };

    this.notifications.unshift(fullNotification);
    
    // Limit notifications to prevent memory issues
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    this.emit('newNotification', fullNotification);

    // Auto-hide notification if configured
    if (fullNotification.autoHide && fullNotification.duration) {
      setTimeout(() => {
        this.dismissNotification(fullNotification.id);
      }, fullNotification.duration);
    }
  }

  private isDataFresh(lastUpdated: Date): boolean {
    const maxAge = 30000; // 30 seconds
    return Date.now() - lastUpdated.getTime() < maxAge;
  }

  private async generateNextBestActions(
    lead: Lead, 
    score: LeadScore, 
    qualification: QualificationStatus
  ): Promise<NextBestAction[]> {
    const actions: NextBestAction[] = [];
    const now = new Date();

    // High-scoring leads get immediate sales actions
    if (score.total >= 80) {
      actions.push({
        id: `call-${lead.id}-${now.getTime()}`,
        type: 'call',
        title: 'Schedule Discovery Call',
        description: 'High-intent lead ready for sales conversation',
        priority: Priority.HIGH,
        confidence: 0.9,
        reasoning: `Lead score of ${score.total} indicates strong purchase intent`,
        suggestedAt: now,
        dueDate: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours
        metadata: { urgency: 'high', expectedDuration: 30 }
      });
    }

    // Medium-scoring leads get nurturing actions
    if (score.total >= 60 && score.total < 80) {
      actions.push({
        id: `email-${lead.id}-${now.getTime()}`,
        type: 'email',
        title: 'Send Personalized Follow-up',
        description: 'Nurture with relevant content based on engagement',
        priority: Priority.MEDIUM,
        confidence: 0.8,
        reasoning: `Engagement score of ${score.engagement} suggests interest`,
        suggestedAt: now,
        dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
        metadata: { template: 'nurture_sequence', personalization: true }
      });
    }

    // Low engagement leads get re-engagement actions
    if (score.engagement < 50) {
      actions.push({
        id: `nurture-${lead.id}-${now.getTime()}`,
        type: 'nurture',
        title: 'Re-engagement Campaign',
        description: 'Automated sequence to rebuild interest',
        priority: Priority.LOW,
        confidence: 0.6,
        reasoning: `Low engagement score (${score.engagement}) requires re-activation`,
        suggestedAt: now,
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        metadata: { campaign: 'reactivation', duration: 14 }
      });
    }

    // Qualified leads get demo scheduling
    if (qualification === QualificationStatus.SALES_QUALIFIED) {
      actions.push({
        id: `demo-${lead.id}-${now.getTime()}`,
        type: 'demo',
        title: 'Schedule Product Demo',
        description: 'Qualified lead ready for product demonstration',
        priority: Priority.HIGH,
        confidence: 0.95,
        reasoning: `Sales qualified status with ${score.total} score indicates demo readiness`,
        suggestedAt: now,
        dueDate: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours
        metadata: { demoType: 'personalized', duration: 45 }
      });
    }

    return actions.slice(0, 3); // Return top 3 actions
  }

  private getUpdatePriority(scoreChange: number): Priority {
    if (Math.abs(scoreChange) >= 20) return Priority.HIGH;
    if (Math.abs(scoreChange) >= 10) return Priority.MEDIUM;
    return Priority.LOW;
  }

  private isQualificationImprovement(
    oldQualification: QualificationStatus, 
    newQualification: QualificationStatus
  ): boolean {
    const qualificationOrder = [
      QualificationStatus.UNQUALIFIED,
      QualificationStatus.OPPORTUNITY,
      QualificationStatus.MARKETING_QUALIFIED,
      QualificationStatus.SALES_QUALIFIED
    ];

    const oldIndex = qualificationOrder.indexOf(oldQualification);
    const newIndex = qualificationOrder.indexOf(newQualification);
    
    return newIndex > oldIndex;
  }

  // Cleanup
  public destroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    this.removeAllListeners();
    this.activeLeads.clear();
    this.notifications = [];
  }
}

// Factory function to create CRM Dashboard Integration
export function createCRMDashboardIntegration(
  leadAgent: LeadManagementAgent,
  leadCaptureService: LeadCaptureService,
  config?: Partial<CRMDashboardConfig>
): CRMDashboardIntegration {
  const defaultConfig: CRMDashboardConfig = {
    enableRealTimeUpdates: true,
    enableNotifications: true,
    enableAutoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    notificationThresholds: {
      highScoreThreshold: 75,
      hotSignalThreshold: 0.7,
      urgentActionThreshold: 0.8
    }
  };

  const finalConfig = { ...defaultConfig, ...config };
  return new CRMDashboardIntegration(finalConfig, leadAgent, leadCaptureService);
}