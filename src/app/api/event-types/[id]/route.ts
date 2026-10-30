import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    if (data.order !== undefined) data.order = Number(data.order);

    const updated = await prisma.eventType.update({
      where: { id: params.id },
      data,
    });

    await logAudit('UPDATE', 'EventType', params.id, `Updated event type: ${updated.title}`, session.username);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const deleted = await prisma.eventType.delete({
      where: { id: params.id },
    });

    await logAudit('DELETE', 'EventType', params.id, `Deleted event type: ${deleted.title}`, session.username);
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

