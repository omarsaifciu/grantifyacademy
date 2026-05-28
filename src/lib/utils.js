import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const SUPPORTED_LOCALES = [
  'en', // الإنجليزية
  'zh', // الصينية (الماندرين)
  'es', // الإسبانية
  'ar', // العربية
  'hi', // الهندية
  'fr', // الفرنسية
  'bn', // البنغالية
  'pt', // البرتغالية
  'ru', // الروسية
  'ja', // اليابانية
  'de', // الألمانية
  'ko', // الكورية
  'tr', // التركية
  'vi', // الفيتنامية
  'it', // الإيطالية
  'th', // التايلاندية
  'fa', // الفارسية
  'sw', // السواحيلية
  'id', // الإندونيسية
  'nl', // الهولندية
];

export const DEFAULT_LOCALE = 'ar';

export function isRtlLocale(locale) {
  return locale === 'ar' || locale === 'fa';
}

export function normalizeLocale(code) {
  const lower = (code || '').toLowerCase();
  if (SUPPORTED_LOCALES.includes(lower)) return lower;
  // map common regional variants to base language
  const map = {
    'zh-cn': 'zh', 'zh-hans': 'zh', 'zh-hant': 'zh',
    'en-us': 'en', 'en-gb': 'en',
    'pt-br': 'pt', 'pt-pt': 'pt',
  };
  return map[lower] || DEFAULT_LOCALE;
}

export function detectLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const saved = window.localStorage?.getItem('site_locale');
  if (saved) return normalizeLocale(saved);
  const fromNavigator = navigator.languages?.[0] || navigator.language || DEFAULT_LOCALE;
  const loc = normalizeLocale(fromNavigator);
  try { window.localStorage?.setItem('site_locale', loc) } catch {}
  return loc;
}

export function buildAlternateLinks(pathAfterLocale) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return SUPPORTED_LOCALES.map((loc) => ({
    href: `${origin}/${loc}/${pathAfterLocale || ''}`.replace(/\/$/, '/'),
    hreflang: loc,
  }));
}

export const LOCALE_LABELS = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  ar: 'العربية',
  hi: 'हिन्दी',
  fr: 'Français',
  bn: 'বাংলা',
  pt: 'Português',
  ru: 'Русский',
  ja: '日本語',
  de: 'Deutsch',
  ko: '한국어',
  tr: 'Türkçe',
  vi: 'Tiếng Việt',
  it: 'Italiano',
  th: 'ไทย',
  fa: 'فارسی',
  sw: 'Kiswahili',
  id: 'Bahasa Indonesia',
  nl: 'Nederlands',
};
