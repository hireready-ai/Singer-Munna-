import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: 'default' },
    });
  }

  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please login again.' }, { status: 401 });
  }

  try {
    const data = await req.json();
    delete data.id;
    delete data.updatedAt;

    const updated = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data },
    });

    await logAudit('UPDATE', 'SiteSettings', 'default', 'Updated site settings', session.username);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    console.error('Error updating settings:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
