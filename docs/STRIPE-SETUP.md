# Stripe Setup Guide

## Overview

Stripe integration is pre-built. API routes, hooks, and UI components are ready. Just needs configuration.

## Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create account or sign in
3. Complete business verification (can use test mode first)

## Step 2: Get API Keys

1. Go to Developers → API keys
2. Copy:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)

## Step 3: Create Products

In Stripe Dashboard → Products → Add product:

### Pro Plan
- Name: `QRForge Pro`
- Create 2 prices:
  - Monthly: $9/month, recurring
  - Yearly: $90/year, recurring

### Business Plan
- Name: `QRForge Business`
- Create 2 prices:
  - Monthly: $29/month, recurring
  - Yearly: $290/year, recurring

Copy all 4 price IDs (start with `price_`).

## Step 4: Update .env.local

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_BUSINESS_MONTHLY=price_...
STRIPE_PRICE_BUSINESS_YEARLY=price_...
```

## Step 5: Webhook Setup (Production)

For production, create webhook endpoint:

1. Developers → Webhooks → Add endpoint
2. URL: `https://yourdomain.com/api/stripe/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## Step 6: Test Mode

Use test mode first:
- Test card: `4242 4242 4242 4242`
- Any future expiry, any CVC

## Existing Code

| File | Purpose |
|------|---------|
| `src/lib/stripe/config.ts` | Stripe instance, price config |
| `src/lib/stripe/client.ts` | Client-side Stripe loader |
| `src/app/api/stripe/checkout/route.ts` | Creates checkout sessions |
| `src/app/api/stripe/webhook/route.ts` | Handles subscription events |
| `src/app/api/stripe/portal/route.ts` | Customer billing portal |
| `src/hooks/useStripe.ts` | React hooks for checkout/portal |
| `src/components/pricing/PricingSection.tsx` | Pricing UI with checkout |
| `src/components/billing/BillingSection.tsx` | Settings billing UI |

## Flow

1. User clicks "Upgrade" → `useStripeCheckout` hook
2. POST to `/api/stripe/checkout` → creates session
3. Redirect to Stripe Checkout
4. User pays → Stripe sends webhook
5. Webhook updates `profiles.subscription_tier`
6. User returns to app with upgraded account
