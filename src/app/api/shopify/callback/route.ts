// src/app/api/shopify/callback/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// If you already have a shared helper for Admin REST calls, use it.
// Otherwise keep this minimal inline fetch.
async function shopifyRest(
  shop: string,
  accessToken: string,
  path: string,
  body?: unknown,
) {
  const apiVersion = process.env.SHOPIFY_REST_API_VERSION || "2025-10";
  const url = `https://${shop}/admin/api/${apiVersion}${path}`;

  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

function verifyOAuthHmac(params: URLSearchParams, apiSecret: string) {
  // Shopify OAuth HMAC verification
  const hmac = params.get("hmac");
  if (!hmac) return false;

  const message = Array.from(params.entries())
    .filter(([k]) => k !== "hmac" && k !== "signature")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const digest = crypto.createHmac("sha256", apiSecret).update(message).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest, "utf8"), Buffer.from(hmac, "utf8"));
}

export async function GET(req: Request) {
  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecret = process.env.SHOPIFY_API_SECRET;
  const appUrl = process.env.SHOPIFY_APP_URL;

  if (!apiKey || !apiSecret || !appUrl) {
    return NextResponse.json(
      { error: "Missing SHOPIFY env vars (SHOPIFY_API_KEY/SECRET/APP_URL)" },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const sp = url.searchParams;

  const shop = sp.get("shop");
  const code = sp.get("code");
  const state = sp.get("state");

  if (!shop || !code || !state) {
    return NextResponse.json({ error: "Missing shop/code/state" }, { status: 400 });
  }

  // Basic shop validation
  if (!shop.endsWith(".myshopify.com")) {
    return NextResponse.json({ error: "Invalid shop domain" }, { status: 400 });
  }

  // Verify HMAC from Shopify
  if (!verifyOAuthHmac(sp, apiSecret)) {
    return NextResponse.json({ error: "Invalid OAuth HMAC" }, { status: 401 });
  }

  // Verify state (nonce)
  const cookieHeader = req.headers.get("cookie") || "";
  const stateCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("os_state="))
    ?.split("=")[1];

  if (!stateCookie || stateCookie !== state) {
    return NextResponse.json({ error: "Invalid state" }, { status: 401 });
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    }),
  });

  const tokenJson = (await tokenRes.json()) as { access_token?: string; scope?: string; error?: string };

  if (!tokenRes.ok || !tokenJson.access_token) {
    return NextResponse.json(
      { error: `Token exchange failed: ${JSON.stringify(tokenJson)}` },
      { status: 500 },
    );
  }

  const accessToken = tokenJson.access_token;
  const scope = tokenJson.scope || null;

  // Ensure we have a tenant (default for now)
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    return NextResponse.json({ error: "No tenant found" }, { status: 500 });
  }

  // Upsert merchant account
  const merchant = await prisma.merchantAccount.upsert({
    where: { shopDomain: shop },
    update: {
      tenantId: tenant.id,
      accessToken,
      scope,
      installedAt: new Date(),
      status: "ACTIVE",
    },
    create: {
      tenantId: tenant.id,
      shopDomain: shop,
      accessToken,
      scope,
      installedAt: new Date(),
      status: "ACTIVE",
    },
  });

  // Register mandatory compliance webhooks (+ uninstalled)
  // Using REST Admin API endpoint: /webhooks.json
  const webhookAddress = `${appUrl}/api/shopify/webhooks`;

  const topicsToRegister = [
    "app/uninstalled",
    "shop/redact",
    "customers/redact",
    "customers/data_request",
    // Enable these later once approved (optional):
    // "orders/create",
    // "orders/updated",
    // "orders/cancelled",
  ] as const;

  for (const topic of topicsToRegister) {
    try {
      await shopifyRest(shop, accessToken, "/webhooks.json", {
        webhook: {
          topic,
          address: webhookAddress,
          format: "json",
        },
      });
    } catch {
      // Ignore duplicates / already registered / etc.
      // (Shopify may return 422 if already exists, which is fine.)
    }
  }

  // Set cookies so embedded app can discover context
  const res = NextResponse.redirect(`${appUrl}/connect/success?shop=${encodeURIComponent(shop)}`);

  // Clear state cookie
  res.cookies.set("os_state", "", { path: "/", maxAge: 0 });

  // Helpful cookies for your app context
  res.cookies.set("os_shop", shop, { path: "/", httpOnly: false, sameSite: "lax", secure: true });

  // Keep tenantId in a cookie so context route can resolve fast (optional)
  res.cookies.set("os_tenantId", merchant.tenantId, { path: "/", httpOnly: false, sameSite: "lax", secure: true });

  return res;
}
