import { NextRequest, NextResponse } from "next/server";

function cookieOptions(req: NextRequest) {
  const isHttps = req.nextUrl.protocol === "https:";
  return {
    httpOnly: true,
    secure: isHttps,          // must be true on https (Vercel)
    sameSite: "none" as const, // REQUIRED for Shopify iframe
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  const embedded = searchParams.get("embedded");
  const shop = searchParams.get("shop");
  const host = searchParams.get("host");

  const isShopifyEmbedded = embedded === "1" && !!shop && !!host;

  // When Shopify loads your App URL (/) in the iframe, redirect to /app
  if (pathname === "/" && isShopifyEmbedded) {
    const url = req.nextUrl.clone();
    url.pathname = "/app";

    // IMPORTANT: don't wipe querystring (keep shop/host available)
    // url.search = "";  <-- remove this if you had it

    const res = NextResponse.redirect(url);

    const opts = cookieOptions(req);
    res.cookies.set("os_shop", shop!, opts);
    res.cookies.set("os_host", host!, opts);

    return res;
  }

  // If /app is loaded WITH params, persist them too
  if (pathname.startsWith("/app") && isShopifyEmbedded) {
    const res = NextResponse.next();
    const opts = cookieOptions(req);
    res.cookies.set("os_shop", shop!, opts);
    res.cookies.set("os_host", host!, opts);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*"],
};
