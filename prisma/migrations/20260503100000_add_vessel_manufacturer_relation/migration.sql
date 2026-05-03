-- AlterTable
ALTER TABLE "Vessel" ADD COLUMN "manufacturerId" UUID;

-- CreateIndex
CREATE INDEX "Vessel_manufacturerId_idx" ON "Vessel"("manufacturerId");

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
