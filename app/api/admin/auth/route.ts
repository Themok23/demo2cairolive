import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD || '@123Cairolive@123';

function hashPassword(pw: string): string {
  return createHash('sha256').update(pw).digest('hex');
}

const TOKEN = hashPassword(ADMIN_PASSWORD);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password required' },
        { status: 400 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Set auth cookie - 7 day expiry
    response.cookies.set('cairo-admin-auth', TOKEN, {
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
  const cookie = request.cookies.get('cairo-admin-auth');

  if (cookie?.value === TOKEN) {
    return NextResponse.json({ success: true, authenticated: true });
  }

  return NextResponse.json(
    { success: false, authenticated: false },
    { status: 401 }
  );
}
