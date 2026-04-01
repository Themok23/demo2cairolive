import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

const intlMiddleware = createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale: defaultLocale,
  localePrefix: 'as-needed',
});

const ACCESS_COOKIE = 'cairo-access-auth';

// Paths that bypass the access gate entirely
function isExemptFromAccessGate(pathname: string): boolean {
  return (
    pathname === '/access' ||
    pathname.startsWith('/api/access') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    /\.[^/]+$/.test(pathname)
  );
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Paths that should be processed by next-intl for locale routing
function shouldRunIntl(pathname: string): boolean {
  return (
    pathname === '/' ||
    /^\/(en|ar|fr)(\/.*)?$/.test(pathname) ||
    (!pathname.startsWith('/api') &&
      !pathname.startsWith('/admin') &&
      !pathname.startsWith('/dashboard') &&
      !pathname.startsWith('/access') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/_vercel') &&
      !/\.[^/]+$/.test(pathname))
  );
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Step 1: Access gate — redirect unauthenticated visitors to /access
  if (!isExemptFromAccessGate(pathname)) {
    const accessCookie = request.cookies.get(ACCESS_COOKIE);
    const rawPassword = process.env.ADMIN_DASHBOARD_PASSWORD || '';
    const expectedToken = await hashPassword(rawPassword);

    if (!accessCookie || accessCookie.value !== expectedToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/access';
      if (pathname !== '/') {
        url.searchParams.set('from', pathname);
      }
      return NextResponse.redirect(url);
    }
  }

  // Step 2: Run next-intl middleware for locale-aware routes
  if (shouldRunIntl(pathname)) {
    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
};
