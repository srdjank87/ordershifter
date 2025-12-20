"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import type { ClientApplication } from "@shopify/app-bridge";

import Link from "next/link";


// ---------- Types ----------
type ContextOk = {
  ok: true;
  shop: string;
  host?: string;
  tenantId: string;
  tenantName: string;
};

type ContextNotOk = {
  ok: false;
  code?: "NEEDS_INSTALL" | "MISSING_SHOP" | string;
  shop: string; // may be ""
  host: string; // may be ""
  error: string;
};

type CtxResponse = ContextOk | ContextNotOk;

type StatsResp =
  | {
      ok: true;
      counts: Record<string, number>;
      lastExportAt?: string | null;
      syncHealth?: "OK" | "WARN" | "ERROR";
      message?: string;
    }
  | { ok: false; error: string };

type ExceptionRow = {
  id: string;
  code: string;
  message: string;
  status: string;
  createdAt: string;
  orderName?: string | null;
};

type ExceptionsResp =
  | { ok: true; items: ExceptionRow[] }
  | { ok: false; error: string };

type ExportRow = {
  id: string;
  createdAt: string;
  status: string;
  notes?: string | null;
};

type ExportsResp = { ok: true; items: ExportRow[] } | { ok: false; error: string };

type OrderRow = {
  id: string;
  shopifyOrderId: string;
  shopifyName: string;
  state: string;
  createdAt: string;
};

type OrdersResp = { ok: true; items: OrderRow[] } | { ok: false; error: string };

// ---------- Helpers ----------
function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function normalizeStats(v: unknown): StatsResp {
  if (typeof v !== "object" || v === null) return { ok: false, error: "Invalid stats response" };
  const anyV = v as {
    ok?: unknown;
    error?: unknown;
    counts?: unknown;
    lastExportAt?: unknown;
    syncHealth?: unknown;
    message?: unknown;
  };

  if (anyV.ok === true) {
    const counts =
      typeof anyV.counts === "object" && anyV.counts !== null
        ? (anyV.counts as Record<string, number>)
        : {};
    return {
      ok: true,
      counts,
      lastExportAt: typeof anyV.lastExportAt === "string" || anyV.lastExportAt === null ? (anyV.lastExportAt as string | null) : undefined,
      syncHealth: anyV.syncHealth === "OK" || anyV.syncHealth === "WARN" || anyV.syncHealth === "ERROR" ? (anyV.syncHealth as "OK" | "WARN" | "ERROR") : undefined,
      message: typeof anyV.message === "string" ? (anyV.message as string) : undefined,
    };
  }

  return {
    ok: false,
    error: typeof anyV.error === "string" ? (anyV.error as string) : "Stats request failed",
  };
}

function normalizeExceptions(v: unknown): ExceptionsResp {
  if (typeof v !== "object" || v === null) return { ok: false, error: "Invalid exceptions response" };
  const anyV = v as { ok?: unknown; error?: unknown; items?: unknown };

  if (anyV.ok === true) return { ok: true, items: asArray<ExceptionRow>(anyV.items) };
  return { ok: false, error: typeof anyV.error === "string" ? (anyV.error as string) : "Exceptions request failed" };
}

function normalizeExports(v: unknown): ExportsResp {
  if (typeof v !== "object" || v === null) return { ok: false, error: "Invalid exports response" };
  const anyV = v as { ok?: unknown; error?: unknown; items?: unknown };

  if (anyV.ok === true) return { ok: true, items: asArray<ExportRow>(anyV.items) };
  return { ok: false, error: typeof anyV.error === "string" ? (anyV.error as string) : "Exports request failed" };
}

function normalizeOrders(v: unknown): OrdersResp {
  if (typeof v !== "object" || v === null) return { ok: false, error: "Invalid orders response" };
  const anyV = v as { ok?: unknown; error?: unknown; items?: unknown };

  if (anyV.ok === true) return { ok: true, items: asArray<OrderRow>(anyV.items) };
  return { ok: false, error: typeof anyV.error === "string" ? (anyV.error as string) : "Orders request failed" };
}

export default function AppHomeClient() {
  const sp = useSearchParams();

  const shopFromUrl = sp.get("shop") ?? "";
  const hostFromUrl = sp.get("host") ?? "";
  const embeddedFromUrl = sp.get("embedded") === "1";

  const shop = useMemo(() => {
    if (shopFromUrl) return shopFromUrl;
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("os_shop") ?? "";
  }, [shopFromUrl]);

  const host = useMemo(() => {
    if (hostFromUrl) return hostFromUrl;
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("os_host") ?? "";
  }, [hostFromUrl]);

  const embedded = useMemo(() => {
    if (embeddedFromUrl) return true;
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("os_embedded") === "1";
  }, [embeddedFromUrl]);

  // Persist best-known context
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hostFromUrl) sessionStorage.setItem("os_host", hostFromUrl);
    if (shopFromUrl) sessionStorage.setItem("os_shop", shopFromUrl);
    if (embeddedFromUrl) sessionStorage.setItem("os_embedded", "1");
  }, [hostFromUrl, shopFromUrl, embeddedFromUrl]);

  // Create a real ClientApplication instance when embedded
  const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY ?? "";
  const app: ClientApplication | null = useMemo(() => {
    if (!embedded) return null;
    if (!apiKey || !host) return null;
    return createApp({ apiKey, host, forceRedirect: true });
  }, [embedded, apiKey, host]);

  // Authenticated fetch when embedded (adds session token header)
  const afetch = useMemo(() => {
    if (!app) return null;
    return authenticatedFetch(app);
  }, [app]);

  const [ctx, setCtx] = useState<ContextOk | null>(null);
  const [ctxError, setCtxError] = useState<string>("");

  const [stats, setStats] = useState<StatsResp | null>(null);
  const [exceptions, setExceptions] = useState<ExceptionsResp | null>(null);
  const [exportsLog, setExportsLog] = useState<ExportsResp | null>(null);
  const [orders, setOrders] = useState<OrdersResp | null>(null);

  async function fetchJson(url: string): Promise<unknown> {
    const res = afetch ? await afetch(url) : await fetch(url, { cache: "no-store" });
    const text = await res.text();
    if (!text) return { ok: false, error: `Empty response (${res.status})` };
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return { ok: false, error: `Non-JSON response (${res.status})` };
    }
  }

  // Load context (+ kick install if needed)
  useEffect(() => {
    let alive = true;

    const run = async () => {
      setCtxError("");

      const qs = new URLSearchParams();
      if (shop) qs.set("shop", shop);
      if (host) qs.set("host", host);

      const raw = await fetchJson(`/api/app/context?${qs.toString()}`);
      const data = raw as CtxResponse;

      if (!data.ok && data.code === "NEEDS_INSTALL") {
        // Embedded install must use App Bridge redirect
        if (embedded && app && data.shop) {
          const redirect = Redirect.create(app);
          const origin = window.location.origin;

          const installUrl =
            `${origin}/api/shopify/install?shop=${encodeURIComponent(data.shop)}` +
            `&host=${encodeURIComponent(data.host || host)}` +
            `&embedded=1`;

          redirect.dispatch(Redirect.Action.REMOTE, installUrl);
          return;
        }

        // Non-embedded fallback
        window.location.href = `/api/shopify/install?shop=${encodeURIComponent(data.shop)}`;
        return;
      }

      if (!data.ok) {
        if (!alive) return;
        setCtxError(data.error || "Couldn’t load app context.");
        return;
      }

      if (!alive) return;
      setCtx(data);
    };

    run().catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : "Couldn’t load app context.";
      if (alive) setCtxError(msg);
    });

    return () => {
      alive = false;
    };
  }, [shop, host, embedded, app, afetch]);

  // Once context is loaded, fetch portal data
  useEffect(() => {
    let alive = true;
    if (!ctx?.shop) return;

    const qs = new URLSearchParams({ shop: ctx.shop });

    const loadAll = async () => {
      const [sRaw, exRaw, expRaw, oRaw] = await Promise.all([
        fetchJson(`/api/app/stats?${qs}`),
        fetchJson(`/api/app/exceptions?${qs}`),
        fetchJson(`/api/app/exports?${qs}`),
        fetchJson(`/api/app/orders?${qs}`),
      ]);

      if (!alive) return;

      setStats(normalizeStats(sRaw));
      setExceptions(normalizeExceptions(exRaw));
      setExportsLog(normalizeExports(expRaw));
      setOrders(normalizeOrders(oRaw));
    };

    loadAll();

    return () => {
      alive = false;
    };
  }, [ctx?.shop, afetch]);

  // UI
  if (ctxError) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Couldn’t load app context: {ctxError}</span>
        </div>
      </div>
    );
  }

  if (!ctx) {
    return (
      <div className="p-6">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  const attentionCount = exceptions && exceptions.ok ? exceptions.items.length : null;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{ctx.tenantName} Portal</h1>
          <p className="text-sm opacity-70">
            Order status, issues that need action, and recent exports — all in one place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="px-3 py-2 rounded-xl bg-base-200 border border-base-300 text-sm">
            <div className="opacity-70 text-xs">Store</div>
            <div className="font-semibold">{ctx.shop}</div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-base-200 border border-base-300 text-sm">
            <div className="opacity-70 text-xs">Needs attention</div>
            <div className="font-semibold">{attentionCount === null ? "—" : attentionCount}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
  <Link href="/app/settings" className="btn btn-ghost btn-sm">
    Settings
  </Link>
</div>


      {/* Top grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-2">
            <h2 className="text-base font-semibold">Sync Health</h2>
            {!stats ? (
              <span className="loading loading-spinner loading-sm" />
            ) : !stats.ok ? (
              <p className="text-sm opacity-80">{stats.error}</p>
            ) : (
              <div className="space-y-1">
                <p className="text-sm opacity-80">
                  Status: <span className="font-semibold">{stats.syncHealth ?? "OK"}</span>
                </p>
                <p className="text-sm opacity-70">{stats.message ?? "Everything looks normal right now."}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-2">
            <h2 className="text-base font-semibold">Orders in Progress</h2>
            {!stats ? (
              <span className="loading loading-spinner loading-sm" />
            ) : !stats.ok ? (
              <p className="text-sm opacity-80">{stats.error}</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {["PENDING", "HELD", "READY", "EXPORTED", "ERROR"].map((k) => (
                  <div key={k} className="rounded-xl bg-base-100 border border-base-300 px-3 py-2">
                    <div className="text-xs opacity-70">{k}</div>
                    <div className="text-lg font-semibold">{stats.counts?.[k] ?? 0}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-2">
            <h2 className="text-base font-semibold">Last Export</h2>
            {!stats ? (
              <span className="loading loading-spinner loading-sm" />
            ) : !stats.ok ? (
              <p className="text-sm opacity-80">{stats.error}</p>
            ) : (
              <div className="space-y-1 text-sm">
                <p className="opacity-80">
                  {stats.lastExportAt ? new Date(stats.lastExportAt).toLocaleString() : "No exports yet."}
                </p>
                <p className="opacity-70">You can review export history and any failed runs below.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Orders Needing Attention</h2>
              <span className="text-xs opacity-70">{exceptions && exceptions.ok ? exceptions.items.length : "—"} items</span>
            </div>

            {!exceptions ? (
              <span className="loading loading-spinner loading-sm" />
            ) : !exceptions.ok ? (
              <p className="text-sm opacity-80">{exceptions.error}</p>
            ) : exceptions.items.length === 0 ? (
              <p className="text-sm opacity-70">Nothing needs action right now.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Issue</th>
                      <th>Status</th>
                      <th className="hidden md:table-cell">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exceptions.items.slice(0, 8).map((x) => (
                      <tr key={x.id}>
                        <td className="font-medium">{x.orderName ?? x.code}</td>
                        <td className="max-w-[340px] truncate">{x.message}</td>
                        <td>{x.status}</td>
                        <td className="hidden md:table-cell">{new Date(x.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="text-base font-semibold">Recent Exports</h2>

            {!exportsLog ? (
              <span className="loading loading-spinner loading-sm" />
            ) : !exportsLog.ok ? (
              <p className="text-sm opacity-80">{exportsLog.error}</p>
            ) : exportsLog.items.length === 0 ? (
              <p className="text-sm opacity-70">No exports yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Status</th>
                      <th className="hidden md:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exportsLog.items.slice(0, 8).map((e) => (
                      <tr key={e.id}>
                        <td>{new Date(e.createdAt).toLocaleString()}</td>
                        <td className="font-medium">{e.status}</td>
                        <td className="hidden md:table-cell opacity-80">{e.notes ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body space-y-3">
          <h2 className="text-base font-semibold">Recent Orders</h2>

          {!orders ? (
            <span className="loading loading-spinner loading-sm" />
          ) : !orders.ok ? (
            <p className="text-sm opacity-80">{orders.error}</p>
          ) : orders.items.length === 0 ? (
            <p className="text-sm opacity-70">No orders have been synced yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>State</th>
                    <th className="hidden md:table-cell">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.items.slice(0, 10).map((o) => (
                    <tr key={o.id}>
                      <td className="font-medium">{o.shopifyName}</td>
                      <td>{o.state}</td>
                      <td className="hidden md:table-cell">{new Date(o.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs opacity-60">
        Note: later we’ll add a dropdown here if a merchant uses multiple 3PLs.
      </div>
    </div>
  );
}
