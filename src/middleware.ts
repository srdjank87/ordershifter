// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const shop = url.searchParams.get("shop");
  const host = url.searchParams.get("host");

  // Continue request
  const res = NextResponse.next();

  // If Shopify provides shop/host on any request, persist them
  if (shop) res.cookies.set("os_shop", shop, { path: "/" });
  if (host) res.cookies.set("os_host", host, { path: "/" });

  return res;
}

// Run on landing + embedded app routes (adjust if you want)
export const config = {
  matcher: ["/", "/app/:path*", "/dashboard/:path*"],
};
