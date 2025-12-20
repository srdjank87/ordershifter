import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

/**
 * POST /api/app/demo/export-now
 * Simulates an export run on demo READY orders.
 */
export async function POST(req: Request) {
  try {
    const { shop } = await requireShopifyAuth(req);

    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: shop },
      select: { id: true, tenantId: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { ok: false, error: "Merchant not found" },
        { status: 404 }
      );
    }

    const ready = await prisma.shopifyOrder.findMany({
      where: {
        merchantId: merchant.id,
        isDemo: true,
        state: "READY",
      },
      orderBy: { readyAt: "asc" },
      take: 10,
      select: { id: true, shopifyName: true },
    });

    if (ready.length === 0) {
      return NextResponse.json(
        { ok: true, processed: 0, message: "No demo READY orders to export" },
        { status: 200 }
      );
    }

    const batchId = `demo-batch-${Date.now()}`;

    const processed = await prisma.$transaction(async (tx) => {
      let count = 0;

      for (let i = 0; i < ready.length; i++) {
        const o = ready[i];

        // Fail every 4th order to keep the UI interesting
        const shouldFail = (i + 1) % 4 === 0;

        if (shouldFail) {
          await tx.shopifyOrder.update({
            where: { id: o.id },
            data: { state: "ERROR", lastError: "Export failed (demo)" },
          });

          await tx.exportLog.create({
            data: {
              tenantId: merchant.tenantId,
              merchantId: merchant.id,
              orderId: o.id,
              status: "FAILED",
              summary: `Export failed for ${o.shopifyName ?? "order"} (demo).`,
              error: "Warehouse endpoint timeout (demo).",
            },
          });
        } else {
          await tx.shopifyOrder.update({
            where: { id: o.id },
            data: { state: "EXPORTED", exportBatchId: batchId, lastError: null },
          });

          await tx.exportLog.create({
            data: {
              tenantId: merchant.tenantId,
              merchantId: merchant.id,
              orderId: o.id,
              status: "SENT",
              summary: `Exported ${o.shopifyName ?? "order"} in ${batchId} (demo).`,
            },
          });
        }

        count++;
      }

      return count;
    });

    return NextResponse.json(
      { ok: true, processed, batchId },
      { status: 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Demo export failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
