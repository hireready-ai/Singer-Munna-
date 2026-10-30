import React from 'react';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactClient } from './contact-client';

export const revalidate = 0;

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: { date?: string; eventType?: string };
}) {
  const [settings, schedules] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'default' } }),
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
        <ContactClient
          settings={settings}
          schedules={schedules}
          prefillDate={searchParams?.date}
        />
      </main>
      <Footer settings={settings || undefined} />
    </>
  );
}

