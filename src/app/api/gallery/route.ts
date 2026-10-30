import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';
  const homeOnly = searchParams.get('home') === 'true';

  const where: any = {};
  if (!all) where.published = true;
  if (homeOnly) where.showOnHome = true;

  const images = await prisma.galleryImage.findMany({
    where,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const image = await prisma.galleryImage.create({
      data: {
        title: body.title,
        titleHi: body.titleHi || body.title,
        caption: body.caption,
        captionHi: body.captionHi,
        imageUrl: body.imageUrl,
        category: body.category || 'Stage Performances',
        categoryHi: body.categoryHi || 'मंच प्रदर्शन',
        altText: body.altText || body.title,
        showOnHome: Boolean(body.showOnHome),
        order: Number(body.order) || 0,
        published: body.published !== undefined ? Boolean(body.published) : true,
      },
    });

    await logAudit('CREATE', 'GalleryImage', image.id, `Added gallery image ${image.title}`, session.username);
    return NextResponse.json(image);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

