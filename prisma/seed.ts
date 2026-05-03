import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const man = await prisma.manufacturer.upsert({
    where: { name: 'MAN Energy Solutions' },
    update: {},
    create: {
      name: 'MAN Energy Solutions',
      country: 'Germany',
      website: 'https://www.man-es.com',
    },
  });

  const wartsila = await prisma.manufacturer.upsert({
    where: { name: 'Wärtsilä' },
    update: {},
    create: {
      name: 'Wärtsilä',
      country: 'Finland',
      website: 'https://www.wartsila.com',
    },
  });

  const dnv = await prisma.classificationSociety.upsert({
    where: { shortName: 'DNV' },
    update: {},
    create: {
      name: 'DNV',
      shortName: 'DNV',
      country: 'Norway',
      website: 'https://www.dnv.com',
    },
  });

  const lr = await prisma.classificationSociety.upsert({
    where: { shortName: 'LR' },
    update: {},
    create: {
      name: 'Lloyd’s Register',
      shortName: 'LR',
      country: 'United Kingdom',
      website: 'https://www.lr.org',
    },
  });

  await prisma.vessel.upsert({
    where: { imoNumber: '9319466' },
    update: {},
    create: {
      name: 'Baltic Trader',
      imoNumber: '9319466',
      vesselType: 'Bulk Carrier',
      length: 225.0,
      breadth: 32.2,
      depth: 19.3,
      draft: 13.8,
      deadweight: 76500,
      grossTonnage: 40500,
      iceClass: '1C',
      builtYear: 2008,
      classificationSocietyId: dnv.id,
    },
  });

  await prisma.vessel.upsert({
    where: { imoNumber: '9571234' },
    update: {},
    create: {
      name: 'Northern Cargo',
      imoNumber: '9571234',
      vesselType: 'General Cargo Ship',
      length: 145.5,
      breadth: 22.8,
      depth: 11.2,
      draft: 7.4,
      deadweight: 17500,
      grossTonnage: 11800,
      iceClass: null,
      builtYear: 2012,
      classificationSocietyId: lr.id,
    },
  });

  await prisma.vessel.upsert({
    where: { imoNumber: '9823456' },
    update: {},
    create: {
      name: 'Ocean Feeder',
      imoNumber: '9823456',
      vesselType: 'Container Ship',
      length: 171.9,
      breadth: 27.6,
      depth: 14.1,
      draft: 9.2,
      deadweight: 24500,
      grossTonnage: 18500,
      iceClass: 'Ice-1A',
      builtYear: 2019,
      classificationSocietyId: dnv.id,
    },
  });

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
