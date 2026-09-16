-- AlterTable
ALTER TABLE "products" ADD COLUMN     "sku" TEXT,
ADD COLUMN     "packSize" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");
