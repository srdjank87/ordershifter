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

type SaveDTO = { ok: true } & Record<string, never>;

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

function toIntSafe(v: string, fallback: number, min?: number, max?: number) {
  const n = Number.parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  const clamped =
    typeof min === "number" && n < min
      ? min
      : typeof max === "number" && n > max
      ? max
      : n;
  return clamped;
}

function getCtxFromStorage(): { shop: string | null; host: string | null } {
  if (typeof window === "undefined") return { shop: null, host: null };
  return {
    shop: window.sessionStorage.getItem("os_shop"),
    host: window.sessionStorage.getItem("os_host"),
  };
}

async function readJsonResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: "Invalid JSON response from server" } satisfies ErrDTO;
  }
}

function extractErrorMessage(payload: unknown, status: number): string {
  if (isErrDTO(payload)) return payload.error;
  return `Request failed (${status})`;
}

export default function SettingsClient() {
  const sp = useSearchParams();

  const qpShop = sp.get("shop");
  const qpHost = sp.get("host");

  const { shop: stShop, host: stHost } = getCtxFromStorage();
  const shop = qpShop ?? stShop ?? "";
  const host = qpHost ?? stHost ?? "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (qpShop) window.sessionStorage.setItem("os_shop", qpShop);
    if (qpHost) window.sessionStorage.setItem("os_host", qpHost);
  }, [qpShop, qpHost]);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (shop) p.set("shop", shop);
    if (host) p.set("host", host);
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [shop, host]);

  const app = useMemo<ClientApplication | null>(() => {
    if (typeof window === "undefined") return null;
    if (!host) return null;

    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;
    if (!apiKey) return null;

    return createApp({
      apiKey,
      host,
      forceRedirect: true,
    });
  }, [host]);

  async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init?.headers ? (init.headers as Record<string, string>) : {}),
    };

    const res = app
      ? await authenticatedFetch(app)(path, { ...init, headers })
      : await fetch(path, { ...init, headers });

    const payload = await readJsonResponse(res);

    if (!res.ok) {
      throw new Error(extractErrorMessage(payload, res.status));
    }

    return payload as T;
  }

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

    try {
      const payload = await fetchJSON<unknown>(`/api/app/settings${qs}`, { method: "GET" });

      if (!isSettingsDTO(payload)) {
        if (isErrDTO(payload)) throw new Error(payload.error);
        throw new Error("Failed to load settings (unexpected payload)");
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
  }, [qs]);

  async function onSave() {
    setSaving(true);
    setErr(null);
    setOkMsg(null);

    try {
      const body = {
        tenantName: tenantName.trim(),
        tenantLogoUrl: tenantLogoUrl.trim() || null,
        demoMode,
        delayHours,
        exportFrequencyMinutes,

        // Optional backward compat if route still reads these:
        portalTitle: null,
        portalLogoUrl: tenantLogoUrl.trim() || null,
      };

      const payload = await fetchJSON<unknown>(`/api/app/settings${qs}`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (isErrDTO(payload)) throw new Error(payload.error);
      // Accept ok:true even if empty
      const ok = payload as SaveDTO;
      if (ok.ok !== true) throw new Error("Failed to save settings");

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
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
              <p className="text-sm opacity-70">
                Configure portal branding and demo behavior for this tenant.
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
                className={`btn btn-primary btn-sm ${saving ? "btn-disabled" : ""}`}
                onClick={onSave}
                disabled={saving || loading}
                type="button"
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

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">3PL Branding</h2>
              <span className="badge badge-ghost">Portal title: {portalPreview}</span>
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
                  Portal will display <span className="font-semibold">{portalPreview}</span>.
                </span>
              </div>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">3PL logo URL (optional)</span>
              </div>
              <input
                className="input input-bordered w-full"
                value={tenantLogoUrl}
                onChange={(e) => setTenantLogoUrl(e.target.value)}
                placeholder="https://…"
                disabled={loading}
              />
              <div className="label">
                <span className="label-text-alt opacity-70">Hosted image URL (SVG/PNG).</span>
              </div>
            </label>

            <div className="flex items-center gap-3">
              {tenantLogoUrl.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tenantLogoUrl.trim()}
                  alt="3PL logo preview"
                  className="w-10 h-10 rounded-lg border border-base-300 object-contain bg-base-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg border border-base-300 bg-base-200 flex items-center justify-center text-xs opacity-60">
                  Logo
                </div>
              )}

              <div className="text-sm">
                <div className="font-semibold">{portalPreview}</div>
                <div className="opacity-70">Header preview</div>
              </div>
            </div>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-5 shadow-sm space-y-3">
            <h2 className="font-semibold">Demo mode</h2>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold">Enable demo mode</div>
                <p className="text-sm opacity-70">
                  Show sample rows when there are no live orders yet (useful for review + onboarding).
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

            <div className="space-y-2">
              <div className="font-semibold">Order flow defaults</div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Default delay (hours)</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  inputMode="numeric"
                  value={String(delayHours)}
                  onChange={(e) => setDelayHours(toIntSafe(e.target.value, delayHours, 0, 72))}
                  disabled={loading}
                />
                <div className="label">
                  <span className="label-text-alt opacity-70">
                    Used for initial “readyAt” computation during ingestion.
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
                      toIntSafe(e.target.value, exportFrequencyMinutes, 1, 240),
                    )
                  }
                  disabled={loading}
                />
                <div className="label">
                  <span className="label-text-alt opacity-70">
                    UI refresh cadence for now (we’ll align to actual exports later).
                  </span>
                </div>
              </label>
            </div>
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
