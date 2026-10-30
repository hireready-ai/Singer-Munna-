import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

function getUploadDirectory(): { dir: string; isReadOnly: boolean } {
  // If running on Vercel or serverless, use /tmp/uploads
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDir = path.join('/tmp', 'uploads');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return { dir: tmpDir, isReadOnly: true };
  }

  // Otherwise, try standard public/uploads
  const defaultDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    if (!fs.existsSync(defaultDir)) {
      fs.mkdirSync(defaultDir, { recursive: true });
    }
    const testFile = path.join(defaultDir, `.test_${Date.now()}`);
    fs.writeFileSync(testFile, '1');
    fs.unlinkSync(testFile);
    return { dir: defaultDir, isReadOnly: false };
  } catch (err) {
    // If permission denied or read-only filesystem, fallback to /tmp/uploads
    const tmpDir = path.join('/tmp', 'uploads');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return { dir: tmpDir, isReadOnly: true };
  }
}

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

    const { dir: uploadDir, isReadOnly } = getUploadDirectory();
    const results: any[] = [];

    for (const file of filesToProcess) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name).toLowerCase();
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Always write to disk (either public/uploads or /tmp/uploads)
      try {
        const filePath = path.join(uploadDir, safeName);
        fs.writeFileSync(filePath, buffer);
      } catch (writeErr) {
        console.warn('File disk write warning:', writeErr);
      }

      let fileType = 'IMAGE';
      if (ext.match(/\.(mp3|wav|ogg|m4a|aac)$/)) fileType = 'AUDIO';
      else if (ext.match(/\.(mp4|webm|mov|mkv)$/)) fileType = 'VIDEO';
      else if (ext.match(/\.(pdf|doc|docx)$/)) fileType = 'DOCUMENT';

      // On serverless/read-only filesystem (Vercel), store images as self-contained Data URLs
      // so they display immediately without depending on serverless ephemeral disks.
      let fileUrl = `/uploads/${safeName}`;
      if (isReadOnly && fileType === 'IMAGE' && buffer.length <= 4 * 1024 * 1024) {
        let mime = 'image/jpeg';
        if (ext === '.png') mime = 'image/png';
        else if (ext === '.webp') mime = 'image/webp';
        else if (ext === '.svg') mime = 'image/svg+xml';
        else if (ext === '.gif') mime = 'image/gif';
        fileUrl = `data:${mime};base64,${buffer.toString('base64')}`;
      }

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
        assets: results,
      });
    }

    return NextResponse.json({
      success: true,
      fileUrl: results[0]?.fileUrl || '',
      assets: results,
      count: results.length,
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
