'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Check, ChevronDown, Users, DollarSign, Shield, Globe, Calendar, MapPin, Phone, Mail, Play, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Component } from '@/lib/types';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';
import type { TemplateContent, TemplateStyles, ButtonStyles, TemplateDesign, ComponentRendererProps } from '../../../types/template';

interface TemplateRendererProps {
  components: Component[];
  styles?: TemplateStyles;
  buttonStyles?: ButtonStyles;
  className?: string;
}

// Enhanced component renderers with full visual support
const HeaderRenderer = ({ content, styles, design }: ComponentRendererProps) => {
  const headerStyle = {
    backgroundColor: design?.backgroundColor || styles?.backgroundColor || '#ffffff',
    color: design?.textColor || styles?.textColor || '#000000',
    borderBottomColor: design?.border?.color || 'rgba(229, 231, 235, 0.8)',
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={headerStyle}
    >
      <div className="container flex h-16 items-center px-6" style={{ color: design?.textColor || styles?.textColor }}>
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold text-xl" style={{ color: design?.textColor || styles?.textColor }}>
              {content?.title || 'Brand'}
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {content?.links?.map((link, i: number) => (
              <a
                key={i}
                href={link.href}
                className="transition-colors hover:opacity-80"
                style={{ color: design?.textColor || styles?.textColor }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            {content?.cta && (
              <Button 
                className="text-white"
                style={{ 
                  backgroundColor: design?.accentColor || styles?.primaryColor || '#3b82f6',
                  color: '#ffffff'
                }}
              >
                {content.cta}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const HeroRenderer = ({ content, styles, buttonStyles, design }: ComponentRendererProps) => {
  const sectionStyle = {
    backgroundColor: design?.backgroundColor || styles?.backgroundColor,
    backgroundImage: design?.backgroundImage ? `url(${design.backgroundImage})` : undefined,
    backgroundSize: design?.backgroundSize || 'cover',
    backgroundPosition: design?.backgroundPosition || 'center',
    backgroundRepeat: design?.backgroundRepeat || 'no-repeat',
    color: design?.textColor || styles?.textColor,
  };

  return (
    <section 
      className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 relative"
      style={sectionStyle}
    >
      {/* Optional overlay for better text readability over background images */}
      {design?.backgroundImage && (
        <div className="absolute inset-0 bg-black/30 z-0"></div>
      )}
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center relative z-10">
        {/* Hero image with highest priority */}
        {content?.image && (
          <div className="mb-6">
            <ImageWithFallback
              src={content.image}
              alt={content?.imageAlt || 'Hero image'}
              width={800}
              height={400}
              priority={10} // Highest priority for hero images
              className="rounded-lg shadow-lg"
            />
          </div>
        )}
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl" style={{ color: design?.textColor || styles?.textColor }}>
          {content?.title || 'Welcome to Our Platform'}
        </h1>
        <p className="max-w-[42rem] leading-normal sm:text-xl sm:leading-8" style={{ color: design?.textColor || styles?.textColor || '#1e40af' }}>
          {content?.subtitle || 'Build amazing experiences with our powerful tools and features.'}
        </p>
        {content?.socialProof && (
          <p className="text-sm opacity-90" style={{ color: design?.textColor || styles?.textColor || '#1e40af' }}>
            {content.socialProof}
          </p>
        )}
        {content?.badges && (
          <div className="flex flex-wrap gap-2 justify-center">
            {content.badges.map((badge, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
        <div className="space-x-4">
          <Button
            size="lg"
            style={{
              backgroundColor: styles?.primaryColor,
              color: styles?.primaryColorForeground,
              borderRadius: `${buttonStyles?.borderRadius || 8}px`,
              boxShadow: buttonStyles?.shadow,
            }}
          >
            {typeof content?.cta === 'string' 
              ? content.cta 
              : content?.cta?.primary || 'Get Started'}
          </Button>
          {/* Show secondary CTA if it exists in the cta object */}
          {(content?.secondaryCta || (typeof content?.cta === 'object' && content?.cta?.secondary)) && (
            <Button variant="outline" size="lg">
              {content?.secondaryCta || content?.cta?.secondary}
            </Button>
          )}
          {/* Show note if it exists in the cta object */}
          {typeof content?.cta === 'object' && content?.cta?.note && (
            <p className="text-sm opacity-75 mt-2">{content.cta.note}</p>
          )}
        </div>
      </div>
    </section>
  );
};

const FeaturesRenderer = ({ content, styles, design }: ComponentRendererProps) => {
  const sectionStyle = {
    backgroundColor: design?.backgroundColor || styles?.backgroundColor || '#ffffff',
    color: design?.textColor || styles?.textColor || '#000000',
    padding: `${design?.padding?.top || 80}px 0 ${design?.padding?.bottom || 80}px 0`,
  };

  return (
    <section className="space-y-6" style={sectionStyle}>
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl" style={{ color: design?.textColor || styles?.textColor }}>
            {content?.title || 'Features'}
          </h2>
          <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7" style={{ color: design?.textColor || styles?.textColor, opacity: 0.8 }}>
            {content?.subtitle || 'Discover what makes our platform special.'}
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-12">
          {content?.features?.map((feature: any, i: number) => (
            <div 
              key={i} 
              className="relative overflow-hidden rounded-lg border p-6"
              style={{ 
                backgroundColor: design?.theme === 'dark' ? '#374151' : '#ffffff',
                borderColor: design?.theme === 'dark' ? '#4B5563' : '#e5e7eb',
                color: design?.textColor || styles?.textColor
              }}
            >
              <div className="space-y-3">
                {feature.icon && (
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: feature.color || design?.accentColor || '#3b82f6' }}>
                    <span className="text-white text-xl">⚡</span>
                  </div>
                )}
                <h3 className="font-bold text-lg" style={{ color: design?.textColor || styles?.textColor }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: design?.textColor || styles?.textColor, opacity: 0.8 }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsRenderer = ({ content, styles, design }: ComponentRendererProps) => {
  const sectionStyle = {
    backgroundColor: design?.backgroundColor || styles?.backgroundColor || '#ffffff',
    color: design?.textColor || styles?.textColor || '#000000',
    padding: `${design?.padding?.top || 80}px 0 ${design?.padding?.bottom || 80}px 0`,
  };

  return (
    <section className="space-y-6" style={sectionStyle}>
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl" style={{ color: design?.textColor || styles?.textColor }}>
            {content?.title || 'Testimonials'}
          </h2>
          <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7" style={{ color: design?.textColor || styles?.textColor, opacity: 0.8 }}>
            {content?.subtitle || 'What our customers say about us.'}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {content?.testimonials?.map((testimonial: any, i: number) => (
            <div 
              key={i} 
              className="flex flex-col p-6 rounded-lg border"
              style={{ 
                backgroundColor: design?.theme === 'dark' ? '#374151' : '#ffffff',
                borderColor: design?.theme === 'dark' ? '#4B5563' : '#e5e7eb',
                color: design?.textColor || styles?.textColor
              }}
            >
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating || 5)].map((_, j) => (
                  <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-lg leading-7 mb-6" style={{ color: design?.textColor || styles?.textColor }}>
                <p>&quot;{testimonial.quote || testimonial.content}&quot;</p>
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-x-4">
                {testimonial.image && (
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.author || testimonial.name || 'Testimonial author'}
                    width={48}
                    height={48}
                    priority={8 - i}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div className="text-sm leading-6">
                  <div className="font-semibold" style={{ color: design?.textColor || styles?.textColor }}>
                    {testimonial.author || testimonial.name}
                  </div>
                  <div className="mt-1" style={{ color: design?.textColor || styles?.textColor, opacity: 0.7 }}>
                    {testimonial.role}
                  </div>
                </div>
              </figcaption>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingRenderer = ({ content, styles, buttonStyles, design }: ComponentRendererProps) => {
  const sectionStyle = {
    backgroundColor: design?.backgroundColor || styles?.backgroundColor || '#ffffff',
    color: design?.textColor || styles?.textColor || '#000000',
    padding: `${design?.padding?.top || 80}px 0 ${design?.padding?.bottom || 80}px 0`,
  };

  return (
    <section className="space-y-6" style={sectionStyle}>
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl" style={{ color: design?.textColor || styles?.textColor }}>
            {content?.title || 'Pricing'}
          </h2>
          <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7" style={{ color: design?.textColor || styles?.textColor, opacity: 0.8 }}>
            {content?.subtitle || 'Choose the plan that works for you.'}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-3">
          {content?.plans?.map((plan: any, i: number) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl p-8 ring-1 sm:p-10 relative",
                plan.featured ? "ring-2 scale-105 z-10" : "ring-1"
              )}
              style={{
                backgroundColor: plan.featured 
                  ? (design?.accentColor || '#3b82f6')
                  : (design?.theme === 'dark' ? '#374151' : '#ffffff'),
                borderColor: plan.featured 
                  ? (design?.accentColor || '#3b82f6')
                  : (design?.theme === 'dark' ? '#4B5563' : '#e5e7eb'),
                color: plan.featured ? '#ffffff' : (design?.textColor || styles?.textColor)
              }}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold leading-7" style={{ color: plan.featured ? '#ffffff' : (design?.textColor || styles?.textColor) }}>
                {plan.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight" style={{ color: plan.featured ? '#ffffff' : (design?.textColor || styles?.textColor) }}>
                  {plan.price}
                </span>
                <span className="text-base opacity-80" style={{ color: plan.featured ? '#ffffff' : (design?.textColor || styles?.textColor) }}>
                  {plan.frequency || '/mo'}
                </span>
              </p>
              <p className="mt-4 text-sm opacity-80" style={{ color: plan.featured ? '#ffffff' : (design?.textColor || styles?.textColor) }}>
                {plan.description}
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6">
                {plan.features?.map((feature: any, j: number) => (
                  <li key={j} className="flex gap-x-3" style={{ color: plan.featured ? '#ffffff' : (design?.textColor || styles?.textColor) }}>
                    <Check className="h-5 w-5 flex-none text-green-500" />
                    {typeof feature === 'string' ? feature : (feature?.title || feature?.description || 'Feature')}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                style={{
                  backgroundColor: plan.featured ? '#ffffff' : (design?.accentColor || styles?.primaryColor || '#3b82f6'),
                  color: plan.featured ? (design?.backgroundColor || '#000000') : '#ffffff',
                  borderRadius: `${buttonStyles?.borderRadius || 8}px`,
                }}
              >
                {plan.cta || 'Get Started'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactRenderer = ({ content, styles }: ComponentRendererProps) => (
  <section className="container py-8 md:py-12 lg:py-24">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: styles?.textColor }}>
              {content?.title || 'Get in touch'}
            </h2>
            <p className="mt-4 leading-7 text-gray-700">
              {content?.subtitle || 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
            <div className="rounded-2xl bg-blue-50 p-10">
              <h3 className="text-base font-semibold leading-7 text-gray-900">Email us</h3>
              <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-700">
                <div>
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a className="font-semibold text-indigo-600" href={`mailto:${content?.email || 'hello@example.com'}`}>
                      {content?.email || 'hello@example.com'}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl bg-blue-50 p-10">
              <h3 className="text-base font-semibold leading-7 text-gray-900">Call us</h3>
              <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-700">
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a className="font-semibold text-indigo-600" href={`tel:${content?.phone || '+1 (555) 123-4567'}`}>
                      {content?.phone || '+1 (555) 123-4567'}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ImageRenderer = ({ content }: { content: any }) => (
  <section className="container py-8">
    <div className="relative aspect-video max-w-5xl mx-auto">
      <ImageWithFallback 
        src={content?.src || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'} 
        alt={content?.alt || 'Image'} 
        fill 
        priority={6} // Medium priority for standalone images
        className="object-cover rounded-lg shadow-lg" 
        data-ai-hint={content?.hint} 
      />
      {content?.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-lg">
          <p className="text-sm">{content.caption}</p>
        </div>
      )}
    </div>
  </section>
);

const VideoRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="container py-8">
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold mb-4" style={{ color: styles?.textColor }}>
        {content?.title || 'Video'}
      </h2>
      {content?.description && (
        <p className="text-gray-700">{content.description}</p>
      )}
    </div>
    <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden bg-black shadow-2xl">
      <iframe
        src={content?.embedUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
        title="Video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  </section>
);

const TextRenderer = ({ content, styles }: ComponentRendererProps) => {
  // Sanitize HTML content to ensure it doesn't contain incomplete HTML structures
  const sanitizeHtml = (html: string | undefined) => {
    if (!html) return 'Add your text content here...';
    
    try {
      // Replace line breaks with proper HTML breaks
      let sanitized = html.replace(/\n/g, '<br>');
      
      // Ensure no incomplete HTML tags that could trigger Quirks Mode
      sanitized = sanitized.replace(/<(?!\/?(br|p|div|span|strong|em|b|i|u|a|img)\b)[^>]*>/gi, '');
      
      return sanitized;
    } catch (error) {
      console.warn('Error sanitizing HTML:', error);
      return 'Add your text content here...';
    }
  };

  return (
    <section className="container py-8">
      <div className="max-w-4xl mx-auto prose prose-lg" style={{ color: styles?.textColor }}>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content?.text) }} />
      </div>
    </section>
  );
};

const FooterRenderer = ({ content, styles, design }: ComponentRendererProps) => {
  const footerStyle = {
    backgroundColor: design?.backgroundColor || styles?.backgroundColor || '#ffffff',
    color: design?.textColor || styles?.textColor || '#000000',
    borderTopColor: design?.border?.color || '#e5e7eb',
    padding: `${design?.padding?.top || 60}px 0 ${design?.padding?.bottom || 60}px 0`,
  };

  return (
    <footer className="border-t" style={footerStyle}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            <p className="text-center text-sm leading-loose md:text-left" style={{ color: design?.textColor || styles?.textColor }}>
              {content?.copyright || '© 2024 Your Company. All rights reserved.'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {content?.links?.map((link: any, i: number) => (
              <a
                key={i}
                href={link.href}
                className="text-sm hover:opacity-80 transition-opacity"
                style={{ color: design?.textColor || styles?.textColor }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// Add missing component renderers for SaaS dark template
const BrandsRenderer = ({ content, styles, design }: ComponentRendererProps) => {
  const sectionStyle = {
    backgroundColor: design?.backgroundColor || styles?.backgroundColor || '#ffffff',
    color: design?.textColor || styles?.textColor || '#000000',
    padding: `${design?.padding?.top || 60}px 0 ${design?.padding?.bottom || 80}px 0`,
  };

  return (
    <section className="space-y-6" style={sectionStyle}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: design?.textColor || styles?.textColor }}>
            {content?.title || 'Trusted by Leading Companies'}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
          {content?.brands?.map((brand: any, index: number) => (
            <div key={index} className="text-center">
              <div 
                className="h-12 flex items-center justify-center px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: design?.theme === 'dark' ? '#374151' : '#f8fafc',
                  color: design?.textColor || styles?.textColor
                }}
              >
                <span className="font-semibold text-sm">{brand.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsRenderer = ({ content, styles, design }: ComponentRendererProps) => {
  const sectionStyle = {
    backgroundColor: design?.backgroundColor || styles?.backgroundColor || '#ffffff',
    color: design?.textColor || styles?.textColor || '#000000',
    padding: `${design?.padding?.top || 60}px 0 ${design?.padding?.bottom || 60}px 0`,
  };

  return (
    <section className="space-y-6" style={sectionStyle}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {content?.stats?.map((stat: any, index: number) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: design?.accentColor || '#3b82f6' }}>
                {stat.value}
              </div>
              <div className="text-lg font-semibold mb-1" style={{ color: design?.textColor || styles?.textColor }}>
                {stat.label}
              </div>
              <div className="text-sm opacity-80" style={{ color: design?.textColor || styles?.textColor }}>
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQRenderer = ({ content, styles, design }: ComponentRendererProps) => {
  const sectionStyle = {
    backgroundColor: design?.backgroundColor || styles?.backgroundColor || '#ffffff',
    color: design?.textColor || styles?.textColor || '#000000',
    padding: `${design?.padding?.top || 80}px 0 ${design?.padding?.bottom || 80}px 0`,
  };

  return (
    <section className="space-y-6" style={sectionStyle}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: design?.textColor || styles?.textColor }}>
              {content?.title || 'Frequently Asked Questions'}
            </h2>
            <p className="text-lg opacity-80" style={{ color: design?.textColor || styles?.textColor }}>
              {content?.subtitle || 'Get answers to common questions.'}
            </p>
          </div>
          <div className="space-y-4">
            {content?.faqs?.map((faq: any, index: number) => (
              <div 
                key={index} 
                className="border rounded-lg p-6"
                style={{ 
                  backgroundColor: design?.theme === 'dark' ? '#374151' : '#ffffff',
                  borderColor: design?.theme === 'dark' ? '#4B5563' : '#e5e7eb'
                }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: design?.textColor || styles?.textColor }}>
                  {faq.question}
                </h3>
                <p className="opacity-80" style={{ color: design?.textColor || styles?.textColor }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTARenderer = ({ content, styles, buttonStyles, design }: ComponentRendererProps) => {
  const sectionStyle = {
    backgroundColor: design?.backgroundColor || styles?.backgroundColor || '#3b82f6',
    backgroundImage: design?.backgroundColor?.includes('gradient') ? design.backgroundColor : undefined,
    color: design?.textColor || styles?.textColor || '#ffffff',
    padding: `${design?.padding?.top || 80}px 0 ${design?.padding?.bottom || 80}px 0`,
  };

  return (
    <section className="space-y-6" style={sectionStyle}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: design?.textColor || styles?.textColor }}>
            {content?.title || 'Ready to Get Started?'}
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{ color: design?.textColor || styles?.textColor }}>
            {content?.subtitle || 'Join thousands of satisfied customers today.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-4"
              style={{
                backgroundColor: '#ffffff',
                color: design?.backgroundColor || '#3b82f6',
                borderRadius: `${buttonStyles?.borderRadius || 8}px`,
              }}
            >
              {content?.cta || 'Get Started Now'}
            </Button>
            {content?.secondaryCta && (
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4"
                style={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  borderRadius: `${buttonStyles?.borderRadius || 8}px`,
                }}
              >
                {content.secondaryCta}
              </Button>
            )}
          </div>
          {content?.guaranteeText && (
            <p className="mt-6 text-sm opacity-80" style={{ color: design?.textColor || styles?.textColor }}>
              {content.guaranteeText}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

// Component mapping
// Funnel-specific component renderers
const GuaranteeRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <Shield className="h-16 w-16 mx-auto mb-6 text-green-600" />
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Our Guarantee'}</h2>
        <p className="text-xl text-blue-600 mb-8">{content?.subtitle || 'We stand behind our work'}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content?.guarantees?.map((guarantee: any, index: number) => (
            <Card key={index} className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">{guarantee.title}</h3>
                <p className="text-gray-600 text-sm">{guarantee.description}</p>
              </div>
            </Card>
          ))}
        </div>
        {content?.guaranteeText && (
          <p className="mt-8 text-lg font-medium text-green-700">{content.guaranteeText}</p>
        )}
      </div>
    </div>
  </section>
);

const MediaRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Media Coverage'}</h2>
        <p className="text-xl text-gray-600">{content?.subtitle || 'Featured in leading publications'}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
        {content?.mediaFeatures?.map((media: any, index: number) => (
          <div key={index} className="text-center">
            <ImageWithFallback
              src={media.logo}
              alt={media.name}
              width={120}
              height={60}
              priority={Math.max(1, 4 - index)} // Lower priority for media logos
              className="mx-auto grayscale hover:grayscale-0 transition-all duration-300"
            />
            <p className="text-sm mt-2 font-medium">{media.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AboutRenderer = ({ content, styles }: ComponentRendererProps) => (
  <section className="py-16 bg-gray-50" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">{content?.title || 'About Us'}</h2>
          <p className="text-lg text-gray-600 mb-6">{content?.description}</p>
          {content?.credentials && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Credentials</h3>
              <ul className="space-y-2">
                {content.credentials.map((credential: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span>{credential}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative">
          {content?.image && (
            <ImageWithFallback
              src={content.image}
              alt="About"
              width={500}
              height={400}
              priority={7} // High priority for about images
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  </section>
);

const CaseStudiesRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Case Studies'}</h2>
        <p className="text-xl text-gray-600">{content?.subtitle || 'Real results from real clients'}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content?.caseStudies?.map((study: any, index: number) => (
          <Card key={index} className="overflow-hidden">
            {study.image && (
              <div className="relative h-48">
                <ImageWithFallback
                  src={study.image}
                  alt={study.title}
                  fill
                  priority={5 - index} // Higher priority for first case studies
                  className="object-cover"
                />
              </div>
            )}
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">{study.title}</h3>
              <p className="text-gray-600 mb-4">{study.description}</p>
              {study.results && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Results:</h4>
                  <ul className="text-sm space-y-1">
                    {study.results.map((result: string, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const ConsultationRenderer = ({ content, styles }: ComponentRendererProps) => (
  <section className="py-16 bg-blue-50" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Calendar className="h-16 w-16 mx-auto mb-6 text-blue-600" />
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Book a Consultation'}</h2>
        <p className="text-xl text-gray-600 mb-8">{content?.subtitle || 'Schedule your free consultation today'}</p>
        
        {content?.consultationType && (
          <div className="bg-white rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">{content.consultationType}</h3>
            <p className="text-gray-600">{content.consultationDescription}</p>
          </div>
        )}

        {content?.benefits && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {content.benefits.map((benefit: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">{benefit.title}</h4>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        )}

        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Schedule Free Consultation
        </Button>

        {content?.urgency && (
          <p className="mt-4 text-sm text-orange-600 font-medium">{content.urgency}</p>
        )}
      </div>
    </div>
  </section>
);

const DemoRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-gray-900 text-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <Play className="h-16 w-16 mx-auto mb-6 text-blue-400" />
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'See It In Action'}</h2>
        <p className="text-xl text-gray-300">{content?.subtitle || 'Watch our interactive demo'}</p>
      </div>

      {content?.demoSteps && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {content.demoSteps.map((step: any, index: number) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">{index + 1}</span>
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-300 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Play className="h-5 w-5 mr-2" />
          Start Interactive Demo
        </Button>
      </div>
    </div>
  </section>
);

const BeforeAfterRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-gradient-to-r from-red-50 to-green-50" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Before & After'}</h2>
        <p className="text-xl text-gray-600">{content?.subtitle || 'See the transformation'}</p>
      </div>

      {content?.transformations && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.transformations.map((transformation: any, index: number) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg">{transformation.title}</h3>
                  <p className="text-gray-600">{transformation.timeframe}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-700 mb-2">Before</h4>
                    <p className="text-2xl font-bold text-red-600">{transformation.before}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">After</h4>
                    <p className="text-2xl font-bold text-green-600">{transformation.after}</p>
                  </div>
                </div>

                {transformation.description && (
                  <p className="text-gray-600 text-sm mt-4 text-center">{transformation.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  </section>
);

// Additional funnel-specific component renderers
const AboutCoachRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">{content?.title || 'About Your Coach'}</h2>
          <p className="text-lg text-gray-600 mb-6">{content?.description}</p>
          {content?.achievements && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Achievements</h3>
              <ul className="space-y-2">
                {content.achievements.map((achievement: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative">
          {content?.image && (
            <ImageWithFallback
              src={content.image}
              alt="Coach"
              width={500}
              height={400}
              priority={8} // High priority for coach images
              className="rounded-lg shadow-lg"
            />
          )}
          {content?.coach?.image && (
            <ImageWithFallback
              src={content.coach.image}
              alt={content.coach.name || 'Coach'}
              width={500}
              height={400}
              priority={8} // High priority for coach images
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  </section>
);

const ApplicationRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-blue-50" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{content?.title || 'Apply Now'}</h2>
        <Card className="p-8">
          <form className="space-y-6">
            {content?.fields?.map((field: any, index: number) => (
              <div key={index}>
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea id={field.name} placeholder={field.placeholder} />
                ) : (
                  <Input id={field.name} type={field.type} placeholder={field.placeholder} />
                )}
              </div>
            ))}
            <Button className="w-full" size="lg">
              {content?.submitText || 'Submit Application'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  </section>
);

const CountdownRenderer = ({ content, styles }: ComponentRendererProps) => (
  <section className="py-8 bg-red-600 text-white">
    <div className="container mx-auto px-4 text-center">
      <h3 className="text-xl font-bold mb-4">{content?.title || 'Limited Time Offer'}</h3>
      <div className="flex justify-center space-x-4">
        <div className="bg-white text-red-600 p-4 rounded-lg">
          <div className="text-2xl font-bold">23</div>
          <div className="text-sm">Hours</div>
        </div>
        <div className="bg-white text-red-600 p-4 rounded-lg">
          <div className="text-2xl font-bold">59</div>
          <div className="text-sm">Minutes</div>
        </div>
        <div className="bg-white text-red-600 p-4 rounded-lg">
          <div className="text-2xl font-bold">45</div>
          <div className="text-sm">Seconds</div>
        </div>
      </div>
    </div>
  </section>
);

// Removed duplicate CtaRenderer - using the enhanced CTARenderer with dark theme support

// Removed duplicate FaqRenderer - using the enhanced FAQRenderer with dark theme support

// Removed duplicate StatsRenderer - using the enhanced version with dark theme support

const QuizRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{content?.title || 'Quick Quiz'}</h2>
        <Card className="p-8">
          <div className="space-y-6">
            {content?.questions?.map((question: any, index: number) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{question.question}</h3>
                <div className="space-y-2">
                  {question.options?.map((option: string, optIndex: number) => (
                    <Button key={optIndex} variant="outline" className="w-full justify-start">
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </section>
);

// Website-specific component renderers
const AccordionRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{content?.title || 'Frequently Asked Questions'}</h2>
        <div className="space-y-4">
          {content?.items?.map((item: any, index: number) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Removed duplicate BrandsRenderer - using the enhanced version with dark theme support

const CollectionsRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Our Collections'}</h2>
        <p className="text-xl text-gray-600">{content?.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content?.collections?.map((collection: any, index: number) => (
          <Card key={index} className="overflow-hidden">
            {collection.image && (
              <div className="relative h-48">
                <ImageWithFallback
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">{collection.title}</h3>
              <p className="text-gray-600 mb-4">{collection.description}</p>
              <Button variant="outline">View Collection</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const CounterRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-blue-600 text-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {content?.counters?.map((counter: any, index: number) => (
          <div key={index}>
            <div className="text-4xl font-bold mb-2">{counter.value}</div>
            <div className="text-blue-200">{counter.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const EmailRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-blue-50" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Stay Updated'}</h2>
        <p className="text-xl text-gray-600 mb-8">{content?.subtitle || 'Subscribe to our newsletter'}</p>
        <div className="flex gap-4">
          <Input placeholder="Enter your email" className="flex-1" />
          <Button>Subscribe</Button>
        </div>
      </div>
    </div>
  </section>
);

const GalleryRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Gallery'}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {content?.images?.map((image: any, index: number) => (
          <div key={index} className="relative aspect-square">
            <ImageWithFallback
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const MetricsRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-gray-900 text-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {content?.metrics?.map((metric: any, index: number) => (
          <div key={index}>
            <div className="text-4xl font-bold mb-2 text-blue-400">{metric.value}</div>
            <div className="text-xl font-semibold mb-2">{metric.label}</div>
            <div className="text-gray-400">{metric.description}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const NewsletterRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">{content?.title || 'Subscribe to Our Newsletter'}</h2>
      <p className="text-xl mb-8">{content?.subtitle || 'Get the latest updates and news'}</p>
      <div className="max-w-md mx-auto flex gap-4">
        <Input placeholder="Enter your email" className="flex-1 text-gray-900" />
        <Button className="bg-white text-blue-600 hover:bg-gray-100">Subscribe</Button>
      </div>
    </div>
  </section>
);

const PortfolioRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Our Portfolio'}</h2>
        <p className="text-xl text-gray-600">{content?.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content?.projects?.map((project: any, index: number) => (
          <Card key={index} className="overflow-hidden">
            {project.image && (
              <div className="relative h-48">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag: string, tagIndex: number) => (
                  <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const ProcessRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-gray-50" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Our Process'}</h2>
        <p className="text-xl text-gray-600">{content?.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {content?.steps?.map((step: any, index: number) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              {index + 1}
            </div>
            <h3 className="font-bold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ReviewsRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Customer Reviews'}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content?.reviews?.map((review: any, index: number) => (
          <Card key={index} className="p-6">
            <div className="flex mb-4">
              {[...Array(review.rating || 5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">&ldquo;{review.text}&rdquo;</p>
            <div className="font-semibold">{review.author}</div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const SocialProofRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-8 bg-blue-600 text-white">
    <div className="container mx-auto px-4 text-center">
      <div className="flex justify-center items-center space-x-8">
        <div>
          <div className="text-2xl font-bold">{content?.customers || '10,000+'}</div>
          <div className="text-blue-200">Happy Customers</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{content?.rating || '4.9'}</div>
          <div className="text-blue-200">Average Rating</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{content?.reviews || '500+'}</div>
          <div className="text-blue-200">Reviews</div>
        </div>
      </div>
    </div>
  </section>
);

const TeamRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-gray-50" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{content?.title || 'Our Team'}</h2>
        <p className="text-xl text-gray-600">{content?.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content?.members?.map((member: any, index: number) => (
          <Card key={index} className="text-center p-6">
            {member.image && (
              <div className="relative w-24 h-24 mx-auto mb-4">
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            )}
            <h3 className="font-bold text-lg mb-1">{member.name}</h3>
            <p className="text-gray-700 mb-2">{member.role}</p>
            <p className="text-gray-600 text-sm">{member.bio}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// Coaching-specific component renderers
const ProblemAgitationRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-red-50" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">{content.title || 'Are You Still Struggling With...?'}</h2>
      <p className="text-lg mb-8 opacity-90">{content.subtitle || 'It\'s not your fault, but it is your responsibility.'}</p>
      {content.problems && (
        <div className="max-w-2xl mx-auto mb-8">
          {content.problems.map((problem: any, i: number) => (
            <div key={i} className="flex items-center justify-center p-4 mb-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <span className="text-red-400 mr-3">✗</span>
              <span>{problem.text}</span>
            </div>
          ))}
        </div>
      )}
      {content.solution && (
        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg max-w-md mx-auto">
          <span className="text-green-400 mr-3">✓</span>
          <span className="font-semibold">{content.solution}</span>
        </div>
      )}
    </div>
  </section>
);

const ProgramCurriculumRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">{content.title || 'What\'s Inside the Program?'}</h2>
      <p className="text-lg mb-8 opacity-90">{content.subtitle || 'A comprehensive breakdown of what you will learn.'}</p>
      {content.modules && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {content.modules.map((module: any, i: number) => (
            <div key={i} className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold mb-3" style={{ color: styles?.primaryColor }}>
                {module.title}
              </h3>
              <p className="text-sm opacity-80">{module.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

const SuccessStoriesRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-gray-50" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">{content.title || 'Success Stories'}</h2>
      <p className="text-lg mb-8 opacity-90">{content.subtitle || 'See what our students have accomplished.'}</p>
      {content.stories && (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {content.stories.map((story: any, i: number) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow-md">
              <blockquote className="italic mb-4">&quot;{story.quote}&quot;</blockquote>
              <div className="text-sm">
                <p className="font-semibold">{story.author}</p>
                {story.result && (
                  <p className="text-green-600 mt-1">{story.result}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

const ProblemBreakdownRenderer = ({ content, styles }: { content: any, styles: any }) => (
  <section className="py-16 bg-white" style={{ color: styles?.textColor }}>
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">{content.title || 'The Real Problem Isn\'t What You Think'}</h2>
      <p className="text-lg mb-8 opacity-90">{content.subtitle || 'Let me break down what\'s really holding you back.'}</p>
      {content.problems && (
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {content.problems.map((problem: any, i: number) => (
            <div key={i} className="p-6 bg-gray-50 rounded-lg border">
              <div className="text-2xl mb-4">
                {problem.icon === 'warning' && '⚠️'}
                {problem.icon === 'target' && '🎯'}
                {problem.icon === 'eye-off' && '👁️‍🗨️'}
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: styles?.primaryColor }}>
                {problem.title}
              </h3>
              <p className="text-sm opacity-80">{problem.description}</p>
            </div>
          ))}
        </div>
      )}
      {content.solution && (
        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg max-w-2xl mx-auto">
          <span className="text-green-400 mr-3">✓</span>
          <span className="font-semibold text-lg">{content.solution}</span>
        </div>
      )}
    </div>
  </section>
);

const componentRenderers = {
  header: HeaderRenderer,
  hero: HeroRenderer,
  features: FeaturesRenderer,
  testimonials: TestimonialsRenderer,
  pricing: PricingRenderer,
  contact: ContactRenderer,
  image: ImageRenderer,
  video: VideoRenderer,
  text: TextRenderer,
  footer: FooterRenderer,
  // Funnel-specific components
  guarantee: GuaranteeRenderer,
  media: MediaRenderer,
  about: AboutRenderer,
  'case-studies': CaseStudiesRenderer,
  consultation: ConsultationRenderer,
  demo: DemoRenderer,
  'before-after': BeforeAfterRenderer,
  'about-coach': AboutCoachRenderer,
  application: ApplicationRenderer,
  countdown: CountdownRenderer,
  cta: CTARenderer,
  faq: FAQRenderer,
  stats: StatsRenderer,
  quiz: QuizRenderer,
  optinForm: EmailRenderer, // Or a dedicated Opt-in Form renderer if you have one
  // Website-specific components
  accordion: AccordionRenderer,
  brands: BrandsRenderer,
  collections: CollectionsRenderer,
  counter: CounterRenderer,
  email: EmailRenderer,
  gallery: GalleryRenderer,
  metrics: MetricsRenderer,
  newsletter: NewsletterRenderer,
  portfolio: PortfolioRenderer,
  process: ProcessRenderer,
  reviews: ReviewsRenderer,
  socialProof: SocialProofRenderer,
  team: TeamRenderer,
  // Coaching-specific components
  problem_agitation: ProblemAgitationRenderer,
  program_curriculum: ProgramCurriculumRenderer,
  success_stories: SuccessStoriesRenderer,
  problem_breakdown: ProblemBreakdownRenderer,
  // Additional aliases for common components
  'multi-choice': QuizRenderer,
  'single-choice': QuizRenderer,
  transformation: BeforeAfterRenderer,
  'program-details': FeaturesRenderer,
  split: HeroRenderer,
  full: HeroRenderer,
  // Animation/layout aliases that map to existing components
  fadeIn: TextRenderer,
  slideInLeft: TextRenderer,
  sticky: HeaderRenderer,
  select: EmailRenderer,
  textarea: ContactRenderer,
};

export function TemplateRenderer({ components, styles, buttonStyles, className }: TemplateRendererProps) {
  const defaultStyles = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    primaryColor: '#3b82f6',
    primaryColorForeground: '#ffffff',
    font: 'Inter, sans-serif',
    ...styles
  };

  const defaultButtonStyles = {
    borderRadius: 8,
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    ...buttonStyles
  };

  return (
    <div 
      className={cn("min-h-screen", className)}
      style={{ 
        backgroundColor: defaultStyles.backgroundColor, 
        fontFamily: defaultStyles.font 
      }}
    >
      {components && components.map((component) => {
        const Renderer = componentRenderers[component.type as keyof typeof componentRenderers];
        
        if (!Renderer) {
          return (
            <div key={component.id} className="p-4 border border-dashed border-gray-300 m-4 text-center text-gray-700">
              Unknown component type: {component.type}
            </div>
          );
        }

        return (
          <div key={component.id}>
            <Renderer 
              content={component.content} 
              styles={defaultStyles}
              buttonStyles={defaultButtonStyles}
              design={component.design}
            />
          </div>
        );
      })}
    </div>
  );
}