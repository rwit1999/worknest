import { PrismaClient } from '@prisma/client';

// Access the global object with the correct type
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Instantiate PrismaClient and store it globally
export const db = new PrismaClient();

// Only assign to global in development to avoid multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
