-- AlterTable
ALTER TABLE "products" ADD COLUMN     "nutritionFacts" JSONB,
ADD COLUMN     "nutritionServingSize" TEXT,
ADD COLUMN     "nutritionServingsPerContainer" TEXT;
