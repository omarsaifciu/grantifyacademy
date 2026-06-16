import { SUPPORTED_LOCALES } from '@/lib/utils'
import { getLocalizedCategorySlug } from './slug'

const SITEMAP_MAX_URLS = 50000
const SITEMAP_MAX_SIZE_MB = 50

export function getSitemapDate() {
  return new Date().toISOString()
}

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function generateSitemapIndex(sitemapEntries) {
  const date = getSitemapDate()
  const entries = sitemapEntries.map(entry => `
  <sitemap>
    <loc>${xmlEscape(entry.loc)}</loc>
    <lastmod>${entry.lastmod || date}</lastmod>
  </sitemap>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`
}

export function generateLanguageSitemap(urls, lang) {
  const date = getSitemapDate()

  const urlEntries = urls.map(url => {
    const hreflangTags = SUPPORTED_LOCALES.map(l => {
      const altUrl = url.hreflangUrls?.[l] || url.loc.replace(`/${lang}/`, `/${l}/`)
      return `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(altUrl)}" />`
    }).join('\n')

    const xDefaultUrl = url.hreflangUrls?.xdefault || url.loc.replace(`/${lang}/`, '/en/')

    return `  <url>
    <loc>${xmlEscape(url.loc)}</loc>
    <lastmod>${url.lastmod || date}</lastmod>
    <changefreq>${url.changefreq || 'weekly'}</changefreq>
    <priority>${url.priority || '0.8'}</priority>
${hreflangTags}
    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(xDefaultUrl)}" />
  </url>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`
}

export function generateAllSitemaps(allPages) {
  const sitemaps = []
  const date = getSitemapDate()
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://grantifyacademy.com'

  for (const lang of SUPPORTED_LOCALES) {
    const langPages = allPages.filter(p => p.lang === lang)
    const chunks = []

    for (let i = 0; i < langPages.length; i += SITEMAP_MAX_URLS) {
      chunks.push(langPages.slice(i, i + SITEMAP_MAX_URLS))
    }

    if (chunks.length === 0) {
      const sitemapFile = `sitemap-${lang}.xml`
      sitemaps.push({
        loc: `${siteUrl}/${sitemapFile}`,
        lastmod: date,
        lang,
        file: sitemapFile,
        urlCount: 0,
      })
      continue
    }

    chunks.forEach((chunk, idx) => {
      const suffix = chunks.length > 1 ? `-${idx + 1}` : ''
      const sitemapFile = `sitemap-${lang}${suffix}.xml`
      sitemaps.push({
        loc: `${siteUrl}/${sitemapFile}`,
        lastmod: date,
        lang,
        file: sitemapFile,
        urlCount: chunk.length,
      })
    })
  }

  return sitemaps
}

export function buildPageUrls(items, lang, pageType) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://grantifyacademy.com'
  const category = pageType === 'blog' ? getLocalizedCategorySlug('blog', lang)
    : pageType === 'university' ? getLocalizedCategorySlug('universities', lang)
    : getLocalizedCategorySlug('scholarships', lang)

  return items.map(item => {
    const slug = item.slug || item.id
    const loc = `${siteUrl}/${lang}/${category}/${slug}`

    const hreflangUrls = {}
    for (const l of SUPPORTED_LOCALES) {
      const cat = getLocalizedCategorySlug(
        pageType === 'blog' ? 'blog' : pageType === 'university' ? 'universities' : 'scholarships',
        l
      )
      hreflangUrls[l] = `${siteUrl}/${l}/${cat}/${slug}`
    }

    return {
      loc,
      lastmod: item.updated_at || item.created_at || getSitemapDate(),
      changefreq: 'weekly',
      priority: '0.8',
      hreflangUrls,
    }
  })
}
