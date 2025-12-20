import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

type Counts = Record<"PENDING" | "HELD" | "READY" | "EXPORTED" | "ERROR", number>;

export async function GET(req: Request) {
  try {
    const { shop } = await requireShopifyAuth(req);

    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: shop },
      select: { id: true },
    });

    if (!merchant) {
      const empty: Counts = { PENDING: 0, HELD: 0, READY: 0, EXPORTED: 0, ERROR: 0 };
      return NextResponse.json(
        { ok: true, counts: empty, lastOrderSeenAt: null, lastExportAt: null },
        { status: 200 }
      );
    }

    const grouped = await prisma.shopifyOrder.groupBy({
      by: ["state"],
      where: { merchantId: merchant.id },
      _count: { _all: true },
    });

    const counts: Counts = { PENDING: 0, HELD: 0, READY: 0, EXPORTED: 0, ERROR: 0 };
    for (const g of grouped) {
      const key = String(g.state) as keyof Counts;
      if (key in counts) counts[key] = g._count._all;
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

    return NextResponse.json(
      {
        ok: true,
        counts,
        lastOrderSeenAt: lastOrder?.createdAt?.toISOString() ?? null,
        lastExportAt: lastExport?.createdAt?.toISOString() ?? null,
      },
      { status: 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stats failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 401 });
  }
}
