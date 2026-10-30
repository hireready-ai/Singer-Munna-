import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, logAudit } from '@/lib/auth';

// In-memory brute-force protection
const failedAttemptsMap = new Map<string, { count: number; lockedUntil: number }>();

function getClientIdentifier(req: NextRequest, username: string): string {
  const ip =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous';
  return `${ip}:${username.toLowerCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'अमान्य डेटा प्रारूप। (Invalid JSON body received)' },
        { status: 400 }
      );
    }

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'यूज़रनेम और पासवर्ड दोनों आवश्यक हैं। (Username and password are required)' },
        { status: 400 }
      );
    }

    const trimmedUsername = String(username).trim();
    const clientKey = getClientIdentifier(req, trimmedUsername);
    const now = Date.now();

    // Check brute-force lock
    const attemptInfo = failedAttemptsMap.get(clientKey);
    if (attemptInfo && attemptInfo.lockedUntil > now) {
      const waitSeconds = Math.ceil((attemptInfo.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          error: `बहुत अधिक गलत प्रयास हुए हैं। कृपया सुरक्षा कारणों से ${waitSeconds} सेकंड बाद पुनः प्रयास करें। (Too many attempts. Please wait.)`,
        },
        { status: 429 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username: trimmedUsername },
    });

    if (!admin) {
      // Record failed attempt
      const current = failedAttemptsMap.get(clientKey) || { count: 0, lockedUntil: 0 };
      current.count += 1;
      if (current.count >= 5) {
        current.lockedUntil = now + 5 * 60 * 1000; // 5 min lock
      }
      failedAttemptsMap.set(clientKey, current);

      await logAudit(
        'FAILED_LOGIN',
        'AdminUser',
        undefined,
        `Failed login attempt for nonexistent user "${trimmedUsername}"`,
        trimmedUsername
      );

      return NextResponse.json(
        { error: 'गलत यूज़रनेम या पासवर्ड। कृपया पुनः जाँचें। (Invalid username or password)' },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      // Record failed attempt
      const current = failedAttemptsMap.get(clientKey) || { count: 0, lockedUntil: 0 };
      current.count += 1;
      if (current.count >= 5) {
        current.lockedUntil = now + 5 * 60 * 1000; // 5 min lock
      }
      failedAttemptsMap.set(clientKey, current);

      await logAudit(
        'FAILED_LOGIN',
        'AdminUser',
        admin.id,
        `Failed password attempt for user "${admin.username}"`,
        admin.username
      );

      return NextResponse.json(
        { error: 'गलत यूज़रनेम या पासवर्ड। कृपया पुनः जाँचें। (Invalid username or password)' },
        { status: 401 }
      );
    }

    // Login successful: reset failed attempts
    failedAttemptsMap.delete(clientKey);

    const token = signToken({
      userId: admin.id,
      username: admin.username,
      role: admin.role,
    });

    await logAudit('LOGIN', 'AdminUser', admin.id, `User ${admin.username} logged in successfully`, admin.username);

    const response = NextResponse.json({
      success: true,
      user: { id: admin.id, username: admin.username, name: admin.name, role: admin.role },
      token,
    });

    const isHttps =
      process.env.NODE_ENV === 'production' ||
      req.headers.get('x-forwarded-proto') === 'https' ||
      req.nextUrl.protocol === 'https:';

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
