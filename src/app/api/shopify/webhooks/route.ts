// app/api/shopify/webhooks/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyShopifyWebhookHmac } from "@/lib/shopify/hmac";

export async function POST(req: Request) {
  const apiSecret = process.env.SHOPIFY_API_SECRET!;
  const topic = req.headers.get("x-shopify-topic") || "";
  const shop = req.headers.get("x-shopify-shop-domain") || "";
  const hmac = req.headers.get("x-shopify-hmac-sha256");

  const rawBody = await req.text();

  if (!verifyShopifyWebhookHmac(rawBody, hmac, apiSecret)) {
    return NextResponse.json({ error: "Invalid webhook HMAC" }, { status: 401 });
  }

  if (!shop) return NextResponse.json({ error: "Missing shop domain header" }, { status: 400 });

  // Find merchant (shop -> merchant account)
  const merchant = await prisma.merchantAccount.findFirst({
    where: { shopDomain: shop },
    include: { tenant: { include: { settings: true } } },
  });

  if (!merchant) {
    // Return 200 to avoid Shopify retries when unknown store hits us
    return NextResponse.json({ ok: true, ignored: true });
  }

  const tenantId = merchant.tenantId;
  const delayHours = merchant.tenant.settings?.delayHours ?? 6;

  const payload = JSON.parse(rawBody);

  // Shopify order id can be numeric; store as string for safety
  const shopifyOrderId = String(payload.id ?? "");
  const shopifyName = payload.name ? String(payload.name) : null;

  // created_at is ISO string
  const createdAtShopify = payload.created_at ? new Date(payload.created_at) : null;

  // Compute readyAt = createdAtShopify + delay window (fallback to now)
  const baseTime = createdAtShopify ?? new Date();
  const readyAt = new Date(baseTime.getTime() + delayHours * 60 * 60 * 1000);

  // Handle topics
  if (topic === "orders/create" || topic === "orders/updated") {
    await prisma.shopifyOrder.upsert({
      where: { merchantId_shopifyOrderId: { merchantId: merchant.id, shopifyOrderId } },
      update: {
        payload,
        shopifyName,
        createdAtShopify,
        // Do NOT overwrite readyAt if it already passed? For MVP we keep latest computed.
        readyAt,
      },
      create: {
        tenantId,
        merchantId: merchant.id,
        shopifyOrderId,
        shopifyName,
        createdAtShopify,
        payload,
        state: "PENDING_DELAY",
        readyAt,
      },
    });
  } else if (topic === "orders/cancelled") {
    // MVP: mark as ERROR or simply store payload; later you can add CANCELLED state.
    await prisma.shopifyOrder.updateMany({
      where: { merchantId: merchant.id, shopifyOrderId },
      data: {
        payload,
        lastError: "Order cancelled in Shopify",
        state: "ERROR",
      },
    });
  }

  return NextResponse.json({ ok: true });
}
