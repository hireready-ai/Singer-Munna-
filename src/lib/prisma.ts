import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// On Vercel Serverless, the root filesystem is read-only.
// We copy the bundled prisma/dev.db into /tmp so SQLite can perform reads and writes.
if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db';
  const possibleSourcePaths = [
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(__dirname, 'prisma', 'dev.db'),
    path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
    path.join(__dirname, '..', '..', '..', 'prisma', 'dev.db'),
    path.resolve('./prisma/dev.db'),
  ];

  let sourceDbPath: string | null = null;
  for (const p of possibleSourcePaths) {
    if (fs.existsSync(p)) {
      sourceDbPath = p;
      break;
    }
  }

  if (sourceDbPath) {
    let shouldCopy = false;
    if (!fs.existsSync(tmpDbPath)) {
      shouldCopy = true;
    } else {
      try {
        const srcStat = fs.statSync(sourceDbPath);
        const tmpStat = fs.statSync(tmpDbPath);
        // Overwrite if source is newer or size is different
        if (srcStat.mtimeMs > tmpStat.mtimeMs || srcStat.size !== tmpStat.size) {
          shouldCopy = true;
        }
      } catch {
        shouldCopy = true;
      }
    }

    if (shouldCopy) {
      try {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
        console.log(`[Prisma] Copied database from ${sourceDbPath} to ${tmpDbPath}`);
      } catch (e) {
        console.error('[Prisma] Failed to copy db to /tmp on Vercel:', e);
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
