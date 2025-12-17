// src/app/api/shopify/callback/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayload } from "@/lib/shopify/signing";
import { verifyShopifyCallbackHmac } from "@/lib/shopify/hmac";
import { exchangeCodeForToken, registerWebhook } from "@/lib/shopify/client";

type ShopifyCtx = {
  state: string;
  tenantSlug: string;
  returnTo: string; // IMPORTANT: should include embedded context (host, embedded=1) if embedded install
  iat: number;
};

export async function GET(req: Request) {
  console.log("✅ CALLBACK HIT", { url: req.url });

  const url = new URL(req.url);

  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecret = process.env.SHOPIFY_API_SECRET;
  const appUrl = process.env.SHOPIFY_APP_URL;

  if (!apiKey || !apiSecret || !appUrl) {
    return NextResponse.json(
      { error: "Missing SHOPIFY_API_KEY / SHOPIFY_API_SECRET / SHOPIFY_APP_URL" },
      { status: 500 }
    );
  }

  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!shop || !code || !state) {
    return NextResponse.json({ error: "Missing shop/code/state" }, { status: 400 });
  }

  // Validate Shopify callback HMAC
  if (!verifyShopifyCallbackHmac(url, apiSecret)) {
    return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 });
  }

  // Read signed ctx cookie
  const cookieHeader = req.headers.get("cookie") || "";
  const ctxCookie = cookieHeader
    .split(";")
    .map((s) => s.trim())
    .find((c) => c.startsWith("os_shopify_ctx="));

  const raw = ctxCookie?.split("=").slice(1).join("=");
  if (!raw) {
    return NextResponse.json({ error: "Missing context cookie" }, { status: 400 });
  }

  const ctx = verifyPayload<ShopifyCtx>(decodeURIComponent(raw));
  if (!ctx) {
    return NextResponse.json({ error: "Invalid context cookie" }, { status: 400 });
  }

  if (ctx.state !== state) {
    return NextResponse.json({ error: "State mismatch" }, { status: 401 });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug: ctx.tenantSlug },
    include: { settings: true },
  });

  if (!tenant) {
    return NextResponse.json({ error: "Unknown 3PL account" }, { status: 404 });
  }

  // Exchange code for access token
  const token = await exchangeCodeForToken({
    shop,
    code,
    apiKey,
    apiSecret,
  });

  // Upsert MerchantAccount
  await prisma.merchantAccount.upsert({
    where: { tenantId_shopDomain: { tenantId: tenant.id, shopDomain: shop } },
    update: {
      status: "INSTALLED",
      accessToken: token.access_token,
      scope: token.scope,
      installedAt: new Date(),
    },
    create: {
      tenantId: tenant.id,
      shopDomain: shop,
      status: "INSTALLED",
      accessToken: token.access_token,
      scope: token.scope,
      installedAt: new Date(),
    },
  });

  console.log("✅ MERCHANT UPSERT", { shop, tenantId: tenant.id });

  // Register webhooks (non-fatal)
  const webhookAddress = `${appUrl}/api/shopify/webhooks`;

  // Safe-by-default topics (won't require protected customer data approvals)
  const topics: string[] = ["app/uninstalled", "shop/update"];

  // Enable order webhooks only if you explicitly turn it on (and your app is approved where required)
  if (process.env.SHOPIFY_ENABLE_ORDER_WEBHOOKS === "true") {
    topics.push("orders/create", "orders/updated", "orders/cancelled");
  }

  const results = await Promise.allSettled(
    topics.map((topic) =>
      registerWebhook({
        shop,
        accessToken: token.access_token,
        topic,
        address: webhookAddress,
      })
    )
  );

  const failures = results
    .map((r, i) => ({ r, topic: topics[i] }))
    .filter((x) => x.r.status === "rejected");

  if (failures.length) {
    console.warn(
      "[shopify] webhook registration failures:",
      failures.map((f) => ({
        topic: f.topic,
        error: String((f.r as PromiseRejectedResult).reason),
      }))
    );
  }

  // ✅ Redirect to connect/success while PRESERVING embedded params from ctx.returnTo
  // ctx.returnTo should already include embedded context like:
  //   https://ordershifter.vercel.app/app?embedded=1&host=...
  // We keep all existing query params, and just add shop + account.
  const redirectTo = new URL(ctx.returnTo);

  redirectTo.pathname = "/connect/success";
  redirectTo.searchParams.set("shop", shop);
  redirectTo.searchParams.set("account", tenant.slug);

  const res = NextResponse.redirect(redirectTo.toString(), { status: 302 });

  // Clear ctx cookie after successful install
  res.cookies.set("os_shopify_ctx", "", { path: "/", maxAge: 0 });

  return res;
}
