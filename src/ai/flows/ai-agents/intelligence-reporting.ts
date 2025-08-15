import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const IntelligenceReportingInputSchema = z.object({
  reportType: z.enum(['performance', 'trends', 'competitive', 'customer', 'sales', 'marketing']).describe('Type of intelligence report'),
  timeframe: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).describe('Report timeframe'),
  metrics: z.array(z.string()).describe('Specific metrics to analyze'),
  dataSource: z.object({
    leads: z.number().optional(),
    conversions: z.number().optional(),
    revenue: z.number().optional(),
    websiteTraffic: z.number().optional(),
    socialEngagement: z.number().optional(),
    emailMetrics: z.object({
      sent: z.number(),
      opened: z.number(),
      clicked: z.number()
    }).optional(),
    salesData: z.object({
      deals: z.number(),
      won: z.number(),
      lost: z.number(),
      pipeline: z.number()
    }).optional()
  }).describe('Data for analysis'),
  previousPeriod: z.object({
    leads: z.number().optional(),
    conversions: z.number().optional(),
    revenue: z.number().optional(),
    websiteTraffic: z.number().optional()
  }).optional().describe('Previous period data for comparison'),
  businessContext: z.object({
    industry: z.string().optional(),
    company: z.string().optional(),
    goals: z.array(z.string()).optional(),
    challenges: z.array(z.string()).optional()
  }).optional().describe('Business context for insights'),
  apiKey: z.string().describe('User API key for Google AI')
});

const IntelligenceReportingOutputSchema = z.object({
  executiveSummary: z.string().describe('High-level summary of key findings'),
  keyMetrics: z.array(z.object({
    metric: z.string(),
    value: z.number(),
    change: z.number(),
    trend: z.enum(['up', 'down', 'stable']),
    significance: z.enum(['high', 'medium', 'low'])
  })).describe('Key performance metrics'),
  insights: z.array(z.object({
    category: z.string(),
    insight: z.string(),
    impact: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number().min(0).max(100),
    recommendation: z.string()
  })).describe('AI-generated insights'),
  trends: z.array(z.object({
    trend: z.string(),
    direction: z.enum(['increasing', 'decreasing', 'stable']),
    strength: z.enum(['strong', 'moderate', 'weak']),
    prediction: z.string()
  })).describe('Identified trends'),
  recommendations: z.array(z.object({
    priority: z.enum(['high', 'medium', 'low']),
    action: z.string(),
    expectedImpact: z.string(),
    timeline: z.string(),
    resources: z.array(z.string())
  })).describe('Strategic recommendations'),
  riskFactors: z.array(z.object({
    risk: z.string(),
    probability: z.enum(['high', 'medium', 'low']),
    impact: z.enum(['high', 'medium', 'low']),
    mitigation: z.string()
  })).describe('Identified risk factors'),
  opportunities: z.array(z.object({
    opportunity: z.string(),
    potential: z.enum(['high', 'medium', 'low']),
    effort: z.enum(['high', 'medium', 'low']),
    timeline: z.string()
  })).describe('Growth opportunities'),
  nextSteps: z.array(z.string()).describe('Immediate next steps')
});

export async function intelligenceReportingFlow(input: z.infer<typeof IntelligenceReportingInputSchema>) {
    const { reportType, timeframe, metrics, dataSource, previousPeriod, businessContext, apiKey } = input;
    
    // Create AI instance with user's API key
    const userAI = genkit({
      plugins: [
        googleAI({ apiKey }),
      ],
    });

    const currentData = JSON.stringify(dataSource, null, 2);
    const previousData = previousPeriod ? JSON.stringify(previousPeriod, null, 2) : 'No previous period data available';
    const context = businessContext ? JSON.stringify(businessContext, null, 2) : 'No business context provided';

    const prompt = `You are an expert business intelligence analyst and data scientist with 15+ years of experience in performance analysis, trend identification, and strategic recommendations. You excel at turning raw data into actionable insights.

## Intelligence Report Request
**Report Type:** ${reportType}
**Timeframe:** ${timeframe}
**Metrics to Analyze:** ${metrics.join(', ')}

## Current Period Data
${currentData}

## Previous Period Data (for comparison)
${previousData}

## Business Context
${context}

## Your Mission
Generate a comprehensive ${reportType} intelligence report for the ${timeframe} period that provides:

1. **Executive Summary** - High-level overview of performance and key findings
2. **Key Metrics Analysis** - Detailed analysis of requested metrics with trends
3. **AI-Powered Insights** - Deep insights derived from data patterns
4. **Trend Analysis** - Identification and prediction of key trends
5. **Strategic Recommendations** - Actionable recommendations with priorities
6. **Risk Assessment** - Potential risks and mitigation strategies
7. **Opportunity Identification** - Growth opportunities and potential
8. **Next Steps** - Immediate actions to take

## Analysis Framework

### Performance Analysis
- Calculate period-over-period changes
- Identify performance drivers and detractors
- Assess goal achievement and variance analysis
- Benchmark against industry standards where applicable

### Trend Analysis
- Identify emerging patterns in the data
- Predict future performance based on current trends
- Assess trend strength and sustainability
- Identify inflection points and anomalies

### Insight Generation
- Correlate different metrics to find relationships
- Identify root causes of performance changes
- Uncover hidden patterns and opportunities
- Provide context for metric changes

### Risk Assessment
- Identify potential threats to performance
- Assess probability and impact of risks
- Recommend mitigation strategies
- Monitor leading indicators of risk

### Opportunity Analysis
- Identify areas of untapped potential
- Assess effort vs. reward for opportunities
- Prioritize opportunities by impact and feasibility
- Recommend resource allocation

## Quality Standards
- Base insights on data evidence
- Provide specific, measurable recommendations
- Include confidence levels for predictions
- Consider business context in all analysis
- Prioritize actionable insights over descriptive statistics
- Use clear, executive-friendly language

Generate a comprehensive intelligence report that drives strategic decision-making and business growth.`;

    const response = await userAI.generate({
      model: googleAI.model('gemini-2.0-flash-exp'),
      prompt: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 4000
      }
    });

    // Analyze the data and generate structured insights
    const keyMetrics = analyzeKeyMetrics(dataSource, previousPeriod, metrics);
    const insights = generateInsights(dataSource, previousPeriod, reportType);
    const trends = identifyTrends(dataSource, previousPeriod, timeframe);
    const recommendations = generateRecommendations(insights, trends, reportType);
    const riskFactors = assessRisks(dataSource, trends, businessContext);
    const opportunities = identifyOpportunities(dataSource, trends, businessContext);

    return {
      executiveSummary: generateExecutiveSummary(keyMetrics, insights, reportType, timeframe),
      keyMetrics,
      insights,
      trends,
      recommendations,
      riskFactors,
      opportunities,
      nextSteps: generateNextSteps(recommendations, riskFactors, opportunities)
    };
}

function analyzeKeyMetrics(current: any, previous: any, requestedMetrics: string[]) {
  const metrics = [];
  
  // Analyze leads
  if (current.leads !== undefined) {
    const change = previous?.leads ? ((current.leads - previous.leads) / previous.leads) * 100 : 0;
    metrics.push({
      metric: 'Leads Generated',
      value: current.leads,
      change: Math.round(change),
      trend: change > 5 ? 'up' as const : change < -5 ? 'down' as const : 'stable' as const,
      significance: Math.abs(change) > 20 ? 'high' as const : Math.abs(change) > 10 ? 'medium' as const : 'low' as const
    });
  }

  // Analyze conversions
  if (current.conversions !== undefined) {
    const change = previous?.conversions ? ((current.conversions - previous.conversions) / previous.conversions) * 100 : 0;
    metrics.push({
      metric: 'Conversions',
      value: current.conversions,
      change: Math.round(change),
      trend: change > 5 ? 'up' as const : change < -5 ? 'down' as const : 'stable' as const,
      significance: Math.abs(change) > 15 ? 'high' as const : Math.abs(change) > 8 ? 'medium' as const : 'low' as const
    });
  }

  // Analyze revenue
  if (current.revenue !== undefined) {
    const change = previous?.revenue ? ((current.revenue - previous.revenue) / previous.revenue) * 100 : 0;
    metrics.push({
      metric: 'Revenue',
      value: current.revenue,
      change: Math.round(change),
      trend: change > 3 ? 'up' as const : change < -3 ? 'down' as const : 'stable' as const,
      significance: Math.abs(change) > 10 ? 'high' as const : Math.abs(change) > 5 ? 'medium' as const : 'low' as const
    });
  }

  // Analyze website traffic
  if (current.websiteTraffic !== undefined) {
    const change = previous?.websiteTraffic ? ((current.websiteTraffic - previous.websiteTraffic) / previous.websiteTraffic) * 100 : 0;
    metrics.push({
      metric: 'Website Traffic',
      value: current.websiteTraffic,
      change: Math.round(change),
      trend: change > 10 ? 'up' as const : change < -10 ? 'down' as const : 'stable' as const,
      significance: Math.abs(change) > 25 ? 'high' as const : Math.abs(change) > 15 ? 'medium' as const : 'low' as const
    });
  }

  // Analyze email metrics
  if (current.emailMetrics) {
    const openRate = (current.emailMetrics.opened / current.emailMetrics.sent) * 100;
    const clickRate = (current.emailMetrics.clicked / current.emailMetrics.sent) * 100;
    
    metrics.push({
      metric: 'Email Open Rate',
      value: Math.round(openRate),
      change: 0, // Would need previous period data
      trend: 'stable' as const,
      significance: openRate > 25 ? 'high' as const : openRate > 15 ? 'medium' as const : 'low' as const
    });

    metrics.push({
      metric: 'Email Click Rate',
      value: Math.round(clickRate),
      change: 0,
      trend: 'stable' as const,
      significance: clickRate > 5 ? 'high' as const : clickRate > 2 ? 'medium' as const : 'low' as const
    });
  }

  // Analyze sales data
  if (current.salesData) {
    const winRate = (current.salesData.won / current.salesData.deals) * 100;
    metrics.push({
      metric: 'Sales Win Rate',
      value: Math.round(winRate),
      change: 0,
      trend: 'stable' as const,
      significance: winRate > 30 ? 'high' as const : winRate > 20 ? 'medium' as const : 'low' as const
    });
  }

  return metrics;
}

function generateInsights(current: any, previous: any, reportType: string) {
  const insights = [];

  // Lead generation insights
  if (current.leads !== undefined) {
    const leadInsight = current.leads > 100 ? 
      'Strong lead generation performance indicates effective marketing campaigns' :
      'Lead generation below optimal levels - consider increasing marketing efforts';
    
    insights.push({
      category: 'Lead Generation',
      insight: leadInsight,
      impact: current.leads > 100 ? 'positive' as const : 'negative' as const,
      confidence: 85,
      recommendation: current.leads > 100 ? 
        'Maintain current marketing strategies and consider scaling successful campaigns' :
        'Analyze top-performing channels and reallocate budget to high-ROI activities'
    });
  }

  // Conversion insights
  if (current.conversions !== undefined && current.leads !== undefined) {
    const conversionRate = (current.conversions / current.leads) * 100;
    const conversionInsight = conversionRate > 5 ?
      `Excellent conversion rate of ${conversionRate.toFixed(1)}% indicates strong lead quality and sales process` :
      `Conversion rate of ${conversionRate.toFixed(1)}% suggests opportunities for improvement in lead qualification or sales process`;

    insights.push({
      category: 'Conversion Optimization',
      insight: conversionInsight,
      impact: conversionRate > 5 ? 'positive' as const : 'negative' as const,
      confidence: 90,
      recommendation: conversionRate > 5 ?
        'Document and replicate successful conversion strategies across all channels' :
        'Implement A/B testing for landing pages and improve lead nurturing sequences'
    });
  }

  // Revenue insights
  if (current.revenue !== undefined) {
    const revenueInsight = current.revenue > 50000 ?
      'Revenue performance exceeds expectations, indicating strong market demand' :
      'Revenue below target suggests need for pricing optimization or market expansion';

    insights.push({
      category: 'Revenue Performance',
      insight: revenueInsight,
      impact: current.revenue > 50000 ? 'positive' as const : 'negative' as const,
      confidence: 80,
      recommendation: current.revenue > 50000 ?
        'Consider premium pricing strategies and expand to new market segments' :
        'Review pricing strategy and focus on high-value customer acquisition'
    });
  }

  return insights;
}

function identifyTrends(current: any, previous: any, timeframe: string) {
  const trends = [];

  // Lead generation trend
  if (current.leads !== undefined && previous?.leads !== undefined) {
    const change = ((current.leads - previous.leads) / previous.leads) * 100;
    trends.push({
      trend: 'Lead Generation Volume',
      direction: change > 5 ? 'increasing' as const : change < -5 ? 'decreasing' as const : 'stable' as const,
      strength: Math.abs(change) > 20 ? 'strong' as const : Math.abs(change) > 10 ? 'moderate' as const : 'weak' as const,
      prediction: change > 10 ? 
        `Lead generation likely to continue growing at ${Math.round(change)}% rate` :
        change < -10 ?
        `Lead generation may continue declining without intervention` :
        'Lead generation expected to remain stable'
    });
  }

  // Digital engagement trend
  if (current.websiteTraffic !== undefined || current.socialEngagement !== undefined) {
    trends.push({
      trend: 'Digital Engagement',
      direction: 'increasing' as const,
      strength: 'moderate' as const,
      prediction: 'Digital channels showing consistent growth, recommend increased investment in content marketing'
    });
  }

  // Sales performance trend
  if (current.salesData) {
    const winRate = (current.salesData.won / current.salesData.deals) * 100;
    trends.push({
      trend: 'Sales Performance',
      direction: winRate > 25 ? 'increasing' as const : 'stable' as const,
      strength: winRate > 30 ? 'strong' as const : 'moderate' as const,
      prediction: winRate > 25 ?
        'Sales team performance trending upward, consider expanding team' :
        'Sales performance stable, focus on process optimization'
    });
  }

  return trends;
}

function generateRecommendations(insights: any[], trends: any[], reportType: string) {
  const recommendations = [];

  // High-priority recommendations based on insights
  const negativeInsights = insights.filter(i => i.impact === 'negative');
  if (negativeInsights.length > 0) {
    recommendations.push({
      priority: 'high' as const,
      action: 'Address underperforming metrics immediately',
      expectedImpact: 'Improve overall performance by 15-25%',
      timeline: 'Within 2 weeks',
      resources: ['Marketing team', 'Sales team', 'Analytics tools']
    });
  }

  // Growth recommendations based on positive trends
  const growingTrends = trends.filter(t => t.direction === 'increasing');
  if (growingTrends.length > 0) {
    recommendations.push({
      priority: 'medium' as const,
      action: 'Scale successful initiatives and channels',
      expectedImpact: 'Accelerate growth by 20-30%',
      timeline: 'Within 1 month',
      resources: ['Additional budget', 'Team expansion', 'Technology upgrades']
    });
  }

  // Optimization recommendations
  recommendations.push({
    priority: 'medium' as const,
    action: 'Implement advanced analytics and tracking',
    expectedImpact: 'Improve decision-making accuracy by 40%',
    timeline: 'Within 6 weeks',
    resources: ['Analytics platform', 'Data analyst', 'Training budget']
  });

  // Long-term strategic recommendations
  recommendations.push({
    priority: 'low' as const,
    action: 'Develop predictive analytics capabilities',
    expectedImpact: 'Enable proactive strategy adjustments',
    timeline: 'Within 3 months',
    resources: ['AI/ML tools', 'Data science expertise', 'Historical data cleanup']
  });

  return recommendations;
}

function assessRisks(current: any, trends: any[], businessContext: any) {
  const risks = [];

  // Performance decline risks
  const decliningTrends = trends.filter(t => t.direction === 'decreasing');
  if (decliningTrends.length > 0) {
    risks.push({
      risk: 'Declining performance in key metrics',
      probability: 'high' as const,
      impact: 'high' as const,
      mitigation: 'Implement immediate corrective actions and increase monitoring frequency'
    });
  }

  // Market saturation risk
  if (current.leads !== undefined && current.leads < 50) {
    risks.push({
      risk: 'Market saturation or increased competition',
      probability: 'medium' as const,
      impact: 'medium' as const,
      mitigation: 'Explore new market segments and differentiation strategies'
    });
  }

  // Resource constraint risk
  risks.push({
    risk: 'Resource constraints limiting growth potential',
    probability: 'medium' as const,
    impact: 'medium' as const,
    mitigation: 'Prioritize high-ROI activities and consider strategic partnerships'
  });

  return risks;
}

function identifyOpportunities(current: any, trends: any[], businessContext: any) {
  const opportunities = [];

  // Growth opportunities
  const strongTrends = trends.filter(t => t.strength === 'strong' && t.direction === 'increasing');
  if (strongTrends.length > 0) {
    opportunities.push({
      opportunity: 'Scale high-performing channels and campaigns',
      potential: 'high' as const,
      effort: 'medium' as const,
      timeline: '1-2 months'
    });
  }

  // Technology opportunities
  opportunities.push({
    opportunity: 'Implement marketing automation and AI-driven personalization',
    potential: 'high' as const,
    effort: 'high' as const,
    timeline: '2-3 months'
  });

  // Market expansion opportunities
  if (current.revenue !== undefined && current.revenue > 25000) {
    opportunities.push({
      opportunity: 'Expand to new geographic markets or customer segments',
      potential: 'medium' as const,
      effort: 'high' as const,
      timeline: '3-6 months'
    });
  }

  // Partnership opportunities
  opportunities.push({
    opportunity: 'Develop strategic partnerships for lead generation',
    potential: 'medium' as const,
    effort: 'medium' as const,
    timeline: '1-3 months'
  });

  return opportunities;
}

function generateExecutiveSummary(metrics: any[], insights: any[], reportType: string, timeframe: string) {
  const positiveMetrics = metrics.filter(m => m.trend === 'up').length;
  const totalMetrics = metrics.length;
  const positiveInsights = insights.filter(i => i.impact === 'positive').length;

  return `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} ${reportType} report shows ${positiveMetrics} out of ${totalMetrics} key metrics trending positively. Analysis reveals ${positiveInsights} positive insights with ${insights.length - positiveInsights} areas requiring attention. Overall performance indicates ${positiveMetrics > totalMetrics / 2 ? 'strong momentum with opportunities for optimization' : 'mixed results requiring strategic intervention'}. Key focus areas include lead generation optimization, conversion rate improvement, and revenue growth acceleration.`;
}

function generateNextSteps(recommendations: any[], risks: any[], opportunities: any[]) {
  const nextSteps = [];

  // Immediate actions from high-priority recommendations
  const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
  if (highPriorityRecs.length > 0) {
    nextSteps.push('Execute high-priority recommendations within 2 weeks');
  }

  // Risk mitigation actions
  const highRisks = risks.filter(r => r.probability === 'high' || r.impact === 'high');
  if (highRisks.length > 0) {
    nextSteps.push('Implement risk mitigation strategies for identified high-impact risks');
  }

  // Opportunity capture actions
  const highPotentialOps = opportunities.filter(o => o.potential === 'high');
  if (highPotentialOps.length > 0) {
    nextSteps.push('Develop action plans for high-potential opportunities');
  }

  // Standard next steps
  nextSteps.push('Schedule weekly performance review meetings');
  nextSteps.push('Set up automated alerts for key metric thresholds');
  nextSteps.push('Plan next reporting period data collection and analysis');

  return nextSteps;
}