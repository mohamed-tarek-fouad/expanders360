import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@expanders360.com' },
    update: {},
    create: {
      email: 'admin@expanders360.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  // Create sample client user
  const clientPassword = await bcrypt.hash('client123', saltRounds);
  const client = await prisma.user.upsert({
    where: { email: 'client@expanders360.com' },
    update: {},
    create: {
      email: 'client@expanders360.com',
      password: clientPassword,
      firstName: 'Client',
      lastName: 'User',
      role: UserRole.CLIENT,
    },
  });

  console.log('Seeded users:', { admin: admin.email, client: client.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
