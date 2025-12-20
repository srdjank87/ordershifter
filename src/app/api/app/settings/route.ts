import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

export async function GET(req: Request) {
  try {
    const { shop } = await requireShopifyAuth(req);

    const merchant = await prisma.merchantAccount.findFirst({
      where: { shopDomain: shop },
      select: { tenantId: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { ok: false, error: "Merchant not found" },
        { status: 404 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: merchant.tenantId },
      select: { id: true, name: true, demoMode: true },
    });

    if (!tenant) {
      return NextResponse.json(
        { ok: false, error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, tenant });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const { shop } = await requireShopifyAuth(req);

    const merchant = await prisma.merchantAccount.findFirst({
      where: { shopDomain: shop },
      select: { tenantId: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { ok: false, error: "Merchant not found" },
        { status: 404 }
      );
    }

    const body: unknown = await req.json().catch(() => ({}));
    const demoMode =
      typeof (body as { demoMode?: unknown })?.demoMode === "boolean"
        ? (body as { demoMode: boolean }).demoMode
        : Boolean((body as { demoMode?: unknown })?.demoMode);

    await prisma.tenant.update({
      where: { id: merchant.tenantId },
      data: { demoMode },
      select: { id: true },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
