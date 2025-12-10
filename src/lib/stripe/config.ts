import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Price IDs - set these after creating products in Stripe Dashboard
export const STRIPE_PRICES = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || '',
  business_monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || '',
  business_yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || '',
};

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Unlimited static QR codes',
      'Basic colors',
      'PNG downloads',
      'QRForge watermark',
    ],
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 9,
    yearlyPrice: 90,
    priceId: {
      monthly: STRIPE_PRICES.pro_monthly,
      yearly: STRIPE_PRICES.pro_yearly,
    },
    features: [
      'Everything in Free',
      '50 dynamic QR codes',
      'Scan analytics',
      'Custom colors & logos',
      'SVG/PDF downloads',
      'No watermark',
    ],
  },
  business: {
    name: 'Business',
    monthlyPrice: 29,
    yearlyPrice: 290,
    priceId: {
      monthly: STRIPE_PRICES.business_monthly,
      yearly: STRIPE_PRICES.business_yearly,
    },
    features: [
      'Everything in Pro',
      'Unlimited dynamic QR codes',
      'API access',
      'Bulk generation',
      'Team members (3)',
      'White-label option',
    ],
  },
};
