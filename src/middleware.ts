import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Only intercept the marketing root
  if (pathname !== "/") return NextResponse.next();

  const embedded = searchParams.get("embedded");
  const shop = searchParams.get("shop");
  const host = searchParams.get("host");

  // Shopify embedded loads / with these params
  if (embedded === "1" || !!shop || !!host) {
    const url = req.nextUrl.clone();
    url.pathname = "/app"; // ✅ merchant app home
    return NextResponse.redirect(url); // preserves the full query string
  }

  return NextResponse.next();
}

// Avoid catching next internals + static assets
export const config = {
  matcher: ["/"],
};
