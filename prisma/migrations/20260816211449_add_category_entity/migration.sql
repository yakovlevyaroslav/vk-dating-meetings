-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AlterTable
ALTER TABLE "Place" ADD COLUMN "categoryId" TEXT;

-- DataMigration: перенос значений старого текстового поля "category" в справочник Category
INSERT INTO "Category" ("id", "name", "updatedAt")
SELECT gen_random_uuid()::text, distinct_categories.trimmed, CURRENT_TIMESTAMP
FROM (
    SELECT DISTINCT trim("category") AS trimmed
    FROM "Place"
    WHERE "category" IS NOT NULL AND trim("category") <> ''
) AS distinct_categories
ON CONFLICT ("name") DO NOTHING;

UPDATE "Place" p
SET "categoryId" = c."id"
FROM "Category" c
WHERE p."category" IS NOT NULL
  AND trim(p."category") <> ''
  AND trim(p."category") = c."name";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "category";

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
