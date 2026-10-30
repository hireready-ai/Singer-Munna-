import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
};

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string[] } }
) {
  try {
    const rawFilename = (params.filename || []).join('/');
    const decodedFilename = decodeURIComponent(rawFilename);
    const safeFilename = path.normalize(decodedFilename).replace(/^(\.\.[\/\\])+/, '');

    const possiblePaths = [
      path.join(process.cwd(), 'public', 'images', safeFilename),
      path.join(process.cwd(), 'public', 'uploads', safeFilename),
      path.join(process.cwd(), 'public', safeFilename),
    ];

    let targetPath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        targetPath = p;
        break;
      }
    }

    if (!targetPath) {
      return new NextResponse('File not found', { status: 404 });
    }

    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(targetPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

