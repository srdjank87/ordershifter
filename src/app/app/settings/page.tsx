"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AppContextOk = {
  ok: true;
  shop: string;
  tenantId: string;
  tenantName: string;
};

type AppContextErr = {
  ok: false;
  error: string;
  code?: string;
  shop?: string;
  host?: string;
};

type AppContext = AppContextOk | AppContextErr;

type TestResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export default function SettingsPage() {
  const [ctx, setCtx] = useState<AppContext | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const [demoMode, setDemoMode] = useState(false);
  const [savingDemoMode, setSavingDemoMode] = useState(false);

  // Pull shop/host from URL (when embedded) or from sessionStorage (fallback)
  const sp = useMemo(() => new URLSearchParams(window.location.search), []);
  const shop = sp.get("shop") || sessionStorage.getItem("os_shop") || "";
  const host = sp.get("host") || sessionStorage.getItem("os_host") || "";

  useEffect(() => {
    // Persist latest values when present
    const embedded = sp.get("embedded");
    if (sp.get("shop")) sessionStorage.setItem("os_shop", sp.get("shop") as string);
    if (sp.get("host")) sessionStorage.setItem("os_host", sp.get("host") as string);
    if (embedded) sessionStorage.setItem("os_embedded", embedded);

    const load = async () => {
      try {
        const url = `/api/app/context?shop=${encodeURIComponent(shop)}&host=${encodeURIComponent(host)}`;
        const res = await fetch(url, { credentials: "include" });
        const data = (await res.json()) as AppContext;
        setCtx(data);
      } catch (e) {
        setCtx({ ok: false, error: "Failed to load app context" });
      }
    };

    if (shop) load();
    else setCtx({ ok: false, error: "Missing shop. Open this inside Shopify admin." });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load demo-mode setting (stored server-side)
  useEffect(() => {
    const loadDemoMode = async () => {
      try {
        const res = await fetch(
          `/api/app/settings?shop=${encodeURIComponent(shop)}&host=${encodeURIComponent(host)}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data?.ok && typeof data.demoMode === "boolean") setDemoMode(data.demoMode);
      } catch {
        // ignore
      }
    };
    if (shop) loadDemoMode();
  }, [shop, host]);

  const runConnectionTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(
        `/api/app/settings/test?shop=${encodeURIComponent(shop)}&host=${encodeURIComponent(host)}`,
        { method: "POST", credentials: "include" }
      );
      const data = (await res.json()) as TestResult;
      setTestResult(data);
    } catch {
      setTestResult({ ok: false, error: "Test failed (network/server error)" });
    } finally {
      setTesting(false);
    }
  };

  const saveDemoMode = async (nextVal: boolean) => {
    setSavingDemoMode(true);
    setDemoMode(nextVal);
    try {
      await fetch(
        `/api/app/settings?shop=${encodeURIComponent(shop)}&host=${encodeURIComponent(host)}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ demoMode: nextVal }),
        }
      );
    } finally {
      setSavingDemoMode(false);
    }
  };

  const portalTitle =
    ctx && ctx.ok ? `${ctx.tenantName} Portal` : "Portal Settings";

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{portalTitle}</h1>
            <p className="text-sm opacity-70">
              Configure your connection, visibility, and export preferences.
            </p>
          </div>

          <Link href="/app" className="btn btn-outline btn-sm">
            Back to Portal
          </Link>
        </div>

        {/* Context / Connection card */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Connection Status</h2>
              <button
                className="btn btn-sm btn-primary"
                onClick={runConnectionTest}
                disabled={testing || !shop}
              >
                {testing ? "Testing..." : "Run Connection Test"}
              </button>
            </div>

            <div className="text-sm opacity-80 space-y-1">
              <div>
                <span className="font-semibold">Shop:</span>{" "}
                <span className="opacity-80">{shop || "—"}</span>
              </div>

              {ctx?.ok ? (
                <>
                  <div>
                    <span className="font-semibold">3PL:</span>{" "}
                    <span className="opacity-80">{ctx.tenantName}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className="text-success font-semibold">Connected</span>
                  </div>
                </>
              ) : (
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="text-warning font-semibold">Not Connected</span>
                  <div className="text-xs opacity-70 mt-1">
                    {ctx?.error || "—"}
                  </div>
                </div>
              )}
            </div>

            {testResult && (
              <div
                className={`rounded-xl border p-3 text-sm ${
                  testResult.ok
                    ? "border-success/40 bg-success/10"
                    : "border-error/40 bg-error/10"
                }`}
              >
                {testResult.ok ? testResult.message : testResult.error}
              </div>
            )}
          </div>
        </div>

        {/* Demo / reviewer-friendly toggles */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="text-base font-semibold">Review Mode</h2>
            <p className="text-sm opacity-80">
              If order access is pending approval, enable demo data so the portal
              stays useful during review.
            </p>

            <div className="flex items-center justify-between gap-4">
              <div className="text-sm">
                <div className="font-semibold">Enable demo data</div>
                <div className="text-xs opacity-70">
                  Shows sample orders/exceptions/export logs in this portal.
                </div>
              </div>

              <button
                className={`btn btn-sm ${demoMode ? "btn-success" : "btn-outline"}`}
                onClick={() => saveDemoMode(!demoMode)}
                disabled={savingDemoMode || !shop}
              >
                {savingDemoMode ? "Saving..." : demoMode ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>

        {/* Export / WMS handoff (core value) */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="text-base font-semibold">WMS Export (Coming Next)</h2>
            <p className="text-sm opacity-80">
              OrderShifter’s goal is to hand your WMS only clean, verified orders —
              via SFTP/CSV or API — on your schedule.
            </p>

            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-base-100 border border-base-300 p-3 space-y-1">
                <div className="font-semibold">Export schedule</div>
                <div className="text-xs opacity-70">
                  Example: every 15 minutes, or hourly, or daily at 6pm.
                </div>
                <div className="opacity-70">Status: Not configured</div>
              </div>

              <div className="rounded-xl bg-base-100 border border-base-300 p-3 space-y-1">
                <div className="font-semibold">Destination</div>
                <div className="text-xs opacity-70">
                  SFTP folder, email drop, or API endpoint.
                </div>
                <div className="opacity-70">Status: Not configured</div>
              </div>
            </div>
          </div>
        </div>

        {/* Support / compliance links */}
        <div className="text-xs opacity-70 flex flex-wrap gap-3 justify-center pt-2">
          <Link className="link link-hover" href="/privacy">
            Privacy
          </Link>
          <Link className="link link-hover" href="/terms">
            Terms
          </Link>
          <Link className="link link-hover" href="/support">
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
