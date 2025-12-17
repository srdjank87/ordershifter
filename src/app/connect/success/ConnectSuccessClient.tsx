"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import createApp, { type ClientApplication } from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";

export default function ConnectSuccessClient() {
  const sp = useSearchParams();

  const shop = sp.get("shop") ?? "";
  const account = sp.get("account") ?? "default";
  const hostFromUrl = sp.get("host");
  const embeddedFromUrl = sp.get("embedded");

  const host =
    hostFromUrl ??
    (typeof window !== "undefined"
      ? sessionStorage.getItem("os_host") ?? ""
      : "");

  const isEmbedded = useMemo(() => {
    if (embeddedFromUrl === "1") return true;
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("os_embedded") === "1";
  }, [embeddedFromUrl]);

  useEffect(() => {
    if (!isEmbedded) return;

    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;
    if (!apiKey || !host) return;

    const app: ClientApplication = createApp({
      apiKey,
      host,
      forceRedirect: true,
    });

    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.APP, "/app");
  }, [isEmbedded, host]);

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-lg font-semibold">Connected ✅</h1>

      <p className="text-sm opacity-80">
        Shop <span className="font-semibold">{shop}</span> is now connected to{" "}
        <span className="font-semibold">{account}</span>.
      </p>

      {!isEmbedded && (
        <p className="text-sm opacity-70">
          You can close this tab and open the app from Shopify Admin.
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <Link
          href={
            host
              ? `/app?host=${encodeURIComponent(host)}&embedded=1&shop=${encodeURIComponent(
                  shop
                )}`
              : "/app"
          }
          className="btn btn-sm btn-primary"
        >
          Open app
        </Link>

        <Link href="/" className="btn btn-sm btn-ghost">
          Back to site
        </Link>
      </div>
    </div>
  );
}
