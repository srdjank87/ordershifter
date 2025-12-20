import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

export async function POST(req: Request) {
  const { shop } = await requireShopifyAuth(req);

  const merchant = await prisma.merchantAccount.findFirst({
    where: { shopDomain: shop },
    select: { id: true, installedAt: true, scope: true },
  });

  if (!merchant) {
    return NextResponse.json({ ok: false, error: "Merchant not connected yet." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    message: `Connected. Install recorded${merchant.installedAt ? ` (${merchant.installedAt.toISOString()})` : ""}.`,
  });
}
