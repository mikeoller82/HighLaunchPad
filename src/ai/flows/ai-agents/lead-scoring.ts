import { z } from 'zod';

const LeadScoringInputSchema = z.object({
    leadData: z.object({
        id: z.string().optional(),
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        industry: z.string().optional(),
        companySize: z.string().optional(),
        websiteVisits: z.number().default(0),
        pageViews: z.number().default(0),
        timeOnSite: z.number().default(0),
        downloadedContent: z.number().default(0),
        emailEngagement: z.object({
            opens: z.number().default(0),
            clicks: z.number().default(0),
            replies: z.number().default(0)
        }).optional(),
        socialMediaActivity: z.number().default(0),
        demoRequests: z.number().default(0),
        trialSignups: z.number().default(0),
        pricingPageVisits: z.number().default(0),
        competitorResearch: z.boolean().default(false),
        urgencyIndicators: z.array(z.string()).default([])
    }),
    scoringCriteria: z.object({
        demographic: z.object({
            jobTitle: z.object({
                weight: z.number().min(0).max(1),
                highValueTitles: z.array(z.string()).default(['CEO', 'CTO', 'VP', 'Director', 'Manager'])
            }),
            company: z.object({
                weight: z.number().min(0).max(1),
                targetIndustries: z.array(z.string()).default([])
            }),
            companySize: z.object({
                weight: z.number().min(0).max(1),
                preferredSizes: z.array(z.string()).default(['51-200', '201-500', '500+'])
            })
        }),
        behavioral: z.object({
            websiteEngagement: z.object({
                weight: z.number().min(0).max(1),
                visitThreshold: z.number().default(3),
                timeThreshold: z.number().default(300)
            }),
            contentEngagement: z.object({
                weight: z.number().min(0).max(1),
                downloadThreshold: z.number().default(2)
            }),
            emailEngagement: z.object({
                weight: z.number().min(0).max(1),
                openRateThreshold: z.number().default(0.3),
                clickRateThreshold: z.number().default(0.1)
            })
        }),
        intent: z.object({
            demoRequests: z.object({
                weight: z.number().min(0).max(1),
                points: z.number().default(50)
            }),
            trialSignups: z.object({
                weight: z.number().min(0).max(1),
                points: z.number().default(75)
            }),
            pricingPageVisits: z.object({
                weight: z.number().min(0).max(1),
                points: z.number().default(25)
            })
        })
    })
});

const LeadScoringOutputSchema = z.object({
    leadId: z.string(),
    score: z.number().min(0).max(100),
    grade: z.enum(['A', 'B', 'C', 'D']),
    reasoning: z.string(),
    recommendations: z.array(z.string()),
    nextActions: z.array(z.object({
        action: z.string(),
        priority: z.enum(['high', 'medium', 'low']),
        timeline: z.string()
    }))
});

export async function leadScoringFlow(input: z.infer<typeof LeadScoringInputSchema>) {
        const { leadData, scoringCriteria } = input;

        // Calculate demographic score
        let demographicScore = 0;
        if (leadData.jobTitle && scoringCriteria.demographic.jobTitle.highValueTitles.includes(leadData.jobTitle)) {
            demographicScore += 20 * scoringCriteria.demographic.jobTitle.weight;
        }

        if (leadData.industry && scoringCriteria.demographic.company.targetIndustries.includes(leadData.industry)) {
            demographicScore += 15 * scoringCriteria.demographic.company.weight;
        }

        if (leadData.companySize && scoringCriteria.demographic.companySize.preferredSizes.includes(leadData.companySize)) {
            demographicScore += 10 * scoringCriteria.demographic.companySize.weight;
        }

        // Calculate behavioral score
        let behavioralScore = 0;
        if (leadData.websiteVisits >= scoringCriteria.behavioral.websiteEngagement.visitThreshold) {
            behavioralScore += 15 * scoringCriteria.behavioral.websiteEngagement.weight;
        }

        if (leadData.timeOnSite >= scoringCriteria.behavioral.websiteEngagement.timeThreshold) {
            behavioralScore += 10 * scoringCriteria.behavioral.websiteEngagement.weight;
        }

        if (leadData.downloadedContent >= scoringCriteria.behavioral.contentEngagement.downloadThreshold) {
            behavioralScore += 15 * scoringCriteria.behavioral.contentEngagement.weight;
        }

        // Email engagement scoring
        if (leadData.emailEngagement) {
            const openRate = leadData.emailEngagement.opens > 0 ? leadData.emailEngagement.clicks / leadData.emailEngagement.opens : 0;
            if (openRate >= scoringCriteria.behavioral.emailEngagement.openRateThreshold) {
                behavioralScore += 10 * scoringCriteria.behavioral.emailEngagement.weight;
            }
        }

        // Calculate intent score
        let intentScore = 0;
        intentScore += leadData.demoRequests * scoringCriteria.intent.demoRequests.points * scoringCriteria.intent.demoRequests.weight;
        intentScore += leadData.trialSignups * scoringCriteria.intent.trialSignups.points * scoringCriteria.intent.trialSignups.weight;
        intentScore += leadData.pricingPageVisits * scoringCriteria.intent.pricingPageVisits.points * scoringCriteria.intent.pricingPageVisits.weight;

        // Calculate total score
        const totalScore = Math.min(100, demographicScore + behavioralScore + intentScore);

        // Determine grade
        let grade: 'A' | 'B' | 'C' | 'D';
        if (totalScore >= 80) grade = 'A';
        else if (totalScore >= 60) grade = 'B';
        else if (totalScore >= 40) grade = 'C';
        else grade = 'D';

        // Generate recommendations
        const recommendations: string[] = [];
        const nextActions: Array<{ action: string; priority: 'high' | 'medium' | 'low'; timeline: string }> = [];

        if (grade === 'A') {
            recommendations.push('High-priority lead - immediate sales outreach recommended');
            nextActions.push({
                action: 'Schedule demo call',
                priority: 'high',
                timeline: 'Within 24 hours'
            });
        } else if (grade === 'B') {
            recommendations.push('Qualified lead - nurture with targeted content');
            nextActions.push({
                action: 'Send personalized email sequence',
                priority: 'medium',
                timeline: 'Within 3 days'
            });
        } else if (grade === 'C') {
            recommendations.push('Potential lead - continue nurturing');
            nextActions.push({
                action: 'Add to nurturing campaign',
                priority: 'low',
                timeline: 'Within 1 week'
            });
        } else {
            recommendations.push('Low-priority lead - basic nurturing');
            nextActions.push({
                action: 'Add to general newsletter',
                priority: 'low',
                timeline: 'Within 2 weeks'
            });
        }

        const reasoning = `Lead scored ${totalScore}/100 based on: Demographic (${demographicScore.toFixed(1)}), Behavioral (${behavioralScore.toFixed(1)}), Intent (${intentScore.toFixed(1)})`;

        return {
            leadId: leadData.id || leadData.email,
            score: Math.round(totalScore),
            grade,
            reasoning,
            recommendations,
            nextActions
        };
}