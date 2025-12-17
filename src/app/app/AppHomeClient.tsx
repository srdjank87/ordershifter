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
  const [error, setError] = useState<string>("");

  // Persist best-known context
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hostFromUrl) sessionStorage.setItem("os_host", hostFromUrl);
    if (shopFromUrl) sessionStorage.setItem("os_shop", shopFromUrl);
    if (embeddedFromUrl) sessionStorage.setItem("os_embedded", "1");
  }, [hostFromUrl, shopFromUrl, embeddedFromUrl]);

  useEffect(() => {
    const run = async () => {
      setError("");

      // Build query using best-known values (URL -> storage)
      const qs = new URLSearchParams();
      if (shop) qs.set("shop", shop);
      if (host) qs.set("host", host);

      const res = await fetch(`/api/app/context?${qs.toString()}`, {
        cache: "no-store",
      });

      // If the response is empty/non-JSON, this prevents the “Unexpected end of JSON input”
      const text = await res.text();
      let data: CtxResponse;
      try {
        data = JSON.parse(text) as CtxResponse;
      } catch {
        throw new Error("Context endpoint returned non-JSON response.");
      }

      // If not connected, trigger install
      if (!data.ok && data.code === "NEEDS_INSTALL") {
        const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;

        // Use App Bridge redirect inside Shopify admin
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

        // Non-embedded fallback
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

    run().catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : "Couldn’t load app context.";
      setError(msg);
    });
  }, [shop, host, embedded]);

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
