import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const force = searchParams.get('force') === 'true';

  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    const fileUrl = asset.fileUrl;

    // Check usage across all tables
    const usages: string[] = [];

    const settingsMatch = await prisma.siteSettings.findFirst({
      where: {
        OR: [{ heroImage: fileUrl }, { heroVideo: fileUrl }],
      },
    });
    if (settingsMatch) usages.push('Site Settings / Hero Banner');

    const bioMatch = await prisma.biography.findFirst({
      where: {
        OR: [{ portraitImage: fileUrl }, { pressKitUrl: fileUrl }],
      },
    });
    if (bioMatch) usages.push('Biography / About Page Portrait');

    const musicMatches = await prisma.musicTrack.findMany({
      where: {
        OR: [{ coverImage: fileUrl }, { audioUrl: fileUrl }],
      },
    });
    if (musicMatches.length > 0) {
      usages.push(`Music Tracks (${musicMatches.map((m) => m.title).join(', ')})`);
    }

    const videoMatches = await prisma.video.findMany({
      where: {
        OR: [{ thumbnail: fileUrl }, { videoUrl: fileUrl }],
      },
    });
    if (videoMatches.length > 0) {
      usages.push(`Videos (${videoMatches.map((v) => v.title).join(', ')})`);
    }

    const galleryMatches = await prisma.galleryImage.findMany({
      where: { imageUrl: fileUrl },
    });
    if (galleryMatches.length > 0) {
      usages.push(`Gallery Images (${galleryMatches.map((g) => g.title).join(', ')})`);
    }

    const eventMatches = await prisma.event.findMany({
      where: { posterImage: fileUrl },
    });
    if (eventMatches.length > 0) {
      usages.push(`Events (${eventMatches.map((e) => e.title).join(', ')})`);
    }

    // If file is in use and not force-deleting, reject with usage details
    if (usages.length > 0 && !force) {
      return NextResponse.json(
        {
          error: 'This asset is currently in use. Deleting it may break website display.',
          inUse: true,
          usages,
        },
        { status: 409 }
      );
    }

    // Attempt physical deletion
    try {
      const diskPath = path.join(process.cwd(), 'public', fileUrl.replace(/^\//, ''));
      if (fs.existsSync(diskPath)) {
        fs.unlinkSync(diskPath);
      }
    } catch (diskErr) {
      console.warn('Could not remove file from disk:', diskErr);
    }

    await prisma.mediaAsset.delete({
      where: { id: params.id },
    });

    await logAudit(
      'DELETE',
      'MediaAsset',
      params.id,
      `Deleted media asset ${asset.title} (force=${force})`,
      session.username
    );

    return NextResponse.json({ success: true, message: 'Asset deleted safely' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

