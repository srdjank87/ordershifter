import { Suspense } from "react";
import AppHomeClient from "./AppHomeClient";

export default function AppPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm opacity-70">Loading…</div>}>
      <AppHomeClient />
    </Suspense>
  );
}
