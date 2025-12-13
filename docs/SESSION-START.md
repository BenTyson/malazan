# QRForge - Session Start Guide

> **Last Updated**: December 9, 2024
> **Status**: Core App Complete - Stripe Integration Pending

## Quick Context

QRForge is a premium QR code generator with analytics and dynamic codes. Goal: passive income via SEO-driven traffic and recurring subscriptions.

## Current Status

### Completed
- Next.js 14 app with TypeScript + Tailwind CSS v4
- QR generator with 7 content types (URL, Text, WiFi, vCard, Email, Phone, SMS)
- Real-time preview with style customization
- PNG and SVG downloads
- Full landing page with pricing, features, FAQ
- Authentication system (Supabase - email auth working)
- Protected dashboard with navigation
- QR code creation page
- Dynamic QR codes with short URL redirects (`/r/[code]`)
- Scan tracking system with analytics
- Database schema deployed to Supabase
- Billing UI components (ready for Stripe)

### Needs Setup
- **Stripe integration** - API routes exist, just needs keys configured
- **Google OAuth** (optional) - Can add later

## Environment Setup

`.env.local` is configured with Supabase. Missing Stripe keys:
```
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_YEARLY=
STRIPE_PRICE_BUSINESS_MONTHLY=
STRIPE_PRICE_BUSINESS_YEARLY=
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login
│   │   ├── signup/page.tsx         # Signup
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

## Database (Supabase)

Tables deployed:
- `profiles` - User profiles with subscription_tier, stripe_customer_id
- `qr_codes` - QR codes with content, style, short_code
- `scans` - Scan analytics (device, location, timestamp)

RLS policies active. Trigger auto-creates profile on signup.

## Key Commands

```bash
cd /Users/bentyson/malazan
npm run dev               # Dev server on port 3322
npm run build             # Production build
```

## Next Priority: Stripe Setup

To enable payments:
1. Create Stripe account at stripe.com
2. Create products in Stripe Dashboard:
   - Pro Monthly: $9/mo
   - Pro Yearly: $90/yr
   - Business Monthly: $29/mo
   - Business Yearly: $290/yr
3. Copy price IDs and keys to `.env.local`
4. Set up webhook endpoint for production

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

---

**Quick Start:**
```bash
cd /Users/bentyson/malazan
npm run dev
# Visit http://localhost:3322
```
