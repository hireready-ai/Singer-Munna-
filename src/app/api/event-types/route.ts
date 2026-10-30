import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  const where = all ? {} : { published: true };
  const items = await prisma.eventType.findMany({
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
    const item = await prisma.eventType.create({
      data: {
        title: data.title,
        titleHi: data.titleHi || data.title,
        subtitle: data.subtitle || '',
        subtitleHi: data.subtitleHi || '',
        iconImage: data.iconImage || '/icons/events/jagran.svg',
        category: data.category || 'Devotional',
        order: Number(data.order) || 0,
        published: data.published !== false,
      },
    });

    await logAudit('CREATE', 'EventType', item.id, `Created event type: ${item.title}`, session.username);
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

