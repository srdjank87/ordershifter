import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");
  const shop = searchParams.get("shop");

  if (!tenantId || !shop) {
    return NextResponse.json(
      { ok: false, error: "Missing shop or tenantId" },
      { status: 400 }
    );
  }

  // Merchant lookup (shopDomain is unique in your schema)
  const merchant = await prisma.merchantAccount.findFirst({
    where: { tenantId, shopDomain: shop },
    select: { id: true, status: true, installedAt: true, updatedAt: true },
  });

  if (!merchant) {
    return NextResponse.json(
      { ok: false, error: "Merchant not found for shop/tenant" },
      { status: 404 }
    );
  }

  const where = { tenantId, merchantId: merchant.id };

  const [
    pendingDelay,
    readyToRoute,
    routed,
    exportQueued,
    exported,
    errorCount,
    lastOrder,
    lastExport,
  ] = await Promise.all([
    prisma.shopifyOrder.count({ where: { ...where, state: "PENDING_DELAY" } }),
    prisma.shopifyOrder.count({ where: { ...where, state: "READY_TO_ROUTE" } }),
    prisma.shopifyOrder.count({ where: { ...where, state: "ROUTED" } }),
    prisma.shopifyOrder.count({ where: { ...where, state: "EXPORT_QUEUED" } }),
    prisma.shopifyOrder.count({ where: { ...where, state: "EXPORTED" } }),
    prisma.shopifyOrder.count({ where: { ...where, state: "ERROR" } }),
    prisma.shopifyOrder.findFirst({
      where,
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.exportLog.findFirst({
      where,
      orderBy: { createdAt: "desc" },
      select: { createdAt: true, status: true },
    }),
  ]);

  const lastActivity =
    lastExport?.createdAt ?? lastOrder?.updatedAt ?? merchant.updatedAt;

  return NextResponse.json({
    ok: true,
    merchant: {
      status: merchant.status,
      installedAt: merchant.installedAt,
    },
    counts: {
      pendingDelay,
      readyToRoute,
      routed,
      exportQueued,
      exported,
      error: errorCount,
    },
    last: {
      activityAt: lastActivity,
      lastExportStatus: lastExport?.status ?? null,
    },
  });
}
