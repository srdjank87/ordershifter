import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/app/exceptions?shop=xxx.myshopify.com
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    // prefer query param, fallback to cookie
    const shop =
      url.searchParams.get("shop") ??
      req.cookies.get("os_shop")?.value ??
      null;

    if (!shop) {
      return NextResponse.json(
        { ok: false, error: "Missing shop" },
        { status: 400 }
      );
    }

    // Resolve merchant + tenant from the shop domain
    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: shop },
      select: { id: true, tenantId: true },
    });

    if (!merchant?.tenantId) {
      return NextResponse.json(
        { ok: false, error: "Missing tenantId (merchant not linked)" },
        { status: 400 }
      );
    }

    const rows = await prisma.orderException.findMany({
      where: {
        tenantId: merchant.tenantId,
        merchantId: merchant.id,
        status: "OPEN", // adjust if your enum differs
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        code: true,
        message: true,
        status: true,
        createdAt: true,
        orderId: true,
      },
    });

    return NextResponse.json({
      ok: true,
      shop,
      tenantId: merchant.tenantId,
      exceptions: rows,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
