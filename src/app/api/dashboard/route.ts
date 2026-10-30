import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [
      totalSongs,
      totalVideos,
      totalGallery,
      upcomingEvents,
      newBookings,
      totalBookings,
      totalEventTypes,
      totalLocations,
      totalTestimonials,
      recentEnquiries,
      recentLogs,
    ] = await Promise.all([
      prisma.musicTrack.count({ where: { published: true } }),
      prisma.video.count({ where: { published: true } }),
      prisma.galleryImage.count({ where: { published: true } }),
      prisma.event.count({ where: { status: 'UPCOMING', published: true } }),
      prisma.bookingEnquiry.count({ where: { status: 'NEW' } }),
      prisma.bookingEnquiry.count(),
      prisma.eventType.count({ where: { published: true } }),
      prisma.programLocation.count({ where: { published: true } }),
      prisma.testimonial.count({ where: { published: true } }),
      prisma.bookingEnquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      counts: {
        totalSongs,
        totalVideos,
        totalGallery,
        upcomingEvents,
        newBookings,
        totalBookings,
        totalEventTypes,
        totalLocations,
        totalTestimonials,
      },
      recentEnquiries,
      recentLogs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

