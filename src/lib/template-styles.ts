// Professional color schemes and styling system for templates

export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    hero: string;
  };
}

export const colorSchemes: ColorScheme[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Professional and trustworthy, perfect for SaaS and tech companies.',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#111827',
      textMuted: '#374151',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      secondary: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  },
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    description: 'Sophisticated dark theme for luxury brands and premium services.',
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#F59E0B',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      secondary: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  },
  {
    id: 'warm-orange',
    name: 'Warm Energy',
    description: 'Energetic and friendly, great for creative agencies and lifestyle brands.',
    colors: {
      primary: '#EA580C',
      secondary: '#DC2626',
      accent: '#F59E0B',
      background: '#FFFBEB',
      surface: '#FEF3C7',
      text: '#78350F',
      textMuted: '#92400E',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #EA580C 0%, #DC2626 100%)',
      secondary: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
      hero: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  },
  {
    id: 'nature-green',
    name: 'Nature Fresh',
    description: 'Clean and organic, perfect for health, wellness, and eco-friendly brands.',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#D97706',
      background: '#F0FDF4',
      surface: '#DCFCE7',
      text: '#052E16',
      textMuted: '#064E3B',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      secondary: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
      hero: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    }
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Elegant and prestigious, ideal for high-end services and luxury products.',
    colors: {
      primary: '#B45309',
      secondary: '#92400E',
      accent: '#F59E0B',
      background: '#FEF7ED',
      surface: '#FED7AA',
      text: '#1C0701',
      textMuted: '#431407',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
      secondary: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
      hero: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'
    }
  },
  {
    id: 'corporate-navy',
    name: 'Corporate Navy',
    description: 'Professional and authoritative, perfect for consulting and financial services.',
    colors: {
      primary: '#1E3A8A',
      secondary: '#1E40AF',
      accent: '#F59E0B',
      background: '#F8FAFC',
      surface: '#E2E8F0',
      text: '#0F172A',
      textMuted: '#1E293B',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
      secondary: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
      hero: 'linear-gradient(135deg, #2980B9 0%, #6BB6FF 100%)'
    }
  }
];

export interface TypographyStyle {
  id: string;
  name: string;
  description: string;
  fonts: {
    heading: string;
    body: string;
    accent?: string;
  };
  sizes: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    body: string;
    small: string;
  };
  weights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export const typographyStyles: TypographyStyle[] = [
  {
    id: 'modern-sans',
    name: 'Modern Sans',
    description: 'Clean and professional, great for tech and business sites.',
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    },
    sizes: {
      h1: '3.5rem',
      h2: '2.5rem',
      h3: '2rem',
      h4: '1.5rem',
      body: '1rem',
      small: '0.875rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    description: 'Sophisticated and trustworthy, perfect for luxury and professional services.',
    fonts: {
      heading: 'Playfair Display, Georgia, serif',
      body: 'Source Serif Pro, Georgia, serif'
    },
    sizes: {
      h1: '3.75rem',
      h2: '2.75rem',
      h3: '2.25rem',
      h4: '1.75rem',
      body: '1.125rem',
      small: '1rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  {
    id: 'creative-mix',
    name: 'Creative Mix',
    description: 'Bold and creative, ideal for agencies and creative professionals.',
    fonts: {
      heading: 'Montserrat, system-ui, sans-serif',
      body: 'Open Sans, system-ui, sans-serif',
      accent: 'Poppins, system-ui, sans-serif'
    },
    sizes: {
      h1: '4rem',
      h2: '3rem',
      h3: '2.25rem',
      h4: '1.75rem',
      body: '1rem',
      small: '0.875rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  }
];

export interface LayoutStyle {
  id: string;
  name: string;
  description: string;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  maxWidth: string;
}

export const layoutStyles: LayoutStyle[] = [
  {
    id: 'modern-clean',
    name: 'Modern Clean',
    description: 'Spacious and minimal with subtle shadows.',
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '2rem',
      lg: '3rem',
      xl: '4rem',
      xxl: '6rem'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    maxWidth: '1200px'
  },
  {
    id: 'compact-efficient',
    name: 'Compact Efficient',
    description: 'Tighter spacing for information-dense layouts.',
    spacing: {
      xs: '0.25rem',
      sm: '0.75rem',
      md: '1.5rem',
      lg: '2.5rem',
      xl: '3.5rem',
      xxl: '5rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    maxWidth: '1140px'
  },
  {
    id: 'spacious-luxury',
    name: 'Spacious Luxury',
    description: 'Generous spacing for premium, high-end feel.',
    spacing: {
      xs: '0.75rem',
      sm: '1.5rem',
      md: '3rem',
      lg: '4rem',
      xl: '5rem',
      xxl: '8rem'
    },
    borderRadius: {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem'
    },
    shadows: {
      sm: '0 2px 4px 0 rgb(0 0 0 / 0.06)',
      md: '0 8px 12px -2px rgb(0 0 0 / 0.12)',
      lg: '0 16px 24px -4px rgb(0 0 0 / 0.12)',
      xl: '0 32px 48px -8px rgb(0 0 0 / 0.12)'
    },
    maxWidth: '1400px'
  }
];

// Template style combinations
export interface TemplateStyle {
  id: string;
  name: string;
  description: string;
  colorScheme: string;
  typography: string;
  layout: string;
  preview: string;
}

export const templateStyles: TemplateStyle[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Perfect for SaaS, startups, and technology companies.',
    colorScheme: 'modern-blue',
    typography: 'modern-sans',
    layout: 'modern-clean',
    preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
  },
  {
    id: 'luxury-premium',
    name: 'Luxury Premium',
    description: 'Elegant styling for high-end services and luxury brands.',
    colorScheme: 'luxury-gold',
    typography: 'elegant-serif',
    layout: 'spacious-luxury',
    preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43'
  },
  {
    id: 'creative-agency',
    name: 'Creative Agency',
    description: 'Bold and creative for design agencies and creative professionals.',
    colorScheme: 'warm-orange',
    typography: 'creative-mix',
    layout: 'modern-clean',
    preview: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f'
  },
  {
    id: 'corporate-professional',
    name: 'Corporate Professional',
    description: 'Authoritative and trustworthy for consulting and financial services.',
    colorScheme: 'corporate-navy',
    typography: 'modern-sans',
    layout: 'compact-efficient',
    preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43'
  },
  {
    id: 'nature-wellness',
    name: 'Nature Wellness',
    description: 'Fresh and organic for health, wellness, and eco-friendly brands.',
    colorScheme: 'nature-green',
    typography: 'modern-sans',
    layout: 'spacious-luxury',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
  },
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    description: 'Sophisticated dark theme for premium services and luxury brands.',
    colorScheme: 'dark-premium',
    typography: 'elegant-serif',
    layout: 'modern-clean',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176'
  }
];

// Helper functions
export function getColorScheme(id: string): ColorScheme | undefined {
  return colorSchemes.find(scheme => scheme.id === id);
}

export function getTypographyStyle(id: string): TypographyStyle | undefined {
  return typographyStyles.find(style => style.id === id);
}

export function getLayoutStyle(id: string): LayoutStyle | undefined {
  return layoutStyles.find(style => style.id === id);
}

export function getTemplateStyle(id: string): TemplateStyle | undefined {
  return templateStyles.find(style => style.id === id);
}

export function generateCSS(styleId: string): string {
  const style = getTemplateStyle(styleId);
  if (!style) return '';

  const colorScheme = getColorScheme(style.colorScheme);
  const typography = getTypographyStyle(style.typography);
  const layout = getLayoutStyle(style.layout);

  if (!colorScheme || !typography || !layout) return '';

  return `
    :root {
      /* Colors */
      --color-primary: ${colorScheme.colors.primary};
      --color-secondary: ${colorScheme.colors.secondary};
      --color-accent: ${colorScheme.colors.accent};
      --color-background: ${colorScheme.colors.background};
      --color-surface: ${colorScheme.colors.surface};
      --color-text: ${colorScheme.colors.text};
      --color-text-muted: ${colorScheme.colors.textMuted};
      --color-success: ${colorScheme.colors.success};
      --color-warning: ${colorScheme.colors.warning};
      --color-error: ${colorScheme.colors.error};

      /* Gradients */
      --gradient-primary: ${colorScheme.gradients.primary};
      --gradient-secondary: ${colorScheme.gradients.secondary};
      --gradient-hero: ${colorScheme.gradients.hero};

      /* Typography */
      --font-heading: ${typography.fonts.heading};
      --font-body: ${typography.fonts.body};
      --font-accent: ${typography.fonts.accent || typography.fonts.heading};

      /* Font Sizes */
      --text-h1: ${typography.sizes.h1};
      --text-h2: ${typography.sizes.h2};
      --text-h3: ${typography.sizes.h3};
      --text-h4: ${typography.sizes.h4};
      --text-body: ${typography.sizes.body};
      --text-small: ${typography.sizes.small};

      /* Font Weights */
      --weight-light: ${typography.weights.light};
      --weight-normal: ${typography.weights.normal};
      --weight-medium: ${typography.weights.medium};
      --weight-semibold: ${typography.weights.semibold};
      --weight-bold: ${typography.weights.bold};

      /* Spacing */
      --space-xs: ${layout.spacing.xs};
      --space-sm: ${layout.spacing.sm};
      --space-md: ${layout.spacing.md};
      --space-lg: ${layout.spacing.lg};
      --space-xl: ${layout.spacing.xl};
      --space-xxl: ${layout.spacing.xxl};

      /* Border Radius */
      --radius-sm: ${layout.borderRadius.sm};
      --radius-md: ${layout.borderRadius.md};
      --radius-lg: ${layout.borderRadius.lg};
      --radius-xl: ${layout.borderRadius.xl};

      /* Shadows */
      --shadow-sm: ${layout.shadows.sm};
      --shadow-md: ${layout.shadows.md};
      --shadow-lg: ${layout.shadows.lg};
      --shadow-xl: ${layout.shadows.xl};

      /* Layout */
      --max-width: ${layout.maxWidth};
    }

    body {
      font-family: var(--font-body);
      color: var(--color-text);
      background-color: var(--color-background);
      line-height: 1.6;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      font-weight: var(--weight-bold);
      line-height: 1.2;
    }

    h1 { font-size: var(--text-h1); }
    h2 { font-size: var(--text-h2); }
    h3 { font-size: var(--text-h3); }
    h4 { font-size: var(--text-h4); }

    .container {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 var(--space-md);
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: white;
      border: none;
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-md);
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-1px);
    }

    .card {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      box-shadow: var(--shadow-md);
    }
  `;
}

const templateStylesBundle = {
  colorSchemes,
  typographyStyles,
  layoutStyles,
  templateStyles,
  getColorScheme,
  getTypographyStyle,
  getLayoutStyle,
  getTemplateStyle,
  generateCSS
};

export default templateStylesBundle;