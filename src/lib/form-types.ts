
export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'file'
  | 'time'
  | 'datetime'
  | 'url'
  | 'password'
  | 'range'
  | 'color'
  | 'rating'
  | 'signature'
  | 'address'
  | 'payment'
  | 'matrix'
  | 'likert'
  | 'nps'
  | 'section'
  | 'divider'
  | 'html'
  | 'image'
  | 'video'
  | 'multi-select'
  | 'country'
  | 'currency'
  | 'calculation'
  | 'appointment'
  | 'captcha';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';
  value?: any;
  message: string;
}

export interface ConditionalLogic {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: any;
  action: 'show' | 'hide' | 'require' | 'disable';
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: ValidationRule[];
  conditionalLogic?: ConditionalLogic[];
  description?: string;
  helpText?: string;
  defaultValue?: any;
  width?: 'full' | 'half' | 'third' | 'quarter';
  cssClass?: string;
  attributes?: Record<string, any>;
  calculations?: {
    formula: string;
    fields: string[];
  };
  // Field-specific properties
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  accept?: string; // for file uploads
  rows?: number; // for textarea
  cols?: number; // for textarea
  maxFileSize?: number;
  allowedFileTypes?: string[];
  ratingScale?: number;
  matrixRows?: string[];
  matrixColumns?: string[];
  likertScale?: string[];
  npsLabels?: { low: string; high: string };
  addressFields?: string[];
  paymentMethods?: string[];
  appointmentSettings?: {
    duration: number;
    availableSlots: string[];
    timezone: string;
  };
}

export interface FormTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  fontFamily: string;
  fontSize: number;
  spacing: number;
  buttonStyle: 'solid' | 'outline' | 'ghost';
  fieldStyle: 'default' | 'rounded' | 'underline';
}

export interface FormIntegration {
  type: 'email' | 'webhook' | 'database' | 'crm' | 'payment' | 'analytics';
  enabled: boolean;
  config: Record<string, any>;
}

export interface FormSettings {
  name: string;
  description?: string;
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  allowMultipleSubmissions?: boolean;
  requireLogin?: boolean;
  enableProgressBar?: boolean;
  enableSaveAndContinue?: boolean;
  enableAutoSave?: boolean;
  enablePrintView?: boolean;
  enableExport?: boolean;
  enableAnalytics?: boolean;
  enableNotifications?: boolean;
  enableScheduling?: boolean;
  enablePayments?: boolean;
  enableFileUploads?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  theme?: FormTheme;
  integrations?: FormIntegration[];
  notifications?: {
    admin: {
      enabled: boolean;
      emails: string[];
      template: string;
    };
    user: {
      enabled: boolean;
      template: string;
      subject: string;
    };
  };
  security?: {
    enableCaptcha: boolean;
    enableRateLimit: boolean;
    maxSubmissionsPerHour: number;
    enableEncryption: boolean;
    enableAuditLog: boolean;
  };
  scheduling?: {
    startDate?: Date;
    endDate?: Date;
    timezone: string;
    allowedDays: number[];
    allowedHours: { start: string; end: string };
  };
  payments?: {
    enabled: boolean;
    currency: string;
    amount?: number;
    allowCustomAmount: boolean;
    paymentMethods: string[];
    stripePublicKey?: string;
  };
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  fields: FormField[];
  settings: FormSettings;
  tags: string[];
  isPremium: boolean;
  industry: string[];
  useCase: string[];
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  submitterInfo: {
    ip: string;
    userAgent: string;
    userId?: string;
    email?: string;
  };
  status: 'pending' | 'processed' | 'failed';
  paymentStatus?: 'pending' | 'completed' | 'failed';
  files?: {
    fieldId: string;
    filename: string;
    url: string;
    size: number;
    type: string;
  }[];
}

export interface FormAnalytics {
  formId: string;
  views: number;
  submissions: number;
  conversionRate: number;
  averageCompletionTime: number;
  dropOffPoints: { fieldId: string; percentage: number }[];
  deviceBreakdown: { device: string; count: number }[];
  locationBreakdown: { country: string; count: number }[];
  timeBreakdown: { hour: number; count: number }[];
}
