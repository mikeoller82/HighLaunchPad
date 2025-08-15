'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/lib/stripe-products';
import { redirectToCheckout, goToBillingPortal } from '@/lib/stripe-client';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocumentData } from 'firebase/firestore';

function PlanCard({ product, onSubscribe, isLoading, isCurrent }: { product: typeof products[0], onSubscribe: (priceId: string) => void, isLoading: boolean, isCurrent: boolean }) {
    const priceIdToSubscribe = isCurrent ? '' : product.priceId;

    return (
        <Card className={cn("flex flex-col", isCurrent && "border-primary shadow-glow-primary")}>
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-4xl font-bold">${product.price}<span className="text-lg font-normal text-blue-600">{product.frequency}</span></p>
                <ul className="mt-6 space-y-2">
                    {product.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500"/>
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={() => onSubscribe(priceIdToSubscribe)}
                    disabled={isLoading || isCurrent}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : (isCurrent ? 'Current Plan' : 'Subscribe')}
                </Button>
            </CardFooter>
        </Card>
    );
}


export function BillingForm() {
    const { user, subscription, loading, db } = useAuth();
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubscribe = async (priceId: string) => {
        setError(null);
        
        console.log('🔄 Starting subscription process with priceId:', priceId);
        
        if (!user || !db) {
            setError('You must be logged in to subscribe.');
            return;
        }
        
        if (!priceId || priceId === 'free_plan') {
            setError('Please select a valid subscription plan.');
            return;
        }

        // Enhanced validation for production environment
        const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!stripePublishableKey) {
            console.error('❌ Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
            setError('Stripe configuration error: Missing publishable key. Please contact support.');
            return;
        }

        // Validate the key format
        if (!stripePublishableKey.startsWith('pk_')) {
            console.error('❌ Invalid Stripe publishable key format');
            setError('Stripe configuration error: Invalid key format. Please contact support.');
            return;
        }

        // Check if we're in production and using live keys
        const isLiveKey = stripePublishableKey.startsWith('pk_live_');
        const isTestKey = stripePublishableKey.startsWith('pk_test_');
        
        console.log('🔑 Stripe key type:', isLiveKey ? 'LIVE' : isTestKey ? 'TEST' : 'UNKNOWN');
        
        setIsCheckoutLoading(true);
        
        try {
            console.log('🚀 Calling redirectToCheckout...');
            await redirectToCheckout(db, user, priceId);
            console.log('✅ redirectToCheckout completed successfully');
        } catch (error) {
            console.error('❌ Subscription error:', error);
            
            // Enhanced error handling for production
            let errorMessage = 'An unexpected error occurred';
            
            if (error instanceof Error) {
                if (error.message.includes('Missing STRIPE_SECRET_KEY')) {
                    errorMessage = 'Server configuration error: Stripe not properly configured on server. Please contact support.';
                } else if (error.message.includes('Invalid API Key')) {
                    errorMessage = 'Stripe configuration error: Invalid API keys. Please contact support.';
                } else if (error.message.includes('No such price')) {
                    errorMessage = 'The selected plan is not available. Please try again or contact support.';
                } else if (error.message.includes('already have an active subscription')) {
                    errorMessage = 'You already have an active subscription. Please manage it from the billing portal below.';
                } else if (error.message.includes('network') || error.message.includes('fetch')) {
                    errorMessage = 'Network error: Please check your connection and try again.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            setError(errorMessage);
            setIsCheckoutLoading(false);
        }
    };

    const manageSubscription = async () => {
        if (!user) return;
        
        try {
            console.log('🔄 Opening billing portal...');
            await goToBillingPortal(user);
        } catch (error) {
            console.error('❌ Error accessing billing portal:', error);
            
            let errorMessage = 'Unable to access billing portal. Please try again or contact support.';
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    errorMessage = 'No billing information found. Please subscribe to a plan first.';
                } else if (error.message.includes('configuration')) {
                    errorMessage = 'Billing system configuration error. Please contact support.';
                }
            }
            
            setError(errorMessage);
        }
    };

    if (loading) {
        return <p>Loading subscription details...</p>
    }

    if (subscription) {
        const sub = subscription as DocumentData;
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Subscription</CardTitle>
                     <CardDescription>
                        You are currently on the <strong>{sub.items[0]?.price.product.name || 'Pro'}</strong> plan.
                        Your subscription is {sub.status}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-blue-600">
                        Your plan will {sub.cancel_at_period_end ? 'cancel' : 'renew'} on {new Date(sub.current_period_end.seconds * 1000).toLocaleDateString()}.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={manageSubscription}>Manage Billing & Invoices</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.filter(p => p.price > 0).map((product) => (
                    <PlanCard 
                        key={product.id}
                        product={product}
                        onSubscribe={handleSubscribe}
                        isLoading={isCheckoutLoading}
                        isCurrent={false} // Can't be current if they have no subscription
                    />
                ))}
            </div>
            
            <div className="text-center text-sm text-blue-600">
                <p>Secure payments powered by Stripe. Cancel anytime.</p>
            </div>
        </div>
    );
}
