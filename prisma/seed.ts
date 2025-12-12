// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1) Create a default tenant (idempotent)
  const tenant = await prisma.tenant.upsert({
    where: { slug: "default" },
    update: { name: "Default 3PL" },
    create: {
      name: "Default 3PL",
      slug: "default",
    },
  });

  // 2) Tenant settings (idempotent)
  await prisma.tenantSettings.upsert({
    where: { tenantId: tenant.id },
    update: {
      delayHours: 6,
      timezone: "America/Toronto",
      exportMode: "CSV_DOWNLOAD",
    },
    create: {
      tenantId: tenant.id,
      delayHours: 6,
      timezone: "America/Toronto",
      exportMode: "CSV_DOWNLOAD",
    },
  });

  // 3) One warehouse (idempotent)
  const warehouse = await prisma.warehouse.upsert({
    where: {
      tenantId_code: {
        tenantId: tenant.id,
        code: "CA-1",
      },
    },
    update: {
      name: "Canada Warehouse (CA-1)",
      country: "CA",
      region: "ON",
    },
    create: {
      tenantId: tenant.id,
      name: "Canada Warehouse (CA-1)",
      code: "CA-1",
      country: "CA",
      region: "ON",
    },
  });

  // 4) One basic routing rule (idempotent-ish)
  // Route Canada orders to CA-1
  const existingRule = await prisma.routingRule.findFirst({
    where: {
      tenantId: tenant.id,
      warehouseId: warehouse.id,
      country: "CA",
      region: null,
      postalPrefix: null,
    },
  });

  if (!existingRule) {
    await prisma.routingRule.create({
      data: {
        tenantId: tenant.id,
        priority: 10,
        enabled: true,
        country: "CA",
        warehouseId: warehouse.id,
      },
    });
  }

  console.log("✅ Seed complete");
  console.log("Tenant:", tenant.slug, tenant.id);
  console.log("Warehouse:", warehouse.code, warehouse.id);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
