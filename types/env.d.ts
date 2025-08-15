// Environment variable types

declare namespace NodeJS {
  interface ProcessEnv {
    // Next.js
    NODE_ENV: 'development' | 'production' | 'test'
    NEXT_PUBLIC_BASE_URL: string
    
    // Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY: string
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
    NEXT_PUBLIC_FIREBASE_APP_ID: string
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string
    
    // Firebase Admin
    FIREBASE_SERVICE_ACCOUNT?: string
    FIREBASE_ADMIN_PROJECT_ID?: string
    FIREBASE_ADMIN_CLIENT_EMAIL?: string
    FIREBASE_ADMIN_PRIVATE_KEY?: string
    GOOGLE_APPLICATION_CREDENTIALS?: string
    
    // Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
    STRIPE_SECRET_KEY: string
    STRIPE_WEBHOOK_SECRET: string
    
    // Social OAuth
    FACEBOOK_CLIENT_ID: string
    FACEBOOK_CLIENT_SECRET: string
    LINKEDIN_CLIENT_ID: string
    LINKEDIN_CLIENT_SECRET: string
    TWITTER_CLIENT_ID: string
    TWITTER_CLIENT_SECRET: string
    
    // Other
    CRON_SECRET_KEY?: string
    GEMINI_API_KEY?: string
  }
}

export {};