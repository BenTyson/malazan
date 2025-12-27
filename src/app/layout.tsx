import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrforge.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QRWolf - Free QR Code Generator with Analytics & Tracking",
    template: "%s | QRWolf",
  },
  description: "Create professional QR codes in seconds. Free QR code generator with custom colors, logos, dynamic URLs, and real-time scan analytics. Perfect for restaurants, marketing, business cards, and events.",
  keywords: [
    "qr code generator",
    "free qr code",
    "qr code maker",
    "dynamic qr code",
    "qr code with logo",
    "qr code tracking",
    "qr code analytics",
    "wifi qr code",
    "menu qr code",
    "vcard qr code",
    "restaurant qr code",
    "business qr code",
    "qr code creator",
    "custom qr code",
    "trackable qr code",
  ],
  authors: [{ name: "QRWolf" }],
  creator: "QRWolf",
  publisher: "QRWolf",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "QRWolf - Free QR Code Generator with Analytics",
    description: "Create professional QR codes in seconds. Custom colors, logos, dynamic URLs, and real-time scan analytics.",
    url: siteUrl,
    siteName: "QRWolf",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QRWolf - Professional QR Code Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QRWolf - Free QR Code Generator",
    description: "Create professional QR codes with custom colors, logos, and real-time analytics.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you have them:
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
