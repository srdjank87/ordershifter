import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shop = url.searchParams.get("shop")?.trim();

    if (!shop) {
      return NextResponse.json({ ok: false, error: "Missing shop" }, { status: 400 });
    }

    // 1) Find merchant accounts for this shop domain (no relations)
    const accounts = await prisma.merchantAccount.findMany({
      where: { shopDomain: shop },
      select: { tenantId: true },
    });

    const tenantIds = Array.from(new Set(accounts.map((a) => a.tenantId))).filter(Boolean);

    // 2) Fetch tenant names separately (avoids guessing relation field names)
    const tenants = tenantIds.length
      ? await prisma.tenant.findMany({
          where: { id: { in: tenantIds } },
          select: { id: true, name: true },
        })
      : [];

    const choices = tenants.map((t) => ({
      tenantId: t.id,
      tenantName: t.name ?? "Your 3PL",
    }));

    // MVP placeholders for now
    const metrics = {
      exceptionsOpen: 0,
      syncHealth: "good" as const,
      lastExportAt: null as string | null,
      lastOrderSeenAt: null as string | null,
    };

    return NextResponse.json({ ok: true, shop, choices, metrics });
  } catch (err: unknown) {
  const message =
    err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";

  console.error("GET /api/app/context failed:", message, err);

  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

}
