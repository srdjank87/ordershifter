export default function AppBridgeTestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js" async />
      {children}
    </>
  );
}
