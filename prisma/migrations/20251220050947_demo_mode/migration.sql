-- AlterTable
ALTER TABLE "ShopifyOrder" ADD COLUMN     "isDemo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TenantSettings" ADD COLUMN     "demoMode" BOOLEAN NOT NULL DEFAULT false;
