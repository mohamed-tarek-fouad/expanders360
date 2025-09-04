import { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';

export type User = PrismaUser;
export { PrismaUserRole as UserRole };
