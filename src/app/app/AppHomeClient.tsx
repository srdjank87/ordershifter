"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";


// ---- Types ----
type EmbedCtx = {
  embedded: "1" | null;
  host: string | null;
  shop: string | null;
};

type TenantChoice = {
  tenantId: string;
  tenantName: string;
};

type AppContextResponseOk = {
  ok: true;
  shop: string;
  choices: TenantChoice[];
  metrics: {
    exceptionsOpen: number;
    lastExportAt: string | null;
    lastOrderSeenAt: string | null;
    syncHealth: "good" | "warning" | "bad";
  };
};

type AppContextResponseErr = {
  ok: false;
  error: string;
};

type AppContextResponse = AppContextResponseOk | AppContextResponseErr;

// ---- Helpers ----
function getUrlCtx(sp: URLSearchParams): EmbedCtx {
  const embeddedRaw = sp.get("embedded");
  return {
    embedded: embeddedRaw === "1" ? "1" : null,
    host: sp.get("host"),
    shop: sp.get("shop"),
  };
}


function badgeForSyncHealth(health: "good" | "warning" | "bad") {
  if (health === "good") return "badge-success";
  if (health === "warning") return "badge-warning";
  return "badge-error";
}

// ---- Component ----
export default function AppHomeClient() {
  const searchParams = useSearchParams();

  const urlCtx = useMemo(() => getUrlCtx(searchParams), [searchParams]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<AppContextResponseOk | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");

  // Persist Shopify embed context so navigation inside the app keeps working
  useEffect(() => {
    if (urlCtx.shop) sessionStorage.setItem("os_shop", urlCtx.shop);
    if (urlCtx.host) sessionStorage.setItem("os_host", urlCtx.host);
    if (urlCtx.embedded) sessionStorage.setItem("os_embedded", urlCtx.embedded);
  }, [urlCtx.shop, urlCtx.host, urlCtx.embedded]);

  // Fetch app context (merchant + tenant choices + metrics)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      const shop =
        urlCtx.shop ?? sessionStorage.getItem("os_shop") ?? undefined;

      if (!shop) {
        setLoading(false);
        setError(
          "Missing shop param. This page must be opened from Shopify admin (embedded)."
        );
        return;
      }

      try {
        const res = await fetch(
          `/api/app/context?shop=${encodeURIComponent(shop)}`,
          { cache: "no-store" }
        );

        const json = (await res.json()) as AppContextResponse;

        if (!res.ok || !json.ok) {
          throw new Error("error" in json ? json.error : `HTTP ${res.status}`);
        }

        if (!cancelled) {
          setData(json);

          // Default tenant selection (if multiple)
          const first = json.choices?.[0]?.tenantId ?? "";
          setSelectedTenantId((prev) => prev || first);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (!cancelled) {
          setData(null);
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [urlCtx.shop]);

  // ---- UI ----
  return (
    <main className="min-h-screen bg-base-100">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Header (merchant-facing; branded later) */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold">
              Merchant Portal
            </h1>
            <p className="text-sm opacity-70">
              Visibility + exceptions — without ops noise.
            </p>
          </div>

          {/* Placeholder: 3PL selector (only matters if merchant has multiple 3PLs) */}
          <div className="flex items-center gap-2">
            {data?.choices?.length ? (
              <label className="form-control w-full max-w-xs">
                <div className="label py-0">
                  <span className="label-text text-xs opacity-70">
                    Your 3PL
                  </span>
                </div>
                <select
                  className="select select-bordered select-sm"
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                >
                  {data.choices.map((c) => (
                    <option key={c.tenantId} value={c.tenantId}>
                      {c.tenantName}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <span className="text-xs opacity-60">
                {/* Will show once context loads */}
              </span>
            )}
          </div>
        </div>

        {/* State blocks */}
        {loading ? (
          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-3">
                <span className="loading loading-spinner loading-sm" />
                <p className="opacity-80">Loading portal…</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span className="font-semibold">Couldn’t load app context.</span>
            <span className="opacity-80">{error}</span>
          </div>
        ) : !data ? (
          <div className="alert">
            <span className="font-semibold">No data yet.</span>
          </div>
        ) : (
          <>
            {/* Quick metrics row */}
            <div className="grid md:grid-cols-3 gap-3">
              <div className="card bg-base-200 border border-base-300 shadow-sm">
                <div className="card-body space-y-1">
                  <p className="text-xs opacity-70">Sync health</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge ${badgeForSyncHealth(
                        data.metrics.syncHealth
                      )}`}
                    >
                      {data.metrics.syncHealth.toUpperCase()}
                    </span>
                    <span className="text-xs opacity-70">
                      Shopify → WMS layer
                    </span>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200 border border-base-300 shadow-sm">
                <div className="card-body space-y-1">
                  <p className="text-xs opacity-70">Open exceptions</p>
                  <p className="text-2xl font-bold">
                    {data.metrics.exceptionsOpen}
                  </p>
                  <p className="text-xs opacity-70">
                    Needs review before export
                  </p>
                </div>
              </div>

              <div className="card bg-base-200 border border-base-300 shadow-sm">
                <div className="card-body space-y-1">
                  <p className="text-xs opacity-70">Last export</p>
                  <p className="font-semibold">
                    {data.metrics.lastExportAt
                      ? new Date(data.metrics.lastExportAt).toLocaleString()
                      : "—"}
                  </p>
                  <p className="text-xs opacity-70">
                    Scheduled + validated payloads
                  </p>
                </div>
              </div>
            </div>

            {/* Next actions */}
            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold">Next steps</h2>
                  <span className="text-xs opacity-60">
                    Shop: {data.shop}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-2">
                    <p className="font-semibold">Review exceptions</p>
                    <p className="opacity-80">
                      See the small set of orders that would otherwise create the
                      most noise.
                    </p>
                    <button className="btn btn-sm btn-primary w-full" disabled>
                      View exceptions (next)
                    </button>
                  </div>

                  <div className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-2">
                    <p className="font-semibold">Sync status</p>
                    <p className="opacity-80">
                      Confirm exports are running and tracking is flowing back.
                    </p>
                    <button className="btn btn-sm btn-outline w-full" disabled>
                      View sync health (next)
                    </button>
                  </div>
                </div>

                <p className="text-xs opacity-70">
                  MVP note: these buttons will be wired up once we add the Exceptions + Export log tables.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
