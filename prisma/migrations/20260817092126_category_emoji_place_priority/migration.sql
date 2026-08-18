-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "emoji" TEXT;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;
