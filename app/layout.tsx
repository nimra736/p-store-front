import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Storefront — Shopify Headless Commerce",
  description:
    "A premium headless storefront built with Next.js 15 and the Shopify Storefront API. Browse products with locale-aware pricing via @inContext.",
  keywords: [
    "Shopify",
    "Storefront API",
    "Next.js",
    "Headless Commerce",
    "GraphQL",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        {/* Ambient background glow */}
        <div className="ambient-glow" aria-hidden="true" />

        {/* Main content */}
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
