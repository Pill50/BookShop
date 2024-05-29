/*
  Warnings:

  - You are about to drop the column `priceFlashSale` on the `promotion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "promotion" DROP COLUMN "priceFlashSale",
ADD COLUMN     "discountFlashSale" DOUBLE PRECISION;
