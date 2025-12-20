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

    const limit = Math.min(
      Math.max(parseInt(url.searchParams.get("limit") ?? "25", 10) || 25, 1),
      100
    );

    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: auth.shop },
      select: { id: true, shopDomain: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { ok: false, error: "Merchant not connected (no MerchantAccount row)" },
        { status: 400 }
      );
    }

    const items = await prisma.orderException.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        code: true,
        message: true,
        status: true,
        createdAt: true,
        resolvedAt: true,
        order: {
          select: {
            id: true,
            shopifyOrderId: true,
            shopifyName: true,
            state: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      shop: merchant.shopDomain,
      items,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Unknown error in /api/app/exceptions";
    return NextResponse.json({ ok: false, error: message }, { status: 401 });
  }
}
