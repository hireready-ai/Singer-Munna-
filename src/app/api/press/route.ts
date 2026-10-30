import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function GET() {
  const items = await prisma.pressItem.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const item = await prisma.pressItem.create({
      data: {
        title: body.title,
        titleHi: body.titleHi || body.title,
        publisher: body.publisher,
        publishDate: body.publishDate || 'Recent',
        articleUrl: body.articleUrl || null,
        summary: body.summary,
        summaryHi: body.summaryHi,
        imageUrl: body.imageUrl || null,
        order: Number(body.order) || 0,
        published: body.published !== undefined ? Boolean(body.published) : true,
      },
    });

    await logAudit('CREATE', 'PressItem', item.id, `Created press article ${item.title}`, session.username);
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

