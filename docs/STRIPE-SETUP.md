# Stripe Setup Guide

> **Status**: Configured and Working (Test Mode)

## Current Configuration

Stripe is fully integrated with test mode credentials. All environment variables are set in `.env.local`.

### Products Created
| Plan | Monthly | Yearly |
|------|---------|--------|
| Pro | $9/mo (`price_1Sfvae2X6Eyg5ZIfGgRLAPfJ`) | $90/yr (`price_1Sfvae2X6Eyg5ZIfkXKjO9XF`) |
| Business | $29/mo (`price_1SfvbM2X6Eyg5ZIf2b6vpwru`) | $290/yr (`price_1SfvbM2X6Eyg5ZIfnixYn5j1`) |

## Local Development

### Running Webhooks Locally

Stripe CLI forwards webhook events to your local server:

```bash
stripe listen --forward-to localhost:3322/api/stripe/webhook
```

The webhook secret in `.env.local` is configured for local development.

### Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 3220` | 3D Secure required |

Use any future expiry date and any 3-digit CVC.

## Production Deployment

When deploying to production:

1. **Switch to Live Keys**
   - Go to Stripe Dashboard → Developers → API keys
   - Toggle off "Test mode"
   - Copy live `pk_live_` and `sk_live_` keys

2. **Create Production Webhook**
   - Developers → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

3. **Update Environment Variables**
   - Set all Stripe env vars in your hosting platform (Vercel, etc.)

## Code Architecture

| File | Purpose |
|------|---------|
| `src/lib/stripe/config.ts` | Stripe instance, price IDs, plan definitions |
| `src/lib/stripe/client.ts` | Client-side Stripe loader |
| `src/app/api/stripe/checkout/route.ts` | Creates checkout sessions |
| `src/app/api/stripe/webhook/route.ts` | Handles subscription lifecycle events |
| `src/app/api/stripe/portal/route.ts` | Opens Stripe Customer Portal |
| `src/hooks/useStripe.ts` | React hooks for checkout & portal |
| `src/components/pricing/PricingSection.tsx` | Landing page pricing UI |
| `src/components/billing/BillingSection.tsx` | Settings page billing UI |

## Subscription Flow

```
User clicks Upgrade
       ↓
POST /api/stripe/checkout
       ↓
Redirect to Stripe Checkout
       ↓
User completes payment
       ↓
Stripe sends webhook (checkout.session.completed)
       ↓
Webhook updates profiles table:
  - subscription_tier: 'pro' | 'business'
  - subscription_status: 'active'
  - stripe_customer_id: 'cus_...'
       ↓
User redirected back to /dashboard?success=true
```

## Subscription Management

Users can manage their subscription via Stripe Customer Portal:
- Update payment method
- View invoice history
- Cancel subscription
- Resume cancelled subscription

Access: Settings page → "Manage Subscription" button

## Webhook Events Handled

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Set tier to purchased plan, status to active |
| `customer.subscription.updated` | Sync tier and status changes |
| `customer.subscription.deleted` | Downgrade to free tier |
| `invoice.payment_failed` | Set status to past_due |

## Database Fields

The `profiles` table stores subscription state:

```sql
subscription_tier: 'free' | 'pro' | 'business'
subscription_status: 'active' | 'past_due' | 'canceled' | 'unpaid'
stripe_customer_id: 'cus_...'
```

## Troubleshooting

### Webhook not receiving events
- Ensure Stripe CLI is running: `stripe listen --forward-to localhost:3322/api/stripe/webhook`
- Check the webhook secret matches `.env.local`

### Subscription not updating after payment
- Check server logs for webhook errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (webhook uses admin client)

### Customer portal not opening
- User must have a `stripe_customer_id` in their profile
- This is set automatically on first checkout
