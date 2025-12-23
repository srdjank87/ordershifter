export default function AppBridgeTestLayout({ children }: { children: React.ReactNode }) {
  // Script is loaded in root layout - no need to duplicate here
  return <>{children}</>;
}
