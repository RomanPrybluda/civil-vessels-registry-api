-- CreateTable
CREATE TABLE "VesselType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VesselType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VesselType_name_key" ON "VesselType"("name");

-- Seed distinct vessel types from existing Vessel rows
INSERT INTO "VesselType" ("id", "name", "createdAt", "updatedAt")
SELECT
    (
        substr(md5("v"."vesselType"), 1, 8) || '-' ||
        substr(md5("v"."vesselType"), 9, 4) || '-' ||
        '4' || substr(md5("v"."vesselType"), 14, 3) || '-' ||
        'a' || substr(md5("v"."vesselType"), 18, 3) || '-' ||
        substr(md5("v"."vesselType"), 21, 12)
    )::uuid,
    "v"."vesselType",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT DISTINCT "vesselType"
    FROM "Vessel"
) AS "v";

-- AlterTable
ALTER TABLE "Vessel" ADD COLUMN "vesselTypeId" UUID;

-- Backfill relation by matching names
UPDATE "Vessel" AS "v"
SET "vesselTypeId" = "vt"."id"
FROM "VesselType" AS "vt"
WHERE "vt"."name" = "v"."vesselType";

-- Enforce relation
ALTER TABLE "Vessel" ALTER COLUMN "vesselTypeId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Vessel_vesselTypeId_idx" ON "Vessel"("vesselTypeId");

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_vesselTypeId_fkey" FOREIGN KEY ("vesselTypeId") REFERENCES "VesselType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropIndex
DROP INDEX "Vessel_vesselType_idx";

-- Drop old denormalized column
ALTER TABLE "Vessel" DROP COLUMN "vesselType";
