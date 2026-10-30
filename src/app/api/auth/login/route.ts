import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, logAudit } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({
      userId: admin.id,
      username: admin.username,
      role: admin.role,
    });

    await logAudit('LOGIN', 'AdminUser', admin.id, `User ${admin.username} logged in`, admin.username);

    const response = NextResponse.json({
      success: true,
      user: { id: admin.id, username: admin.username, name: admin.name, role: admin.role },
      token,
    });

    const isHttps = req.nextUrl.protocol === 'https:';

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
