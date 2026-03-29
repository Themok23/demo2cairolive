import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

function getAdminPassword(): string {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_DASHBOARD_PASSWORD environment variable is not set');
  }
  return password;
}

function hashPassword(pw: string): string {
  return createHash('sha256').update(pw).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const adminPassword = getAdminPassword();
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password required' },
        { status: 400 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = hashPassword(adminPassword);
    const response = NextResponse.json({ success: true });

    // Set auth cookie - 7 day expiry
    response.cookies.set('cairo-admin-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// Verify auth - used by other API routes
export async function GET(request: NextRequest) {
  try {
    const adminPassword = getAdminPassword();
    const token = hashPassword(adminPassword);
    const cookie = request.cookies.get('cairo-admin-auth');

    if (cookie?.value === token) {
      return NextResponse.json({ success: true, authenticated: true });
    }

    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
