import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

const CITIES = [
  {
    slug: 'moscow',
    name: 'Москва',
  },
  {
    slug: 'saintp',
    name: 'Санкт-Петербург',
  },
];

async function seedCities() {
  for (const city of CITIES) {
    await prisma.city.upsert({
      where: {
        slug: city.slug,
      },
      update: {
        name: city.name,
      },
      create: city,
    });
  }
}

async function seedAdminUser() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_SEED_EMAIL и ADMIN_SEED_PASSWORD должны быть заданы в .env');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: {
      email,
    },
    update: {
    },
    create: {
      email,
      passwordHash,
      name: 'Admin',
      role: 'SUPERADMIN',
    },
  });

  console.log(`Admin user ready: ${email}`);
}

async function main() {
  await seedCities();
  await seedAdminUser();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
