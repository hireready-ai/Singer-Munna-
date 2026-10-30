import React from 'react';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MusicClient } from './music-client';

export const revalidate = 0;

export default async function MusicPage() {
  const [settings, tracks] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'default' } }),
    prisma.musicTrack.findMany({
      where: { published: true },
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
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
        <MusicClient initialTracks={tracks} settings={settings} />
      </main>
      <Footer settings={settings || undefined} />
    </>
  );
}

