import React from 'react';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EventsClient } from './events-client';

export const revalidate = 0;

export default async function EventsPage() {
  const [settings, upcoming, past, schedules] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'default' } }),
    prisma.event.findMany({
      where: { published: true, status: 'UPCOMING' },
      orderBy: { eventDate: 'asc' },
    }),
    prisma.event.findMany({
      where: { published: true, status: 'COMPLETED' },
      orderBy: { eventDate: 'desc' },
    }),
    prisma.calendarSchedule.findMany({
      orderBy: { dateString: 'asc' },
    }),
  ]);

  return (
    <>
      <Header
        artistName={settings?.artistName}
        artistNameHi={settings?.artistNameHi}
        phone={settings?.primaryPhone}
      />
      <main className="flex-1">
        <EventsClient
          upcomingEvents={upcoming}
          pastEvents={past}
          schedules={schedules}
        />
      </main>
      <Footer settings={settings || undefined} />
    </>
  );
}

