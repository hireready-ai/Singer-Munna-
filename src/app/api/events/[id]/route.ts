import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: body.title,
        titleHi: body.titleHi,
        eventDate: new Date(body.eventDate),
        time: body.time,
        venue: body.venue,
        venueHi: body.venueHi,
        city: body.city,
        cityHi: body.cityHi,
        description: body.description,
        descriptionHi: body.descriptionHi,
        posterImage: body.posterImage,
        bookingUrl: body.bookingUrl,
        status: body.status,
        isPublic: Boolean(body.isPublic),
        order: Number(body.order) || 0,
        published: Boolean(body.published),
      },
    });

    await logAudit('UPDATE', 'Event', params.id, `Updated event ${updated.title}`, session.username);
    
    try {
      revalidatePath('/');
      revalidatePath('/events');
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
    const deleted = await prisma.event.delete({
      where: { id: params.id },
    });

    await logAudit('DELETE', 'Event', params.id, `Deleted event ${deleted.title}`, session.username);
    
    try {
      revalidatePath('/');
      revalidatePath('/events');
    } catch (e) {
      console.warn('Revalidate warning:', e);
    }

    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
