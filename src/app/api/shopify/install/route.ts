// src/app/api/shopify/install/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signPayload } from "@/lib/shopify/signing";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = url.searchParams.get("shop");
  const account =
    url.searchParams.get("account") ||
    url.searchParams.get("tenant") ||
    "default";

  const apiKey = process.env.SHOPIFY_API_KEY!;
  const appUrl = process.env.SHOPIFY_APP_URL!;
  const scopes = process.env.SHOPIFY_SCOPES!;

  if (!shop) {
    return NextResponse.json({ error: "Missing ?shop=" }, { status: 400 });
  }

  // ... your existing tenant lookup / create logic ...

  const state = crypto.randomBytes(16).toString("hex");

  const ctxPayload = {
    shop,
    account,
    state,
    issuedAt: Date.now(),
  };

  const ctx = signPayload(ctxPayload);

  const redirectUri = `${appUrl}/api/shopify/callback`;

  const installUrl =
    `https://${shop}/admin/oauth/authorize?client_id=${encodeURIComponent(apiKey)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}`;

  const res = NextResponse.redirect(installUrl);

  // ✅ IMPORTANT: embedded iframe requires SameSite=None; Secure
  res.cookies.set("os_shopify_ctx", ctx, {
    httpOnly: true,
    secure: true, // must be true when SameSite=None
    sameSite: "none",
    path: "/",
    maxAge: 60 * 15,
  });

  return res;
}
