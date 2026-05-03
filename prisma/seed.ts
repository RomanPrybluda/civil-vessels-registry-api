import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const manufacturersData = [
  {
    name: 'MAN Energy Solutions',
    country: 'Germany',
    website: 'https://www.man-es.com',
  },
  {
    name: 'Wartsila',
    country: 'Finland',
    website: 'https://www.wartsila.com',
  },
  {
    name: 'Caterpillar Marine',
    country: 'United States',
    website: 'https://www.cat.com',
  },
  {
    name: 'Yanmar Marine',
    country: 'Japan',
    website: 'https://www.yanmar.com',
  },
  {
    name: 'Rolls-Royce Solutions',
    country: 'United Kingdom',
    website: 'https://www.rolls-royce.com',
  },
];

const classificationSocietiesData = [
  {
    name: 'DNV',
    shortName: 'DNV',
    country: 'Norway',
    website: 'https://www.dnv.com',
  },
  {
    name: 'Lloyds Register',
    shortName: 'LR',
    country: 'United Kingdom',
    website: 'https://www.lr.org',
  },
  {
    name: 'American Bureau of Shipping',
    shortName: 'ABS',
    country: 'United States',
    website: 'https://www.eagle.org',
  },
  {
    name: 'Bureau Veritas',
    shortName: 'BV',
    country: 'France',
    website: 'https://marine-offshore.bureauveritas.com',
  },
  {
    name: 'RINA Services',
    shortName: 'RINA',
    country: 'Italy',
    website: 'https://www.rina.org',
  },
];

const shipbuildersData = [
  {
    name: 'Hyundai Heavy Industries',
    country: 'South Korea',
    website: 'https://www.hhi.co.kr',
  },
  {
    name: 'Daewoo Shipbuilding and Marine Engineering',
    country: 'South Korea',
    website: 'https://www.dsme.co.kr',
  },
  {
    name: 'Mitsubishi Heavy Industries',
    country: 'Japan',
    website: 'https://www.mhi.com',
  },
  {
    name: 'Fincantieri',
    country: 'Italy',
    website: 'https://www.fincantieri.com',
  },
  {
    name: 'China State Shipbuilding Corporation',
    country: 'China',
    website: 'https://www.cssc.net.cn',
  },
];

const vesselsData = [
  { name: 'Azov Meridian', imoNumber: '9301001', vesselType: 'Bulk Carrier', length: 229.5, breadth: 32.2, depth: 19.2, draft: 13.6, deadweight: 81000, grossTonnage: 43500, iceClass: '1C', builtYear: 2011, classificationSocietyShortName: 'DNV', shipbuilderName: 'Hyundai Heavy Industries' },
  { name: 'Danube Horizon', imoNumber: '9301002', vesselType: 'General Cargo Ship', length: 145.3, breadth: 22.7, depth: 11.0, draft: 7.1, deadweight: 16800, grossTonnage: 11200, iceClass: null, builtYear: 2013, classificationSocietyShortName: 'LR', shipbuilderName: 'Mitsubishi Heavy Industries' },
  { name: 'Odessa Feeder', imoNumber: '9301003', vesselType: 'Container Ship', length: 182.0, breadth: 30.0, depth: 14.6, draft: 9.8, deadweight: 29800, grossTonnage: 24600, iceClass: 'Ice-1A', builtYear: 2018, classificationSocietyShortName: 'ABS', shipbuilderName: 'China State Shipbuilding Corporation' },
  { name: 'Black Sea Aurora', imoNumber: '9301004', vesselType: 'LNG Carrier', length: 289.0, breadth: 45.8, depth: 26.1, draft: 11.7, deadweight: 102000, grossTonnage: 118000, iceClass: null, builtYear: 2020, classificationSocietyShortName: 'DNV', shipbuilderName: 'Daewoo Shipbuilding and Marine Engineering' },
  { name: 'Baltic Vertex', imoNumber: '9301005', vesselType: 'LPG Carrier', length: 224.0, breadth: 36.6, depth: 22.0, draft: 10.4, deadweight: 54000, grossTonnage: 48500, iceClass: null, builtYear: 2017, classificationSocietyShortName: 'BV', shipbuilderName: 'Hyundai Heavy Industries' },
  { name: 'Neptune Alloy', imoNumber: '9301006', vesselType: 'Chemical Tanker', length: 179.0, breadth: 32.0, depth: 16.4, draft: 10.1, deadweight: 46500, grossTonnage: 30100, iceClass: null, builtYear: 2016, classificationSocietyShortName: 'RINA', shipbuilderName: 'Fincantieri' },
  { name: 'Marlin Stream', imoNumber: '9301007', vesselType: 'Product Tanker', length: 183.0, breadth: 32.2, depth: 17.4, draft: 11.2, deadweight: 51000, grossTonnage: 32000, iceClass: null, builtYear: 2015, classificationSocietyShortName: 'LR', shipbuilderName: 'China State Shipbuilding Corporation' },
  { name: 'Atlas Current', imoNumber: '9301008', vesselType: 'Crude Oil Tanker', length: 333.0, breadth: 60.0, depth: 30.0, draft: 20.3, deadweight: 301000, grossTonnage: 161000, iceClass: null, builtYear: 2014, classificationSocietyShortName: 'ABS', shipbuilderName: 'Daewoo Shipbuilding and Marine Engineering' },
  { name: 'Caspian Runner', imoNumber: '9301009', vesselType: 'Ro-Ro Cargo Ship', length: 199.0, breadth: 32.2, depth: 11.4, draft: 7.3, deadweight: 28600, grossTonnage: 40900, iceClass: '1B', builtYear: 2021, classificationSocietyShortName: 'DNV', shipbuilderName: 'Mitsubishi Heavy Industries' },
  { name: 'Volga Transit', imoNumber: '9301010', vesselType: 'Vehicle Carrier', length: 199.8, breadth: 35.4, depth: 38.0, draft: 10.1, deadweight: 21600, grossTonnage: 68400, iceClass: null, builtYear: 2019, classificationSocietyShortName: 'BV', shipbuilderName: 'Hyundai Heavy Industries' },
  { name: 'Arctic Fresh', imoNumber: '9301011', vesselType: 'Refrigerated Cargo Ship', length: 167.2, breadth: 25.8, depth: 12.8, draft: 8.9, deadweight: 19300, grossTonnage: 14800, iceClass: '1A', builtYear: 2012, classificationSocietyShortName: 'RINA', shipbuilderName: 'Fincantieri' },
  { name: 'Titan Lift', imoNumber: '9301012', vesselType: 'Heavy Lift Vessel', length: 171.0, breadth: 27.5, depth: 13.1, draft: 8.0, deadweight: 21000, grossTonnage: 15900, iceClass: null, builtYear: 2018, classificationSocietyShortName: 'LR', shipbuilderName: 'China State Shipbuilding Corporation' },
  { name: 'Mercury Trade', imoNumber: '9301013', vesselType: 'Multi-purpose Vessel', length: 156.6, breadth: 25.0, depth: 12.4, draft: 8.3, deadweight: 18200, grossTonnage: 14100, iceClass: null, builtYear: 2011, classificationSocietyShortName: 'ABS', shipbuilderName: 'Mitsubishi Heavy Industries' },
  { name: 'Sea Vector', imoNumber: '9301014', vesselType: 'Offshore Supply Vessel', length: 89.0, breadth: 19.4, depth: 8.0, draft: 6.4, deadweight: 5200, grossTonnage: 3800, iceClass: null, builtYear: 2017, classificationSocietyShortName: 'DNV', shipbuilderName: 'Fincantieri' },
  { name: 'Ocean Link', imoNumber: '9301015', vesselType: 'Cable Layer', length: 139.0, breadth: 23.0, depth: 10.0, draft: 6.9, deadweight: 9700, grossTonnage: 11800, iceClass: null, builtYear: 2016, classificationSocietyShortName: 'BV', shipbuilderName: 'Daewoo Shipbuilding and Marine Engineering' },
  { name: 'Hydro Quest', imoNumber: '9301016', vesselType: 'Research Vessel', length: 106.0, breadth: 20.0, depth: 9.0, draft: 6.1, deadweight: 4400, grossTonnage: 6500, iceClass: '1C', builtYear: 2022, classificationSocietyShortName: 'RINA', shipbuilderName: 'Mitsubishi Heavy Industries' },
  { name: 'Delta Digger', imoNumber: '9301017', vesselType: 'Dredger', length: 132.0, breadth: 27.0, depth: 8.8, draft: 5.6, deadweight: 12500, grossTonnage: 10200, iceClass: null, builtYear: 2010, classificationSocietyShortName: 'LR', shipbuilderName: 'China State Shipbuilding Corporation' },
  { name: 'Harbor Breeze', imoNumber: '9301018', vesselType: 'Passenger Ferry', length: 158.0, breadth: 24.8, depth: 10.5, draft: 5.8, deadweight: 6800, grossTonnage: 17500, iceClass: null, builtYear: 2021, classificationSocietyShortName: 'ABS', shipbuilderName: 'Fincantieri' },
  { name: 'Guardian Wave', imoNumber: '9301019', vesselType: 'Patrol Vessel', length: 98.0, breadth: 15.0, depth: 6.2, draft: 4.6, deadweight: 2800, grossTonnage: 2400, iceClass: null, builtYear: 2014, classificationSocietyShortName: 'DNV', shipbuilderName: 'Daewoo Shipbuilding and Marine Engineering' },
  { name: 'Academy Star', imoNumber: '9301020', vesselType: 'Training Vessel', length: 118.0, breadth: 18.5, depth: 8.1, draft: 5.3, deadweight: 3900, grossTonnage: 5100, iceClass: null, builtYear: 2013, classificationSocietyShortName: 'BV', shipbuilderName: 'Hyundai Heavy Industries' },
];

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.vesselMainEngine.deleteMany();
    await tx.vesselAuxiliaryEngine.deleteMany();
    await tx.vesselShaftGenerator.deleteMany();
    await tx.vessel.deleteMany();
    await tx.classificationSociety.deleteMany();
    await tx.manufacturer.deleteMany();
    await tx.shipbuilder.deleteMany();
  });

  await prisma.manufacturer.createMany({
    data: manufacturersData,
  });

  await prisma.classificationSociety.createMany({
    data: classificationSocietiesData,
  });

  await prisma.shipbuilder.createMany({
    data: shipbuildersData,
  });

  const manufacturers = await prisma.manufacturer.findMany();
  const manufacturerByName = new Map(
    manufacturers.map((item) => [item.name, item]),
  );

  const classificationSocieties = await prisma.classificationSociety.findMany();
  const classSocietyByShortName = new Map(
    classificationSocieties.map((item) => [item.shortName, item]),
  );

  const shipbuilders = await prisma.shipbuilder.findMany();
  const shipbuilderByName = new Map(shipbuilders.map((item) => [item.name, item]));

  for (const [index, vessel] of vesselsData.entries()) {
    const classSociety = classSocietyByShortName.get(
      vessel.classificationSocietyShortName,
    );
    const shipbuilder = shipbuilderByName.get(vessel.shipbuilderName);
    const engineManufacturer = manufacturers[index % manufacturers.length];
    const auxManufacturer =
      manufacturers[(index + 1) % manufacturers.length] ??
      manufacturerByName.get('MAN Energy Solutions');

    if (!classSociety || !shipbuilder || !engineManufacturer || !auxManufacturer) {
      throw new Error('Seed reference integrity check failed');
    }

    await prisma.vessel.create({
      data: {
        name: vessel.name,
        imoNumber: vessel.imoNumber,
        vesselType: vessel.vesselType,
        length: vessel.length,
        breadth: vessel.breadth,
        depth: vessel.depth,
        draft: vessel.draft,
        deadweight: vessel.deadweight,
        grossTonnage: vessel.grossTonnage,
        iceClass: vessel.iceClass,
        builtYear: vessel.builtYear,
        classificationSocietyId: classSociety.id,
        manufacturerId: engineManufacturer.id,
        shipbuilderId: shipbuilder.id,
        mainEngines: {
          create: [
            {
              manufacturerId: engineManufacturer.id,
              model: `ME-${3000 + index}`,
              quantity: 1,
              powerKw: 5400 + index * 120,
              totalPowerKw: 5400 + index * 120,
            },
          ],
        },
        auxiliaryEngines: {
          create: [
            {
              manufacturerId: auxManufacturer.id,
              model: `AE-${900 + index}`,
              quantity: 2,
              powerKw: 950 + index * 15,
              totalPowerKw: (950 + index * 15) * 2,
            },
          ],
        },
      },
    });
  }

  console.log(
    `Seed completed: ${vesselsData.length} vessels, ${manufacturersData.length} manufacturers, ${shipbuildersData.length} shipbuilders.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
