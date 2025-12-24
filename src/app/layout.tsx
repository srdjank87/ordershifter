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
  const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;

  return (
    <html lang="en" data-theme="light">
      <head>
        {/* Shopify App Bridge CDN script - loaded synchronously as first script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var script = document.createElement('script');
                script.src = 'https://cdn.shopify.com/shopifycloud/app-bridge.js';
                // Don't set script.async - leave it undefined for synchronous loading

                var firstScript = document.querySelector('script');
                if (firstScript && firstScript.parentNode) {
                  firstScript.parentNode.insertBefore(script, firstScript);
                } else {
                  document.head.appendChild(script);
                }
              })();
            `,
          }}
          suppressHydrationWarning
        />

        {/* Meta tag required by Shopify's automated checker */}
        {apiKey && (
          <meta name="shopify-api-key" content={apiKey} />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
