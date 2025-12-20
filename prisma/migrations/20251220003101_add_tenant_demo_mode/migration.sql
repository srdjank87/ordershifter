/*
  Warnings:

  - The values [PENDING_DELAY,READY_TO_ROUTE,ROUTED,EXPORT_QUEUED] on the enum `OrderState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderState_new" AS ENUM ('PENDING', 'HELD', 'READY', 'EXPORTED', 'ERROR');
ALTER TABLE "ShopifyOrder" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "ShopifyOrder" ALTER COLUMN "state" TYPE "OrderState_new" USING ("state"::text::"OrderState_new");
ALTER TYPE "OrderState" RENAME TO "OrderState_old";
ALTER TYPE "OrderState_new" RENAME TO "OrderState";
DROP TYPE "OrderState_old";
ALTER TABLE "ShopifyOrder" ALTER COLUMN "state" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "ShopifyOrder" ALTER COLUMN "state" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "demoMode" BOOLEAN NOT NULL DEFAULT false;
