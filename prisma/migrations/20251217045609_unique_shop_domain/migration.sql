/*
  Warnings:

  - A unique constraint covering the columns `[shopDomain]` on the table `MerchantAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MerchantAccount_shopDomain_key" ON "MerchantAccount"("shopDomain");
