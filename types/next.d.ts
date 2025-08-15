// Next.js type extensions

import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'

// Extend NextApiRequest for custom properties
declare module 'next' {
  interface NextApiRequest {
    user?: {
      uid: string
      email: string
    }
  }
}

// Route handler types for App Router
export interface RouteContext {
  params: Record<string, string | string[]>
}

export type RouteHandler = (
  request: NextRequest,
  context: RouteContext
) => Promise<NextResponse> | NextResponse

// Page props types
export interface PageProps<T = Record<string, any>> {
  params: T
  searchParams: Record<string, string | string[] | undefined>
}

// Layout props types
export interface LayoutProps {
  children: React.ReactNode
  params?: Record<string, string>
}

// Error page props
export interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// Not found page props
export interface NotFoundProps {}

// Loading page props
export interface LoadingProps {}

export {};