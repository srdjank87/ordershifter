import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shop = url.searchParams.get("shop");

    if (!shop) {
      return NextResponse.json({ ok: false, error: "Missing shop" }, { status: 400 });
    }

    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: shop },
      select: { id: true },
    });

    if (!merchant) {
      return NextResponse.json({ ok: false, error: "Merchant not found" }, { status: 404 });
    }

    const grouped = await prisma.shopifyOrder.groupBy({
      by: ["state"],
      where: { merchantId: merchant.id },
      _count: { _all: true },
    });

    const counts: Record<string, number> = {
      PENDING: 0,
      HELD: 0,
      READY: 0,
      EXPORTED: 0,
      ERROR: 0,
    };

    for (const g of grouped) {
      counts[String(g.state)] = g._count._all;
    }

    const lastOrder = await prisma.shopifyOrder.findFirst({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    const lastExport = await prisma.exportLog.findFirst({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    return NextResponse.json({
      ok: true,
      counts,
      lastOrderSeenAt: lastOrder?.createdAt?.toISOString() ?? null,
      lastExportAt: lastExport?.createdAt?.toISOString() ?? null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stats failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
