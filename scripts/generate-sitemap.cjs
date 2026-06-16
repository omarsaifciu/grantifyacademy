/**
 * Grantify Academy - Sitemap Generator (CommonJS version)
 * Run: node scripts/generate-sitemap.cjs
 */
const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public')
const SITE_URL = process.env.VITE_SITE_URL || 'https://grantifyacademy.com'

const SUPPORTED_LOCALES = [
  'en', 'zh', 'es', 'ar', 'hi', 'fr', 'bn', 'pt', 'ru', 'ja',
  'de', 'ko', 'tr', 'vi', 'it', 'th', 'fa', 'sw', 'id', 'nl',
]

function getDate() {
  return new Date().toISOString().split('T')[0]
}

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function generateSitemaps() {
  const date = getDate()
  const sitemapIndex = []
  const urlCounts = {}

  for (const lang of SUPPORTED_LOCALES) {
    const urls = []

    urls.push({
      loc: `${SITE_URL}/${lang}/`,
      lastmod: date,
      changefreq: 'daily',
      priority: '1.0',
    })

    urls.push({
      loc: `${SITE_URL}/${lang}/scholarships`,
      lastmod: date,
      changefreq: 'weekly',
      priority: '0.9',
    })

    urls.push({
      loc: `${SITE_URL}/${lang}/universities`,
      lastmod: date,
      changefreq: 'weekly',
      priority: '0.9',
    })

    urls.push({
      loc: `${SITE_URL}/${lang}/blog`,
      lastmod: date,
      changefreq: 'weekly',
      priority: '0.8',
    })

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
  const pathParts = url.loc.replace(SITE_URL, '').split('/').filter(Boolean)
  const altLoc = `${SITE_URL}/${l}/${pathParts.slice(1).join('/')}`
  return `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(altLoc)}" />`
}).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(urls[0].loc.replace(`/${lang}/`, '/en/'))}" />
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
