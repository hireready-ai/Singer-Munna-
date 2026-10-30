import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const bio = await prisma.biography.findUnique({
    where: { id: 'default' },
  });
  return NextResponse.json(bio || {});
}

export async function PUT(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please login again.' }, { status: 401 });
  }

  try {
    const data = await req.json();
    delete data.id;
    delete data.updatedAt;

    const updated = await prisma.biography.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        introduction: data.introduction || '',
        introductionHi: data.introductionHi || '',
        fullBio: data.fullBio || '',
        fullBioHi: data.fullBioHi || '',
        musicalJourney: data.musicalJourney || '',
        musicalJourneyHi: data.musicalJourneyHi || '',
        musicalStyles: data.musicalStyles || '',
        musicalStylesHi: data.musicalStylesHi || '',
        portraitImage: data.portraitImage || '/images/munna_nirala_portrait.jpg',
        ...data,
      },
    });

    await logAudit('UPDATE', 'Biography', 'default', 'Updated biography details', session.username);
    return NextResponse.json({ success: true, biography: updated });
  } catch (err: any) {
    console.error('Error updating biography:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
