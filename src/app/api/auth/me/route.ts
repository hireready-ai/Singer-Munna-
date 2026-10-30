import { NextRequest, NextResponse } from 'next/server';
import { getSessionAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, name: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}

