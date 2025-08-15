import React from 'react';
import { Button } from "@/components/ui/button";
import { Star, Check, ChevronDown, Play } from "lucide-react";
import { Component } from '@/lib/types';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';

// Theme-based styling system
const themeStyles = {
  corporate: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    accent: 'bg-blue-50',
    text: 'text-gray-900',
    textMuted: 'text-blue-700'
  },
  modern: {
    primary: 'bg-purple-600 hover:bg-purple-700',
    secondary: 'bg-purple-100 hover:bg-purple-200 text-purple-900',
    accent: 'bg-purple-50',
    text: 'text-gray-900',
    textMuted: 'text-blue-700'
  },
  elegant: {
    primary: 'bg-slate-800 hover:bg-slate-900',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900',
    accent: 'bg-slate-50',
    text: 'text-slate-900',
    textMuted: 'text-blue-700'
  },
  energetic: {
    primary: 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600',
    secondary: 'bg-pink-100 hover:bg-pink-200 text-pink-900',
    accent: 'bg-pink-50',
    text: 'text-gray-900',
    textMuted: 'text-blue-700'
  },
  warm: {
    primary: 'bg-amber-600 hover:bg-amber-700',
    secondary: 'bg-amber-100 hover:bg-amber-200 text-amber-900',
    accent: 'bg-amber-50',
    text: 'text-amber-900',
    textMuted: 'text-amber-700'
  },
  luxury: {
    primary: 'bg-amber-600 hover:bg-amber-700',
    secondary: 'bg-amber-100 hover:bg-amber-200 text-amber-900',
    accent: 'bg-amber-50',
    text: 'text-amber-900',
    textMuted: 'text-amber-700'
  },
  nature: {
    primary: 'bg-emerald-600 hover:bg-emerald-700',
    secondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900',
    accent: 'bg-emerald-50',
    text: 'text-emerald-900',
    textMuted: 'text-emerald-700'
  },
  dark: {
    primary: 'bg-white hover:bg-gray-100 text-gray-900',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    accent: 'bg-slate-800',
    text: 'text-white',
    textMuted: 'text-gray-300'
  }
};

export function renderWebsiteComponent(component: Component, index?: number): React.ReactNode {
  const getThemeStyles = (theme: string = 'corporate') => {
    return themeStyles[theme as keyof typeof themeStyles] || themeStyles.corporate;
  };
  const theme = getThemeStyles(component?.design?.theme);
  const bgClass = component?.design?.backgroundColor || 'bg-white';
  const textClass = component?.design?.textColor || theme.text;

  // Defensive: always ensure content is an object
  const content = component?.content || {};

  // --- BEGIN COPY ---
  // Full switch/case logic from TemplatePreview.tsx's renderComponent
  switch (component.type) {
    case 'header':
      return (
        <header key={component.id} className={cn("shadow-sm border-b", bgClass)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className={cn("text-xl font-bold", textClass)}>{content.title || 'Logo'}</h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                {(Array.isArray(content.links) ? content.links : []).map((link: any, index: number) => (
                  <a key={index} href={link.href} className={cn("hover:opacity-80 transition-opacity", textClass)}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </header>
      );
    case 'hero':
      return (
        <section key={component.id} className={cn("py-20", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className={cn("text-4xl md:text-5xl font-bold mb-4", textClass)}>{content.title || 'Hero Title'}</h1>
              {content.subtitle && (
                <p className={cn("text-xl mb-6", theme.textMuted)}>{content.subtitle}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-6">
                {content.cta && (
                  <Button size="lg" className={cn("text-white", theme.primary)}>
                    {typeof content.cta === 'string' ? content.cta : content.cta?.primary}
                  </Button>
                )}
                {content.secondaryCta && (
                  <Button size="lg" variant="outline" className={cn("border-current", textClass)}>{content.secondaryCta}</Button>
                )}
              </div>
              {content.socialProof && (
                <div className={cn("text-sm font-semibold", theme.textMuted)}>{content.socialProof}</div>
              )}
              {Array.isArray(content.badges) && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  {content.badges.map((badge: any, idx: number) => (
                    <span key={idx} className={cn("px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800")}>{badge.label}</span>
                  ))}
                </div>
              )}
            </div>
            {content.image && (
              <div className="flex-1 flex justify-center">
                <ImageWithFallback src={content.image} alt="Hero" width={800} height={600} className="max-w-md rounded-lg shadow-lg" />
              </div>
            )}
          </div>
        </section>
      );
    case 'features':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>{content.title || 'Features'}</h2>
              {content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>{content.subtitle}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(Array.isArray(content.features) ? content.features : []).map((feature: any, idx: number) => (
                <div key={idx} className={cn("bg-white rounded-lg p-6 shadow-md", theme.accent)}>
                  <div className="mb-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-blue-100 text-blue-600")}>{feature.icon ? <span>{feature.icon}</span> : <Star />}</div>
                    <h3 className={cn("text-lg font-semibold mb-2", textClass)}>{feature.title || 'Feature Title'}</h3>
                  </div>
                  <p className={cn("text-sm", theme.textMuted)}>{feature.description || 'Feature description.'}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'pricing':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>{component.content.title || 'Pricing'}</h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>{component.content.subtitle}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(component.content.plans || []).map((plan: any, idx: number) => (
                <div key={idx} className={cn("rounded-lg p-6 shadow-md border", plan.featured ? theme.primary : theme.accent)}>
                  <h3 className={cn("text-xl font-semibold mb-2", textClass)}>{plan.name}</h3>
                  <div className={cn("text-3xl font-bold mb-2", textClass)}>{plan.price}<span className="text-base font-normal">{plan.frequency}</span></div>
                  <p className={cn("mb-4", theme.textMuted)}>{plan.description}</p>
                  <ul className="mb-4 space-y-2">
                    {(plan.features || []).map((feature: any, i: number) => (
                      <li key={i} className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />{typeof feature === 'string' ? feature : (feature?.text || feature?.title || 'Feature')}</li>
                    ))}
                  </ul>
                  {plan.badge && <div className="mb-2"><span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{plan.badge}</span></div>}
                  <Button className={cn("w-full", theme.primary)}>{plan.cta || 'Select'}</Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'stats':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>{component.content.title || 'Stats'}</h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>{component.content.subtitle}</p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(component.content.stats || []).map((stat: any, idx: number) => (
                <div key={idx} className={cn("rounded-lg p-6 shadow-md text-center", theme.accent)}>
                  <div className={cn("text-3xl font-bold mb-2", textClass)}>{stat.value}</div>
                  <div className={cn("text-sm font-semibold", theme.textMuted)}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'team':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>{component.content.title || 'Our Team'}</h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>{component.content.subtitle}</p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(component.content.members || []).map((member: any, idx: number) => (
                <div key={idx} className={cn("rounded-lg p-6 shadow-md text-center", theme.accent)}>
                  <ImageWithFallback
                    src={member.image || '/fallback-image.png'}
                    alt={member.name}
                    width={160}
                    height={160}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    fallbackSrc="/fallback-image.png"
                  />
                  <div className={cn("text-lg font-semibold", textClass)}>{member.name}</div>
                  <div className={cn("text-sm font-medium mb-2", theme.textMuted)}>{member.role}</div>
                  <div className={cn("text-xs", theme.textMuted)}>{member.bio}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'contact':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={cn("text-3xl font-bold mb-4", textClass)}>{component.content.title || 'Contact Us'}</h2>
            {component.content.description && <p className={cn("mb-6", theme.textMuted)}>{component.content.description}</p>}
            <Button className={cn("mb-4", theme.primary)}>
              {typeof component.content.cta === 'string' ? component.content.cta : component.content.cta?.primary || 'Contact'}
            </Button>
            <div className="mt-4 text-xs text-blue-500">(Form preview not interactive)</div>
          </div>
        </section>
      );
    case 'footer':
      return (
        <footer key={component.id} className={cn("py-8", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className={cn("text-lg font-bold", textClass)}>{component.content.title || 'Footer'}</div>
              {component.content.description && <div className={cn("text-sm", theme.textMuted)}>{component.content.description}</div>}
              {component.content.copyright && <div className={cn("text-xs mt-2", theme.textMuted)}>{component.content.copyright}</div>}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
              {(component.content.links || []).map((link: any, idx: number) => (
                <a key={idx} href={link.href} className={cn("text-sm hover:underline", textClass)}>{link.label}</a>
              ))}
            </div>
          </div>
        </footer>
      );

    case 'testimonials':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Testimonials'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {(component.content.testimonials || []).map((testimonial: any, index: number) => (
                <div key={index} className={cn("bg-white rounded-lg p-6 shadow-md", theme.accent)}>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className={cn("mb-4 italic", theme.textMuted)}>
                    &quot;{testimonial.quote || 'Great product, highly recommended!'}&quot;
                  </p>
                  <div className="flex items-center">
                    <div className={cn("w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white font-semibold", theme.primary)}>
                      {(testimonial.author || testimonial.name || 'C')[0]}
                    </div>
                    <div>
                      <p className={cn("font-semibold", textClass)}>{testimonial.author || testimonial.name || 'Customer Name'}</p>
                      <p className={cn("text-sm", theme.textMuted)}>{testimonial.role || 'Customer'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section key={component.id} className={cn("py-20", bgClass, textClass)}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              {component.content.title || 'Ready to Get Started?'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {component.content.subtitle || 'Join thousands of satisfied customers'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className={cn("text-white", theme.primary)}>
                {component.content.primaryCta || component.content.cta || 'Get Started'}
              </Button>
              {component.content.secondaryCta && (
                <Button size="lg" variant="outline" className={cn("border-current", textClass)}>
                  {component.content.secondaryCta}
                </Button>
              )}
            </div>
            {component.content.features && (
              <div className="flex flex-wrap justify-center gap-6 text-sm opacity-80">
                {component.content.features.map((feature: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    {typeof feature === 'string' ? feature : (feature?.title || 'Feature')}                     </div>
                ))}                </div>
            )}
          </div>
        </section>
      );

    case 'newsletter':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
              {component.content.title || 'Stay Updated'}
            </h2>
            {component.content.subtitle && (
              <p className={cn("text-xl mb-8", theme.textMuted)}>
                {component.content.subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-4">
              <input
                type="email"
                placeholder={component.content.placeholder || 'Enter your email'}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className={cn("text-white", theme.primary)}>
                {typeof component.content.cta === 'string' ? component.content.cta : component.content.cta?.primary || 'Subscribe'}
              </Button>
            </div>
            {component.content.privacy && (
              <p className={cn("text-sm", theme.textMuted)}>{component.content.privacy}</p>
            )}
          </div>
        </section>
      );

    case 'portfolio':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Our Work'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(component.content.projects || []).map((project: any, index: number) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                    <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Play className={cn("w-8 h-8", theme.textMuted)} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className={cn("text-xs font-semibold mb-1", theme.primary)}>{project.category}</div>
                    <h3 className={cn("text-lg font-semibold mb-2", textClass)}>{project.title}</h3>
                    <p className={cn("text-sm", theme.textMuted)}>{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'process':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Our Process'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(component.content.steps || []).map((step: any, index: number) => (
                <div key={index} className="text-center">
                  <div className={cn("inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold text-white mb-4", theme.primary)}>
                    {step.number || (index + 1).toString().padStart(2, '0')}
                  </div>
                  <h3 className={cn("text-xl font-semibold mb-2", textClass)}>{step.title || 'Step Title'}</h3>
                  <p className={cn(theme.textMuted)}>{step.description || 'Step description.'}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'brands':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Trusted by Leading Brands'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {(component.content.brands || []).map((brand: any, index: number) => (
                <div key={index} className="flex items-center justify-center">
                  <div className={cn("w-32 h-16 rounded-lg flex items-center justify-center text-sm font-semibold", theme.accent, theme.textMuted)}>
                    {brand.name || 'Brand Name'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'reviews':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'What Our Clients Say'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(component.content.reviews || []).map((review: any, index: number) => (
                <div key={index} className={cn("p-6 rounded-lg", theme.accent)}>
                  <div className="flex mb-4">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className={cn("mb-4 italic", theme.textMuted)}>&quot;{review.text || 'Great product, highly recommended!'}&quot;</p>
                  <div className="flex items-center">
                    <div className={cn("w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white font-semibold", theme.primary)}>
                      {(review.author || 'A')[0]}
                    </div>
                    <div>
                      <p className={cn("font-semibold", textClass)}>{review.author || 'Anonymous'}</p>
                      <p className={cn("text-sm", theme.textMuted)}>{review.company || 'Company'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'faq':
    case 'accordion':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Frequently Asked Questions'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="space-y-4">
              {(component.content.items || component.content.questions || []).map((item: any, index: number) => (
                <div key={index} className={cn("border rounded-lg", theme.accent, "border-gray-200")}>
                  <button className="w-full px-6 py-4 text-left flex items-center justify-between">
                    <h3 className={cn("text-lg font-semibold", textClass)}>
                      {item.question || 'Question'}
                    </h3>
                    <ChevronDown className={cn("w-5 h-5", theme.textMuted)} />
                  </button>
                  <div className="px-6 pb-4">
                    <p className={cn(theme.textMuted)}>
                      {item.answer || 'Answer to the question goes here.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'gallery':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Gallery'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(component.content.images || []).map((image: any, index: number) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={image.src || '/fallback-image.png'}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                    fallbackSrc="/fallback-image.png"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'metrics':
    case 'counter':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Our Impact'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(component.content.metrics || component.content.counters || []).map((metric: any, idx: number) => (
                <div key={idx} className={cn("rounded-lg p-6 shadow-md text-center", theme.accent)}>
                  <div className={cn("text-3xl font-bold mb-2", textClass)}>{metric.value}</div>
                  <div className={cn("text-sm font-semibold", theme.textMuted)}>{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'collections':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Collections'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(component.content.collections || []).map((collection: any, index: number) => (
                <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className={cn("text-2xl font-bold", theme.textMuted)}>{collection.name}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className={cn("text-white", theme.primary)}>View Collection</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'quiz':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Interactive Quiz'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl mb-8", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="space-y-8">
              {(component.content.questions || []).map((question: any, idx: number) => (
                <div key={idx} className={cn("bg-white rounded-lg p-6 shadow-md", theme.accent)}>
                  <h3 className={cn("text-lg font-semibold mb-4", textClass)}>
                    {question.question || `Question ${idx + 1}`}
                  </h3>
                  <div className="space-y-3">
                    {(question.options || []).map((option: string, optIdx: number) => (
                      <label key={optIdx} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          value={option}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          disabled
                        />
                        <span className={cn("text-sm", textClass)}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="text-center">
                <Button className={cn("px-8 py-3 text-white", theme.primary)}>
                  {typeof component.content.cta === 'string' ? component.content.cta : component.content.cta?.primary || 'Submit Quiz'}
                </Button>
                <div className="mt-4 text-xs text-blue-500">(Quiz preview not interactive)</div>
              </div>
            </div>
          </div>
        </section>
      );

    case 'text':
      return (
        <section key={component.id} className={cn("py-8", bgClass)}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={cn("prose prose-lg max-w-none", textClass)}
              style={{
                lineHeight: '1.7',
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{
                __html: component.content.text ? 
                  (() => {
                    let html = component.content.text
                      .replace(/\n\n/g, '</p><p class="mb-6">')
                      .replace(/\n/g, '<br>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                      .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900 border-b border-gray-200 pb-3">$1</h2>')
                      .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-semibold mt-10 mb-4 text-gray-800">$1</h3>')
                      .replace(/^#### (.*$)/gm, '<h4 class="text-xl font-medium mt-8 mb-3 text-gray-800">$1</h4>')
                      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mt-8 mb-8 text-gray-900">$1</h1>')
                      .replace(/^\- (.*$)/gm, '<li class="mb-2 ml-6 list-disc">$1</li>')
                      .replace(/^(\d+)\. (.*$)/gm, '<li class="mb-2 ml-6 list-decimal">$2</li>');
                    
                    // Ensure proper HTML structure to prevent Quirks Mode
                    if (!html.startsWith('<p') && !html.startsWith('<h') && !html.startsWith('<div')) {
                      html = `<p class="mb-6">${html}</p>`;
                    }
                    
                    // Fix any unclosed paragraph tags
                    if (html.includes('</p><p class="mb-6">') && !html.endsWith('</p>')) {
                      html += '</p>';
                    }
                    
                    return html;
                  })()
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline font-medium">$1</a>')
                    .replace(/^(<li.*<\/li>)$/gm, '<ul class="mb-6 space-y-2">$1</ul>')
                    .replace(/(<p class="mb-6">|^)([^<])/g, '<p class="mb-6 leading-relaxed">$2')
                  : '<p class="mb-6 leading-relaxed text-gray-500 italic">Add your text content here...</p>'
              }}
            />
          </div>
        </section>
      );

    case 'authorBox':
      return (
        <section key={component.id} className={cn("py-12", bgClass)}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={cn("bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100", theme.accent)}>
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={component.content.avatarSrc || '/images/default-avatar.jpg'}
                    alt={component.content.name || 'Author'}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    fallbackSrc="/images/default-avatar.jpg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <h3 className={cn("text-xl font-bold", textClass)}>
                      {component.content.name || 'Author Name'}
                    </h3>
                    <span className={cn("ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full")}>
                      Author
                    </span>
                  </div>
                  <p className={cn("text-base leading-relaxed mb-4", theme.textMuted)}>
                    {component.content.bio || 'Author bio and expertise description goes here.'}
                  </p>
                  {component.content.social && (
                    <div className="flex space-x-4">
                      {component.content.social.linkedin && (
                        <a href={component.content.social.linkedin} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          LinkedIn
                        </a>
                      )}
                      {component.content.social.twitter && (
                        <a href={component.content.social.twitter} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Twitter
                        </a>
                      )}
                      {component.content.social.email && (
                        <a href={`mailto:${component.content.social.email}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Email
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      );

    case 'countdown':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
              {component.content.title || 'Limited Time Offer'}
            </h2>
            {component.content.subtitle && (
              <p className={cn("text-xl mb-8", theme.textMuted)}>
                {component.content.subtitle}
              </p>
            )}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className={cn("text-3xl font-bold", textClass)}>00</div>
                  <div className={cn("text-sm", theme.textMuted)}>Days</div>
                </div>
                <div className="text-center">
                  <div className={cn("text-3xl font-bold", textClass)}>00</div>
                  <div className={cn("text-sm", theme.textMuted)}>Hours</div>
                </div>
                <div className="text-center">
                  <div className={cn("text-3xl font-bold", textClass)}>00</div>
                  <div className={cn("text-sm", theme.textMuted)}>Minutes</div>
                </div>
                <div className="text-center">
                  <div className={cn("text-3xl font-bold", textClass)}>00</div>
                  <div className={cn("text-sm", theme.textMuted)}>Seconds</div>
                </div>
              </div>
              {component.content.urgencyMessage && (
                <p className={cn("text-lg font-semibold mb-4", textClass)}>
                  {component.content.urgencyMessage}
                </p>
              )}
              {component.content.features && (
                <div className="space-y-2 mb-6">
                  {component.content.features.map((feature: any, index: number) => (
                    <div key={index} className={cn("text-sm", theme.textMuted)}>
                      {typeof feature === 'string' ? feature : feature.title || feature.description || feature}
                    </div>
                  ))}
                </div>
              )}
              <Button className={cn("text-white", theme.primary)}>
                {typeof component.content.cta === 'string' 
                  ? component.content.cta 
                  : component.content.cta?.primary || 'Act Now'}
              </Button>
            </div>
          </div>
        </section>
      );

    case 'guarantee':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={cn("text-3xl font-bold mb-8", textClass)}>
              {component.content.title || 'Our Guarantee'}
            </h2>
            {component.content.subtitle && (
              <p className={cn("text-xl mb-8", theme.textMuted)}>
                {component.content.subtitle}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {(component.content.guarantees || []).map((guarantee: any, index: number) => (
                <div key={index} className={cn("p-6 rounded-lg", theme.accent)}>
                  <div className={cn("w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center", theme.primary)}>
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={cn("text-lg font-semibold mb-2", textClass)}>
                    {guarantee.title || 'Guarantee'}
                  </h3>
                  <p className={cn("text-sm", theme.textMuted)}>
                    {guarantee.description || 'Guarantee description'}
                  </p>
                </div>
              ))}
            </div>
            {component.content.cta && (
              <Button className={cn("text-white", theme.primary)}>
                {typeof component.content.cta === 'string' 
                  ? component.content.cta 
                  : component.content.cta?.primary || 'Get Started'}
              </Button>
            )}
          </div>
        </section>
      );

    case 'media':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Featured In'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {(component.content.mediaFeatures || []).map((media: any, index: number) => (
                <div key={index} className="flex items-center justify-center">
                  <div className={cn("w-32 h-16 rounded-lg flex items-center justify-center text-sm font-semibold", theme.accent, theme.textMuted)}>
                    {media.name || 'Media Logo'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'about_coach':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className={cn("text-3xl font-bold mb-6", textClass)}>
                  {component.content.title || 'Meet Your Instructor'}
                </h2>
                <h3 className={cn("text-xl font-semibold mb-4", textClass)}>
                  {component.content.name || 'Instructor Name'}
                </h3>
                <p className={cn("text-lg mb-6", theme.textMuted)}>
                  {component.content.role || 'Expert & Instructor'}
                </p>
                <p className={cn("mb-6 leading-relaxed", theme.textMuted)}>
                  {component.content.bio || 'Instructor bio and expertise description goes here.'}
                </p>
                {component.content.credentials && (
                  <div className="space-y-2">
                    {component.content.credentials.map((credential: string, index: number) => (
                      <div key={index} className={cn("flex items-center", theme.textMuted)}>
                        <Check className="w-5 h-5 mr-2 text-green-500" />
                        {credential}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <ImageWithFallback
                  src={component.content.image || '/images/default-instructor.jpg'}
                  alt={component.content.name || 'Instructor'}
                  width={400}
                  height={400}
                  className="rounded-lg shadow-lg"
                  fallbackSrc="/images/default-instructor.jpg"
                />
              </div>
            </div>
          </div>
        </section>
      );

    case 'problem_agitation':
    case 'transformation_journey':
    case 'program_curriculum':
    case 'success_stories':
    case 'coach_authority':
    case 'application_process':
    case 'investment_breakdown':
      return (
        <section key={component.id} className={cn("py-16", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl font-bold mb-4", textClass)}>
                {component.content.title || 'Section Title'}
              </h2>
              {component.content.subtitle && (
                <p className={cn("text-xl", theme.textMuted)}>
                  {component.content.subtitle}
                </p>
              )}
            </div>
            <div className={cn("prose prose-lg max-w-none", textClass)}>
              <p className="text-center text-gray-600">
                This is a specialized coaching component ({component.type}). Content will be displayed based on the specific component type and configuration.
              </p>
              {component.content.description && (
                <p className="text-center mt-4">{component.content.description}</p>
              )}
            </div>
          </div>
        </section>
      );

    default:
      return (
        <div key={component.id} className={cn("py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg", bgClass)}>
          <p className={cn("text-center", theme.textMuted)}>
            Component type not supported: {component.type}
          </p>
        </div>
      );
  }
}