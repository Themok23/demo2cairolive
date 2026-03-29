export const locales = ['en', 'ar', 'fr'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export function isValidLocale(locale: unknown): locale is Locale {
  return typeof locale === 'string' && locales.includes(locale as Locale);
}
