/**
 * Follow-up Sequence Trigger System
 * Automated email and action sequences
 */

export interface SequenceStep {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'webhook' | 'task' | 'tag' | 'wait' | 'condition';
  delay: number; // in minutes from previous step
  config: StepConfig;
  conditions?: SequenceCondition[];
  active: boolean;
}

export interface StepConfig {
  // Email config
  subject?: string;
  content?: string;
  template?: string;
  fromName?: string;
  fromEmail?: string;

  // SMS config
  message?: string;

  // Webhook config
  url?: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  payload?: any;

  // Task config
  title?: string;
  description?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';

  // Tag config
  tags?: string[];
  action?: 'add' | 'remove';

  // Wait config
  waitFor?: 'time' | 'event' | 'condition';
  waitValue?: number | string;

  // Condition config
  conditionType?: 'email_opened' | 'link_clicked' | 'form_submitted' | 'tag_added' | 'custom';
  conditionValue?: any;
  trueStep?: string; // Next step if condition is true
  falseStep?: string; // Next step if condition is false
}

export interface SequenceCondition {
  type: 'tag_exists' | 'field_equals' | 'email_opened' | 'link_clicked' | 'time_since' | 'custom';
  field?: string;
  operator?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value?: any;
  negate?: boolean;
}

export interface FollowUpSequence {
  id: string;
  name: string;
  description: string;
  trigger: SequenceTrigger;
  steps: SequenceStep[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  stats: SequenceStats;
}

export interface SequenceTrigger {
  type: 'form_submission' | 'purchase' | 'tag_added' | 'date_based' | 'behavior' | 'manual';
  conditions: TriggerCondition[];
  delay?: number; // Initial delay before starting sequence
}

export interface TriggerCondition {
  type: 'form_id' | 'product_id' | 'tag' | 'user_segment' | 'custom_field' | 'behavior';
  field?: string;
  operator?: 'equals' | 'contains' | 'in' | 'not_in';
  value?: any;
}

export interface SequenceEnrollment {
  id: string;
  sequenceId: string;
  contactId: string;
  status: 'active' | 'completed' | 'paused' | 'failed';
  currentStepId?: string;
  nextStepAt?: Date;
  enrolledAt: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
}

export interface SequenceStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  completionRate: number;
  averageCompletionTime: number; // in hours
  stepStats: Map<string, StepStats>;
}

export interface StepStats {
  stepId: string;
  executed: number;
  successful: number;
  failed: number;
  skipped: number;
  successRate: number;
  averageExecutionTime: number;
}

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags: string[];
  customFields: Record<string, any>;
  lastActivity?: Date;
  status: 'active' | 'unsubscribed' | 'bounced' | 'complained';
}

export interface ExecutionResult {
  success: boolean;
  error?: string;
  data?: any;
  nextStepId?: string;
  delay?: number;
}

export class FollowUpSequenceSystem {
  private sequences: Map<string, FollowUpSequence> = new Map();
  private enrollments: Map<string, SequenceEnrollment> = new Map();
  private contacts: Map<string, Contact> = new Map();
  private scheduledTasks: Map<string, NodeJS.Timeout> = new Map();
  private executionQueue: Array<{ enrollmentId: string; stepId: string; executeAt: Date }> = [];

  /**
   * Create a new follow-up sequence
   */
  createSequence(config: {
    name: string;
    description: string;
    trigger: SequenceTrigger;
    steps: Omit<SequenceStep, 'id'>[];
  }): FollowUpSequence {
    const sequence: FollowUpSequence = {
      id: this.generateId(),
      name: config.name,
      description: config.description,
      trigger: config.trigger,
      steps: config.steps.map(step => ({
        ...step,
        id: this.generateId()
      })),
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        totalEnrollments: 0,
        activeEnrollments: 0,
        completedEnrollments: 0,
        completionRate: 0,
        averageCompletionTime: 0,
        stepStats: new Map()
      }
    };

    this.sequences.set(sequence.id, sequence);
    return sequence;
  }

  /**
   * Create welcome email sequence
   */
  createWelcomeSequence(config: {
    name: string;
    triggerFormId: string;
    emails: {
      subject: string;
      content: string;
      delay: number; // in hours
    }[];
  }): FollowUpSequence {
    const steps: Omit<SequenceStep, 'id'>[] = config.emails.map((email, index) => ({
      name: `Welcome Email ${index + 1}`,
      type: 'email',
      delay: index === 0 ? 0 : email.delay * 60, // Convert hours to minutes
      config: {
        subject: email.subject,
        content: email.content,
        template: 'welcome'
      },
      active: true
    }));

    return this.createSequence({
      name: config.name,
      description: 'Welcome sequence for new subscribers',
      trigger: {
        type: 'form_submission',
        conditions: [
          {
            type: 'form_id',
            operator: 'equals',
            value: config.triggerFormId
          }
        ]
      },
      steps
    });
  }

  /**
   * Create abandoned cart sequence
   */
  createAbandonedCartSequence(config: {
    name: string;
    productIds?: string[];
    emails: {
      subject: string;
      content: string;
      delay: number; // in hours
      incentive?: {
        type: 'discount' | 'free_shipping';
        value: number;
      };
    }[];
  }): FollowUpSequence {
    const steps: Omit<SequenceStep, 'id'>[] = [];

    // Add initial wait step
    steps.push({
      name: 'Wait for Cart Abandonment',
      type: 'wait',
      delay: 30, // 30 minutes
      config: {
        waitFor: 'time',
        waitValue: 30
      },
      active: true
    });

    // Add email steps
    config.emails.forEach((email, index) => {
      steps.push({
        name: `Abandoned Cart Email ${index + 1}`,
        type: 'email',
        delay: email.delay * 60, // Convert hours to minutes
        config: {
          subject: email.subject,
          content: email.content,
          template: 'abandoned_cart'
        },
        active: true
      });

      // Add incentive if provided
      if (email.incentive) {
        steps.push({
          name: `Apply ${email.incentive.type}`,
          type: 'tag',
          delay: 0,
          config: {
            tags: [`incentive_${email.incentive.type}_${email.incentive.value}`],
            action: 'add'
          },
          active: true
        });
      }
    });

    return this.createSequence({
      name: config.name,
      description: 'Recover abandoned carts with targeted emails',
      trigger: {
        type: 'behavior',
        conditions: [
          {
            type: 'behavior',
            value: 'cart_abandoned'
          },
          ...(config.productIds ? [{
            type: 'product_id' as const,
            operator: 'in' as const,
            value: config.productIds
          }] : [])
        ]
      },
      steps
    });
  }

  /**
   * Create nurture sequence
   */
  createNurtureSequence(config: {
    name: string;
    userSegment: string;
    content: {
      type: 'email' | 'sms';
      subject?: string;
      content: string;
      delay: number; // in days
    }[];
  }): FollowUpSequence {
    const steps: Omit<SequenceStep, 'id'>[] = config.content.map((item, index) => ({
      name: `Nurture ${item.type} ${index + 1}`,
      type: item.type,
      delay: index === 0 ? 0 : item.delay * 24 * 60, // Convert days to minutes
      config: item.type === 'email' ? {
        subject: item.subject,
        content: item.content,
        template: 'nurture'
      } : {
        message: item.content
      },
      active: true
    }));

    return this.createSequence({
      name: config.name,
      description: 'Nurture leads with valuable content',
      trigger: {
        type: 'tag_added',
        conditions: [
          {
            type: 'user_segment',
            operator: 'equals',
            value: config.userSegment
          }
        ]
      },
      steps
    });
  }

  /**
   * Activate sequence
   */
  activateSequence(sequenceId: string): boolean {
    const sequence = this.sequences.get(sequenceId);
    if (!sequence) return false;

    sequence.status = 'active';
    sequence.updatedAt = new Date();
    return true;
  }

  /**
   * Enroll contact in sequence
   */
  enrollContact(sequenceId: string, contactId: string, metadata?: Record<string, any>): SequenceEnrollment | null {
    const sequence = this.sequences.get(sequenceId);
    const contact = this.contacts.get(contactId);

    if (!sequence || !contact || sequence.status !== 'active') {
      return null;
    }

    // Check if contact already enrolled
    const existingEnrollment = Array.from(this.enrollments.values())
      .find(e => e.sequenceId === sequenceId && e.contactId === contactId && e.status === 'active');

    if (existingEnrollment) {
      return existingEnrollment;
    }

    const enrollment: SequenceEnrollment = {
      id: this.generateId(),
      sequenceId,
      contactId,
      status: 'active',
      currentStepId: sequence.steps[0]?.id,
      nextStepAt: new Date(Date.now() + (sequence.trigger.delay || 0) * 60 * 1000),
      enrolledAt: new Date(),
      metadata: metadata || {}
    };

    this.enrollments.set(enrollment.id, enrollment);

    // Update sequence stats
    sequence.stats.totalEnrollments++;
    sequence.stats.activeEnrollments++;

    // Schedule first step
    this.scheduleStep(enrollment.id, sequence.steps[0].id, enrollment.nextStepAt!);

    return enrollment;
  }

  /**
   * Process trigger event
   */
  processTriggerEvent(event: {
    type: string;
    contactId: string;
    data: any;
  }): void {
    const contact = this.contacts.get(event.contactId);
    if (!contact) return;

    // Find sequences that match this trigger
    const matchingSequences = Array.from(this.sequences.values())
      .filter(sequence =>
        sequence.status === 'active' &&
        this.evaluateTrigger(sequence.trigger, event, contact)
      );

    // Enroll contact in matching sequences
    for (const sequence of matchingSequences) {
      this.enrollContact(sequence.id, event.contactId, event.data);
    }
  }

  /**
   * Execute sequence step
   */
  async executeStep(enrollmentId: string, stepId: string): Promise<ExecutionResult> {
    const enrollment = this.enrollments.get(enrollmentId);
    if (!enrollment || enrollment.status !== 'active') {
      return { success: false, error: 'Enrollment not found or inactive' };
    }

    const sequence = this.sequences.get(enrollment.sequenceId);
    if (!sequence) {
      return { success: false, error: 'Sequence not found' };
    }

    const step = sequence.steps.find(s => s.id === stepId);
    if (!step || !step.active) {
      return { success: false, error: 'Step not found or inactive' };
    }

    const contact = this.contacts.get(enrollment.contactId);
    if (!contact) {
      return { success: false, error: 'Contact not found' };
    }

    // Check step conditions
    if (step.conditions && !this.evaluateStepConditions(step.conditions, contact, enrollment)) {
      return this.skipToNextStep(enrollment, sequence, step);
    }

    // Execute step based on type
    let result: ExecutionResult;

    try {
      switch (step.type) {
        case 'email':
          result = await this.executeEmailStep(step, contact, enrollment);
          break;
        case 'sms':
          result = await this.executeSmsStep(step, contact, enrollment);
          break;
        case 'webhook':
          result = await this.executeWebhookStep(step, contact, enrollment);
          break;
        case 'task':
          result = await this.executeTaskStep(step, contact, enrollment);
          break;
        case 'tag':
          result = await this.executeTagStep(step, contact, enrollment);
          break;
        case 'wait':
          result = await this.executeWaitStep(step, contact, enrollment);
          break;
        case 'condition':
          result = await this.executeConditionStep(step, contact, enrollment);
          break;
        default:
          result = { success: false, error: 'Unknown step type' };
      }
    } catch (error) {
      result = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }

    // Update step stats
    this.updateStepStats(sequence, step, result);

    // Move to next step or complete sequence
    if (result.success) {
      if (result.nextStepId) {
        enrollment.currentStepId = result.nextStepId;
        const nextStep = sequence.steps.find(s => s.id === result.nextStepId);
        if (nextStep) {
          const nextExecuteAt = new Date(Date.now() + (result.delay || nextStep.delay) * 60 * 1000);
          enrollment.nextStepAt = nextExecuteAt;
          this.scheduleStep(enrollmentId, result.nextStepId, nextExecuteAt);
        }
      } else {
        const currentStepIndex = sequence.steps.findIndex(s => s.id === stepId);
        const nextStep = sequence.steps[currentStepIndex + 1];

        if (nextStep) {
          enrollment.currentStepId = nextStep.id;
          const nextExecuteAt = new Date(Date.now() + nextStep.delay * 60 * 1000);
          enrollment.nextStepAt = nextExecuteAt;
          this.scheduleStep(enrollmentId, nextStep.id, nextExecuteAt);
        } else {
          // Sequence completed
          this.completeEnrollment(enrollment, sequence);
        }
      }
    } else {
      // Handle failure
      enrollment.status = 'failed';
      sequence.stats.activeEnrollments--;
    }

    return result;
  }

  /**
   * Add contact to system
   */
  addContact(contact: Contact): void {
    this.contacts.set(contact.id, contact);
  }

  /**
   * Get sequence statistics
   */
  getSequenceStats(sequenceId: string): SequenceStats | null {
    const sequence = this.sequences.get(sequenceId);
    return sequence ? sequence.stats : null;
  }

  /**
   * Get active enrollments for contact
   */
  getContactEnrollments(contactId: string): SequenceEnrollment[] {
    return Array.from(this.enrollments.values())
      .filter(e => e.contactId === contactId && e.status === 'active');
  }

  private evaluateTrigger(trigger: SequenceTrigger, event: any, contact: Contact): boolean {
    if (trigger.type !== event.type) return false;

    return trigger.conditions.every(condition => {
      switch (condition.type) {
        case 'form_id':
          return event.data?.formId === condition.value;
        case 'product_id':
          if (condition.operator === 'in') {
            return Array.isArray(condition.value) && condition.value.includes(event.data?.productId);
          }
          return event.data?.productId === condition.value;
        case 'tag':
          return contact.tags.includes(condition.value);
        case 'user_segment':
          return contact.customFields?.segment === condition.value;
        default:
          return true;
      }
    });
  }

  private evaluateStepConditions(conditions: SequenceCondition[], contact: Contact, enrollment: SequenceEnrollment): boolean {
    return conditions.every(condition => {
      let result = false;

      switch (condition.type) {
        case 'tag_exists':
          result = contact.tags.includes(condition.value);
          break;
        case 'field_equals':
          result = contact.customFields[condition.field!] === condition.value;
          break;
        case 'time_since':
          const timeSince = Date.now() - enrollment.enrolledAt.getTime();
          const requiredTime = condition.value * 60 * 1000; // Convert minutes to ms
          result = timeSince >= requiredTime;
          break;
        default:
          result = true;
      }

      return condition.negate ? !result : result;
    });
  }

  private async executeEmailStep(step: SequenceStep, contact: Contact, enrollment: SequenceEnrollment): Promise<ExecutionResult> {
    // Email sending logic would integrate with email service
    console.log(`Sending email to ${contact.email}`, {
      subject: step.config.subject,
      template: step.config.template,
      enrollmentId: enrollment.id
    });

    // Simulate email sending
    return { success: true };
  }

  private async executeSmsStep(step: SequenceStep, contact: Contact, enrollment: SequenceEnrollment): Promise<ExecutionResult> {
    if (!contact.phone) {
      return { success: false, error: 'Contact has no phone number' };
    }

    console.log(`Sending SMS to ${contact.phone}`, {
      message: step.config.message,
      enrollmentId: enrollment.id
    });

    return { success: true };
  }

  private async executeWebhookStep(step: SequenceStep, contact: Contact, enrollment: SequenceEnrollment): Promise<ExecutionResult> {
    console.log(`Triggering webhook`, {
      url: step.config.url,
      method: step.config.method,
      enrollmentId: enrollment.id
    });

    return { success: true };
  }

  private async executeTaskStep(step: SequenceStep, contact: Contact, enrollment: SequenceEnrollment): Promise<ExecutionResult> {
    console.log(`Creating task`, {
      title: step.config.title,
      assignedTo: step.config.assignedTo,
      enrollmentId: enrollment.id
    });

    return { success: true };
  }

  private async executeTagStep(step: SequenceStep, contact: Contact, enrollment: SequenceEnrollment): Promise<ExecutionResult> {
    const tags = step.config.tags || [];

    if (step.config.action === 'add') {
      tags.forEach(tag => {
        if (!contact.tags.includes(tag)) {
          contact.tags.push(tag);
        }
      });
    } else if (step.config.action === 'remove') {
      tags.forEach(tag => {
        const index = contact.tags.indexOf(tag);
        if (index > -1) {
          contact.tags.splice(index, 1);
        }
      });
    }

    return { success: true };
  }

  private async executeWaitStep(step: SequenceStep, contact: Contact, enrollment: SequenceEnrollment): Promise<ExecutionResult> {
    const waitTime = step.config.waitValue as number || step.delay;
    return { success: true, delay: waitTime };
  }

  private async executeConditionStep(step: SequenceStep, contact: Contact, enrollment: SequenceEnrollment): Promise<ExecutionResult> {
    // Evaluate condition and determine next step
    const conditionMet = this.evaluateCondition(step.config, contact, enrollment);
    const nextStepId = conditionMet ? step.config.trueStep : step.config.falseStep;

    return {
      success: true,
      nextStepId: nextStepId || undefined
    };
  }

  private evaluateCondition(config: StepConfig, contact: Contact, enrollment: SequenceEnrollment): boolean {
    switch (config.conditionType) {
      case 'email_opened':
        // Would check email tracking data
        return Math.random() > 0.5; // Simulate
      case 'link_clicked':
        // Would check click tracking data
        return Math.random() > 0.7; // Simulate
      case 'tag_added':
        return contact.tags.includes(config.conditionValue);
      default:
        return true;
    }
  }

  private skipToNextStep(enrollment: SequenceEnrollment, sequence: FollowUpSequence, currentStep: SequenceStep): ExecutionResult {
    const currentIndex = sequence.steps.findIndex(s => s.id === currentStep.id);
    const nextStep = sequence.steps[currentIndex + 1];

    if (nextStep) {
      return { success: true, nextStepId: nextStep.id, delay: nextStep.delay };
    } else {
      this.completeEnrollment(enrollment, sequence);
      return { success: true };
    }
  }

  private completeEnrollment(enrollment: SequenceEnrollment, sequence: FollowUpSequence): void {
    enrollment.status = 'completed';
    enrollment.completedAt = new Date();

    sequence.stats.activeEnrollments--;
    sequence.stats.completedEnrollments++;
    sequence.stats.completionRate = (sequence.stats.completedEnrollments / sequence.stats.totalEnrollments) * 100;

    // Calculate average completion time
    const completionTime = (enrollment.completedAt.getTime() - enrollment.enrolledAt.getTime()) / (1000 * 60 * 60); // hours
    sequence.stats.averageCompletionTime =
      (sequence.stats.averageCompletionTime * (sequence.stats.completedEnrollments - 1) + completionTime) /
      sequence.stats.completedEnrollments;
  }

  private updateStepStats(sequence: FollowUpSequence, step: SequenceStep, result: ExecutionResult): void {
    if (!sequence.stats.stepStats.has(step.id)) {
      sequence.stats.stepStats.set(step.id, {
        stepId: step.id,
        executed: 0,
        successful: 0,
        failed: 0,
        skipped: 0,
        successRate: 0,
        averageExecutionTime: 0
      });
    }

    const stats = sequence.stats.stepStats.get(step.id)!;
    stats.executed++;

    if (result.success) {
      stats.successful++;
    } else {
      stats.failed++;
    }

    stats.successRate = (stats.successful / stats.executed) * 100;
  }

  private scheduleStep(enrollmentId: string, stepId: string, executeAt: Date): void {
    const delay = executeAt.getTime() - Date.now();

    if (delay <= 0) {
      // Execute immediately
      this.executeStep(enrollmentId, stepId);
    } else {
      // Schedule for later
      const timeout = setTimeout(() => {
        this.executeStep(enrollmentId, stepId);
        this.scheduledTasks.delete(`${enrollmentId}_${stepId}`);
      }, delay);

      this.scheduledTasks.set(`${enrollmentId}_${stepId}`, timeout);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Clean up scheduled tasks
   */
  destroy(): void {
    this.scheduledTasks.forEach(timeout => clearTimeout(timeout));
    this.scheduledTasks.clear();
  }
}

export default FollowUpSequenceSystem;