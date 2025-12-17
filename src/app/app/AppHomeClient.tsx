"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";

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

// ---- Minimal shapes (adjust if your API returns different fields)
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

type ExportsResp =
  | { ok: true; items: ExportRow[] }
  | { ok: false; error: string };

type OrderRow = {
  id: string;
  shopifyOrderId: string;
  shopifyName: string;
  state: string;
  createdAt: string;
};

type OrdersResp = { ok: true; items: OrderRow[] } | { ok: false; error: string };

export default function AppHomeClient() {
  const sp = useSearchParams();

  // Raw URL params (may be missing on subsequent embedded loads)
  const shopFromUrl = sp.get("shop") ?? "";
  const hostFromUrl = sp.get("host") ?? "";
  const embeddedFromUrl = sp.get("embedded") === "1";

  // Fallbacks from sessionStorage
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

  const [ctx, setCtx] = useState<ContextOk | null>(null);
  const [ctxError, setCtxError] = useState<string>("");

  // Data states
  const [stats, setStats] = useState<StatsResp | null>(null);
  const [exceptions, setExceptions] = useState<ExceptionsResp | null>(null);
  const [exportsLog, setExportsLog] = useState<ExportsResp | null>(null);
  const [orders, setOrders] = useState<OrdersResp | null>(null);

  // Persist best-known context
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hostFromUrl) sessionStorage.setItem("os_host", hostFromUrl);
    if (shopFromUrl) sessionStorage.setItem("os_shop", shopFromUrl);
    if (embeddedFromUrl) sessionStorage.setItem("os_embedded", "1");
  }, [hostFromUrl, shopFromUrl, embeddedFromUrl]);

  // ---- Load app context (and run install if needed)
  useEffect(() => {
    const run = async () => {
      setCtxError("");

      const qs = new URLSearchParams();
      if (shop) qs.set("shop", shop);
      if (host) qs.set("host", host);

      const res = await fetch(`/api/app/context?${qs.toString()}`, {
        cache: "no-store",
      });

      const text = await res.text();
      let data: CtxResponse;
      try {
        data = JSON.parse(text) as CtxResponse;
      } catch {
        throw new Error("Context endpoint returned non-JSON response.");
      }

      if (!data.ok && data.code === "NEEDS_INSTALL") {
        const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;

        if (embedded && apiKey && (data.host || host) && data.shop) {
          const app = createApp({
            apiKey,
            host: data.host || host,
            forceRedirect: true,
          });

          const redirect = Redirect.create(app);

          const origin =
            typeof window !== "undefined" ? window.location.origin : "";
          const installUrl =
            `${origin}/api/shopify/install?shop=${encodeURIComponent(data.shop)}` +
            `&host=${encodeURIComponent(data.host || host)}` +
            `&embedded=1`;

          redirect.dispatch(Redirect.Action.REMOTE, installUrl);
          return;
        }

        window.location.href = `/api/shopify/install?shop=${encodeURIComponent(
          data.shop
        )}`;
        return;
      }

      if (!data.ok) {
        setCtxError(data.error || "Couldn’t load app context.");
        return;
      }

      setCtx(data);
    };

    run().catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : "Couldn’t load app context.";
      setCtxError(msg);
    });
  }, [shop, host, embedded]);

  // ---- Once context is loaded, fetch dashboard data
  useEffect(() => {
    if (!ctx?.shop) return;

    const qs = new URLSearchParams({ shop: ctx.shop });

    const loadAll = async () => {
      const [s, ex, exp, o] = await Promise.all([
        fetch(`/api/app/stats?${qs.toString()}`, { cache: "no-store" }).then(
          (r) => r.json() as Promise<StatsResp>
        ),
        fetch(`/api/app/exceptions?${qs.toString()}`, {
          cache: "no-store",
        }).then((r) => r.json() as Promise<ExceptionsResp>),
        fetch(`/api/app/exports?${qs.toString()}`, { cache: "no-store" }).then(
          (r) => r.json() as Promise<ExportsResp>
        ),
        fetch(`/api/app/orders?${qs.toString()}`, { cache: "no-store" }).then(
          (r) => r.json() as Promise<OrdersResp>
        ),
      ]);

      setStats(s);
      setExceptions(ex);
      setExportsLog(exp);
      setOrders(o);
    };

    loadAll().catch((e: unknown) => {
      // Don’t hard-fail the whole UI; show partial sections.
      console.error("App dashboard fetch failed:", e);
    });
  }, [ctx?.shop]);

  // ---- UI states
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

  const attentionCount =
    exceptions && exceptions.ok ? exceptions.items.length : null;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{ctx.tenantName} Portal</h1>
          <p className="text-sm opacity-70">
            Order status, issues that need action, and recent exports — all in one
            place.
          </p>
        </div>

        {/* Lightweight merchant-facing status pills */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="px-3 py-2 rounded-xl bg-base-200 border border-base-300 text-sm">
            <div className="opacity-70 text-xs">Store</div>
            <div className="font-semibold">{ctx.shop}</div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-base-200 border border-base-300 text-sm">
            <div className="opacity-70 text-xs">Needs attention</div>
            <div className="font-semibold">
              {attentionCount === null ? "—" : attentionCount}
            </div>
          </div>
        </div>
      </div>

      {/* Top grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sync health */}
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
                  Status:{" "}
                  <span className="font-semibold">
                    {stats.syncHealth ?? "OK"}
                  </span>
                </p>
                {stats.message ? (
                  <p className="text-sm opacity-70">{stats.message}</p>
                ) : (
                  <p className="text-sm opacity-70">
                    Everything looks normal right now.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Orders in progress */}
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
                  <div
                    key={k}
                    className="rounded-xl bg-base-100 border border-base-300 px-3 py-2"
                  >
                    <div className="text-xs opacity-70">{k}</div>
                    <div className="text-lg font-semibold">
                      {stats.counts?.[k] ?? 0}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Last export */}
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
                  {stats.lastExportAt
                    ? new Date(stats.lastExportAt).toLocaleString()
                    : "No exports yet."}
                </p>
                <p className="opacity-70">
                  You can review export history and any failed runs below.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Orders needing attention */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Orders Needing Attention</h2>
              <span className="text-xs opacity-70">
                {exceptions && exceptions.ok ? exceptions.items.length : "—"} items
              </span>
            </div>

            {!exceptions ? (
              <span className="loading loading-spinner loading-sm" />
            ) : !exceptions.ok ? (
              <p className="text-sm opacity-80">{exceptions.error}</p>
            ) : exceptions.items.length === 0 ? (
              <p className="text-sm opacity-70">
                Nothing needs action right now.
              </p>
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
                        <td className="font-medium">
                          {x.orderName ?? x.code}
                        </td>
                        <td className="max-w-[340px] truncate">{x.message}</td>
                        <td>{x.status}</td>
                        <td className="hidden md:table-cell">
                          {new Date(x.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent exports */}
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
                        <td className="hidden md:table-cell opacity-80">
                          {e.notes ?? "—"}
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

      {/* Recent orders */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body space-y-3">
          <h2 className="text-base font-semibold">Recent Orders</h2>

          {!orders ? (
            <span className="loading loading-spinner loading-sm" />
          ) : !orders.ok ? (
            <p className="text-sm opacity-80">{orders.error}</p>
          ) : orders.items.length === 0 ? (
            <p className="text-sm opacity-70">
              No orders have been synced yet.
            </p>
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
                      <td className="hidden md:table-cell">
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Note for later: 3PL dropdown */}
      <div className="text-xs opacity-60">
        Note: later we’ll add a dropdown here if a merchant uses multiple 3PLs.
      </div>
    </div>
  );
}
