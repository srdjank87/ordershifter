"use client";

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

  const portalPreview = tenantName.trim() ? `${tenantName.trim()} Portal` : "Portal";

  return (
    <main className="min-h-screen bg-base-200 text-base-content">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
        {/* Header row */}
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
              <p className="text-sm opacity-70">
                Update branding and demo behavior for this portal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {shop ? (
                <div className="px-3 py-2 rounded-xl bg-base-200 border border-base-300 text-sm">
                  <div className="opacity-70 text-xs">Store</div>
                  <div className="font-semibold">{shop}</div>
                </div>
              ) : null}

              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={onSave}
                disabled={saving || loading}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>

          {err ? (
            <div className="mt-3 alert alert-error">
              <span>{err}</span>
            </div>
          ) : null}

          {okMsg ? (
            <div className="mt-3 alert alert-success">
              <span>{okMsg}</span>
            </div>
          ) : null}
        </div>

        {/* Two-card layout (like the original best version) */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Branding */}
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Branding</h2>
              <span className="badge badge-ghost">{portalPreview}</span>
            </div>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">3PL name</span>
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
                  The portal header will show “{portalPreview}”.
                </span>
              </div>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Logo URL (optional)</span>
              </div>
              <input
                className="input input-bordered w-full"
                value={tenantLogoUrl}
                onChange={(e) => setTenantLogoUrl(e.target.value)}
                placeholder="https://…"
                disabled={loading}
              />
            </label>

            <div className="flex items-center gap-3">
              {tenantLogoUrl.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tenantLogoUrl.trim()}
                  alt="Logo preview"
                  className="w-10 h-10 rounded-lg border border-base-300 object-contain bg-base-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg border border-base-300 bg-base-200 flex items-center justify-center text-xs opacity-60">
                  Logo
                </div>
              )}

              <div className="text-sm">
                <div className="font-semibold">{portalPreview}</div>
                <div className="opacity-70">Preview</div>
              </div>
            </div>
          </div>

          {/* Demo + defaults */}
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-5 shadow-sm space-y-3">
            <h2 className="font-semibold">Demo &amp; defaults</h2>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold">Enable demo mode</div>
                <p className="text-sm opacity-70">
                  Shows sample rows when there are no live orders yet.
                </p>
              </div>

              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                disabled={loading}
              />
            </div>

            <div className="divider my-2" />

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Default delay (hours)</span>
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
                  Used when computing readyAt during ingestion.
                </span>
              </div>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Export refresh cadence (minutes)</span>
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
            </label>
          </div>
        </div>

        {loading ? (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="loading loading-spinner loading-sm" />
              <span className="text-sm opacity-70">Loading settings…</span>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
