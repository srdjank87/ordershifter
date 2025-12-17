// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Only treat as Shopify embedded if the URL has embedded context.
  const isEmbedded =
    searchParams.get("embedded") === "1" ||
    searchParams.has("shop") ||
    searchParams.has("host") ||
    searchParams.has("hmac");

  // Marketing root: redirect ONLY if embedded params exist
  if (pathname === "/" && isEmbedded) {
    const url = req.nextUrl.clone();
    url.pathname = "/app";
    // keep the full query string so /app can read shop/host
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
