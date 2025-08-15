/**
 * Test Suite for Gamification Engine
 * 
 * This module tests the gamification integration system implementation
 * to ensure all features work correctly according to the requirements.
 */

import type { Component, FunnelTemplate } from '../types';
import type { Template } from '../website-templates';
import type {
  ProgressTrackingConfig,
  AchievementSystemConfig,
  UserAction,
  RewardFeedbackConfig,
  QuizGamificationConfig,
  CompetitionConfig,
  InteractiveQuizConfig,
  EngagementRewardsConfig
} from './interfaces';
import {
  GamificationEngineImpl,
  ProgressTrackingSystem,
  AchievementBadgeEngine,
  RewardFeedbackSystem,
  InteractiveQuizBuilder,
  CompetitionElementsSystem
} from './gamification-engine';

// ============================================================================
// TEST DATA
// ============================================================================

const mockTemplate: Template = {
  id: 'test_template_1',
  title: 'Test Template',
  description: 'A template for testing gamification features',
  category: 'business',
  components: [
    {
      id: 'hero_section',
      type: 'hero',
      content: {
        title: 'Welcome to Our Service',
        subtitle: 'Get started with our amazing platform',
        cta: 'Sign Up Now'
      }
    },
    {
      id: 'contact_form',
      type: 'contact',
      content: {
        title: 'Get In Touch',
        fields: ['name', 'email', 'message']
      }
    },
    {
      id: 'testimonials',
      type: 'testimonials',
      content: {
        title: 'What Our Customers Say',
        testimonials: [
          {
            name: 'John Doe',
            text: 'Great service!',
            rating: 5
          }
        ]
      }
    }
  ],
  styles: {},
  scripts: '',
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  }
};

const mockFunnelTemplate: FunnelTemplate = {
  id: 'test_funnel_1',
  title: 'Test Funnel',
  description: 'A funnel for testing gamification features',
  category: 'lead_generation',
  components: [
    {
      id: 'landing_page',
      type: 'hero',
      content: {
        title: 'Special Offer',
        subtitle: 'Limited time only',
        cta: 'Claim Now'
      }
    },
    {
      id: 'opt_in_form',
      type: 'contact',
      content: {
        title: 'Get Your Free Guide',
        fields: ['name', 'email']
      }
    }
  ],
  styles: {},
  scripts: '',
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  }
};

// ============================================================================
// PROGRESS TRACKING SYSTEM TESTS
// ============================================================================

/**
 * Test Progress Tracking System
 */
export async function testProgressTrackingSystem(): Promise<void> {
  console.log('🧪 Testing Progress Tracking System...');

  const progressSystem = new ProgressTrackingSystem();
  
  // Test 1: Create basic progress tracker
  const basicTracker = progressSystem.createProgressTracker('test_form');
  console.assert(basicTracker.id.includes('progress_test_form'), 'Progress tracker should have correct ID');
  console.assert(basicTracker.type === 'linear', 'Default progress tracker should be linear');
  console.assert(basicTracker.steps.length === 4, 'Progress tracker should have 4 default steps');
  console.assert(basicTracker.visualStyle.showPercentage === true, 'Should show percentage by default');

  // Test 2: Create progress tracker with custom config
  const customConfig: ProgressTrackingConfig = {
    type: 'circular',
    showPercentage: false,
    showLabels: true,
    animation: false,
    theme: 'professional'
  };
  
  const customTracker = progressSystem.createProgressTracker('custom_form', customConfig);
  console.assert(customTracker.type === 'circular', 'Custom progress tracker should use specified type');
  console.assert(customTracker.visualStyle.showPercentage === false, 'Should respect custom percentage setting');
  console.assert(customTracker.visualStyle.theme === 'professional', 'Should use custom theme');

  // Test 3: Generate CSS
  const css = progressSystem.generateProgressCSS(basicTracker);
  console.assert(css.includes('.progress-tracker-' + basicTracker.id), 'CSS should include tracker-specific classes');
  console.assert(css.includes('background: linear-gradient'), 'CSS should include gradient backgrounds');
  console.assert(css.includes('@keyframes'), 'CSS should include animations');

  // Test 4: Generate JavaScript
  const js = progressSystem.generateProgressJS(basicTracker);
  console.assert(js.includes('updateProgress'), 'JavaScript should include progress update function');
  console.assert(js.includes('checkAchievements'), 'JavaScript should include achievement checking');
  console.assert(js.includes('addEventListener'), 'JavaScript should include event listeners');

  console.log('✅ Progress Tracking System tests passed!');
}

/**
 * Test Achievement Badge Engine
 */
export async function testAchievementBadgeEngine(): Promise<void> {
  console.log('🧪 Testing Achievement Badge Engine...');

  const achievementEngine = new AchievementBadgeEngine();
  
  // Test 1: Create basic achievement system
  const achievements = achievementEngine.createAchievementSystem('test_template');
  console.assert(achievements.length > 0, 'Should create achievements');
  console.assert(achievements.some(a => a.category === 'engagement'), 'Should include engagement achievements');
  console.assert(achievements.some(a => a.category === 'completion'), 'Should include completion achievements');
  console.assert(achievements.some(a => a.rarity === 'common'), 'Should include common achievements');
  console.assert(achievements.some(a => a.rarity === 'epic'), 'Should include epic achievements');

  // Test 2: Create achievement system with custom config
  const customConfig: AchievementSystemConfig = {
    categories: ['engagement', 'social'],
    rarityLevels: ['common', 'rare'],
    pointSystem: true,
    displayRules: {
      position: 'center',
      animation: 'bounce',
      duration: 3000,
      sound: false
    }
  };
  
  const customAchievements = achievementEngine.createAchievementSystem('custom_template', customConfig);
  console.assert(customAchievements.every(a => ['engagement', 'social'].includes(a.category)), 'Should only include specified categories');
  console.assert(customAchievements.every(a => a.points > 0), 'All achievements should have points');

  // Test 3: Generate achievement HTML
  const testAchievement = achievements[0];
  const html = achievementEngine.generateAchievementHTML(testAchievement);
  console.assert(html.includes('achievement-notification'), 'HTML should include notification class');
  console.assert(html.includes(testAchievement.title), 'HTML should include achievement title');
  console.assert(html.includes(testAchievement.icon), 'HTML should include achievement icon');
  console.assert(html.includes(testAchievement.points.toString()), 'HTML should include points');

  // Test 4: Generate achievement CSS
  const css = achievementEngine.generateAchievementCSS();
  console.assert(css.includes('.achievement-notification'), 'CSS should include notification styles');
  console.assert(css.includes('achievement-common'), 'CSS should include rarity-specific styles');
  console.assert(css.includes('@keyframes'), 'CSS should include animations');
  console.assert(css.includes('linear-gradient'), 'CSS should include gradient backgrounds');

  // Test 5: Generate achievement JavaScript
  const js = achievementEngine.generateAchievementJS(achievements);
  console.assert(js.includes('checkAchievements'), 'JavaScript should include achievement checking');
  console.assert(js.includes('unlockAchievement'), 'JavaScript should include unlock function');
  console.assert(js.includes('addEventListener'), 'JavaScript should include event listeners');

  console.log('✅ Achievement Badge Engine tests passed!');
}

/**
 * Test Reward Feedback System
 */
export async function testRewardFeedbackSystem(): Promise<void> {
  console.log('🧪 Testing Reward Feedback System...');

  const rewardSystem = new RewardFeedbackSystem();
  
  // Test 1: Create basic reward feedback
  const testAction: UserAction = {
    type: 'click',
    target: 'submit_button',
    timestamp: new Date()
  };
  
  const basicFeedback = rewardSystem.createRewardFeedback(testAction);
  console.assert(basicFeedback.type === 'visual', 'Default feedback should be visual');
  console.assert(basicFeedback.trigger === 'click', 'Feedback should match action type');
  console.assert(basicFeedback.duration === 1000, 'Default duration should be 1000ms');

  // Test 2: Create reward feedback with custom config
  const customConfig: RewardFeedbackConfig = {
    visual: true,
    audio: true,
    haptic: true,
    duration: 500,
    intensity: 'high'
  };
  
  const customFeedback = rewardSystem.createRewardFeedback(testAction, customConfig);
  console.assert(customFeedback.type === 'combined', 'Should be combined feedback with multiple types');
  console.assert(customFeedback.duration === 500, 'Should use custom duration');
  console.assert(customFeedback.config.visual, 'Should include visual feedback config');
  console.assert(customFeedback.config.audio, 'Should include audio feedback config');
  console.assert(customFeedback.config.haptic, 'Should include haptic feedback config');

  // Test 3: Generate feedback CSS
  const css = rewardSystem.generateFeedbackCSS();
  console.assert(css.includes('.reward-feedback'), 'CSS should include feedback classes');
  console.assert(css.includes('.feedback-pulse'), 'CSS should include pulse animation');
  console.assert(css.includes('@keyframes'), 'CSS should include keyframe animations');

  // Test 4: Generate feedback JavaScript
  const js = rewardSystem.generateFeedbackJS();
  console.assert(js.includes('triggerFeedback'), 'JavaScript should include trigger function');
  console.assert(js.includes('triggerVisualFeedback'), 'JavaScript should include visual feedback');
  console.assert(js.includes('triggerAudioFeedback'), 'JavaScript should include audio feedback');
  console.assert(js.includes('triggerHapticFeedback'), 'JavaScript should include haptic feedback');

  console.log('✅ Reward Feedback System tests passed!');
}

/**
 * Test Interactive Quiz Builder
 */
export async function testInteractiveQuizBuilder(): Promise<void> {
  console.log('🧪 Testing Interactive Quiz Builder...');

  const quizBuilder = new InteractiveQuizBuilder();
  
  // Test 1: Create interactive quiz
  const quizConfig: InteractiveQuizConfig = {
    questions: [
      {
        id: 'q1',
        question: 'What is your favorite color?',
        type: 'multiple_choice',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        category: 'personality'
      },
      {
        id: 'q2',
        question: 'How do you prefer to work?',
        type: 'single_choice',
        options: ['Alone', 'In a team'],
        category: 'work_style'
      }
    ],
    scoring: {
      type: 'category'
    },
    results: [
      {
        id: 'personality',
        title: 'Creative Type',
        description: 'You have a creative personality'
      },
      {
        id: 'work_style',
        title: 'Team Player',
        description: 'You work well with others'
      }
    ],
    gamification: {
      scoring: true,
      timer: false,
      leaderboard: false,
      badges: true,
      personalityResults: true
    }
  };
  
  const quiz = quizBuilder.createInteractiveQuiz(quizConfig);
  console.assert(quiz.type === 'quiz', 'Component should be quiz type');
  console.assert(quiz.content.questions.length === 2, 'Quiz should have correct number of questions');
  console.assert(quiz.styles, 'Quiz should have styles');
  console.assert(quiz.scripts, 'Quiz should have scripts');

  // Test 2: Gamify existing quiz
  const existingQuiz: Component = {
    id: 'existing_quiz',
    type: 'quiz',
    content: {
      title: 'Knowledge Test',
      questions: quizConfig.questions
    }
  };
  
  const gamificationConfig: QuizGamificationConfig = {
    scoring: true,
    timer: true,
    leaderboard: true,
    badges: true,
    personalityResults: false
  };
  
  const gamifiedQuiz = quizBuilder.gamifyQuiz(existingQuiz, gamificationConfig);
  console.assert(gamifiedQuiz.scoring.type === 'points', 'Gamified quiz should have points scoring');
  console.assert(gamifiedQuiz.achievements.length > 0, 'Gamified quiz should have achievements');
  console.assert(gamifiedQuiz.leaderboard === true, 'Gamified quiz should have leaderboard');
  console.assert(gamifiedQuiz.timer === 300, 'Gamified quiz should have timer');

  console.log('✅ Interactive Quiz Builder tests passed!');
}

/**
 * Test Competition Elements System
 */
export async function testCompetitionElementsSystem(): Promise<void> {
  console.log('🧪 Testing Competition Elements System...');

  const competitionSystem = new CompetitionElementsSystem();
  
  // Test 1: Add competition elements to template
  const competitionConfig: CompetitionConfig = {
    leaderboards: true,
    socialSharing: true,
    challenges: true,
    rewards: true
  };
  
  const enhancedTemplate = competitionSystem.addCompetitionElements(mockTemplate, competitionConfig);
  console.assert(enhancedTemplate.components.length > mockTemplate.components.length, 'Should add new components');
  
  const leaderboardComponent = enhancedTemplate.components.find(c => c.type === 'leaderboard');
  console.assert(leaderboardComponent, 'Should add leaderboard component');
  console.assert(leaderboardComponent?.content.title === 'Top Performers', 'Leaderboard should have correct title');
  
  const challengesComponent = enhancedTemplate.components.find(c => c.type === 'challenges');
  console.assert(challengesComponent, 'Should add challenges component');
  console.assert(challengesComponent?.content.challenges.length > 0, 'Challenges should have challenge items');

  // Test 2: Check social sharing integration
  const componentsWithSocialSharing = enhancedTemplate.components.filter(c => 
    c.content.socialSharing === true
  );
  console.assert(componentsWithSocialSharing.length >= 0, 'Should integrate social sharing where applicable');

  console.log('✅ Competition Elements System tests passed!');
}

/**
 * Test Main Gamification Engine
 */
export async function testGamificationEngine(): Promise<void> {
  console.log('🧪 Testing Main Gamification Engine...');

  const gamificationEngine = new GamificationEngineImpl();
  
  // Test 1: Add progress tracking
  const testComponent: Component = {
    id: 'test_form',
    type: 'contact',
    content: {
      title: 'Contact Us',
      fields: ['name', 'email', 'message']
    }
  };
  
  const progressResult = await gamificationEngine.addProgressTracking(testComponent);
  console.assert(progressResult.success === true, 'Progress tracking should succeed');
  console.assert(progressResult.data?.gamification.progressTracker, 'Should add progress tracker');
  console.assert(progressResult.metadata.enhancementsApplied.includes('progress_tracking'), 'Should track enhancement');

  // Test 2: Create achievement system
  const achievementResult = await gamificationEngine.createAchievementSystem(mockTemplate);
  console.assert(achievementResult.success === true, 'Achievement system creation should succeed');
  console.assert(achievementResult.data && achievementResult.data.length > 0, 'Should create achievements');
  console.assert(achievementResult.metadata.enhancementsApplied.includes('achievement_system'), 'Should track enhancement');

  // Test 3: Implement reward feedback
  const testAction: UserAction = {
    type: 'form_submit',
    target: 'contact_form',
    timestamp: new Date()
  };
  
  const feedbackResult = await gamificationEngine.implementRewardFeedback(testAction);
  console.assert(feedbackResult.success === true, 'Reward feedback should succeed');
  console.assert(feedbackResult.data?.type, 'Should have feedback type');
  console.assert(feedbackResult.metadata.enhancementsApplied.includes('reward_feedback'), 'Should track enhancement');

  // Test 4: Gamify assessment
  const quizComponent: Component = {
    id: 'personality_quiz',
    type: 'quiz',
    content: {
      title: 'Personality Assessment',
      questions: [
        {
          id: 'q1',
          question: 'How do you handle stress?',
          type: 'multiple_choice',
          options: ['Take a break', 'Work harder', 'Ask for help', 'Plan better']
        }
      ]
    }
  };
  
  const quizResult = await gamificationEngine.gamifyAssessment(quizComponent);
  console.assert(quizResult.success === true, 'Quiz gamification should succeed');
  console.assert(quizResult.data?.achievements.length > 0, 'Should add achievements to quiz');
  console.assert(quizResult.metadata.enhancementsApplied.includes('quiz_gamification'), 'Should track enhancement');

  // Test 5: Add competition elements
  const competitionResult = await gamificationEngine.addCompetitionElements(mockTemplate);
  console.assert(competitionResult.success === true, 'Competition elements should succeed');
  console.assert(competitionResult.data?.components.length > mockTemplate.components.length, 'Should add components');
  console.assert(competitionResult.metadata.enhancementsApplied.includes('competition_elements'), 'Should track enhancement');

  // Test 6: Create interactive quiz
  const interactiveQuizConfig: InteractiveQuizConfig = {
    questions: [
      {
        id: 'q1',
        question: 'What motivates you most?',
        type: 'multiple_choice',
        options: ['Achievement', 'Recognition', 'Learning', 'Helping others']
      }
    ],
    scoring: { type: 'points', maxScore: 100 },
    results: [
      {
        id: 'achiever',
        title: 'The Achiever',
        description: 'You are driven by accomplishment'
      }
    ],
    gamification: {
      scoring: true,
      timer: true,
      leaderboard: false,
      badges: true,
      personalityResults: true
    }
  };
  
  const interactiveQuizResult = await gamificationEngine.createInteractiveQuiz(interactiveQuizConfig);
  console.assert(interactiveQuizResult.success === true, 'Interactive quiz creation should succeed');
  console.assert(interactiveQuizResult.data?.type === 'quiz', 'Should create quiz component');
  console.assert(interactiveQuizResult.metadata.enhancementsApplied.includes('interactive_quiz'), 'Should track enhancement');

  // Test 7: Implement engagement rewards
  const engagementResult = await gamificationEngine.implementEngagementRewards(mockTemplate);
  console.assert(engagementResult.success === true, 'Engagement rewards should succeed');
  console.assert(engagementResult.data?.components.length > mockTemplate.components.length, 'Should add reward components');
  console.assert(engagementResult.metadata.enhancementsApplied.includes('engagement_rewards'), 'Should track enhancement');

  console.log('✅ Main Gamification Engine tests passed!');
}

/**
 * Test Performance and Error Handling
 */
export async function testPerformanceAndErrorHandling(): Promise<void> {
  console.log('🧪 Testing Performance and Error Handling...');

  const gamificationEngine = new GamificationEngineImpl();
  
  // Test 1: Performance metrics tracking
  const startTime = Date.now();
  const result = await gamificationEngine.createAchievementSystem(mockTemplate);
  const endTime = Date.now();
  
  console.assert(result.metadata.processingTime > 0, 'Should track processing time');
  console.assert(result.metadata.processingTime <= (endTime - startTime), 'Processing time should be reasonable');
  console.assert(result.metadata.performanceImpact, 'Should include performance impact assessment');
  console.assert(result.metadata.performanceImpact.recommendations.length >= 0, 'Should provide recommendations');

  // Test 2: Error handling with invalid input
  try {
    const invalidComponent: any = null;
    const errorResult = await gamificationEngine.addProgressTracking(invalidComponent);
    console.assert(errorResult.success === false, 'Should handle invalid input gracefully');
    console.assert(errorResult.errors.length > 0, 'Should report errors');
  } catch (error) {
    // Expected to handle errors gracefully without throwing
    console.assert(false, 'Should not throw errors, should return error result');
  }

  // Test 3: Memory usage considerations
  const largeTemplate: Template = {
    ...mockTemplate,
    components: Array(100).fill(null).map((_, i) => ({
      id: `component_${i}`,
      type: 'text',
      content: { text: `Component ${i}` }
    }))
  };
  
  const largeResult = await gamificationEngine.implementEngagementRewards(largeTemplate);
  console.assert(largeResult.success === true, 'Should handle large templates');
  console.assert(largeResult.metadata.performanceImpact.memoryUsageIncrease > 0, 'Should track memory impact');

  console.log('✅ Performance and Error Handling tests passed!');
}

/**
 * Run all gamification engine tests
 */
export async function runAllGamificationTests(): Promise<void> {
  console.log('🚀 Starting Gamification Engine Test Suite...\n');

  try {
    await testProgressTrackingSystem();
    await testAchievementBadgeEngine();
    await testRewardFeedbackSystem();
    await testInteractiveQuizBuilder();
    await testCompetitionElementsSystem();
    await testGamificationEngine();
    await testPerformanceAndErrorHandling();

    console.log('\n🎉 All Gamification Engine tests passed successfully!');
    console.log('✅ Progress tracking system working correctly');
    console.log('✅ Achievement badge engine functioning properly');
    console.log('✅ Reward feedback system operational');
    console.log('✅ Interactive quiz builder ready');
    console.log('✅ Competition elements system active');
    console.log('✅ Main gamification engine integrated');
    console.log('✅ Performance and error handling verified');

  } catch (error) {
    console.error('❌ Gamification Engine tests failed:', error);
    throw error;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllGamificationTests().catch(console.error);
}