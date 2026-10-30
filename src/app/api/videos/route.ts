import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  const where = all ? {} : { published: true };
  const videos = await prisma.video.findMany({
    where,
    orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const video = await prisma.video.create({
      data: {
        title: body.title,
        titleHi: body.titleHi || body.title,
        description: body.description,
        descriptionHi: body.descriptionHi,
        videoUrl: body.videoUrl,
        thumbnail: body.thumbnail || '/images/munna_nirala_stage.jpg',
        category: body.category || 'Mata Jagran',
        categoryHi: body.categoryHi || 'माता जागरण',
        duration: body.duration || '10:00',
        isFeatured: Boolean(body.isFeatured),
        order: Number(body.order) || 0,
        published: body.published !== undefined ? Boolean(body.published) : true,
      },
    });

    await logAudit('CREATE', 'Video', video.id, `Created video ${video.title}`, session.username);
    return NextResponse.json(video);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

