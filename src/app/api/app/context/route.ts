import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shopFromQuery = url.searchParams.get("shop");

    const cookieStore = await cookies();
    const shopFromCookie = cookieStore.get("os_shop")?.value ?? null;

    const shop = shopFromQuery ?? shopFromCookie;

    if (!shop) {
      return NextResponse.json(
        { ok: false, error: "Missing shop (no query param and no os_shop cookie)" },
        { status: 400 }
      );
    }

    const merchant = await prisma.merchantAccount.findFirst({
      where: { shopDomain: shop },
      select: {
        tenantId: true,
        shopDomain: true,
        tenant: { select: { name: true } },
      },
    });

    if (!merchant?.tenantId) {
      return NextResponse.json(
        { ok: false, error: `Missing tenantId (merchant not found for shop: ${shop})` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      shop: merchant.shopDomain,
      tenantId: merchant.tenantId,
      tenantName: merchant.tenant?.name ?? "Portal",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
