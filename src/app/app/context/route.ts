import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = url.searchParams.get("shop")?.trim();

  if (!shop) {
    return NextResponse.json({ ok: false, error: "Missing shop" }, { status: 400 });
  }

  // Find all merchant accounts for this shop (supports multi-3PL later)
  const accounts = await prisma.merchantAccount.findMany({
    where: { shopDomain: shop },
    select: {
      tenantId: true,
      tenant: { select: { id: true, name: true } }, // adjust field names if yours differ
    },
  });

  const choices = accounts
    .filter((a) => a.tenant)
    .map((a) => ({
      tenantId: a.tenant!.id,
      tenantName: a.tenant!.name ?? "Your 3PL",
    }));

  // MVP metrics placeholders:
  // Replace these with real queries once your exception model/table exists.
  const metrics = {
    exceptionsOpen: 0,
    syncHealth: "good" as const,
    lastExportAt: null as string | null,
    lastOrderSeenAt: null as string | null,
  };

  return NextResponse.json({
    ok: true,
    shop,
    choices,
    metrics,
  });
}
