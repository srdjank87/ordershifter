import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireShopifyAuth } from "@/lib/shopify/requireShopifyAuth";

/**
 * POST /api/app/demo/seed
 * Seeds demo orders + a couple exceptions + a couple export logs.
 */
export async function POST(req: Request) {
  try {
    const { shop } = await requireShopifyAuth(req);

    const merchant = await prisma.merchantAccount.findUnique({
      where: { shopDomain: shop },
      select: { id: true, tenantId: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { ok: false, error: "Merchant not found for shop" },
        { status: 404 }
      );
    }

    // Read settings to see if demoMode is enabled (optional safety)
    const settings = await prisma.tenantSettings.findUnique({
      where: { tenantId: merchant.tenantId },
      select: { demoMode: true, delayHours: true },
    });

    if (!settings?.demoMode) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Demo mode is disabled. Enable it in Settings before seeding demo data.",
        },
        { status: 400 }
      );
    }

    // Avoid duplicating demo data: if demo orders already exist, do nothing.
    const existingDemoCount = await prisma.shopifyOrder.count({
      where: { merchantId: merchant.id, isDemo: true },
    });

    if (existingDemoCount > 0) {
      return NextResponse.json(
        {
          ok: true,
          message: "Demo data already exists",
          created: 0,
        },
        { status: 200 }
      );
    }

    const now = new Date();
    const delayHours = settings.delayHours ?? 6;

    // Create 8 demo orders across states
    const demoOrders = [
      {
        merchantId: merchant.id,
        tenantId: merchant.tenantId,
        shopifyOrderId: "demo-1001",
        shopifyName: "#1001",
        createdAtShopify: new Date(now.getTime() - 60 * 60 * 1000 * 30),
        payload: { demo: true, note: "Demo order 1001" },
        state: "PENDING" as const,
        readyAt: new Date(now.getTime() + 60 * 60 * 1000 * delayHours),
        isDemo: true,
      },
      {
        merchantId: merchant.id,
        tenantId: merchant.tenantId,
        shopifyOrderId: "demo-1002",
        shopifyName: "#1002",
        createdAtShopify: new Date(now.getTime() - 60 * 60 * 1000 * 24),
        payload: { demo: true, note: "Demo order 1002" },
        state: "HELD" as const,
        readyAt: new Date(now.getTime() - 60 * 60 * 1000 * 2),
        isDemo: true,
      },
      {
        merchantId: merchant.id,
        tenantId: merchant.tenantId,
        shopifyOrderId: "demo-1003",
        shopifyName: "#1003",
        createdAtShopify: new Date(now.getTime() - 60 * 60 * 1000 * 16),
        payload: { demo: true, note: "Demo order 1003" },
        state: "READY" as const,
        readyAt: new Date(now.getTime() - 60 * 60 * 1000 * 1),
        isDemo: true,
      },
      {
        merchantId: merchant.id,
        tenantId: merchant.tenantId,
        shopifyOrderId: "demo-1004",
        shopifyName: "#1004",
        createdAtShopify: new Date(now.getTime() - 60 * 60 * 1000 * 12),
        payload: { demo: true, note: "Demo order 1004" },
        state: "READY" as const,
        readyAt: new Date(now.getTime() - 60 * 60 * 1000 * 3),
        isDemo: true,
      },
      {
        merchantId: merchant.id,
        tenantId: merchant.tenantId,
        shopifyOrderId: "demo-1005",
        shopifyName: "#1005",
        createdAtShopify: new Date(now.getTime() - 60 * 60 * 1000 * 8),
        payload: { demo: true, note: "Demo order 1005" },
        state: "EXPORTED" as const,
        readyAt: new Date(now.getTime() - 60 * 60 * 1000 * 7),
        exportBatchId: "demo-batch-1",
        isDemo: true,
      },
      {
        merchantId: merchant.id,
        tenantId: merchant.tenantId,
        shopifyOrderId: "demo-1006",
        shopifyName: "#1006",
        createdAtShopify: new Date(now.getTime() - 60 * 60 * 1000 * 6),
        payload: { demo: true, note: "Demo order 1006" },
        state: "ERROR" as const,
        readyAt: new Date(now.getTime() - 60 * 60 * 1000 * 5),
        lastError: "Missing address line 1 (demo)",
        isDemo: true,
      },
      {
        merchantId: merchant.id,
        tenantId: merchant.tenantId,
        shopifyOrderId: "demo-1007",
        shopifyName: "#1007",
        createdAtShopify: new Date(now.getTime() - 60 * 60 * 1000 * 4),
        payload: { demo: true, note: "Demo order 1007" },
        state: "PENDING" as const,
        readyAt: new Date(now.getTime() + 60 * 60 * 1000 * (delayHours - 1)),
        isDemo: true,
      },
      {
        merchantId: merchant.id,
        tenantId: merchant.tenantId,
        shopifyOrderId: "demo-1008",
        shopifyName: "#1008",
        createdAtShopify: new Date(now.getTime() - 60 * 60 * 1000 * 2),
        payload: { demo: true, note: "Demo order 1008" },
        state: "READY" as const,
        readyAt: new Date(now.getTime() - 60 * 60 * 1000 * 1),
        isDemo: true,
      },
    ];

    const created = await prisma.$transaction(async (tx) => {
      // Create orders
      const createdOrders: { id: string; shopifyOrderId: string }[] = [];
      for (const o of demoOrders) {
        const row = await tx.shopifyOrder.create({
          data: o,
          select: { id: true, shopifyOrderId: true },
        });
        createdOrders.push(row);
      }

      // Map ids
      const byShopifyId = new Map(createdOrders.map((x) => [x.shopifyOrderId, x.id]));

      // Create demo exceptions on 1002 and 1006
      await tx.orderException.createMany({
        data: [
          {
            tenantId: merchant.tenantId,
            merchantId: merchant.id,
            orderId: byShopifyId.get("demo-1002")!,
            code: "ADDRESS_REVIEW",
            message: "Address looks incomplete. Confirm before export. (demo)",
            status: "OPEN",
          },
          {
            tenantId: merchant.tenantId,
            merchantId: merchant.id,
            orderId: byShopifyId.get("demo-1006")!,
            code: "MISSING_FIELD",
            message: "Missing required field(s) for WMS export. (demo)",
            status: "OPEN",
          },
        ],
      });

      // Create a couple export logs (one success, one failed)
      await tx.exportLog.createMany({
        data: [
          {
            tenantId: merchant.tenantId,
            merchantId: merchant.id,
            orderId: byShopifyId.get("demo-1005")!,
            status: "SENT",
            summary: "Exported to warehouse via CSV (demo).",
          },
          {
            tenantId: merchant.tenantId,
            merchantId: merchant.id,
            orderId: byShopifyId.get("demo-1004")!,
            status: "FAILED",
            summary: "Export attempt failed (demo).",
            error: "SFTP connection refused (demo).",
          },
        ],
      });

      return createdOrders.length;
    });

    return NextResponse.json(
      { ok: true, created, message: "Seeded demo data" },
      { status: 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Demo seed failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
