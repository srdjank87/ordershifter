// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const EMBED_COOKIE_OPTS = {
  httpOnly: true,
  secure: true,       // must be true when SameSite=None
  sameSite: "none" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days (tweak as you like)
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const embedded = url.searchParams.get("embedded"); // "1"
  const shop = url.searchParams.get("shop");
  const host = url.searchParams.get("host");

  // Only set cookies when Shopify actually gives us context
  if (embedded === "1" && shop) {
    const res = NextResponse.next();

    res.cookies.set("os_shop", shop, EMBED_COOKIE_OPTS);
    res.cookies.set("os_embedded", "1", EMBED_COOKIE_OPTS);
    if (host) res.cookies.set("os_host", host, EMBED_COOKIE_OPTS);

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*", "/api/app/:path*"],
};
