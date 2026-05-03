-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassificationSociety" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "country" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassificationSociety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vessel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "imoNumber" TEXT NOT NULL,
    "vesselType" TEXT NOT NULL,
    "length" DECIMAL(10,2) NOT NULL,
    "breadth" DECIMAL(10,2) NOT NULL,
    "depth" DECIMAL(10,2),
    "draft" DECIMAL(10,2),
    "deadweight" INTEGER,
    "grossTonnage" INTEGER,
    "iceClass" TEXT,
    "builtYear" INTEGER NOT NULL,
    "classificationSocietyId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_name_key" ON "Manufacturer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ClassificationSociety_name_key" ON "ClassificationSociety"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ClassificationSociety_shortName_key" ON "ClassificationSociety"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Vessel_imoNumber_key" ON "Vessel"("imoNumber");

-- CreateIndex
CREATE INDEX "Vessel_imoNumber_idx" ON "Vessel"("imoNumber");

-- CreateIndex
CREATE INDEX "Vessel_vesselType_idx" ON "Vessel"("vesselType");

-- CreateIndex
CREATE INDEX "Vessel_builtYear_idx" ON "Vessel"("builtYear");

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_classificationSocietyId_fkey" FOREIGN KEY ("classificationSocietyId") REFERENCES "ClassificationSociety"("id") ON DELETE SET NULL ON UPDATE CASCADE;
