// API type definitions

// Common API response structure
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Authentication types
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface SessionData {
  user: AuthUser
  token: string
  expiresAt: number
}

// Stripe types
export interface StripeProduct {
  id: string
  name: string
  description?: string
  images: string[]
  metadata: Record<string, string>
}

export interface StripePrice {
  id: string
  product: string | StripeProduct
  unit_amount: number | null
  currency: string
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year'
    interval_count: number
  }
  metadata: Record<string, string>
}

export interface StripeSubscription {
  id: string
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
  current_period_start: number
  current_period_end: number
  items: {
    price: StripePrice
  }[]
}

// Workspace types
export interface Workspace {
  id: string
  name: string
  description?: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

// Content types
export interface ContentBlock {
  id: string
  type: string
  content: any
  styles?: Record<string, any>
  metadata?: Record<string, any>
}

export interface Page {
  id: string
  title: string
  slug: string
  content: ContentBlock[]
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export {};