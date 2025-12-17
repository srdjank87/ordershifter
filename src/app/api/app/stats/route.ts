import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shop = url.searchParams.get("shop");

    if (!shop) return json({ ok: false, error: "Missing shop" }, 400);

    const merchant = await prisma.merchantAccount.findFirst({
      where: { shopDomain: shop },
      select: { id: true, tenantId: true },
    });

    if (!merchant?.tenantId) {
      return json({ ok: false, error: "Merchant not found for shop", shop }, 404);
    }

    // Adjust these counts to match your actual schema fields/enum values
    const [exceptionsOpen, exportsLast7, recentOrders] = await Promise.all([
      prisma.orderException.count({
        where: { tenantId: merchant.tenantId, status: "OPEN" },
      }),
      prisma.exportLog.count({
        where: { tenantId: merchant.tenantId },
      }),
      prisma.shopifyOrder.count({
        where: { tenantId: merchant.tenantId },
      }),
    ]);

    return json({
      ok: true,
      shop,
      tenantId: merchant.tenantId,
      merchantId: merchant.id,
      exceptionsOpen,
      exportsTotal: exportsLast7,
      ordersTotal: recentOrders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: message }, 500);
  }
}
