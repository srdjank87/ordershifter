import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ExceptionRow = {
  id: string;
  code: string;
  message: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
  orderId: string;
  orderName: string | null;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const shop = url.searchParams.get("shop")?.trim();
    const tenantId = url.searchParams.get("tenantId")?.trim();

    if (!shop || !tenantId) {
      return NextResponse.json(
        { ok: false, error: "Missing shop or tenantId" },
        { status: 400 }
      );
    }

    // 1) Find the merchant record for this shop within this tenant
    const merchant = await prisma.merchantAccount.findFirst({
      where: {
        tenantId,
        shopDomain: shop,
      },
      select: { id: true },
    });

    if (!merchant) {
      return NextResponse.json(
        {
          ok: true,
          data: [],
          note: "No merchant found for this shop + tenant yet.",
        },
        { status: 200 }
      );
    }

    // 2) Pull recent exceptions for that merchant
    const exceptions = await prisma.orderException.findMany({
      where: {
        tenantId,
        merchantId: merchant.id,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        orderId: true,
        code: true,
        message: true,
        status: true,
        createdAt: true,
        resolvedAt: true,
      },
    });

    // 3) Fetch order names separately (since your Prisma model doesn't expose a relation)
    const orderIds = Array.from(new Set(exceptions.map((e) => e.orderId)));

    const orders = orderIds.length
      ? await prisma.shopifyOrder.findMany({
          where: {
            id: { in: orderIds },
          },
          select: {
            id: true,
            shopifyName: true,
          },
        })
      : [];

    const orderNameById = new Map<string, string | null>(
      orders.map((o) => [o.id, o.shopifyName ?? null])
    );

    const data: ExceptionRow[] = exceptions.map((e) => ({
      id: e.id,
      code: e.code,
      message: e.message,
      status: String(e.status),
      createdAt: e.createdAt.toISOString(),
      resolvedAt: e.resolvedAt ? e.resolvedAt.toISOString() : null,
      orderId: e.orderId,
      orderName: orderNameById.get(e.orderId) ?? null,
    }));

    return NextResponse.json({ ok: true, data });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
