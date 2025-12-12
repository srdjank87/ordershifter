// app/api/shopify/install/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signPayload } from "@/lib/shopify/signing";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = url.searchParams.get("shop");
  const account = url.searchParams.get("account") || url.searchParams.get("tenant") || "default"; // external label: account
  const apiKey = process.env.SHOPIFY_API_KEY!;
  const appUrl = process.env.SHOPIFY_APP_URL!; // canonical base e.g. http://localhost:3000 or https://app.ordershifter.com
  const scopes = process.env.SHOPIFY_SCOPES!;

  if (!shop) return NextResponse.json({ error: "Missing ?shop=" }, { status: 400 });

  const tenant = await prisma.tenant.findUnique({ where: { slug: account } });
  if (!tenant) return NextResponse.json({ error: "Unknown 3PL account" }, { status: 404 });

  // Capture the branded origin (where the merchant started) so we can send them back after install
  const origin = req.headers.get("origin") || `${url.protocol}//${url.host}`;
  const returnTo = origin;

  const state = crypto.randomBytes(16).toString("hex");

  // Store signed context in cookie (state + tenantSlug + returnTo)
  const ctx = signPayload({
    state,
    tenantSlug: tenant.slug,
    returnTo,
    iat: Date.now(),
  });

  const redirectUri = `${appUrl}/api/shopify/callback`;

  const installUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${encodeURIComponent(apiKey)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}`;

  const res = NextResponse.redirect(installUrl);
  res.cookies.set("os_shopify_ctx", ctx, {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 minutes
  });

  return res;
}
