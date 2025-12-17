// src/app/api/shopify/install/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signPayload } from "@/lib/shopify/signing";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = url.searchParams.get("shop");
  const account = url.searchParams.get("account") || url.searchParams.get("tenant") || "default";

  if (!shop) return NextResponse.json({ error: "Missing ?shop=" }, { status: 400 });

  let apiKey = "";
  let appUrl = "";
  let scopes = "";

  try {
    apiKey = requireEnv("SHOPIFY_API_KEY");
    appUrl = requireEnv("SHOPIFY_APP_URL");
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

  // Allow an explicit returnTo (handy for embedded flows)
  const returnToParam = url.searchParams.get("returnTo");
  const origin = req.headers.get("origin") || `${url.protocol}//${url.host}`;
  const returnTo = returnToParam ? new URL(returnToParam, origin).toString() : origin;

  const state = crypto.randomBytes(16).toString("hex");

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

  // IMPORTANT: must be SameSite=None for Shopify iframe flows
  res.cookies.set("os_shopify_ctx", ctx, {
    httpOnly: true,
    secure: true,              // Vercel is https
    sameSite: "none",          // REQUIRED for embedded
    path: "/",
    maxAge: 60 * 15,
  });

  return res;
}
