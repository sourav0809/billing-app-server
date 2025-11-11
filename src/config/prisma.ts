import { Prisma, PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

export { prisma, Prisma as PrismaTypes };
