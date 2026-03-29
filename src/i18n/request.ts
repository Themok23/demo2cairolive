import { getRequestConfig } from 'next-intl/server';
import { isValidLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  if (!isValidLocale(locale)) {
    throw new Error(`Unknown locale: ${locale}`);
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
