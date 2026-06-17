/**
 * Grantify Academy - Sitemap Generator
 * Run: node scripts/generate-sitemap.js
 * Generates per-language sitemaps and a master sitemap index in the public/ directory.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getScholarships, getUniversities, getBlogPosts } from '../src/lib/storage.js'
import { getLocalizedCategorySlug, generateLocalizedSlug } from '../src/lib/seo/slug.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public')
const SITE_URL = process.env.VITE_SITE_URL || 'https://grantifyacademy.com'

const SUPPORTED_LOCALES = [
  'en', 'zh', 'es', 'ar', 'hi', 'fr', 'bn', 'pt', 'ru', 'ja',
  'de', 'ko', 'tr', 'vi', 'it', 'th', 'fa', 'sw', 'id', 'nl',
]

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

    // Add real content pages from the database
    try {
      if (category === 'scholarships') {
        const scholarships = await getScholarships()
        for (const scholarship of scholarships) {
          const slug = scholarship.slug || generateLocalizedSlug(scholarship.title || scholarship.translations?.[lang]?.title || '', lang)
          const detailUrl = `${SITE_URL}/${lang}/${getLocalizedCategorySlug('scholarships', lang)}/${slug}`
          urls.push({
            loc: detailUrl,
            lastmod: scholarship.updated_at || scholarship.created_at || date,
            changefreq: 'weekly',
            priority: '0.8',
          })
        }
      } else if (category === 'universities') {
        const universities = await getUniversities()
        for (const university of universities) {
          const slug = university.slug || generateLocalizedSlug(university.name || university.translations?.[lang]?.name || '', lang)
          const detailUrl = `${SITE_URL}/${lang}/${getLocalizedCategorySlug('universities', lang)}/${slug}`
          urls.push({
            loc: detailUrl,
            lastmod: university.updated_at || university.created_at || date,
            changefreq: 'weekly',
            priority: '0.8',
          })
        }
      } else if (category === 'blog') {
        const blogPosts = await getBlogPosts()
        for (const post of blogPosts) {
          const slug = post.slug || generateLocalizedSlug(post.title || post.translations?.[lang]?.title || '', lang)
          const detailUrl = `${SITE_URL}/${lang}/${getLocalizedCategorySlug('blog', lang)}/${slug}`
          urls.push({
            loc: detailUrl,
            lastmod: post.updated_at || post.created_at || date,
            changefreq: 'weekly',
            priority: '0.7',
          })
        }
      }
    } catch (error) {
      console.error(`Error fetching ${category} for sitemap ${lang}:`, error)
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
  const altUrl = url.loc.replace(`/${lang}/`, `/${l}/`)
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
