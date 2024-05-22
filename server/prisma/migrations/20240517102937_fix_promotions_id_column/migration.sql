/*
  Warnings:

  - The primary key for the `promotion` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "promotion" DROP CONSTRAINT "promotion_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "promotion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "promotion_id_seq";
