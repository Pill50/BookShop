-- CreateTable
CREATE TABLE "book_images" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "book_images" ADD CONSTRAINT "book_images_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
