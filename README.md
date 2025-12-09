# QRForge

A modern, premium QR code generator with analytics and dynamic codes. Built for passive income through SEO-driven traffic and recurring subscriptions.

## Features

- **7 QR Code Types**: URL, Text, WiFi, vCard, Email, Phone, SMS
- **Real-time Preview**: Instant QR code generation as you type
- **Custom Styling**: Color presets, custom colors, error correction levels
- **Multiple Formats**: PNG and SVG downloads
- **Dark Mode**: Premium dark-first design with Indigo/Violet accents

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **QR Generation**: qrcode library
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page with QR generator
│   ├── layout.tsx         # Root layout with SEO
│   └── globals.css        # Custom theme
├── components/
│   ├── ui/                # shadcn/ui components
│   └── qr/                # QR-specific components
└── lib/
    └── qr/                # QR generation logic
docs/
└── SESSION-START.md       # Development context
```

## Environment Variables

```env
# Supabase (for auth/database - coming soon)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe (for payments - coming soon)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Deployment

This project is configured for Railway deployment.

## License

Private - All rights reserved.
