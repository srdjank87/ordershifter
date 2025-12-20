-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "TenantSettings" ADD COLUMN     "exportFrequencyMinutes" INTEGER NOT NULL DEFAULT 15;
