import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await prisma.musicTrack.update({
      where: { id: params.id },
      data: {
        title: body.title,
        titleHi: body.titleHi,
        album: body.album,
        albumHi: body.albumHi,
        audioUrl: body.audioUrl,
        coverImage: body.coverImage,
        duration: body.duration,
        releaseDate: body.releaseDate,
        category: body.category,
        categoryHi: body.categoryHi,
        isFeatured: Boolean(body.isFeatured),
        order: Number(body.order) || 0,
        published: Boolean(body.published),
        spotifyUrl: body.spotifyUrl,
        youtubeUrl: body.youtubeUrl,
      },
    });

    await logAudit('UPDATE', 'MusicTrack', params.id, `Updated track ${updated.title}`, session.username);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const deleted = await prisma.musicTrack.delete({
      where: { id: params.id },
    });

    await logAudit('DELETE', 'MusicTrack', params.id, `Deleted track ${deleted.title}`, session.username);
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

