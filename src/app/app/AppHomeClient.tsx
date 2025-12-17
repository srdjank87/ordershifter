"use client";

import { useEffect, useMemo, useState } from "react";

type AppCtx = {
  ok: boolean;
  tenantId: string;
  tenantName: string; // use this for "{3PL} Portal"
  shop: string; // shop domain (ordershifter-development.myshopify.com)
};

type ExceptionRow = {
  id: string;
  code: string;
  message: string;
  createdAt: string;
  order?: {
    shopifyName: string | null;
    shopifyOrderId: string;
  };
};

type ExportRow = {
  id: string;
  status: "QUEUED" | "SENT" | "FAILED";
  summary: string | null;
  error: string | null;
  createdAt: string;
  order?: {
    shopifyName: string | null;
    shopifyOrderId: string;
  } | null;
};

type UrlCtx = {
  shop: string | null;
  host: string | null;
  embedded: "1" | null;
};

function getUrlCtxFromWindow(): UrlCtx {
  if (typeof window === "undefined") return { shop: null, host: null, embedded: null };
  const sp = new URLSearchParams(window.location.search);
  const embeddedRaw = sp.get("embedded");
  return {
    shop: sp.get("shop"),
    host: sp.get("host"),
    embedded: embeddedRaw === "1" ? "1" : null,
  };
}

function getStoredCtx(): UrlCtx {
  if (typeof window === "undefined") return { shop: null, host: null, embedded: null };
  return {
    shop: sessionStorage.getItem("os_shop"),
    host: sessionStorage.getItem("os_host"),
    embedded: (sessionStorage.getItem("os_embedded") === "1" ? "1" : null) as "1" | null,
  };
}

function storeCtx(ctx: UrlCtx) {
  if (typeof window === "undefined") return;
  if (ctx.shop) sessionStorage.setItem("os_shop", ctx.shop);
  if (ctx.host) sessionStorage.setItem("os_host", ctx.host);
  if (ctx.embedded) sessionStorage.setItem("os_embedded", ctx.embedded);
}

export default function AppHomeClient() {
  const [loading, setLoading] = useState(true);
  const [ctx, setCtx] = useState<AppCtx | null>(null);
  const [ctxError, setCtxError] = useState<string | null>(null);

  const [exceptions, setExceptions] = useState<ExceptionRow[]>([]);
  const [exportsLog, setExportsLog] = useState<ExportRow[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);

  // Resolve "shop" even if Shopify drops query params after App Bridge navigation
  const effectiveShop = useMemo(() => {
    const fromUrl = getUrlCtxFromWindow();
    if (fromUrl.shop || fromUrl.host || fromUrl.embedded) storeCtx(fromUrl);

    const stored = getStoredCtx();
    return fromUrl.shop ?? stored.shop ?? null;
  }, []);

  const portalTitle = useMemo(() => {
    if (!ctx?.tenantName) return "Portal";
    return `${ctx.tenantName} Portal`;
  }, [ctx?.tenantName]);

  useEffect(() => {
    let cancelled = false;

    async function loadContextAndData() {
      try {
        setLoading(true);
        setCtxError(null);
        setDataError(null);

        // 1) Load context (pass shop if we have it)
        const ctxUrl = effectiveShop
          ? `/api/app/context?shop=${encodeURIComponent(effectiveShop)}`
          : "/api/app/context";

        const ctxRes = await fetch(ctxUrl, { cache: "no-store" });
        const ctxJson = (await ctxRes.json()) as AppCtx | { ok: false; error?: string };

        if (!ctxRes.ok || !("ok" in ctxJson) || ctxJson.ok !== true) {
          const msg =
            (ctxJson as { error?: string })?.error ||
            `Couldn’t load app context (HTTP ${ctxRes.status})`;
          throw new Error(msg);
        }

        if (cancelled) return;
        setCtx(ctxJson);

        // 2) Load exceptions + exports using shop domain from context
        const shop = ctxJson.shop;

        const [exRes, expRes] = await Promise.all([
          fetch(`/api/app/exceptions?shop=${encodeURIComponent(shop)}`, { cache: "no-store" }),
          fetch(`/api/app/exports?shop=${encodeURIComponent(shop)}`, { cache: "no-store" }),
        ]);

        const exJson = (await exRes.json()) as { ok: boolean; rows?: ExceptionRow[]; error?: string };
        const expJson = (await expRes.json()) as { ok: boolean; rows?: ExportRow[]; error?: string };

        if (!exRes.ok || !exJson.ok) {
          throw new Error(exJson.error || `Failed to load exceptions (HTTP ${exRes.status})`);
        }

        if (!expRes.ok || !expJson.ok) {
          throw new Error(expJson.error || `Failed to load exports (HTTP ${expRes.status})`);
        }

        if (cancelled) return;
        setExceptions(exJson.rows ?? []);
        setExportsLog(expJson.rows ?? []);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (cancelled) return;

        // If context fails, show ctxError; if data fails after ctx, show dataError
        if (!ctx) setCtxError(msg);
        else setDataError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadContextAndData();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveShop]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <p className="opacity-70">Loading portal…</p>
          </div>
        </div>
      </div>
    );
  }

  if (ctxError) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="alert alert-error">
          <span>Couldn’t load app context: {ctxError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold">{portalTitle}</h1>
        {/* Later: dropdown if merchant has multiple 3PLs */}
      </div>

      {dataError ? (
        <div className="alert alert-warning">
          <span>{dataError}</span>
        </div>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="text-base font-semibold">Orders needing attention</h2>
            <p className="text-sm opacity-70">
              If something is missing or invalid, it shows up here so it can be fixed quickly.
            </p>

            <div className="divider my-2" />

            {exceptions.length === 0 ? (
              <p className="text-sm opacity-70">No issues right now.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Issue</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exceptions.map((r) => (
                      <tr key={r.id}>
                        <td className="whitespace-nowrap">
                          {r.order?.shopifyName ?? r.order?.shopifyOrderId ?? "—"}
                        </td>
                        <td>
                          <div className="font-semibold">{r.code}</div>
                          <div className="opacity-70">{r.message}</div>
                        </td>
                        <td className="whitespace-nowrap opacity-70">
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="text-base font-semibold">Recent exports</h2>
            <p className="text-sm opacity-70">A simple record of what was sent to the warehouse and when.</p>

            <div className="divider my-2" />

            {exportsLog.length === 0 ? (
              <p className="text-sm opacity-70">No exports yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Status</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exportsLog.map((r) => (
                      <tr key={r.id}>
                        <td className="whitespace-nowrap">
                          {r.order?.shopifyName ?? r.order?.shopifyOrderId ?? "—"}
                        </td>
                        <td className="whitespace-nowrap">
                          <span
                            className={
                              r.status === "SENT"
                                ? "badge badge-success"
                                : r.status === "FAILED"
                                  ? "badge badge-error"
                                  : "badge badge-ghost"
                            }
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap opacity-70">
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {exportsLog.some((x) => x.status === "FAILED") ? (
                  <p className="text-xs opacity-70 mt-2">
                    Some exports failed — we’ll show the exact reason here in the next step.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
