import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = url.searchParams.get("shop");
  if (!shop) return NextResponse.json({ ok: false, error: "Missing shop" }, { status: 400 });

  const merchants = await prisma.merchantAccount.findMany({
    where: { shopDomain: shop },
    select: { id: true, shopDomain: true, tenantId: true, accessToken: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    ok: true,
    count: merchants.length,
    merchants: merchants.map(m => ({
      ...m,
      accessToken: m.accessToken ? `${m.accessToken.slice(0, 6)}…len=${m.accessToken.length}` : null,
    })),
  });
}
