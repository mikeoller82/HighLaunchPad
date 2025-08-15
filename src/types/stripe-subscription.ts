import { type Stripe } from 'stripe';

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';

export interface SubscriptionSnapshot {
  id: string;
  status: SubscriptionStatus;
  priceId: string;
  productName: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  items: Stripe.Subscription['items']['data'];
}