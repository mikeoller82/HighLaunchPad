# Production Stripe Troubleshooting Guide

## 🚨 Immediate Issue
Your live application at https://highlaunchpad.com shows "Stripe not properly configured" when users try to upgrade after the 30-day free trial.

## 🔍 Root Cause Analysis
The issue is that environment variables (specifically `STRIPE_SECRET_KEY`) are not being properly injected into your production runtime environment during Google Cloud Build deployment.

## ⚡ Immediate Fix (Production Ready)

### Step 1: Verify Current Secrets
```bash
# Check if secrets exist in Google Cloud Secret Manager
gcloud secrets list --filter="name:STRIPE" --project=firebase-veilnet

# If they don't exist, create them:
echo "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" | gcloud secrets create STRIPE_SECRET_KEY --data-file=- --project=firebase-veilnet

echo "whsec_9nHJ55PYVTiQDvBjXANKTmxnKMv04uvv" | gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- --project=firebase-veilnet
```

### Step 2: Update Your cloudbuild.yaml
Replace your current `cloudbuild.yaml` with the production-ready version I created. The key changes:

1. **Proper secret injection** during build time
2. **Environment variable validation**
3. **Enhanced error handling**

### Step 3: Grant Permissions
```bash
# Grant Cloud Build access to secrets
PROJECT_NUMBER=$(gcloud projects describe firebase-veilnet --format='value(projectNumber)')
gcloud projects add-iam-policy-binding firebase-veilnet \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### Step 4: Deploy with Proper Configuration
```bash
# Deploy using Cloud Build
gcloud builds submit --config cloudbuild.yaml --project=firebase-veilnet
```

### Step 5: Test the Fix
After deployment, test your Stripe configuration:
```bash
# Test the Stripe configuration endpoint
curl https://highlaunchpad.com/api/stripe/test
```

## 🔧 Alternative Quick Fix (If Above Doesn't Work)

If the Cloud Build approach isn't working, you can use Firebase Functions environment configuration:

### Option A: Firebase Functions Config
```bash
# Set environment variables for Firebase Functions
firebase functions:config:set stripe.secret_key="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"
firebase functions:config:set stripe.webhook_secret="whsec_9nHJ55PYVTiQDvBjXANKTmxnKMv04uvv"

# Deploy functions
firebase deploy --only functions
```

### Option B: Environment Variables in next.config.mjs
Add runtime environment variable injection:

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  },
  // ... rest of your config
};

export default nextConfig;
```

## 🧪 Testing Your Fix

### 1. Test Stripe Configuration
Visit: `https://highlaunchpad.com/api/stripe/test`

**Expected Response (Success):**
```json
{
  "success": true,
  "stripe": {
    "accountId": "acct_...",
    "keyType": "LIVE",
    "chargesEnabled": true,
    "payoutsEnabled": true
  },
  "configuration": {
    "envStatus": {
      "STRIPE_SECRET_KEY": "✅ Present",
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "✅ Present"
    }
  }
}
```

### 2. Test Billing Flow
1. Go to https://highlaunchpad.com/dashboard/settings?tab=billing
2. Click "Subscribe" on the Pro plan
3. Should redirect to Stripe Checkout (not show error)

### 3. Test Webhook
```bash
# Test webhook endpoint
curl -X POST https://highlaunchpad.com/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 🚨 Emergency Hotfix (If Nothing Else Works)

If you need an immediate fix while troubleshooting the environment variables, you can temporarily hardcode the values (NOT RECOMMENDED for long-term):

```typescript
// src/services/stripe.service.ts - TEMPORARY HOTFIX ONLY
const getStripe = () => {
  // TEMPORARY: Remove this after fixing environment variables
  const secretKey = process.env.STRIPE_SECRET_KEY || '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';
  
  if (!secretKey.startsWith('sk_')) {
    throw new Error('Invalid STRIPE_SECRET_KEY format');
  }

  return new Stripe(secretKey, {
    apiVersion: '2024-06-20',
  });
};
```

**⚠️ IMPORTANT:** Remove the hardcoded key immediately after fixing the environment variable issue.

## 📊 Monitoring and Verification

### Check Logs
```bash
# View Cloud Build logs
gcloud builds list --limit=5 --project=firebase-veilnet

# View function logs
firebase functions:log --project=firebase-veilnet
```

### Monitor Stripe Dashboard
1. Go to https://dashboard.stripe.com/webhooks
2. Verify webhook endpoint is receiving events
3. Check for any failed webhook deliveries

## 🔄 Deployment Checklist

- [ ] Secrets created in Google Cloud Secret Manager
- [ ] Cloud Build has secretmanager.secretAccessor role
- [ ] cloudbuild.yaml includes all required secrets
- [ ] Environment variables are properly injected during build
- [ ] Stripe test endpoint returns success
- [ ] Billing flow works end-to-end
- [ ] Webhook endpoint is accessible
- [ ] Stripe dashboard shows successful webhook deliveries

## 📞 Support

If you're still experiencing issues after following this guide:

1. **Check the test endpoint**: https://highlaunchpad.com/api/stripe/test
2. **Review build logs** for environment variable injection
3. **Verify Stripe dashboard** for webhook configuration
4. **Test locally** with the same environment variables

The most common issue is that `STRIPE_SECRET_KEY` is not being injected into the runtime environment during the Google Cloud Build process. The solution above should resolve this by properly configuring the secrets and build process.