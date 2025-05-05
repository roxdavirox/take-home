import { PrismaClient } from '@generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      password: passwordHash,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      password: passwordHash,
    },
  });
  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
