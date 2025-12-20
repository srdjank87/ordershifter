import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

type SettingsPayload = {
  demoMode?: boolean | string | null;
  tenantName?: string | null;
  name?: string | null; // allow either key (in case UI uses "name")
};

function parseDemoMode(input: unknown): boolean | undefined {
  if (typeof input === "boolean") return input;
  if (typeof input === "string") {
    const v = input.trim().toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
    return undefined;
  }
  if (input == null) return undefined;
  return undefined;
}

function parseTenantName(input: unknown): string | undefined {
  if (typeof input !== "string") return undefined;
  const name = input.trim();

  // treat empty as "don't update" (or you can choose to allow clearing)
  if (!name) return undefined;

  // sanity limits
  if (name.length > 80) return name.slice(0, 80);
  return name;
}

async function getMerchantTenantId(shop: string): Promise<string | null> {
  const merchant = await prisma.merchantAccount.findFirst({
    where: { shopDomain: shop },
    select: { tenantId: true },
  });

  return merchant?.tenantId ?? null;
}

export async function GET(req: Request) {
  try {
    const { shop } = await requireShopifyAuth(req);

    const tenantId = await getMerchantTenantId(shop);
    if (!tenantId) {
      return NextResponse.json(
        { ok: false, error: "Merchant not found" },
        { status: 404 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
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

    const tenantId = await getMerchantTenantId(shop);
    if (!tenantId) {
      return NextResponse.json(
        { ok: false, error: "Merchant not found" },
        { status: 404 }
      );
    }

    const body: SettingsPayload = await req.json().catch(() => ({}));

    const demoModeParsed = parseDemoMode(body.demoMode);
    const tenantNameParsed = parseTenantName(body.tenantName ?? body.name);

    // If nothing valid was provided, don’t overwrite anything.
    if (demoModeParsed === undefined && tenantNameParsed === undefined) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true, name: true, demoMode: true },
      });
      return NextResponse.json({ ok: true, tenant });
    }

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ...(demoModeParsed !== undefined ? { demoMode: demoModeParsed } : {}),
        ...(tenantNameParsed !== undefined ? { name: tenantNameParsed } : {}),
      },
      select: { id: true, name: true, demoMode: true },
    });

    return NextResponse.json({ ok: true, tenant: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
