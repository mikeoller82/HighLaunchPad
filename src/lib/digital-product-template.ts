
import type { Component } from './types';
import { defaultContent } from './default-content';

const digitalProduct: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'CourseKit' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 2, type: 'hero', content: { title: 'The Ultimate UI Kit for Online Courses', subtitle: 'A comprehensive design system and component library to help you build beautiful course platforms, faster.', cta: 'Get It Now - $99', ctaSecondary: 'Live Preview' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 3, type: 'image', content: { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=entropy&auto=format', alt: 'UI kit preview', hint: 'preview of a sleek online course dashboard' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 4, type: 'features', content: {
        title: 'Everything You Need to Launch',
        features: [
            { title: '100+ Components', description: 'Fully customizable and responsive components.' },
            { title: 'Dark & Light Mode', description: 'Easily switch between themes.' },
            { title: 'Lifetime Updates', description: 'Get access to all future updates for free.' },
        ]
    }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 5, type: 'testimonials', content: { title: 'What Designers Are Saying', testimonials: [
        { quote: 'This kit saved me weeks of work. The components are well-designed and easy to use.', author: 'UI/UX Designer' },
        { quote: 'A must-have for anyone building an educational platform. So comprehensive!', author: 'Startup Founder' },
    ]}, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 6, type: 'pricing', content: {
      title: 'Get Lifetime Access',
      tiers: [
        { title: 'Standard License', price: '$99', frequency: 'one-time', description: 'For personal and commercial projects.', features: ['1 User', 'All Components', 'Lifetime Updates'], cta: 'Buy Now' },
        { title: 'Extended License', price: '$299', frequency: 'one-time', description: 'For use in a product that is sold.', features: ['Unlimited Users', 'All Components', 'Lifetime Updates'], cta: 'Buy Now', featured: true },
      ]
    }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 7, type: 'faq', content: defaultContent.faq, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 8, type: 'footer', content: { ...defaultContent.footer, copyright: '© 2025 CourseKit. All rights reserved.' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } }
];
