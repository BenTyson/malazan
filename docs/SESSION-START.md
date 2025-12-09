# QRForge - Session Start Guide

> **Last Updated**: December 8, 2024
> **Status**: Core Features Complete - Ready for Supabase Setup

## Quick Context

QRForge is a premium QR code generator with analytics and dynamic codes. Goal: passive income via SEO-driven traffic and recurring subscriptions.

## Current Status

### Completed
- QR generator with 7 content types (URL, Text, WiFi, vCard, Email, Phone, SMS)
- Real-time preview with style customization
- PNG and SVG downloads
- Full landing page with pricing, features, FAQ
- Authentication system (Supabase - email + Google OAuth)
- Protected dashboard with navigation
- QR code creation page
- Dynamic QR codes with short URL redirects
- Scan tracking system
- Database schema ready

### Needs Setup
- **Supabase project** - Create at supabase.com, run `supabase/schema.sql`
- **Stripe integration** - For payments (next priority)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx         # Login
│   │   ├── signup/page.tsx        # Signup
│   │   └── callback/route.ts      # OAuth callback
│   ├── (dashboard)/
│   │   ├── layout.tsx             # Dashboard layout
│   │   ├── dashboard/page.tsx     # Overview
│   │   ├── qr-codes/page.tsx      # QR list
│   │   ├── qr-codes/new/page.tsx  # Create QR
│   │   ├── analytics/page.tsx     # Analytics
│   │   └── settings/page.tsx      # Settings
│   └── r/[code]/route.ts          # Dynamic QR redirect
├── components/
│   ├── ui/                        # shadcn components
│   ├── qr/                        # QR components
│   └── dashboard/                 # Dashboard components
├── lib/
│   ├── qr/                        # QR generation
│   └── supabase/                  # Supabase clients
└── middleware.ts                  # Auth protection
```

## Setup Instructions

### 1. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Database Schema
Run `supabase/schema.sql` in your Supabase SQL editor. This creates:
- `profiles` - User profiles with subscription tier
- `qr_codes` - QR codes with content and style
- `scans` - Scan analytics

### 3. Supabase Auth
Enable Email and Google providers in Authentication settings.

## Key Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm start        # Start production
```

## Next Priority: Stripe Integration

To enable payments:
1. Create Stripe account
2. Create products: Pro ($9/mo), Business ($29/mo)
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_WEBHOOK_SECRET=
   ```
4. Create checkout and webhook routes

## Business Model

| Tier | Price | Dynamic QRs | Analytics |
|------|-------|-------------|-----------|
| Free | $0 | 0 | No |
| Pro | $9/mo | 50 | Yes |
| Business | $29/mo | Unlimited | Yes |

## Revenue Mechanics

Dynamic QR codes are the key:
- User prints QR code on menus/cards/materials
- QR code points to our short URL (qrforge.com/r/abc123)
- We redirect to their destination
- User CAN'T churn without reprinting all materials
- Natural lock-in = recurring revenue

---

**Quick Start:**
```bash
cd /Users/bentyson/malazan
npm run dev -- -p 3322
```
