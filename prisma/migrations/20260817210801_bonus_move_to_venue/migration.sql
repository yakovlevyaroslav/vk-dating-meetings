-- AlterTable
ALTER TABLE "Place" DROP COLUMN "hasBonus";

-- AlterTable
ALTER TABLE "PlaceVenue" ADD COLUMN     "hasBonus" BOOLEAN NOT NULL DEFAULT false;
