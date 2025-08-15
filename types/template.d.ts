// Template renderer types

export interface TemplateContent {
  title?: string
  subtitle?: string
  description?: string
  text?: string
  image?: string
  images?: string[]
  video?: string | {
    thumbnail?: string;
    duration?: string;
    title?: string;
    url?: string;
  }
  links?: Array<{
    label: string
    href: string
  }>
  socialProof?: string
  badges?: Array<{
    label: string
    variant?: string
  }>
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
    image?: string;
    color?: string;
    module?: string;
    demo?: string;
    scientificBacking?: string;
    benefit?: string;
    timeframe?: string;
  }> | Array<{
    title: string;
    description?: string;
  }> | string[]
  testimonials?: Array<{
    quote: string;
    author: string;
    role?: string;
    company?: string;
    image?: string;
    rating?: number;
    results?: string;
    metric?: string;
    logo?: string;
    location?: string;
    verified?: boolean;
    beforeAfter?: {
      before: string;
      after: string;
    };
    [key: string]: any;
  }>
  pricing?: Array<{
    name: string
    price: string
    features: string[]
    popular?: boolean
  }>
  team?: Array<{
    name: string;
    role: string;
    bio?: string;
    image?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  }>
  stats?: Array<{
    label: string
    value: string
  }>
  portfolio?: Array<{
    title: string
    description: string
    image: string
    category: string
  }>
  contact?: {
    email?: string
    phone?: string
    address?: string
    social?: Record<string, string>
  }
  form?: {
    fields: Array<{
      name: string
      type: string
      label: string
      required?: boolean
    }>
    submitText?: string
  }
  [key: string]: any
}

export interface TemplateStyles {
  backgroundColor?: string
  textColor?: string
  primaryColor?: string
  primaryColorForeground?: string
  font?: string
}

export interface ButtonStyles {
  borderRadius?: number
  shadow?: string
}

export interface TemplateDesign {
  backgroundColor?: string
  textColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
  theme?: string
  layout?: string
  [key: string]: any
}

export interface ComponentRendererProps {
  content: TemplateContent
  styles: TemplateStyles
  buttonStyles?: ButtonStyles
  design?: TemplateDesign
}

export {};