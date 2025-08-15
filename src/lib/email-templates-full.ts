import * as Icons from 'lucide-react';

export interface EmailTemplateCategory {
  id: string;
  name: string;
  description: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: keyof typeof Icons;
  thumbnail: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  tags: string[];
  metrics: {
    averageOpenRate: number;
    averageClickRate: number;
    averageConversionRate: number;
  };
}

export const emailCategories: EmailTemplateCategory[] = [
  {
    id: 'welcome',
    name: 'Welcome Series',
    description: 'Onboard new subscribers and introduce your brand'
  },
  {
    id: 'promotional',
    name: 'Promotional',
    description: 'Drive sales with compelling offers and discounts'
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Keep subscribers engaged with valuable content'
  },
  {
    id: 'transactional',
    name: 'Transactional',
    description: 'Order confirmations, receipts, and updates'
  },
  {
    id: 'event',
    name: 'Event Marketing',
    description: 'Promote webinars, workshops, and events'
  },
  {
    id: 'nurture',
    name: 'Lead Nurture',
    description: 'Guide prospects through your sales funnel'
  }
];

export const professionalEmailTemplates: EmailTemplate[] = [
  // WELCOME SERIES
  {
    id: 'welcome-modern',
    title: 'Modern Welcome Email',
    description: 'Clean, modern welcome email with strong branding',
    category: 'welcome',
    icon: 'Sparkles',
    thumbnail: '/images/email-templates/welcome-modern.png',
    subject: 'Welcome to \${{company_name}}! 🎉',
    variables: ['first_name', 'company_name', 'company_logo', 'website_url', 'support_email'],
    tags: ['welcome', 'onboarding', 'modern'],
    metrics: {
      averageOpenRate: 68.5,
      averageClickRate: 12.3,
      averageConversionRate: 4.2
    },
    htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to \${{company_name}}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .logo { max-width: 150px; height: auto; }
        .content { padding: 40px 30px; }
        .welcome-title { font-size: 28px; font-weight: bold; color: #1e293b; margin-bottom: 20px; text-align: center; }
        .welcome-text { font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 30px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .features { background-color: #f8fafc; padding: 30px; border-radius: 12px; margin: 30px 0; }
        .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .feature { text-align: center; }
        .feature-icon { width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; }
        .footer { background-color: #1e293b; color: #94a3b8; padding: 30px 20px; text-align: center; font-size: 14px; }
        .social-links { margin: 20px 0; }
        .social-links a { display: inline-block; margin: 0 10px; }
        @media (max-width: 600px) {
            .feature-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="\${{company_logo}}" alt="\${{company_name}}" class="logo">
        </div>
        
        <div class="content">
            <h1 class="welcome-title">Welcome to \${{company_name}}, \${{first_name}}!</h1>
            
            <p class="welcome-text">
                We're thrilled to have you join our community! You've just taken the first step towards transforming your business, and we couldn't be more excited to be part of your journey.
            </p>
            
            <div style="text-align: center;">
                <a href="\${{website_url}}/getting-started" class="cta-button">Get Started Now</a>
            </div>
            
            <div class="features">
                <h3 style="text-align: center; margin-bottom: 30px; color: #1e293b;">What You Can Expect</h3>
                <div class="feature-grid">
                    <div class="feature">
                        <div class="feature-icon">📚</div>
                        <h4 style="color: #1e293b; margin-bottom: 10px;">Expert Resources</h4>
                        <p style="color: #64748b; font-size: 14px;">Access our library of proven templates and guides</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🎯</div>
                        <h4 style="color: #1e293b; margin-bottom: 10px;">Personalized Tips</h4>
                        <p style="color: #64748b; font-size: 14px;">Get recommendations tailored to your goals</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🤝</div>
                        <h4 style="color: #1e293b; margin-bottom: 10px;">Community Support</h4>
                        <p style="color: #64748b; font-size: 14px;">Connect with like-minded entrepreneurs</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">⚡</div>
                        <h4 style="color: #1e293b; margin-bottom: 10px;">Priority Support</h4>
                        <p style="color: #64748b; font-size: 14px;">Get help when you need it most</p>
                    </div>
                </div>
            </div>
            
            <p class="welcome-text">
                <strong>Here's what to do next:</strong>
            </p>
            <ul style="color: #475569; line-height: 1.8;">
                <li>Complete your profile setup</li>
                <li>Explore our getting started guide</li>
                <li>Join our community forum</li>
                <li>Schedule a free onboarding call</li>
            </ul>
            
            <p class="welcome-text">
                If you have any questions, don't hesitate to reach out to us at <a href="mailto:\${{support_email}}" style="color: #667eea;">\${{support_email}}</a>. We're here to help!
            </p>
            
            <p style="color: #475569; font-style: italic;">
                Welcome aboard,<br>
                The \${{company_name}} Team
            </p>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="#"><img src="/images/social/facebook.png" alt="Facebook" width="24" height="24"></a>
                <a href="#"><img src="/images/social/twitter.png" alt="Twitter" width="24" height="24"></a>
                <a href="#"><img src="/images/social/linkedin.png" alt="LinkedIn" width="24" height="24"></a>
                <a href="#"><img src="/images/social/instagram.png" alt="Instagram" width="24" height="24"></a>
            </div>
            <p>\${{company_name}} | <a href="\${{website_url}}/unsubscribe" style="color: #94a3b8;">Unsubscribe</a> | <a href="\${{website_url}}/privacy" style="color: #94a3b8;">Privacy Policy</a></p>
        </div>
    </div>
</body>
</html>`,
    textContent: `Welcome to \${{company_name}}, \${{first_name}}!

We're thrilled to have you join our community! You've just taken the first step towards transforming your business, and we couldn't be more excited to be part of your journey.

Get Started: \${{website_url}}/getting-started

What You Can Expect:
- Expert Resources: Access our library of proven templates and guides
- Personalized Tips: Get recommendations tailored to your goals
- Community Support: Connect with like-minded entrepreneurs
- Priority Support: Get help when you need it most

Here's what to do next:
1. Complete your profile setup
2. Explore our getting started guide
3. Join our community forum
4. Schedule a free onboarding call

If you have any questions, reach out to us at \${{support_email}}.

Welcome aboard,
The \${{company_name}} Team

\${{company_name}} | Unsubscribe: \${{website_url}}/unsubscribe`
  },

  // PROMOTIONAL
  {
    id: 'flash-sale',
    title: 'Flash Sale Promotion',
    description: 'Urgent flash sale email with countdown timer',
    category: 'promotional',
    icon: 'Zap',
    thumbnail: '/images/email-templates/flash-sale.png',
    subject: 'FLASH SALE: \${{discount}}% OFF - Ends in \${{hours_left}} Hours! ⏰',
    variables: ['first_name', 'discount', 'hours_left', 'product_name', 'original_price', 'sale_price', 'company_name'],
    tags: ['sale', 'urgent', 'discount', 'limited-time'],
    metrics: {
      averageOpenRate: 45.2,
      averageClickRate: 18.7,
      averageConversionRate: 8.4
    },
    htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flash Sale - \${{discount}}% OFF</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #000000; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .urgent-header { background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; text-align: center; padding: 15px; font-weight: bold; animation: pulse 2s infinite; }
        .hero { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 50px 20px; text-align: center; }
        .countdown { background-color: rgba(255,255,255,0.1); border-radius: 10px; padding: 20px; margin: 20px 0; }
        .countdown-item { display: inline-block; margin: 0 10px; text-align: center; }
        .countdown-number { font-size: 36px; font-weight: bold; display: block; }
        .countdown-label { font-size: 12px; text-transform: uppercase; }
        .product-showcase { padding: 40px 20px; text-align: center; }
        .price-comparison { font-size: 24px; margin: 20px 0; }
        .original-price { text-decoration: line-through; color: #999; margin-right: 15px; }
        .sale-price { color: #ff6b6b; font-weight: bold; font-size: 32px; }
        .cta-button { display: inline-block; background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; padding: 20px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; margin: 20px 0; box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3); }
        .urgency-text { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 8px; margin: 20px; text-align: center; }
        .social-proof { background-color: #f8f9fa; padding: 30px 20px; text-align: center; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
    </style>
</head>
<body>
    <div class="container">
        <div class="urgent-header">
            🚨 FLASH SALE ALERT - LIMITED TIME ONLY! 🚨
        </div>
        
        <div class="hero">
            <h1 style="margin: 0; font-size: 42px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                \${{discount}}% OFF EVERYTHING
            </h1>
            <p style="font-size: 18px; margin: 20px 0;">Don't miss out, \${{first_name}}! This sale ends soon.</p>
            
            <div class="countdown">
                <h3 style="margin-top: 0;">⏰ Sale Ends In:</h3>
                <div class="countdown-item">
                    <span class="countdown-number">\${{hours_left}}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">23</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">45</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            </div>
        </div>
        
        <div class="product-showcase">
            <h2 style="color: #333; margin-bottom: 30px;">Featured Deal: \${{product_name}}</h2>
            
            <div class="price-comparison">
                <span class="original-price">$\{\{original_price\}\}</span>
                <span class="sale-price">$\{\{sale_price\}\}</span>
            </div>
            
            <p style="color: #666; font-size: 16px; margin: 30px 0;">
                Save $\{\{original_price - sale_price\}\} when you act now! This is our biggest discount of the year.
            </p>
            
            <a href="#" class="cta-button">CLAIM YOUR \{\{discount\}\}% DISCOUNT</a>
        </div>
        
        <div class="urgency-text">
            <strong>⚠️ Warning:</strong> This flash sale pricing will never be offered again. Once the timer hits zero, prices return to normal.
        </div>
        
        <div class="social-proof">
            <p style="margin: 0; color: #666; font-style: italic;">
                "I couldn't believe the quality at this price! Grabbed 3 of them before the sale ended." - Sarah M.
            </p>
            <div style="margin-top: 20px; color: #999; font-size: 14px;">
                ⭐⭐⭐⭐⭐ 4.9/5 stars from 2,847 happy customers
            </div>
        </div>
        
        <div style="background-color: #333; color: #999; padding: 30px 20px; text-align: center; font-size: 14px;">
            <p>\${{company_name}} | <a href="#" style="color: #999;">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>`,
    textContent: `🚨 FLASH SALE ALERT - \${{discount}}% OFF EVERYTHING! 🚨

Don't miss out, \${{first_name}}!

⏰ Sale Ends In: \${{hours_left}} Hours

Featured Deal: \${{product_name}}
Was: $\{\{original_price\}\}
Now: $\{\{sale_price\}\} (Save $\{\{original_price - sale_price\}\})

This is our biggest discount of the year and these prices will never be offered again.

Claim Your Discount: [SHOP NOW]

⭐⭐⭐⭐⭐ 4.9/5 stars from 2,847 happy customers

\${{company_name}} | Unsubscribe`
  },

  // NEWSLETTER
  {
    id: 'weekly-newsletter',
    title: 'Weekly Newsletter',
    description: 'Clean newsletter template with multiple content sections',
    category: 'newsletter',
    icon: 'Newspaper',
    thumbnail: '/images/email-templates/newsletter.png',
    subject: '\${{newsletter_name}} - \${{edition_date}}',
    variables: ['newsletter_name', 'edition_date', 'featured_article_title', 'featured_article_excerpt', 'company_name'],
    tags: ['newsletter', 'content', 'weekly', 'updates'],
    metrics: {
      averageOpenRate: 42.1,
      averageClickRate: 8.9,
      averageConversionRate: 2.1
    },
    htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\${{newsletter_name}}</title>
    <style>
        body { font-family: Georgia, serif; margin: 0; padding: 0; background-color: #f5f5f5; line-height: 1.6; }
        .container { max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background-color: #2c3e50; color: white; padding: 30px 20px; text-align: center; }
        .newsletter-title { font-size: 28px; margin: 0 0 10px 0; font-weight: normal; }
        .edition-date { font-size: 14px; opacity: 0.8; }
        .content { padding: 0; }
        .featured-article { padding: 40px 30px; border-bottom: 1px solid #eee; }
        .article-title { color: #2c3e50; font-size: 24px; margin-bottom: 15px; font-weight: normal; }
        .article-meta { color: #7f8c8d; font-size: 14px; margin-bottom: 20px; }
        .article-excerpt { color: #34495e; font-size: 16px; margin-bottom: 25px; }
        .read-more { color: #3498db; text-decoration: none; font-weight: bold; }
        .section { padding: 30px; border-bottom: 1px solid #eee; }
        .section-title { color: #2c3e50; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .news-item { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #f1f1f1; }
        .news-item:last-child { border-bottom: none; margin-bottom: 0; }
        .news-title { color: #2c3e50; font-size: 16px; margin-bottom: 8px; }
        .news-summary { color: #7f8c8d; font-size: 14px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .stat-item { text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; }
        .stat-number { font-size: 32px; font-weight: bold; color: #3498db; display: block; }
        .stat-label { font-size: 14px; color: #7f8c8d; }
        .footer { background-color: #34495e; color: #bdc3c7; padding: 30px 20px; text-align: center; font-size: 14px; }
        .footer a { color: #3498db; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="newsletter-title">\${{newsletter_name}}</h1>
            <div class="edition-date">\${{edition_date}}</div>
        </div>
        
        <div class="content">
            <div class="featured-article">
                <h2 class="article-title">\${{featured_article_title}}</h2>
                <div class="article-meta">Featured Article • 5 min read</div>
                <p class="article-excerpt">\${{featured_article_excerpt}}</p>
                <a href="#" class="read-more">Read Full Article →</a>
            </div>
            
            <div class="section">
                <h3 class="section-title">This Week's Headlines</h3>
                
                <div class="news-item">
                    <h4 class="news-title">Industry Report: Email Marketing ROI Reaches All-Time High</h4>
                    <p class="news-summary">New research shows email marketing continues to deliver the highest ROI among digital channels, with an average return of $42 for every $1 spent.</p>
                </div>
                
                <div class="news-item">
                    <h4 class="news-title">5 AI Tools That Are Transforming Content Creation</h4>
                    <p class="news-summary">Discover the latest AI-powered tools that are helping marketers create better content faster, from copywriting assistants to design generators.</p>
                </div>
                
                <div class="news-item">
                    <h4 class="news-title">Case Study: How One Company Doubled Their Conversion Rate</h4>
                    <p class="news-summary">Learn the exact strategies and tactics used by TechCorp to achieve a 127% increase in conversions through email optimization.</p>
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">By The Numbers</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">2.4M</span>
                        <span class="stat-label">Emails Sent This Week</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">18.7%</span>
                        <span class="stat-label">Average Open Rate</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">Quick Tips</h3>
                <ul style="color: #34495e;">
                    <li><strong>Optimize for mobile:</strong> 68% of emails are opened on mobile devices</li>
                    <li><strong>Test subject lines:</strong> A/B test can improve open rates by 25%</li>
                    <li><strong>Personalize content:</strong> Personalized emails deliver 6x higher transaction rates</li>
                </ul>
            </div>
            
            <div class="section" style="border-bottom: none; text-align: center; background-color: #f8f9fa;">
                <p style="margin: 0; color: #7f8c8d; font-style: italic;">
                    "The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p>Thank you for reading \${{newsletter_name}}!</p>
            <p>
                <a href="#">Forward to a friend</a> • 
                <a href="#">View in browser</a> • 
                <a href="#">Unsubscribe</a>
            </p>
            <p>\${{company_name}} • 123 Business St, City, State 12345</p>
        </div>
    </div>
</body>
</html>`,
    textContent: `\${{newsletter_name}} - \${{edition_date}}

FEATURED ARTICLE
\${{featured_article_title}}
\${{featured_article_excerpt}}
Read more: [LINK]

THIS WEEK'S HEADLINES
• Industry Report: Email Marketing ROI Reaches All-Time High
• 5 AI Tools That Are Transforming Content Creation  
• Case Study: How One Company Doubled Their Conversion Rate

BY THE NUMBERS
• 2.4M Emails Sent This Week
• 18.7% Average Open Rate

QUICK TIPS
• Optimize for mobile: 68% of emails are opened on mobile devices
• Test subject lines: A/B test can improve open rates by 25%
• Personalize content: Personalized emails deliver 6x higher transaction rates

"The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb

\${{company_name}} | Forward to a friend | Unsubscribe`
  },

  // EVENT MARKETING
  {
    id: 'webinar-invite',
    title: 'Webinar Invitation',
    description: 'Professional webinar invitation with registration CTA',
    category: 'event',
    icon: 'Video',
    thumbnail: '/images/email-templates/webinar.png',
    subject: 'You\'re Invited: \${{webinar_title}} - \${{webinar_date}}',
    variables: ['first_name', 'webinar_title', 'webinar_date', 'webinar_time', 'host_name', 'company_name'],
    tags: ['webinar', 'event', 'invitation', 'live'],
    metrics: {
      averageOpenRate: 52.3,
      averageClickRate: 15.6,
      averageConversionRate: 12.8
    },
    htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webinar Invitation - \${{webinar_title}}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f0f2f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
        .webinar-badge { background-color: rgba(255,255,255,0.2); border-radius: 20px; padding: 8px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; display: inline-block; }
        .webinar-title { font-size: 32px; font-weight: bold; margin: 0 0 15px 0; line-height: 1.2; }
        .webinar-subtitle { font-size: 18px; opacity: 0.9; margin: 0; }
        .content { padding: 40px 30px; }
        .host-section { display: flex; align-items: center; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 12px; }
        .host-avatar { width: 60px; height: 60px; border-radius: 50%; margin-right: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; }
        .host-info h4 { margin: 0 0 5px 0; color: #2d3748; font-size: 18px; }
        .host-info p { margin: 0; color: #718096; font-size: 14px; }
        .event-details { background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; }
        .detail-item { margin: 20px 0; }
        .detail-label { color: #4a5568; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .detail-value { color: #2d3748; font-size: 20px; font-weight: bold; }
        .agenda { margin: 30px 0; }
        .agenda-item { display: flex; align-items: flex-start; margin-bottom: 20px; }
        .agenda-time { background-color: #667eea; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; margin-right: 15px; min-width: 80px; text-align: center; }
        .agenda-content h5 { margin: 0 0 5px 0; color: #2d3748; }
        .agenda-content p { margin: 0; color: #718096; font-size: 14px; }
        .cta-section { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; margin: 30px 0; border-radius: 12px; color: white; }
        .cta-button { display: inline-block; background-color: white; color: #667eea; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .benefits { margin: 30px 0; }
        .benefit-item { display: flex; align-items: center; margin-bottom: 15px; }
        .benefit-icon { width: 24px; height: 24px; background-color: #48bb78; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; margin-right: 15px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="webinar-badge">Live Webinar</div>
            <h1 class="webinar-title">\${{webinar_title}}</h1>
            <p class="webinar-subtitle">Join us for this exclusive training session</p>
        </div>
        
        <div class="content">
            <p style="font-size: 18px; color: #2d3748; margin-bottom: 30px;">
                Hi \${{first_name}},
            </p>
            
            <p style="color: #4a5568; line-height: 1.6;">
                You're invited to an exclusive live webinar that will transform how you approach your business. This isn't just another presentation - it's a comprehensive training session with actionable insights you can implement immediately.
            </p>
            
            <div class="host-section">
                <div class="host-avatar">\${{host_name[0]}}</div>
                <div class="host-info">
                    <h4>\${{host_name}}</h4>
                    <p>Expert Trainer & Business Strategist</p>
                </div>
            </div>
            
            <div class="event-details">
                <div class="detail-item">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">\${{webinar_date}}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Time</div>
                    <div class="detail-value">\${{webinar_time}}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Duration</div>
                    <div class="detail-value">60 Minutes + Q&A</div>
                </div>
            </div>
            
            <div class="agenda">
                <h3 style="color: #2d3748; margin-bottom: 25px;">What You'll Learn</h3>
                
                <div class="agenda-item">
                    <div class="agenda-time">15 MIN</div>
                    <div class="agenda-content">
                        <h5>The Framework</h5>
                        <p>Discover the 3-step system used by top performers</p>
                    </div>
                </div>
                
                <div class="agenda-item">
                    <div class="agenda-time">25 MIN</div>
                    <div class="agenda-content">
                        <h5>Live Implementation</h5>
                        <p>Watch as we apply the framework to real scenarios</p>
                    </div>
                </div>
                
                <div class="agenda-item">
                    <div class="agenda-time">20 MIN</div>
                    <div class="agenda-content">
                        <h5>Q&A Session</h5>
                        <p>Get your specific questions answered live</p>
                    </div>
                </div>
            </div>
            
            <div class="benefits">
                <h3 style="color: #2d3748; margin-bottom: 25px;">Why Attend?</h3>
                
                <div class="benefit-item">
                    <div class="benefit-icon">✓</div>
                    <p>Learn proven strategies that have generated millions in revenue</p>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">✓</div>
                    <p>Get your questions answered by an industry expert</p>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">✓</div>
                    <p>Network with like-minded professionals</p>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">✓</div>
                    <p>Receive exclusive bonus materials worth $297</p>
                </div>
            </div>
            
            <div class="cta-section">
                <h3 style="margin: 0 0 15px 0; font-size: 24px;">Reserve Your Seat</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">Limited spots available - this webinar typically fills up fast!</p>
                <a href="#" class="cta-button">Register Now - It's Free</a>
                <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.8;">You'll receive the Zoom link via email after registration</p>
            </div>
            
            <p style="color: #4a5568; font-style: italic; text-align: center; margin-top: 30px;">
                Can't make it live? No problem! All registrants will receive the replay within 24 hours.
            </p>
        </div>
        
        <div style="background-color: #2d3748; color: #a0aec0; padding: 30px 20px; text-align: center; font-size: 14px;">
            <p>\${{company_name}} | <a href="#" style="color: #a0aec0;">Unsubscribe</a> | <a href="#" style="color: #a0aec0;">Forward to a friend</a></p>
        </div>
    </div>
</body>
</html>`,
    textContent: `You're Invited: \${{webinar_title}}

Hi \${{first_name}},

You're invited to an exclusive live webinar that will transform how you approach your business.

WEBINAR DETAILS:
Date: \${{webinar_date}}
Time: \${{webinar_time}}
Duration: 60 Minutes + Q&A
Host: \${{host_name}}

WHAT YOU'LL LEARN:
• The 3-step framework used by top performers
• Live implementation with real scenarios  
• Get your specific questions answered

WHY ATTEND:
✓ Learn proven strategies that have generated millions in revenue
✓ Get your questions answered by an industry expert
✓ Network with like-minded professionals
✓ Receive exclusive bonus materials worth $297

Limited spots available - register now!

REGISTER HERE: [REGISTRATION LINK]

Can't make it live? All registrants receive the replay within 24 hours.

\${{company_name}} | Unsubscribe`
  }
];