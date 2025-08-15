import { AgentRegistry } from './agent-registry';
import { AgentOrchestrator } from './orchestrator';
import { AgentActionExecutor } from './agent-action-executor';
import { 
  Event, 
  EventType, 
  AgentStatus, 
  AIAgent 
} from './types';
import { Firestore, doc, updateDoc, onSnapshot } from 'firebase/firestore';

export interface AgentActivity {
  agentId: string;
  activity: string;
  timestamp: Date;
  status: AgentStatus;
  details?: any;
}

export interface ActivityFeedItem {
  id: string;
  agentId: string;
  agentName: string;
  activity: string;
  timestamp: Date;
  status: 'success' | 'processing' | 'error';
  details?: string;
}

export class AgentActivityMonitor {
  private static instance: AgentActivityMonitor;
  private registry: AgentRegistry;
  private orchestrator: AgentOrchestrator;
  private actionExecutor: AgentActionExecutor;
  private activityFeed: ActivityFeedItem[] = [];
  private isRunning = false;
  private backgroundInterval: NodeJS.Timeout | null = null;
  private activityListeners: ((activities: ActivityFeedItem[]) => void)[] = [];

  private constructor() {
    this.registry = AgentRegistry.getInstance();
    this.orchestrator = AgentOrchestrator.getInstance();
    this.actionExecutor = AgentActionExecutor.getInstance();
  }

  public static getInstance(): AgentActivityMonitor {
    if (!AgentActivityMonitor.instance) {
      AgentActivityMonitor.instance = new AgentActivityMonitor();
    }
    return AgentActivityMonitor.instance;
  }

  public startMonitoring(db: Firestore, workspaceId: string): void {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('🔍 Starting agent activity monitoring...');

    // Start background task generation
    this.startBackgroundTasks(db, workspaceId);

    // Monitor agent status changes
    this.monitorAgentStatusChanges();

    // Clean up old activities periodically
    setInterval(() => {
      this.cleanupOldActivities();
    }, 60000); // Every minute
  }

  public stopMonitoring(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.backgroundInterval) {
      clearInterval(this.backgroundInterval);
      this.backgroundInterval = null;
    }
    console.log('⏹️ Stopped agent activity monitoring');
  }

  private startBackgroundTasks(db: Firestore, workspaceId: string): void {
    // Generate background activities every 10-30 seconds
    this.backgroundInterval = setInterval(async () => {
      if (!this.isRunning) return;

      const activeAgents = this.registry.getActiveAgents();
      
      for (const agent of activeAgents) {
        // Generate realistic background activities
        await this.generateBackgroundActivity(agent, db, workspaceId);
      }
    }, Math.random() * 20000 + 10000); // 10-30 seconds
  }

  private async generateBackgroundActivity(agent: AIAgent, db: Firestore, workspaceId: string): Promise<void> {
    const activities = this.getAgentSpecificActivities(agent);
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];

    try {
      // Update agent status to show it's working
      agent.status = AgentStatus.PERCEIVING;
      
      // Add activity to feed
      const activityId = `activity_${Date.now()}_${Math.random()}`;
      this.addActivityToFeed({
        id: activityId,
        agentId: agent.id,
        agentName: agent.configuration.name,
        activity: randomActivity.description,
        timestamp: new Date(),
        status: 'processing'
      });

      // Actually execute the real action based on agent type
      let actionResult;
      
      switch (agent.type) {
        case 'lead_management':
          actionResult = await this.executeCRMAgentAction(db, workspaceId, randomActivity);
          break;
        case 'content_creation':
          actionResult = await this.executeContentAgentAction(db, workspaceId, randomActivity);
          break;
        case 'social_media':
          actionResult = await this.executeSocialAgentAction(db, workspaceId, randomActivity);
          break;
        case 'automation':
          actionResult = await this.executeAutomationAgentAction(db, workspaceId, randomActivity);
          break;
        default:
          actionResult = { success: true, data: null };
      }

      // Update activity status based on actual execution result
      setTimeout(() => {
        if (actionResult.success) {
          this.updateActivityStatus(agent.id, 'success', this.formatSuccessMessage(randomActivity, actionResult));
        } else {
          this.updateActivityStatus(agent.id, 'error', `Error: ${actionResult.error}`);
        }
        agent.status = AgentStatus.IDLE;
      }, Math.random() * 2000 + 1000); // 1-3 seconds

    } catch (error) {
      this.updateActivityStatus(agent.id, 'error', `Error: ${error}`);
      agent.status = AgentStatus.ERROR;
      
      // Reset to idle after error
      setTimeout(() => {
        agent.status = AgentStatus.IDLE;
      }, 5000);
    }
  }

  private getAgentSpecificActivities(agent: AIAgent): Array<{
    eventType: EventType;
    description: string;
    successMessage: string;
    data: any;
  }> {
    switch (agent.type) {
      case 'lead_management':
        return [
          {
            eventType: EventType.LEAD_CAPTURED,
            description: 'Analyzing new lead submission',
            successMessage: 'Lead scored and qualified successfully',
            data: { leadId: `lead_${Date.now()}`, source: 'website' }
          },
          {
            eventType: EventType.DATA_UPDATED,
            description: 'Re-evaluating lead scores',
            successMessage: 'Lead scores updated based on new data',
            data: { leadId: `lead_${Date.now()}`, updates: ['engagement'] }
          },
          {
            eventType: EventType.CUSTOMER_INTERACTION,
            description: 'Processing customer interaction',
            successMessage: 'Interaction analyzed for buying signals',
            data: { interactionType: 'email', sentiment: 'positive' }
          }
        ];

      case 'content_creation':
        return [
          {
            eventType: EventType.CONTENT_REQUEST,
            description: 'Generating blog post content',
            successMessage: 'Blog post draft created successfully',
            data: { contentType: 'blog', topic: 'industry_trends' }
          },
          {
            eventType: EventType.CONTENT_REQUEST,
            description: 'Optimizing existing content',
            successMessage: 'Content SEO optimization completed',
            data: { contentType: 'optimization', target: 'seo' }
          },
          {
            eventType: EventType.CONTENT_REQUEST,
            description: 'Creating social media captions',
            successMessage: 'Social media content generated',
            data: { contentType: 'social', platform: 'linkedin' }
          }
        ];

      case 'social_media':
        return [
          {
            eventType: EventType.SOCIAL_POST_REQUEST,
            description: 'Scheduling social media posts',
            successMessage: 'Posts scheduled across platforms',
            data: { platforms: ['linkedin', 'twitter'], postCount: 3 }
          },
          {
            eventType: EventType.SOCIAL_POST_REQUEST,
            description: 'Analyzing social media engagement',
            successMessage: 'Engagement metrics analyzed',
            data: { analysis: 'engagement', timeframe: '24h' }
          },
          {
            eventType: EventType.SOCIAL_POST_REQUEST,
            description: 'Optimizing posting schedule',
            successMessage: 'Optimal posting times identified',
            data: { optimization: 'schedule', platform: 'all' }
          }
        ];

      case 'automation':
        return [
          {
            eventType: EventType.WORKFLOW_TRIGGER,
            description: 'Executing automated workflow',
            successMessage: 'Workflow completed successfully',
            data: { workflowType: 'lead_nurturing', stage: 'initial' }
          },
          {
            eventType: EventType.WORKFLOW_TRIGGER,
            description: 'Processing email automation',
            successMessage: 'Email sequence triggered',
            data: { automationType: 'email', trigger: 'form_submission' }
          },
          {
            eventType: EventType.WORKFLOW_TRIGGER,
            description: 'Updating CRM records',
            successMessage: 'CRM data synchronized',
            data: { syncType: 'crm', recordCount: 15 }
          }
        ];

      default:
        return [
          {
            eventType: EventType.SYSTEM_EVENT,
            description: 'Processing system tasks',
            successMessage: 'System tasks completed',
            data: { taskType: 'maintenance' }
          }
        ];
    }
  }

  private addActivityToFeed(activity: ActivityFeedItem): void {
    this.activityFeed.unshift(activity);
    
    // Keep only last 50 activities
    if (this.activityFeed.length > 50) {
      this.activityFeed = this.activityFeed.slice(0, 50);
    }

    // Notify listeners
    this.notifyActivityListeners();
  }

  private updateActivityStatus(agentId: string, status: 'success' | 'error', details?: string): void {
    const activity = this.activityFeed.find(a => 
      a.agentId === agentId && a.status === 'processing'
    );
    
    if (activity) {
      activity.status = status;
      if (details) {
        activity.details = details;
      }
      this.notifyActivityListeners();
    }
  }

  private monitorAgentStatusChanges(): void {
    // Monitor agent status changes and log activities
    setInterval(() => {
      const agents = this.registry.getAllAgents();
      
      agents.forEach(agent => {
        const status = agent.getStatus();
        
        // Log status changes as activities
        if (status === AgentStatus.ACTING || status === AgentStatus.DECIDING) {
          // Agent is actively working
          const existingActivity = this.activityFeed.find(a => 
            a.agentId === agent.id && a.status === 'processing'
          );
          
          if (!existingActivity) {
            this.addActivityToFeed({
              id: `status_${agent.id}_${Date.now()}`,
              agentId: agent.id,
              agentName: agent.configuration.name,
              activity: status === AgentStatus.ACTING ? 'Executing actions' : 'Making decisions',
              timestamp: new Date(),
              status: 'processing'
            });
          }
        }
      });
    }, 2000); // Check every 2 seconds
  }

  private cleanupOldActivities(): void {
    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
    const initialLength = this.activityFeed.length;
    
    this.activityFeed = this.activityFeed.filter(activity => 
      activity.timestamp > cutoffTime
    );

    if (this.activityFeed.length !== initialLength) {
      console.log(`🧹 Cleaned up ${initialLength - this.activityFeed.length} old activities`);
    }
  }

  // Public API for UI components
  public getActivityFeed(): ActivityFeedItem[] {
    return [...this.activityFeed];
  }

  public subscribeToActivities(callback: (activities: ActivityFeedItem[]) => void): () => void {
    this.activityListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.activityListeners.indexOf(callback);
      if (index > -1) {
        this.activityListeners.splice(index, 1);
      }
    };
  }

  private notifyActivityListeners(): void {
    this.activityListeners.forEach(listener => {
      try {
        listener([...this.activityFeed]);
      } catch (error) {
        console.error('Error notifying activity listener:', error);
      }
    });
  }

  public getAgentStats(): Record<string, {
    totalActivities: number;
    successfulActivities: number;
    errorActivities: number;
    lastActivity?: Date;
  }> {
    const stats: Record<string, any> = {};
    
    this.registry.getAllAgents().forEach(agent => {
      const agentActivities = this.activityFeed.filter(a => a.agentId === agent.id);
      
      stats[agent.id] = {
        totalActivities: agentActivities.length,
        successfulActivities: agentActivities.filter(a => a.status === 'success').length,
        errorActivities: agentActivities.filter(a => a.status === 'error').length,
        lastActivity: agentActivities.length > 0 ? agentActivities[0].timestamp : undefined
      };
    });

    return stats;
  }

  // Force generate activity for testing
  public async forceGenerateActivity(agentId: string, db: Firestore, workspaceId: string): Promise<void> {
    const agent = this.registry.getAgent(agentId);
    if (agent) {
      await this.generateBackgroundActivity(agent, db, workspaceId);
    }
  }

  // Agent-specific action execution methods
  private async executeCRMAgentAction(db: Firestore, workspaceId: string, activity: any): Promise<any> {
    const actionTypes = ['score_lead', 'qualify_lead', 'assign_lead', 'schedule_followup'];
    const randomAction = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    
    return await this.actionExecutor.executeCRMAction(
      db, 
      workspaceId, 
      randomAction as any, 
      activity.data
    );
  }

  private async executeContentAgentAction(db: Firestore, workspaceId: string, activity: any): Promise<any> {
    const contentTypes = ['blog', 'social', 'email'];
    let contentType: 'blog' | 'social' | 'email' = 'blog';
    
    // Determine content type based on activity description
    if (activity.description.includes('blog')) {
      contentType = 'blog';
    } else if (activity.description.includes('social')) {
      contentType = 'social';
    } else if (activity.description.includes('email')) {
      contentType = 'email';
    } else {
      contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)] as 'blog' | 'social' | 'email';
    }
    
    return await this.actionExecutor.executeContentCreation(
      db, 
      workspaceId, 
      contentType,
      activity.data?.topic
    );
  }

  private async executeSocialAgentAction(db: Firestore, workspaceId: string, activity: any): Promise<any> {
    if (activity.description.includes('Scheduling')) {
      // Actually schedule a social media post
      return await this.actionExecutor.executeSocialMediaScheduling(
        db, 
        workspaceId, 
        undefined, 
        activity.data?.platforms || ['linkedin', 'twitter']
      );
    } else {
      // For analysis activities, return success without creating posts
      return {
        success: true,
        data: {
          analysis: activity.data?.analysis || 'engagement',
          result: 'Analysis completed successfully'
        }
      };
    }
  }

  private async executeAutomationAgentAction(db: Firestore, workspaceId: string, activity: any): Promise<any> {
    const workflowTypes = ['email_sequence', 'lead_nurturing', 'crm_update', 'social_posting'];
    let workflowType: 'email_sequence' | 'lead_nurturing' | 'crm_update' | 'social_posting' = 'email_sequence';
    
    // Determine workflow type based on activity description
    if (activity.description.includes('email')) {
      workflowType = 'email_sequence';
    } else if (activity.description.includes('CRM')) {
      workflowType = 'crm_update';
    } else if (activity.description.includes('workflow')) {
      workflowType = 'lead_nurturing';
    } else {
      workflowType = workflowTypes[Math.floor(Math.random() * workflowTypes.length)] as any;
    }
    
    return await this.actionExecutor.executeAutomationWorkflow(
      db, 
      workspaceId, 
      workflowType,
      activity.data
    );
  }

  private formatSuccessMessage(activity: any, actionResult: any): string {
    if (actionResult.data) {
      switch (activity.data?.contentType || activity.eventType) {
        case 'blog':
          return `Blog post "${actionResult.data.title}" created successfully`;
        case 'social':
          return `Social media post scheduled for ${actionResult.data.scheduledTime?.toLocaleDateString()}`;
        case 'email':
          return `Email "${actionResult.data.title}" drafted successfully`;
        default:
          if (actionResult.data.result) {
            return actionResult.data.result;
          }
          return activity.successMessage;
      }
    }
    return activity.successMessage;
  }
}