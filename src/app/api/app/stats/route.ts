import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

export async function GET(req: Request) {
  try {
    const auth = await requireShopifyAuth(req);

    const url = new URL(req.url);
    const shopParam = url.searchParams.get("shop");
    if (shopParam && shopParam !== auth.shop) {
      return NextResponse.json(
        { ok: false, error: "Shop mismatch" },
        { status: 403 }
      );
    }

    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: auth.shop },
      select: { id: true, tenantId: true, shopDomain: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { ok: false, error: "Merchant not connected (no MerchantAccount row)" },
        { status: 400 }
      );
    }

    const [ordersTotal, exceptionsOpen, lastExport] = await Promise.all([
      prisma.shopifyOrder.count({ where: { merchantId: merchant.id } }),
      prisma.orderException.count({
        where: { merchantId: merchant.id, status: "OPEN" },
      }),
      prisma.exportLog.findFirst({
        where: { merchantId: merchant.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, summary: true, error: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      shop: merchant.shopDomain,
      ordersTotal,
      exceptionsOpen,
      lastExport,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error in /api/app/stats";
    return NextResponse.json({ ok: false, error: message }, { status: 401 });
  }
}
