import { PrismaClient } from '@prisma/client';

// Instância única do Prisma (singleton)
// Evita criar múltiplas conexões em desenvolvimento com hot-reload
export const prisma = new PrismaClient();
