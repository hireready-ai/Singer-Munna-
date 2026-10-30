import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// On Vercel Serverless, the root filesystem is read-only.
// Copy bundled prisma/dev.db to /tmp so SQLite can perform reads and writes without failing.
if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    if (fs.existsSync(sourceDbPath)) {
      try {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      } catch (e) {
        console.error('Failed to copy db to /tmp on Vercel:', e);
      }
    }
  }
  process.env.DATABASE_URL = 'file:/tmp/dev.db';
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
