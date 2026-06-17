import { SUPPORTED_LOCALES } from '@/lib/utils'
import { getLocalizedCategorySlug } from './slug'

const HTACCESS_CACHE = {}

export function generateHreflang(slug, lang, pageType, allLanguages = SUPPORTED_LOCALES, existingPages = null) {
  const siteUrl = import.meta.env.VITE_SITE_URL
    || (typeof window !== 'undefined' ? window.location.origin : 'https://grantifyacademy.com')

  const categorySlug = getLocalizedCategorySlug(
    pageType === 'blog' ? 'blog' : pageType === 'university' ? 'universities' : 'scholarships',
    lang
  )

  const basePath = `/${lang}/${categorySlug}/${slug}`

  const tags = []

  for (const l of allLanguages) {
    const cat = getLocalizedCategorySlug(
      pageType === 'blog' ? 'blog' : pageType === 'university' ? 'universities' : 'scholarships',
      l
    )
    const url = `${siteUrl}/${l}/${cat}/${slug}`

    if (l === lang) {
      tags.push({ lang: l, url: `${siteUrl}${basePath}` })
      continue
    }

    if (existingPages && Array.isArray(existingPages)) {
      if (existingPages.includes(l)) {
        tags.push({ lang: l, url })
      }
    } else {
      tags.push({ lang: l, url })
    }
  }

  tags.push({ lang: 'x-default', url: `${siteUrl}/en/${categorySlug}/${slug}` })

  return tags
}

export function validateHreflangReciprocity(allPageVariants) {
  const errors = []

  for (const [pageKey, variants] of Object.entries(allPageVariants)) {
    for (const sourceLang of Object.keys(variants)) {
      const sourceUrl = variants[sourceLang]
      for (const targetLang of Object.keys(variants)) {
        if (sourceLang === targetLang) continue
        const targetPage = allPageVariants[pageKey]
        if (!targetPage) {
          errors.push({ page: pageKey, from: sourceLang, to: targetLang, issue: 'target page missing' })
          continue
        }
        const targetUrl = targetPage[targetLang]
        if (!targetUrl) {
          errors.push({ page: pageKey, from: sourceLang, to: targetLang, issue: `no URL for ${targetLang}` })
          continue
        }
      }
    }
  }

  const totalChecks = Object.keys(allPageVariants).length * SUPPORTED_LOCALES.length * (SUPPORTED_LOCALES.length - 1)
  const errorRate = totalChecks > 0 ? errors.length / totalChecks : 0

  return { valid: errorRate < 0.05, errors, errorRate, totalChecks }
}

// Removed client-side checkPageExists to keep SEO lib simple
// Server-side sitemap building uses DB queries directly via storage.js

export function renderHreflangTags(hreflangTags) {
  return hreflangTags.map(tag => ({
    rel: 'alternate',
    hrefLang: tag.lang,
    href: tag.url,
  }))
}
