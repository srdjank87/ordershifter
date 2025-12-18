import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json({ ok: false, error: "Missing shop" }, { status: 400 });
    }

    // Find the merchant account for this shop
    const merchant = await prisma.merchantAccount.findFirst({
      where: { shopDomain: shop },
      select: { id: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { ok: true, items: [] }, // no merchant connected yet -> empty list
        { status: 200 }
      );
    }

    const rows = await prisma.shopifyOrder.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        shopifyOrderId: true,
        shopifyName: true,
        state: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        items: rows.map((r) => ({
          id: r.id,
          shopifyOrderId: r.shopifyOrderId,
          shopifyName: r.shopifyName,
          state: r.state,
          createdAt: r.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // IMPORTANT: Always return JSON so the client doesn't crash parsing HTML error pages
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}

export function getAdminRestClient(args: { shopDomain: string; accessToken: string }) {
  const base = `https://${args.shopDomain}/admin/api/2025-10`;

  return {
    get: (path: string) =>
      fetch(base + path, {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": args.accessToken,
          "Content-Type": "application/json",
        },
      }),
  };
}
