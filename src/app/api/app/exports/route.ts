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

    const rows = await prisma.exportLog.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        createdAt: true,
        status: true,
        summary: true,
        error: true,
      },
    });

    const items = rows.map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      status: r.status,
      notes: r.summary ?? r.error ?? null,
    }));

    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Exports fetch failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 401 });
  }
}
