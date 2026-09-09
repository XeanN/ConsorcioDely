-- AlterTable
ALTER TABLE "products" ADD COLUMN     "mediaId" TEXT;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
