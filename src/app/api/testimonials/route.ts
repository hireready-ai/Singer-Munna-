import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  const where = all ? {} : { published: true };
  const items = await prisma.testimonial.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const item = await prisma.testimonial.create({
      data: {
        clientName: data.clientName,
        clientNameHi: data.clientNameHi || data.clientName,
        designation: data.designation || '',
        designationHi: data.designationHi || '',
        city: data.city || '',
        cityHi: data.cityHi || '',
        eventType: data.eventType || 'Devotional Event',
        eventTypeHi: data.eventTypeHi || 'धार्मिक कार्यक्रम',
        rating: Number(data.rating) || 5,
        reviewText: data.reviewText,
        reviewTextHi: data.reviewTextHi || data.reviewText,
        avatarUrl: data.avatarUrl || '/images/munna_nirala_portrait.jpg',
        verified: data.verified !== false,
        order: Number(data.order) || 0,
        published: data.published !== false,
      },
    });

    await logAudit('CREATE', 'Testimonial', item.id, `Created testimonial from: ${item.clientName}`, session.username);
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

