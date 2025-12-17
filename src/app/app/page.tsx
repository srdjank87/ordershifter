import { Suspense } from "react";
import AppHomeClient from "./AppHomeClient";

export default function AppPage() {
  return (
    <Suspense fallback={<AppHomeLoading />}>
      <AppHomeClient />
    </Suspense>
  );
}

function AppHomeLoading() {
  return (
    <main className="min-h-screen bg-base-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="font-semibold">Loading OrderShifter…</div>
            <div className="text-sm opacity-70 mt-1">
              Connecting to Shopify context.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
