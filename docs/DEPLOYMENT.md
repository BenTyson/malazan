# Deployment Guide

## Railway (Recommended)

### Setup

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Select `malazan` repository

### Environment Variables

Add all variables from `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://otdlggbhsmgqhsviazho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-railway-domain.up.railway.app
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_BUSINESS_MONTHLY=price_...
STRIPE_PRICE_BUSINESS_YEARLY=price_...
```

**Important:** Update `NEXT_PUBLIC_APP_URL` to your Railway domain.

### Custom Domain

1. Settings → Domains → Add custom domain
2. Add DNS records as shown
3. Update `NEXT_PUBLIC_APP_URL` to custom domain
4. Update Supabase redirect URLs
5. Update Stripe webhook URL

## Supabase Config for Production

### Auth Redirect URLs

In Supabase → Authentication → URL Configuration:

- Site URL: `https://yourdomain.com`
- Redirect URLs:
  - `https://yourdomain.com/callback`
  - `https://yourdomain.com/auth/callback`

### Google OAuth (Optional)

1. Create OAuth app in Google Cloud Console
2. Add redirect URI: `https://otdlggbhsmgqhsviazho.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret to Supabase → Auth → Providers → Google

## Post-Deployment Checklist

- [ ] Verify signup/login works
- [ ] Test QR code creation
- [ ] Test dynamic QR redirect
- [ ] Configure Stripe webhook for production URL
- [ ] Test checkout flow with test card
- [ ] Switch Stripe to live mode when ready
