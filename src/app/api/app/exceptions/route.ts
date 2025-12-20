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

    const rows = await prisma.orderException.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        createdAt: true,
        code: true,
        message: true,
        status: true,
      },
    });

    const items = rows.map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      code: r.code,
      message: r.message,
      status: r.status,
    }));

    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Exceptions fetch failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 401 });
  }
}
