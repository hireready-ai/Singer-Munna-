import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await prisma.video.update({
      where: { id: params.id },
      data: {
        title: body.title,
        titleHi: body.titleHi,
        description: body.description,
        descriptionHi: body.descriptionHi,
        videoUrl: body.videoUrl,
        thumbnail: body.thumbnail,
        category: body.category,
        categoryHi: body.categoryHi,
        duration: body.duration,
        isFeatured: Boolean(body.isFeatured),
        order: Number(body.order) || 0,
        published: Boolean(body.published),
      },
    });

    await logAudit('UPDATE', 'Video', params.id, `Updated video ${updated.title}`, session.username);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const deleted = await prisma.video.delete({
      where: { id: params.id },
    });

    await logAudit('DELETE', 'Video', params.id, `Deleted video ${deleted.title}`, session.username);
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

