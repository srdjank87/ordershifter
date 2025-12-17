import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shopFromQuery = url.searchParams.get("shop") || "";
  const hostFromQuery = url.searchParams.get("host") || "";

  const cookieStore = await cookies();
  const shopFromCookie = cookieStore.get("os_shop")?.value || "";
  const hostFromCookie = cookieStore.get("os_host")?.value || "";

  const shop = shopFromQuery || shopFromCookie;
  const host = hostFromQuery || hostFromCookie;

  if (!shop) {
    return NextResponse.json(
      { ok: false as const, code: "MISSING_SHOP" as const, shop: "", host: "", error: "Missing shop" },
      { status: 400 }
    );
  }

  const merchant = await prisma.merchantAccount.findFirst({
    where: { shopDomain: shop },
    include: { tenant: true },
  });

  if (!merchant?.tenantId) {
    return NextResponse.json({
      ok: false as const,
      code: "NEEDS_INSTALL" as const,
      shop,
      host,
      error: "Merchant not connected (no tenantId). Run install flow.",
    });
  }

  return NextResponse.json({
    ok: true as const,
    shop,
    host,
    tenantId: merchant.tenantId,
    tenantName: merchant.tenant?.name ?? "Portal",
  });
}
