"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Ctx = { shop?: string; host?: string; embedded?: string };

type TenantChoice = {
  tenantId: string;
  tenantName: string; // later this becomes the branded 3PL name/logo
};

type AppContextResponse = {
  ok: true;
  shop: string;
  choices: TenantChoice[];
  // MVP placeholders (wire these to real tables as we build)
  metrics: {
    exceptionsOpen: number;
    lastExportAt?: string | null;
    lastOrderSeenAt?: string | null;
    syncHealth: "good" | "warning" | "bad";
  };
};

function readSessionCtx(): Ctx {
  if (typeof window === "undefined") return {};
  return {
    shop: sessionStorage.getItem("os_shop") || undefined,
    host: sessionStorage.getItem("os_host") || undefined,
    embedded: sessionStorage.getItem("os_embedded") || undefined,
  };
}

export default function AppHomeClient() {
  const params = useSearchParams();

  const urlCtx: Ctx = useMemo(
    () => ({
      shop: params.get("shop") ?? undefined,
      host: params.get("host") ?? undefined,
      embedded: params.get("embedded") ?? undefined,
    }),
    [params]
  );

  const [data, setData] = useState<AppContextResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");

  // Combine URL ctx with session ctx (no React state needed)
  const ctx: Ctx = useMemo(() => {
    const sessionCtx = readSessionCtx();
    return {
      shop: urlCtx.shop ?? sessionCtx.shop,
      host: urlCtx.host ?? sessionCtx.host,
      embedded: urlCtx.embedded ?? sessionCtx.embedded,
    };
  }, [urlCtx.shop, urlCtx.host, urlCtx.embedded]);

  // Persist ctx if URL has it
  useEffect(() => {
    if (!urlCtx.shop && !urlCtx.host) return;
    sessionStorage.setItem("os_shop", urlCtx.shop ?? "");
    sessionStorage.setItem("os_host", urlCtx.host ?? "");
    sessionStorage.setItem("os_embedded", urlCtx.embedded ?? "");
  }, [urlCtx.shop, urlCtx.host, urlCtx.embedded]);

  // Load merchant->3PL context
  useEffect(() => {
    if (!ctx.shop) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/app/context?shop=${encodeURIComponent(ctx.shop!)}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as AppContextResponse;

        if (!cancelled) {
          setData(json);
          // default tenant selection
          if (json.choices?.length) {
            setSelectedTenantId((prev) => prev || json.choices[0].tenantId);
          }
        }
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ctx.shop]);

  if (!ctx.shop) {
    return (
      <main className="min-h-screen bg-base-100">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="alert alert-warning">
            <span className="font-semibold">Missing shop context.</span>
            <span className="opacity-80">
              Please launch the app from Shopify Admin so we can identify your store.
            </span>
          </div>

          <p className="text-sm opacity-70">
            If you’re seeing this inside Shopify, it usually means the embedded redirect
            dropped the query string. (Fix is in middleware: preserve search params.)
          </p>
        </div>
      </main>
    );
  }

  const tenantLabel =
    data?.choices?.find((c) => c.tenantId === selectedTenantId)?.tenantName || "Your 3PL";

  return (
    <main className="min-h-screen bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-5">
        {/* Top bar (no OrderShifter branding) */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="font-bold text-lg">{tenantLabel}</div>
            <div className="text-xs opacity-70">Merchant portal • {ctx.shop}</div>
          </div>

          {/* Optional multi-3PL dropdown (only show if >1) */}
          {data?.choices?.length && data.choices.length > 1 ? (
            <select
              className="select select-bordered select-sm"
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              aria-label="Choose 3PL"
              title="Choose 3PL"
            >
              {data.choices.map((c) => (
                <option key={c.tenantId} value={c.tenantId}>
                  {c.tenantName}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card bg-base-200 shadow-sm lg:col-span-2">
            <div className="card-body space-y-2">
              <h1 className="text-xl font-bold">Ops Status (WIP)</h1>
              <p className="opacity-80">
                Next: show open exceptions, last export, and basic sync health for your store.
              </p>

              {loading ? (
                <div className="opacity-70 text-sm">Loading…</div>
              ) : data ? (
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-base-100 border border-base-300 rounded-xl p-3">
                    <div className="text-xs opacity-70">Open exceptions</div>
                    <div className="text-2xl font-bold">{data.metrics.exceptionsOpen}</div>
                  </div>

                  <div className="bg-base-100 border border-base-300 rounded-xl p-3">
                    <div className="text-xs opacity-70">Sync health</div>
                    <div className="text-lg font-semibold capitalize">{data.metrics.syncHealth}</div>
                  </div>

                  <div className="bg-base-100 border border-base-300 rounded-xl p-3">
                    <div className="text-xs opacity-70">Last export</div>
                    <div className="text-sm font-semibold">
                      {data.metrics.lastExportAt ? new Date(data.metrics.lastExportAt).toLocaleString() : "—"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-error">
                  <span className="font-semibold">Couldn’t load app context.</span>
                  <span className="opacity-80">Check `/api/app/context` logs in Vercel.</span>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body space-y-2">
              <h2 className="font-semibold">What’s next</h2>
              <ul className="list-disc list-inside opacity-80 text-sm space-y-1">
                <li>Exception list + resolution links</li>
                <li>Routing + export status</li>
                <li>Webhook + sync diagnostics</li>
              </ul>
              <p className="text-xs opacity-70">
                (Branding will become 3PL-specific later: logo + name + colors.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
