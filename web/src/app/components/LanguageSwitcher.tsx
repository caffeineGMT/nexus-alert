'use client';

import { useState, useEffect } from 'react';

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

const languageFlags: Record<string, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇨🇦',
};

const locales = ['en', 'es', 'fr'] as const;

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<string>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get locale from localStorage or browser language
    const savedLocale = localStorage.getItem('locale');
    const browserLang = navigator.language.split('-')[0];
    const defaultLocale = savedLocale || (locales.includes(browserLang as any) ? browserLang : 'en');
    setLocale(defaultLocale);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    localStorage.setItem('locale', newLocale);
    setLocale(newLocale);
    window.location.reload(); // Reload to apply new locale
  };

  if (!mounted) {
    // Return placeholder during SSR to avoid hydration mismatch
    return (
      <div className="w-[140px] h-[38px] bg-[#1a1a1a] border border-[#333] rounded-lg"></div>
    );
  }

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="appearance-none bg-[#1a1a1a] border border-[#333] text-[#ededed] rounded-lg px-3 py-2 pr-8 text-sm font-medium hover:border-[#444] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition cursor-pointer"
        aria-label="Select language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {languageFlags[loc]} {languageNames[loc]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#888]">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
