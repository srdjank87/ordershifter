import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

/**
 * POST /api/app/demo/clear
 * Deletes demo orders + any related exceptions/export logs for the authenticated merchant.
 */
export async function POST(req: Request) {
  try {
    const { shop } = await requireShopifyAuth(req);

    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: shop },
      select: { id: true },
    });

    if (!merchant) {
      return NextResponse.json({ ok: true, deleted: 0 }, { status: 200 });
    }

    const deleted = await prisma.$transaction(async (tx) => {
      // Find demo order ids
      const demoOrderIds = await tx.shopifyOrder.findMany({
        where: { merchantId: merchant.id, isDemo: true },
        select: { id: true },
      });

      const ids = demoOrderIds.map((x) => x.id);
      if (ids.length === 0) return 0;

      // Delete dependent rows first
      await tx.orderException.deleteMany({ where: { orderId: { in: ids } } });
      await tx.exportLog.deleteMany({ where: { orderId: { in: ids } } });

      // Delete orders
      const res = await tx.shopifyOrder.deleteMany({
        where: { id: { in: ids } },
      });

      return res.count;
    });

    return NextResponse.json(
      { ok: true, deleted, message: "Cleared demo data" },
      { status: 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Demo clear failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
