/*
  Warnings:

  - You are about to drop the column `recieverName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `recieverPhone` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updateddAt` on the `promotion` table. All the data in the column will be lost.
  - Added the required column `receiverName` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverPhone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "recieverName",
DROP COLUMN "recieverPhone",
ADD COLUMN     "receiverName" TEXT NOT NULL,
ADD COLUMN     "receiverPhone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "promotion" DROP COLUMN "updateddAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
