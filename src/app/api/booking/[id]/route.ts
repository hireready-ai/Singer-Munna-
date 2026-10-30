import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await prisma.bookingEnquiry.update({
      where: { id: params.id },
      data: {
        status: body.status,
        adminNotes: body.adminNotes,
      },
    });

    await logAudit(
      'UPDATE',
      'BookingEnquiry',
      params.id,
      `Updated enquiry status to ${updated.status}`,
      session.username
    );
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const deleted = await prisma.bookingEnquiry.delete({
      where: { id: params.id },
    });

    await logAudit(
      'DELETE',
      'BookingEnquiry',
      params.id,
      `Deleted enquiry ${deleted.referenceId}`,
      session.username
    );
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

