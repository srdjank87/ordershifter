import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shopFromQuery = url.searchParams.get("shop");

    // Next.js (your version): cookies() is async
    const cookieStore = await cookies();
    const shopFromCookie = cookieStore.get("os_shop")?.value ?? null;

    const shop = shopFromQuery ?? shopFromCookie;
    if (!shop) {
      return NextResponse.json({ ok: false, error: "Missing shop" }, { status: 400 });
    }

    // Find merchant account by shop domain
    const merchant = await prisma.merchantAccount.findFirst({
      where: { shopDomain: shop },
      select: {
        id: true,
        tenantId: true,
        shopDomain: true,
        tenant: { select: { id: true, name: true } },
      },
    });

    if (!merchant?.tenant) {
      return NextResponse.json(
        { ok: false, error: "Merchant not found for this shop" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      tenantId: merchant.tenant.id,
      tenantName: merchant.tenant.name,
      shop: merchant.shopDomain,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
