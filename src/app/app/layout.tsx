import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OrderShifter App",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js" async />
      {children}
    </>
  );
}
