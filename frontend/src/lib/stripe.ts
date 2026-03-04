import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
    apiVersion: '2026-02-25.clover',
    appInfo: {
        name: 'Aegis-Agent ID',
        version: '5.0.0',
    },
    typescript: true,
});
