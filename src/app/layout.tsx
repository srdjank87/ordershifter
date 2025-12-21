import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import type { ReactNode } from "react";

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
        {/* Inline the App Bridge library content directly */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.shopifyAppBridgeCDNLoaded = true;
              // Create script element synchronously
              var s = document.createElement('script');
              s.src = 'https://cdn.shopify.com/shopifycloud/app-bridge.js';
              s.type = 'text/javascript';
              s.async = false;
              s.onload = function() { window.shopifyAppBridgeLoaded = true; };
              var h = document.getElementsByTagName('head')[0];
              if (h) h.appendChild(s);
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
