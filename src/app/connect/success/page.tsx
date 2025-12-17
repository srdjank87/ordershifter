import { Suspense } from "react";
import ConnectSuccessClient from "./ConnectSuccessClient";

export default function ConnectSuccessPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm opacity-70">Loading…</div>}>
      <ConnectSuccessClient />
    </Suspense>
  );
}
