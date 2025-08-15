// React type extensions and fixes

import 'react'

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Allow any data attributes
    [key: `data-${string}`]: any
  }
  
  interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
    // Allow any data attributes for SVG elements
    [key: `data-${string}`]: any
  }
}

// Fix for Next.js Image component props
declare module 'next/image' {
  interface ImageProps {
    priority?: boolean
    placeholder?: 'blur' | 'empty'
    blurDataURL?: string
    unoptimized?: boolean
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
    onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
    loading?: 'lazy' | 'eager'
    crossOrigin?: 'anonymous' | 'use-credentials' | ''
  }
}

export {};