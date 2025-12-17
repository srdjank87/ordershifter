import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shopFromQuery = url.searchParams.get("shop");

    const cookieStore = await cookies();
    const shopFromCookie = cookieStore.get("os_shop")?.value ?? null;

    const shop = shopFromQuery ?? shopFromCookie;

    if (!shop) {
      return json(
        { ok: false, error: "Missing shop (no query param and no os_shop cookie)" },
        400
      );
    }

    // Find merchant account for that shop
    const merchant = await prisma.merchantAccount.findFirst({
      where: { shopDomain: shop },
      select: { id: true, tenantId: true },
    });

    if (!merchant?.tenantId) {
  return json(
    { ok: false, error: "Missing tenantId for shop", shop, needsInstall: true },
    400
  );
}


    const tenant = await prisma.tenant.findUnique({
      where: { id: merchant.tenantId },
      select: { id: true, name: true },
    });

    if (!tenant) {
      return json(
        { ok: false, error: "Tenant not found", shop, tenantId: merchant.tenantId },
        404
      );
    }

    

    // Persist shop cookie so future calls don't require query params
    cookieStore.set("os_shop", shop, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return json({
      ok: true,
      shop,
      merchantId: merchant.id,
      tenantId: tenant.id,
      tenantName: tenant.name,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: message }, 500);
  }
}
