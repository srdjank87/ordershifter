import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

export async function GET(req: Request) {
  try {
    const { shop } = await requireShopifyAuth(req);

    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: shop },
      select: { tenantId: true, tenant: { select: { name: true } } },
    });

    if (!merchant?.tenantId) {
      return NextResponse.json(
        { ok: false, error: "Missing tenantId for shop (merchant not connected)" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      shop,
      tenantId: merchant.tenantId,
      tenantName: merchant.tenant?.name ?? "3PL",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Context failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 401 });
  }
}
