// Main type definitions export file

// Re-export all type definitions
export * from './api'
export * from './components'
export * from './env'
export * from './firebase'
export * from './global'
export * from './next'
export * from './react'
export * from './utils'
export * from './template'
export * from './website'
export * from './reactflow'

// Additional common types that might be missing
export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export interface WithId {
  id: string
}

export interface WithTimestamps {
  createdAt: Date
  updatedAt: Date
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams {
  query?: string
  filters?: Record<string, any>
}

// Fix for common missing types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export {};