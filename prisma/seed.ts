import { PrismaClient, UserRole, ProjectStatus } from '@prisma/client';
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

  // Create sample clients
  const client1 = await prisma.client.upsert({
    where: { contactEmail: 'contact@techcorp.com' },
    update: {},
    create: {
      companyName: 'TechCorp Solutions',
      contactEmail: 'contact@techcorp.com',
    },
  });

  const client2 = await prisma.client.upsert({
    where: { contactEmail: 'info@globalenterprise.com' },
    update: {},
    create: {
      companyName: 'Global Enterprise Ltd',
      contactEmail: 'info@globalenterprise.com',
    },
  });

  // Create sample projects
  const project1 = await prisma.project.upsert({
    where: { id: 'project-1' },
    update: {},
    create: {
      id: 'project-1',
      clientId: client1.id,
      country: 'United States',
      servicesNeeded: ['Web Development', 'Mobile App', 'UI/UX Design'],
      budget: 50000.00,
      status: ProjectStatus.ACTIVE,
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 'project-2' },
    update: {},
    create: {
      id: 'project-2',
      clientId: client2.id,
      country: 'Canada',
      servicesNeeded: ['E-commerce Platform', 'Payment Integration'],
      budget: 75000.00,
      status: ProjectStatus.DRAFT,
    },
  });

  // Create sample vendors
  const vendor1 = await prisma.vendor.upsert({
    where: { id: 'vendor-1' },
    update: {},
    create: {
      id: 'vendor-1',
      name: 'Digital Solutions Inc',
      countriesSupported: ['United States', 'Canada', 'Mexico'],
      servicesOffered: ['Web Development', 'Mobile App', 'UI/UX Design', 'E-commerce'],
      rating: 4.75,
      responseSlaHours: 24,
    },
  });

  const vendor2 = await prisma.vendor.upsert({
    where: { id: 'vendor-2' },
    update: {},
    create: {
      id: 'vendor-2',
      name: 'Global Tech Partners',
      countriesSupported: ['Canada', 'United Kingdom', 'Germany'],
      servicesOffered: ['E-commerce Platform', 'Payment Integration', 'Cloud Services'],
      rating: 4.50,
      responseSlaHours: 48,
    },
  });

  // Create sample matches
  const match1 = await prisma.match.upsert({
    where: { 
      projectId_vendorId: {
        projectId: project1.id,
        vendorId: vendor1.id,
      }
    },
    update: {},
    create: {
      projectId: project1.id,
      vendorId: vendor1.id,
      score: 92.50,
    },
  });

  const match2 = await prisma.match.upsert({
    where: { 
      projectId_vendorId: {
        projectId: project2.id,
        vendorId: vendor2.id,
      }
    },
    update: {},
    create: {
      projectId: project2.id,
      vendorId: vendor2.id,
      score: 88.75,
    },
  });

  console.log('Seeded data:', { 
    users: { admin: admin.email, client: client.email },
    clients: { client1: client1.companyName, client2: client2.companyName },
    projects: { project1: project1.id, project2: project2.id },
    vendors: { vendor1: vendor1.name, vendor2: vendor2.name },
    matches: { match1: match1.score, match2: match2.score }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
