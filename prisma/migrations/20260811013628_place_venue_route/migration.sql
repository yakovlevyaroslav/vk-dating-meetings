/*
  Warnings:

  - You are about to drop the column `address` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Place` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Place" DROP COLUMN "address",
DROP COLUMN "coverImage",
DROP COLUMN "latitude",
DROP COLUMN "link",
DROP COLUMN "longitude",
ADD COLUMN     "largeImage" TEXT,
ADD COLUMN     "linkUrl" TEXT,
ADD COLUMN     "promoCode" TEXT,
ADD COLUMN     "promoDescription" TEXT,
ADD COLUMN     "thumbnailImage" TEXT;

-- CreateTable
CREATE TABLE "PlaceVenue" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaceVenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "typeEmoji" TEXT,
    "typeLabel" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "placeVenueId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_routeId_order_key" ON "RouteStop"("routeId", "order");

-- AddForeignKey
ALTER TABLE "PlaceVenue" ADD CONSTRAINT "PlaceVenue_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_placeVenueId_fkey" FOREIGN KEY ("placeVenueId") REFERENCES "PlaceVenue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
