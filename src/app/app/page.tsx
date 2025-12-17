"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

type Ctx = { shop?: string; host?: string; embedded?: string };

function readSessionCtx(): Ctx {
  if (typeof window === "undefined") return {};
  return {
    shop: sessionStorage.getItem("os_shop") || undefined,
    host: sessionStorage.getItem("os_host") || undefined,
    embedded: sessionStorage.getItem("os_embedded") || undefined,
  };
}

export default function AppHome() {
  const params = useSearchParams();

  // Read URL params
  const urlCtx: Ctx = useMemo(
    () => ({
      shop: params.get("shop") ?? undefined,
      host: params.get("host") ?? undefined,
      embedded: params.get("embedded") ?? undefined,
    }),
    [params]
  );

  // Read sessionStorage synchronously (client component)
  const sessionCtx = useMemo(() => readSessionCtx(), []);

  // Derived ctx: URL wins, session is fallback
  const ctx: Ctx = {
    shop: urlCtx.shop ?? sessionCtx.shop,
    host: urlCtx.host ?? sessionCtx.host,
    embedded: urlCtx.embedded ?? sessionCtx.embedded,
  };

  // Persist URL params into sessionStorage (NO setState here)
  useEffect(() => {
    if (!urlCtx.shop && !urlCtx.host) return;

    sessionStorage.setItem("os_shop", urlCtx.shop ?? "");
    sessionStorage.setItem("os_host", urlCtx.host ?? "");
    sessionStorage.setItem("os_embedded", urlCtx.embedded ?? "");
  }, [urlCtx.shop, urlCtx.host, urlCtx.embedded]);

  if (!ctx.shop) {
    return (
      <main className="min-h-screen bg-base-100">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="alert alert-warning">
            <span className="font-semibold">Missing shop param.</span>
            <span className="opacity-80">
              This page is meant to be opened from Shopify admin (embedded). Try launching the app from your dev store.
            </span>
          </div>

          <div className="text-sm opacity-80">
            If you’re embedded and still seeing this, your App Bridge redirect is likely dropping query params.
          </div>

          <Link href="/" className="btn btn-ghost btn-sm w-fit">
            Back to marketing site
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-lg">
              Order<span className="text-primary">Shifter</span>
            </div>
            <div className="text-xs opacity-70">Merchant app • {ctx.shop}</div>
          </div>

          <Link href="/dashboard" className="btn btn-ghost btn-sm">
            3PL Admin
          </Link>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h1 className="text-xl font-bold">Merchant Home (WIP)</h1>
            <p className="opacity-80 mt-1">
              Next step: show exceptions + sync health for this shop.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
