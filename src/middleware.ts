// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const EMBED_COOKIE_OPTS = {
  httpOnly: true,
  secure: true, // required for SameSite=None
  sameSite: "none" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const embedded = url.searchParams.get("embedded"); // typically "1"
  const shop = url.searchParams.get("shop");
  const host = url.searchParams.get("host");

  const isEmbeddedRequest =
    embedded === "1" || Boolean(host) || Boolean(shop);

  // Only special-case Shopify embedded loads.
  if (isEmbeddedRequest) {
    // Set cookies (so API routes can read shop/host later)
    const res =
      url.pathname === "/"
        ? NextResponse.redirect(new URL(`/app${url.search}`, req.url))
        : NextResponse.next();

    if (shop) res.cookies.set("os_shop", shop, EMBED_COOKIE_OPTS);
    if (host) res.cookies.set("os_host", host, EMBED_COOKIE_OPTS);
    res.cookies.set("os_embedded", "1", EMBED_COOKIE_OPTS);

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*", "/api/app/:path*"],
};
