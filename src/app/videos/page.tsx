import React from 'react';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VideosClient } from './videos-client';

export const revalidate = 0;

export default async function VideosPage() {
  const [settings, videos] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'default' } }),
    prisma.video.findMany({
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
        <VideosClient initialVideos={videos} />
      </main>
      <Footer settings={settings || undefined} />
    </>
  );
}

