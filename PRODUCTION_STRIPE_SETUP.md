# Production Stripe Configuration Guide

## Current Issue
Your Stripe integration shows "Stripe not properly configured" in production despite having credentials in Google Cloud Build secrets and .env.local.

## Root Cause Analysis
The issue is likely one of these:

1. **Environment variables not properly injected into the runtime**
2. **Firebase Admin SDK not initializing correctly in production**
3. **Stripe webhook endpoints not configured**
4. **Missing or incorrect secret configuration in Google Cloud Build**

## Production-Ready Solution

### 1. Google Cloud Build Secret Configuration

Ensure these secrets are properly configured in Google Cloud Secret Manager:

```bash
# Create secrets in Google Cloud Secret Manager
gcloud secrets create STRIPE_SECRET_KEY --data-file=- <<< "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"

gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- <<< "whsec_9nHJ55PYVTiQDvBjXANKTmxnKMv04uvv"

gcloud secrets create FIREBASE_ADMIN_PROJECT_ID --data-file=- <<< "firebase-veilnet"

gcloud secrets create FIREBASE_ADMIN_CLIENT_EMAIL --data-file=- <<< "firebase-adminsdk-fbsvc@firebase-veilnet.iam.gserviceaccount.com"

gcloud secrets create FIREBASE_ADMIN_PRIVATE_KEY --data-file=- <<< "-----BEGIN PRIVATE KEY-----\n[YOUR_PRIVATE_KEY]\n-----END PRIVATE KEY-----"
```

### 2. Update cloudbuild.yaml

Your `cloudbuild.yaml` should include all necessary secrets:

```yaml
steps:
  - name: 'gcr.io/cloud-builders/npm'
    args: ['install']
    
  - name: 'gcr.io/cloud-builders/npm'
    args: ['run', 'build']
    env:
      - 'NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDefxmW4h76fC8-R3sKMIW8ngr4iCt-FNM'
      - 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fir-veilnet.firebaseapp.com'
      - 'NEXT_PUBLIC_FIREBASE_PROJECT_ID=firebase-veilnet'
      - 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=firebase-veilnet.firebasestorage.app'
      - 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=785697647146'
      - 'NEXT_PUBLIC_FIREBASE_APP_ID=1:785697647146:web:ab4c9d90c2e0cd6becb153'
      - 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-FNJ36PCZFN'
      - 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RXZxlGu82BVLoEFOUpZOHterU71cxDY5ecVcPk9ihZSkjrPE5zwruVnwtogTcBgBOSHFxpiMNogPHCsSpTRnjok00cWceabW7'
      - 'NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1RdUCeGu82BVLoEFYaCWRg7z'
      - 'NEXT_PUBLIC_BASE_URL=https://highlaunchpad.com'
    secretEnv: 
      - 'STRIPE_SECRET_KEY'
      - 'STRIPE_WEBHOOK_SECRET'
      - 'FIREBASE_ADMIN_PROJECT_ID'
      - 'FIREBASE_ADMIN_CLIENT_EMAIL'
      - 'FIREBASE_ADMIN_PRIVATE_KEY'
      - 'GEMINI_API_KEY'
      - 'FACEBOOK_CLIENT_SECRET'
      - 'LINKEDIN_CLIENT_SECRET'
      - 'TWITTER_CLIENT_SECRET'

  - name: 'gcr.io/cloud-builders/firebase'
    args: ['deploy', '--only', 'hosting,functions']

availableSecrets:
  secretManager:
    - versionName: projects/firebase-veilnet/secrets/STRIPE_SECRET_KEY/versions/latest
      env: 'STRIPE_SECRET_KEY'
    - versionName: projects/firebase-veilnet/secrets/STRIPE_WEBHOOK_SECRET/versions/latest
      env: 'STRIPE_WEBHOOK_SECRET'
    - versionName: projects/firebase-veilnet/secrets/FIREBASE_ADMIN_PROJECT_ID/versions/latest
      env: 'FIREBASE_ADMIN_PROJECT_ID'
    - versionName: projects/firebase-veilnet/secrets/FIREBASE_ADMIN_CLIENT_EMAIL/versions/latest
      env: 'FIREBASE_ADMIN_CLIENT_EMAIL'
    - versionName: projects/firebase-veilnet/secrets/FIREBASE_ADMIN_PRIVATE_KEY/versions/latest
      env: 'FIREBASE_ADMIN_PRIVATE_KEY'
    - versionName: projects/firebase-veilnet/secrets/GEMINI_API_KEY/versions/latest
      env: 'GEMINI_API_KEY'
    - versionName: projects/firebase-veilnet/secrets/FACEBOOK_CLIENT_SECRET/versions/latest
      env: 'FACEBOOK_CLIENT_SECRET'
    - versionName: projects/firebase-veilnet/secrets/LINKEDIN_CLIENT_SECRET/versions/latest
      env: 'LINKEDIN_CLIENT_SECRET'
    - versionName: projects/firebase-veilnet/secrets/TWITTER_CLIENT_SECRET/versions/latest
      env: 'TWITTER_CLIENT_SECRET'

options:
  logging: CLOUD_LOGGING_ONLY
```

### 3. Firebase Functions Configuration

If you're using Firebase Functions, ensure your functions have access to the secrets:

```javascript
// firebase.json
{
  "functions": {
    "source": ".",
    "runtime": "nodejs18",
    "env": {
      "STRIPE_SECRET_KEY": "secret:STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET": "secret:STRIPE_WEBHOOK_SECRET",
      "FIREBASE_ADMIN_PROJECT_ID": "secret:FIREBASE_ADMIN_PROJECT_ID",
      "FIREBASE_ADMIN_CLIENT_EMAIL": "secret:FIREBASE_ADMIN_CLIENT_EMAIL",
      "FIREBASE_ADMIN_PRIVATE_KEY": "secret:FIREBASE_ADMIN_PRIVATE_KEY"
    }
  }
}
```

### 4. Stripe Webhook Configuration

Configure your Stripe webhook endpoint:

1. **Webhook URL**: `https://highlaunchpad.com/api/stripe/webhook`
2. **Events to listen for**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 5. Production Environment Variables

Ensure these are set in your production environment:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RXZxlGu82BVLoEFOUpZOHterU71cxDY5ecVcPk9ihZSkjrPE5zwruVnwtogTcBgBOSHFxpiMNogPHCsSpTRnjok00cWceabW7
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_9nHJ55PYVTiQDvBjXANKTmxnKMv04uvv
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1RdUCeGu82BVLoEFYaCWRg7z

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=firebase-veilnet
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@firebase-veilnet.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[YOUR_PRIVATE_KEY]\n-----END PRIVATE KEY-----"

# Base URL
NEXT_PUBLIC_BASE_URL=https://highlaunchpad.com
```

## Immediate Actions Required

### 1. Verify Current Secret Configuration
```bash
# Check if secrets exist
gcloud secrets list --filter="name:STRIPE_SECRET_KEY OR name:FIREBASE_ADMIN"

# Verify secret values (be careful with this in production)
gcloud secrets versions access latest --secret="STRIPE_SECRET_KEY" | head -c 20
```

### 2. Test Stripe Configuration
Add this test endpoint to verify Stripe is working:

```typescript
// src/app/api/stripe/test/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      return NextResponse.json({ 
        error: 'STRIPE_SECRET_KEY not found',
        env: Object.keys(process.env).filter(key => key.includes('STRIPE'))
      }, { status: 500 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });
    
    // Test API call
    const account = await stripe.accounts.retrieve();
    
    return NextResponse.json({ 
      success: true,
      accountId: account.id,
      keyType: secretKey.startsWith('sk_live_') ? 'LIVE' : 'TEST'
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      type: 'stripe_test_failed'
    }, { status: 500 });
  }
}
```

### 3. Deploy and Test
```bash
# Deploy with proper environment variables
npm run build
firebase deploy --only hosting

# Test the Stripe configuration
curl https://highlaunchpad.com/api/stripe/test
```

## Troubleshooting

### Common Issues:

1. **"Missing STRIPE_SECRET_KEY"**
   - Verify secret is created in Google Cloud Secret Manager
   - Check cloudbuild.yaml includes the secret in availableSecrets
   - Ensure secret is in secretEnv list

2. **"Invalid API Key"**
   - Verify you're using live keys (sk_live_) for production
   - Check the key hasn't been regenerated in Stripe dashboard

3. **"Firebase Admin initialization failed"**
   - Verify service account has proper permissions
   - Check Firebase project ID matches your actual project

4. **Webhook failures**
   - Verify webhook endpoint is accessible
   - Check webhook secret matches Stripe dashboard
   - Ensure webhook is configured for correct events

## Security Best Practices

1. **Never commit secrets to version control**
2. **Use Google Cloud Secret Manager for all sensitive data**
3. **Regularly rotate API keys**
4. **Monitor webhook endpoints for failures**
5. **Use HTTPS for all webhook endpoints**

## Next Steps

1. Update your `cloudbuild.yaml` with the configuration above
2. Create/verify all secrets in Google Cloud Secret Manager
3. Deploy and test the Stripe integration
4. Configure Stripe webhooks
5. Test the complete billing flow

This should resolve your "Stripe not properly configured" error in production.