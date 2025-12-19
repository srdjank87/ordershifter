// src/app/api/shopify/webhooks/route.ts
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyShopifyWebhookHmac } from "@/lib/shopify/hmac";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ShopifyWebhookTopic =
  | "orders/create"
  | "orders/updated"
  | "orders/cancelled"
  | "app/uninstalled"
  | "shop/redact"
  | "customers/redact"
  | "customers/data_request"
  | string;

function toInputJson(value: unknown): Prisma.InputJsonValue {
  // Prisma JSON columns accept InputJsonValue (string | number | boolean | object | array | null)
  // If value is undefined, store an empty object (or null if you prefer).
  if (value === undefined) return {} as Prisma.InputJsonValue;
  return value as Prisma.InputJsonValue;
}

export async function POST(req: Request) {
  const apiSecret = process.env.SHOPIFY_API_SECRET;
  if (!apiSecret) {
    return NextResponse.json({ error: "Missing SHOPIFY_API_SECRET" }, { status: 500 });
  }

  const topic = (req.headers.get("x-shopify-topic") || "") as ShopifyWebhookTopic;
  const shop = req.headers.get("x-shopify-shop-domain") || "";
  const hmac = req.headers.get("x-shopify-hmac-sha256");

  // Verify against RAW body
  const rawBody = await req.text();

  if (!verifyShopifyWebhookHmac(rawBody, hmac, apiSecret)) {
    return NextResponse.json({ error: "Invalid webhook HMAC" }, { status: 401 });
  }

  if (!shop) {
    return NextResponse.json({ error: "Missing shop domain header" }, { status: 400 });
  }

  const merchant = await prisma.merchantAccount.findFirst({
    where: { shopDomain: shop },
    include: { tenant: { include: { settings: true } } },
  });

  // Compliance topics can be sent even when we don't recognize the shop yet.
  // Always ACK 200 to avoid retries.
  if (!merchant) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  // ---- Compliance + uninstall handling ----
  if (topic === "shop/redact" || topic === "app/uninstalled") {
    const merchantId = merchant.id;

    await prisma.orderException.deleteMany({ where: { merchantId } }).catch(() => null);
    await prisma.exportLog.deleteMany({ where: { merchantId } }).catch(() => null);
    await prisma.shopifyOrder.deleteMany({ where: { merchantId } }).catch(() => null);
    await prisma.merchantAccount.deleteMany({ where: { id: merchantId } }).catch(() => null);

    return NextResponse.json({ ok: true });
  }

  if (topic === "customers/redact" || topic === "customers/data_request") {
    // MVP: we don't persist separate customer records; nothing to redact/return.
    return NextResponse.json({ ok: true });
  }

  // ---- Order topics (optional) ----
  // You can keep these enabled; they’ll still ACK even if payload is limited before approval.
  let payload: unknown = null;
  try {
    payload = rawBody ? (JSON.parse(rawBody) as unknown) : null;
  } catch {
    payload = null;
  }

  const tenantId = merchant.tenantId;
  const delayHours = merchant.tenant.settings?.delayHours ?? 6;

  const p = (payload ?? null) as Record<string, unknown> | null;
  const idVal = p?.id;
  const nameVal = p?.name;
  const createdAtVal = p?.created_at;

  const shopifyOrderId =
    typeof idVal === "number" || typeof idVal === "string" ? String(idVal) : "";
  const shopifyName = typeof nameVal === "string" ? nameVal : null;
  const createdAtShopify = typeof createdAtVal === "string" ? new Date(createdAtVal) : null;

  const baseTime = createdAtShopify ?? new Date();
  const readyAt = new Date(baseTime.getTime() + delayHours * 60 * 60 * 1000);

  const jsonPayload: Prisma.InputJsonValue = toInputJson(payload ?? {});

  if ((topic === "orders/create" || topic === "orders/updated") && shopifyOrderId) {
    await prisma.shopifyOrder.upsert({
      where: {
        merchantId_shopifyOrderId: { merchantId: merchant.id, shopifyOrderId },
      },
      update: {
        payload: jsonPayload,
        shopifyName,
        createdAtShopify,
        readyAt,
      },
      create: {
        tenantId,
        merchantId: merchant.id,
        shopifyOrderId,
        shopifyName,
        createdAtShopify,
        payload: jsonPayload,
        state: "PENDING",
        readyAt,
      },
    });

    return NextResponse.json({ ok: true });
  }

  if (topic === "orders/cancelled" && shopifyOrderId) {
    await prisma.shopifyOrder.updateMany({
      where: { merchantId: merchant.id, shopifyOrderId },
      data: {
        payload: jsonPayload,
        lastError: "Order cancelled in Shopify",
        state: "ERROR",
      },
    });

    return NextResponse.json({ ok: true });
  }

  // Unknown topic: acknowledge
  return NextResponse.json({ ok: true });
}
