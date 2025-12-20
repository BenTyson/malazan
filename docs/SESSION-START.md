# QRForge - Session Start Guide

> **Last Updated**: December 19, 2024
> **Status**: Production Ready - Stripe + SEO Complete

## Quick Context

QRForge is a premium QR code generator with analytics and dynamic codes. Goal: passive income via SEO-driven traffic and recurring subscriptions.

## Current Status

### Completed
- Next.js 14 app with TypeScript + Tailwind CSS v4
- QR generator with 7 content types (URL, Text, WiFi, vCard, Email, Phone, SMS)
- Real-time preview with style customization
- PNG and SVG downloads
- Full landing page with pricing, features, FAQ
- Authentication system (Supabase - email + Google OAuth ready)
- Protected dashboard with navigation
- QR code creation page
- Dynamic QR codes with short URL redirects (`/r/[code]`)
- Scan tracking system with analytics
- Database schema deployed to Supabase
- **Stripe integration complete** - checkout, webhooks, customer portal
- Billing UI with subscription details (status, renewal date, billing interval)
- **V2 UI Polish** - Dark navy theme with teal/cyan accents, enhanced glassmorphism
- **SEO Optimized** - Meta tags, OpenGraph, sitemap, robots.txt, JSON-LD structured data

### Optional Enhancements
- Custom domain for short URLs
- Email notifications
- API endpoints for Business tier

## Environment Setup

`.env.local` is fully configured:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://otdlggbhsmgqhsviazho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3322

# Stripe (configured)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_BUSINESS_MONTHLY=price_...
STRIPE_PRICE_BUSINESS_YEARLY=price_...
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page + JSON-LD
│   ├── layout.tsx                  # Root layout + meta tags
│   ├── sitemap.ts                  # Dynamic sitemap
│   ├── robots.ts                   # Robots.txt config
│   ├── globals.css                 # Theme + custom CSS
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login (+ Google OAuth)
│   │   ├── signup/page.tsx         # Signup (+ Google OAuth)
│   │   └── callback/route.ts       # OAuth callback
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard layout
│   │   ├── dashboard/page.tsx      # Overview
│   │   ├── qr-codes/page.tsx       # QR list
│   │   ├── qr-codes/new/page.tsx   # Create QR
│   │   ├── analytics/page.tsx      # Analytics
│   │   └── settings/page.tsx       # Settings + Billing
│   ├── api/stripe/
│   │   ├── checkout/route.ts       # Create checkout session
│   │   ├── webhook/route.ts        # Handle Stripe events
│   │   └── portal/route.ts         # Customer portal
│   └── r/[code]/route.ts           # Dynamic QR redirect
├── components/
│   ├── ui/                         # shadcn components
│   ├── qr/                         # QR components
│   ├── dashboard/                  # Dashboard components
│   ├── pricing/                    # PricingSection component
│   └── billing/                    # BillingSection component
├── hooks/
│   └── useStripe.ts                # Checkout & portal hooks
├── lib/
│   ├── qr/                         # QR generation
│   ├── supabase/                   # Supabase clients
│   └── stripe/                     # Stripe config & client
└── middleware.ts                   # Auth protection
```

## SEO Configuration

**Files:**
- `src/app/layout.tsx` - Comprehensive meta tags, OpenGraph, Twitter cards
- `src/app/sitemap.ts` - Auto-generated sitemap at `/sitemap.xml`
- `src/app/robots.ts` - Search engine rules at `/robots.txt`
- `src/app/page.tsx` - JSON-LD structured data (WebApplication schema)

**Keywords targeted:**
- qr code generator, free qr code, qr code maker
- dynamic qr code, qr code tracking, qr code analytics
- wifi qr code, menu qr code, vcard qr code
- restaurant qr code, business qr code

**To enable Google Search Console:**
1. Add verification meta tag to `layout.tsx` verification object
2. Submit sitemap URL: `https://yourdomain.com/sitemap.xml`

## Database (Supabase)

Tables deployed:
- `profiles` - User profiles with subscription_tier, stripe_customer_id, subscription_status
- `qr_codes` - QR codes with content, style, short_code
- `scans` - Scan analytics (device, location, timestamp)

RLS policies active. Trigger auto-creates profile on signup.

## Key Commands

```bash
cd /Users/bentyson/malazan
npm run dev               # Dev server on port 3322
npm run build             # Production build
```

## Local Development with Stripe

For webhook testing, run Stripe CLI in a separate terminal:
```bash
stripe listen --forward-to localhost:3322/api/stripe/webhook
```

Test card: `4242 4242 4242 4242` (any future expiry, any CVC)

## Business Model

| Tier | Price | Dynamic QRs | Analytics |
|------|-------|-------------|-----------|
| Free | $0 | 0 | No |
| Pro | $9/mo | 50 | Yes |
| Business | $29/mo | Unlimited | Yes |

## Revenue Mechanics

Dynamic QR codes are the key lock-in:
- User prints QR code on menus/cards/materials
- QR points to our short URL (qrforge.com/r/abc123)
- We redirect to their destination
- User CAN'T churn without reprinting all materials

## Subscription Flow

1. User clicks "Upgrade" on pricing or settings page
2. Redirected to Stripe Checkout
3. User completes payment
4. Stripe webhook fires `checkout.session.completed`
5. Webhook updates `profiles.subscription_tier` and `subscription_status`
6. User returns to app with upgraded account
7. Settings page shows subscription details (status, billing cycle, renewal date)
8. "Manage Subscription" button opens Stripe Customer Portal

---

**Quick Start:**
```bash
cd /Users/bentyson/malazan
npm run dev
# Visit http://localhost:3322
```
