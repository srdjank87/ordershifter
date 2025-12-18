import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminRestClient } from "@/lib/shopify/client";
import { Prisma } from "@prisma/client";

type ShopifyRestOrder = {
  id: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
};

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const key = url.searchParams.get("key");
    const expected = process.env.CRON_SECRET;
    if (!expected || key !== expected) {
      return json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const minutesRaw = url.searchParams.get("minutes") ?? "60";
    const minutes = Number(minutesRaw);
    const lookbackMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 60;

    const merchants = await prisma.merchantAccount.findMany({
      where: {
        accessToken: { not: null },
        shopDomain: { not: "" },
      },
      select: {
        id: true,
        tenantId: true,
        shopDomain: true,
        accessToken: true,
      },
    });

    const updatedAtMin = new Date(Date.now() - lookbackMinutes * 60_000).toISOString();

    let totalFetched = 0;
    let totalUpserted = 0;
    const perShop: Record<string, { fetched: number; upserted: number; error?: string }> = {};

    for (const m of merchants) {
      if (!m.accessToken) continue;

      const shop = m.shopDomain;
      perShop[shop] = { fetched: 0, upserted: 0 };

      const client = getAdminRestClient({
        shop, // <-- IMPORTANT: your client expects "shop"
        accessToken: m.accessToken,
        apiVersion: "2025-10",
      });

      const res = (await client.get(
        `/orders.json?status=any&limit=250&order=updated_at%20desc&updated_at_min=${encodeURIComponent(
          updatedAtMin
        )}`
      )) as Response;

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        perShop[shop].error = `${res.status} ${text}`;
        console.error("poll-orders Shopify error", shop, res.status, text);
        await sleep(250);
        continue;
      }

      const body = (await res.json()) as { orders?: ShopifyRestOrder[] };
      const orders = body.orders ?? [];

      perShop[shop].fetched = orders.length;
      totalFetched += orders.length;

      for (const o of orders) {
        const shopifyOrderId = String(o.id);
        const shopifyName = o.name ?? `#${o.id}`;
        const createdAtShopify = o.created_at ? new Date(o.created_at) : null;

        await prisma.shopifyOrder.upsert({
          where: {
            merchantId_shopifyOrderId: {
              merchantId: m.id,
              shopifyOrderId,
            },
          },
          create: {
            tenantId: m.tenantId,
            merchantId: m.id,
            shopifyOrderId,
            shopifyName,
            createdAtShopify,
            // required in your schema:
            readyAt: createdAtShopify ?? new Date(),
            payload: o as unknown as Prisma.InputJsonValue,
            state: "PENDING",
          },
          update: {
            shopifyName,
            createdAtShopify,
            payload: o as unknown as Prisma.InputJsonValue,
          },
        });

        perShop[shop].upserted += 1;
        totalUpserted += 1;
      }

      await sleep(250);
    }

    return json({
      ok: true,
      merchants: merchants.length,
      updated_at_min: updatedAtMin,
      totalFetched,
      totalUpserted,
      perShop,
    });
  } catch (err) {
    console.error("poll-orders error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return json({ ok: false, error: message }, { status: 500 });
  }
}
