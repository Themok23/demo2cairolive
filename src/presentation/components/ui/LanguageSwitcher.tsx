'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇪🇬' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);

    if (newLocale === locale) {
      return;
    }

    startTransition(() => {
      // Remove locale prefix from pathname
      let newPathname = pathname;
      if (pathname.startsWith(`/${locale}`)) {
        newPathname = pathname.slice(locale.length + 1);
      }

      // If pathname is just "/" or empty, keep it as "/"
      if (!newPathname || newPathname === '') {
        newPathname = '/';
      }

      // Navigate to the new locale (next-intl middleware will handle adding locale prefix)
      router.replace(`/${newLocale}${newPathname}`);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-muted bg-surface hover:bg-surface-hover transition-colors"
        aria-label="Switch language"
        disabled={isPending}
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline text-sm font-medium text-text-primary">
          {currentLanguage?.code.toUpperCase()}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-muted rounded-lg shadow-lg z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-colors ${
                  locale === language.code
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-text-primary hover:bg-muted'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
