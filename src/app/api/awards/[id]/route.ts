import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await prisma.award.update({
      where: { id: params.id },
      data: {
        title: body.title,
        titleHi: body.titleHi,
        organization: body.organization,
        year: body.year,
        description: body.description,
        descriptionHi: body.descriptionHi,
        imageUrl: body.imageUrl,
        order: Number(body.order) || 0,
        published: Boolean(body.published),
      },
    });

    await logAudit('UPDATE', 'Award', params.id, `Updated award ${updated.title}`, session.username);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const deleted = await prisma.award.delete({ where: { id: params.id } });
    await logAudit('DELETE', 'Award', params.id, `Deleted award ${deleted.title}`, session.username);
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

