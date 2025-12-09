# QRForge - Session Start Guide

> **Last Updated**: December 8, 2024
> **Status**: Phase 1 Complete - MVP Ready

## Quick Context

QRForge is a premium QR code generator with analytics and dynamic codes. The goal is passive income via SEO-driven traffic and recurring subscriptions for dynamic QR code hosting.

## Current Status: MVP COMPLETE

The core QR generator is fully functional with:
- Real-time QR code preview
- 7 content types (URL, Text, WiFi, vCard, Email, Phone, SMS)
- Style customization (colors, presets, error correction)
- PNG and SVG downloads
- Complete landing page with pricing, features, FAQ

## Project Structure

```
/Users/bentyson/malazan/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing page with QR generator (DONE)
│   │   ├── layout.tsx          # Root layout with SEO meta (DONE)
│   │   └── globals.css         # Custom dark theme (DONE)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components (14 installed)
│   │   └── qr/
│   │       ├── QRGenerator.tsx # Main generator component (DONE)
│   │       ├── QRPreview.tsx   # Real-time preview (DONE)
│   │       ├── QRTypeSelector.tsx # Content type tabs (DONE)
│   │       ├── QRStyleEditor.tsx # Color/style customization (DONE)
│   │       └── index.ts        # Exports
│   └── lib/
│       ├── utils.ts            # shadcn utils
│       └── qr/
│           ├── generator.ts    # QR generation logic (DONE)
│           ├── types.ts        # TypeScript types (DONE)
│           └── index.ts        # Exports
├── docs/
│   └── SESSION-START.md        # This file
└── public/                     # Static assets
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.8 | Framework (App Router) |
| React | 19.2.1 | UI Library |
| Tailwind CSS | v4 | Styling |
| shadcn/ui | Latest | Component library |
| qrcode | 1.5.4 | QR generation |
| TypeScript | 5.x | Type safety |

## Installed shadcn Components

button, input, card, tabs, label, slider, switch, dialog, dropdown-menu, select, sonner, separator, badge, tooltip

## Key Commands

```bash
# Development
npm run dev

# Build (verified working)
npm run build

# Start production
npm start

# Type check
npx tsc --noEmit
```

## Implementation Status

### Phase 1: Foundation - COMPLETE
- [x] Next.js 14 project initialized
- [x] Tailwind CSS v4 configured
- [x] shadcn/ui installed with 14 components
- [x] QR code library installed
- [x] Custom dark theme with Indigo/Violet accents
- [x] Documentation structure

### Phase 2: QR Generator - COMPLETE
- [x] QR generation engine (all 7 types)
- [x] Real-time preview with debouncing
- [x] Type selector component
- [x] Style customization (8 presets + custom)
- [x] Error correction levels
- [x] PNG and SVG downloads

### Phase 3: Landing Page - COMPLETE
- [x] Hero section with embedded generator
- [x] Navigation with glass effect
- [x] Features section (6 cards)
- [x] Use cases grid (8 categories)
- [x] Pricing section (3 tiers)
- [x] FAQ section (5 questions)
- [x] Footer

### Phase 4: User System - NOT STARTED
- [ ] Supabase setup
- [ ] Authentication (email + Google)
- [ ] User dashboard
- [ ] QR code management

### Phase 5: Dynamic QR Codes - NOT STARTED
- [ ] Short URL redirect system
- [ ] Destination editing
- [ ] Scan tracking

### Phase 6: Analytics - NOT STARTED
- [ ] Scan analytics dashboard
- [ ] Charts and visualizations
- [ ] Export functionality

### Phase 7: Payments - NOT STARTED
- [ ] Stripe Checkout integration
- [ ] Subscription webhooks
- [ ] Tier-based feature gating

### Phase 8: Launch - NOT STARTED
- [ ] Error monitoring (Sentry)
- [ ] Production analytics
- [ ] Vercel deployment

## Next Priority Tasks

1. **Set up Supabase** - Database and auth
2. **Create user dashboard** - Protected routes
3. **Implement dynamic QR codes** - The key monetization feature
4. **Add Stripe payments** - Enable subscriptions

## Environment Variables Needed

```env
# Supabase (required for auth/database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (required for payments)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Design System

**Colors (Dark Mode Default):**
- Background: `#0a0a0b`
- Surface/Card: `#18181b`
- Primary: `#6366f1` (Indigo)
- Accent: `#8b5cf6` (Violet)
- Success: `#10b981` (Emerald)
- Text: `#fafafa`
- Muted: `#a1a1aa`

**Custom CSS Classes:**
- `.gradient-text` - Indigo-to-violet gradient text
- `.glass` - Frosted glass card effect
- `.glow` - Primary color glow shadow
- `.glow-hover` - Glow on hover
- `.animate-qr-pulse` - Subtle QR pulse animation

## Business Model

| Tier | Price | Key Features |
|------|-------|--------------|
| Free | $0 | Static QR, basic colors, watermark |
| Pro | $9/mo | Dynamic QR, analytics, logo, SVG |
| Business | $29/mo | API, bulk, teams, white-label |

## Revenue Projection

- 10K monthly visitors (SEO-driven)
- 2% conversion = 200 paying users
- Average $15/user = **$3,000/month**

---

## Quick Start for New Session

```bash
cd /Users/bentyson/malazan
npm run dev
# Open http://localhost:3000
```

Then proceed with the next priority task from the list above.
