"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import createApp, { type ClientApplication } from "@shopify/app-bridge";
import { authenticatedFetch } from "@shopify/app-bridge/utilities";

type ErrDTO = { ok: false; error: string; code?: string };

type SettingsDTO = {
  ok: true;
  tenantId: string;
  tenantName: string;
  tenantLogoUrl: string | null;
  demoMode: boolean;
  delayHours: number;
  exportFrequencyMinutes: number;
};

function isErrDTO(v: unknown): v is ErrDTO {
  return (
    typeof v === "object" &&
    v !== null &&
    "ok" in v &&
    (v as { ok: unknown }).ok === false &&
    "error" in v &&
    typeof (v as { error: unknown }).error === "string"
  );
}

function isSettingsDTO(v: unknown): v is SettingsDTO {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    o.ok === true &&
    typeof o.tenantId === "string" &&
    typeof o.tenantName === "string" &&
    (o.tenantLogoUrl === null || typeof o.tenantLogoUrl === "string") &&
    typeof o.demoMode === "boolean" &&
    typeof o.delayHours === "number" &&
    typeof o.exportFrequencyMinutes === "number"
  );
}

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(key);
}

function writeStorage(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key, value);
}

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: "Invalid JSON response" } satisfies ErrDTO;
  }
}

function clampInt(v: string, fallback: number, min: number, max: number) {
  const n = Number.parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

export default function SettingsClient() {
  const sp = useSearchParams();

  // Prefer URL params, fall back to sessionStorage set by AppHome.
  const qpShop = sp.get("shop");
  const qpHost = sp.get("host");

  const [shop, setShop] = useState<string>(qpShop ?? readStorage("os_shop") ?? "");
  const [host, setHost] = useState<string>(qpHost ?? readStorage("os_host") ?? "");

  useEffect(() => {
    if (qpShop) {
      writeStorage("os_shop", qpShop);
      setShop(qpShop);
    }
    if (qpHost) {
      writeStorage("os_host", qpHost);
      setHost(qpHost);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qpShop, qpHost]);

  const app = useMemo<ClientApplication | null>(() => {
    if (typeof window === "undefined") return null;
    if (!host) return null;

    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;
    if (!apiKey) return null;

    return createApp({ apiKey, host, forceRedirect: true });
  }, [host]);

  // Helper: authenticated fetch when embedded, otherwise plain fetch (dev / non-embedded)
  async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
    if (app) {
      const af = authenticatedFetch(app);
      return af(path, init);
    }
    return fetch(path, init);
  }

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (shop) p.set("shop", shop);
    if (host) p.set("host", host);
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [shop, host]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const [tenantName, setTenantName] = useState("");
  const [tenantLogoUrl, setTenantLogoUrl] = useState<string>("");
  const [demoMode, setDemoMode] = useState(false);
  const [delayHours, setDelayHours] = useState(2);
  const [exportFrequencyMinutes, setExportFrequencyMinutes] = useState(15);

  async function load() {
    setLoading(true);
    setErr(null);
    setOkMsg(null);

    try {
      // If host is missing we *cannot* get a session token. Stop early with a useful message.
      if (!host) {
        throw new Error(
          "Missing host. Open Settings from inside Shopify admin (or include ?host=…&shop=… in the URL).",
        );
      }

      const res = await authedFetch(`/api/app/settings${qs}`, { method: "GET" });
      const payload = await readJson(res);

      if (!res.ok) {
        const msg = isErrDTO(payload) ? payload.error : `Failed to load settings (${res.status})`;
        throw new Error(msg);
      }

      if (!isSettingsDTO(payload)) {
        throw new Error("Failed to load settings (unexpected response).");
      }

      setTenantName(payload.tenantName ?? "");
      setTenantLogoUrl(payload.tenantLogoUrl ?? "");
      setDemoMode(Boolean(payload.demoMode));
      setDelayHours(payload.delayHours ?? 2);
      setExportFrequencyMinutes(payload.exportFrequencyMinutes ?? 15);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs, host]);

  async function onSave() {
    setSaving(true);
    setErr(null);
    setOkMsg(null);

    try {
      if (!host) {
        throw new Error(
          "Missing host. Open Settings from inside Shopify admin (or include ?host=…&shop=… in the URL).",
        );
      }

      const body = {
        // Single source of truth:
        tenantName: tenantName.trim(),
        tenantLogoUrl: tenantLogoUrl.trim() || null,

        demoMode,
        delayHours,
        exportFrequencyMinutes,

        // Backward compat if your API still expects these fields:
        portalTitle: null,
        portalLogoUrl: tenantLogoUrl.trim() || null,
      };

      const res = await authedFetch(`/api/app/settings${qs}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = await readJson(res);

      if (!res.ok) {
        const msg = isErrDTO(payload) ? payload.error : `Failed to save (${res.status})`;
        throw new Error(msg);
      }

      setOkMsg("Saved.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const portalTitle = tenantName.trim() ? `${tenantName.trim()} Portal` : "Portal Settings";

  async function saveDemoMode(nextVal: boolean) {
    setSaving(true);
    setDemoMode(nextVal);
    setErr(null);
    setOkMsg(null);

    try {
      if (!host) {
        throw new Error("Missing host. Open Settings from inside Shopify admin.");
      }

      // First, update the setting
      const settingsRes = await authedFetch(`/api/app/settings${qs}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoMode: nextVal }),
      });

      const settingsPayload = await readJson(settingsRes);

      if (!settingsRes.ok) {
        const msg = isErrDTO(settingsPayload) ? settingsPayload.error : `Failed to save (${settingsRes.status})`;
        throw new Error(msg);
      }

      // Then seed or clear demo data based on the toggle
      if (nextVal) {
        // Enabling demo mode - seed demo data
        const seedRes = await authedFetch(`/api/app/demo/seed${qs}`, {
          method: "POST",
        });

        const seedPayload = await readJson(seedRes);

        if (!seedRes.ok && seedRes.status !== 200) {
          // Non-critical error - demo mode is on, but seeding failed
          console.warn("Demo seed warning:", seedPayload);
        }

        setOkMsg("Demo mode enabled. Sample data is now visible in the dashboard.");
      } else {
        // Disabling demo mode - clear demo data
        const clearRes = await authedFetch(`/api/app/demo/clear${qs}`, {
          method: "POST",
        });

        const clearPayload = await readJson(clearRes);

        if (!clearRes.ok) {
          console.warn("Demo clear warning:", clearPayload);
        }

        setOkMsg("Demo mode disabled. Sample data has been removed.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save demo mode");
      setDemoMode(!nextVal); // Revert on error
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{portalTitle}</h1>
            <p className="text-sm opacity-70">
              Configure your connection, branding, and export preferences.
            </p>
          </div>

          <Link href="/app" className="btn btn-primary btn-sm">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Error/Success Messages */}
        {err && (
          <div className="alert alert-error">
            <span>{err}</span>
          </div>
        )}
        {okMsg && (
          <div className="alert alert-success">
            <span>{okMsg}</span>
          </div>
        )}

        {/* Two Column Grid - Connection & Branding */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Connection Status */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body space-y-3">
              <h2 className="text-base font-semibold">Connection Status</h2>

              <div className="text-sm opacity-80 space-y-1">
                <div>
                  <span className="font-semibold">Shop:</span>{" "}
                  <span className="opacity-80">{shop || "—"}</span>
                </div>

                {!loading && tenantName ? (
                  <>
                    <div>
                      <span className="font-semibold">3PL:</span>{" "}
                      <span className="opacity-80">{tenantName}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span>{" "}
                      <span className="text-success font-semibold">Connected</span>
                    </div>
                  </>
                ) : loading ? (
                  <div className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm" />
                    <span className="opacity-70">Loading connection status...</span>
                  </div>
                ) : (
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className="text-warning font-semibold">Not Connected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Demo Mode */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body space-y-3">
              <h2 className="text-base font-semibold">Review Mode</h2>
              <p className="text-sm opacity-80">
                Enable demo data so the portal stays useful during Shopify review.
              </p>

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm">
                  <div className="font-semibold">Demo data</div>
                  <div className="text-xs opacity-70">
                    Sample orders/exceptions/exports
                  </div>
                </div>

                <input
                  type="checkbox"
                  className="toggle toggle-success toggle-lg"
                  checked={demoMode}
                  onChange={(e) => saveDemoMode(e.target.checked)}
                  disabled={saving || loading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Grid - Branding & Order Processing */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Branding Settings */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-base font-semibold">Branding</h2>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={onSave}
                  disabled={saving || loading}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">3PL Name</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder='e.g. "Acme Fulfillment"'
                  disabled={loading}
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Logo URL</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  value={tenantLogoUrl}
                  onChange={(e) => setTenantLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  disabled={loading}
                />
                <div className="label">
                  <span className="label-text-alt opacity-70">
                    Enter a URL to your logo (PNG or JPG)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Order Processing Settings */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-base font-semibold">Order Processing</h2>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={onSave}
                  disabled={saving || loading}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>

              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">Default Delay (hours)</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  inputMode="numeric"
                  value={String(delayHours)}
                  onChange={(e) => setDelayHours(clampInt(e.target.value, delayHours, 0, 72))}
                  disabled={loading}
                />
                <div className="label">
                  <span className="label-text-alt opacity-70">
                    Wait time before orders become ready (0-72)
                  </span>
                </div>
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">Export Frequency (minutes)</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  inputMode="numeric"
                  value={String(exportFrequencyMinutes)}
                  onChange={(e) =>
                    setExportFrequencyMinutes(
                      clampInt(e.target.value, exportFrequencyMinutes, 1, 240),
                    )
                  }
                  disabled={loading}
                />
                <div className="label">
                  <span className="label-text-alt opacity-70">
                    How often to check for ready orders (1-240)
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Portal Header Preview */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="text-base font-semibold">Portal Header Preview</h2>
            <p className="text-sm opacity-80">
              This is how your portal header will appear to users.
            </p>

            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <div className="flex items-center gap-4">
                {tenantLogoUrl.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tenantLogoUrl.trim()}
                    alt="Portal logo"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">
                    {tenantName.trim() ? `${tenantName.trim()} Portal` : "Portal"}
                  </h1>
                  <p className="text-sm opacity-70">Order Exception Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WMS Export Configuration */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">WMS Export Configuration</h2>
                <p className="text-sm opacity-80">
                  Configure how clean, verified orders are exported to your WMS.
                </p>
              </div>
              <span className="badge badge-warning">Coming Soon</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Export Method */}
              <div className="space-y-3">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold">Export Method</span>
                  </div>
                  <select className="select select-bordered w-full" disabled>
                    <option>CSV Download</option>
                    <option>SFTP Upload</option>
                    <option>API Webhook</option>
                    <option>Email Attachment</option>
                  </select>
                  <div className="label">
                    <span className="label-text-alt opacity-70">
                      How orders are delivered to your WMS
                    </span>
                  </div>
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold">Export Schedule</span>
                  </div>
                  <select className="select select-bordered w-full" disabled>
                    <option>Every {exportFrequencyMinutes} minutes</option>
                    <option>Hourly</option>
                    <option>Daily at 6:00 PM</option>
                    <option>Manual only</option>
                  </select>
                  <div className="label">
                    <span className="label-text-alt opacity-70">
                      When to automatically export ready orders
                    </span>
                  </div>
                </label>
              </div>

              {/* Connection Details */}
              <div className="space-y-3">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold">SFTP Host</span>
                  </div>
                  <input
                    type="text"
                    placeholder="sftp.example.com"
                    className="input input-bordered w-full"
                    disabled
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold">SFTP Path</span>
                  </div>
                  <input
                    type="text"
                    placeholder="/incoming/orders/"
                    className="input input-bordered w-full"
                    disabled
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold">Username</span>
                  </div>
                  <input
                    type="text"
                    placeholder="wms-user"
                    className="input input-bordered w-full"
                    disabled
                  />
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-info/10 border border-info/30 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-info mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm space-y-1">
                  <p className="font-semibold">Why Export Configuration Matters</p>
                  <p className="opacity-80">
                    OrderShifter only exports orders that have passed the Exception Gate — meaning they're stable,
                    correct, and compliant. This prevents messy data from entering your WMS and eliminates costly rework.
                  </p>
                  <p className="opacity-80 text-xs pt-1">
                    Most 3PLs go live without touching their WMS configuration. Export features will be available soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
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
