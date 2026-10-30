import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getSessionAdmin, signToken, logAudit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionAdmin();
    if (!session) {
      return NextResponse.json(
        { error: 'अनधिकृत। कृपया पहले लॉगिन करें। (Unauthorized. Please login again.)' },
        { status: 401 }
      );
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'अमान्य डेटा प्रारूप। (Invalid JSON body received)' },
        { status: 400 }
      );
    }

    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'कृपया अपना वर्तमान पासवर्ड दर्ज करें। (Current password is required.)' },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए। (New password must be at least 6 characters.)' },
        { status: 400 }
      );
    }

    // Find admin user in database
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.userId },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'एडमिन खाता नहीं मिला। (Admin user not found.)' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: 'वर्तमान पासवर्ड गलत है। कृपया सही पासवर्ड दर्ज करें। (Current password is incorrect.)' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: { passwordHash: string; username?: string } = {
      passwordHash: await bcrypt.hash(newPassword, 10),
    };

    const trimmedUsername = (newUsername || '').trim();
    if (trimmedUsername && trimmedUsername !== admin.username) {
      if (trimmedUsername.length < 3) {
        return NextResponse.json(
          { error: 'यूज़रनेम कम से कम 3 अक्षरों का होना चाहिए। (Username must be at least 3 characters.)' },
          { status: 400 }
        );
      }

      // Check if username is already taken
      const existing = await prisma.adminUser.findUnique({
        where: { username: trimmedUsername },
      });

      if (existing && existing.id !== admin.id) {
        return NextResponse.json(
          { error: 'यह यूज़रनेम पहले से उपयोग में है। कृपया कोई दूसरा यूज़रनेम चुनें। (Username is already taken.)' },
          { status: 400 }
        );
      }

      updateData.username = trimmedUsername;
    }

    // Update in DB
    const updated = await prisma.adminUser.update({
      where: { id: admin.id },
      data: updateData,
    });

    // Create fresh JWT token
    const token = signToken({
      userId: updated.id,
      username: updated.username,
      role: updated.role,
    });

    // Log security audit
    await logAudit(
      'SECURITY_UPDATE',
      'AdminUser',
      updated.id,
      `Admin credentials updated by ${session.username} (Username: ${updated.username})`,
      updated.username
    );

    const isHttps =
      process.env.NODE_ENV === 'production' ||
      req.headers.get('x-forwarded-proto') === 'https' ||
      req.nextUrl.protocol === 'https:';

    const response = NextResponse.json({
      success: true,
      message: 'एडमिन पासवर्ड एवं सुरक्षा सेटिंग्स सफलतापूर्वक अपडेट हो गई हैं! (Credentials updated successfully.)',
      token,
      user: {
        id: updated.id,
        username: updated.username,
        name: updated.name,
        role: updated.role,
      },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('Password change error:', err);
    return NextResponse.json(
      { error: err.message || 'पासवर्ड बदलने में त्रुटि हुई। (Failed to change password)' },
      { status: 500 }
    );
  }
}
