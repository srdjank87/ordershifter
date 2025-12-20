"use client";

import { Suspense } from "react";
import SettingsClient from "./SettingsClient";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm opacity-70">Loading settings…</div>}>
      <SettingsClient />
    </Suspense>
  );
}
