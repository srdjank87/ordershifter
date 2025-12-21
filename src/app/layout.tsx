import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import type { ReactNode } from "react";
import { ShopifyAppBridgeLoader } from "@/components/ShopifyAppBridgeLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OrderShifter",
  description:
    "OrderShifter helps 3PLs automate Shopify order flows, reduce exceptions, and retain merchants.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <script async src="https://cdn.shopify.com/shopifycloud/app-bridge.js" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ShopifyAppBridgeLoader />
        {children}
      </body>
    </html>
  );
}
