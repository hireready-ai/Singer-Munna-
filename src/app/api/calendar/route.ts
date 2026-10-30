import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function GET() {
  const schedules = await prisma.calendarSchedule.findMany({
    orderBy: { dateString: 'asc' },
  });
  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { dateString, status, programTitle, city, note } = body;

    if (!dateString) {
      return NextResponse.json({ error: 'dateString is required' }, { status: 400 });
    }

    const schedule = await prisma.calendarSchedule.upsert({
      where: { dateString },
      update: {
        status: status || 'BOOKED',
        programTitle: programTitle || null,
        city: city || null,
        note: note || null,
      },
      create: {
        dateString,
        status: status || 'BOOKED',
        programTitle: programTitle || null,
        city: city || null,
        note: note || null,
      },
    });

    await logAudit(
      'UPSERT',
      'CalendarSchedule',
      schedule.id,
      `Updated calendar schedule for ${dateString} to ${schedule.status}`,
      session.username
    );
    return NextResponse.json(schedule);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

