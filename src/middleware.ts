import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  const embedded = searchParams.get("embedded"); // usually "1"
  const shop = searchParams.get("shop");
  const host = searchParams.get("host");

  const isShopifyEmbedded = embedded === "1" && !!shop && !!host;

  // If Shopify is loading the marketing root inside the iframe, send to /app
  if (pathname === "/" && isShopifyEmbedded) {
    const url = req.nextUrl.clone();
    url.pathname = "/app";
    // (Optional) we can drop query params now because we persist them in cookies
    url.search = "";

    const res = NextResponse.redirect(url);

    // Persist for server-side context calls
    res.cookies.set("os_shop", shop!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    res.cookies.set("os_host", host!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  }

  // If /app is ever loaded WITH params, also persist them (helps re-installs)
  if (pathname.startsWith("/app") && isShopifyEmbedded) {
    const res = NextResponse.next();

    res.cookies.set("os_shop", shop!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set("os_host", host!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*"],
};
