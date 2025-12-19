import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

export async function GET(req: Request) {
  try {
    const { shop } = await requireShopifyAuth(req);

    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: shop },
      select: { id: true },
    });

    if (!merchant) {
      return NextResponse.json({ ok: true, items: [] });
    }

    const items = await prisma.shopifyOrder.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        shopifyOrderId: true,
        shopifyName: true,
        state: true,
        createdAtShopify: true,
      },
    });

    return NextResponse.json({
      ok: true,
      items: items.map((o) => ({
        ...o,
        createdAtShopify: o.createdAtShopify ? o.createdAtShopify.toISOString() : null,
      })),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Orders failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
