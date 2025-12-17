// src/app/api/shopify/install/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signPayload } from "@/lib/shopify/signing";

type ShopifyCtx = {
  state: string;
  tenantSlug: string;
  returnTo: string;
  iat: number;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const shop = url.searchParams.get("shop");
  const account =
    url.searchParams.get("account") || url.searchParams.get("tenant") || "default";

  // These matter for embedded app nav
  const host = url.searchParams.get("host") ?? "";
  const embedded = url.searchParams.get("embedded") === "1" ? "1" : "";

  if (!shop) return NextResponse.json({ error: "Missing ?shop=" }, { status: 400 });

  let apiKey = "";
  let appUrl = "";
  let scopes = "";

  try {
    apiKey = requireEnv("SHOPIFY_API_KEY");
    appUrl = requireEnv("SHOPIFY_APP_URL"); // e.g. https://ordershifter.vercel.app
    scopes = requireEnv("SHOPIFY_SCOPES");
  } catch (e) {
    console.error("[install] env error:", e);
    return NextResponse.json(
      { error: "Server misconfigured (missing env vars). Check logs." },
      { status: 500 }
    );
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug: account } });
  if (!tenant) return NextResponse.json({ error: "Unknown 3PL account" }, { status: 404 });

  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = `${appUrl}/api/shopify/callback`;

  // ✅ IMPORTANT: returnTo should be YOUR app domain, not admin.shopify.com
  // Preserve embedded params so callback can send the merchant back into the iframe context.
  const returnTo = new URL(`${appUrl}/app`);
  if (embedded) returnTo.searchParams.set("embedded", embedded);
  if (host) returnTo.searchParams.set("host", host);
  returnTo.searchParams.set("shop", shop);

  const ctx: ShopifyCtx = {
    state,
    tenantSlug: tenant.slug,
    returnTo: returnTo.toString(),
    iat: Date.now(),
  };

  const signedCtx = signPayload(ctx);

  const installUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${encodeURIComponent(apiKey)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}`;

  const res = NextResponse.redirect(installUrl);

  // ✅ CRITICAL FOR IFRAME: SameSite=None + Secure
  res.cookies.set("os_shopify_ctx", signedCtx, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 15, // 15 minutes
  });

  return res;
}
