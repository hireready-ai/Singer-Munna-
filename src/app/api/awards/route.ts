import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function GET() {
  const awards = await prisma.award.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { year: 'desc' }],
  });
  return NextResponse.json(awards);
}

export async function POST(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const award = await prisma.award.create({
      data: {
        title: body.title,
        titleHi: body.titleHi || body.title,
        organization: body.organization,
        year: body.year,
        description: body.description,
        descriptionHi: body.descriptionHi,
        imageUrl: body.imageUrl || null,
        order: Number(body.order) || 0,
        published: body.published !== undefined ? Boolean(body.published) : true,
      },
    });

    await logAudit('CREATE', 'Award', award.id, `Created award ${award.title}`, session.username);
    return NextResponse.json(award);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

