// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const shop = url.searchParams.get("shop");
  const host = url.searchParams.get("host");
  const embedded = url.searchParams.get("embedded");

  const cookieShop = req.cookies.get("os_shop")?.value;
  const cookieHost = req.cookies.get("os_host")?.value;

  const isEmbeddedRequest =
    embedded === "1" || Boolean(shop) || Boolean(host) || (Boolean(cookieShop) && Boolean(cookieHost));

  // Always persist latest shop/host when Shopify provides them
  const res = NextResponse.next();
  if (shop) res.cookies.set("os_shop", shop, { path: "/", sameSite: "lax" });
  if (host) res.cookies.set("os_host", host, { path: "/", sameSite: "lax" });

  // ✅ If Shopify is hitting the root (/) inside the iframe, send to /app
  if (url.pathname === "/" && isEmbeddedRequest) {
    const target = url.clone();
    target.pathname = "/app";

    // Preserve all params if they exist
    // If Shopify didn't include them this time, fall back to cookies
    if (!target.searchParams.get("shop") && cookieShop) target.searchParams.set("shop", cookieShop);
    if (!target.searchParams.get("host") && cookieHost) target.searchParams.set("host", cookieHost);
    if (!target.searchParams.get("embedded")) target.searchParams.set("embedded", "1");

    const redirectRes = NextResponse.redirect(target);

    // Keep cookies on the redirect response too
    if (shop) redirectRes.cookies.set("os_shop", shop, { path: "/", sameSite: "lax" });
    if (host) redirectRes.cookies.set("os_host", host, { path: "/", sameSite: "lax" });

    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ["/", "/app/:path*", "/dashboard/:path*"],
};
