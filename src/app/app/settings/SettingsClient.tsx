// src/app/app/settings/SettingsClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import createApp from "@shopify/app-bridge";
import { authenticatedFetch } from "@shopify/app-bridge/utilities";

type SettingsDTO = {
  ok: true;
  tenantId: string;
  tenantName: string;
  demoMode: boolean;
  portalTitle: string | null;
  portalLogoUrl: string | null;
  delayHours: number | null;
  exportFrequencyMinutes: number | null;
};

type ErrDTO = { ok: false; error: string };

function first(p: string | string[] | null | undefined) {
  if (!p) return "";
  return Array.isArray(p) ? p[0] ?? "" : p;
}

function safeGetSession(key: string) {
  try {
    return typeof window !== "undefined" ? window.sessionStorage.getItem(key) ?? "" : "";
  } catch {
    return "";
  }
}

export default function SettingsClient() {
  const sp = useSearchParams();

  // Prefer URL params; fall back to sessionStorage (set by AppHomeClient)
  const urlShop = first(sp.get("shop"));
  const urlHost = first(sp.get("host"));
  const urlEmbedded = first(sp.get("embedded"));

  const [ctxShop, setCtxShop] = useState(urlShop);
  const [ctxHost, setCtxHost] = useState(urlHost);
  const [ctxEmbedded, setCtxEmbedded] = useState(urlEmbedded || "");

  // On mount + when URL changes, hydrate from sessionStorage if missing
  useEffect(() => {
    const ssShop = safeGetSession("os_shop");
    const ssHost = safeGetSession("os_host");
    const ssEmbedded = safeGetSession("os_embedded");

    setCtxShop(urlShop || ssShop || "");
    setCtxHost(urlHost || ssHost || "");
    setCtxEmbedded(urlEmbedded || ssEmbedded || "1");
  }, [urlShop, urlHost, urlEmbedded]);

  const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // Form state
  const [demoMode, setDemoMode] = useState(false);
  const [portalTitle, setPortalTitle] = useState<string>("");
  const [portalLogoUrl, setPortalLogoUrl] = useState<string>("");
  const [delayHours, setDelayHours] = useState<number>(6);
  const [exportFrequencyMinutes, setExportFrequencyMinutes] = useState<number>(15);
  const [tenantName, setTenantName] = useState<string>("");

  // Build the authenticated fetch (App Bridge session tokens)
  const authedFetch = useMemo(() => {
    if (!apiKey || !ctxHost) return null;

    const app = createApp({
      apiKey,
      host: ctxHost,
      forceRedirect: true,
    });

    return authenticatedFetch(app);
  }, [apiKey, ctxHost]);

  async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    };

    // If embedded + we have host/apiKey, use session-token authenticated fetch
    if (authedFetch) {
      const res = await authedFetch(url, {
        ...(init ?? {}),
        headers,
      });

      const text = await res.text();
      if (!text) throw new Error(`Empty response (${res.status})`);
      return JSON.parse(text) as T;
    }

    // Fallback (non-embedded dev / direct browser)
    const res = await fetch(url, {
      ...(init ?? {}),
      headers,
      cache: "no-store",
    });

    const text = await res.text();
    if (!text) throw new Error(`Empty response (${res.status})`);
    return JSON.parse(text) as T;
  }

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (ctxShop) p.set("shop", ctxShop);
    if (ctxHost) p.set("host", ctxHost);
    if (ctxEmbedded) p.set("embedded", ctxEmbedded);
    return p.toString() ? `?${p.toString()}` : "";
  }, [ctxShop, ctxHost, ctxEmbedded]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      setOkMsg(null);

      // If we still don’t have host/apiKey, App Bridge can’t mint tokens.
      if (!apiKey || !ctxHost) {
        setErr("Missing embedded app context (host). Open Settings from inside the embedded app dashboard.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchJSON<SettingsDTO | ErrDTO>(`/api/app/settings${qs}`);

        if (cancelled) return;

        if (!data || typeof data !== "object") {
          throw new Error("Invalid response");
        }

        if ((data as ErrDTO).ok === false) {
          setErr((data as ErrDTO).error || "Failed to load settings");
          setLoading(false);
          return;
        }

        const s = data as SettingsDTO;

        setTenantName(s.tenantName || "");
        setDemoMode(!!s.demoMode);
        setPortalTitle(s.portalTitle ?? "");
        setPortalLogoUrl(s.portalLogoUrl ?? "");
        setDelayHours(s.delayHours ?? 6);
        setExportFrequencyMinutes(s.exportFrequencyMinutes ?? 15);

        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setErr(e instanceof Error ? e.message : "Failed to load settings");
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [qs, apiKey, ctxHost]); // re-run if ctx changes

  async function onSave() {
    setSaving(true);
    setErr(null);
    setOkMsg(null);

    try {
      const payload = {
        demoMode,
        portalTitle: portalTitle.trim() || null,
        portalLogoUrl: portalLogoUrl.trim() || null,
        delayHours,
        exportFrequencyMinutes,
      };

      const data = await fetchJSON<{ ok: true } | ErrDTO>(`/api/app/settings${qs}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (data.ok === false) {
        setErr(data.error || "Failed to save");
      } else {
        setOkMsg("Saved.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-base-200 text-base-content">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
              <p className="text-sm opacity-70">
                Configure how this portal behaves for{" "}
                <span className="font-semibold">{tenantName || "your 3PL"}</span>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="btn btn-primary btn-sm md:btn-md"
                onClick={onSave}
                disabled={loading || saving}
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>

          {/* Status messages */}
          <div className="pt-3 space-y-2">
            {err ? (
              <div className="alert alert-error text-sm">
                <span>{err}</span>
              </div>
            ) : null}

            {okMsg ? (
              <div className="alert alert-success text-sm">
                <span>{okMsg}</span>
              </div>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm flex items-center gap-3">
            <span className="loading loading-spinner loading-md" />
            <div className="space-y-1">
              <p className="font-semibold">Loading settings…</p>
              <p className="text-sm opacity-70">Fetching your current configuration.</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Portal Branding */}
            <div className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-5 shadow-sm space-y-4">
              <div className="space-y-1">
                <h2 className="text-base md:text-lg font-semibold">Portal Branding</h2>
                <p className="text-sm opacity-70">What merchants see at the top of your portal.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Portal title</label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Acme Fulfillment Portal"
                  value={portalTitle}
                  onChange={(e) => setPortalTitle(e.target.value)}
                />
                <p className="text-xs opacity-70">
                  Leave blank to use “{tenantName || "Your 3PL"} Portal”.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Logo URL</label>
                <input
                  className="input input-bordered w-full"
                  placeholder="https://…/logo.png"
                  value={portalLogoUrl}
                  onChange={(e) => setPortalLogoUrl(e.target.value)}
                />
                <p className="text-xs opacity-70">Use a public URL (PNG/SVG). We can add uploads later.</p>
              </div>

              <div className="bg-base-200 border border-base-300 rounded-xl p-3">
                <p className="text-sm font-semibold mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-base-100 border border-base-300 overflow-hidden flex items-center justify-center">
                    {portalLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={portalLogoUrl}
                        alt="Portal logo preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-xs opacity-60">Logo</div>
                    )}
                  </div>

                  <div>
                    <div className="font-semibold leading-tight">
                      {portalTitle?.trim()
                        ? portalTitle.trim()
                        : `${tenantName || "Your 3PL"} Portal`}
                    </div>
                    <div className="text-xs opacity-70">Merchant-facing view</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ops Behavior */}
            <div className="bg-base-100 border border-base-300 rounded-xl p-4 md:p-5 shadow-sm space-y-4">
              <div className="space-y-1">
                <h2 className="text-base md:text-lg font-semibold">Ops Behavior</h2>
                <p className="text-sm opacity-70">
                  Controls how OrderShifter buffers Shopify changes and schedules exports.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Smart delay window (hours)</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  min={0}
                  max={72}
                  value={delayHours}
                  onChange={(e) => setDelayHours(Number(e.target.value || 0))}
                />
                <p className="text-xs opacity-70">
                  Orders can briefly “pause” while Shopify changes settle (edits/cancels/address updates).
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Export frequency (minutes)</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  min={5}
                  max={1440}
                  value={exportFrequencyMinutes}
                  onChange={(e) => setExportFrequencyMinutes(Number(e.target.value || 0))}
                />
                <p className="text-xs opacity-70">How often OrderShifter batches and exports validated orders.</p>
              </div>

              <div className="bg-base-200 border border-base-300 rounded-xl p-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Demo mode</p>
                    <p className="text-xs opacity-70">
                      Use sample data in the portal (useful for Shopify review and early demos).
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={demoMode}
                    onChange={(e) => setDemoMode(e.target.checked)}
                  />
                </div>

                <div className="text-xs opacity-70">
                  When enabled, the portal can show realistic example tables even if orders aren’t being ingested yet.
                </div>
              </div>
            </div>

            {/* Notes / Next */}
            <div className="md:col-span-2 bg-base-100 border border-base-300 rounded-xl p-4 md:p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                  <span className="text-sm font-bold">i</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">What’s next</p>
                  <p className="text-sm opacity-80">
                    Next we’ll wire up ingestion so this portal reflects real Shopify activity. While we wait on protected
                    data access, demo mode lets Shopify reviewers click around and see a “real” app.
                  </p>
                  <p className="text-xs opacity-70">
                    Tip: Keep demo mode ON for review; turn it OFF once order ingestion is approved and live.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between text-xs opacity-70 pt-2">
          <div>
            Embedded: <span className="font-semibold">{ctxEmbedded || "0"}</span> • Shop:{" "}
            <span className="font-semibold">{ctxShop || "(none)"}</span>
          </div>
          <div>OrderShifter • Settings</div>
        </div>
      </div>
    </main>
  );
}
