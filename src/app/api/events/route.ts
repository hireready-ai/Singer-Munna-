import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  const where = all ? {} : { published: true };
  const events = await prisma.event.findMany({
    where,
    orderBy: [{ eventDate: 'asc' }],
  });

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const event = await prisma.event.create({
      data: {
        title: body.title,
        titleHi: body.titleHi || body.title,
        eventDate: new Date(body.eventDate),
        time: body.time || '07:00 PM onwards',
        venue: body.venue,
        venueHi: body.venueHi,
        city: body.city,
        cityHi: body.cityHi,
        description: body.description,
        descriptionHi: body.descriptionHi,
        posterImage: body.posterImage || '/images/munna_nirala_bhajan.jpg',
        bookingUrl: body.bookingUrl || '/contact',
        status: body.status || 'UPCOMING',
        isPublic: body.isPublic !== undefined ? Boolean(body.isPublic) : true,
        order: Number(body.order) || 0,
        published: body.published !== undefined ? Boolean(body.published) : true,
      },
    });

    await logAudit('CREATE', 'Event', event.id, `Created event ${event.title}`, session.username);
    
    try {
      revalidatePath('/');
      revalidatePath('/events');
    } catch (e) {
      console.warn('Revalidate warning:', e);
    }

    return NextResponse.json(event);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
