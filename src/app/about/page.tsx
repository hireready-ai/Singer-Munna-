import React from 'react';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AboutClient } from './about-client';

export const revalidate = 0;

export default async function AboutPage() {
  const [settings, bio, awards, press] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'default' } }),
    prisma.biography.findUnique({ where: { id: 'default' } }),
    prisma.award.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { year: 'desc' }],
    }),
    prisma.pressItem.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
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
        <AboutClient settings={settings} bio={bio} awards={awards} press={press} />
      </main>
      <Footer settings={settings || undefined} />
    </>
  );
}

