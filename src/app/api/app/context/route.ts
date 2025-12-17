import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type AppContextOk = {
  ok: true;
  shop: string;
  choices: { tenantId: string; tenantName: string }[];
  metrics: {
    exceptionsOpen: number;
    lastExportAt: string | null;
    lastOrderSeenAt: string | null;
    syncHealth: "good" | "warning" | "bad";
  };
};

type AppContextErr = {
  ok: false;
  error: string;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shop = url.searchParams.get("shop")?.trim();

    if (!shop) {
      return NextResponse.json<AppContextErr>(
        { ok: false, error: "Missing shop" },
        { status: 400 }
      );
    }

    // Find merchant accounts for this shop
    const accounts = await prisma.merchantAccount.findMany({
      where: { shopDomain: shop },
      select: { tenantId: true },
    });

    const tenantIds = Array.from(new Set(accounts.map((a) => a.tenantId))).filter(
      (id): id is string => Boolean(id)
    );

    const tenants =
      tenantIds.length > 0
        ? await prisma.tenant.findMany({
            where: { id: { in: tenantIds } },
            select: { id: true, name: true },
          })
        : [];

    const choices = tenants.map((t) => ({
      tenantId: t.id,
      tenantName: t.name ?? "Your 3PL",
    }));

    const payload: AppContextOk = {
      ok: true,
      shop,
      choices,
      metrics: {
        exceptionsOpen: 0,
        syncHealth: "good",
        lastExportAt: null,
        lastOrderSeenAt: null,
      },
    };

    return NextResponse.json<AppContextOk>(payload);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json<AppContextErr>(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
