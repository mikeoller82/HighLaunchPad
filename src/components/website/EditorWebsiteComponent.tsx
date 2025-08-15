import React from 'react';
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Component } from '@/lib/types';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';

// Theme-based styling system (same as original)
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
  }
};

/**
 * Editor-optimized component renderer with compact spacing
 * Reduces excessive padding/margins for better editor experience
 */
export function renderEditorWebsiteComponent(component: Component): React.ReactNode {
  const getThemeStyles = (theme: string = 'corporate') => {
    return themeStyles[theme as keyof typeof themeStyles] || themeStyles.corporate;
  };
  const theme = getThemeStyles(component?.design?.theme);
  const bgClass = component?.design?.backgroundColor || 'bg-white';
  const textClass = component?.design?.textColor || theme.text;

  // Defensive: always ensure content is an object
  const content = component?.content || {};

  switch (component.type) {
    case 'header':
      return (
        <header key={component.id} className={cn("shadow-sm border-b", bgClass)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
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
        <section key={component.id} className={cn("py-0", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h1 className={cn("text-3xl md:text-4xl font-bold mb-3", textClass)}>{content.title || 'Hero Title'}</h1>
              {content.subtitle && (
                <p className={cn("text-lg mb-4", theme.textMuted)}>{content.subtitle}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-4">
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
                <p className={cn("text-sm", theme.textMuted)}>{content.socialProof}</p>
              )}
            </div>
            {content.image && (
              <div className="flex-1 max-w-md">
                <ImageWithFallback
                  src={content.image}
                  alt={content.title || 'Hero image'}
                  className="w-full h-auto rounded-lg shadow-lg"
                  width={500}
                  height={400}
                />
              </div>
            )}
          </div>
        </section>
      );

    case 'features':
      return (
        <section key={component.id} className={cn("py-0", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {content.title && (
              <div className="text-center mb-6">
                <h2 className={cn("text-2xl md:text-3xl font-bold mb-3", textClass)}>{content.title}</h2>
                {content.subtitle && (
                  <p className={cn("text-lg", theme.textMuted)}>{content.subtitle}</p>
                )}
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(content.features) ? content.features : []).map((feature: any, index: number) => (
                <div key={index} className={cn("text-center p-4 rounded-lg", theme.accent)}>
                  {feature.icon && <div className="text-3xl mb-3">{feature.icon}</div>}
                  <h3 className={cn("text-lg font-semibold mb-2", textClass)}>{feature.title}</h3>
                  <p className={cn("text-sm", theme.textMuted)}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'testimonials':
      return (
        <section key={component.id} className={cn("py-0", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {content.title && (
              <div className="text-center mb-6">
                <h2 className={cn("text-2xl md:text-3xl font-bold mb-3", textClass)}>{content.title}</h2>
                {content.subtitle && (
                  <p className={cn("text-lg", theme.textMuted)}>{content.subtitle}</p>
                )}
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(content.testimonials) ? content.testimonials : []).map((testimonial: any, index: number) => (
                <div key={index} className={cn("p-4 rounded-lg border", theme.accent)}>
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className={cn("text-sm mb-3", textClass)}>&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center">
                    {testimonial.image && (
                      <ImageWithFallback
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full mr-3"
                        width={40}
                        height={40}
                      />
                    )}
                    <div>
                      <p className={cn("font-semibold text-sm", textClass)}>{testimonial.name}</p>
                      <p className={cn("text-xs", theme.textMuted)}>{testimonial.title}</p>
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
        <section key={component.id} className={cn("py-0", bgClass)}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-3", textClass)}>{content.title || 'Call to Action'}</h2>
            {content.subtitle && (
              <p className={cn("text-lg mb-4", theme.textMuted)}>{content.subtitle}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {content.primaryCta && (
                <Button size="lg" className={cn("text-white", theme.primary)}>
                  {content.primaryCta}
                </Button>
              )}
              {content.secondaryCta && (
                <Button size="lg" variant="outline" className={cn("border-current", textClass)}>
                  {content.secondaryCta}
                </Button>
              )}
            </div>
          </div>
        </section>
      );

    case 'about':
      return (
        <section key={component.id} className={cn("py-0", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {content.image && (
                <div className="flex-1 max-w-md">
                  <ImageWithFallback
                    src={content.image}
                    alt={content.title || 'About image'}
                    className="w-full h-auto rounded-lg shadow-lg"
                    width={500}
                    height={400}
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className={cn("text-2xl md:text-3xl font-bold mb-3", textClass)}>{content.title || 'About Us'}</h2>
                {content.subtitle && (
                  <p className={cn("text-lg mb-4", theme.textMuted)}>{content.subtitle}</p>
                )}
                {content.description && (
                  <p className={cn("text-base mb-4", textClass)}>{content.description}</p>
                )}
                {content.cta && (
                  <Button className={cn("text-white", theme.primary)}>
                    {typeof content.cta === 'string' ? content.cta : content.cta?.primary || 'Learn More'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      );

    case 'footer':
      return (
        <footer key={component.id} className={cn("py-6 border-t", bgClass)}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className={cn("text-lg font-bold", textClass)}>{content.title || 'Company Name'}</h3>
                {content.description && (
                  <p className={cn("text-sm", theme.textMuted)}>{content.description}</p>
                )}
              </div>
              <div className="flex space-x-6">
                {(Array.isArray(content.links) ? content.links : []).map((link: any, index: number) => (
                  <a key={index} href={link.href} className={cn("text-sm hover:opacity-80 transition-opacity", textClass)}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className={cn("text-xs", theme.textMuted)}>
                {content.copyright || `© ${new Date().getFullYear()} All rights reserved.`}
              </p>
            </div>
          </div>
        </footer>
      );

    default:
      return (
        <div key={component.id} className={cn("py-0 px-4", bgClass)}>
          <div className="max-w-6xl mx-auto">
            <p className={cn("text-center", textClass)}>
              Component type &quot;{component.type}&quot; not implemented
            </p>
          </div>
        </div>
      );
  }
}