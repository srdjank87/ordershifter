import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/app/orders?shop=...&take=10
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");
  const take = Math.min(Number(searchParams.get("take") ?? 10) || 10, 50);

  if (!shop) {
    return NextResponse.json({ ok: false, error: "Missing shop" }, { status: 400 });
  }

  const merchant = await prisma.merchantAccount.findUnique({
    where: { shopDomain: shop },
    select: { id: true },
  });

  if (!merchant) {
    return NextResponse.json({ ok: false, error: "Unknown shop" }, { status: 404 });
  }

  const rows = await prisma.shopifyOrder.findMany({
    where: { merchantId: merchant.id },
    orderBy: { updatedAt: "desc" },
    take,
    select: {
      id: true,
      shopifyOrderId: true,
      shopifyName: true,
      state: true,
      updatedAt: true,
      lastError: true,
    },
  });

  return NextResponse.json({
    ok: true,
    rows: rows.map((r) => ({
      id: r.id,
      shopifyOrderId: r.shopifyOrderId,
      shopifyName: r.shopifyName,
      state: r.state,
      updatedAt: r.updatedAt.toISOString(),
      lastError: r.lastError,
    })),
  });
}
