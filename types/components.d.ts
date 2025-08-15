// Component type definitions

import { ReactNode, ComponentProps } from 'react'
import { LucideIcon } from 'lucide-react'

// Common component props
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// UI Component types
export interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outline'
}

export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}

export interface ToastProps {
  id?: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  variant?: 'default' | 'destructive'
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// Icon types
export interface IconProps {
  className?: string
  size?: number | string
}

// Form types
export interface FormFieldProps {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
}

// Navigation types
export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
  disabled?: boolean
  external?: boolean
}

// Social media types
export interface SocialPlatform {
  id: string
  name: string
  icon: LucideIcon
  connected: boolean
}

export {};