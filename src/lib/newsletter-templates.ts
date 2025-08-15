
import type { Component } from './types';
import { defaultContent } from './default-content';

export interface NewsletterTemplate {
  id: string;
  title: string;
  description: string;
  image: string;
  hint: string;
  aiInsight: string;
  components: Component[];
}

const defaultNewsletter: Component[] = [
    { metadata: {}, id: 1, type: 'header', content: { ...defaultContent.header, title: 'Weekly Insights' } },
    { metadata: {}, id: 2, type: 'text', content: { text: '## This Week\'s Big Idea' } },
    { metadata: {}, id: 3, type: 'image', content: { ...defaultContent.image, alt: 'Newsletter banner image' } },
    { metadata: {}, id: 4, type: 'text', content: { text: 'Here\'s the main content of your newsletter. Keep it engaging and provide value to your readers.' } },
    { metadata: {}, id: 5, type: 'button', content: { ...defaultContent.button, text: 'Read More on the Blog' } },
    { metadata: {}, id: 6, type: 'socials', content: defaultContent.socials },
    { metadata: {}, id: 7, type: 'footer', content: defaultContent.footer },
];

const productLaunchNewsletter: Component[] = [
    { metadata: {}, id: 1, type: 'header', content: { ...defaultContent.header, title: 'ProductLaunch Co.' } },
    { metadata: {}, id: 2, type: 'hero', content: { title: 'It\'s Here! The Product You\'ve Been Waiting For', subtitle: 'Our biggest launch of the year is finally live.', cta: 'Shop Now & Get 20% Off'}},
    { metadata: {}, id: 3, type: 'countdown', content: defaultContent.countdown },
    { metadata: {}, id: 4, type: 'video', content: { ...defaultContent.video, title: 'See It In Action'} },
    { metadata: {}, id: 5, type: 'features', content: { title: 'Why You\'ll Love It', features: defaultContent.features.features }},
    { metadata: {}, id: 6, type: 'button', content: { ...defaultContent.button, text: 'Claim Your Launch Discount' } },
    { metadata: {}, id: 7, type: 'footer', content: defaultContent.footer },
];

const weeklyDigest: Component[] = [
    { metadata: {}, id: 1, type: 'header', content: { ...defaultContent.header, title: 'The Weekly Digest' } },
    { metadata: {}, id: 2, type: 'text', content: { text: '## Your Curated Insights for the Week' } },
    { metadata: {}, id: 3, type: 'text', content: { text: '### Top Story of the Week\n\A summary of the most important news or article from the past week goes here. Explain why it matters to your audience.' } },
    { metadata: {}, id: 4, type: 'button', content: { ...defaultContent.button, text: 'Read the Full Story' } },
    { metadata: {}, id: 5, type: 'text', content: { text: '### From the Blog\n\n- [Link to your first blog post](https://example.com)\n- [Link to your second blog post](https://example.com)' } },
    { metadata: {}, id: 6, type: 'optinForm', content: { ...defaultContent.optinForm, title: 'Share With a Friend!', description: 'Know someone who would love this newsletter? Share it with them.'} },
    { metadata: {}, id: 7, type: 'socials', content: defaultContent.socials },
    { metadata: {}, id: 8, type: 'footer', content: defaultContent.footer },
];


// Enhanced newsletter templates with all UI components
export const newsletterTemplates: NewsletterTemplate[] = [
  {
    id: 'default',
    title: 'Blank Newsletter',
    description: 'A clean, standard layout for a newsletter page, including text, image, and social links.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&crop=entropy&auto=format',
    hint: 'email newsletter design',
    aiInsight: 'Simple and effective layout. Perfect for any type of newsletter content with good engagement potential.',
    components: defaultNewsletter,
  },
  {
    id: 'product-launch',
    title: 'Product Launch Announcement',
    description: 'Build excitement and drive sales for a new product with a countdown and video.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=entropy&auto=format',
    hint: 'product launch confetti',
    aiInsight: 'High-converting launch template. The countdown and video elements create urgency and boost conversions.',
    components: productLaunchNewsletter,
  },
  {
    id: 'weekly-digest',
    title: 'Weekly Digest',
    description: 'Curate the best content for your audience with this clean, link-focused template.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&crop=entropy&auto=format',
    hint: 'news paper article',
    aiInsight: 'Excellent for content curation. The digest format keeps readers engaged and drives traffic to your content.',
    components: weeklyDigest,
  },
];

export const getNewsletterTemplateById = (id: string | undefined): NewsletterTemplate => {
  if (!id) return newsletterTemplates[0];
  return newsletterTemplates.find(t => t.id === id) || newsletterTemplates[0];
}
