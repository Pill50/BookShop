/*
  Warnings:

  - The values [POPULAR] on the enum `PromotionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PromotionType_new" AS ENUM ('SALE');
ALTER TABLE "promotion" ALTER COLUMN "type" TYPE "PromotionType_new" USING ("type"::text::"PromotionType_new");
ALTER TYPE "PromotionType" RENAME TO "PromotionType_old";
ALTER TYPE "PromotionType_new" RENAME TO "PromotionType";
DROP TYPE "PromotionType_old";
COMMIT;
