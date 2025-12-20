import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

export async function GET(req: Request) {
  try {
    const { shop } = await requireShopifyAuth(req);

    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 25), 100);

    // Find merchant + tenant by shop domain
    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: shop },
      select: { id: true, tenantId: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { ok: false, error: "Merchant not found for shop" },
        { status: 404 }
      );
    }

    const rows = await prisma.shopifyOrder.findMany({
      where: { merchantId: merchant.id },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        shopifyOrderId: true,
        shopifyName: true,
        createdAtShopify: true,
        state: true,
        readyAt: true,
        routedWarehouseId: true,
        exportBatchId: true,
        lastError: true,
        createdAt: true,
        updatedAt: true,

        // Grab latest export log (if any) to derive "last exported at"
        exportLogs: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            createdAt: true,
            status: true,
          },
        },

        // Optional: show how many exceptions exist / unresolved, etc.
        // exceptions: { select: { id: true, status: true } },
      },
    });

    const items = rows.map((o) => {
      const lastExport = o.exportLogs?.[0] ?? null;

      return {
        id: o.id,
        shopifyOrderId: o.shopifyOrderId,
        shopifyName: o.shopifyName,
        createdAtShopify: o.createdAtShopify,
        state: o.state,
        readyAt: o.readyAt,
        routedWarehouseId: o.routedWarehouseId,
        exportBatchId: o.exportBatchId,
        lastError: o.lastError,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,

        // Derived fields for UI
        lastExportedAt: lastExport?.createdAt ?? null,
        lastExportStatus: lastExport?.status ?? null,
      };
    });

    return NextResponse.json({ ok: true, items });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error in orders route";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
