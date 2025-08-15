/**
 * Gamification Engine Implementation
 * 
 * This module implements the gamification integration system that adds engaging,
 * interactive elements to templates through progress tracking, achievements,
 * rewards, and gamified experiences.
 */

import type { Component, FunnelTemplate, ComponentDesign } from '../types';
import type { Template } from '../website-templates';
import type {
  GamificationEngine,
  ProgressTrackingConfig,
  AchievementSystemConfig,
  UserAction,
  RewardFeedbackConfig,
  QuizGamificationConfig,
  CompetitionConfig,
  InteractiveQuizConfig,
  EngagementRewardsConfig,
  GamifiedElement,
  FeedbackResponse,
  GamifiedQuiz,
  EnhancementResult
} from './interfaces';
import type {
  ProgressTracker,
  Achievement,
  Reward,
  EngagementFeature,
  ProgressStep,
  ProgressVisualStyle,
  ProgressTrigger,
  CompletionCriteria,
  AchievementDisplayRule,
  ScoringSystem,
  ResultType
} from './types';

// ============================================================================
// PROGRESS TRACKING SYSTEM
// ============================================================================

/**
 * Progress Tracking System
 * Creates visual progress indicators and completion tracking for user engagement
 */
export class ProgressTrackingSystem {
  /**
   * Create a progress tracker for form elements
   */
  createProgressTracker(
    elementId: string,
    config: Partial<ProgressTrackingConfig> = {}
  ): ProgressTracker {
    const defaultConfig: ProgressTrackingConfig = {
      type: 'linear',
      showPercentage: true,
      showLabels: true,
      animation: true,
      theme: 'modern'
    };

    const finalConfig = { ...defaultConfig, ...config };

    return {
      id: `progress_${elementId}_${Date.now()}`,
      type: finalConfig.type,
      name: `Progress Tracker for ${elementId}`,
      description: 'Visual progress indicator for user engagement',
      steps: this.generateProgressSteps(elementId),
      visualStyle: this.createVisualStyle(finalConfig),
      triggers: this.createProgressTriggers(elementId),
      completionReward: 'completion_badge'
    };
  }

  /**
   * Generate progress steps based on element type
   */
  private generateProgressSteps(elementId: string): ProgressStep[] {
    // Default steps for form progression
    return [
      {
        id: `${elementId}_step_1`,
        title: 'Getting Started',
        description: 'Begin your journey',
        order: 1,
        required: true,
        completionCriteria: {
          type: 'interaction',
          target: elementId,
          value: 'focus'
        }
      },
      {
        id: `${elementId}_step_2`,
        title: 'Making Progress',
        description: 'You\'re doing great!',
        order: 2,
        required: true,
        completionCriteria: {
          type: 'form_completion',
          target: elementId,
          value: 50,
          operator: 'greater_than'
        }
      },
      {
        id: `${elementId}_step_3`,
        title: 'Almost There',
        description: 'Just a few more steps',
        order: 3,
        required: true,
        completionCriteria: {
          type: 'form_completion',
          target: elementId,
          value: 80,
          operator: 'greater_than'
        }
      },
      {
        id: `${elementId}_step_4`,
        title: 'Complete!',
        description: 'Congratulations on finishing!',
        order: 4,
        required: true,
        completionCriteria: {
          type: 'form_completion',
          target: elementId,
          value: 100,
          operator: 'equals'
        },
        reward: {
          id: 'completion_reward',
          type: 'badge',
          title: 'Form Completion Master',
          description: 'You successfully completed the form!',
          redeemable: false
        }
      }
    ];
  }

  /**
   * Create visual style configuration
   */
  private createVisualStyle(config: ProgressTrackingConfig): ProgressVisualStyle {
    const themes = {
      minimal: {
        colors: {
          incomplete: '#e5e7eb',
          complete: '#10b981',
          current: '#3b82f6'
        }
      },
      modern: {
        colors: {
          incomplete: '#f3f4f6',
          complete: '#059669',
          current: '#2563eb'
        }
      },
      playful: {
        colors: {
          incomplete: '#fef3c7',
          complete: '#f59e0b',
          current: '#8b5cf6'
        }
      },
      professional: {
        colors: {
          incomplete: '#f8fafc',
          complete: '#0f172a',
          current: '#475569'
        }
      }
    };

    const allowedThemes = ['minimal', 'modern', 'playful', 'professional'] as const;
    const theme: ProgressVisualStyle['theme'] = allowedThemes.includes(config.theme as any)
      ? (config.theme as ProgressVisualStyle['theme'])
      : 'modern';
    return {
      theme,
      colors: themes[theme].colors,
      animation: config.animation ? 'slide' : 'none',
      showPercentage: config.showPercentage ?? true,
      showLabels: config.showLabels ?? true
    };
  }

  /**
   * Create progress triggers
   */
  private createProgressTriggers(elementId: string): ProgressTrigger[] {
    return [
      {
        event: 'form_submit',
        condition: `element.id === '${elementId}'`
      },
      {
        event: 'click',
        condition: `element.closest('#${elementId}')`
      },
      {
        event: 'scroll',
        condition: `element.id === '${elementId}'`,
        value: 0.5
      }
    ];
  }

  /**
   * Generate CSS for progress tracker
   */
  generateProgressCSS(tracker: ProgressTracker): string {
    const { colors, animation } = tracker.visualStyle;
    
    return `
      .progress-tracker-${tracker.id} {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin: 1rem 0;
      }

      .progress-bar-${tracker.id} {
        flex: 1;
        height: 8px;
        background: ${colors.incomplete};
        border-radius: 4px;
        overflow: hidden;
        position: relative;
      }

      .progress-fill-${tracker.id} {
        height: 100%;
        background: linear-gradient(90deg, ${colors.complete} 0%, ${colors.current} 100%);
        border-radius: 4px;
        transition: width 0.5s ease-in-out;
        ${animation === 'slide' ? 'transform: translateX(-100%); animation: slideIn 0.5s ease-out forwards;' : ''}
      }

      .progress-percentage-${tracker.id} {
        font-weight: 600;
        color: ${colors.current};
        font-size: 0.875rem;
        min-width: 3rem;
        text-align: right;
      }

      .progress-steps-${tracker.id} {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
      }

      .progress-step-${tracker.id} {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 0.75rem;
        color: #6b7280;
      }

      .progress-step-${tracker.id}.completed {
        color: ${colors.complete};
      }

      .progress-step-${tracker.id}.current {
        color: ${colors.current};
        font-weight: 600;
      }

      @keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      .progress-tracker-${tracker.id}.animated .progress-fill-${tracker.id} {
        animation: pulse 2s infinite;
      }
    `;
  }

  /**
   * Generate JavaScript for progress tracking
   */
  generateProgressJS(tracker: ProgressTracker): string {
    return `
      (function() {
        const tracker = ${JSON.stringify(tracker)};
        let currentStep = 0;
        let progress = 0;

        function updateProgress(newProgress) {
          progress = Math.min(100, Math.max(0, newProgress));
          const progressFill = document.querySelector('.progress-fill-' + tracker.id);
          const progressPercentage = document.querySelector('.progress-percentage-' + tracker.id);
          
          if (progressFill) {
            progressFill.style.width = progress + '%';
          }
          
          if (progressPercentage && tracker.visualStyle.showPercentage) {
            progressPercentage.textContent = Math.round(progress) + '%';
          }

          updateStepVisuals();
          checkAchievements();
        }

        function updateStepVisuals() {
          const steps = document.querySelectorAll('.progress-step-' + tracker.id);
          const stepProgress = progress / 100 * tracker.steps.length;
          
          steps.forEach((step, index) => {
            step.classList.remove('completed', 'current');
            if (index < stepProgress) {
              step.classList.add('completed');
            } else if (index === Math.floor(stepProgress)) {
              step.classList.add('current');
            }
          });
        }

        function checkAchievements() {
          tracker.steps.forEach((step, index) => {
            const stepProgress = (index + 1) / tracker.steps.length * 100;
            if (progress >= stepProgress && !step.completed) {
              step.completed = true;
              triggerStepCompletion(step);
            }
          });
        }

        function triggerStepCompletion(step) {
          // Dispatch custom event for step completion
          const event = new CustomEvent('stepCompleted', {
            detail: { step, tracker, progress }
          });
          document.dispatchEvent(event);

          // Show completion feedback
          showCompletionFeedback(step);
        }

        function showCompletionFeedback(step) {
          const feedback = document.createElement('div');
          feedback.className = 'step-completion-feedback';
          feedback.innerHTML = \`
            <div class="feedback-content">
              <div class="feedback-icon">✓</div>
              <div class="feedback-text">\${step.title} completed!</div>
            </div>
          \`;
          feedback.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
          \`;

          document.body.appendChild(feedback);
          setTimeout(() => {
            feedback.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => feedback.remove(), 300);
          }, 3000);
        }

        // Initialize progress tracking
        function initializeTracking() {
          const targetElement = document.getElementById(tracker.triggers[0]?.condition?.match(/'([^']+)'/)?.[1] || '');
          if (!targetElement) return;

          // Form progress tracking
          if (targetElement.tagName === 'FORM') {
            const inputs = targetElement.querySelectorAll('input, select, textarea');
            const totalInputs = inputs.length;

            function updateFormProgress() {
              let filledInputs = 0;
              inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                  if (input.checked) filledInputs++;
                } else if (input.value.trim()) {
                  filledInputs++;
                }
              });
              
              const formProgress = (filledInputs / totalInputs) * 100;
              updateProgress(formProgress);
            }

            inputs.forEach(input => {
              input.addEventListener('input', updateFormProgress);
              input.addEventListener('change', updateFormProgress);
            });

            // Initial progress check
            updateFormProgress();
          }

          // Scroll progress tracking
          tracker.triggers.forEach(trigger => {
            if (trigger.event === 'scroll') {
              window.addEventListener('scroll', () => {
                const scrollProgress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                updateProgress(scrollProgress);
              });
            }
          });
        }

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = \`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          .feedback-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .feedback-icon {
            font-size: 1.25rem;
            font-weight: bold;
          }
        \`;
        document.head.appendChild(style);

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initializeTracking);
        } else {
          initializeTracking();
        }
      })();
    `;
  }
}

// ============================================================================
// ACHIEVEMENT BADGE ENGINE
// ============================================================================

/**
 * Achievement Badge Engine
 * Manages dynamic badge assignment and display logic for user accomplishments
 */
export class AchievementBadgeEngine {
  private achievements: Map<string, Achievement> = new Map();

  /**
   * Create achievement system for template
   */
  createAchievementSystem(
    templateId: string,
    config: Partial<AchievementSystemConfig> = {}
  ): Achievement[] {
    const defaultCategories = ['engagement', 'completion', 'social', 'milestone'];
    const categories = config.categories || defaultCategories;

    const achievements: Achievement[] = [];

    categories.forEach(category => {
      const fullConfig: AchievementSystemConfig = {
        categories: config.categories ?? [],
        rarityLevels: config.rarityLevels ?? [],
        pointSystem: config.pointSystem ?? false,
        displayRules: config.displayRules ?? { position: 'top', animation: 'fade', duration: 3000, sound: false }
      };
      achievements.push(...this.createCategoryAchievements(
        templateId,
        category,
        fullConfig
      ));
    });

    // Store achievements for later reference
    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });

    return achievements;
  }

  /**
   * Create achievements for specific category
   */
  private createCategoryAchievements(
    templateId: string,
    category: string,
    config: AchievementSystemConfig
  ): Achievement[] {
    const achievements: Achievement[] = [];

    switch (category) {
      case 'engagement':
        achievements.push(
          {
            id: `${templateId}_first_click`,
            title: 'First Steps',
            description: 'Made your first interaction with the page',
            icon: '👆',
            category: 'engagement',
            rarity: 'common',
            points: 10,
            unlockCriteria: [{
              type: 'interaction',
              target: 'any',
              value: 1,
              operator: 'equals'
            }],
            displayRules: [{
              trigger: 'immediate',
              position: 'top',
              animation: 'fade',
              duration: 3000
            }]
          },
          {
            id: `${templateId}_engaged_user`,
            title: 'Engaged Explorer',
            description: 'Spent quality time exploring the content',
            icon: '🔍',
            category: 'engagement',
            rarity: 'rare',
            points: 25,
            unlockCriteria: [{
              type: 'time',
              target: 'page',
              value: 60,
              operator: 'greater_than'
            }],
            displayRules: [{
              trigger: 'immediate',
              position: 'center',
              animation: 'bounce',
              duration: 4000
            }]
          }
        );
        break;

      case 'completion':
        achievements.push(
          {
            id: `${templateId}_form_starter`,
            title: 'Getting Started',
            description: 'Began filling out a form',
            icon: '📝',
            category: 'completion',
            rarity: 'common',
            points: 15,
            unlockCriteria: [{
              type: 'form_completion',
              target: 'any_form',
              value: 25,
              operator: 'greater_than'
            }],
            displayRules: [{
              trigger: 'immediate',
              position: 'top',
              animation: 'slide'
            }]
          },
          {
            id: `${templateId}_form_master`,
            title: 'Form Master',
            description: 'Successfully completed a form',
            icon: '🏆',
            category: 'completion',
            rarity: 'epic',
            points: 50,
            unlockCriteria: [{
              type: 'form_completion',
              target: 'any_form',
              value: 100,
              operator: 'equals'
            }],
            displayRules: [{
              trigger: 'immediate',
              position: 'center',
              animation: 'confetti',
              duration: 5000
            }]
          }
        );
        break;

      case 'social':
        achievements.push(
          {
            id: `${templateId}_social_sharer`,
            title: 'Social Butterfly',
            description: 'Shared content on social media',
            icon: '🦋',
            category: 'social',
            rarity: 'rare',
            points: 30,
            unlockCriteria: [{
              type: 'action',
              target: 'social_share',
              value: 1,
              operator: 'equals'
            }],
            displayRules: [{
              trigger: 'immediate',
              position: 'top',
              animation: 'bounce'
            }]
          }
        );
        break;

      case 'milestone':
        achievements.push(
          {
            id: `${templateId}_scroll_explorer`,
            title: 'Deep Diver',
            description: 'Scrolled through the entire page',
            icon: '🏊‍♂️',
            category: 'milestone',
            rarity: 'rare',
            points: 20,
            unlockCriteria: [{
              type: 'interaction',
              target: 'scroll',
              value: 90,
              operator: 'greater_than'
            }],
            displayRules: [{
              trigger: 'immediate',
              position: 'bottom',
              animation: 'slide'
            }]
          }
        );
        break;
    }

    return achievements;
  }

  /**
   * Generate achievement display HTML
   */
  generateAchievementHTML(achievement: Achievement): string {
    return `
      <div class="achievement-notification achievement-${achievement.rarity}" id="achievement-${achievement.id}">
        <div class="achievement-content">
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-text">
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-points">+${achievement.points} points</div>
          </div>
        </div>
        <div class="achievement-close" onclick="this.parentElement.remove()">×</div>
      </div>
    `;
  }

  /**
   * Generate achievement CSS
   */
  generateAchievementCSS(): string {
    return `
      .achievement-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        z-index: 1000;
        max-width: 300px;
        animation: achievementSlideIn 0.5s ease-out;
        border: 2px solid rgba(255, 255, 255, 0.2);
      }

      .achievement-notification.achievement-common {
        background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
        box-shadow: 0 8px 25px rgba(74, 222, 128, 0.3);
      }

      .achievement-notification.achievement-rare {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
      }

      .achievement-notification.achievement-epic {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
      }

      .achievement-notification.achievement-legendary {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
        border: 2px solid #fbbf24;
      }

      .achievement-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .achievement-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }

      .achievement-text {
        flex: 1;
      }

      .achievement-title {
        font-weight: 700;
        font-size: 1rem;
        margin-bottom: 0.25rem;
      }

      .achievement-description {
        font-size: 0.875rem;
        opacity: 0.9;
        margin-bottom: 0.25rem;
      }

      .achievement-points {
        font-size: 0.75rem;
        font-weight: 600;
        opacity: 0.8;
      }

      .achievement-close {
        position: absolute;
        top: 0.5rem;
        right: 0.75rem;
        cursor: pointer;
        font-size: 1.25rem;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .achievement-close:hover {
        opacity: 1;
      }

      @keyframes achievementSlideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes achievementBounce {
        0%, 20%, 53%, 80%, 100% {
          transform: translate3d(0, 0, 0);
        }
        40%, 43% {
          transform: translate3d(0, -10px, 0);
        }
        70% {
          transform: translate3d(0, -5px, 0);
        }
        90% {
          transform: translate3d(0, -2px, 0);
        }
      }

      @keyframes achievementConfetti {
        0% {
          transform: scale(0.8) rotate(0deg);
          opacity: 0;
        }
        50% {
          transform: scale(1.1) rotate(180deg);
          opacity: 1;
        }
        100% {
          transform: scale(1) rotate(360deg);
          opacity: 1;
        }
      }

      .achievement-notification.bounce {
        animation: achievementSlideIn 0.5s ease-out, achievementBounce 1s ease-in-out 0.5s;
      }

      .achievement-notification.confetti {
        animation: achievementSlideIn 0.5s ease-out, achievementConfetti 1s ease-in-out 0.5s;
      }
    `;
  }

  /**
   * Generate achievement tracking JavaScript
   */
  generateAchievementJS(achievements: Achievement[]): string {
    return `
      (function() {
        const achievements = ${JSON.stringify(achievements)};
        const unlockedAchievements = new Set();
        const userStats = {
          clicks: 0,
          timeOnPage: 0,
          scrollDepth: 0,
          formsStarted: 0,
          formsCompleted: 0,
          socialShares: 0
        };

        function checkAchievements() {
          achievements.forEach(achievement => {
            if (unlockedAchievements.has(achievement.id)) return;

            const unlocked = achievement.unlockCriteria.every(criteria => {
              return checkCriteria(criteria);
            });

            if (unlocked) {
              unlockAchievement(achievement);
            }
          });
        }

        function checkCriteria(criteria) {
          switch (criteria.type) {
            case 'interaction':
              if (criteria.target === 'any') {
                return userStats.clicks >= criteria.value;
              } else if (criteria.target === 'scroll') {
                return userStats.scrollDepth >= criteria.value;
              }
              break;
            case 'time':
              return userStats.timeOnPage >= criteria.value;
            case 'form_completion':
              if (criteria.target === 'any_form') {
                const formProgress = getFormProgress();
                return formProgress >= criteria.value;
              }
              break;
            case 'action':
              if (criteria.target === 'social_share') {
                return userStats.socialShares >= criteria.value;
              }
              break;
          }
          return false;
        }

        function getFormProgress() {
          const forms = document.querySelectorAll('form');
          let totalProgress = 0;
          let formCount = 0;

          forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            if (inputs.length === 0) return;

            let filledInputs = 0;
            inputs.forEach(input => {
              if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked) filledInputs++;
              } else if (input.value.trim()) {
                filledInputs++;
              }
            });

            totalProgress += (filledInputs / inputs.length) * 100;
            formCount++;
          });

          return formCount > 0 ? totalProgress / formCount : 0;
        }

        function unlockAchievement(achievement) {
          unlockedAchievements.add(achievement.id);
          showAchievementNotification(achievement);
          
          // Dispatch custom event
          const event = new CustomEvent('achievementUnlocked', {
            detail: { achievement, userStats }
          });
          document.dispatchEvent(event);
        }

        function generateAchievementHTML(achievement) {
          return \`
            <div class="achievement-notification achievement-\${achievement.rarity}" id="achievement-\${achievement.id}">
              <div class="achievement-content">
                <div class="achievement-icon">\${achievement.icon}</div>
                <div class="achievement-text">
                  <div class="achievement-title">\${achievement.title}</div>
                  <div class="achievement-description">\${achievement.description}</div>
                  <div class="achievement-points">+\${achievement.points} points</div>
                </div>
              </div>
              <div class="achievement-close" onclick="this.parentElement.remove()">×</div>
            </div>
          \`;
        }

        function showAchievementNotification(achievement) {
          const notification = document.createElement('div');
          notification.innerHTML = generateAchievementHTML(achievement);
          
          const displayRule = achievement.displayRules[0];
          if (displayRule.animation) {
            notification.firstElementChild.classList.add(displayRule.animation);
          }

          document.body.appendChild(notification.firstElementChild);

          // Auto-remove after duration
          if (displayRule.duration) {
            setTimeout(() => {
              const element = document.getElementById('achievement-' + achievement.id);
              if (element) {
                element.style.animation = 'achievementSlideIn 0.3s ease-in reverse';
                setTimeout(() => element.remove(), 300);
              }
            }, displayRule.duration);
          }
        }

        // Event listeners for tracking user interactions
        document.addEventListener('click', () => {
          userStats.clicks++;
          checkAchievements();
        });

        // Track time on page
        let startTime = Date.now();
        setInterval(() => {
          userStats.timeOnPage = Math.floor((Date.now() - startTime) / 1000);
          checkAchievements();
        }, 1000);

        // Track scroll depth
        window.addEventListener('scroll', () => {
          const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          userStats.scrollDepth = Math.max(userStats.scrollDepth, scrollPercent);
          checkAchievements();
        });

        // Track form interactions
        document.addEventListener('input', (e) => {
          if (e.target.matches('input, select, textarea')) {
            checkAchievements();
          }
        });

        // Track social shares
        document.addEventListener('click', (e) => {
          if (e.target.matches('[data-social-share], .social-share')) {
            userStats.socialShares++;
            checkAchievements();
          }
        });

        // Initial check
        checkAchievements();
      })();
    `;
  }
}

// ============================================================================
// REWARD FEEDBACK SYSTEM
// ============================================================================

/**
 * Reward Feedback System
 * Provides immediate positive reinforcement for user actions
 */
export class RewardFeedbackSystem {
  /**
   * Create reward feedback for user actions
   */
  createRewardFeedback(
    action: UserAction,
    config: Partial<RewardFeedbackConfig> = {}
  ): FeedbackResponse {
    const defaultConfig: RewardFeedbackConfig = {
      visual: true,
      audio: false,
      haptic: false,
      duration: 1000,
      intensity: 'medium'
    };

    const finalConfig = { ...defaultConfig, ...config };

    return {
      type: this.determineFeedbackType(finalConfig),
      config: this.createFeedbackConfig(action, finalConfig),
      duration: finalConfig.duration,
      trigger: action.type
    };
  }

  /**
   * Determine feedback type based on configuration
   */
  private determineFeedbackType(config: RewardFeedbackConfig): 'visual' | 'audio' | 'haptic' | 'combined' {
    const enabledTypes = [];
    if (config.visual) enabledTypes.push('visual');
    if (config.audio) enabledTypes.push('audio');
    if (config.haptic) enabledTypes.push('haptic');

    return enabledTypes.length > 1 ? 'combined' : (enabledTypes[0] as any) || 'visual';
  }

  /**
   * Create feedback configuration
   */
  private createFeedbackConfig(action: UserAction, config: RewardFeedbackConfig): Record<string, any> {
    const feedbackConfig: Record<string, any> = {};

    if (config.visual) {
      feedbackConfig.visual = this.createVisualFeedback(action, config);
    }

    if (config.audio) {
      feedbackConfig.audio = this.createAudioFeedback(action, config);
    }

    if (config.haptic) {
      feedbackConfig.haptic = this.createHapticFeedback(action, config);
    }

    return feedbackConfig;
  }

  /**
   * Create visual feedback configuration
   */
  private createVisualFeedback(action: UserAction, config: RewardFeedbackConfig): any {
    const intensityMap = {
      low: { scale: 1.05, duration: 200 },
      medium: { scale: 1.1, duration: 300 },
      high: { scale: 1.2, duration: 500 }
    };

    const intensity = intensityMap[config.intensity] || intensityMap.medium;

    return {
      type: 'pulse',
      scale: intensity.scale,
      duration: intensity.duration,
      color: this.getActionColor(action.type),
      particles: config.intensity === 'high'
    };
  }

  /**
   * Create audio feedback configuration
   */
  private createAudioFeedback(action: UserAction, config: RewardFeedbackConfig): any {
    const soundMap = {
      click: 'click.mp3',
      form_submit: 'success.mp3',
      achievement: 'achievement.mp3',
      progress: 'progress.mp3'
    };

    return {
      sound: soundMap[action.type as keyof typeof soundMap] || 'click.mp3',
      volume: config.intensity === 'high' ? 0.8 : config.intensity === 'medium' ? 0.5 : 0.3
    };
  }

  /**
   * Create haptic feedback configuration
   */
  private createHapticFeedback(action: UserAction, config: RewardFeedbackConfig): any {
    const intensityMap = {
      low: 'light',
      medium: 'medium',
      high: 'heavy'
    };

    return {
      type: intensityMap[config.intensity] || 'medium',
      duration: config.duration / 2
    };
  }

  /**
   * Get color based on action type
   */
  private getActionColor(actionType: string): string {
    const colorMap = {
      click: '#3b82f6',
      form_submit: '#10b981',
      achievement: '#f59e0b',
      progress: '#8b5cf6',
      social_share: '#ec4899'
    };

    return colorMap[actionType as keyof typeof colorMap] || '#6b7280';
  }

  /**
   * Generate feedback CSS
   */
  generateFeedbackCSS(): string {
    return `
      .reward-feedback {
        pointer-events: none;
        position: absolute;
        z-index: 1000;
      }

      .feedback-pulse {
        animation: feedbackPulse 0.3s ease-out;
      }

      .feedback-particles {
        position: relative;
        overflow: visible;
      }

      .feedback-particles::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 4px;
        background: currentColor;
        border-radius: 50%;
        animation: particleExplosion 0.6s ease-out;
      }

      @keyframes feedbackPulse {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 currentColor;
        }
        50% {
          transform: scale(1.1);
          box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.3);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        }
      }

      @keyframes particleExplosion {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(3);
          opacity: 0;
        }
      }

      .feedback-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.3);
        animation: rippleEffect 0.6s ease-out;
      }

      @keyframes rippleEffect {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
  }

  /**
   * Generate feedback JavaScript
   */
  generateFeedbackJS(): string {
    return `
      (function() {
        function triggerFeedback(element, feedbackConfig) {
          if (feedbackConfig.visual) {
            triggerVisualFeedback(element, feedbackConfig.visual);
          }
          
          if (feedbackConfig.audio) {
            triggerAudioFeedback(feedbackConfig.audio);
          }
          
          if (feedbackConfig.haptic) {
            triggerHapticFeedback(feedbackConfig.haptic);
          }
        }

        function triggerVisualFeedback(element, config) {
          element.classList.add('feedback-pulse');
          element.style.color = config.color;
          
          if (config.particles) {
            element.classList.add('feedback-particles');
            createRippleEffect(element, config.color);
          }

          setTimeout(() => {
            element.classList.remove('feedback-pulse', 'feedback-particles');
            element.style.color = '';
          }, config.duration);
        }

        function createRippleEffect(element, color) {
          const rect = element.getBoundingClientRect();
          const ripple = document.createElement('div');
          ripple.className = 'feedback-ripple';
          ripple.style.cssText = \`
            position: fixed;
            left: \${rect.left + rect.width / 2 - 10}px;
            top: \${rect.top + rect.height / 2 - 10}px;
            width: 20px;
            height: 20px;
            background: \${color}33;
            pointer-events: none;
            z-index: 1001;
          \`;
          
          document.body.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        }

        function triggerAudioFeedback(config) {
          if ('AudioContext' in window || 'webkitAudioContext' in window) {
            
          }
        }

        function triggerHapticFeedback(config) {
          if ('vibrate' in navigator) {
            const vibrationMap = {
              light: 50,
              medium: 100,
              high: 200
            };
            navigator.vibrate(vibrationMap[config.type] || 100);
          }
        }

        // Global feedback function
        window.triggerRewardFeedback = function(element, action) {
          const feedbackConfig = {
            visual: {
              type: 'pulse',
              scale: 1.1,
              duration: 300,
              color: '#3b82f6',
              particles: false
            }
          };
          
          triggerFeedback(element, feedbackConfig);
        };

        // Auto-attach to common interactive elements
        document.addEventListener('click', function(e) {
          if (e.target.matches('button, .btn, [role="button"], input[type="submit"]')) {
            window.triggerRewardFeedback(e.target, { type: 'click' });
          }
        });

        document.addEventListener('submit', function(e) {
          if (e.target.matches('form')) {
            const submitButton = e.target.querySelector('input[type="submit"], button[type="submit"]');
            if (submitButton) {
              window.triggerRewardFeedback(submitButton, { type: 'form_submit' });
            }
          }
        });
      })();
    `;
  }
}

// ============================================================================
// INTERACTIVE QUIZ/ASSESSMENT BUILDER
// ============================================================================

/**
 * Interactive Quiz/Assessment Builder
 * Creates gamified quizzes with scoring and personality results
 */
export class InteractiveQuizBuilder {
  /**
   * Create interactive quiz component
   */
  createInteractiveQuiz(config: InteractiveQuizConfig): Component {
    const quizId = Date.now();
    
    return {
      id: quizId,
      type: 'quiz',
      content: {
        title: 'Interactive Quiz',
        description: 'Test your knowledge and discover insights about yourself',
        questions: config.questions,
        scoring: config.scoring,
        results: config.results,
        gamification: config.gamification
      },
      design: this.generateQuizStyles(String(quizId)),
      metadata: { 
        scripts: this.generateQuizScripts(String(quizId), config)
      }
    };
  }

  /**
   * Gamify existing quiz component
   */
  gamifyQuiz(quiz: Component, config: QuizGamificationConfig): GamifiedQuiz {
    const gamifiedQuiz: GamifiedQuiz = {
      ...quiz,
      scoring: {
        type: config.scoring ? 'points' : 'category',
        maxScore: config.scoring ? 100 : undefined
      },
      achievements: this.createQuizAchievements(String(quiz.id), config),
      leaderboard: config.leaderboard,
      timer: config.timer ? 300 : undefined // 5 minutes default
    };

    return gamifiedQuiz;
  }

  /**
   * Create quiz-specific achievements
   */
  private createQuizAchievements(quizId: string, config: QuizGamificationConfig): Achievement[] {
    const achievements: Achievement[] = [];

    if (config.scoring) {
      achievements.push({
        id: `${quizId}_perfect_score`,
        title: 'Perfect Score!',
        description: 'Answered all questions correctly',
        icon: '🎯',
        category: 'completion',
        rarity: 'legendary',
        points: 100,
        unlockCriteria: [{
          type: 'action',
          target: 'quiz_score',
          value: 100,
          operator: 'equals'
        }],
        displayRules: [{
          trigger: 'immediate',
          position: 'center',
          animation: 'confetti',
          duration: 5000
        }]
      });
    }

    if (config.timer) {
      achievements.push({
        id: `${quizId}_speed_demon`,
        title: 'Speed Demon',
        description: 'Completed the quiz in record time',
        icon: '⚡',
        category: 'milestone',
        rarity: 'epic',
        points: 75,
        unlockCriteria: [{
          type: 'time',
          target: 'quiz_completion',
          value: 60,
          operator: 'less_than'
        }],
        displayRules: [{
          trigger: 'immediate',
          position: 'top',
          animation: 'bounce'
        }]
      });
    }

    if (config.personalityResults) {
      achievements.push({
        id: `${quizId}_self_discoverer`,
        title: 'Self Discoverer',
        description: 'Completed a personality assessment',
        icon: '🔍',
        category: 'engagement',
        rarity: 'rare',
        points: 50,
        unlockCriteria: [{
          type: 'action',
          target: 'quiz_complete',
          value: 1,
          operator: 'equals'
        }],
        displayRules: [{
          trigger: 'immediate',
          position: 'center',
          animation: 'fade'
        }]
      });
    }

    return achievements;
  }

  /**
   * Generate quiz styles
   */
  private generateQuizStyles(quizId: string): ComponentDesign {
    return {
      typography: {},
      colors: {},
      shadows: {},
      borders: {},
      interactions: {},
      customStyles: `
        .quiz-${quizId} {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
      `
    };
  }

  /**
   * Generate quiz scripts
   */
  private generateQuizScripts(quizId: string, config: InteractiveQuizConfig): string {
    return `
      (function() {
        const quizConfig = ${JSON.stringify(config)};
        let currentQuestion = 0;
        let answers = {};
        let startTime = Date.now();
        let score = 0;

        function initializeQuiz() {
          renderQuestion(currentQuestion);
          updateProgress();
        }

        function renderQuestion(questionIndex) {
          const question = quizConfig.questions[questionIndex];
          const container = document.querySelector('.quiz-${quizId}');
          
          if (!container) return;

          const questionHtml = \`
            <div class="quiz-question-${quizId}">
              <h3>\${question.question}</h3>
              <div class="quiz-options-${quizId}">
                \${question.options ? question.options.map((option, index) => \`
                  <div class="quiz-option-${quizId}" data-value="\${option}" data-index="\${index}">
                    \${option}
                  </div>
                \`).join('') : \`
                  <input type="text" class="quiz-text-input-${quizId}" placeholder="Your answer...">
                \`}
              </div>
              <button class="quiz-next-${quizId}" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;" disabled>
                \${questionIndex === quizConfig.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          \`;

          container.innerHTML = \`
            <div class="quiz-progress-${quizId}">
              <div class="quiz-progress-bar-${quizId}">
                <div class="quiz-progress-fill-${quizId}" style="width: \${((questionIndex + 1) / quizConfig.questions.length) * 100}%"></div>
              </div>
              <p>Question \${questionIndex + 1} of \${quizConfig.questions.length}</p>
            </div>
            \${questionHtml}
          \`;

          attachEventListeners(questionIndex);
        }

        function attachEventListeners(questionIndex) {
          const options = document.querySelectorAll('.quiz-option-${quizId}');
          const nextButton = document.querySelector('.quiz-next-${quizId}');
          const textInput = document.querySelector('.quiz-text-input-${quizId}');

          options.forEach(option => {
            option.addEventListener('click', function() {
              options.forEach(opt => opt.classList.remove('selected'));
              this.classList.add('selected');
              answers[questionIndex] = this.dataset.value;
              nextButton.disabled = false;
            });
          });

          if (textInput) {
            textInput.addEventListener('input', function() {
              answers[questionIndex] = this.value;
              nextButton.disabled = this.value.trim() === '';
            });
          }

          nextButton.addEventListener('click', function() {
            if (questionIndex === quizConfig.questions.length - 1) {
              finishQuiz();
            } else {
              currentQuestion++;
              renderQuestion(currentQuestion);
            }
          });
        }

        function finishQuiz() {
          const completionTime = Math.floor((Date.now() - startTime) / 1000);
          const result = calculateResults();
          
          renderResults(result, completionTime);
          
          // Trigger achievements
          const event = new CustomEvent('quizCompleted', {
            detail: {
              quizId: '${quizId}',
              score: result.score,
              completionTime,
              answers,
              result: result.type
            }
          });
          document.dispatchEvent(event);
        }

        function calculateResults() {
          if (quizConfig.scoring.type === 'points') {
            let totalScore = 0;
            quizConfig.questions.forEach((question, index) => {
              if (question.options && answers[index]) {
                // Simple scoring: first option = full points, others proportional
                const optionIndex = question.options.indexOf(answers[index]);
                const points = question.weight || 10;
                totalScore += optionIndex === 0 ? points : Math.max(0, points - optionIndex * 2);
              }
            });
            
            const maxPossibleScore = quizConfig.questions.reduce((sum, q) => sum + (q.weight || 10), 0);
            const percentage = Math.round((totalScore / maxPossibleScore) * 100);
            
            return {
              score: percentage,
              type: percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : 'needs_improvement',
              title: percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Learning!',
              description: \`You scored \${percentage}% on this quiz.\`
            };
          } else {
            // Category-based or personality results
            const categories = {};
            quizConfig.questions.forEach((question, index) => {
              if (question.category && answers[index]) {
                categories[question.category] = (categories[question.category] || 0) + 1;
              }
            });
            
            const dominantCategory = Object.keys(categories).reduce((a, b) => 
              categories[a] > categories[b] ? a : b
            );
            
            const result = quizConfig.results.find(r => r.id === dominantCategory) || quizConfig.results[0];
            
            return {
              score: Math.round((categories[dominantCategory] / quizConfig.questions.length) * 100),
              type: dominantCategory,
              title: result.title,
              description: result.description
            };
          }
        }

        function renderResults(result, completionTime) {
          const container = document.querySelector('.quiz-${quizId}');
          
          container.innerHTML = \`
            <div class="quiz-results-${quizId}">
              <div class="quiz-score-${quizId}">\${result.score}%</div>
              <div class="quiz-result-title-${quizId}">\${result.title}</div>
              <p>\${result.description}</p>
              <p style="margin-top: 1rem; opacity: 0.9;">
                Completed in \${Math.floor(completionTime / 60)}:\${(completionTime % 60).toString().padStart(2, '0')}
              </p>
              <button onclick="location.reload()" style="margin-top: 2rem; padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 0.5rem; cursor: pointer;">
                Take Quiz Again
              </button>
            </div>
          \`;
        }

        function updateProgress() {
          const progressFill = document.querySelector('.quiz-progress-fill-${quizId}');
          if (progressFill) {
            const progress = ((currentQuestion + 1) / quizConfig.questions.length) * 100;
            progressFill.style.width = progress + '%';
          }
        }

        // Initialize quiz when DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initializeQuiz);
        } else {
          initializeQuiz();
        }
      })();
    `;
  }
}

// ============================================================================
// COMPETITION ELEMENTS SYSTEM
// ============================================================================

/**
 * Competition Elements System
 * Adds leaderboards and social comparison features
 */
export class CompetitionElementsSystem {
  /**
   * Add competition elements to template
   */
  addCompetitionElements(
    template: Template | FunnelTemplate,
    config: CompetitionConfig
  ): Template | FunnelTemplate {
    const enhancedTemplate = { ...template };

    if (config.leaderboards) {
      enhancedTemplate.components = [
        ...enhancedTemplate.components,
        this.createLeaderboardComponent(template.id)
      ];
    }

    if (config.socialSharing) {
      enhancedTemplate.components = enhancedTemplate.components.map(component => 
        this.addSocialSharingToComponent(component)
      );
    }

    if (config.challenges) {
      enhancedTemplate.components = [
        ...enhancedTemplate.components,
        this.createChallengeComponent(template.id)
      ];
    }

    return enhancedTemplate;
  }

  /**
   * Create leaderboard component
   */
  private createLeaderboardComponent(templateId: string): Component {
    return {
      id: Date.now(),
      type: 'leaderboard',
      content: {
        title: 'Top Performers',
        description: 'See how you rank against other users',
        entries: []
      },
      design: {
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {},
        customStyles: `
          .leaderboard-${templateId} {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            margin: 2rem 0;
          }
          .leaderboard-entry {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
            margin-bottom: 0.5rem;
            backdrop-filter: blur(10px);
          }
          .leaderboard-rank {
            font-weight: bold;
            font-size: 1.25rem;
            min-width: 3rem;
          }
          .leaderboard-name {
            flex: 1;
            margin-left: 1rem;
          }
          .leaderboard-score {
            font-weight: 600;
            color: #fbbf24;
          }
        `
      },
      metadata: {
        scripts: this.generateLeaderboardJS(templateId)
      }
    };
  }

  /**
   * Add social sharing to component
   */
  private addSocialSharingToComponent(component: Component): Component {
    if (component.type === 'quiz' || component.type === 'achievement') {
      return {
        ...component,
        content: {
          ...component.content,
          socialSharing: true
        },
        metadata: {
          scripts: (component.metadata.scripts || '') + this.generateSocialSharingJS(String(component.id))
        }
      };
    }
    return component;
  }

  /**
   * Create challenge component
   */
  private createChallengeComponent(templateId: string): Component {
    return {
      id: Date.now(),
      type: 'challenges',
      content: {
        title: 'Daily Challenges',
        description: 'Complete challenges to earn extra points',
        challenges: [
          {
            id: 'daily_visit',
            title: 'Daily Visitor',
            description: 'Visit the site every day this week',
            points: 50,
            progress: 0,
            target: 7
          },
          {
            id: 'social_sharer',
            title: 'Social Butterfly',
            description: 'Share content 5 times',
            points: 30,
            progress: 0,
            target: 5
          },
          {
            id: 'form_master',
            title: 'Form Master',
            description: 'Complete 3 different forms',
            points: 75,
            progress: 0,
            target: 3
          }
        ]
      },
      design: {
        typography: {},
        colors: {},
        shadows: {},
        borders: {},
        interactions: {},
        customStyles: `
          .challenges-${templateId} {
            background: #f8fafc;
            padding: 2rem;
            border-radius: 1rem;
            margin: 2rem 0;
            border: 1px solid #e2e8f0;
          }
          .challenge-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            background: white;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .challenge-progress {
            width: 100px;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
          }
          .challenge-progress-fill {
            height: 100%;
            background: #10b981;
            transition: width 0.3s ease;
          }
        `
      },
      metadata: {
        scripts: this.generateChallengesJS(templateId)
      }
    };
  }

  /**
   * Generate leaderboard JavaScript
   */
  private generateLeaderboardJS(templateId: string): string {
    return `
      (function() {
        const leaderboardData = [
          { rank: 1, name: 'Alex Champion', score: 2450 },
          { rank: 2, name: 'Sarah Winner', score: 2380 },
          { rank: 3, name: 'Mike Leader', score: 2290 },
          { rank: 4, name: 'Emma Star', score: 2150 },
          { rank: 5, name: 'You', score: 0 }
        ];

        function renderLeaderboard() {
          const container = document.querySelector('.leaderboard-${templateId}');
          if (!container) return;

          const entriesHtml = leaderboardData.map(entry => \`
            <div class="leaderboard-entry \${entry.name === 'You' ? 'current-user' : ''}">
              <div class="leaderboard-rank">#\${entry.rank}</div>
              <div class="leaderboard-name">\${entry.name}</div>
              <div class="leaderboard-score">\${entry.score} pts</div>
            </div>
          \`).join('');

          container.innerHTML = \`
            <h3>🏆 Leaderboard</h3>
            <p>See how you rank against other users</p>
            <div class="leaderboard-entries">
              \${entriesHtml}
            </div>
          \`;
        }

        function updateUserScore(newScore) {
          const userEntry = leaderboardData.find(entry => entry.name === 'You');
          if (userEntry) {
            userEntry.score = newScore;
            
            // Recalculate rank
            leaderboardData.sort((a, b) => b.score - a.score);
            leaderboardData.forEach((entry, index) => {
              entry.rank = index + 1;
            });
            
            renderLeaderboard();
          }
        }

        // Listen for score updates
        document.addEventListener('achievementUnlocked', function(e) {
          const currentScore = parseInt(localStorage.getItem('userScore') || '0');
          const newScore = currentScore + e.detail.achievement.points;
          localStorage.setItem('userScore', newScore.toString());
          updateUserScore(newScore);
        });

        // Initialize
        const savedScore = parseInt(localStorage.getItem('userScore') || '0');
        updateUserScore(savedScore);
        renderLeaderboard();
      })();
    `;
  }

  /**
   * Generate social sharing JavaScript
   */
  private generateSocialSharingJS(componentId: string): string {
    return `
      (function() {
        function addSocialSharing() {
          const component = document.getElementById('${componentId}');
          if (!component) return;

          const shareButton = document.createElement('button');
          shareButton.innerHTML = '📤 Share Your Result';
          shareButton.className = 'social-share-btn';
          shareButton.style.cssText = \`
            background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            margin-top: 1rem;
            font-weight: 600;
            transition: transform 0.2s ease;
          \`;

          shareButton.addEventListener('click', function() {
            const shareData = {
              title: 'Check out my result!',
              text: 'I just completed this awesome quiz. Try it yourself!',
              url: window.location.href
            };

            if (navigator.share) {
              navigator.share(shareData);
            } else {
              // Fallback to Twitter share
              const twitterUrl = \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(shareData.text)}&url=\${encodeURIComponent(shareData.url)}\`;
              window.open(twitterUrl, '_blank');
            }

            // Track social share
            const event = new CustomEvent('socialShare', {
              detail: { platform: 'twitter', componentId: '${componentId}' }
            });
            document.dispatchEvent(event);
          });

          shareButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
          });

          shareButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
          });

          component.appendChild(shareButton);
        }

        // Add sharing after component is rendered
        setTimeout(addSocialSharing, 1000);
      })();
    `;
  }

  /**
   * Generate challenges JavaScript
   */
  private generateChallengesJS(templateId: string): string {
    return `
      (function() {
        const challenges = [
          {
            id: 'daily_visit',
            title: 'Daily Visitor',
            description: 'Visit the site every day this week',
            points: 50,
            progress: 0,
            target: 7
          },
          {
            id: 'social_sharer',
            title: 'Social Butterfly',
            description: 'Share content 5 times',
            points: 30,
            progress: 0,
            target: 5
          },
          {
            id: 'form_master',
            title: 'Form Master',
            description: 'Complete 3 different forms',
            points: 75,
            progress: 0,
            target: 3
          }
        ];

        function renderChallenges() {
          const container = document.querySelector('.challenges-${templateId}');
          if (!container) return;

          const challengesHtml = challenges.map(challenge => \`
            <div class="challenge-item">
              <div class="challenge-info">
                <h4>\${challenge.title}</h4>
                <p>\${challenge.description}</p>
                <small>\${challenge.progress}/\${challenge.target} completed • \${challenge.points} points</small>
              </div>
              <div class="challenge-progress">
                <div class="challenge-progress-fill" style="width: \${(challenge.progress / challenge.target) * 100}%"></div>
              </div>
            </div>
          \`).join('');

          container.innerHTML = \`
            <h3>🎯 Daily Challenges</h3>
            <p>Complete challenges to earn extra points</p>
            <div class="challenges-list">
              \${challengesHtml}
            </div>
          \`;
        }

        function updateChallengeProgress(challengeId, increment = 1) {
          const challenge = challenges.find(c => c.id === challengeId);
          if (challenge && challenge.progress < challenge.target) {
            challenge.progress = Math.min(challenge.progress + increment, challenge.target);
            
            if (challenge.progress === challenge.target) {
              // Challenge completed!
              const event = new CustomEvent('challengeCompleted', {
                detail: { challenge }
              });
              document.dispatchEvent(event);
            }
            
            renderChallenges();
            saveChallengeProgress();
          }
        }

        function saveChallengeProgress() {
          localStorage.setItem('challengeProgress', JSON.stringify(challenges));
        }

        function loadChallengeProgress() {
          const saved = localStorage.getItem('challengeProgress');
          if (saved) {
            const savedChallenges = JSON.parse(saved);
            savedChallenges.forEach(savedChallenge => {
              const challenge = challenges.find(c => c.id === savedChallenge.id);
              if (challenge) {
                challenge.progress = savedChallenge.progress;
              }
            });
          }
        }

        // Event listeners for challenge tracking
        document.addEventListener('socialShare', function() {
          updateChallengeProgress('social_sharer');
        });

        document.addEventListener('submit', function(e) {
          if (e.target.matches('form')) {
            updateChallengeProgress('form_master');
          }
        });

        // Track daily visits
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('lastVisit');
        if (lastVisit !== today) {
          localStorage.setItem('lastVisit', today);
          updateChallengeProgress('daily_visit');
        }

        // Initialize
        loadChallengeProgress();
        renderChallenges();
      })();
    `;
  }
}

// ============================================================================
// MAIN GAMIFICATION ENGINE IMPLEMENTATION
// ============================================================================

/**
 * Main Gamification Engine Implementation
 * Orchestrates all gamification systems
 */
export class GamificationEngineImpl implements GamificationEngine {
  private progressSystem = new ProgressTrackingSystem();
  private achievementEngine = new AchievementBadgeEngine();
  private rewardSystem = new RewardFeedbackSystem();
  private quizBuilder = new InteractiveQuizBuilder();
  private competitionSystem = new CompetitionElementsSystem();

  async addProgressTracking(
    element: Component,
    config?: ProgressTrackingConfig
  ): Promise<EnhancementResult<GamifiedElement>> {
    try {
      const progressTracker = this.progressSystem.createProgressTracker(String(element.id), config);
      
      const gamifiedElement: GamifiedElement = {
        ...element,
        gamification: {
          progressTracker,
          achievements: [],
          rewards: []
        }
      };

      // Add progress tracking styles and scripts
      gamifiedElement.styles = {
        ...gamifiedElement.styles,
        progressTracker: this.progressSystem.generateProgressCSS(progressTracker)
      };

      gamifiedElement.scripts = (gamifiedElement.scripts || '') + 
        this.progressSystem.generateProgressJS(progressTracker);

      return {
        success: true,
        data: gamifiedElement,
        errors: [],
        warnings: [],
        metadata: {
          processingTime: 50,
          enhancementsApplied: ['progress_tracking'],
          performanceImpact: {
            loadTimeIncrease: 10,
            bundleSizeIncrease: 2,
            memoryUsageIncrease: 5,
            renderingComplexity: 'low',
            recommendations: ['Consider lazy loading for large forms']
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          stage: 'gamification',
          code: 'PROGRESS_TRACKING_ERROR',
          message: `Failed to add progress tracking: ${error}`,
          severity: 'medium',
          timestamp: new Date()
        }],
        warnings: [],
        metadata: {
          processingTime: 0,
          enhancementsApplied: [],
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: []
          }
        }
      };
    }
  }

  async createAchievementSystem(
    template: Template | FunnelTemplate,
    config?: AchievementSystemConfig
  ): Promise<EnhancementResult<Achievement[]>> {
    try {
      const achievements = this.achievementEngine.createAchievementSystem(template.id, config);

      return {
        success: true,
        data: achievements,
        errors: [],
        warnings: [],
        metadata: {
          processingTime: 75,
          enhancementsApplied: ['achievement_system'],
          performanceImpact: {
            loadTimeIncrease: 15,
            bundleSizeIncrease: 3,
            memoryUsageIncrease: 8,
            renderingComplexity: 'medium',
            recommendations: ['Monitor achievement notification frequency']
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          stage: 'gamification',
          code: 'ACHIEVEMENT_SYSTEM_ERROR',
          message: `Failed to create achievement system: ${error}`,
          severity: 'medium',
          timestamp: new Date()
        }],
        warnings: [],
        metadata: {
          processingTime: 0,
          enhancementsApplied: [],
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: []
          }
        }
      };
    }
  }

  async implementRewardFeedback(
    action: UserAction,
    config?: RewardFeedbackConfig
  ): Promise<EnhancementResult<FeedbackResponse>> {
    try {
      const feedbackResponse = this.rewardSystem.createRewardFeedback(action, config);

      return {
        success: true,
        data: feedbackResponse,
        errors: [],
        warnings: [],
        metadata: {
          processingTime: 25,
          enhancementsApplied: ['reward_feedback'],
          performanceImpact: {
            loadTimeIncrease: 5,
            bundleSizeIncrease: 1,
            memoryUsageIncrease: 3,
            renderingComplexity: 'low',
            recommendations: ['Limit feedback frequency for performance']
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          stage: 'gamification',
          code: 'REWARD_FEEDBACK_ERROR',
          message: `Failed to implement reward feedback: ${error}`,
          severity: 'low',
          timestamp: new Date()
        }],
        warnings: [],
        metadata: {
          processingTime: 0,
          enhancementsApplied: [],
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: []
          }
        }
      };
    }
  }

  async gamifyAssessment(
    quiz: Component,
    config?: QuizGamificationConfig
  ): Promise<EnhancementResult<GamifiedQuiz>> {
    try {
      const gamifiedQuiz = this.quizBuilder.gamifyQuiz(quiz, config || {
        scoring: true,
        timer: false,
        leaderboard: false,
        badges: true,
        personalityResults: false
      });

      return {
        success: true,
        data: gamifiedQuiz,
        errors: [],
        warnings: [],
        metadata: {
          processingTime: 100,
          enhancementsApplied: ['quiz_gamification'],
          performanceImpact: {
            loadTimeIncrease: 20,
            bundleSizeIncrease: 5,
            memoryUsageIncrease: 12,
            renderingComplexity: 'medium',
            recommendations: ['Consider progressive loading for complex quizzes']
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          stage: 'gamification',
          code: 'QUIZ_GAMIFICATION_ERROR',
          message: `Failed to gamify assessment: ${error}`,
          severity: 'medium',
          timestamp: new Date()
        }],
        warnings: [],
        metadata: {
          processingTime: 0,
          enhancementsApplied: [],
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: []
          }
        }
      };
    }
  }

  async addCompetitionElements(
    template: Template | FunnelTemplate,
    config?: CompetitionConfig
  ): Promise<EnhancementResult<Template | FunnelTemplate>> {
    try {
      const enhancedTemplate = this.competitionSystem.addCompetitionElements(template, config || {
        leaderboards: true,
        socialSharing: true,
        challenges: true,
        rewards: true
      });

      return {
        success: true,
        data: enhancedTemplate,
        errors: [],
        warnings: [],
        metadata: {
          processingTime: 150,
          enhancementsApplied: ['competition_elements'],
          performanceImpact: {
            loadTimeIncrease: 30,
            bundleSizeIncrease: 6,
            memoryUsageIncrease: 15,
            renderingComplexity: 'high',
            recommendations: ['Use real-time database for leaderboards', 'Optimize social sharing scripts']
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          stage: 'gamification',
          code: 'COMPETITION_ELEMENTS_ERROR',
          message: `Failed to add competition elements: ${error}`,
          severity: 'medium',
          timestamp: new Date()
        }],
        warnings: [],
        metadata: {
          processingTime: 0,
          enhancementsApplied: [],
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: []
          }
        }
      };
    }
  }

  async createInteractiveQuiz(
    config: InteractiveQuizConfig
  ): Promise<EnhancementResult<Component>> {
    try {
      const quizComponent = this.quizBuilder.createInteractiveQuiz(config);

      return {
        success: true,
        data: quizComponent,
        errors: [],
        warnings: [],
        metadata: {
          processingTime: 200,
          enhancementsApplied: ['interactive_quiz'],
          performanceImpact: {
            loadTimeIncrease: 40,
            bundleSizeIncrease: 10,
            memoryUsageIncrease: 20,
            renderingComplexity: 'high',
            recommendations: ['Implement question lazy loading', 'Optimize quiz assets']
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          stage: 'gamification',
          code: 'INTERACTIVE_QUIZ_ERROR',
          message: `Failed to create interactive quiz: ${error}`,
          severity: 'high',
          timestamp: new Date()
        }],
        warnings: [],
        metadata: {
          processingTime: 0,
          enhancementsApplied: [],
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: []
          }
        }
      };
    }
  }

  async implementEngagementRewards(
    template: Template | FunnelTemplate,
    config?: EngagementRewardsConfig
  ): Promise<EnhancementResult<Template | FunnelTemplate>> {
    try {
      const enhancedTemplate = { ...template };
      
      // Add engagement reward styles and scripts to all components
      enhancedTemplate.components = enhancedTemplate.components.map(component => ({
        ...component,
        styles: {
          ...component.styles,
          rewardFeedback: this.rewardSystem.generateFeedbackCSS()
        },
        scripts: (component.scripts || '') + this.rewardSystem.generateFeedbackJS()
      }));

      // Add achievement system styles and scripts
      const achievements = this.achievementEngine.createAchievementSystem(template.id);
      enhancedTemplate.components = [
        ...enhancedTemplate.components,
        {
          id: Date.now(),
          type: 'engagement_rewards',
          content: { achievements },
          metadata: {},
          styles: {
            achievements: this.achievementEngine.generateAchievementCSS()
          },
          scripts: this.achievementEngine.generateAchievementJS(achievements)
        }
      ];

      return {
        success: true,
        data: enhancedTemplate,
        errors: [],
        warnings: [],
        metadata: {
          processingTime: 180,
          enhancementsApplied: ['engagement_rewards'],
          performanceImpact: {
            loadTimeIncrease: 35,
            bundleSizeIncrease: 7,
            memoryUsageIncrease: 18,
            renderingComplexity: 'medium',
            recommendations: ['Monitor reward trigger frequency', 'Consider reward batching']
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          stage: 'gamification',
          code: 'ENGAGEMENT_REWARDS_ERROR',
          message: `Failed to implement engagement rewards: ${error}`,
          severity: 'medium',
          timestamp: new Date()
        }],
        warnings: [],
        metadata: {
          processingTime: 0,
          enhancementsApplied: [],
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: []
          }
        }
      };
    }
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a new gamification engine instance
 */
export function createGamificationEngine(): GamificationEngine {
  return new GamificationEngineImpl();
}

/**
 * Default gamification engine instance
 */
export const gamificationEngine = createGamificationEngine();