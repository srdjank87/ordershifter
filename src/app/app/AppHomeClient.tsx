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
  shop: string;   // always present (may be "")
  host: string;   // always present (may be "")
  error: string;
};

type CtxResponse = ContextOk | ContextNotOk;


export default function AppHomeClient() {
  const sp = useSearchParams();

  const shopFromUrl = sp.get("shop") ?? "";
  const hostFromUrl = sp.get("host") ?? "";
  const embedded = sp.get("embedded") === "1";

  const [ctx, setCtx] = useState<ContextOk | null>(null);
  const [error, setError] = useState<string>("");

  const host = useMemo(() => {
    if (hostFromUrl) return hostFromUrl;
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("os_host") ?? "";
  }, [hostFromUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hostFromUrl) sessionStorage.setItem("os_host", hostFromUrl);
    if (embedded) sessionStorage.setItem("os_embedded", "1");
    if (shopFromUrl) sessionStorage.setItem("os_shop", shopFromUrl);
  }, [hostFromUrl, embedded, shopFromUrl]);

  useEffect(() => {
    const run = async () => {
      setError("");

      const qs = new URLSearchParams();
      if (shopFromUrl) qs.set("shop", shopFromUrl);
      if (hostFromUrl) qs.set("host", hostFromUrl);

      const res = await fetch(`/api/app/context?${qs.toString()}`, {
        cache: "no-store",
      });

      const data = (await res.json()) as CtxResponse;

      // ✅ If not connected, trigger install from within Shopify admin properly
      if (!data.ok && data.code === "NEEDS_INSTALL") {
        const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;

        // If we’re embedded, we MUST use App Bridge redirect
        if (embedded && apiKey && (data.host || host)) {
          const app = createApp({
            apiKey,
            host: data.host || host,
            forceRedirect: true,
          });

          const redirect = Redirect.create(app);

          const installUrl =
          `/api/shopify/install?shop=${encodeURIComponent(data.shop)}` +
          `&host=${encodeURIComponent(data.host || host)}` +
          `&embedded=1`;

          // REMOTE ensures navigation happens correctly inside Shopify admin context
          redirect.dispatch(Redirect.Action.REMOTE, installUrl);
          return;
        }

        // Fallback (non-embedded)
        window.location.href = `/api/shopify/install?shop=${encodeURIComponent(
          data.shop
        )}`;
        return;
      }

      if (!data.ok) {
        setError(data.error || "Couldn’t load app context.");
        return;
      }

      setCtx(data);
    };

    run().catch((e) => setError(e?.message ?? "Couldn’t load app context."));
  }, [shopFromUrl, hostFromUrl, embedded, host]);

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Couldn’t load app context: {error}</span>
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

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">{ctx.tenantName} Portal</h1>
      {/* rest of your UI */}
    </div>
  );
}
