-- CreateTable
CREATE TABLE "Shipbuilder" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipbuilder_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Vessel" ADD COLUMN "shipbuilderId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Shipbuilder_name_key" ON "Shipbuilder"("name");

-- CreateIndex
CREATE INDEX "Vessel_shipbuilderId_idx" ON "Vessel"("shipbuilderId");

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_shipbuilderId_fkey" FOREIGN KEY ("shipbuilderId") REFERENCES "Shipbuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
