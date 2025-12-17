"use client";

import { useEffect, useMemo, useState } from "react";

type AppCtx = {
  ok: boolean;
  tenantId: string;
  tenantName: string; // use this for "{3PL} Portal"
  shop: string; // shop domain
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

type StatsResponse = {
  ok: true;
  shop: string;
  metrics: {
    ordersTotal: number;
    awaitingDelay: number;
    readyToRoute: number;
    routed: number;
    exportQueued: number;
    exported: number;
    ordersError: number;
    lastOrderSeenAt: string | null;
    lastExportAt: string | null;
    lastExportStatus: "QUEUED" | "SENT" | "FAILED" | null;
    syncHealth: "good" | "warning" | "bad";
  };
};

type OrderRow = {
  id: string;
  shopifyOrderId: string;
  shopifyName: string | null;
  state:
    | "PENDING_DELAY"
    | "READY_TO_ROUTE"
    | "ROUTED"
    | "EXPORT_QUEUED"
    | "EXPORTED"
    | "ERROR";
  updatedAt: string;
  lastError: string | null;
};

type OrdersResponse = { ok: true; rows: OrderRow[] } | { ok: false; error: string };

type UrlCtx = {
  shop: string | null;
  host: string | null;
  embedded: "1" | null;
};

function isOkTrue(x: unknown): x is { ok: true } {
  return typeof x === "object" && x !== null && (x as Record<string, unknown>).ok === true;
}

function isOkFalse(x: unknown): x is { ok: false; error?: string } {
  return typeof x === "object" && x !== null && (x as Record<string, unknown>).ok === false;
}


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

function badgeForHealth(h: "good" | "warning" | "bad") {
  if (h === "good") return "badge badge-success";
  if (h === "warning") return "badge badge-warning";
  return "badge badge-error";
}

function badgeForState(s: OrderRow["state"]) {
  switch (s) {
    case "PENDING_DELAY":
      return "badge badge-ghost";
    case "READY_TO_ROUTE":
      return "badge badge-info";
    case "ROUTED":
      return "badge badge-neutral";
    case "EXPORT_QUEUED":
      return "badge badge-warning";
    case "EXPORTED":
      return "badge badge-success";
    case "ERROR":
      return "badge badge-error";
  }
}

export default function AppHomeClient() {
  const [loading, setLoading] = useState(true);
  const [ctx, setCtx] = useState<AppCtx | null>(null);
  const [ctxError, setCtxError] = useState<string | null>(null);

  const [exceptions, setExceptions] = useState<ExceptionRow[]>([]);
  const [exportsLog, setExportsLog] = useState<ExportRow[]>([]);
  const [stats, setStats] = useState<StatsResponse["metrics"] | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
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

    async function loadAll() {
      try {
        setLoading(true);
        setCtxError(null);
        setDataError(null);

        // 1) Context (pass shop if we have it)
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

        const shop = ctxJson.shop;

        // 2) Data
        const [exRes, expRes, statsRes, ordersRes] = await Promise.all([
          fetch(`/api/app/exceptions?shop=${encodeURIComponent(shop)}`, { cache: "no-store" }),
          fetch(`/api/app/exports?shop=${encodeURIComponent(shop)}`, { cache: "no-store" }),
          fetch(`/api/app/stats?shop=${encodeURIComponent(shop)}`, { cache: "no-store" }),
          fetch(`/api/app/orders?shop=${encodeURIComponent(shop)}&take=10`, { cache: "no-store" }),
        ]);

        const exJson = (await exRes.json()) as { ok: boolean; rows?: ExceptionRow[]; error?: string };
        const expJson = (await expRes.json()) as { ok: boolean; rows?: ExportRow[]; error?: string };
        const statsJson = (await statsRes.json()) as StatsResponse | { ok: false; error?: string };
        const ordersJson = (await ordersRes.json()) as OrdersResponse;

        if (!exRes.ok || !exJson.ok) {
          throw new Error(exJson.error || `Failed to load exceptions (HTTP ${exRes.status})`);
        }
        if (!expRes.ok || !expJson.ok) {
          throw new Error(expJson.error || `Failed to load exports (HTTP ${expRes.status})`);
        }
        // stats
if (!statsRes.ok || !isOkTrue(statsJson)) {
  const msg =
    (isOkFalse(statsJson) ? statsJson.error : undefined) ||
    `Failed to load stats (HTTP ${statsRes.status})`;
  throw new Error(msg);
}

// orders
if (!ordersRes.ok || !isOkTrue(ordersJson)) {
  const msg =
    (isOkFalse(ordersJson) ? ordersJson.error : undefined) ||
    `Failed to load recent orders (HTTP ${ordersRes.status})`;
  throw new Error(msg);
}

if (cancelled) return;

setExceptions(exJson.rows ?? []);
setExportsLog(expJson.rows ?? []);
setStats((statsJson as StatsResponse).metrics);
setOrders((ordersJson as { ok: true; rows: OrderRow[] }).rows ?? []);

      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (cancelled) return;

        if (!ctx) setCtxError(msg);
        else setDataError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
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
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold">{portalTitle}</h1>
        {/* Later: dropdown if merchant has multiple 3PLs */}
      </div>

      {dataError ? (
        <div className="alert alert-warning">
          <span>{dataError}</span>
        </div>
      ) : null}

      {/* Store Status (NEW) */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-base-200 rounded-xl border border-base-300 p-4">
          <div className="text-xs opacity-70">Sync health</div>
          <div className="mt-1">
            <span className={badgeForHealth(stats?.syncHealth ?? "warning")}>
              {stats?.syncHealth ?? "—"}
            </span>
          </div>
          <div className="text-xs opacity-70 mt-2">
            Last order seen:{" "}
            <span className="font-semibold">
              {stats?.lastOrderSeenAt ? new Date(stats.lastOrderSeenAt).toLocaleString() : "—"}
            </span>
          </div>
        </div>

        <div className="bg-base-200 rounded-xl border border-base-300 p-4">
          <div className="text-xs opacity-70">Orders in progress</div>
          <div className="text-2xl font-bold mt-1">{stats?.ordersTotal ?? 0}</div>
          <div className="text-xs opacity-70 mt-2">
            Awaiting delay: <span className="font-semibold">{stats?.awaitingDelay ?? 0}</span> •
            Export queued: <span className="font-semibold">{stats?.exportQueued ?? 0}</span>
          </div>
        </div>

        <div className="bg-base-200 rounded-xl border border-base-300 p-4">
          <div className="text-xs opacity-70">Last export</div>
          <div className="mt-1">
            <span
              className={
                stats?.lastExportStatus === "SENT"
                  ? "badge badge-success"
                  : stats?.lastExportStatus === "FAILED"
                    ? "badge badge-error"
                    : "badge badge-ghost"
              }
            >
              {stats?.lastExportStatus ?? "—"}
            </span>
          </div>
          <div className="text-xs opacity-70 mt-2">
            When:{" "}
            <span className="font-semibold">
              {stats?.lastExportAt ? new Date(stats.lastExportAt).toLocaleString() : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Main sections */}
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
            <p className="text-sm opacity-70">
              A quick log of what was sent (or queued) to your 3PL.
            </p>

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
                    Some exports failed — next we’ll show the exact reason and what to do.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent orders (NEW) */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="text-base font-semibold">Recent orders</h2>
          <p className="text-sm opacity-70">
            A simple feed of what OrderShifter is currently doing for your store.
          </p>

          <div className="divider my-2" />

          {orders.length === 0 ? (
            <p className="text-sm opacity-70">
              No orders recorded yet. (Next step: connect webhooks to start populating this list.)
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap">
                        {r.shopifyName ?? r.shopifyOrderId}
                      </td>
                      <td className="whitespace-nowrap">
                        <span className={badgeForState(r.state)}>{r.state}</span>
                      </td>
                      <td className="whitespace-nowrap opacity-70">
                        {new Date(r.updatedAt).toLocaleString()}
                      </td>
                      <td className="opacity-70">
                        {r.lastError ? r.lastError : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
