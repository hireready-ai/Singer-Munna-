import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  const where: any = {};
  if (type) where.fileType = type;

  const assets = await prisma.mediaAsset.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(assets);
}

export async function POST(req: NextRequest) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'Uploads';
    const altText = (formData.get('altText') as string) || '';

    const filesToProcess: File[] = [];
    if (files && files.length > 0) {
      filesToProcess.push(...files);
    } else if (singleFile) {
      filesToProcess.push(singleFile);
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const results: any[] = [];

    for (const file of filesToProcess) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name).toLowerCase();
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, buffer);

      let fileType = 'IMAGE';
      if (ext.match(/\.(mp3|wav|ogg|m4a|aac)$/)) fileType = 'AUDIO';
      else if (ext.match(/\.(mp4|webm|mov|mkv)$/)) fileType = 'VIDEO';
      else if (ext.match(/\.(pdf|doc|docx)$/)) fileType = 'DOCUMENT';

      const fileUrl = `/uploads/${safeName}`;

      const asset = await prisma.mediaAsset.create({
        data: {
          title: file.name,
          filename: safeName,
          fileUrl,
          fileType,
          fileSize: buffer.length,
          category,
          altText,
          usedIn: '',
        },
      });

      await logAudit(
        'UPLOAD',
        'MediaAsset',
        asset.id,
        `Uploaded ${fileType} asset: ${file.name}`,
        session.username
      );

      results.push({
        ...asset,
        url: fileUrl,
      });
    }

    if (results.length === 1) {
      return NextResponse.json({
        success: true,
        ...results[0],
        fileUrl: results[0].fileUrl,
      });
    }

    return NextResponse.json({
      success: true,
      assets: results,
      count: results.length,
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
