import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'munna-nirala-super-secret-jwt-key-2026';

export interface AdminPayload {
  userId: string;
  username: string;
  role: string;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch (err) {
    return null;
  }
}

export async function getSessionAdmin(): Promise<AdminPayload | null> {
  // Check Authorization header first
  const headerList = headers();
  const authHeader = headerList.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const verified = verifyToken(token);
    if (verified) return verified;
  }

  // Fallback to cookie
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function logAudit(action: string, entityType: string, entityId?: string, details?: string, user = 'admin') {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId: entityId || null,
        details: details || null,
        user,
      },
    });
  } catch (err) {
    console.error('Audit log error:', err);
  }
}
