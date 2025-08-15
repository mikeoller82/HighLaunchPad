/**
 * Test Suite for Website Functionality System
 * 
 * Tests the complete website functionality system including navigation,
 * content management, e-commerce, user accounts, and SEO optimization.
 */

import { 
  WebsiteFunctionalitySystemImpl,
  type SiteStructure,
  type Product,
  type UserType,
  type SitePage,
  type NavigationConfig,
  type FooterConfig,
  type SitemapConfig
} from './website-functionality-system';
import type { Template } from '../website-templates';

/**
 * Test Website Functionality System
 */
export async function testWebsiteFunctionalitySystem(): Promise<void> {
  console.log('🧪 Testing Website Functionality System...');

  const system = new WebsiteFunctionalitySystemImpl();

  try {
    // Test 1: Navigation System
    await testNavigationSystem(system);
    
    // Test 2: Content Management System
    await testContentManagementSystem(system);
    
    // Test 3: E-commerce System
    await testEcommerceSystem(system);
    
    // Test 4: User Account System
    await testUserAccountSystem(system);
    
    // Test 5: SEO Optimization
    await testSEOOptimization(system);

    console.log('✅ All Website Functionality System tests passed!');
  } catch (error) {
    console.error('❌ Website Functionality System test failed:', error);
    throw error;
  }
}

/**
 * Test Navigation System Creation
 */
async function testNavigationSystem(system: WebsiteFunctionalitySystemImpl): Promise<void> {
  console.log('  Testing Navigation System...');

  const siteStructure: SiteStructure = {
    id: 'test-site',
    name: 'Test Website',
    pages: [
      {
        id: 'home',
        title: 'Home',
        slug: 'home',
        path: '/',
        template: 'home',
        content: { blocks: [], metadata: { author: 'test', createdAt: new Date(), updatedAt: new Date(), version: 1, tags: [], categories: [] }, settings: { layout: 'default', theme: 'light' } },
        seo: { title: 'Home', description: 'Home page', keywords: [], slug: 'home' },
        access: { userTypes: [], roles: [], permissions: [] },
        status: 'published'
      },
      {
        id: 'about',
        title: 'About',
        slug: 'about',
        path: '/about',
        template: 'page',
        content: { blocks: [], metadata: { author: 'test', createdAt: new Date(), updatedAt: new Date(), version: 1, tags: [], categories: [] }, settings: { layout: 'default', theme: 'light' } },
        seo: { title: 'About', description: 'About page', keywords: [], slug: 'about' },
        access: { userTypes: [], roles: [], permissions: [] },
        status: 'published'
      }
    ],
    navigation: {
      type: 'horizontal',
      style: 'modern',
      items: [
        { id: 'nav-home', label: 'Home', url: '/', type: 'page', order: 1 },
        { id: 'nav-about', label: 'About', url: '/about', type: 'page', order: 2 }
      ],
      settings: {
        sticky: true,
        responsive: true,
        searchEnabled: true,
        breadcrumbs: true,
        mobileMenu: 'hamburger',
        animations: true
      }
    },
    footer: {
      layout: 'multi_column',
      sections: [
        { id: 'links', title: 'Quick Links', links: [{ label: 'Home', url: '/', external: false }], order: 1 }
      ],
      social: [{ platform: 'twitter', url: 'https://twitter.com/test', icon: 'twitter' }],
      legal: [{ type: 'privacy', url: '/privacy', required: true }],
      newsletter: true,
      contact: { email: 'test@example.com' }
    },
    sitemap: {
      enabled: true,
      includeImages: true,
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: new Date()
    }
  };

  const result = await system.createNavigationSystem(siteStructure);

  if (!result.success) {
    throw new Error(`Navigation system creation failed: ${result.errors.map(e => e.message).join(', ')}`);
  }

  if (!result.data) {
    throw new Error('Navigation system data is missing');
  }

  // Verify navigation system structure
  if (result.data.id !== `nav_${siteStructure.id}`) {
    throw new Error('Navigation system ID mismatch');
  }

  if (result.data.structure !== siteStructure) {
    throw new Error('Navigation system structure mismatch');
  }

  console.log('    ✅ Navigation system created successfully');
}

/**
 * Test Content Management System
 */
async function testContentManagementSystem(system: WebsiteFunctionalitySystemImpl): Promise<void> {
  console.log('  Testing Content Management System...');

  const pages: any[] = [
    {
      id: 'page1',
      title: 'Test Page',
      content: { blocks: [], metadata: { author: 'test', createdAt: new Date(), updatedAt: new Date(), version: 1, tags: [], categories: [] }, settings: { layout: 'default', theme: 'light' } }
    }
  ];

  const result = await system.implementContentManagement(pages);

  if (!result.success) {
    throw new Error(`CMS creation failed: ${result.errors.map(e => e.message).join(', ')}`);
  }

  if (!result.data) {
    throw new Error('CMS data is missing');
  }

  // Verify CMS structure
  if (!result.data.editor) {
    throw new Error('CMS editor is missing');
  }

  if (!result.data.media) {
    throw new Error('CMS media manager is missing');
  }

  if (!result.data.workflow) {
    throw new Error('CMS workflow manager is missing');
  }

  if (!result.data.versioning) {
    throw new Error('CMS versioning is missing');
  }

  console.log('    ✅ Content Management System created successfully');
}

/**
 * Test E-commerce System
 */
async function testEcommerceSystem(system: WebsiteFunctionalitySystemImpl): Promise<void> {
  console.log('  Testing E-commerce System...');

  const products: Product[] = [
    {
      id: 'product1',
      name: 'Test Product',
      description: 'A test product',
      sku: 'TEST001',
      price: {
        regular: 99.99,
        currency: 'USD',
        taxIncluded: false
      },
      images: [
        { id: 'img1', url: '/test-product.jpg', alt: 'Test Product', isPrimary: true, order: 1 }
      ],
      categories: ['test'],
      attributes: {},
      inventory: {
        trackQuantity: true,
        quantity: 100,
        allowBackorders: false,
        stockStatus: 'in_stock'
      },
      seo: {
        title: 'Test Product',
        description: 'A test product',
        slug: 'test-product'
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const result = await system.addEcommerceFeatures(products);

  if (!result.success) {
    throw new Error(`E-commerce system creation failed: ${result.errors.map(e => e.message).join(', ')}`);
  }

  if (!result.data) {
    throw new Error('E-commerce system data is missing');
  }

  // Verify e-commerce system structure
  if (!result.data.catalog) {
    throw new Error('Product catalog is missing');
  }

  if (!result.data.cart) {
    throw new Error('Shopping cart is missing');
  }

  if (!result.data.checkout) {
    throw new Error('Checkout process is missing');
  }

  if (result.data.catalog.products.length !== products.length) {
    throw new Error('Product catalog mismatch');
  }

  console.log('    ✅ E-commerce System created successfully');
}

/**
 * Test User Account System
 */
async function testUserAccountSystem(system: WebsiteFunctionalitySystemImpl): Promise<void> {
  console.log('  Testing User Account System...');

  const userTypes: UserType[] = [
    {
      id: 'basic',
      name: 'Basic User',
      description: 'Basic user account',
      permissions: [
        { id: 'read', name: 'Read Content', resource: 'content', action: 'read' }
      ],
      features: [
        { id: 'profile', name: 'User Profile', description: 'Basic profile', enabled: true }
      ],
      restrictions: []
    },
    {
      id: 'premium',
      name: 'Premium User',
      description: 'Premium user account',
      permissions: [
        { id: 'read', name: 'Read Content', resource: 'content', action: 'read' },
        { id: 'premium', name: 'Premium Content', resource: 'premium', action: 'read' }
      ],
      features: [
        { id: 'profile', name: 'User Profile', description: 'Enhanced profile', enabled: true },
        { id: 'premium_content', name: 'Premium Content', description: 'Access to premium content', enabled: true }
      ],
      restrictions: [],
      pricing: {
        type: 'subscription',
        price: 29.99,
        currency: 'USD',
        interval: 'monthly'
      }
    }
  ];

  const result = await system.createUserAccounts(userTypes);

  if (!result.success) {
    throw new Error(`User account system creation failed: ${result.errors.map(e => e.message).join(', ')}`);
  }

  if (!result.data) {
    throw new Error('User account system data is missing');
  }

  // Verify account system structure
  if (!result.data.authentication) {
    throw new Error('Authentication system is missing');
  }

  if (!result.data.authorization) {
    throw new Error('Authorization system is missing');
  }

  if (!result.data.profiles) {
    throw new Error('Profile system is missing');
  }

  if (!result.data.memberAreas) {
    throw new Error('Member areas system is missing');
  }

  if (result.data.userTypes.length !== userTypes.length) {
    throw new Error('User types mismatch');
  }

  console.log('    ✅ User Account System created successfully');
}

/**
 * Test SEO Optimization
 */
async function testSEOOptimization(system: WebsiteFunctionalitySystemImpl): Promise<void> {
  console.log('  Testing SEO Optimization...');

  const template: Template = {
    id: 'test-template',
    name: 'Test Template',
    description: 'A test template for SEO optimization',
    category: 'business',
    components: [],
    style: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#28a745',
        background: '#ffffff',
        text: '#212529'
      },
      fonts: {
        primary: 'Inter',
        secondary: 'Georgia'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '3rem'
      }
    },
    settings: {
      responsive: true,
      animations: true,
      darkMode: false
    },
    preview: '/preview.jpg',
    isPremium: false,
    tags: ['business', 'professional'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await system.implementSEOOptimization(template);

  if (!result.success) {
    throw new Error(`SEO optimization failed: ${result.errors.map(e => e.message).join(', ')}`);
  }

  if (!result.data) {
    throw new Error('SEO optimized template data is missing');
  }

  // Verify SEO optimization structure
  if (!result.data.seo) {
    throw new Error('SEO configuration is missing');
  }

  if (!result.data.schema) {
    throw new Error('Schema markup is missing');
  }

  if (!result.data.performance) {
    throw new Error('Performance optimization is missing');
  }

  if (!result.data.accessibility) {
    throw new Error('Accessibility optimization is missing');
  }

  // Verify SEO meta tags
  if (!result.data.seo.meta.title) {
    throw new Error('SEO meta title is missing');
  }

  if (!result.data.seo.meta.description) {
    throw new Error('SEO meta description is missing');
  }

  // Verify schema markup
  if (result.data.schema.length === 0) {
    throw new Error('Schema markup is empty');
  }

  // Verify performance optimizations
  if (!result.data.performance.images.lazyLoading) {
    throw new Error('Image lazy loading is not enabled');
  }

  if (!result.data.performance.css.minification) {
    throw new Error('CSS minification is not enabled');
  }

  // Verify accessibility features
  if (result.data.accessibility.wcag.level !== 'AA') {
    throw new Error('WCAG compliance level is not AA');
  }

  console.log('    ✅ SEO Optimization implemented successfully');
}

/**
 * Run the test suite
 */
if (require.main === module) {
  testWebsiteFunctionalitySystem()
    .then(() => {
      console.log('🎉 Website Functionality System test suite completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Website Functionality System test suite failed:', error);
      process.exit(1);
    });
}