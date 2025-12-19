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

    const items = await prisma.orderException.findMany({
      where: { merchantId: merchant.id, status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        code: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      items: items.map((x) => ({
        ...x,
        createdAt: x.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Exceptions failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
