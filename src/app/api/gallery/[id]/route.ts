import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await prisma.galleryImage.update({
      where: { id: params.id },
      data: {
        title: body.title,
        titleHi: body.titleHi,
        caption: body.caption,
        captionHi: body.captionHi,
        imageUrl: body.imageUrl,
        category: body.category,
        categoryHi: body.categoryHi,
        altText: body.altText,
        showOnHome: Boolean(body.showOnHome),
        order: Number(body.order) || 0,
        published: Boolean(body.published),
      },
    });

    await logAudit('UPDATE', 'GalleryImage', params.id, `Updated gallery image ${updated.title}`, session.username);
    
    try {
      revalidatePath('/');
      revalidatePath('/gallery');
    } catch (e) {
      console.warn('Revalidate warning:', e);
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const deleted = await prisma.galleryImage.delete({
      where: { id: params.id },
    });

    await logAudit('DELETE', 'GalleryImage', params.id, `Deleted image ${deleted.title}`, session.username);
    
    try {
      revalidatePath('/');
      revalidatePath('/gallery');
    } catch (e) {
      console.warn('Revalidate warning:', e);
    }

    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
