// Dynamic routing system for funnel templates
// Replaces placeholder links with real, contextual routes

export interface RouteConfig {
  baseUrl?: string;
  templateId?: string;
  userId?: string;
  trackingParams?: Record<string, string>;
}

export interface RouteContext {
  templateId: string;
  componentId: number;
  action: string;
  metadata?: Record<string, any>;
}

// Route generators for different funnel actions
export class FunnelRouter {
  private config: RouteConfig;

  constructor(config: RouteConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || '',
      templateId: config.templateId || '',
      userId: config.userId || '',
      trackingParams: config.trackingParams || {}
    };
  }

  // Core routing methods
  generateRoute(action: string, context?: Partial<RouteContext>): string {
    const routes: Record<string, (ctx?: Partial<RouteContext>) => string> = {
      // Lead capture routes
      'quiz': () => `/funnel/${this.config.templateId}/quiz${this.buildQueryParams()}`,
      'register': () => `/funnel/${this.config.templateId}/register${this.buildQueryParams()}`,
      'waitlist': () => `/funnel/${this.config.templateId}/waitlist${this.buildQueryParams()}`,
      'application': () => `/funnel/${this.config.templateId}/application${this.buildQueryParams()}`,
      
      // Purchase routes
      'purchase': () => `/checkout/${this.config.templateId}${this.buildQueryParams()}`,
      'buy-now': () => `/checkout/${this.config.templateId}/instant${this.buildQueryParams()}`,
      'order': () => `/checkout/${this.config.templateId}/order${this.buildQueryParams()}`,
      
      // Content routes  
      'demo': () => `/demo/${this.config.templateId}${this.buildQueryParams()}`,
      'webinar': () => `/webinar/${this.config.templateId}${this.buildQueryParams()}`,
      'preview': () => `/preview/${this.config.templateId}${this.buildQueryParams()}`,
      
      // Navigation routes
      'features': () => `/funnel/${this.config.templateId}#features`,
      'pricing': () => `/funnel/${this.config.templateId}#pricing`,
      'testimonials': () => `/funnel/${this.config.templateId}#testimonials`,
      'faq': () => `/funnel/${this.config.templateId}#faq`,
      'about': () => `/funnel/${this.config.templateId}#about`,
      'process': () => `/funnel/${this.config.templateId}#process`,
      'bonuses': () => `/funnel/${this.config.templateId}#bonuses`,
      'guarantee': () => `/funnel/${this.config.templateId}#guarantee`,
      
      // Trial and signup routes
      'trial': () => `/trial/${this.config.templateId}${this.buildQueryParams()}`,
      'signup': () => `/signup/${this.config.templateId}${this.buildQueryParams()}`,
      'subscribe': () => `/subscribe/${this.config.templateId}${this.buildQueryParams()}`,
      
      // Legal and support routes
      'privacy': () => '/legal/privacy',
      'terms': () => '/legal/terms',
      'contact': () => '/contact',
      'support': () => '/support',
      
      // Social media routes (configurable)
      'facebook': () => this.getSocialUrl('facebook'),
      'instagram': () => this.getSocialUrl('instagram'),
      'linkedin': () => this.getSocialUrl('linkedin'),
      'twitter': () => this.getSocialUrl('twitter'),
    };

    const routeGenerator = routes[action];
    if (!routeGenerator) {
      console.warn(`Unknown route action: ${action}. Returning placeholder.`);
      return `#${action}`;
    }

    return routeGenerator(context);
  }

  // Industry-specific route customization
  generateIndustryRoute(industry: string, action: string): string {
    const industryRoutes: Record<string, Record<string, string>> = {
      healthcare: {
        'consultation': `/healthcare/consultation/${this.config.templateId}`,
        'appointment': `/healthcare/book-appointment/${this.config.templateId}`,
        'assessment': `/healthcare/health-assessment/${this.config.templateId}`
      },
      finance: {
        'consultation': `/finance/consultation/${this.config.templateId}`,
        'calculator': `/finance/calculator/${this.config.templateId}`,
        'quote': `/finance/quote/${this.config.templateId}`
      },
      realestate: {
        'valuation': `/realestate/valuation/${this.config.templateId}`,
        'consultation': `/realestate/consultation/${this.config.templateId}`,
        'listing': `/realestate/list-property/${this.config.templateId}`
      },
      education: {
        'enroll': `/education/enroll/${this.config.templateId}`,
        'course': `/education/course/${this.config.templateId}`,
        'assessment': `/education/assessment/${this.config.templateId}`
      }
    };

    const industryMap = industryRoutes[industry];
    if (industryMap && industryMap[action]) {
      return industryMap[action] + this.buildQueryParams();
    }

    // Fallback to standard route
    return this.generateRoute(action);
  }

  // Build query parameters for tracking
  private buildQueryParams(): string {
    const params = new URLSearchParams();
    
    // Add tracking parameters
    if (this.config.userId) {
      params.set('uid', this.config.userId);
    }
    
    if (this.config.templateId) {
      params.set('template', this.config.templateId);
    }

    // Add custom tracking parameters
    Object.entries(this.config.trackingParams || {}).forEach(([key, value]) => {
      params.set(key, value);
    });

    // Add timestamp for unique tracking
    params.set('t', Date.now().toString());

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  // Get social media URLs (configurable)
  private getSocialUrl(platform: string): string {
    const socialUrls: Record<string, string> = {
      facebook: 'https://facebook.com/yourpage',
      instagram: 'https://instagram.com/yourpage', 
      linkedin: 'https://linkedin.com/company/yourcompany',
      twitter: 'https://twitter.com/yourhandle'
    };

    return socialUrls[platform] || '#';
  }

  // Update configuration
  updateConfig(newConfig: Partial<RouteConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Utility function to replace placeholder links in components
export function replaceTemplatePlaceholders(
  components: any[], 
  templateId: string, 
  routeConfig?: RouteConfig
): any[] {
  const router = new FunnelRouter({
    templateId,
    ...routeConfig
  });

  return components.map(component => {
    const updatedComponent = { ...component };
    
    // Update content URLs
    if (updatedComponent.content) {
      updatedComponent.content = replacePlaceholdersInObject(
        updatedComponent.content, 
        router
      );
    }

    return updatedComponent;
  });
}

// Recursively replace placeholders in nested objects
function replacePlaceholdersInObject(obj: any, router: FunnelRouter): any {
  if (typeof obj === 'string') {
    return replacePlaceholderUrl(obj, router);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => replacePlaceholdersInObject(item, router));
  }
  
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replacePlaceholdersInObject(value, router);
    }
    return result;
  }
  
  return obj;
}

// Replace individual placeholder URLs
function replacePlaceholderUrl(url: string, router: FunnelRouter): string {
  if (!url || !url.startsWith('#')) {
    return url;
  }

  const action = url.substring(1); // Remove the #
  return router.generateRoute(action);
}

// Export default router instance
export const defaultRouter = new FunnelRouter();

// Route validation utility
export function validateRoute(route: string): boolean {
  try {
    new URL(route, 'https://example.com');
    return true;
  } catch {
    return route.startsWith('/') || route.startsWith('#');
  }
}