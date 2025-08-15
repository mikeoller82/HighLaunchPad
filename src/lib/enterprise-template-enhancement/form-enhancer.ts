/**
 * Form Enhancer
 * 
 * Enhances form components with interactive features including smart validation,
 * progressive disclosure, real-time feedback, and improved user experience.
 */

import type { Component } from '../types';
import { InteractiveFormConfig } from './interfaces';
import type {
  InteractiveForm,
  InteractionConfig,
  ValidationRule as FormValidationRule
} from './types';

// Use type alias to ensure we're using the correct ValidationRule
type ValidationRule = FormValidationRule;

/**
 * Form Enhancer Class
 * 
 * Provides comprehensive form enhancement functionality including:
 * - Real-time validation with smart error messages
 * - Progressive disclosure for complex forms
 * - Smart field suggestions and auto-completion
 * - Accessibility improvements
 * - Conversion optimization features
 */
export class FormEnhancer {
  private formId = 0;

  /**
   * Enhance a form component with interactive features
   */
  async enhanceForm(
    form: Component,
    config?: InteractiveFormConfig
  ): Promise<InteractiveForm> {
    const enhancedForm: InteractiveForm = {
      ...form,
      id: form.id || ++this.formId,
      validation: {
        realTime: config?.realTimeValidation !== false,
        rules: await this.generateValidationRules(form, config)
      },
      progressIndicator: config?.progressIndicator !== false,
      smartSuggestions: config?.smartSuggestions !== false
    };

    // Add enhanced form metadata
    enhancedForm.metadata = {
      ...form.metadata,
      enhanced: true,
      enhancementFeatures: this.getEnabledFeatures(config),
      validationScript: this.generateValidationScript(enhancedForm),
      progressScript: this.generateProgressScript(enhancedForm),
      suggestionScript: this.generateSuggestionScript(enhancedForm)
    };

    return enhancedForm;
  }

  /**
   * Create multi-step form with progressive disclosure
   */
  async createMultiStepForm(
    form: Component,
    steps: string[]
  ): Promise<InteractiveForm> {
    const multiStepForm: InteractiveForm = {
      ...form,
      id: form.id || ++this.formId,
      validation: {
        realTime: true,
        rules: await this.generateMultiStepValidationRules(form, steps)
      },
      progressIndicator: true,
      smartSuggestions: true
    };

    // Add multi-step specific metadata
    multiStepForm.metadata = {
      ...form.metadata,
      multiStep: true,
      steps: steps,
      currentStep: 0,
      stepValidation: this.generateStepValidation(steps),
      navigationScript: this.generateNavigationScript(steps)
    };

    return multiStepForm;
  }

  /**
   * Add conditional field logic
   */
  async addConditionalFields(
    form: InteractiveForm,
    conditions: Record<string, string>
  ): Promise<InteractiveForm> {
    const conditionalForm = { ...form };

    conditionalForm.metadata = {
      ...form.metadata,
      conditionalFields: conditions,
      conditionalScript: this.generateConditionalScript(conditions)
    };

    return conditionalForm;
  }

  /**
   * Generate validation rules for form
   */
  private async generateValidationRules(
    form: Component,
    config?: InteractiveFormConfig
  ): Promise<ValidationRule[]> {
    const rules: ValidationRule[] = [];

    // Extract form fields from component
    const fields = this.extractFormFields(form);

    fields.forEach(field => {
      // Email validation
      if (field.type === 'email') {
        rules.push({
          field: field.name,
          type: 'email',
          message: 'Please enter a valid email address'
        });
      }

      // Phone validation
      if (field.type === 'tel' || field.name.includes('phone')) {
        rules.push({
          field: field.name,
          type: 'phone',
          message: 'Please enter a valid phone number'
        });
      }

      // Required field validation
      if (field.required) {
        rules.push({
          field: field.name,
          type: 'required',
          message: `${field.label || field.name} is required`
        });
      }

      // Length validation
      if (field.minLength) {
        rules.push({
          field: field.name,
          type: 'min_length',
          value: field.minLength,
          message: `${field.label || field.name} must be at least ${field.minLength} characters`
        });
      }

      if (field.maxLength) {
        rules.push({
          field: field.name,
          type: 'max_length',
          value: field.maxLength,
          message: `${field.label || field.name} must be no more than ${field.maxLength} characters`
        });
      }

      // Pattern validation
      if (field.pattern) {
        rules.push({
          field: field.name,
          type: 'pattern',
          value: field.pattern,
          message: `${field.label || field.name} format is invalid`
        });
      }
    });

    return rules;
  }

  /**
   * Generate validation rules for multi-step form
   */
  private async generateMultiStepValidationRules(
    form: Component,
    steps: string[]
  ): Promise<ValidationRule[]> {
    const rules = await this.generateValidationRules(form);

    // Add step-specific validation
    steps.forEach((step, index) => {
      rules.push({
        field: `step_${index}`,
        type: 'step_complete',
        message: `Please complete all required fields in ${step}`
      });
    });

    return rules;
  }

  /**
   * Extract form fields from component
   */
  private extractFormFields(form: Component): any[] {
    // This would extract actual form fields from the component structure
    // For now, return common form fields as examples
    return [
      { name: 'email', type: 'email', required: true, label: 'Email Address' },
      { name: 'name', type: 'text', required: true, label: 'Full Name' },
      { name: 'phone', type: 'tel', required: false, label: 'Phone Number' },
      { name: 'company', type: 'text', required: false, label: 'Company' },
      { name: 'message', type: 'textarea', required: false, label: 'Message', maxLength: 500 }
    ];
  }

  /**
   * Get enabled features from config
   */
  private getEnabledFeatures(config?: InteractiveFormConfig): string[] {
    const features: string[] = [];

    if (config?.realTimeValidation !== false) features.push('real_time_validation');
    if (config?.progressIndicator !== false) features.push('progress_indicator');
    if (config?.smartSuggestions !== false) features.push('smart_suggestions');
    if (config?.conditionalFields) features.push('conditional_fields');

    return features;
  }

  /**
   * Generate validation script
   */
  private generateValidationScript(form: InteractiveForm): string {
    return `
      // Enhanced Form Validation System
      class FormValidator {
        constructor(formId) {
          this.form = document.getElementById(formId);
          this.rules = ${JSON.stringify(form.validation.rules)};
          this.realTime = ${form.validation.realTime};
          this.init();
        }

        init() {
          if (!this.form) return;

          // Add validation event listeners
          this.form.addEventListener('submit', (e) => this.handleSubmit(e));
          
          if (this.realTime) {
            this.addRealTimeValidation();
          }
        }

        addRealTimeValidation() {
          const inputs = this.form.querySelectorAll('input, textarea, select');
          
          inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
          });
        }

        validateField(field) {
          const fieldRules = this.rules.filter(rule => rule.field === field.name);
          let isValid = true;
          let errorMessage = '';

          for (const rule of fieldRules) {
            const result = this.applyValidationRule(field, rule);
            if (!result.valid) {
              isValid = false;
              errorMessage = result.message;
              break;
            }
          }

          this.displayFieldValidation(field, isValid, errorMessage);
          return isValid;
        }

        applyValidationRule(field, rule) {
          const value = field.value.trim();

          switch (rule.type) {
            case 'required':
              return {
                valid: value.length > 0,
                message: rule.message
              };

            case 'email':
              const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
              return {
                valid: !value || emailRegex.test(value),
                message: rule.message
              };

            case 'phone':
              const phoneRegex = /^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$/;
              return {
                valid: !value || phoneRegex.test(value.replace(/\\s/g, '')),
                message: rule.message
              };

            case 'min_length':
              return {
                valid: !value || value.length >= rule.value,
                message: rule.message
              };

            case 'max_length':
              return {
                valid: !value || value.length <= rule.value,
                message: rule.message
              };

            case 'pattern':
              const regex = new RegExp(rule.value);
              return {
                valid: !value || regex.test(value),
                message: rule.message
              };

            default:
              return { valid: true, message: '' };
          }
        }

        displayFieldValidation(field, isValid, message) {
          const errorElement = this.getOrCreateErrorElement(field);
          
          if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
          } else {
            field.classList.remove('valid');
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
          }
        }

        clearFieldError(field) {
          if (field.classList.contains('error')) {
            field.classList.remove('error');
            const errorElement = this.getOrCreateErrorElement(field);
            errorElement.style.display = 'none';
          }
        }

        getOrCreateErrorElement(field) {
          let errorElement = field.parentNode.querySelector('.field-error');
          
          if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = 'color: #e53e3e; font-size: 0.875rem; margin-top: 0.25rem;';
            field.parentNode.appendChild(errorElement);
          }

          return errorElement;
        }

        handleSubmit(event) {
          event.preventDefault();
          
          const inputs = this.form.querySelectorAll('input, textarea, select');
          let isFormValid = true;

          inputs.forEach(input => {
            if (!this.validateField(input)) {
              isFormValid = false;
            }
          });

          if (isFormValid) {
            this.submitForm();
          } else {
            this.focusFirstError();
          }
        }

        focusFirstError() {
          const firstError = this.form.querySelector('.error');
          if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        submitForm() {
          // Add loading state
          const submitButton = this.form.querySelector('button[type="submit"]');
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
          }

          // Submit form data
          const formData = new FormData(this.form);
          
          fetch(this.form.action || '/api/form-submit', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              this.showSuccessMessage();
            } else {
              this.showErrorMessage(data.message);
            }
          })
          .catch(error => {
            this.showErrorMessage('An error occurred. Please try again.');
          })
          .finally(() => {
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.textContent = 'Submit';
            }
          });
        }

        showSuccessMessage() {
          const message = document.createElement('div');
          message.className = 'success-message';
          message.style.cssText = 'background: #38a169; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;';
          message.textContent = 'Thank you! Your form has been submitted successfully.';
          this.form.appendChild(message);
          
          // Hide form fields
          const fields = this.form.querySelectorAll('.form-field');
          fields.forEach(field => field.style.display = 'none');
        }

        showErrorMessage(message) {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'form-error';
          errorDiv.style.cssText = 'background: #e53e3e; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;';
          errorDiv.textContent = message;
          this.form.appendChild(errorDiv);
          
          setTimeout(() => errorDiv.remove(), 5000);
        }
      }

      // Initialize form validator
      document.addEventListener('DOMContentLoaded', () => {
        new FormValidator('${form.id}');
      });
    `;
  }

  /**
   * Generate progress indicator script
   */
  private generateProgressScript(form: InteractiveForm): string {
    if (!form.progressIndicator) return '';

    return `
      // Form Progress Indicator
      class FormProgressIndicator {
        constructor(formId) {
          this.form = document.getElementById(formId);
          this.init();
        }

        init() {
          if (!this.form) return;

          this.createProgressBar();
          this.updateProgress();
          
          // Update progress on field changes
          const inputs = this.form.querySelectorAll('input, textarea, select');
          inputs.forEach(input => {
            input.addEventListener('input', () => this.updateProgress());
            input.addEventListener('change', () => this.updateProgress());
          });
        }

        createProgressBar() {
          const progressContainer = document.createElement('div');
          progressContainer.className = 'form-progress-container';
          progressContainer.style.cssText = 'margin-bottom: 1.5rem;';

          const progressBar = document.createElement('div');
          progressBar.className = 'form-progress-bar';
          progressBar.style.cssText = 'width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;';

          const progressFill = document.createElement('div');
          progressFill.className = 'form-progress-fill';
          progressFill.style.cssText = 'height: 100%; background: #4299e1; width: 0%; transition: width 0.3s ease;';

          const progressText = document.createElement('div');
          progressText.className = 'form-progress-text';
          progressText.style.cssText = 'margin-top: 0.5rem; font-size: 0.875rem; color: #4a5568; text-align: center;';

          progressBar.appendChild(progressFill);
          progressContainer.appendChild(progressBar);
          progressContainer.appendChild(progressText);

          this.form.insertBefore(progressContainer, this.form.firstChild);
        }

        updateProgress() {
          const inputs = this.form.querySelectorAll('input, textarea, select');
          const requiredInputs = Array.from(inputs).filter(input => input.required);
          
          let completedFields = 0;
          let totalFields = requiredInputs.length;

          requiredInputs.forEach(input => {
            if (this.isFieldCompleted(input)) {
              completedFields++;
            }
          });

          const percentage = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
          
          const progressFill = this.form.querySelector('.form-progress-fill');
          const progressText = this.form.querySelector('.form-progress-text');

          if (progressFill) {
            progressFill.style.width = percentage + '%';
          }

          if (progressText) {
            progressText.textContent = \`\${Math.round(percentage)}% Complete (\${completedFields}/\${totalFields} required fields)\`;
          }
        }

        isFieldCompleted(input) {
          const value = input.value.trim();
          
          if (input.type === 'email') {
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            return emailRegex.test(value);
          }
          
          if (input.type === 'checkbox' || input.type === 'radio') {
            return input.checked;
          }
          
          return value.length > 0;
        }
      }

      // Initialize progress indicator
      document.addEventListener('DOMContentLoaded', () => {
        new FormProgressIndicator('${form.id}');
      });
    `;
  }

  /**
   * Generate smart suggestions script
   */
  private generateSuggestionScript(form: InteractiveForm): string {
    if (!form.smartSuggestions) return '';

    return `
      // Smart Form Suggestions
      class FormSuggestionEngine {
        constructor(formId) {
          this.form = document.getElementById(formId);
          this.suggestions = this.loadSuggestions();
          this.init();
        }

        init() {
          if (!this.form) return;

          const inputs = this.form.querySelectorAll('input[type="text"], input[type="email"]');
          inputs.forEach(input => {
            this.addSuggestionFeature(input);
          });
        }

        addSuggestionFeature(input) {
          const suggestionList = this.createSuggestionList(input);
          
          input.addEventListener('input', () => {
            this.showSuggestions(input, suggestionList);
          });

          input.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(suggestionList), 200);
          });
        }

        createSuggestionList(input) {
          const list = document.createElement('ul');
          list.className = 'suggestion-list';
          list.style.cssText = \`
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
          \`;

          input.parentNode.style.position = 'relative';
          input.parentNode.appendChild(list);
          
          return list;
        }

        showSuggestions(input, list) {
          const value = input.value.trim().toLowerCase();
          if (value.length < 2) {
            this.hideSuggestions(list);
            return;
          }

          const suggestions = this.getSuggestionsForField(input.name, value);
          
          if (suggestions.length === 0) {
            this.hideSuggestions(list);
            return;
          }

          list.innerHTML = '';
          suggestions.forEach(suggestion => {
            const item = document.createElement('li');
            item.style.cssText = 'padding: 0.5rem; cursor: pointer; border-bottom: 1px solid #f7fafc;';
            item.textContent = suggestion;
            
            item.addEventListener('mouseenter', () => {
              item.style.backgroundColor = '#f7fafc';
            });
            
            item.addEventListener('mouseleave', () => {
              item.style.backgroundColor = 'white';
            });
            
            item.addEventListener('click', () => {
              input.value = suggestion;
              this.hideSuggestions(list);
              input.dispatchEvent(new Event('input'));
            });
            
            list.appendChild(item);
          });

          list.style.display = 'block';
        }

        hideSuggestions(list) {
          list.style.display = 'none';
        }

        getSuggestionsForField(fieldName, value) {
          const fieldSuggestions = this.suggestions[fieldName] || [];
          return fieldSuggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(value)
          ).slice(0, 5);
        }

        loadSuggestions() {
          return {
            company: [
              'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook',
              'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Spotify',
              'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel'
            ],
            name: [
              'John Smith', 'Jane Doe', 'Michael Johnson', 'Sarah Wilson',
              'David Brown', 'Lisa Davis', 'Robert Miller', 'Jennifer Garcia'
            ],
            email: [
              '@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com',
              '@company.com', '@business.com'
            ]
          };
        }
      }

      // Initialize suggestion engine
      document.addEventListener('DOMContentLoaded', () => {
        new FormSuggestionEngine('${form.id}');
      });
    `;
  }

  /**
   * Generate step validation for multi-step forms
   */
  private generateStepValidation(steps: string[]): Record<string, string[]> {
    const stepValidation: Record<string, string[]> = {};

    steps.forEach((step, index) => {
      stepValidation[`step_${index}`] = [
        'required_fields_completed',
        'valid_format',
        'no_errors'
      ];
    });

    return stepValidation;
  }

  /**
   * Generate navigation script for multi-step forms
   */
  private generateNavigationScript(steps: string[]): string {
    return `
      // Multi-step Form Navigation
      class MultiStepFormNavigator {
        constructor(formId) {
          this.form = document.getElementById(formId);
          this.steps = ${JSON.stringify(steps)};
          this.currentStep = 0;
          this.init();
        }

        init() {
          if (!this.form) return;

          this.createStepIndicator();
          this.createNavigationButtons();
          this.showStep(0);
        }

        createStepIndicator() {
          const indicator = document.createElement('div');
          indicator.className = 'step-indicator';
          indicator.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 2rem;';

          this.steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step-item';
            stepElement.style.cssText = \`
              flex: 1;
              text-align: center;
              padding: 0.5rem;
              border-bottom: 2px solid #e2e8f0;
              color: #a0aec0;
              font-size: 0.875rem;
            \`;
            stepElement.textContent = \`\${index + 1}. \${step}\`;
            stepElement.dataset.step = index.toString();
            
            indicator.appendChild(stepElement);
          });

          this.form.insertBefore(indicator, this.form.firstChild);
        }

        createNavigationButtons() {
          const navigation = document.createElement('div');
          navigation.className = 'step-navigation';
          navigation.style.cssText = 'display: flex; justify-content: space-between; margin-top: 2rem;';

          const prevButton = document.createElement('button');
          prevButton.type = 'button';
          prevButton.className = 'prev-step';
          prevButton.textContent = 'Previous';
          prevButton.style.cssText = 'padding: 0.5rem 1rem; background: #e2e8f0; border: none; border-radius: 0.375rem; cursor: pointer;';
          prevButton.addEventListener('click', () => this.previousStep());

          const nextButton = document.createElement('button');
          nextButton.type = 'button';
          nextButton.className = 'next-step';
          nextButton.textContent = 'Next';
          nextButton.style.cssText = 'padding: 0.5rem 1rem; background: #4299e1; color: white; border: none; border-radius: 0.375rem; cursor: pointer;';
          nextButton.addEventListener('click', () => this.nextStep());

          navigation.appendChild(prevButton);
          navigation.appendChild(nextButton);
          this.form.appendChild(navigation);
        }

        showStep(stepIndex) {
          // Hide all steps
          const stepElements = this.form.querySelectorAll('.form-step');
          stepElements.forEach(step => step.style.display = 'none');

          // Show current step
          const currentStepElement = this.form.querySelector(\`.form-step[data-step="\${stepIndex}"]\`);
          if (currentStepElement) {
            currentStepElement.style.display = 'block';
          }

          // Update step indicator
          const indicators = this.form.querySelectorAll('.step-item');
          indicators.forEach((indicator, index) => {
            if (index === stepIndex) {
              indicator.style.borderBottomColor = '#4299e1';
              indicator.style.color = '#4299e1';
            } else if (index < stepIndex) {
              indicator.style.borderBottomColor = '#38a169';
              indicator.style.color = '#38a169';
            } else {
              indicator.style.borderBottomColor = '#e2e8f0';
              indicator.style.color = '#a0aec0';
            }
          });

          // Update navigation buttons
          const prevButton = this.form.querySelector('.prev-step');
          const nextButton = this.form.querySelector('.next-step');

          if (prevButton) {
            prevButton.style.display = stepIndex === 0 ? 'none' : 'block';
          }

          if (nextButton) {
            nextButton.textContent = stepIndex === this.steps.length - 1 ? 'Submit' : 'Next';
          }

          this.currentStep = stepIndex;
        }

        nextStep() {
          if (this.validateCurrentStep()) {
            if (this.currentStep < this.steps.length - 1) {
              this.showStep(this.currentStep + 1);
            } else {
              this.submitForm();
            }
          }
        }

        previousStep() {
          if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
          }
        }

        validateCurrentStep() {
          const currentStepElement = this.form.querySelector(\`.form-step[data-step="\${this.currentStep}"]\`);
          if (!currentStepElement) return true;

          const inputs = currentStepElement.querySelectorAll('input, textarea, select');
          let isValid = true;

          inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
              isValid = false;
              input.classList.add('error');
            } else {
              input.classList.remove('error');
            }
          });

          return isValid;
        }

        submitForm() {
          // Final validation and submission
          if (this.validateCurrentStep()) {
            this.form.submit();
          }
        }
      }

      // Initialize multi-step navigator
      document.addEventListener('DOMContentLoaded', () => {
        new MultiStepFormNavigator('${this.formId}');
      });
    `;
  }

  /**
   * Generate conditional fields script
   */
  private generateConditionalScript(conditions: Record<string, string>): string {
    return `
      // Conditional Fields Logic
      class ConditionalFieldsManager {
        constructor(formId) {
          this.form = document.getElementById(formId);
          this.conditions = ${JSON.stringify(conditions)};
          this.init();
        }

        init() {
          if (!this.form) return;

          // Add event listeners for trigger fields
          Object.keys(this.conditions).forEach(fieldName => {
            const field = this.form.querySelector(\`[name="\${fieldName}"]\`);
            if (field) {
              field.addEventListener('change', () => this.evaluateConditions());
              field.addEventListener('input', () => this.evaluateConditions());
            }
          });

          // Initial evaluation
          this.evaluateConditions();
        }

        evaluateConditions() {
          Object.entries(this.conditions).forEach(([triggerField, condition]) => {
            const field = this.form.querySelector(\`[name="\${triggerField}"]\`);
            if (!field) return;

            const shouldShow = this.evaluateCondition(condition, field);
            this.toggleConditionalFields(triggerField, shouldShow);
          });
        }

        evaluateCondition(condition, field) {
          const value = field.value;
          
          // Simple condition evaluation
          if (condition.includes('===')) {
            const [, expectedValue] = condition.split('===').map(s => s.trim().replace(/['"]/g, ''));
            return value === expectedValue;
          }
          
          if (condition.includes('!==')) {
            const [, expectedValue] = condition.split('!==').map(s => s.trim().replace(/['"]/g, ''));
            return value !== expectedValue;
          }
          
          if (condition.includes('includes')) {
            const match = condition.match(/includes\\(['"](.+?)['"]\\)/);
            return match && value.includes(match[1]);
          }

          return Boolean(value);
        }

        toggleConditionalFields(triggerField, show) {
          const conditionalFields = this.form.querySelectorAll(\`[data-conditional="\${triggerField}"]\`);
          
          conditionalFields.forEach(field => {
            const container = field.closest('.form-field') || field.parentNode;
            
            if (show) {
              container.style.display = 'block';
              field.disabled = false;
            } else {
              container.style.display = 'none';
              field.disabled = true;
              field.value = ''; // Clear hidden field values
            }
          });
        }
      }

      // Initialize conditional fields manager
      document.addEventListener('DOMContentLoaded', () => {
        new ConditionalFieldsManager('${this.formId}');
      });
    `;
  }
}