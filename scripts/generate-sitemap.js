/**
 * Grantify Academy - Sitemap Generator
 * Run: node scripts/generate-sitemap.js
 * Generates per-language sitemaps and a master sitemap index in the public/ directory.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public')
const SITE_URL = process.env.VITE_SITE_URL || 'https://grantifyacademy.com'

const SUPPORTED_LOCALES = [
  'en', 'zh', 'es', 'ar', 'hi', 'fr', 'bn', 'pt', 'ru', 'ja',
  'de', 'ko', 'tr', 'vi', 'it', 'th', 'fa', 'sw', 'id', 'nl',
]

const CATEGORY_SLUGS = {
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

function getLocalizedCategorySlug(category, lang) {
  const langSlugs = CATEGORY_SLUGS[lang] || CATEGORY_SLUGS.en
  return langSlugs[category] || category
}

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getDate() {
  return new Date().toISOString().split('T')[0]
}

async function generateSitemaps() {
  const date = getDate()
  const sitemapIndex = []
  const urlCounts = {}

  for (const lang of SUPPORTED_LOCALES) {
    const urls = []

    const homepageUrl = `${SITE_URL}/${lang}/`
    urls.push({
      loc: homepageUrl,
      lastmod: date,
      changefreq: 'daily',
      priority: '1.0',
    })

    for (const category of ['scholarships', 'universities', 'blog']) {
      const catSlug = getLocalizedCategorySlug(category, lang)
      const listUrl = `${SITE_URL}/${lang}/${catSlug}`
      urls.push({
        loc: listUrl,
        lastmod: date,
        changefreq: 'weekly',
        priority: '0.9',
      })
    }

    if (urls.length > 0) {
      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${xmlEscape(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${SUPPORTED_LOCALES.map(l => {
  const altCategory = url.loc.split('/').slice(4).join('/')
  const altUrl = l === lang
    ? url.loc
    : `${SITE_URL}/${l}/${altCategory}`
  return `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(altUrl)}" />`
}).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(urls[0].loc)}" />
  </url>`).join('\n')}
</urlset>`

      const filename = `sitemap-${lang}.xml`
      fs.writeFileSync(path.join(PUBLIC_DIR, filename), sitemapContent, 'utf-8')
      console.log(`Generated ${filename} with ${urls.length} URLs`)

      sitemapIndex.push({
        loc: `${SITE_URL}/${filename}`,
        lastmod: date,
      })
      urlCounts[lang] = urls.length
    }
  }

  const indexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapIndex.map(entry => `  <sitemap>
    <loc>${xmlEscape(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), indexContent, 'utf-8')
  console.log('\nGenerated sitemap.xml (master index)')
  console.log('\nURL counts per language:')
  for (const [lang, count] of Object.entries(urlCounts)) {
    console.log(`  ${lang}: ${count} URLs`)
  }
  console.log(`\nTotal URLs: ${Object.values(urlCounts).reduce((a, b) => a + b, 0)}`)
}

generateSitemaps().catch(console.error)
