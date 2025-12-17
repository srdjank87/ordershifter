// src/app/api/app/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/app/stats?shop=ordershifter-development.myshopify.com
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");

  if (!shop) {
    return NextResponse.json({ ok: false, error: "Missing shop" }, { status: 400 });
  }

  // MerchantAccount has @@unique([shopDomain])
  const merchant = await prisma.merchantAccount.findUnique({
    where: { shopDomain: shop },
    select: { id: true, tenantId: true },
  });

  if (!merchant) {
    return NextResponse.json({ ok: false, error: "Unknown shop" }, { status: 404 });
  }

  const [ordersTotal, pending, held, ready, exported, ordersError, lastOrder] =
    await Promise.all([
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id } }),
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id, state: "PENDING" } }),
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id, state: "HELD" } }),
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id, state: "READY" } }),
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id, state: "EXPORTED" } }),
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id, state: "ERROR" } }),
      prisma.shopifyOrder.findFirst({
        where: { merchantId: merchant.id },
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
      }),
    ]);

  const lastExport = await prisma.exportLog.findFirst({
    where: { merchantId: merchant.id },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true, status: true },
  });

  // Simple “sync health” heuristic:
  // - bad: any ERROR orders OR last export failed
  // - warning: anything sitting in PENDING/HELD/READY
  // - good: otherwise
  const syncHealth =
    ordersError > 0 || lastExport?.status === "FAILED"
      ? "bad"
      : pending + held + ready > 0
        ? "warning"
        : "good";

  return NextResponse.json({
    ok: true,
    shop,
    metrics: {
      // NEW (explicit)
      pending,
      held,
      ready,

      // EXISTING keys (kept for UI compatibility)
      ordersTotal,
      awaitingDelay: held,
      readyToRoute: ready,
      routed: 0,
      exportQueued: 0,
      exported,
      ordersError,

      lastOrderSeenAt: lastOrder?.updatedAt?.toISOString() ?? null,
      lastExportAt: lastExport?.createdAt?.toISOString() ?? null,
      lastExportStatus: lastExport?.status ?? null,
      syncHealth,
    },
  });
}
