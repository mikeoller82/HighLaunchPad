
import type { Component } from './types';
import { defaultContent } from './default-content';

export interface BlogTemplate {
  id: string;
  title: string;
  description: string;
  image: string;
  hint: string;
  aiInsight: string;
  components: Component[];
}

const defaultBlogPost: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'My Awesome Blog' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 2, type: 'text', content: { text: '## Your Blog Post Title Goes Here' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 3, type: 'image', content: { ...defaultContent.image, alt: 'Blog post featured image' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 4, type: 'text', content: { text: 'Start writing your amazing blog post here. You can use Markdown for formatting, like **bold** text, *italics*, and [links](https://example.com).' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 5, type: 'cta', content: { ...defaultContent.cta, title: 'Ready to Start Writing?', subtitle: 'Join our community of writers and creators' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 6, type: 'newsletter', content: { ...defaultContent.newsletter, title: 'Get Writing Tips Weekly', subtitle: 'Improve your writing with our expert tips and insights' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 7, type: 'authorBox', content: defaultContent.authorBox, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 8, type: 'footer', content: defaultContent.footer, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
];

const howToGuidePost: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'Step-by-Step Guides' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 2, type: 'text', content: { text: '## How to Achieve [Awesome Outcome]' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 3, type: 'image', content: { ...defaultContent.image, alt: 'A diagram illustrating the process' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 4, type: 'text', content: { text: '### Step 1: The First Thing to Do\n\nExplain the first step in detail here. Provide context and why it is important.' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 5, type: 'text', content: { text: '### Step 2: The Next Critical Action\n\nNow, walk the user through the second step. Use bullet points for clarity if needed.\n- Point A\n- Point B' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 6, type: 'text', content: { text: '### Step 3: Finishing Up\n\nDescribe the final step and what the result should look like.' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 7, type: 'gallery', content: { ...defaultContent.gallery, title: 'Step-by-Step Visual Guide', description: 'See each step in action with our detailed screenshots' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 8, type: 'accordion', content: { ...defaultContent.accordion, title: 'Frequently Asked Questions', subtitle: 'Common questions about this process' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 9, type: 'authorBox', content: defaultContent.authorBox, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 10, type: 'footer', content: defaultContent.footer, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
];

const productReviewPost: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'Honest Reviews' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 2, type: 'text', content: { text: '## [Product Name]: An In-Depth Review' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 3, type: 'image', content: { ...defaultContent.image, alt: 'The product being reviewed' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 4, type: 'text', content: { text: 'I\'ve spent the last 3 weeks testing out [Product Name]. Here\'s my honest take on whether it\'s worth your money.' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 5, type: 'text', content: { text: '### What I Liked (Pros)\n\n- **Feature 1:** It does this one thing exceptionally well.\n- **Benefit 2:** This saved me a ton of time.\n- **Design:** The user interface is clean and intuitive.' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 6, type: 'text', content: { text: '### What I Disliked (Cons)\n\n- **Limitation 1:** It can be a bit slow on larger projects.\n- **Pricing:** The top-tier plan is quite expensive.' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 7, type: 'text', content: { text: '### The Verdict\n\nSo, should you buy it? If you\'re [Target Audience] looking to [Achieve specific goal], then absolutely. However, if [Alternative need], you might want to look elsewhere.' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 8, type: 'newsletter', content: { ...defaultContent.newsletter, title: 'Get More Reviews Like This', subtitle: 'Subscribe for weekly product reviews and recommendations' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 9, type: 'tabs', content: { ...defaultContent.tabs, title: 'Related Content', tabs: [{ id: 'reviews', label: 'More Reviews', content: 'Check out our other product reviews and comparisons' }, { id: 'guides', label: 'Buying Guides', content: 'Comprehensive guides to help you make informed decisions' }] }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 10, type: 'authorBox', content: defaultContent.authorBox, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 11, type: 'footer', content: defaultContent.footer, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
];

export const blogTemplates: BlogTemplate[] = [
    {
        id: 'default',
        title: 'Blank Post',
        description: 'Start with a standard blog post layout, including a header, text, image, and author box.',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop&crop=entropy&auto=format',
        hint: 'writing desk',
        aiInsight: 'Clean structure perfect for any topic. Add engaging headlines and compelling content.',
        components: defaultBlogPost,
    },
    {
        id: 'how-to-guide',
        title: 'How-To Guide',
        description: 'A structured template for writing step-by-step guides, complete with structured headings.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=entropy&auto=format',
        hint: 'instruction manual',
        aiInsight: 'Excellent for tutorials and guides. The step-by-step format increases engagement and completion rates.',
        components: howToGuidePost,
    },
    {
        id: 'product-review',
        title: 'Product Review',
        description: 'An SEO-optimized template for product reviews, including sections for pros, cons, and a final rating.',
        image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=600&fit=crop&crop=entropy&auto=format',
        hint: 'product analysis',
        aiInsight: 'Perfect for affiliate marketing. The pros/cons structure builds trust and drives conversions.',
        components: productReviewPost,
    }
];

export const getBlogTemplateById = (id: string | undefined): BlogTemplate => {
  if (!id) return blogTemplates[0];
  return blogTemplates.find(t => t.id === id) || blogTemplates[0];
};

    