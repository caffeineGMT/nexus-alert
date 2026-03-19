'use client';

import { useEffect, useState } from 'react';
import en from '@/messages/en.json';
import es from '@/messages/es.json';
import fr from '@/messages/fr.json';

type Messages = typeof en;

const messages: Record<string, Messages> = {
  en,
  es,
  fr,
};

export function useTranslations(namespace?: string) {
  const [locale, setLocale] = useState<string>('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get locale from localStorage or browser language
    const savedLocale = localStorage.getItem('locale');
    const browserLang = navigator.language.split('-')[0];
    const defaultLocale = savedLocale || (browserLang in messages ? browserLang : 'en');
    setLocale(defaultLocale);
    localStorage.setItem('locale', defaultLocale);
  }, []);

  const t = (key: string): string => {
    if (!isClient) return key;

    const keys = key.split('.');
    let value: any = messages[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, locale, setLocale };
}

export function getLocale(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('locale') || 'en';
  }
  return 'en';
}

export function setLocale(locale: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale);
    window.location.reload(); // Reload to apply new locale
  }
}
