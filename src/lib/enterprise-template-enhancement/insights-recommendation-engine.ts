/**
 * Insights and Recommendation Engine
 * Actionable insights and optimization recommendations based on analytics data
 */

import { OptimizationRecommendation } from './types';

export interface InsightsConfig {
  enabled: boolean;
  analysisDepth: 'basic' | 'advanced' | 'comprehensive';
  industryBenchmarks: boolean;
  competitorAnalysis: boolean;
  predictiveAnalytics: boolean;
  realTimeInsights: boolean;
}

export interface AnalyticsDataInput {
  conversionMetrics: {
    conversionRate: number;
    totalConversions: number;
    totalVisitors: number;
    averageTimeToConversion: number;
    conversionsBySource: Record<string, number>;
    conversionsByDevice: Record<string, number>;
    funnelDropOffRates: number[];
  };
  behaviorMetrics: {
    bounceRate: number;
    averageSessionDuration: number;
    pagesPerSession: number;
    exitPages: string[];
    topLandingPages: string[];
  };
  engagementMetrics: {
    clickThroughRate: number;
    interactionRate: number;
    scrollDepthAverage: number;
    formCompletionRate: number;
    videoCompletionRate: number;
  };
  performanceMetrics: {
    pageLoadTime: number;
    timeToInteractive: number;
    cumulativeLayoutShift: number;
    firstContentfulPaint: number;
  };
  userSegments: {
    newUsers: number;
    returningUsers: number;
    mobileUsers: number;
    desktopUsers: number;
  };
}

export interface IndustryBenchmark {
  metric: string;
  industry: string;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
}

export interface InsightPattern {
  id: string;
  name: string;
  description: string;
  conditions: InsightCondition[];
  recommendation: OptimizationRecommendation;
  confidence: number;
}

export interface InsightCondition {
  metric: string;
  operator: 'less_than' | 'greater_than' | 'equals' | 'between';
  value: number | [number, number];
  benchmark?: 'industry' | 'best_practice' | 'absolute';
}

export interface PredictiveInsight {
  id: string;
  type: 'trend' | 'forecast' | 'anomaly' | 'opportunity';
  title: string;
  description: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high';
  dataPoints: Array<{ date: string; value: number; predicted?: boolean }>;
}

export interface CompetitorInsight {
  id: string;
  competitorName: string;
  metric: string;
  ourValue: number;
  competitorValue: number;
  gap: number;
  opportunity: string;
  recommendation: string;
}

export class InsightsRecommendationEngine {
  private config: InsightsConfig;
  private industryBenchmarks: Map<string, IndustryBenchmark[]> = new Map();
  private insightPatterns: InsightPattern[] = [];
  private historicalData: AnalyticsDataInput[] = [];

  constructor(config: InsightsConfig) {
    this.config = config;
    this.initializeInsightPatterns();
    this.loadIndustryBenchmarks();
  }

  async generateInsights(data: AnalyticsDataInput, industry?: string): Promise<OptimizationRecommendation[]> {
    const insights: OptimizationRecommendation[] = [];

    // Store historical data for trend analysis
    this.historicalData.push(data);
    if (this.historicalData.length > 30) {
      this.historicalData.shift(); // Keep last 30 data points
    }

    // Generate conversion optimization insights
    insights.push(...this.analyzeConversionMetrics(data, industry));

    // Generate user experience insights
    insights.push(...this.analyzeUserExperience(data, industry));

    // Generate engagement insights
    insights.push(...this.analyzeEngagement(data, industry));

    // Generate performance insights
    insights.push(...this.analyzePerformance(data, industry));

    // Generate funnel optimization insights
    insights.push(...this.analyzeFunnelOptimization(data));

    // Generate device-specific insights
    insights.push(...this.analyzeDevicePerformance(data));

    // Generate traffic source insights
    insights.push(...this.analyzeTrafficSources(data));

    // Apply pattern matching for additional insights
    insights.push(...this.applyInsightPatterns(data));

    // Sort by priority and confidence
    return insights.sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority];
      const bPriority = priorityWeight[b.priority];

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return b.confidence - a.confidence;
    });
  }

  async generatePredictiveInsights(_data: AnalyticsDataInput): Promise<PredictiveInsight[]> {
    if (!this.config.predictiveAnalytics || this.historicalData.length < 7) {
      return [];
    }

    const insights: PredictiveInsight[] = [];

    // Trend analysis
    insights.push(...this.analyzeTrends());

    // Anomaly detection
    insights.push(...this.detectAnomalies());

    // Forecasting
    insights.push(...this.generateForecasts());

    return insights;
  }

  async generateCompetitorInsights(data: AnalyticsDataInput, industry: string): Promise<CompetitorInsight[]> {
    if (!this.config.competitorAnalysis) {
      return [];
    }

    // In a real implementation, this would integrate with competitor analysis tools
    return [
      {
        id: 'competitor_conversion_rate',
        competitorName: 'Industry Average',
        metric: 'Conversion Rate',
        ourValue: data.conversionMetrics.conversionRate,
        competitorValue: 3.8,
        gap: 3.8 - data.conversionMetrics.conversionRate,
        opportunity: 'Improve conversion rate to match industry average',
        recommendation: 'Focus on CTA optimization and form simplification'
      }
    ];
  }

  private analyzeConversionMetrics(data: AnalyticsDataInput, _industry?: string): OptimizationRecommendation[] {
    const insights: OptimizationRecommendation[] = [];

    // Low conversion rate analysis
    if (data.conversionMetrics.conversionRate < 2.0) {
      insights.push({
        id: 'low_conversion_rate',
        type: 'conversion',
        priority: 'high',
        title: 'Low Conversion Rate Detected',
        description: `Current conversion rate of ${data.conversionMetrics.conversionRate}% is below industry standards`,
        impact: 'high',
        effort: 'medium',
        recommendation: 'Optimize call-to-action buttons, simplify forms, and improve value proposition clarity',
        expectedImprovement: '25-40% increase in conversion rate',
        implementationSteps: [
          'A/B test different CTA button colors and text',
          'Reduce form fields to essential information only',
          'Add trust signals and social proof near conversion points',
          'Improve page loading speed',
          'Test different value proposition headlines'
        ],
        relatedMetrics: ['conversion_rate', 'form_completion_rate'],
        confidence: 0.85
      });
    }

    // High time to conversion analysis
    if (data.conversionMetrics.averageTimeToConversion > 300) {
      insights.push({
        id: 'slow_conversion_process',
        type: 'conversion',
        priority: 'medium',
        title: 'Lengthy Conversion Process',
        description: `Average time to conversion of ${Math.round(data.conversionMetrics.averageTimeToConversion / 60)} minutes indicates friction in the process`,
        impact: 'medium',
        effort: 'medium',
        recommendation: 'Streamline the conversion process and reduce decision-making friction',
        expectedImprovement: '15-25% reduction in conversion time',
        implementationSteps: [
          'Simplify checkout or signup process',
          'Add progress indicators to multi-step forms',
          'Implement guest checkout options',
          'Reduce required form fields',
          'Add live chat support for immediate assistance'
        ],
        relatedMetrics: ['average_time_to_conversion', 'form_abandonment_rate'],
        confidence: 0.78
      });
    }

    return insights;
  }

  private analyzeUserExperience(data: AnalyticsDataInput, _industry?: string): OptimizationRecommendation[] {
    const insights: OptimizationRecommendation[] = [];

    // High bounce rate analysis
    if (data.behaviorMetrics.bounceRate > 60) {
      insights.push({
        id: 'high_bounce_rate',
        type: 'user_experience',
        priority: 'high',
        title: 'High Bounce Rate Indicates UX Issues',
        description: `Bounce rate of ${data.behaviorMetrics.bounceRate}% suggests visitors aren't finding what they expect`,
        impact: 'high',
        effort: 'medium',
        recommendation: 'Improve page relevance, loading speed, and initial user experience',
        expectedImprovement: '20-30% reduction in bounce rate',
        implementationSteps: [
          'Optimize page loading speed (target <3 seconds)',
          'Improve headline and value proposition clarity',
          'Ensure mobile responsiveness',
          'Add engaging visual elements above the fold',
          'Implement exit-intent popups with value offers'
        ],
        relatedMetrics: ['bounce_rate', 'page_load_time', 'mobile_usability'],
        confidence: 0.82
      });
    }

    // Low session duration analysis
    if (data.behaviorMetrics.averageSessionDuration < 60) {
      insights.push({
        id: 'low_engagement_time',
        type: 'engagement',
        priority: 'medium',
        title: 'Low Average Session Duration',
        description: `Average session duration of ${Math.round(data.behaviorMetrics.averageSessionDuration)} seconds indicates low engagement`,
        impact: 'medium',
        effort: 'medium',
        recommendation: 'Increase content engagement and provide clear navigation paths',
        expectedImprovement: '30-50% increase in session duration',
        implementationSteps: [
          'Add related content recommendations',
          'Implement interactive elements (quizzes, calculators)',
          'Improve internal linking structure',
          'Add video content to increase engagement',
          'Create compelling calls-to-action throughout the page'
        ],
        relatedMetrics: ['average_session_duration', 'pages_per_session'],
        confidence: 0.75
      });
    }

    return insights;
  }

  private analyzeEngagement(data: AnalyticsDataInput, _industry?: string): OptimizationRecommendation[] {
    const insights: OptimizationRecommendation[] = [];

    // Low click-through rate
    if (data.engagementMetrics.clickThroughRate < 2.0) {
      insights.push({
        id: 'low_ctr',
        type: 'engagement',
        priority: 'medium',
        title: 'Low Click-Through Rate on CTAs',
        description: `CTR of ${data.engagementMetrics.clickThroughRate}% indicates CTA optimization opportunities`,
        impact: 'medium',
        effort: 'low',
        recommendation: 'Optimize call-to-action design, placement, and messaging',
        expectedImprovement: '40-60% increase in click-through rate',
        implementationSteps: [
          'Test different CTA button colors (orange, green, red)',
          'Experiment with action-oriented text ("Get Started Now" vs "Learn More")',
          'Improve CTA placement and visibility',
          'Add urgency or scarcity elements',
          'Test different button sizes and shapes'
        ],
        relatedMetrics: ['click_through_rate', 'conversion_rate'],
        confidence: 0.88
      });
    }

    // Low form completion rate
    if (data.engagementMetrics.formCompletionRate < 70) {
      insights.push({
        id: 'form_abandonment',
        type: 'conversion',
        priority: 'high',
        title: 'High Form Abandonment Rate',
        description: `Form completion rate of ${data.engagementMetrics.formCompletionRate}% indicates form optimization needed`,
        impact: 'high',
        effort: 'medium',
        recommendation: 'Simplify forms and reduce friction in the completion process',
        expectedImprovement: '25-35% improvement in form completion',
        implementationSteps: [
          'Reduce number of required fields',
          'Implement progressive form disclosure',
          'Add real-time validation with helpful error messages',
          'Use smart defaults and auto-fill where possible',
          'Add progress indicators for multi-step forms'
        ],
        relatedMetrics: ['form_completion_rate', 'conversion_rate'],
        confidence: 0.91
      });
    }

    return insights;
  }

  private analyzePerformance(data: AnalyticsDataInput, _industry?: string): OptimizationRecommendation[] {
    const insights: OptimizationRecommendation[] = [];

    // Slow page load time
    if (data.performanceMetrics.pageLoadTime > 3000) {
      insights.push({
        id: 'slow_page_load',
        type: 'performance',
        priority: 'critical',
        title: 'Page Load Speed Optimization Required',
        description: `Page load time of ${(data.performanceMetrics.pageLoadTime / 1000).toFixed(1)}s exceeds recommended 3s threshold`,
        impact: 'high',
        effort: 'high',
        recommendation: 'Implement comprehensive performance optimization strategy',
        expectedImprovement: '10-15% reduction in bounce rate, 5-10% increase in conversions',
        implementationSteps: [
          'Optimize and compress images (WebP format)',
          'Minify CSS, JavaScript, and HTML',
          'Enable gzip compression',
          'Implement lazy loading for images and videos',
          'Use a Content Delivery Network (CDN)',
          'Optimize server response time',
          'Remove unused CSS and JavaScript'
        ],
        relatedMetrics: ['page_load_time', 'bounce_rate', 'conversion_rate'],
        confidence: 0.95
      });
    }

    // High cumulative layout shift
    if (data.performanceMetrics.cumulativeLayoutShift > 0.1) {
      insights.push({
        id: 'layout_stability',
        type: 'user_experience',
        priority: 'medium',
        title: 'Layout Stability Issues Detected',
        description: `CLS score of ${data.performanceMetrics.cumulativeLayoutShift.toFixed(3)} indicates layout shifting problems`,
        impact: 'medium',
        effort: 'medium',
        recommendation: 'Improve layout stability to enhance user experience',
        expectedImprovement: '5-10% improvement in user engagement',
        implementationSteps: [
          'Set explicit dimensions for images and videos',
          'Reserve space for dynamic content',
          'Avoid inserting content above existing content',
          'Use CSS aspect-ratio for responsive images',
          'Preload critical fonts to prevent font swapping'
        ],
        relatedMetrics: ['cumulative_layout_shift', 'user_experience_score'],
        confidence: 0.73
      });
    }

    return insights;
  }

  private analyzeFunnelOptimization(data: AnalyticsDataInput): OptimizationRecommendation[] {
    const insights: OptimizationRecommendation[] = [];

    // Analyze funnel drop-off rates
    const highDropOffSteps = data.conversionMetrics.funnelDropOffRates
      .map((rate, index) => ({ step: index, rate }))
      .filter(step => step.rate > 50);

    if (highDropOffSteps.length > 0) {
      const worstStep = highDropOffSteps.reduce((worst, current) =>
        current.rate > worst.rate ? current : worst
      );

      insights.push({
        id: 'funnel_optimization',
        type: 'conversion',
        priority: 'high',
        title: 'High Drop-off Rate in Conversion Funnel',
        description: `Step ${worstStep.step + 1} has ${worstStep.rate}% drop-off rate, indicating a major friction point`,
        impact: 'high',
        effort: 'medium',
        recommendation: 'Optimize the highest drop-off step in your conversion funnel',
        expectedImprovement: '20-30% improvement in overall conversion rate',
        implementationSteps: [
          'Analyze user behavior at the problematic step',
          'Simplify the process or reduce required information',
          'Add progress indicators and reassurance',
          'Test different layouts and messaging',
          'Implement exit-intent surveys to understand friction points'
        ],
        relatedMetrics: ['funnel_conversion_rate', 'step_completion_rate'],
        confidence: 0.87
      });
    }

    return insights;
  }

  private analyzeDevicePerformance(data: AnalyticsDataInput): OptimizationRecommendation[] {
    const insights: OptimizationRecommendation[] = [];

    const mobilePercentage = (data.userSegments.mobileUsers /
      (data.userSegments.mobileUsers + data.userSegments.desktopUsers)) * 100;

    // Mobile optimization opportunity
    if (mobilePercentage > 60 && data.conversionMetrics.conversionsByDevice.mobile < data.conversionMetrics.conversionsByDevice.desktop) {
      insights.push({
        id: 'mobile_optimization',
        type: 'user_experience',
        priority: 'high',
        title: 'Mobile Conversion Rate Underperforming',
        description: `${mobilePercentage.toFixed(1)}% of traffic is mobile, but mobile conversion rate is lower than desktop`,
        impact: 'high',
        effort: 'medium',
        recommendation: 'Optimize mobile user experience and conversion flow',
        expectedImprovement: '15-25% increase in mobile conversions',
        implementationSteps: [
          'Implement mobile-first responsive design',
          'Optimize touch targets and button sizes',
          'Simplify mobile forms and checkout process',
          'Improve mobile page loading speed',
          'Test mobile-specific payment options (Apple Pay, Google Pay)'
        ],
        relatedMetrics: ['mobile_conversion_rate', 'mobile_bounce_rate'],
        confidence: 0.83
      });
    }

    return insights;
  }

  private analyzeTrafficSources(data: AnalyticsDataInput): OptimizationRecommendation[] {
    const insights: OptimizationRecommendation[] = [];

    // Find best and worst performing traffic sources
    const sources = Object.entries(data.conversionMetrics.conversionsBySource);
    if (sources.length > 1) {
      const bestSource = sources.reduce((best, current) =>
        current[1] > best[1] ? current : best
      );
      const worstSource = sources.reduce((worst, current) =>
        current[1] < worst[1] ? current : worst
      );

      if (bestSource[1] > worstSource[1] * 2) {
        insights.push({
          id: 'traffic_source_optimization',
          type: 'conversion',
          priority: 'medium',
          title: 'Significant Traffic Source Performance Gap',
          description: `${bestSource[0]} converts ${bestSource[1]} times better than ${worstSource[0]}`,
          impact: 'medium',
          effort: 'low',
          recommendation: 'Optimize underperforming traffic sources or reallocate budget to high-performing ones',
          expectedImprovement: '10-20% improvement in overall conversion rate',
          implementationSteps: [
            `Analyze why ${bestSource[0]} traffic converts better`,
            `Create dedicated landing pages for ${worstSource[0]} traffic`,
            'Align messaging and expectations across traffic sources',
            'Consider increasing budget allocation to high-performing sources',
            'Implement source-specific A/B tests'
          ],
          relatedMetrics: ['conversion_by_source', 'traffic_quality'],
          confidence: 0.76
        });
      }
    }

    return insights;
  }

  private applyInsightPatterns(data: AnalyticsDataInput): OptimizationRecommendation[] {
    const insights: OptimizationRecommendation[] = [];

    for (const pattern of this.insightPatterns) {
      let matches = true;

      for (const condition of pattern.conditions) {
        const value = this.getMetricValue(data, condition.metric);
        if (value === null) {
          matches = false;
          break;
        }

        switch (condition.operator) {
          case 'less_than':
            if (typeof condition.value === 'number' && value >= condition.value) matches = false;
            break;
          case 'greater_than':
            if (typeof condition.value === 'number' && value <= condition.value) matches = false;
            break;
          case 'equals':
            if (typeof condition.value === 'number' && value !== condition.value) matches = false;
            break;
          case 'between':
            if (Array.isArray(condition.value)) {
              const [min, max] = condition.value;
              if (value < min || value > max) matches = false;
            }
            break;
        }

        if (!matches) break;
      }

      if (matches) {
        insights.push(pattern.recommendation);
      }
    }

    return insights;
  }

  private analyzeTrends(): PredictiveInsight[] {
    if (this.historicalData.length < 7) return [];

    const insights: PredictiveInsight[] = [];

    // Analyze conversion rate trend
    const conversionRates = this.historicalData.map(d => d.conversionMetrics.conversionRate);
    const trend = this.calculateTrend(conversionRates);

    if (Math.abs(trend) > 0.1) {
      insights.push({
        id: 'conversion_trend',
        type: 'trend',
        title: trend > 0 ? 'Positive Conversion Rate Trend' : 'Declining Conversion Rate Trend',
        description: `Conversion rate is ${trend > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(trend).toFixed(2)}% per period`,
        prediction: `If trend continues, conversion rate will be ${(conversionRates[conversionRates.length - 1] + trend * 7).toFixed(2)}% in 7 periods`,
        confidence: 0.75,
        timeframe: '7 periods',
        impact: Math.abs(trend) > 0.5 ? 'high' : 'medium',
        dataPoints: conversionRates.map((rate, index) => ({
          date: `Period ${index + 1}`,
          value: rate
        }))
      });
    }

    return insights;
  }

  private detectAnomalies(): PredictiveInsight[] {
    if (this.historicalData.length < 10) return [];

    const insights: PredictiveInsight[] = [];
    const latest = this.historicalData[this.historicalData.length - 1];
    const historical = this.historicalData.slice(0, -1);

    // Check for bounce rate anomaly
    const bounceRates = historical.map(d => d.behaviorMetrics.bounceRate);
    const avgBounceRate = bounceRates.reduce((sum, rate) => sum + rate, 0) / bounceRates.length;
    const stdDev = Math.sqrt(bounceRates.reduce((sum, rate) => sum + Math.pow(rate - avgBounceRate, 2), 0) / bounceRates.length);

    if (Math.abs(latest.behaviorMetrics.bounceRate - avgBounceRate) > 2 * stdDev) {
      insights.push({
        id: 'bounce_rate_anomaly',
        type: 'anomaly',
        title: 'Bounce Rate Anomaly Detected',
        description: `Current bounce rate of ${latest.behaviorMetrics.bounceRate}% is significantly different from historical average of ${avgBounceRate.toFixed(1)}%`,
        prediction: 'This anomaly may indicate a technical issue or significant change in user behavior',
        confidence: 0.85,
        timeframe: 'Current period',
        impact: 'high',
        dataPoints: bounceRates.map((rate, index) => ({
          date: `Period ${index + 1}`,
          value: rate
        }))
      });
    }

    return insights;
  }

  private generateForecasts(): PredictiveInsight[] {
    if (this.historicalData.length < 14) return [];

    const insights: PredictiveInsight[] = [];

    // Simple linear regression forecast for conversion rate
    const conversionRates = this.historicalData.map(d => d.conversionMetrics.conversionRate);
    const forecast = this.linearRegression(conversionRates, 7); // Forecast 7 periods ahead

    insights.push({
      id: 'conversion_forecast',
      type: 'forecast',
      title: 'Conversion Rate Forecast',
      description: 'Predicted conversion rate for the next 7 periods based on historical trends',
      prediction: `Forecasted conversion rate: ${forecast[forecast.length - 1].toFixed(2)}%`,
      confidence: 0.68,
      timeframe: '7 periods',
      impact: 'medium',
      dataPoints: [
        ...conversionRates.map((rate, index) => ({
          date: `Period ${index + 1}`,
          value: rate,
          predicted: false
        })),
        ...forecast.map((rate, index) => ({
          date: `Forecast ${index + 1}`,
          value: rate,
          predicted: true
        }))
      ]
    });

    return insights;
  }

  private getMetricValue(data: AnalyticsDataInput, metric: string): number | null {
    const metricPath = metric.split('.');
    let value: any = data;

    for (const path of metricPath) {
      if (value && typeof value === 'object' && path in value) {
        value = value[path];
      } else {
        return null;
      }
    }

    return typeof value === 'number' ? value : null;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + index * val, 0);
    const sumX2 = values.reduce((sum, _, index) => sum + index * index, 0);

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private linearRegression(values: number[], periods: number): number[] {
    const trend = this.calculateTrend(values);
    const lastValue = values[values.length - 1];
    const forecast: number[] = [];

    for (let i = 1; i <= periods; i++) {
      forecast.push(lastValue + trend * i);
    }

    return forecast;
  }

  private initializeInsightPatterns(): void {
    // Initialize common insight patterns
    this.insightPatterns = [
      {
        id: 'low_mobile_conversion',
        name: 'Low Mobile Conversion Pattern',
        description: 'Detects when mobile conversion is significantly lower than desktop',
        conditions: [
          { metric: 'conversionMetrics.conversionsByDevice.mobile', operator: 'less_than', value: 2.0 },
          { metric: 'conversionMetrics.conversionsByDevice.desktop', operator: 'greater_than', value: 3.0 }
        ],
        recommendation: {
          id: 'mobile_conversion_optimization',
          type: 'conversion',
          priority: 'high',
          title: 'Mobile Conversion Optimization Needed',
          description: 'Mobile conversion rate is significantly lower than desktop',
          impact: 'high',
          effort: 'medium',
          recommendation: 'Implement mobile-specific conversion optimization',
          expectedImprovement: '20-30% increase in mobile conversions',
          implementationSteps: [
            'Optimize mobile checkout flow',
            'Implement mobile payment options',
            'Improve mobile form usability',
            'Test mobile-specific CTAs'
          ],
          relatedMetrics: ['mobile_conversion_rate'],
          confidence: 0.85
        },
        confidence: 0.85
      }
    ];
  }

  private loadIndustryBenchmarks(): void {
    // Load industry benchmarks - in a real implementation, this would come from a database
    const ecommerceBenchmarks: IndustryBenchmark[] = [
      {
        metric: 'conversion_rate',
        industry: 'ecommerce',
        percentile25: 1.2,
        percentile50: 2.3,
        percentile75: 3.8,
        percentile90: 6.1
      },
      {
        metric: 'bounce_rate',
        industry: 'ecommerce',
        percentile25: 35,
        percentile50: 45,
        percentile75: 55,
        percentile90: 70
      }
    ];

    this.industryBenchmarks.set('ecommerce', ecommerceBenchmarks);
  }
}

export function createInsightsRecommendationEngine(config: InsightsConfig): InsightsRecommendationEngine {
  return new InsightsRecommendationEngine(config);
}

export const insightsRecommendationEngine = createInsightsRecommendationEngine({
  enabled: true,
  analysisDepth: 'comprehensive',
  industryBenchmarks: true,
  competitorAnalysis: true,
  predictiveAnalytics: true,
  realTimeInsights: true
});