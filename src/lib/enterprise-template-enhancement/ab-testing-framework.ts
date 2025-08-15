/**
 * A/B Testing Framework
 * Dynamic variant testing with statistical significance
 */

export interface TestVariant {
  id: string;
  name: string;
  weight: number; // 0-100, percentage of traffic
  config: any; // Variant-specific configuration
  active: boolean;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: TestVariant[];
  targetElement: string; // CSS selector or element ID
  startDate: Date;
  endDate?: Date;
  status: 'draft' | 'running' | 'paused' | 'completed';
  conversionGoal: string; // Event name to track
  minimumSampleSize: number;
  confidenceLevel: number; // 90, 95, or 99
  trafficAllocation: number; // 0-100, percentage of total traffic
}

export interface TestResult {
  testId: string;
  variantId: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
  isWinner: boolean;
  isStatisticallySignificant: boolean;
  lastUpdated: Date;
}

export interface StatisticalAnalysis {
  testId: string;
  winningVariant?: string;
  confidenceLevel: number;
  pValue: number;
  isSignificant: boolean;
  recommendedAction: 'continue' | 'declare_winner' | 'stop_test';
  sampleSizeReached: boolean;
}

export class ABTestingFramework {
  private tests: Map<string, ABTest> = new Map();
  private results: Map<string, TestResult[]> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map(); // userId -> testId -> variantId

  /**
   * Create a new A/B test
   */
  createTest(config: {
    id: string;
    name: string;
    description: string;
    variants: Omit<TestVariant, 'id'>[];
    targetElement: string;
    conversionGoal: string;
    minimumSampleSize?: number;
    confidenceLevel?: number;
    trafficAllocation?: number;
    duration?: number; // in days
  }): ABTest {
    const variants: TestVariant[] = config.variants.map((variant, index) => ({
      ...variant,
      id: `${config.id}_variant_${index}`
    }));

    // Normalize weights to sum to 100
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    if (totalWeight !== 100) {
      variants.forEach(v => v.weight = (v.weight / totalWeight) * 100);
    }

    const test: ABTest = {
      id: config.id,
      name: config.name,
      description: config.description,
      variants,
      targetElement: config.targetElement,
      startDate: new Date(),
      endDate: config.duration ? new Date(Date.now() + config.duration * 24 * 60 * 60 * 1000) : undefined,
      status: 'draft',
      conversionGoal: config.conversionGoal,
      minimumSampleSize: config.minimumSampleSize || 1000,
      confidenceLevel: config.confidenceLevel || 95,
      trafficAllocation: config.trafficAllocation || 100
    };

    this.tests.set(test.id, test);
    
    // Initialize results for each variant
    const variantResults = variants.map(variant => ({
      testId: test.id,
      variantId: variant.id,
      impressions: 0,
      conversions: 0,
      conversionRate: 0,
      confidence: 0,
      isWinner: false,
      isStatisticallySignificant: false,
      lastUpdated: new Date()
    }));
    
    this.results.set(test.id, variantResults);

    return test;
  }

  /**
   * Start a test
   */
  startTest(testId: string): boolean {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'draft') return false;

    test.status = 'running';
    test.startDate = new Date();
    return true;
  }

  /**
   * Pause a test
   */
  pauseTest(testId: string): boolean {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'running') return false;

    test.status = 'paused';
    return true;
  }

  /**
   * Stop a test and declare winner
   */
  stopTest(testId: string, winningVariantId?: string): boolean {
    const test = this.tests.get(testId);
    if (!test) return false;

    test.status = 'completed';
    test.endDate = new Date();

    if (winningVariantId) {
      const results = this.results.get(testId);
      if (results) {
        results.forEach(result => {
          result.isWinner = result.variantId === winningVariantId;
        });
      }
    }

    return true;
  }

  /**
   * Assign user to test variant
   */
  assignUserToVariant(userId: string, testId: string): string | null {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'running') return null;

    // Check if user already assigned
    const userTests = this.userAssignments.get(userId);
    if (userTests?.has(testId)) {
      return userTests.get(testId)!;
    }

    // Check traffic allocation
    if (Math.random() * 100 > test.trafficAllocation) {
      return null; // User not in test
    }

    // Assign to variant based on weights
    const random = Math.random() * 100;
    let cumulativeWeight = 0;
    
    for (const variant of test.variants) {
      if (!variant.active) continue;
      
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        // Store assignment
        if (!this.userAssignments.has(userId)) {
          this.userAssignments.set(userId, new Map());
        }
        this.userAssignments.get(userId)!.set(testId, variant.id);
        
        // Track impression
        this.trackImpression(testId, variant.id);
        
        return variant.id;
      }
    }

    return null;
  }

  /**
   * Get variant for user
   */
  getUserVariant(userId: string, testId: string): string | null {
    return this.userAssignments.get(userId)?.get(testId) || null;
  }

  /**
   * Track impression for variant
   */
  trackImpression(testId: string, variantId: string): void {
    const results = this.results.get(testId);
    if (!results) return;

    const variantResult = results.find(r => r.variantId === variantId);
    if (variantResult) {
      variantResult.impressions++;
      variantResult.lastUpdated = new Date();
      this.updateConversionRate(variantResult);
    }
  }

  /**
   * Track conversion for variant
   */
  trackConversion(testId: string, variantId: string): void {
    const results = this.results.get(testId);
    if (!results) return;

    const variantResult = results.find(r => r.variantId === variantId);
    if (variantResult) {
      variantResult.conversions++;
      variantResult.lastUpdated = new Date();
      this.updateConversionRate(variantResult);
    }
  }

  /**
   * Get test results
   */
  getTestResults(testId: string): TestResult[] {
    return this.results.get(testId) || [];
  }

  /**
   * Perform statistical analysis
   */
  analyzeTest(testId: string): StatisticalAnalysis | null {
    const test = this.tests.get(testId);
    const results = this.results.get(testId);
    
    if (!test || !results || results.length < 2) return null;

    // Find control (first variant) and best performing variant
    const control = results[0];
    const bestVariant = results.reduce((best, current) => 
      current.conversionRate > best.conversionRate ? current : best
    );

    // Calculate statistical significance using Z-test
    const { pValue, isSignificant } = this.calculateSignificance(control, bestVariant, test.confidenceLevel);
    
    // Check if minimum sample size reached
    const totalImpressions = results.reduce((sum, r) => sum + r.impressions, 0);
    const sampleSizeReached = totalImpressions >= test.minimumSampleSize;

    // Determine recommended action
    let recommendedAction: StatisticalAnalysis['recommendedAction'] = 'continue';
    if (sampleSizeReached && isSignificant) {
      recommendedAction = 'declare_winner';
    } else if (totalImpressions > test.minimumSampleSize * 2 && !isSignificant) {
      recommendedAction = 'stop_test';
    }

    return {
      testId,
      winningVariant: isSignificant ? bestVariant.variantId : undefined,
      confidenceLevel: test.confidenceLevel,
      pValue,
      isSignificant,
      recommendedAction,
      sampleSizeReached
    };
  }

  /**
   * Get all active tests
   */
  getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(test => test.status === 'running');
  }

  /**
   * Get test by ID
   */
  getTest(testId: string): ABTest | undefined {
    return this.tests.get(testId);
  }

  /**
   * Create simple A/B test for element content
   */
  createSimpleContentTest(config: {
    id: string;
    name: string;
    targetElement: string;
    variants: { name: string; content: string; weight?: number }[];
    conversionGoal: string;
  }): ABTest {
    const variants = config.variants.map((variant, index) => ({
      name: variant.name,
      weight: variant.weight || (100 / config.variants.length),
      config: { content: variant.content },
      active: true
    }));

    return this.createTest({
      id: config.id,
      name: config.name,
      description: `A/B test for ${config.targetElement}`,
      variants,
      targetElement: config.targetElement,
      conversionGoal: config.conversionGoal
    });
  }

  private updateConversionRate(result: TestResult): void {
    if (result.impressions > 0) {
      result.conversionRate = (result.conversions / result.impressions) * 100;
    }
  }

  private calculateSignificance(control: TestResult, variant: TestResult, confidenceLevel: number): { pValue: number; isSignificant: boolean } {
    // Simple Z-test for proportions
    const p1 = control.conversions / control.impressions;
    const p2 = variant.conversions / variant.impressions;
    const n1 = control.impressions;
    const n2 = variant.impressions;

    if (n1 === 0 || n2 === 0) {
      return { pValue: 1, isSignificant: false };
    }

    const pooledP = (control.conversions + variant.conversions) / (n1 + n2);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
    
    if (se === 0) {
      return { pValue: 1, isSignificant: false };
    }

    const z = (p2 - p1) / se;
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
    
    const alpha = (100 - confidenceLevel) / 100;
    const isSignificant = pValue < alpha;

    return { pValue, isSignificant };
  }

  private normalCDF(x: number): number {
    // Approximation of normal cumulative distribution function
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  private erf(x: number): number {
    // Approximation of error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }
}

export default ABTestingFramework;