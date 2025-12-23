import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OrderShifter App",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Script is loaded in root layout - no need to duplicate here
  return <>{children}</>;
}
