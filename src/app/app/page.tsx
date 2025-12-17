// src/app/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

import { cookies } from "next/headers";

// App Router page can read query params via `searchParams`
type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function first(param: string | string[] | undefined) {
  if (!param) return undefined;
  return Array.isArray(param) ? param[0] : param;
}

export default async function AppHome({ searchParams }: PageProps) {
  const cookieStore = await cookies(); // ✅ await is the fix

  const shop =
    first(searchParams?.shop) ?? cookieStore.get("os_shop")?.value;

  const host =
    first(searchParams?.host) ?? cookieStore.get("os_host")?.value;

  const embedded = first(searchParams?.embedded);

  // If Shopify opens your app, it SHOULD pass `shop` (+ usually `host`)
  if (!shop) {
    return (
      <main className="min-h-screen bg-base-100">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center">
              <span className="font-bold">OS</span>
            </div>
            <div className="leading-tight">
              <div className="font-bold text-lg">OrderShifter</div>
              <div className="text-xs opacity-70">Merchant App Home</div>
            </div>
          </div>

          <div className="alert alert-warning">
            <span className="font-semibold">Missing shop param.</span>
            <span className="opacity-80">
              This page is meant to be opened from Shopify admin (embedded). Try launching the app from your dev store.
            </span>
          </div>

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body text-sm space-y-2">
              <p className="opacity-80">
                If you’re testing manually, the URL usually looks like:
              </p>
              <code className="bg-base-100 border border-base-300 rounded-lg px-3 py-2 text-xs block overflow-auto">
                /app?shop=your-store.myshopify.com&amp;embedded=1&amp;host=...
              </code>
              <p className="opacity-70 text-xs">
                (Shopify generates <code>host</code> automatically.)
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Look up the merchant record (field name assumed: shopDomain)
  // If your field is named differently, change `shopDomain` below.
  const merchant = await prisma.merchantAccount.findFirst({
    where: { shopDomain: shop },
    select: {
      id: true,
      tenantId: true,
      shopDomain: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const isEmbedded = embedded === "1" || Boolean(host);

  return (
    <main className="min-h-screen bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-base-200 flex items-center justify-center overflow-hidden">
              {/* If you have your icon in /public/icon.png, it will render here */}
              <Image
                src="/icon.png"
                alt="OrderShifter"
                width={40}
                height={40}
                className="w-10 h-10"
                priority={false}
              />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-lg">
                Order<span className="text-primary">Shifter</span>
              </div>
              <div className="text-xs opacity-70">
                Merchant dashboard • {shop}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="btn btn-ghost btn-sm">
              3PL Admin
            </Link>
            <a
              href="/api/debug/db"
              className="btn btn-outline btn-sm"
              target="_blank"
              rel="noreferrer"
            >
              DB Debug
            </a>
          </div>
        </div>

        {/* Embedded hint */}
        {!isEmbedded && (
          <div className="alert alert-info text-sm">
            <span className="font-semibold">Heads up:</span>
            <span className="opacity-80">
              This page is usually opened embedded inside Shopify admin. Opening it directly is fine for testing.
            </span>
          </div>
        )}

        {/* Status */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card bg-base-200 shadow-sm lg:col-span-2">
            <div className="card-body space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold">Connected to OrderShifter</h1>
                  <p className="text-sm opacity-80 mt-1">
                    This is the merchant-facing home inside Shopify admin. We’ll
                    show routing status, exceptions, and sync health here.
                  </p>
                </div>

                <div className="badge badge-lg badge-outline">
                  {merchant ? "Connected" : "Not connected"}
                </div>
              </div>

              {!merchant ? (
                <div className="alert alert-warning text-sm">
                  <span className="font-semibold">No merchant record found.</span>
                  <span className="opacity-80">
                    The app is loading, but we don’t see this shop in{" "}
                    <code>MerchantAccount</code> yet. This usually means the install/callback didn’t finish or the DB URL differs.
                  </span>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-base-100 border border-base-300 rounded-xl p-3 space-y-1">
                    <div className="font-semibold">Connection Details</div>
                    <div className="opacity-80">
                      Status: <span className="font-semibold">{String(merchant.status)}</span>
                    </div>
                    <div className="opacity-80">
                      Connected:{" "}
                      <span className="font-semibold">
                        {new Date(merchant.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="opacity-70 text-xs">
                      Shop: {merchant.shopDomain}
                    </div>
                  </div>

                  <div className="bg-base-100 border border-base-300 rounded-xl p-3 space-y-1">
                    <div className="font-semibold">What happens next</div>
                    <ul className="list-disc list-inside opacity-80 space-y-1">
                      <li>Fetch orders + products to establish baseline.</li>
                      <li>Start “Exception Gate” for risky updates.</li>
                      <li>Enable SKU compliance rules (optional).</li>
                    </ul>
                    <div className="text-xs opacity-70 pt-1">
                      You’re on track — next we’ll build the first “merchant view”
                      (orders + exceptions).
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body space-y-3">
              <h2 className="text-base font-semibold">Quick Links</h2>

              <div className="space-y-2 text-sm">
                <Link href={`/api/shopify/install?shop=${encodeURIComponent(shop)}`} className="btn btn-outline btn-sm w-full">
                  Re-run Install (debug)
                </Link>

                <a
                  href="/api/debug/db"
                  className="btn btn-ghost btn-sm w-full"
                  target="_blank"
                  rel="noreferrer"
                >
                  View DB Debug JSON
                </a>

                <Link href="/" className="btn btn-ghost btn-sm w-full">
                  Marketing site
                </Link>
              </div>

              <div className="divider my-1" />

              <div className="text-xs opacity-70">
                <div className="font-semibold mb-1">Dev info</div>
                <div>embedded: {embedded ?? "—"}</div>
                <div>host: {host ? "present" : "—"}</div>
                <div>shop: {shop}</div>
                {merchant && (
                  <div className="mt-2">
                    <div>merchantId: {merchant.id}</div>
                    <div>tenantId: {merchant.tenantId}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-xs opacity-60">
          Note: this is intentionally lightweight. Once we add App Bridge navigation + authenticated merchant context,
          this becomes the true “Merchant Home” surface.
        </div>
      </div>
    </main>
  );
}
