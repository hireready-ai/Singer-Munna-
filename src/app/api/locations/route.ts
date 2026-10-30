import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  const where = all ? {} : { published: true };
  const items = await prisma.programLocation.findMany({
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
    const item = await prisma.programLocation.create({
      data: {
        city: data.city,
        cityHi: data.cityHi || data.city,
        state: data.state,
        stateHi: data.stateHi || '',
        programCount: Number(data.programCount) || 10,
        highlightText: data.highlightText || '',
        highlightHi: data.highlightHi || '',
        image: data.image || '/images/munna_nirala_stage.jpg',
        order: Number(data.order) || 0,
        published: data.published !== false,
      },
    });

    await logAudit('CREATE', 'ProgramLocation', item.id, `Created location: ${item.city}`, session.username);
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

