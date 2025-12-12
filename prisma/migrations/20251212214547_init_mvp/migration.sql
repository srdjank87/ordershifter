/*
  Warnings:

  - The values [PENDING,SUSPENDED,DISCONNECTED] on the enum `MerchantStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `MerchantAccount` table. All the data in the column will be lost.
  - You are about to drop the column `shopifyShopId` on the `MerchantAccount` table. All the data in the column will be lost.
  - You are about to drop the column `threePlId` on the `MerchantAccount` table. All the data in the column will be lost.
  - You are about to drop the column `merchantId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `threePlId` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `city` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `threePlId` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the `IntegrationJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ThreePL` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebhookLog` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tenantId,shopDomain]` on the table `MerchantAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,code]` on the table `Warehouse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `MerchantAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'OPS', 'SUPPORT');

-- CreateEnum
CREATE TYPE "OrderState" AS ENUM ('PENDING_DELAY', 'READY_TO_ROUTE', 'ROUTED', 'EXPORT_QUEUED', 'EXPORTED', 'ERROR');

-- AlterEnum
BEGIN;
CREATE TYPE "MerchantStatus_new" AS ENUM ('INVITED', 'INSTALLED', 'ACTIVE', 'PAUSED');
ALTER TABLE "MerchantAccount" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "MerchantAccount" ALTER COLUMN "status" TYPE "MerchantStatus_new" USING ("status"::text::"MerchantStatus_new");
ALTER TYPE "MerchantStatus" RENAME TO "MerchantStatus_old";
ALTER TYPE "MerchantStatus_new" RENAME TO "MerchantStatus";
DROP TYPE "MerchantStatus_old";
ALTER TABLE "MerchantAccount" ALTER COLUMN "status" SET DEFAULT 'INVITED';
COMMIT;

-- DropForeignKey
ALTER TABLE "IntegrationJob" DROP CONSTRAINT "IntegrationJob_orderId_fkey";

-- DropForeignKey
ALTER TABLE "MerchantAccount" DROP CONSTRAINT "MerchantAccount_threePlId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_threePlId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_threePlId_fkey";

-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_threePlId_fkey";

-- DropForeignKey
ALTER TABLE "WebhookLog" DROP CONSTRAINT "WebhookLog_orderId_fkey";

-- DropIndex
DROP INDEX "MerchantAccount_threePlId_idx";

-- DropIndex
DROP INDEX "MerchantAccount_threePlId_shopDomain_key";

-- DropIndex
DROP INDEX "User_merchantId_idx";

-- DropIndex
DROP INDEX "User_threePlId_idx";

-- DropIndex
DROP INDEX "Warehouse_threePlId_code_key";

-- DropIndex
DROP INDEX "Warehouse_threePlId_idx";

-- AlterTable
ALTER TABLE "MerchantAccount" DROP COLUMN "name",
DROP COLUMN "shopifyShopId",
DROP COLUMN "threePlId",
ADD COLUMN     "installedAt" TIMESTAMP(3),
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "tenantId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'INVITED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "merchantId",
DROP COLUMN "threePlId",
ADD COLUMN     "tenantId" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'OWNER';

-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "city",
DROP COLUMN "threePlId",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- DropTable
DROP TABLE "IntegrationJob";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "ThreePL";

-- DropTable
DROP TABLE "WebhookLog";

-- DropEnum
DROP TYPE "JobStatus";

-- DropEnum
DROP TYPE "JobType";

-- DropEnum
DROP TYPE "OrderSource";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "UserRole";

-- DropEnum
DROP TYPE "WebhookDirection";

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "delayHours" INTEGER NOT NULL DEFAULT 6,
    "timezone" TEXT NOT NULL DEFAULT 'America/Toronto',
    "exportMode" TEXT NOT NULL DEFAULT 'CSV_DOWNLOAD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopifyOrder" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "shopifyOrderId" TEXT NOT NULL,
    "shopifyName" TEXT,
    "createdAtShopify" TIMESTAMP(3),
    "payload" JSONB NOT NULL,
    "state" "OrderState" NOT NULL DEFAULT 'PENDING_DELAY',
    "readyAt" TIMESTAMP(3) NOT NULL,
    "routedWarehouseId" TEXT,
    "exportBatchId" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopifyOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutingRule" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "country" TEXT,
    "region" TEXT,
    "postalPrefix" TEXT,
    "warehouseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoutingRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TenantSettings_tenantId_key" ON "TenantSettings"("tenantId");

-- CreateIndex
CREATE INDEX "ShopifyOrder_tenantId_state_readyAt_idx" ON "ShopifyOrder"("tenantId", "state", "readyAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShopifyOrder_merchantId_shopifyOrderId_key" ON "ShopifyOrder"("merchantId", "shopifyOrderId");

-- CreateIndex
CREATE INDEX "RoutingRule_tenantId_enabled_priority_idx" ON "RoutingRule"("tenantId", "enabled", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantAccount_tenantId_shopDomain_key" ON "MerchantAccount"("tenantId", "shopDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_tenantId_code_key" ON "Warehouse"("tenantId", "code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantSettings" ADD CONSTRAINT "TenantSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantAccount" ADD CONSTRAINT "MerchantAccount_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopifyOrder" ADD CONSTRAINT "ShopifyOrder_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "MerchantAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutingRule" ADD CONSTRAINT "RoutingRule_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutingRule" ADD CONSTRAINT "RoutingRule_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
