import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "OrderShifter App",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
