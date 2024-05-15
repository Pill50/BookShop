-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('SALE', 'POPULAR');

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "note" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "type" "PromotionType" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "bookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
