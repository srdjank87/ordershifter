import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/app/stats?shop=ordershifter-development.myshopify.com
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");

  if (!shop) {
    return NextResponse.json({ ok: false, error: "Missing shop" }, { status: 400 });
  }

  // MerchantAccount has @@unique([shopDomain]) :contentReference[oaicite:1]{index=1}
  const merchant = await prisma.merchantAccount.findUnique({
    where: { shopDomain: shop },
    select: { id: true, tenantId: true },
  });

  if (!merchant) {
    return NextResponse.json({ ok: false, error: "Unknown shop" }, { status: 404 });
  }

  const [ordersTotal, awaitingDelay, readyToRoute, routed, exportQueued, exported, ordersError, lastOrder] =
    await Promise.all([
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id } }),
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id, state: "PENDING_DELAY" } }),
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id, state: "READY_TO_ROUTE" } }),
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id, state: "ROUTED" } }),
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id, state: "EXPORT_QUEUED" } }),
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

  // Very simple “sync health” heuristic for now:
  // - bad: any ERROR orders
  // - warning: anything stuck in delay/queued
  // - good: otherwise
  const syncHealth =
    ordersError > 0 ? "bad" : awaitingDelay + exportQueued > 0 ? "warning" : "good";

  return NextResponse.json({
    ok: true,
    shop,
    metrics: {
      ordersTotal,
      awaitingDelay,
      readyToRoute,
      routed,
      exportQueued,
      exported,
      ordersError,
      lastOrderSeenAt: lastOrder?.updatedAt?.toISOString() ?? null,
      lastExportAt: lastExport?.createdAt?.toISOString() ?? null,
      lastExportStatus: lastExport?.status ?? null,
      syncHealth,
    },
  });
}
