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

export const metadata: Metadata = {
  title: "QRForge - Free QR Code Generator with Analytics",
  description: "Create stunning QR codes in seconds. Free QR code generator with custom colors, logos, and analytics. Perfect for businesses, marketing, and personal use.",
  keywords: ["qr code generator", "free qr code", "qr code maker", "dynamic qr code", "qr code with logo", "qr code tracking", "wifi qr code"],
  authors: [{ name: "QRForge" }],
  openGraph: {
    title: "QRForge - Free QR Code Generator",
    description: "Create stunning QR codes in seconds. Free, customizable, with analytics.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QRForge - Free QR Code Generator",
    description: "Create stunning QR codes in seconds.",
  },
  robots: {
    index: true,
    follow: true,
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
