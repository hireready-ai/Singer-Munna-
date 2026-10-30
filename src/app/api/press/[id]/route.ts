import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await prisma.pressItem.update({
      where: { id: params.id },
      data: {
        title: body.title,
        titleHi: body.titleHi,
        publisher: body.publisher,
        publishDate: body.publishDate,
        articleUrl: body.articleUrl,
        summary: body.summary,
        summaryHi: body.summaryHi,
        imageUrl: body.imageUrl,
        order: Number(body.order) || 0,
        published: Boolean(body.published),
      },
    });

    await logAudit('UPDATE', 'PressItem', params.id, `Updated press item ${updated.title}`, session.username);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const deleted = await prisma.pressItem.delete({ where: { id: params.id } });
    await logAudit('DELETE', 'PressItem', params.id, `Deleted press item ${deleted.title}`, session.username);
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

