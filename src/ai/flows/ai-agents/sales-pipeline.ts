import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const SalesPipelineInputSchema = z.object({
  dealData: z.object({
    id: z.string().optional(),
    title: z.string(),
    value: z.number(),
    stage: z.enum(['prospecting', 'qualification', 'proposal', 'negotiation', 'closing', 'won', 'lost']),
    probability: z.number().min(0).max(100),
    expectedCloseDate: z.string(),
    lastActivity: z.string().optional(),
    daysInStage: z.number().default(0),
    contactInfo: z.object({
      name: z.string(),
      email: z.string(),
      company: z.string(),
      title: z.string().optional()
    }),
    interactions: z.array(z.object({
      type: z.string(),
      date: z.string(),
      notes: z.string()
    })).optional()
  }).describe('Deal information for analysis'),
  analysisType: z.enum(['risk_assessment', 'next_actions', 'deal_health', 'forecasting', 'competitive_analysis']).describe('Type of analysis to perform'),
  context: z.object({
    salesRep: z.string().optional(),
    territory: z.string().optional(),
    product: z.string().optional(),
    competitorInfo: z.array(z.string()).optional()
  }).optional().describe('Additional context for analysis'),
  apiKey: z.string().describe('User API key for Google AI')
});

const SalesPipelineOutputSchema = z.object({
  dealHealth: z.object({
    score: z.number().min(0).max(100),
    status: z.enum(['healthy', 'at_risk', 'critical']),
    factors: z.array(z.object({
      factor: z.string(),
      impact: z.enum(['positive', 'negative', 'neutral']),
      weight: z.number(),
      description: z.string()
    }))
  }).describe('Overall deal health assessment'),
  riskAssessment: z.object({
    riskLevel: z.enum(['low', 'medium', 'high']),
    riskFactors: z.array(z.string()),
    mitigationStrategies: z.array(z.string())
  }).describe('Risk analysis and mitigation'),
  nextBestActions: z.array(z.object({
    action: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
    timeline: z.string(),
    expectedOutcome: z.string(),
    resources: z.array(z.string())
  })).describe('Recommended next actions'),
  forecasting: z.object({
    predictedCloseDate: z.string(),
    winProbability: z.number().min(0).max(100),
    predictedValue: z.number(),
    confidence: z.number().min(0).max(100)
  }).describe('Deal forecasting predictions'),
  insights: z.array(z.string()).describe('Key insights and observations'),
  recommendations: z.array(z.string()).describe('Strategic recommendations'),
  competitiveAnalysis: z.object({
    threats: z.array(z.string()),
    advantages: z.array(z.string()),
    positioning: z.string()
  }).optional().describe('Competitive analysis if applicable')
});

export async function salesPipelineFlow(input: z.infer<typeof SalesPipelineInputSchema>) {
    const { dealData, analysisType, context, apiKey } = input;

    const interactionsContext = dealData.interactions?.map((i: any) => 
      `${i.type} on ${i.date}: ${i.notes}`
    ).join('\n') || 'No interaction history available';

    const contextInfo = context ? `
Sales Context:
- Sales Rep: ${context.salesRep || 'Not specified'}
- Territory: ${context.territory || 'Not specified'}
- Product: ${context.product || 'Not specified'}
- Competitors: ${context.competitorInfo?.join(', ') || 'None identified'}
` : 'No additional context provided';

    const prompt = `You are an expert sales analyst and revenue operations specialist with 15+ years of experience in B2B sales, deal analysis, and pipeline management. You excel at identifying deal risks, predicting outcomes, and providing actionable recommendations.

## Deal Analysis Request
**Analysis Type:** ${analysisType}
**Deal Information:**
- Title: ${dealData.title}
- Value: $${dealData.value.toLocaleString()}
- Current Stage: ${dealData.stage}
- Probability: ${dealData.probability}%
- Expected Close: ${dealData.expectedCloseDate}
- Days in Stage: ${dealData.daysInStage}
- Contact: ${dealData.contactInfo.name} (${dealData.contactInfo.title || 'Unknown Title'}) at ${dealData.contactInfo.company}
- Email: ${dealData.contactInfo.email}

## Interaction History
${interactionsContext}

## Additional Context
${contextInfo}

## Your Mission
Perform a comprehensive sales pipeline analysis focusing on ${analysisType}. Provide:

1. **Deal Health Assessment** - Score the overall health of this deal
2. **Risk Analysis** - Identify potential risks and mitigation strategies
3. **Next Best Actions** - Recommend specific, actionable next steps
4. **Forecasting** - Predict likely outcomes and timelines
5. **Strategic Insights** - Provide expert observations and recommendations

## Analysis Framework

### Deal Health Factors
- **Engagement Level:** Frequency and quality of interactions
- **Decision Maker Access:** Contact with key decision makers
- **Timeline Alignment:** Realistic timeline expectations
- **Budget Confirmation:** Budget authority and availability
- **Competitive Position:** Strength against competitors
- **Solution Fit:** How well solution matches needs
- **Momentum:** Deal progression velocity

### Risk Assessment Categories
- **Stalled Deals:** No recent activity or progress
- **Budget Risks:** Unclear or insufficient budget
- **Decision Process:** Complex or unclear decision process
- **Competitive Threats:** Strong competitor presence
- **Timeline Misalignment:** Unrealistic expectations
- **Champion Risk:** Lack of internal advocate

### Forecasting Methodology
- Historical data patterns
- Stage-specific conversion rates
- Deal velocity analysis
- Seasonal factors
- Market conditions
- Competitive landscape

## Quality Standards
- Provide specific, actionable recommendations
- Use data-driven insights where possible
- Consider industry best practices
- Account for deal complexity and size
- Prioritize high-impact activities
- Include realistic timelines and expectations

Deliver a comprehensive analysis that helps optimize deal outcomes and pipeline performance.`;

    // Create AI instance with user's API key
    const userAI = genkit({
      plugins: [
        googleAI({ apiKey }),
      ],
    });

    const response = await userAI.generate({
      model: googleAI.model('gemini-2.0-flash-exp'),
      prompt: prompt,
      config: {
        temperature: 0.4,
        maxOutputTokens: 3000
      }
    });

    // Analyze deal health based on various factors
    const dealHealth = analyzeDealHealth(dealData);
    const riskAssessment = assessDealRisk(dealData);
    const nextActions = generateNextActions(dealData, analysisType);
    const forecasting = generateForecasting(dealData);
    const insights = generateInsights(dealData, response.text);
    const recommendations = generateRecommendations(dealData, dealHealth, riskAssessment);
    const competitiveAnalysis = context?.competitorInfo ? generateCompetitiveAnalysis(dealData, context.competitorInfo) : undefined;

    return {
      dealHealth,
      riskAssessment,
      nextBestActions: nextActions,
      forecasting,
      insights,
      recommendations,
      competitiveAnalysis
    };
}

function analyzeDealHealth(dealData: any) {
  let score = 50; // Base score
  const factors = [];

  // Stage progression factor
  const stageScores = {
    prospecting: 20,
    qualification: 40,
    proposal: 60,
    negotiation: 75,
    closing: 90,
    won: 100,
    lost: 0
  };
  
  const stageScore = stageScores[dealData.stage as keyof typeof stageScores] || 50;
  score += (stageScore - 50) * 0.3;
  
  factors.push({
    factor: 'Deal Stage',
    impact: stageScore > 50 ? 'positive' as const : 'negative' as const,
    weight: 0.3,
    description: `Deal is in ${dealData.stage} stage`
  });

  // Days in stage factor
  const maxDaysInStage = {
    prospecting: 30,
    qualification: 21,
    proposal: 14,
    negotiation: 21,
    closing: 14
  };
  
  const maxDays = maxDaysInStage[dealData.stage as keyof typeof maxDaysInStage] || 30;
  if (dealData.daysInStage > maxDays) {
    score -= 15;
    factors.push({
      factor: 'Time in Stage',
      impact: 'negative' as const,
      weight: 0.2,
      description: `Deal has been in ${dealData.stage} stage for ${dealData.daysInStage} days (max recommended: ${maxDays})`
    });
  } else {
    factors.push({
      factor: 'Time in Stage',
      impact: 'positive' as const,
      weight: 0.2,
      description: `Deal progression is on track (${dealData.daysInStage} days in stage)`
    });
  }

  // Deal value factor
  if (dealData.value > 50000) {
    score += 10;
    factors.push({
      factor: 'Deal Value',
      impact: 'positive' as const,
      weight: 0.15,
      description: 'High-value deal with significant revenue potential'
    });
  }

  // Probability alignment
  const expectedProbability = {
    prospecting: 10,
    qualification: 25,
    proposal: 50,
    negotiation: 75,
    closing: 90
  };
  
  const expected = expectedProbability[dealData.stage as keyof typeof expectedProbability] || 50;
  const probabilityDiff = Math.abs(dealData.probability - expected);
  
  if (probabilityDiff > 20) {
    score -= 10;
    factors.push({
      factor: 'Probability Alignment',
      impact: 'negative' as const,
      weight: 0.15,
      description: `Probability (${dealData.probability}%) doesn't align with stage expectations (${expected}%)`
    });
  }

  // Interaction recency
  if (dealData.interactions && dealData.interactions.length > 0) {
    const lastInteraction = new Date(dealData.interactions[dealData.interactions.length - 1].date);
    const daysSinceLastInteraction = Math.floor((Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastInteraction > 7) {
      score -= 15;
      factors.push({
        factor: 'Recent Activity',
        impact: 'negative' as const,
        weight: 0.2,
        description: `No recent activity (${daysSinceLastInteraction} days since last interaction)`
      });
    } else {
      score += 5;
      factors.push({
        factor: 'Recent Activity',
        impact: 'positive' as const,
        weight: 0.2,
        description: 'Recent engagement shows active interest'
      });
    }
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  const status = finalScore >= 70 ? 'healthy' : finalScore >= 40 ? 'at_risk' : 'critical';

  return {
    score: finalScore,
    status: status as 'healthy' | 'at_risk' | 'critical',
    factors
  };
}

function assessDealRisk(dealData: any) {
  const riskFactors = [];
  let riskScore = 0;

  // Time-based risks
  if (dealData.daysInStage > 30) {
    riskFactors.push('Deal has been stalled in current stage for extended period');
    riskScore += 2;
  }

  // Close date risks
  const closeDate = new Date(dealData.expectedCloseDate);
  const daysToClose = Math.floor((closeDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (daysToClose < 0) {
    riskFactors.push('Deal is past expected close date');
    riskScore += 3;
  } else if (daysToClose < 7 && dealData.stage !== 'closing') {
    riskFactors.push('Close date approaching but deal not in closing stage');
    riskScore += 2;
  }

  // Probability risks
  if (dealData.probability < 25 && ['proposal', 'negotiation', 'closing'].includes(dealData.stage)) {
    riskFactors.push('Low probability for advanced stage deal');
    riskScore += 2;
  }

  // Activity risks
  if (!dealData.interactions || dealData.interactions.length === 0) {
    riskFactors.push('No recorded interactions with prospect');
    riskScore += 2;
  }

  const riskLevel = riskScore >= 5 ? 'high' : riskScore >= 3 ? 'medium' : 'low';

  const mitigationStrategies = [];
  if (riskFactors.includes('Deal has been stalled in current stage for extended period')) {
    mitigationStrategies.push('Schedule immediate check-in call to understand blockers');
  }
  if (riskFactors.includes('Deal is past expected close date')) {
    mitigationStrategies.push('Reassess timeline and requirements with prospect');
  }
  if (riskFactors.includes('Low probability for advanced stage deal')) {
    mitigationStrategies.push('Conduct thorough qualification review and address concerns');
  }

  return {
    riskLevel: riskLevel as 'low' | 'medium' | 'high',
    riskFactors,
    mitigationStrategies
  };
}

function generateNextActions(dealData: any, analysisType: string) {
  const actions = [];

  // Stage-specific actions
  switch (dealData.stage) {
    case 'prospecting':
      actions.push({
        action: 'Conduct discovery call',
        priority: 'high' as const,
        timeline: 'Within 3 days',
        expectedOutcome: 'Understand prospect needs and pain points',
        resources: ['Discovery call template', 'Needs assessment questionnaire']
      });
      break;
    
    case 'qualification':
      actions.push({
        action: 'Validate budget and decision process',
        priority: 'high' as const,
        timeline: 'Within 5 days',
        expectedOutcome: 'Confirm budget authority and buying process',
        resources: ['BANT qualification framework', 'Budget discussion guide']
      });
      break;
    
    case 'proposal':
      actions.push({
        action: 'Present customized solution proposal',
        priority: 'high' as const,
        timeline: 'Within 7 days',
        expectedOutcome: 'Demonstrate value and fit for prospect needs',
        resources: ['Proposal template', 'ROI calculator', 'Case studies']
      });
      break;
    
    case 'negotiation':
      actions.push({
        action: 'Address objections and finalize terms',
        priority: 'high' as const,
        timeline: 'Within 3 days',
        expectedOutcome: 'Resolve concerns and agree on contract terms',
        resources: ['Objection handling guide', 'Contract templates', 'Pricing flexibility matrix']
      });
      break;
    
    case 'closing':
      actions.push({
        action: 'Finalize contract and secure signature',
        priority: 'high' as const,
        timeline: 'Within 2 days',
        expectedOutcome: 'Complete deal closure and onboarding handoff',
        resources: ['Contract execution checklist', 'Onboarding team introduction']
      });
      break;
  }

  // Risk-based actions
  if (dealData.daysInStage > 21) {
    actions.push({
      action: 'Conduct deal review and re-qualification',
      priority: 'medium' as const,
      timeline: 'Within 2 days',
      expectedOutcome: 'Identify blockers and refresh deal momentum',
      resources: ['Deal review template', 'Re-qualification checklist']
    });
  }

  // Value-based actions
  if (dealData.value > 100000) {
    actions.push({
      action: 'Engage executive sponsor',
      priority: 'medium' as const,
      timeline: 'Within 5 days',
      expectedOutcome: 'Build executive-level relationships',
      resources: ['Executive briefing materials', 'C-level presentation deck']
    });
  }

  return actions;
}

function generateForecasting(dealData: any) {
  // Calculate predicted close date based on stage and velocity
  const avgDaysPerStage = {
    prospecting: 14,
    qualification: 21,
    proposal: 14,
    negotiation: 21,
    closing: 7
  };

  const currentStageIndex = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closing'].indexOf(dealData.stage);
  const remainingStages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closing'].slice(currentStageIndex + 1);
  
  const additionalDays = remainingStages.reduce((total, stage) => {
    return total + (avgDaysPerStage[stage as keyof typeof avgDaysPerStage] || 0);
  }, 0);

  const predictedCloseDate = new Date(Date.now() + additionalDays * 24 * 60 * 60 * 1000);

  // Adjust win probability based on deal health and stage
  const stageMultipliers = {
    prospecting: 0.8,
    qualification: 0.9,
    proposal: 1.0,
    negotiation: 1.1,
    closing: 1.2
  };

  const multiplier = stageMultipliers[dealData.stage as keyof typeof stageMultipliers] || 1.0;
  const adjustedProbability = Math.min(95, Math.round(dealData.probability * multiplier));

  // Calculate predicted value based on probability
  const predictedValue = Math.round(dealData.value * (adjustedProbability / 100));

  // Confidence based on data quality and deal maturity
  let confidence = 60; // Base confidence
  if (dealData.interactions && dealData.interactions.length > 3) confidence += 15;
  if (dealData.daysInStage < 14) confidence += 10;
  if (['proposal', 'negotiation', 'closing'].includes(dealData.stage)) confidence += 15;

  return {
    predictedCloseDate: predictedCloseDate.toISOString().split('T')[0],
    winProbability: adjustedProbability,
    predictedValue,
    confidence: Math.min(95, confidence)
  };
}

function generateInsights(dealData: any, aiResponse: string) {
  const insights = [];

  // Stage-specific insights
  if (dealData.stage === 'prospecting' && dealData.daysInStage > 21) {
    insights.push('Deal has been in prospecting stage longer than average - consider more aggressive qualification');
  }

  if (dealData.stage === 'proposal' && dealData.probability < 50) {
    insights.push('Low probability for proposal stage suggests need for better discovery and qualification');
  }

  // Value insights
  if (dealData.value > 100000) {
    insights.push('High-value deal requires executive engagement and extended sales cycle planning');
  }

  // Timeline insights
  const closeDate = new Date(dealData.expectedCloseDate);
  const daysToClose = Math.floor((closeDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (daysToClose < 30 && !['negotiation', 'closing'].includes(dealData.stage)) {
    insights.push('Aggressive timeline may require acceleration of sales process');
  }

  // Activity insights
  if (dealData.interactions && dealData.interactions.length > 0) {
    const recentInteractions = dealData.interactions.filter((i: { type: string; date: string; notes: string }) => {
      const interactionDate = new Date(i.date);
      const daysSince = Math.floor((Date.now() - interactionDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince <= 7;
    });

    if (recentInteractions.length === 0) {
      insights.push('No recent activity - deal may be losing momentum');
    }
  }

  return insights;
}

function generateRecommendations(dealData: any, dealHealth: any, riskAssessment: any) {
  const recommendations = [];

  // Health-based recommendations
  if (dealHealth.status === 'critical') {
    recommendations.push('Immediate intervention required - schedule executive review and develop recovery plan');
  } else if (dealHealth.status === 'at_risk') {
    recommendations.push('Increase engagement frequency and validate continued interest');
  }

  // Risk-based recommendations
  if (riskAssessment.riskLevel === 'high') {
    recommendations.push('Implement risk mitigation strategies immediately to prevent deal loss');
  }

  // Stage-specific recommendations
  if (dealData.stage === 'qualification' && dealData.probability > 75) {
    recommendations.push('High probability in qualification suggests readiness to advance to proposal stage');
  }

  if (dealData.stage === 'negotiation' && dealData.daysInStage > 30) {
    recommendations.push('Extended negotiation period - consider bringing in senior leadership to close');
  }

  // Value-based recommendations
  if (dealData.value > 250000) {
    recommendations.push('Enterprise-level deal requires comprehensive stakeholder mapping and multi-threading strategy');
  }

  return recommendations;
}

function generateCompetitiveAnalysis(dealData: any, competitors: string[]) {
  const threats = competitors.map(competitor => 
    `${competitor} may offer competitive pricing or established relationships`
  );

  const advantages = [
    'Superior product features and capabilities',
    'Better customer service and support',
    'More flexible implementation timeline',
    'Stronger ROI proposition'
  ];

  const positioning = `Position against ${competitors.join(' and ')} by emphasizing unique value proposition and customer success stories`;

  return {
    threats,
    advantages,
    positioning
  };
}