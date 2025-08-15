/**
 * Test Suite for Analytics and Optimization Integration System
 * Comprehensive testing for analytics tracking, A/B testing, and optimization recommendations
 */

import { 
  AnalyticsOptimizationIntegration, 
  createAnalyticsOptimizationIntegration,
  analyticsOptimizationIntegration 
} from './analytics-optimization-integration';

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  details?: any;
}

class AnalyticsOptimizationIntegrationTester {
  private results: TestResult[] = [];
  private integration: AnalyticsOptimizationIntegration;

  constructor() {
    this.integration = createAnalyticsOptimizationIntegration({
      enabled: true,
      trackingProviders: ['google_analytics', 'internal'],
      realTimeAnalytics: true,
      heatmapRecording: true,
      clickTracking: true,
      scrollDepthAnalysis: true,
      abTesting: true,
      optimizationEngine: true,
      marketingIntegration: true,
      attributionTracking: true
    });
  }

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting Analytics Optimization Integration Tests...\n');

    // Core functionality tests
    await this.testInitialization();
    await this.testConversionMetrics();
    await this.testUserBehaviorMetrics();
    await this.testEngagementMetrics();
    
    // A/B testing tests
    await this.testABTestCreation();
    await this.testABTestResults();
    
    // Optimization tests
    await this.testOptimizationInsights();
    await this.testOptimizationReport();
    
    // Marketing integration tests
    await this.testMarketingAttribution();
    
    // Data export tests
    await this.testDataExport();
    
    // Configuration tests
    await this.testConfigurationManagement();

    this.printResults();
    return this.results;
  }

  private async testInitialization(): Promise<void> {
    try {
      await this.integration.initialize();
      
      const config = this.integration.getConfig();
      
      if (!config.enabled) {
        throw new Error('Integration should be enabled after initialization');
      }

      this.addResult('Integration Initialization', true, {
        config: config
      });
    } catch (error) {
      this.addResult('Integration Initialization', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testConversionMetrics(): Promise<void> {
    try {
      const metrics = await this.integration.getConversionMetrics();
      
      // Validate required fields
      const requiredFields = [
        'conversionRate', 'totalConversions', 'totalVisitors', 
        'averageTimeToConversion', 'conversionsBySource', 
        'conversionsByDevice', 'conversionFunnelData'
      ];
      
      for (const field of requiredFields) {
        if (!(field in metrics)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate conversion rate calculation
      const calculatedRate = (metrics.totalConversions / metrics.totalVisitors) * 100;
      if (Math.abs(calculatedRate - metrics.conversionRate) > 0.1) {
        throw new Error('Conversion rate calculation mismatch');
      }

      // Validate funnel data
      if (!Array.isArray(metrics.conversionFunnelData) || metrics.conversionFunnelData.length === 0) {
        throw new Error('Funnel data should be a non-empty array');
      }

      this.addResult('Conversion Metrics Retrieval', true, {
        conversionRate: metrics.conversionRate,
        totalConversions: metrics.totalConversions,
        funnelSteps: metrics.conversionFunnelData.length
      });
    } catch (error) {
      this.addResult('Conversion Metrics Retrieval', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testUserBehaviorMetrics(): Promise<void> {
    try {
      const metrics = await this.integration.getUserBehaviorMetrics();
      
      // Validate required fields
      const requiredFields = [
        'pageViews', 'uniqueVisitors', 'bounceRate', 
        'averageSessionDuration', 'pagesPerSession', 
        'topPages', 'userFlow', 'engagementScore'
      ];
      
      for (const field of requiredFields) {
        if (!(field in metrics)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate bounce rate range
      if (metrics.bounceRate < 0 || metrics.bounceRate > 100) {
        throw new Error('Bounce rate should be between 0 and 100');
      }

      // Validate engagement score range
      if (metrics.engagementScore < 0 || metrics.engagementScore > 100) {
        throw new Error('Engagement score should be between 0 and 100');
      }

      this.addResult('User Behavior Metrics Retrieval', true, {
        uniqueVisitors: metrics.uniqueVisitors,
        bounceRate: metrics.bounceRate,
        engagementScore: metrics.engagementScore
      });
    } catch (error) {
      this.addResult('User Behavior Metrics Retrieval', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testEngagementMetrics(): Promise<void> {
    try {
      const metrics = await this.integration.getEngagementMetrics();
      
      // Validate required fields
      const requiredFields = [
        'clickThroughRate', 'interactionRate', 'scrollDepthAverage',
        'videoCompletionRate', 'formCompletionRate', 'socialShares',
        'commentEngagement', 'timeOnSite'
      ];
      
      for (const field of requiredFields) {
        if (!(field in metrics)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate percentage fields
      const percentageFields = ['clickThroughRate', 'interactionRate', 'scrollDepthAverage', 'videoCompletionRate', 'formCompletionRate'];
      for (const field of percentageFields) {
        const value = metrics[field as keyof typeof metrics] as number;
        if (value < 0 || value > 100) {
          throw new Error(`${field} should be between 0 and 100`);
        }
      }

      this.addResult('Engagement Metrics Retrieval', true, {
        clickThroughRate: metrics.clickThroughRate,
        interactionRate: metrics.interactionRate,
        scrollDepthAverage: metrics.scrollDepthAverage
      });
    } catch (error) {
      this.addResult('Engagement Metrics Retrieval', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testABTestCreation(): Promise<void> {
    try {
      const testId = await this.integration.createABTest({
        name: 'Button Color Test',
        description: 'Testing different button colors for conversion',
        targetElement: '.cta-button',
        variants: [
          { name: 'Control', content: 'blue' },
          { name: 'Variant A', content: 'orange' },
          { name: 'Variant B', content: 'green' }
        ],
        conversionGoal: 'button_click',
        duration: 14
      });

      if (!testId || typeof testId !== 'string') {
        throw new Error('Test ID should be a non-empty string');
      }

      this.addResult('A/B Test Creation', true, {
        testId: testId
      });
    } catch (error) {
      this.addResult('A/B Test Creation', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testABTestResults(): Promise<void> {
    try {
      // First create a test
      const testId = await this.integration.createABTest({
        name: 'Headline Test',
        description: 'Testing different headlines',
        targetElement: '.headline',
        variants: [
          { name: 'Control', content: 'Original Headline' },
          { name: 'Variant', content: 'New Headline' }
        ],
        conversionGoal: 'form_submit'
      });

      // Get test results
      const results = await this.integration.getABTestResults(testId);

      if (!Array.isArray(results)) {
        throw new Error('Test results should be an array');
      }

      // Validate result structure
      for (const result of results) {
        const requiredFields = ['testId', 'variantId', 'pValue', 'confidenceLevel', 'isSignificant', 'sampleSize', 'effect', 'recommendation'];
        for (const field of requiredFields) {
          if (!(field in result)) {
            throw new Error(`Missing required field in test result: ${field}`);
          }
        }
      }

      this.addResult('A/B Test Results Retrieval', true, {
        testId: testId,
        resultsCount: results.length
      });
    } catch (error) {
      this.addResult('A/B Test Results Retrieval', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testOptimizationInsights(): Promise<void> {
    try {
      const insights = await this.integration.getOptimizationInsights();

      if (!Array.isArray(insights)) {
        throw new Error('Insights should be an array');
      }

      // Validate insight structure
      for (const insight of insights) {
        const requiredFields = [
          'id', 'type', 'priority', 'title', 'description', 
          'impact', 'effort', 'recommendation', 'expectedImprovement',
          'implementationSteps', 'relatedMetrics', 'confidence'
        ];
        
        for (const field of requiredFields) {
          if (!(field in insight)) {
            throw new Error(`Missing required field in insight: ${field}`);
          }
        }

        // Validate confidence range
        if (insight.confidence < 0 || insight.confidence > 1) {
          throw new Error('Confidence should be between 0 and 1');
        }

        // Validate enum values
        const validTypes = ['conversion', 'engagement', 'performance', 'user_experience'];
        if (!validTypes.includes(insight.type)) {
          throw new Error(`Invalid insight type: ${insight.type}`);
        }

        const validPriorities = ['low', 'medium', 'high', 'critical'];
        if (!validPriorities.includes(insight.priority)) {
          throw new Error(`Invalid priority: ${insight.priority}`);
        }
      }

      this.addResult('Optimization Insights Generation', true, {
        insightsCount: insights.length,
        highPriorityCount: insights.filter(i => i.priority === 'high' || i.priority === 'critical').length
      });
    } catch (error) {
      this.addResult('Optimization Insights Generation', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testOptimizationReport(): Promise<void> {
    try {
      const report = await this.integration.generateOptimizationReport();

      const requiredFields = ['summary', 'insights', 'recommendations', 'prioritizedActions'];
      for (const field of requiredFields) {
        if (!(field in report)) {
          throw new Error(`Missing required field in report: ${field}`);
        }
      }

      // Validate arrays
      if (!Array.isArray(report.insights)) {
        throw new Error('Report insights should be an array');
      }

      if (!Array.isArray(report.recommendations)) {
        throw new Error('Report recommendations should be an array');
      }

      if (!Array.isArray(report.prioritizedActions)) {
        throw new Error('Report prioritized actions should be an array');
      }

      // Validate summary is a string
      if (typeof report.summary !== 'string' || report.summary.length === 0) {
        throw new Error('Report summary should be a non-empty string');
      }

      this.addResult('Optimization Report Generation', true, {
        insightsCount: report.insights.length,
        recommendationsCount: report.recommendations.length,
        prioritizedActionsCount: report.prioritizedActions.length
      });
    } catch (error) {
      this.addResult('Optimization Report Generation', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testMarketingAttribution(): Promise<void> {
    try {
      const attribution = await this.integration.getMarketingAttribution();

      if (!Array.isArray(attribution)) {
        throw new Error('Attribution data should be an array');
      }

      // Validate attribution structure
      for (const item of attribution) {
        const requiredFields = ['source', 'medium', 'campaign', 'visitors', 'conversions', 'conversionRate', 'revenue'];
        for (const field of requiredFields) {
          if (!(field in item)) {
            throw new Error(`Missing required field in attribution: ${field}`);
          }
        }

        // Validate conversion rate calculation
        const calculatedRate = (item.conversions / item.visitors) * 100;
        if (Math.abs(calculatedRate - item.conversionRate) > 0.1) {
          throw new Error('Attribution conversion rate calculation mismatch');
        }
      }

      this.addResult('Marketing Attribution Retrieval', true, {
        attributionSourcesCount: attribution.length,
        totalVisitors: attribution.reduce((sum, item) => sum + item.visitors, 0)
      });
    } catch (error) {
      this.addResult('Marketing Attribution Retrieval', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testDataExport(): Promise<void> {
    try {
      // Test JSON export
      const jsonBlob = await this.integration.exportAnalyticsData('json');
      if (!(jsonBlob instanceof Blob)) {
        throw new Error('JSON export should return a Blob');
      }

      // Test CSV export
      const csvBlob = await this.integration.exportAnalyticsData('csv');
      if (!(csvBlob instanceof Blob)) {
        throw new Error('CSV export should return a Blob');
      }

      // Test PDF export
      const pdfBlob = await this.integration.exportAnalyticsData('pdf');
      if (!(pdfBlob instanceof Blob)) {
        throw new Error('PDF export should return a Blob');
      }

      this.addResult('Data Export Functionality', true, {
        jsonSize: jsonBlob.size,
        csvSize: csvBlob.size,
        pdfSize: pdfBlob.size
      });
    } catch (error) {
      this.addResult('Data Export Functionality', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testConfigurationManagement(): Promise<void> {
    try {
      const originalConfig = this.integration.getConfig();
      
      // Test config update
      await this.integration.updateConfig({
        realTimeAnalytics: false,
        heatmapRecording: false
      });

      const updatedConfig = this.integration.getConfig();
      
      if (updatedConfig.realTimeAnalytics !== false) {
        throw new Error('Real-time analytics should be disabled');
      }

      if (updatedConfig.heatmapRecording !== false) {
        throw new Error('Heatmap recording should be disabled');
      }

      // Restore original config
      await this.integration.updateConfig(originalConfig);

      this.addResult('Configuration Management', true, {
        originalEnabled: originalConfig.enabled,
        updatedRealTime: updatedConfig.realTimeAnalytics
      });
    } catch (error) {
      this.addResult('Configuration Management', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testCustomEventTracking(): Promise<void> {
    try {
      await this.integration.trackCustomEvent('test_event', {
        category: 'testing',
        action: 'custom_tracking',
        value: 123
      });

      // Since tracking is async and we can't easily verify the result,
      // we'll just check that the method doesn't throw
      this.addResult('Custom Event Tracking', true);
    } catch (error) {
      this.addResult('Custom Event Tracking', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private addResult(testName: string, passed: boolean, details?: any): void {
    this.results.push({
      testName,
      passed,
      error: passed ? undefined : (typeof details === 'string' ? details : 'Test failed'),
      details: passed ? details : undefined
    });
  }

  private printResults(): void {
    console.log('\n📊 Analytics Optimization Integration Test Results:');
    console.log('=' .repeat(60));

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;

    this.results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.testName}`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      if (result.details && typeof result.details === 'object') {
        console.log(`   Details:`, result.details);
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log(`📈 Overall Results: ${passed}/${total} tests passed (${Math.round(passed/total*100)}%)`);
    
    if (passed === total) {
      console.log('🎉 All analytics optimization integration tests passed!');
    } else {
      console.log(`⚠️  ${total - passed} test(s) failed. Please review the errors above.`);
    }
  }
}

// Export test functions
export async function testAnalyticsOptimizationIntegration(): Promise<TestResult[]> {
  const tester = new AnalyticsOptimizationIntegrationTester();
  return await tester.runAllTests();
}

export function createAnalyticsOptimizationIntegrationTest() {
  return new AnalyticsOptimizationIntegrationTester();
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  testAnalyticsOptimizationIntegration()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}