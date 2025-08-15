// Simple validation test for Deal and Pipeline data structures
// This can be run with: npx tsx src/lib/crm-validation-test.ts

import {
  Deal,
  Pipeline,
  PipelineStage,
  DealStatus,
  RiskLevel,
  Priority
} from './crm-types';

import {
  DealValidator,
  PipelineValidator,
  validateDealDataQuality
} from './deal-validation';

// Test 1: Valid Deal Creation and Validation
function testValidDeal(): boolean {
  console.log('🧪 Testing valid deal creation and validation...');
  
  const validDeal: Partial<Deal> = {
    title: 'Test Deal',
    assignedTo: 'user-123',
    value: 10000,
    currency: 'USD',
    expectedCloseDate: new Date('2024-06-01'),
    stage: { id: 'proposal', name: 'Proposal', color: '#fbbf24', order: 2 } as PipelineStage,
    status: DealStatus.OPEN,
    probability: 75
  };

  const result = DealValidator.validateDeal(validDeal);
  
  if (result.isValid && result.errors.length === 0) {
    console.log('✅ Valid deal test passed');
    return true;
  } else {
    console.log('❌ Valid deal test failed');
    console.log('Errors:', result.errors);
    return false;
  }
}

// Test 2: Invalid Deal Detection
function testInvalidDeal(): boolean {
  console.log('🧪 Testing invalid deal detection...');
  
  const invalidDeal: Partial<Deal> = {
    value: -1000, // Negative value should be invalid
    probability: 150 // Invalid probability
  };

  const result = DealValidator.validateDeal(invalidDeal);
  
  if (!result.isValid && result.errors.length > 0) {
    console.log('✅ Invalid deal detection test passed');
    return true;
  } else {
    console.log('❌ Invalid deal detection test failed');
    return false;
  }
}

// Test 3: Valid Pipeline Creation and Validation
function testValidPipeline(): boolean {
  console.log('🧪 Testing valid pipeline creation and validation...');
  
  const validPipeline: Partial<Pipeline> = {
    name: 'Test Pipeline',
    createdBy: 'user-123',
    stages: [{
      id: 'lead',
      name: 'Lead',
      color: '#6b7280',
      order: 1
    }],
    isActive: true
  };

  const result = PipelineValidator.validatePipeline(validPipeline);
  
  if (result.isValid && result.errors.length === 0) {
    console.log('✅ Valid pipeline test passed');
    return true;
  } else {
    console.log('❌ Valid pipeline test failed');
    console.log('Errors:', result.errors);
    return false;
  }
}

// Test 4: AI Predictions Validation
function testAIPredictions(): boolean {
  console.log('🧪 Testing AI predictions validation...');
  
  const dealWithPredictions: Partial<Deal> = {
    title: 'Test Deal',
    assignedTo: 'user-123',
    contactId: 'contact-456',
    currency: 'USD',
    value: 10000,
    stage: { id: 'proposal', name: 'Proposal', color: '#fbbf24', order: 2 } as PipelineStage,
    status: DealStatus.OPEN,
    probability: 75,
    expectedCloseDate: new Date('2024-06-01'),
    tags: ['test'],
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    customFields: {
      aiPredictions: {
      closureProbability: 0.75, // Valid range
      predictedCloseDate: new Date(),
      confidenceInterval: {
        lower: new Date('2024-05-01'),
        upper: new Date('2024-06-01'), // Valid range
        confidence: 0.8
      },
      valueConfidence: 0.9, // Valid range
      stageProgression: [],
      timeToClose: {
        estimated: 14, // Positive value
        range: { min: 10, max: 21 }, // Valid range
        confidence: 0.8
      },
        winProbabilityTrend: [],
        lastUpdated: new Date(),
        modelVersion: '1.0'
      }
    }
  };

  const result = DealValidator.validateDeal(dealWithPredictions);
  
  if (result.isValid) {
    console.log('✅ AI predictions validation test passed');
    return true;
  } else {
    console.log('❌ AI predictions validation test failed');
    console.log('Errors:', result.errors);
    return false;
  }
}

// Test 5: Data Quality Validation
function testDataQuality(): boolean {
  console.log('🧪 Testing data quality validation...');
  
  const incompleteDeal: Partial<Deal> = {
    title: 'Incomplete Deal',
    value: 10000
    // Missing several recommended fields
  };

  const result = validateDealDataQuality(incompleteDeal);
  
  if (result.warnings.length > 0) {
    console.log('✅ Data quality validation test passed');
    return true;
  } else {
    console.log('❌ Data quality validation test failed');
    return false;
  }
}

// Test 6: Risk Assessment Structure
function testRiskAssessment(): boolean {
  console.log('🧪 Testing risk assessment structure...');
  
  const dealWithRisk: Partial<Deal> = {
    title: 'Risk Test Deal',
    assignedTo: 'user-123',
    contactId: 'contact-456',
    currency: 'USD',
    value: 10000,
    stage: { id: 'proposal', name: 'Proposal', color: '#fbbf24', order: 2 } as PipelineStage,
    status: DealStatus.OPEN,
    probability: 75,
    expectedCloseDate: new Date('2024-06-01'),
    tags: ['test'],
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    customFields: {
      riskAssessment: {
      overallRisk: RiskLevel.MEDIUM,
      riskScore: 0.4, // Valid range
      riskFactors: [{
        type: 'timeline',
        severity: RiskLevel.MEDIUM,
        description: 'Timeline risk',
        probability: 0.6, // Valid range
        impact: 0.7, // Valid range
        detectedAt: new Date(),
        isActive: true,
        mitigationActions: []
      }],
      mitigationStrategies: [],
      earlyWarningSignals: [],
      competitiveThreats: [],
      lastAssessed: new Date(),
        assessmentHistory: []
      }
    }
  };

  const result = DealValidator.validateDeal(dealWithRisk);
  
  if (result.isValid) {
    console.log('✅ Risk assessment structure test passed');
    return true;
  } else {
    console.log('❌ Risk assessment structure test failed');
    console.log('Errors:', result.errors);
    return false;
  }
}

// Main test runner
function runAllTests(): void {
  console.log('🚀 Running CRM Deal and Pipeline Validation Tests\n');
  
  const tests = [
    testValidDeal,
    testInvalidDeal,
    testValidPipeline,
    testAIPredictions,
    testDataQuality,
    testRiskAssessment
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      if (test()) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log('❌ Test failed with error:', error);
      failed++;
    }
    console.log(''); // Add spacing between tests
  }
  
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Deal and Pipeline implementation is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the implementation.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

export { runAllTests };