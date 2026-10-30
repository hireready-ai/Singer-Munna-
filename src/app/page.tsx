import React from 'react';
import { prisma } from '@/lib/prisma';
import { HomePageClient } from './home-client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Dynamic revalidation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [
    settings,
    bio,
    featuredMusic,
    featuredVideo,
    popularVideos,
    popularTracks,
    highlightImages,
    upcomingEvents,
    awards,
    pressItems,
    eventTypes,
    programLocations,
    testimonials,
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'default' } }),
    prisma.biography.findUnique({ where: { id: 'default' } }),
    prisma.musicTrack.findFirst({
      where: { published: true, isFeatured: true },
      orderBy: { order: 'asc' },
    }),
    prisma.video.findFirst({
      where: { published: true, isFeatured: true },
      orderBy: { order: 'asc' },
    }),
    prisma.video.findMany({
      where: { published: true },
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }],
      take: 6,
    }),
    prisma.musicTrack.findMany({
      where: { published: true },
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }],
      take: 6,
    }),
    prisma.galleryImage.findMany({
      where: { published: true, showOnHome: true },
      orderBy: { order: 'asc' },
      take: 12,
    }),
    prisma.event.findMany({
      where: { published: true, status: 'UPCOMING' },
      orderBy: { eventDate: 'asc' },
      take: 4,
    }),
    prisma.award.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { year: 'desc' }],
      take: 4,
    }),
    prisma.pressItem.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      take: 3,
    }),
    prisma.eventType.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
    prisma.programLocation.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
    prisma.testimonial.findMany({
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
        <HomePageClient
          settings={settings}
          bio={bio}
          featuredMusic={featuredMusic}
          featuredVideo={featuredVideo}
          popularVideos={popularVideos}
          popularTracks={popularTracks}
          highlightImages={highlightImages}
          upcomingEvents={upcomingEvents}
          awards={awards}
          pressItems={pressItems}
          eventTypes={eventTypes}
          programLocations={programLocations}
          testimonials={testimonials}
        />
      </main>
      <Footer settings={settings || undefined} />
    </>
  );
}
