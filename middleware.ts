import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

export default createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale: defaultLocale,
});

export const config = {
  matcher: [
    '/',
    '/(en|ar|fr)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
