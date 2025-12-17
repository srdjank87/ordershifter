// src/app/api/app/orders/route.ts
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Minimal shape we need from Shopify REST
type ShopifyRestOrder = {
  id: number | string;
  name?: string | null;
  created_at?: string | null;
  // Keep the rest as unknown-safe payload
  [key: string]: unknown;
};

function toDateMaybe(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function fetchShopifyOrders(opts: {
  shop: string;
  accessToken: string;
  apiVersion: string;
  limit?: number;
}): Promise<ShopifyRestOrder[]> {
  const { shop, accessToken, apiVersion, limit = 25 } = opts;

  // NOTE: status=any is useful for dev; tighten later if you want
  const url =
    `https://${shop}/admin/api/${apiVersion}/orders.json` +
    `?status=any&limit=${encodeURIComponent(String(limit))}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    // Avoid Next caching
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Shopify orders fetch failed: ${res.status} ${text}`);
  }

  const json: unknown = await res.json();

  // Shopify returns { orders: [...] }
  if (
    typeof json === "object" &&
    json !== null &&
    "orders" in json &&
    Array.isArray((json as { orders?: unknown }).orders)
  ) {
    return (json as { orders: ShopifyRestOrder[] }).orders;
  }

  return [];
}

// GET /api/app/orders?shop=ordershifter-development.myshopify.com
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json({ ok: false, error: "Missing shop" }, { status: 400 });
    }

    // MerchantAccount has @@unique([shopDomain]) :contentReference[oaicite:2]{index=2}
    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: shop },
      select: {
        id: true,
        tenantId: true,
        accessToken: true,
        tenant: { select: { settings: { select: { delayHours: true } } } },
      },
    });

    if (!merchant) {
      return NextResponse.json({ ok: false, error: "Unknown shop" }, { status: 404 });
    }

    if (!merchant.accessToken) {
      return NextResponse.json(
        { ok: false, error: "Missing access token for shop (reinstall app?)" },
        { status: 409 }
      );
    }

    const delayHours = merchant.tenant?.settings?.delayHours ?? 6;

    const orders = await fetchShopifyOrders({
      shop,
      accessToken: merchant.accessToken,
      apiVersion: "2025-10",
      limit: 25,
    });

    let upserted = 0;

    for (const o of orders) {
      const shopifyOrderId = String(o.id);
      const shopifyName = typeof o.name === "string" ? o.name : null;
      const createdAtShopify = toDateMaybe(o.created_at);

      const base = createdAtShopify ?? new Date();
      const readyAt = new Date(base.getTime() + delayHours * 60 * 60 * 1000);

      // Use compound unique @@unique([merchantId, shopifyOrderId]) :contentReference[oaicite:3]{index=3}
      await prisma.shopifyOrder.upsert({
        where: {
          merchantId_shopifyOrderId: {
            merchantId: merchant.id,
            shopifyOrderId,
          },
        },
        update: {
          payload: o as unknown as Prisma.InputJsonValue,
          shopifyName,
          createdAtShopify,
          // Don’t blindly stomp state here — keep pipeline logic in worker/webhooks
          readyAt,
        },
        create: {
          tenantId: merchant.tenantId,
          merchantId: merchant.id,
          shopifyOrderId,
          shopifyName,
          createdAtShopify,
          payload: o as unknown as Prisma.InputJsonValue,
          state: "PENDING",
          readyAt,
        },
      });

      upserted += 1;
    }

    return NextResponse.json({
      ok: true,
      shop,
      fetched: orders.length,
      upserted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
