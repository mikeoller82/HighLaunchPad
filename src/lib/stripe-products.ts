export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    frequency: string;
    priceId: string;
    features: string[];
}

// NOTE: Using actual Stripe Price IDs from environment variables
const products: Product[] = [
    {
        id: 'prod_pro',
        name: 'Pro Plan',
        description: 'For power users who need more.',
        price: 29,
        frequency: '/ month',
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_1RdUCeGu82BVLoEFYaCWRg7z',
        features: [
            'Unlimited Funnels & Websites',
            'Unlimited Contacts & Automations',
            'Full AI Tools Access',
            'Team Collaboration',
            'Remove HighLaunchPad Branding',
        ],
    },
    {
        id: 'prod_free',
        name: 'Free Plan',
        description: 'For individuals starting out.',
        price: 0,
        frequency: '/ month',
        priceId: 'free_plan', // This is not a real Stripe price
        features: [
            '1 Funnel & 1 Website',
            'Up to 500 Contacts',
            'Limited AI Tool Usage',
            'HighLaunchPad Branding',
        ],
    }
];

export { products };
