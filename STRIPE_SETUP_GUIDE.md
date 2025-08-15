# Stripe + Firestore Payments Setup Guide

## ✅ Current Status

Your HighLaunchPad project is now configured with the Stripe Firestore Payments extension (v0.3.4). Here's what's already set up:

### ✅ Completed Setup
- [x] Firestore-stripe-payments extension installed and active
- [x] Client SDK installed (`@stripe/firestore-stripe-payments@0.0.6`)
- [x] Firestore security rules updated for the extension
- [x] Environment variables configured
- [x] New Stripe client library created (`src/lib/stripe-firestore.ts`)

### 🔧 Configuration Details

**Environment Variables (already set):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RXZxlGu82BVLoEF...
STRIPE_SECRET_KEY=sk_live_51RXZxlGu82BVLoEF...
STRIPE_WEBHOOK_SECRET=whsec_9nHJ55PYVTiQDvBjXANKTmxnKMv04uvv
```

**Firestore Rules (updated):**
- Customer data access restricted to authenticated users
- Products and prices readable by all users
- Checkout sessions, subscriptions, and payments restricted to owners

## 🚀 Next Steps

### 1. Configure Stripe Webhook

Your webhook endpoint URL is:
```
https://us-central1-firebase-veilnet.cloudfunctions.net/ext-firestore-stripe-payments-handleWebhookEvents
```

**In your Stripe Dashboard:**
1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter the URL above
4. Select these events:
   - `product.created`
   - `product.updated` 
   - `product.deleted`
   - `price.created`
   - `price.updated`
   - `price.deleted`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.processing`
   - `payment_intent.succeeded`
   - `payment_intent.canceled`
   - `payment_intent.payment_failed`
   - `invoice.paid` (optional)
   - `invoice.payment_succeeded` (optional)
   - `invoice.payment_failed` (optional)

5. Copy the webhook signing secret and update your `STRIPE_WEBHOOK_SECRET` environment variable

### 2. Create Products and Prices in Stripe

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Create your products (e.g., "Pro Plan")
3. Add prices for each product
4. The extension will automatically sync these to Firestore

### 3. Update Your Components

Replace your existing Stripe integration with the new firestore-stripe-payments client:

```typescript
// Old way (src/lib/stripe.ts)
import { redirectToCheckout } from '@/lib/stripe';

// New way (src/lib/stripe-firestore.ts)
import { redirectToCheckout, getUserSubscriptions, getProducts } from '@/lib/stripe-firestore';

// Example usage:
const user = auth.currentUser;
await redirectToCheckout(user, 'price_1234567890', {
  success_url: `${window.location.origin}/success`,
  cancel_url: `${window.location.origin}/cancel`,
  allow_promotion_codes: true
});
```

### 4. Test the Integration

Use the new client library to:

```typescript
import { 
  getProducts, 
  getUserSubscriptions, 
  createCheckoutSession,
  onSubscriptionUpdate 
} from '@/lib/stripe-firestore';

// Get all products
const products = await getProducts();

// Get user's subscriptions
const subscriptions = await getUserSubscriptions(user);

// Listen to subscription changes
const unsubscribe = onSubscriptionUpdate(user, (subscriptions) => {
  console.log('Subscriptions updated:', subscriptions);
});
```

## 🔄 Migration from Old Stripe Setup

Your existing Stripe API routes will continue to work, but you can gradually migrate to use the extension's automatic handling:

### Current API Routes (can be kept for compatibility):
- `/api/stripe/create-checkout-session`
- `/api/stripe/create-portal-session` 
- `/api/stripe/webhook`

### Extension Handles Automatically:
- Customer creation
- Subscription management
- Webhook processing
- Data synchronization

## 🎯 Key Benefits

1. **Automatic Sync**: Products, prices, and subscriptions sync automatically
2. **Real-time Updates**: Firestore listeners for subscription changes
3. **Security**: Proper Firestore rules for data access
4. **Simplified Code**: Less custom API endpoints needed
5. **Type Safety**: TypeScript interfaces for all Stripe objects

## 🧪 Testing

Run the test script to verify everything is working:

```bash
npx tsx tmp_rovodev_test_stripe_setup.ts
```

## 📚 Documentation

- [Firestore Stripe Payments Extension](https://github.com/stripe/stripe-firebase-extensions/tree/master/firestore-stripe-payments)
- [Client SDK Documentation](https://github.com/stripe/stripe-firebase-extensions/tree/master/firestore-stripe-payments#using-the-extension)
- [Stripe Dashboard](https://dashboard.stripe.com/)

## 🆘 Troubleshooting

### Products not syncing?
- Check webhook is configured correctly
- Verify webhook secret matches environment variable
- Check Firebase Functions logs

### Checkout sessions not working?
- Ensure user is authenticated
- Check Firestore rules allow write access to checkout_sessions
- Verify price IDs exist in Stripe

### Subscriptions not updating?
- Check webhook events are being received
- Verify customer objects exist in Firestore
- Check Firebase Functions logs for errors

---

Your Stripe integration is now ready! The extension will handle most of the heavy lifting automatically.