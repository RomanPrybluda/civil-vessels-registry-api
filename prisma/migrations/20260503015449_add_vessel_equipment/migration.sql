-- CreateTable
CREATE TABLE "VesselMainEngine" (
    "id" UUID NOT NULL,
    "vesselId" UUID NOT NULL,
    "manufacturerId" UUID,
    "model" TEXT,
    "quantity" INTEGER NOT NULL,
    "powerKw" INTEGER NOT NULL,
    "totalPowerKw" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VesselMainEngine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VesselAuxiliaryEngine" (
    "id" UUID NOT NULL,
    "vesselId" UUID NOT NULL,
    "manufacturerId" UUID,
    "model" TEXT,
    "quantity" INTEGER NOT NULL,
    "powerKw" INTEGER NOT NULL,
    "totalPowerKw" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VesselAuxiliaryEngine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VesselShaftGenerator" (
    "id" UUID NOT NULL,
    "vesselId" UUID NOT NULL,
    "manufacturerId" UUID,
    "model" TEXT,
    "quantity" INTEGER NOT NULL,
    "powerKw" INTEGER NOT NULL,
    "totalPowerKw" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VesselShaftGenerator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VesselMainEngine_vesselId_idx" ON "VesselMainEngine"("vesselId");

-- CreateIndex
CREATE INDEX "VesselMainEngine_manufacturerId_idx" ON "VesselMainEngine"("manufacturerId");

-- CreateIndex
CREATE INDEX "VesselAuxiliaryEngine_vesselId_idx" ON "VesselAuxiliaryEngine"("vesselId");

-- CreateIndex
CREATE INDEX "VesselAuxiliaryEngine_manufacturerId_idx" ON "VesselAuxiliaryEngine"("manufacturerId");

-- CreateIndex
CREATE INDEX "VesselShaftGenerator_vesselId_idx" ON "VesselShaftGenerator"("vesselId");

-- CreateIndex
CREATE INDEX "VesselShaftGenerator_manufacturerId_idx" ON "VesselShaftGenerator"("manufacturerId");

-- AddForeignKey
ALTER TABLE "VesselMainEngine" ADD CONSTRAINT "VesselMainEngine_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "Vessel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VesselMainEngine" ADD CONSTRAINT "VesselMainEngine_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VesselAuxiliaryEngine" ADD CONSTRAINT "VesselAuxiliaryEngine_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "Vessel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VesselAuxiliaryEngine" ADD CONSTRAINT "VesselAuxiliaryEngine_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VesselShaftGenerator" ADD CONSTRAINT "VesselShaftGenerator_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "Vessel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VesselShaftGenerator" ADD CONSTRAINT "VesselShaftGenerator_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
