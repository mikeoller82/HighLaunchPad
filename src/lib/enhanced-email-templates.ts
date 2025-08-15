// Enhanced email templates with comprehensive personalization and industry variations
import * as Icons from 'lucide-react';

export interface PersonalizationField {
    field: string;
    description: string;
    required: boolean;
    defaultValue?: string;
    examples: string[];
}

export interface EnhancedEmailTemplate {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Icons;
    objective: string;
    tone: 'professional' | 'friendly' | 'persuasive' | 'enthusiastic' | 'witty' | 'inspiring' | 'educational' | 'festive';
    industry?: string[];
    targetAudience?: string;
    personalizationFields: PersonalizationField[];
    contentTemplate: string;
    subjectLineVariants: string[];
    psychologicalTriggers: string[];
    callToActionVariants: string[];
    followUpSequence?: string[];
    productDetails: string;
}

export const enhancedEmailTemplates: EnhancedEmailTemplate[] = [
    {
        id: 'welcome-email-enhanced',
        title: 'Enhanced Welcome Email',
        description: 'Personalized onboarding email that builds connection and drives engagement.',
        icon: 'Sparkles',
        objective: 'Welcome new subscribers, deliver value immediately, and set expectations for future communications.',
        tone: 'friendly',
        industry: ['saas', 'consulting', 'coaching', 'ecommerce', 'education'],
        targetAudience: 'New subscribers and leads',
        personalizationFields: [
            { field: 'firstName', description: 'Subscriber first name', required: true, defaultValue: 'there', examples: ['Sarah', 'Michael', 'there'] },
            { field: 'leadMagnet', description: 'Lead magnet they downloaded', required: true, examples: ['Ultimate SEO Guide', 'Business Plan Template', 'Free Course'] },
            { field: 'brandName', description: 'Your brand name', required: true, examples: ['GrowthCo', 'Success Academy', 'TechSolutions'] },
            { field: 'mainBenefit', description: 'Primary value you provide', required: true, examples: ['increase revenue', 'save time', 'build confidence'] },
            { field: 'targetOutcome', description: 'What they want to achieve', required: true, examples: ['6-figure business', 'better health', 'career advancement'] }
        ],
        contentTemplate: `Hi [firstName],

Welcome to the [brandName] family! 🎉

I know your inbox is probably overflowing, so I'll keep this short and valuable.

You just downloaded the [leadMagnet], which means you're serious about [targetOutcome]. That already puts you ahead of 90% of people who just consume content without taking action.

**Here's what happens next:**

✅ Check your inbox for the [leadMagnet] download link (it might take 2-3 minutes)
✅ Implement the first strategy within 48 hours for maximum impact  
✅ Watch for my email tomorrow where I'll share the #1 mistake that prevents [mainBenefit]

At [brandName], we don't believe in information overload. Every email I send contains ONE actionable strategy you can implement immediately.

**Quick question:** What's your biggest challenge with [relevant topic area] right now?

Just hit reply and let me know. I read every response personally and often create content based on your questions.

To your success,
[Your Name]
Founder, [brandName]

P.S. Add this email (hello@[brandName].com) to your contacts so you never miss an update. The strategies I share have helped our community generate millions in additional results.`,
        subjectLineVariants: [
            'Welcome to [brandName], [firstName]! 🎉',
            '[firstName], your [leadMagnet] is ready (+ what happens next)',
            'Thanks for joining [brandName] - here\'s what\'s coming...',
            'Welcome aboard, [firstName]! Your transformation starts now'
        ],
        psychologicalTriggers: ['social proof', 'exclusivity', 'personal connection', 'next steps', 'reciprocity'],
        callToActionVariants: [
            'Download Your [leadMagnet]',
            'Get Instant Access Now',
            'Claim Your Free Guide',
            'Access Your Resources'
        ],
        followUpSequence: [
            'Day 2: The #1 mistake preventing results',
            'Day 5: Success story + advanced strategy',
            'Day 8: Exclusive offer for new subscribers'
        ],
        productDetails: 'Brand: [brandName], Lead magnet: [leadMagnet], Main benefit: [mainBenefit], Target outcome: [targetOutcome]'
    },

    {
        id: 'scarcity-promo-enhanced',
        title: 'High-Converting Promotional Email',
        description: 'Urgency-driven promotional email with psychological triggers and scarcity elements.',
        icon: 'BadgePercent',
        objective: 'Drive immediate sales through compelling offers with genuine urgency and scarcity.',
        tone: 'persuasive',
        industry: ['ecommerce', 'saas', 'coaching', 'education'],
        targetAudience: 'Warm leads and existing customers',
        personalizationFields: [
            { field: 'firstName', description: 'Customer first name', required: true, defaultValue: 'there', examples: ['Sarah', 'Michael'] },
            { field: 'productName', description: 'Product being promoted', required: true, examples: ['Pro Marketing Course', 'Premium Subscription', 'VIP Coaching'] },
            { field: 'discountAmount', description: 'Discount percentage or amount', required: true, examples: ['50%', '$300', '40% OFF'] },
            { field: 'originalPrice', description: 'Original product price', required: true, examples: ['$997', '$149/month', '$2,500'] },
            { field: 'salePrice', description: 'Discounted price', required: true, examples: ['$497', '$89/month', '$1,250'] },
            { field: 'reasonForSale', description: 'Why offering discount', required: true, examples: ['Black Friday', 'Launch celebration', 'End of quarter'] },
            { field: 'socialProofNumber', description: 'Number of customers/users', required: true, examples: ['2,847', '15,000+', '500+'] }
        ],
        contentTemplate: `[firstName], this is not a drill... ⚠️

For [reasonForSale], I'm offering [discountAmount] off [productName].

But here's the catch: This offer expires in exactly 72 hours.

**Here's why I'm doing this:**

[Brief, authentic reason for the sale - e.g., "I want to end the quarter strong and help as many people as possible get results before 2025"]

**What you get with [productName]:**

✅ [Specific benefit that addresses pain point]
✅ [Unique advantage over competitors]  
✅ [Measurable outcome they can expect]
✅ [Bonus or guarantee that reduces risk]

**The numbers:**
• Regular Price: [originalPrice]
• Your Price Today: [salePrice]  
• **You Save: [discountAmount]**

**Social Proof:**
[socialProofNumber] people have already transformed their [relevant area] using [productName].

Here's what [recent customer name] said:
*"[Brief, results-focused testimonial that's specific and believable]"*

[GET [productName] FOR [salePrice] - 72 HOURS ONLY]

Look [firstName], I could keep this at full price. [productName] delivers incredible value even at [originalPrice].

But [reasonForSale] gives me a chance to help more people get results.

The question is: Will you be one of them?

[CLAIM YOUR [discountAmount] DISCOUNT NOW]

This offer expires in 72 hours. No extensions. No exceptions.

To your success,
[Your Name]

P.S. Still on the fence? Remember: The cost of inaction is always higher than the cost of action. Don't let this opportunity pass you by.`,
        subjectLineVariants: [
            '⚠️ [firstName], 72 hours left ([discountAmount] off)',
            'FINAL NOTICE: [discountAmount] off [productName]',
            '[firstName], don\'t miss this ([reasonForSale] special)',
            'Last chance: [productName] for [salePrice]',
            '72 hours: [discountAmount] off expires soon'
        ],
        psychologicalTriggers: ['scarcity', 'urgency', 'loss aversion', 'social proof', 'authority', 'reciprocity'],
        callToActionVariants: [
            'Get [discountAmount] Off Now',
            'Claim My Discount - [salePrice]',
            'Yes, Give Me [discountAmount] Off',
            'Secure My Spot at [salePrice]'
        ],
        followUpSequence: [
            'Day 2: 48 hours left with additional testimonial',
            'Day 3: Final 24 hours with urgency boost',
            'Final day: Last 6 hours countdown'
        ],
        productDetails: 'Product: [productName], Original price: [originalPrice], Sale price: [salePrice], Discount: [discountAmount], Reason: [reasonForSale]'
    },

    {
        id: 'webinar-reminder-enhanced',
        title: 'High-Attendance Webinar Reminder',  
        description: 'Maximize webinar attendance with value-focused reminders and engagement tactics.',
        icon: 'CalendarClock',
        objective: 'Ensure maximum webinar attendance by building excitement and providing clear value preview.',
        tone: 'enthusiastic',
        industry: ['coaching', 'consulting', 'saas', 'education', 'finance'],
        targetAudience: 'Webinar registrants',
        personalizationFields: [
            { field: 'firstName', description: 'Registrant first name', required: true, defaultValue: 'there', examples: ['Sarah', 'Michael'] },
            { field: 'webinarTitle', description: 'Full webinar title', required: true, examples: ['7-Figure Business Blueprint', 'AI Marketing Revolution'] },
            { field: 'webinarDate', description: 'Webinar date', required: true, examples: ['Tomorrow (Thursday)', 'This Tuesday, March 15th'] },
            { field: 'webinarTime', description: 'Start time with timezone', required: true, examples: ['2:00 PM EST', '8:00 PM GMT', '11:00 AM PST'] },
            { field: 'hostName', description: 'Main presenter name', required: true, examples: ['Sarah Chen', 'Dr. Michael Rodriguez'] },
            { field: 'hostCredential', description: 'Host main credential', required: true, examples: ['7-Figure Entrepreneur', 'Former Google Executive', 'NYT Bestselling Author'] },
            { field: 'valuePreview', description: 'Sneak peek of main value', required: true, examples: ['3-step profit system', 'AI automation secrets', 'customer acquisition blueprint'] }
        ],
        contentTemplate: `🔥 [firstName], tomorrow changes everything!

[webinarTitle] starts in less than 24 hours, and I have to share something with you...

What I'm revealing [webinarDate] at [webinarTime] has the potential to completely transform your results in the next 90 days.

**Here's a sneak peek of what you'll discover:**

✅ The [valuePreview] ([hostCredential] [hostName] has used this to [specific achievement])
✅ Why 90% of people fail at [relevant topic] (and how to be in the 10% who thrive)
✅ Live Q&A where I'll solve your specific challenges in real-time

**But here's what makes this different...**

This isn't theory from someone who's never done it.

[hostName] has [specific achievement/credential] and will be sharing the exact strategies that made it possible.

**Your webinar details:**
📅 Date: [webinarDate]  
🕐 Time: [webinarTime]
🔗 Join Link: [Your webinar platform link]
⏱️ Duration: 75 minutes + live Q&A

**Pro tip:** Join 5-10 minutes early to:
- Test your connection
- Submit questions in advance  
- Get the best virtual seat in the house

[firstName], I've spent weeks preparing this training. It's not just another webinar - it's a complete blueprint you can start implementing immediately.

[SAVE MY SEAT - JOIN THE WEBINAR]

Can't wait to see you there tomorrow!

[hostName]
[hostCredential]

P.S. This training is LIVE only - no replay will be available. The strategies I'm sharing are too valuable to leave sitting in some replay vault. Make sure you attend live!`,
        subjectLineVariants: [
            '🔥 [firstName], tomorrow changes everything!',
            '[webinarTitle] starts in 24 hours - are you ready?',
            'Tomorrow: [hostName] reveals [valuePreview]',
            '[firstName], your seat is reserved for tomorrow...',
            'Final reminder: [webinarTitle] in 24 hours'
        ],
        psychologicalTriggers: ['anticipation', 'exclusivity', 'FOMO', 'authority', 'live interaction', 'urgency'],
        callToActionVariants: [
            'Join [webinarTitle] Tomorrow',
            'Reserve My Seat',
            'Yes, I\'ll Be There',
            'Get My Webinar Link'
        ],
        productDetails: 'Webinar: [webinarTitle], Date: [webinarDate], Time: [webinarTime], Host: [hostName] ([hostCredential]), Value preview: [valuePreview]'
    },

    {
        id: 'customer-success-enhanced',
        title: 'Results-Driven Success Story',
        description: 'Build credibility and drive action through compelling customer transformation stories.',
        icon: 'Trophy',
        objective: 'Demonstrate product value through specific customer results and inspire action in prospects.',
        tone: 'inspiring',
        industry: ['coaching', 'saas', 'consulting', 'education', 'fitness'],
        targetAudience: 'Prospects considering purchase',
        personalizationFields: [
            { field: 'firstName', description: 'Reader first name', required: true, defaultValue: 'there', examples: ['Sarah', 'Michael'] },
            { field: 'customerName', description: 'Success story customer', required: true, examples: ['Jennifer M.', 'David Chen', 'Lisa Rodriguez'] },
            { field: 'customerBackground', description: 'Customer background/role', required: true, examples: ['struggling consultant', 'overwhelmed entrepreneur', 'corporate executive'] },
            { field: 'specificResult', description: 'Measurable result achieved', required: true, examples: ['increased revenue by 340%', 'automated 80% of workflows', 'lost 35 pounds'] },
            { field: 'timeframe', description: 'How long transformation took', required: true, examples: ['90 days', '6 months', '8 weeks'] },
            { field: 'productUsed', description: 'Product/service that got results', required: true, examples: ['Business Accelerator Program', 'Marketing Automation Suite'] },
            { field: 'beforeSituation', description: 'Customer\'s situation before', required: true, examples: ['working 80-hour weeks for minimal profit', 'spending $5K/month on ads with no ROI'] }
        ],
        contentTemplate: `[firstName], I just got off a call with [customerName]...

And I had to share this with you immediately.

[timeframe] ago, [customerName] was [beforeSituation].

Sound familiar?

Well, check out what [customerName] just told me:

---

*"I can't believe the transformation. In just [timeframe], I've [specificResult]. The [key strategy from product] you taught me literally changed everything. I wish I had found [productUsed] years ago!"*

**- [customerName], [customerBackground]**

---

Here's the full story:

[timeframe] ago, [customerName] was exactly where many of you are right now:

• [Specific pain point that's relatable]
• [Another challenge many face]  
• [Third common struggle]

But instead of giving up, [customerName] made a decision.

[He/She] invested in [productUsed] and committed to following the system exactly as taught.

**The result?**

[specificResult] in just [timeframe].

But here's what I love most about [customerName]'s story...

It wasn't luck. It wasn't some special advantage. It wasn't perfect timing.

It was simply following a proven system.

[firstName], if you're where [customerName] was [timeframe] ago, you have two choices:

1. Keep doing what you're doing and hope things change
2. Follow the same proven system [customerName] used

The choice is yours.

If you're ready to write your own success story:

[GET [productUsed] AND START YOUR TRANSFORMATION]

To your success,
[Your Name]

P.S. [customerName] started with the same doubts and fears you might have. But [he/she] took action anyway. That's what made all the difference.`,
        subjectLineVariants: [
            '[firstName], [customerName] just told me this...',
            'Success Story: [specificResult] in [timeframe]',
            'How [customerName] went from [beforeSituation] to [specificResult]',
            '[customerName]\'s transformation will inspire you',
            'From [beforeSituation] to [specificResult] - here\'s how'
        ],
        psychologicalTriggers: ['social proof', 'relatability', 'transformation', 'proof of concept', 'aspiration', 'peer pressure'],
        callToActionVariants: [
            'Get [productUsed] Now',
            'Start My Transformation',
            'Join [customerName] and 1000+ Others',
            'Get The Same Results'
        ],
        followUpSequence: [
            'Day 3: Another success story with different angle',
            'Day 7: Behind-the-scenes of the success methodology', 
            'Day 10: Limited-time offer to join the program'
        ],
        productDetails: 'Customer: [customerName] ([customerBackground]), Result: [specificResult] in [timeframe], Product: [productUsed], Before: [beforeSituation]'
    }
];

// Industry-specific email template variations
export const industryEmailTemplates = {
    healthcare: [
        {
            id: 'health-consultation-reminder',
            title: 'Health Consultation Reminder',
            description: 'Professional appointment reminder with health tips and preparation guidelines.',
            icon: 'Heart' as keyof typeof Icons,
            objective: 'Remind patients of appointments and ensure preparation',
            tone: 'professional' as const,
            industry: ['healthcare'],
            targetAudience: 'Patients with upcoming appointments',
            personalizationFields: [
                { field: 'firstName', description: 'Patient first name', required: true, defaultValue: 'there', examples: ['Sarah', 'Michael'] },
                { field: 'appointmentDate', description: 'Appointment date', required: true, examples: ['March 15th', 'Tomorrow'] },
                { field: 'appointmentTime', description: 'Appointment time', required: true, examples: ['2:00 PM', '10:30 AM'] },
                { field: 'doctorName', description: 'Doctor name', required: true, examples: ['Dr. Smith', 'Dr. Johnson'] }
            ],
            contentTemplate: `Dear [firstName],

This is a friendly reminder about your upcoming health consultation scheduled for [appointmentDate] at [appointmentTime].

**Appointment Details:**
• Date: [appointmentDate]
• Time: [appointmentTime]  
• Provider: [doctorName]
• Location: [clinicAddress]

**To prepare for your visit:**
✓ Bring your insurance card and ID
✓ List of current medications
✓ Recent test results (if applicable)
✓ Questions or concerns you'd like to discuss

**Health Tip:** Arrive 15 minutes early to complete any necessary paperwork.

If you need to reschedule, please call us at [phoneNumber] at least 24 hours in advance.

We look forward to seeing you soon.

Best regards,
[clinicName] Team

*This message contains confidential health information. If you received this in error, please delete immediately.*`,
            psychologicalTriggers: ['health anxiety', 'professional trust', 'preparation', 'urgency'],
            subjectLineVariants: [
                'Appointment Reminder: [appointmentDate] with [doctorName]',
                '[firstName], your health consultation is tomorrow',
                'Don\'t forget: [appointmentTime] appointment on [appointmentDate]'
            ],
            callToActionVariants: [
                'Confirm Appointment',
                'Reschedule if Needed',
                'Contact Our Office'
            ],
            followUpSequence: [
                'Day after: Follow-up on consultation',
                'Week after: Health tips and next steps'
            ],
            productDetails: 'Healthcare consultation service with licensed medical professionals'
        }
    ],
    
    finance: [
        {
            id: 'financial-planning-consultation',
            title: 'Financial Planning Consultation Offer',
            description: 'Professional consultation offer with market insights and financial planning benefits.',
            icon: 'TrendingUp' as keyof typeof Icons,
            objective: 'Generate qualified leads for financial planning services',
            tone: 'professional' as const,
            industry: ['finance'],
            targetAudience: 'Prospective financial planning clients',
            personalizationFields: [
                { field: 'firstName', description: 'Client first name', required: true, defaultValue: 'there', examples: ['Sarah', 'Michael'] },
                { field: 'advisorName', description: 'Financial advisor name', required: true, examples: ['John Smith', 'Sarah Johnson'] },
                { field: 'firmName', description: 'Financial firm name', required: true, examples: ['Wealth Partners', 'Financial Solutions'] }
            ],
            contentTemplate: `Dear [firstName],

With recent market volatility and economic uncertainty, many of our clients are asking: "How can I protect and grow my wealth in these times?"

**Current Market Snapshot:**
• [Current market condition]
• [Key economic indicator]
• [Relevant financial trend]

This is exactly why I'm offering complimentary 30-minute financial planning consultations this month.

**During your consultation, we'll cover:**
✓ Your current financial position assessment
✓ Risk tolerance evaluation  
✓ Personalized investment strategy recommendations
✓ Tax optimization opportunities
✓ Retirement planning roadmap

**Recent Client Success:**
[clientName] came to us with [financial challenge] and we helped them [specific result] within [timeframe].

**Schedule Your Complimentary Consultation:**
[BOOK YOUR FREE CONSULTATION]

**Investment Disclaimer:** All investments carry risk. Past performance does not guarantee future results. Please consult with a qualified financial advisor before making investment decisions.

Best regards,
[advisorName], CFP®
[firmName]

P.S. These complimentary consultations are limited to 20 clients this month. Secure your spot today.`,
            psychologicalTriggers: ['financial security', 'market timing', 'risk mitigation', 'scarcity', 'social proof'],
            subjectLineVariants: [
                'Your Financial Plan for Market Uncertainty',
                '[firstName], complimentary financial consultation available',
                'Market Update + Free Financial Planning Session'
            ],
            callToActionVariants: [
                'Book Free Consultation',
                'Schedule Planning Session',
                'Get Financial Review'
            ],
            followUpSequence: [
                'Day 3: Market insights and planning tips',
                'Week 1: Follow-up consultation offer'
            ],
            productDetails: 'Professional financial planning and investment advisory services'
        }
    ],

    realestate: [
        {
            id: 'property-valuation-offer',
            title: 'Free Property Valuation Offer',
            description: 'Professional property valuation offer with local market insights and expertise.',
            icon: 'Home' as keyof typeof Icons,
            objective: 'Generate property valuation leads and potential listings',
            tone: 'professional' as const,
            industry: ['realestate'],
            targetAudience: 'Property owners considering sale or refinance',
            personalizationFields: [
                { field: 'firstName', description: 'Property owner first name', required: true, defaultValue: 'there', examples: ['Sarah', 'Michael'] },
                { field: 'cityName', description: 'City or area name', required: true, examples: ['Austin', 'Denver', 'Miami'] },
                { field: 'agentName', description: 'Real estate agent name', required: true, examples: ['John Smith', 'Sarah Johnson'] }
            ],
            contentTemplate: `Hello [firstName],

Are you curious about your home's current market value?

With [localMarketTrend] in the [cityName] area, many homeowners are discovering their properties are worth significantly more than expected.

**Recent Market Activity in [neighborhoodName]:**
• Average price increase: [percentageIncrease]%
• Days on market: [averageDaysOnMarket]
• Inventory levels: [inventoryStatus]

**Your Complimentary Home Valuation Includes:**
✓ Comprehensive market analysis
✓ Recent comparable sales review
✓ Property condition assessment
✓ Current market positioning
✓ Strategic recommendations for maximum value

**Recent Success Story:**
We recently helped [clientName] in [neighborhood] sell their home for [amountOverAsking] over asking price in just [daysOnMarket] days.

**Get Your Free Property Valuation:**
[REQUEST FREE VALUATION]

As a local market expert with [yearsExperience] years of experience, I provide accurate valuations based on:
• Current market conditions
• Recent comparable sales
• Unique property features
• Neighborhood trends

**No obligation. No pressure. Just professional insights.**

Best regards,
[agentName]
[brokerageName]
[phone] | [email]

P.S. Property values are changing rapidly. Get your current valuation while the market is hot.`,
            psychologicalTriggers: ['curiosity', 'market timing', 'asset protection', 'social proof', 'local expertise'],
            subjectLineVariants: [
                'What\'s your [cityName] home worth today?',
                '[firstName], your property value may surprise you',
                'Free home valuation + [cityName] market update'
            ],
            callToActionVariants: [
                'Get Free Valuation',
                'Request Property Assessment',
                'Find My Home Value'
            ],
            followUpSequence: [
                'Day 2: Market trends in your area',
                'Week 1: Selling tips and strategies'
            ],
            productDetails: 'Professional real estate services including property valuation, buying, selling, and market analysis'
        }
    ]
};

// Utility functions for template management
export function getEmailTemplatesByIndustry(industry: string): EnhancedEmailTemplate[] {
    const industrySpecific = industryEmailTemplates[industry as keyof typeof industryEmailTemplates] || [];
    const universalTemplates = enhancedEmailTemplates.filter(template => 
        !template.industry || template.industry.includes(industry)
    );
    
    return [...universalTemplates, ...industrySpecific.map(template => ({
        ...template,
        objective: template.objective || 'Engage and convert prospects',
        personalizationFields: template.personalizationFields || [
            { field: 'firstName', description: 'Customer first name', required: true, defaultValue: 'there', examples: ['Sarah', 'Michael'] }
        ],
        callToActionVariants: template.callToActionVariants || ['Learn More', 'Get Started', 'Contact Us'],
        followUpSequence: template.followUpSequence || [],
        productDetails: template.productDetails || 'Industry-specific service or product offering'
    })) as EnhancedEmailTemplate[]];
}

export function validateEmailTemplate(template: EnhancedEmailTemplate): {
    isValid: boolean;
    missingFields: string[];
    suggestions: string[];
} {
    const requiredFields = ['id', 'title', 'contentTemplate', 'subjectLineVariants', 'callToActionVariants'];
    const missingFields = requiredFields.filter(field => !template[field as keyof EnhancedEmailTemplate]);
    
    const suggestions: string[] = [];
    
    if (!template.psychologicalTriggers || template.psychologicalTriggers.length === 0) {
        suggestions.push('Add psychological triggers to improve email effectiveness');
    }
    
    if (!template.followUpSequence) {
        suggestions.push('Consider adding a follow-up email sequence');
    }
    
    if (template.subjectLineVariants.length < 3) {
        suggestions.push('Add more subject line variants for A/B testing');
    }

    if (template.contentTemplate.length < 200) {
        suggestions.push('Consider expanding email content for better engagement');
    }
    
    return {
        isValid: missingFields.length === 0,
        missingFields,
        suggestions
    };
}

export default enhancedEmailTemplates;