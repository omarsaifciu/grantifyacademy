import { SUPPORTED_LOCALES } from '@/lib/utils'

const DIACRITICS_MAP = {
  'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
  'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
  'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
  'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o',
  'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
  'ý': 'y', 'ÿ': 'y',
  'ç': 'c', 'ñ': 'n', 'š': 's', 'ž': 'z',
  'à': 'A', 'á': 'A', 'â': 'A', 'ã': 'A', 'ä': 'A', 'å': 'A',
  'è': 'E', 'é': 'E', 'ê': 'E', 'ë': 'E',
  'ì': 'I', 'í': 'I', 'î': 'I', 'ï': 'I',
  'ò': 'O', 'ó': 'O', 'ô': 'O', 'õ': 'O', 'ö': 'O', 'ø': 'O',
  'ù': 'U', 'ú': 'U', 'û': 'U', 'ü': 'U',
  'ý': 'Y', 'ÿ': 'Y',
  'ç': 'C', 'ñ': 'N', 'š': 'S', 'ž': 'Z',
}

const NON_LATIN_SCRIPTS = new Set(['ar', 'zh', 'ja', 'ko', 'hi', 'bn', 'th', 'fa', 'ru', 'sw', 'vi'])

function removeDiacritics(str) {
  return str.split('').map(ch => DIACRITICS_MAP[ch] || ch).join('')
}

function isNonLatinScript(lang) {
  return NON_LATIN_SCRIPTS.has(lang)
}

export function generateLocalizedSlug(title, lang) {
  if (!title) return ''
  let slug = title.trim()

  if (isNonLatinScript(lang)) {
    slug = slug
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\s\u0600-\u06FF\u0400-\u04FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\u0900-\u097F\u0980-\u09FF\u0E00-\u0E7F\uFB50-\uFDFF\uFE70-\uFEFF-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '')
  } else {
    slug = removeDiacritics(slug)
    slug = slug
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  return slug
}

export const CATEGORY_SLUGS = {
  en: { scholarships: 'scholarships', universities: 'universities', blog: 'blog' },
  ar: { scholarships: 'منح', universities: 'جامعات', blog: 'مدونة' },
  es: { scholarships: 'becas', universities: 'universidades', blog: 'blog' },
  fr: { scholarships: 'bourses', universities: 'universites', blog: 'blog' },
  pt: { scholarships: 'bolsas', universities: 'universidades', blog: 'blog' },
  ru: { scholarships: 'stipendii', universities: 'universitety', blog: 'blog' },
  de: { scholarships: 'stipendien', universities: 'universitaeten', blog: 'blog' },
  zh: { scholarships: '奖学金', universities: '大学', blog: '博客' },
  hi: { scholarships: 'छात्रवृत्तियां', universities: 'विश्वविद्यालय', blog: 'ब्लॉग' },
  ja: { scholarships: '奨学金', universities: '大学', blog: 'ブログ' },
  ko: { scholarships: '장학금', universities: '대학', blog: '블로그' },
  tr: { scholarships: 'burslar', universities: 'universiteler', blog: 'blog' },
  vi: { scholarships: 'hoc-bong', universities: 'truong-dai-hoc', blog: 'blog' },
  it: { scholarships: 'borse-di-studio', universities: 'universita', blog: 'blog' },
  th: { scholarships: 'ทุนการศึกษา', universities: 'มหาวิทยาลัย', blog: 'บล็อก' },
  fa: { scholarships: 'بورسیه‌ها', universities: 'دانشگاه‌ها', blog: 'وبلاگ' },
  sw: { scholarships: 'masomo', universities: 'vyuo', blog: 'blogu' },
  id: { scholarships: 'beasiswa', universities: 'universitas', blog: 'blog' },
  nl: { scholarships: 'beurzen', universities: 'universiteiten', blog: 'blog' },
  bn: { scholarships: 'স্কলারশিপ', universities: 'বিশ্ববিদ্যালয়', blog: 'ব্লগ' },
}

export function getLocalizedCategorySlug(category, lang) {
  const langSlugs = CATEGORY_SLUGS[lang] || CATEGORY_SLUGS.en
  return langSlugs[category] || category
}

export function resolveCategoryFromSlug(localizedSlug, lang) {
  const langSlugs = CATEGORY_SLUGS[lang] || CATEGORY_SLUGS.en
  for (const [category, slug] of Object.entries(langSlugs)) {
    if (slug === localizedSlug) return category
  }
  return localizedSlug
}

export function buildLocalizedUrl(lang, category, slug) {
  const catSlug = getLocalizedCategorySlug(category, lang)
  return `/${lang}/${catSlug}/${slug}`
}
