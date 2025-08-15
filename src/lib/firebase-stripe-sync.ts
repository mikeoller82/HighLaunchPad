import { collection, onSnapshot, query, where } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { SubscriptionSnapshot } from '@/types/stripe-subscription';

export const onCurrentUserSubscriptionUpdate = (
  db: Firestore,
  user: User,
  callback: (data: { subscriptions: SubscriptionSnapshot[] }) => void,
) => {
  const ref = collection(db, 'customers', user.uid, 'subscriptions');
  const q   = query(ref, where('status', 'in', ['trialing', 'active', 'past_due']));

  return onSnapshot(q, (snap) => {
    const subs: SubscriptionSnapshot[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        status: data.status,
        priceId: data.price.id,
        productName: data.items?.[0]?.price?.product?.name ?? '—',
        currentPeriodStart: new Date(data.current_period.start.seconds * 1000),
        currentPeriodEnd:   new Date(data.current_period.end.seconds * 1000),
        items: data.items?.data ?? [],
      } as SubscriptionSnapshot;
    });
    callback({ subscriptions: subs });
  });
};