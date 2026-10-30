import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  const where = all ? {} : { published: true };
  const tracks = await prisma.musicTrack.findMany({
    where,
    orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json(tracks);
}

export async function POST(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const track = await prisma.musicTrack.create({
      data: {
        title: body.title,
        titleHi: body.titleHi || body.title,
        album: body.album || 'Single',
        albumHi: body.albumHi || 'एकल',
        audioUrl: body.audioUrl,
        coverImage: body.coverImage || '/images/munna_nirala_hero.jpg',
        duration: body.duration || '05:00',
        releaseDate: body.releaseDate || new Date().toISOString().split('T')[0],
        category: body.category || 'Bhajan',
        categoryHi: body.categoryHi || 'भजन',
        isFeatured: Boolean(body.isFeatured),
        order: Number(body.order) || 0,
        published: body.published !== undefined ? Boolean(body.published) : true,
        spotifyUrl: body.spotifyUrl || null,
        youtubeUrl: body.youtubeUrl || null,
      },
    });

    await logAudit('CREATE', 'MusicTrack', track.id, `Created track ${track.title}`, session.username);
    
    try {
      revalidatePath('/');
      revalidatePath('/music');
    } catch (e) {
      console.warn('Revalidate warning:', e);
    }

    return NextResponse.json(track);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
