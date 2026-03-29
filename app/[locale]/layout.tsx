import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { isValidLocale } from '@/i18n/config';

type Props = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }, { locale: 'fr' }];
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  if (!isValidLocale(locale)) {
    throw new Error(`Unknown locale: ${locale}`);
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="font-body bg-background text-text-primary antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
