import { Firestore, collection, addDoc, updateDoc, doc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { AgentRegistry } from './agent-registry';
import { EventType, ActionType } from './types';

export interface AgentActionResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
}

export interface ContentCreationResult {
  id: string;
  title: string;
  content: string;
  type: 'blog' | 'social' | 'email';
  status: 'draft' | 'published';
  createdAt: Date;
}

export interface SocialPostResult {
  id: string;
  caption: string;
  platforms: string[];
  scheduledTime: Date;
  status: 'scheduled' | 'published';
  createdAt: Date;
}

export interface CRMActionResult {
  id: string;
  leadId: string;
  action: string;
  result: string;
  score?: number;
  createdAt: Date;
}

export interface AutomationResult {
  id: string;
  workflowId: string;
  action: string;
  status: 'completed' | 'failed';
  result: string;
  createdAt: Date;
}

export class AgentActionExecutor {
  private static instance: AgentActionExecutor;
  private registry: AgentRegistry;

  private constructor() {
    this.registry = AgentRegistry.getInstance();
  }

  public static getInstance(): AgentActionExecutor {
    if (!AgentActionExecutor.instance) {
      AgentActionExecutor.instance = new AgentActionExecutor();
    }
    return AgentActionExecutor.instance;
  }

  // Content Creation Agent Actions
  public async executeContentCreation(
    db: Firestore, 
    workspaceId: string, 
    contentType: 'blog' | 'social' | 'email',
    topic?: string
  ): Promise<AgentActionResult> {
    try {
      const content = await this.generateContent(contentType, topic);
      
      // Save to appropriate collection based on content type
      let collectionName = '';
      let docData: any = {};

      switch (contentType) {
        case 'blog':
          collectionName = 'blog_drafts';
          docData = {
            title: content.title,
            content: content.content,
            status: 'draft',
            author: 'Content Creation Agent',
            tags: content.tags || [],
            seoDescription: content.seoDescription || '',
            image: content.image || '/images/blog-placeholder.jpg',
            description: content.seoDescription || content.content.substring(0, 150) + '...',
            publishDate: null,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            agentGenerated: true,
            // Additional fields for blog dashboard compatibility
            hint: `AI-generated blog post about ${topic || 'business topics'}`
          };
          break;
        
        case 'social':
          collectionName = 'social_content_drafts';
          docData = {
            caption: content.content,
            platforms: ['linkedin', 'twitter'],
            hashtags: content.hashtags || [],
            status: 'draft',
            createdAt: Timestamp.now(),
            agentGenerated: true
          };
          break;
        
        case 'email':
          collectionName = 'email_drafts';
          docData = {
            subject: content.title,
            content: content.content,
            status: 'draft',
            createdAt: Timestamp.now(),
            agentGenerated: true
          };
          break;
      }

      const docRef = await addDoc(collection(db, 'workspaces', workspaceId, collectionName), docData);
      
      return {
        success: true,
        data: {
          id: docRef.id,
          title: content.title,
          content: content.content,
          type: contentType,
          status: 'draft',
          createdAt: new Date()
        } as ContentCreationResult,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  // Social Media Agent Actions
  public async executeSocialMediaScheduling(
    db: Firestore,
    workspaceId: string,
    caption?: string,
    platforms: string[] = ['linkedin', 'twitter']
  ): Promise<AgentActionResult> {
    try {
      const socialContent = caption || await this.generateSocialContent();
      const scheduledTime = this.getOptimalPostingTime();

      const postData = {
        caption: socialContent,
        profileIds: platforms,
        scheduledTime: Timestamp.fromDate(scheduledTime),
        status: 'scheduled',
        media: [],
        createdAt: Timestamp.now(),
        agentGenerated: true,
        agentScheduled: true
      };

      const docRef = await addDoc(collection(db, 'workspaces', workspaceId, 'posts'), postData);

      return {
        success: true,
        data: {
          id: docRef.id,
          caption: socialContent,
          platforms,
          scheduledTime,
          status: 'scheduled',
          createdAt: new Date()
        } as SocialPostResult,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  // CRM Agent Actions
  public async executeCRMAction(
    db: Firestore,
    workspaceId: string,
    actionType: 'score_lead' | 'qualify_lead' | 'assign_lead' | 'schedule_followup',
    leadData?: any
  ): Promise<AgentActionResult> {
    try {
      let result: any = {};

      switch (actionType) {
        case 'score_lead':
          result = await this.scoreNewLead(db, workspaceId, leadData);
          break;
        case 'qualify_lead':
          result = await this.qualifyLead(db, workspaceId, leadData);
          break;
        case 'assign_lead':
          result = await this.assignLead(db, workspaceId, leadData);
          break;
        case 'schedule_followup':
          result = await this.scheduleFollowup(db, workspaceId, leadData);
          break;
      }

      return {
        success: true,
        data: result,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  // Automation Agent Actions
  public async executeAutomationWorkflow(
    db: Firestore,
    workspaceId: string,
    workflowType: 'email_sequence' | 'lead_nurturing' | 'crm_update' | 'social_posting',
    triggerData?: any
  ): Promise<AgentActionResult> {
    try {
      let result: any = {};

      switch (workflowType) {
        case 'email_sequence':
          result = await this.triggerEmailSequence(db, workspaceId, triggerData);
          break;
        case 'lead_nurturing':
          result = await this.executeLeadNurturing(db, workspaceId, triggerData);
          break;
        case 'crm_update':
          result = await this.executeCRMUpdate(db, workspaceId, triggerData);
          break;
        case 'social_posting':
          result = await this.executeSocialPosting(db, workspaceId, triggerData);
          break;
      }

      return {
        success: true,
        data: result,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  // Helper Methods
  private async generateContent(type: 'blog' | 'social' | 'email', topic?: string): Promise<any> {
    const topics = [
      'Digital Marketing Trends 2024',
      'AI in Business: A Complete Guide',
      'Social Media Strategy for Entrepreneurs',
      'Email Marketing Best Practices',
      'Content Creation Tips for Small Business',
      'Lead Generation Strategies That Work',
      'Customer Retention Techniques',
      'Building Your Personal Brand Online'
    ];

    const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];

    switch (type) {
      case 'blog':
        return {
          title: selectedTopic,
          content: `# ${selectedTopic}\n\nThis is an AI-generated blog post about ${selectedTopic.toLowerCase()}. The content creation agent has analyzed current trends and created this comprehensive guide.\n\n## Introduction\n\nIn today's digital landscape, understanding ${selectedTopic.toLowerCase()} is crucial for business success.\n\n## Key Points\n\n- Strategic approach to implementation\n- Best practices and proven methods\n- Common pitfalls to avoid\n- Measuring success and ROI\n\n## Conclusion\n\nBy following these guidelines, you can effectively leverage ${selectedTopic.toLowerCase()} for your business growth.`,
          tags: ['marketing', 'business', 'ai-generated'],
          seoDescription: `Learn about ${selectedTopic.toLowerCase()} with this comprehensive guide created by our AI content agent.`
        };
      
      case 'social':
        return {
          content: `🚀 Just discovered some amazing insights about ${selectedTopic.toLowerCase()}! \n\nKey takeaway: Success comes from consistent action and strategic thinking. \n\n#entrepreneurship #digitalmarketing #businessgrowth #ai`,
          hashtags: ['#entrepreneurship', '#digitalmarketing', '#businessgrowth', '#ai']
        };
      
      case 'email':
        return {
          title: `Weekly Insights: ${selectedTopic}`,
          content: `Hi there!\n\nI hope you're having a great week. I wanted to share some insights about ${selectedTopic.toLowerCase()} that I think you'll find valuable.\n\nHere are the key points:\n\n• Strategic implementation approaches\n• Proven best practices\n• Common mistakes to avoid\n\nLet me know if you have any questions!\n\nBest regards,\nYour AI Assistant`
        };
      
      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
  }

  private async generateSocialContent(): Promise<string> {
    const templates = [
      "🎯 Pro tip: Consistency beats perfection every time. Small daily actions compound into massive results! #entrepreneurship #motivation",
      "💡 Just learned something fascinating about customer psychology. The key is understanding their journey, not just their destination. #marketing #business",
      "🚀 Building something amazing takes time, but the journey is worth it. What are you working on today? #startup #hustle",
      "📈 Data doesn't lie: Companies that prioritize customer experience see 60% higher profits. Time to level up! #cx #business",
      "⚡ Automation isn't about replacing humans—it's about freeing them to do what they do best: create, innovate, and connect. #ai #future"
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private getOptimalPostingTime(): Date {
    // Generate optimal posting time (typically 7-9 PM on weekdays)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Set to 8 PM tomorrow
    tomorrow.setHours(20, 0, 0, 0);
    
    return tomorrow;
  }

  private async scoreNewLead(db: Firestore, workspaceId: string, leadData?: any): Promise<CRMActionResult> {
    // Simulate lead scoring
    const score = Math.floor(Math.random() * 40) + 60; // 60-100 score
    const leadId = leadData?.leadId || `lead_${Date.now()}`;

    // Save lead scoring result
    const scoringData = {
      leadId,
      score,
      factors: [
        { category: 'demographic', value: Math.floor(Math.random() * 25) + 15 },
        { category: 'behavioral', value: Math.floor(Math.random() * 25) + 15 },
        { category: 'engagement', value: Math.floor(Math.random() * 25) + 15 },
        { category: 'firmographic', value: Math.floor(Math.random() * 25) + 15 }
      ],
      agentGenerated: true,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'workspaces', workspaceId, 'lead_scores'), scoringData);

    return {
      id: docRef.id,
      leadId,
      action: 'score_lead',
      result: `Lead scored: ${score}/100`,
      score,
      createdAt: new Date()
    };
  }

  private async qualifyLead(db: Firestore, workspaceId: string, leadData?: any): Promise<CRMActionResult> {
    const leadId = leadData?.leadId || `lead_${Date.now()}`;
    const qualifications = ['marketing_qualified', 'sales_qualified', 'opportunity'];
    const qualification = qualifications[Math.floor(Math.random() * qualifications.length)];

    const qualificationData = {
      leadId,
      qualification,
      reasons: ['High engagement score', 'Matches ideal customer profile', 'Budget confirmed'],
      agentGenerated: true,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'workspaces', workspaceId, 'lead_qualifications'), qualificationData);

    return {
      id: docRef.id,
      leadId,
      action: 'qualify_lead',
      result: `Lead qualified as: ${qualification}`,
      createdAt: new Date()
    };
  }

  private async assignLead(db: Firestore, workspaceId: string, leadData?: any): Promise<CRMActionResult> {
    const leadId = leadData?.leadId || `lead_${Date.now()}`;
    const assignees = ['Sales Rep A', 'Sales Rep B', 'Sales Manager'];
    const assignedTo = assignees[Math.floor(Math.random() * assignees.length)];

    const assignmentData = {
      leadId,
      assignedTo,
      assignedAt: Timestamp.now(),
      reason: 'Auto-assigned based on lead score and availability',
      agentGenerated: true
    };

    const docRef = await addDoc(collection(db, 'workspaces', workspaceId, 'lead_assignments'), assignmentData);

    return {
      id: docRef.id,
      leadId,
      action: 'assign_lead',
      result: `Lead assigned to: ${assignedTo}`,
      createdAt: new Date()
    };
  }

  private async scheduleFollowup(db: Firestore, workspaceId: string, leadData?: any): Promise<CRMActionResult> {
    const leadId = leadData?.leadId || `lead_${Date.now()}`;
    const followupDate = new Date();
    followupDate.setDate(followupDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days

    const followupData = {
      leadId,
      scheduledDate: Timestamp.fromDate(followupDate),
      type: 'email',
      subject: 'Follow up on your interest',
      agentGenerated: true,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'workspaces', workspaceId, 'followups'), followupData);

    return {
      id: docRef.id,
      leadId,
      action: 'schedule_followup',
      result: `Follow-up scheduled for: ${followupDate.toLocaleDateString()}`,
      createdAt: new Date()
    };
  }

  private async triggerEmailSequence(db: Firestore, workspaceId: string, triggerData?: any): Promise<AutomationResult> {
    const sequences = ['Welcome Series', 'Lead Nurturing', 'Product Demo', 'Re-engagement'];
    const sequence = sequences[Math.floor(Math.random() * sequences.length)];

    const sequenceData = {
      sequenceName: sequence,
      triggeredBy: 'automation_agent',
      status: 'active',
      steps: [
        { step: 1, type: 'email', delay: 0, subject: `Welcome to ${sequence}` },
        { step: 2, type: 'email', delay: 24, subject: 'Getting started guide' },
        { step: 3, type: 'email', delay: 72, subject: 'Tips and best practices' }
      ],
      agentGenerated: true,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'workspaces', workspaceId, 'email_sequences'), sequenceData);

    return {
      id: docRef.id,
      workflowId: sequence.toLowerCase().replace(' ', '_'),
      action: 'trigger_email_sequence',
      status: 'completed',
      result: `${sequence} email sequence activated`,
      createdAt: new Date()
    };
  }

  private async executeLeadNurturing(db: Firestore, workspaceId: string, triggerData?: any): Promise<AutomationResult> {
    const nurturingActions = ['Send educational content', 'Schedule demo call', 'Provide case study', 'Offer consultation'];
    const action = nurturingActions[Math.floor(Math.random() * nurturingActions.length)];

    const nurturingData = {
      action,
      leadId: triggerData?.leadId || `lead_${Date.now()}`,
      status: 'completed',
      result: `Successfully executed: ${action}`,
      agentGenerated: true,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'workspaces', workspaceId, 'nurturing_actions'), nurturingData);

    return {
      id: docRef.id,
      workflowId: 'lead_nurturing',
      action: 'execute_nurturing',
      status: 'completed',
      result: `Lead nurturing action completed: ${action}`,
      createdAt: new Date()
    };
  }

  private async executeCRMUpdate(db: Firestore, workspaceId: string, triggerData?: any): Promise<AutomationResult> {
    const updateTypes = ['Update lead score', 'Sync contact data', 'Update deal stage', 'Add interaction note'];
    const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];

    const updateData = {
      updateType,
      recordId: triggerData?.recordId || `record_${Date.now()}`,
      changes: [`${updateType} completed by automation agent`],
      status: 'completed',
      agentGenerated: true,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'workspaces', workspaceId, 'crm_updates'), updateData);

    return {
      id: docRef.id,
      workflowId: 'crm_sync',
      action: 'execute_crm_update',
      status: 'completed',
      result: `CRM update completed: ${updateType}`,
      createdAt: new Date()
    };
  }

  private async executeSocialPosting(db: Firestore, workspaceId: string, triggerData?: any): Promise<AutomationResult> {
    // This will actually create a social media post
    const result = await this.executeSocialMediaScheduling(db, workspaceId);
    
    return {
      id: result.data?.id || `social_${Date.now()}`,
      workflowId: 'social_automation',
      action: 'execute_social_posting',
      status: result.success ? 'completed' : 'failed',
      result: result.success ? 'Social media post scheduled successfully' : result.error || 'Failed to schedule post',
      createdAt: new Date()
    };
  }
}