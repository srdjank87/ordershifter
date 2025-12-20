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
      return NextResponse.json({ ok: true, items: [] }, { status: 200 });
    }

    const rows = await prisma.shopifyOrder.findMany({
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

    return NextResponse.json(
      {
        ok: true,
        items: rows.map((o) => ({
          id: o.id,
          shopifyOrderId: o.shopifyOrderId,
          shopifyName: o.shopifyName,
          state: o.state,
          createdAtShopify: o.createdAtShopify ? o.createdAtShopify.toISOString() : null,
        })),
      },
      { status: 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Orders failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 401 });
  }
}
