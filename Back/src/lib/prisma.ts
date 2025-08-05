import { PrismaClient } from '../generated/prisma';

// Evita que se creen múltiples instancias de PrismaClient en desarrollo
// debido al Hot Module Replacement (HMR).

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;