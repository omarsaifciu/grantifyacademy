import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { generateHreflang, renderHreflangTags } from '@/lib/seo/hreflang'
import { generateSchemaByType, generateListingSchema } from '@/lib/seo/jsonld'

export default function SEOMetadata({ page, lang, pageType, slug, existingLanguages, items }) {
  const seo = useMemo(() => {
    if (!page) return null
    return generateSEOMetadata(page, lang, pageType, slug)
  }, [page, lang, pageType, slug])

  const hreflangTags = useMemo(() => {
    if (!slug) return []
    return generateHreflang(slug, lang, pageType, undefined, existingLanguages)
  }, [slug, lang, pageType, existingLanguages])

  const jsonld = useMemo(() => {
    if (!page) return null
    if (pageType === 'listing') {
      const name = seo?.title || ''
      return generateListingSchema(pageType, lang, name, items || [])
    }
    return generateSchemaByType(page, lang, slug, pageType)
  }, [page, lang, slug, pageType, items, seo])

  if (!seo) return null

  const alternateLinks = renderHreflangTags(hreflangTags)

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonical} />
      <meta name="robots" content={seo.robots} />

      <meta property="og:title" content={seo.og_title} />
      <meta property="og:description" content={seo.og_description} />
      <meta property="og:image" content={seo.og_image} />
      <meta property="og:locale" content={seo.og_locale} />
      <meta property="og:type" content={seo.og_type} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:site_name" content="Grantify Academy" />

      <meta name="twitter:card" content={seo.twitter_card} />
      <meta name="twitter:title" content={seo.twitter_title} />
      <meta name="twitter:description" content={seo.twitter_description} />
      <meta name="twitter:image" content={seo.twitter_image} />

      {alternateLinks.map((link) => (
        <link key={link.hrefLang} rel={link.rel} hrefLang={link.hrefLang} href={link.href} />
      ))}

      <link rel="alternate" hrefLang="x-default" href={seo.hreflang.find(h => h.lang === 'x-default')?.url || seo.canonical} />

      {jsonld && (
        <script type="application/ld+json">
          {JSON.stringify(jsonld)}
        </script>
      )}
    </Helmet>
  )
}
