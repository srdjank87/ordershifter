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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
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
                <div className="label">
                  <span className="label-text-alt opacity-70">
                    Portal header will display "{tenantName.trim() ? `${tenantName.trim()} Portal` : "Portal"}"
                  </span>
                </div>
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Logo URL (optional)</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  value={tenantLogoUrl}
                  onChange={(e) => setTenantLogoUrl(e.target.value)}
                  placeholder="https://..."
                  disabled={loading}
                />
                <div className="label">
                  <span className="label-text-alt opacity-70">
                    &nbsp;
                  </span>
                </div>
              </label>
            </div>

            {tenantLogoUrl.trim() && (
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl border border-base-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tenantLogoUrl.trim()}
                  alt="Logo preview"
                  className="w-10 h-10 rounded-lg border border-base-300 object-contain bg-base-200"
                />
                <div className="text-sm">
                  <div className="font-semibold">Logo Preview</div>
                  <div className="opacity-70 text-xs">How it will appear in the portal</div>
                </div>
              </div>
            )}
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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
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
                    Wait time before marking orders as ready (0-72 hours)
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
                    How often to check for orders ready to export (1-240 minutes)
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* WMS Export (Coming Soon) */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="text-base font-semibold">WMS Export (Coming Next)</h2>
            <p className="text-sm opacity-80">
              OrderShifter's goal is to hand your WMS only clean, verified orders — via SFTP/CSV or API — on your schedule.
            </p>

            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-base-100 border border-base-300 p-3 space-y-1">
                <div className="font-semibold">Export Schedule</div>
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
