import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { generateSEOMetadata, generatePaginationUrls } from '@/lib/seo/metadata'
import { generateHreflang, renderHreflangTags } from '@/lib/seo/hreflang'
import { generateSchemaByType, generateOrganizationSchema } from '@/lib/seo/jsonld'

export default function SEOHead({ page, lang, pageType, slug, items, existingLanguages, currentPage, totalPages }) {
  const seo = useMemo(() => {
    if (!page || !slug) return null
    return generateSEOMetadata(page, lang, pageType, slug)
  }, [page, lang, pageType, slug])

  const hreflangTags = useMemo(() => {
    if (!slug) return []
    return generateHreflang(slug, lang, pageType, undefined, existingLanguages)
  }, [slug, lang, pageType, existingLanguages])

  const jsonldSchemas = useMemo(() => {
    const schemas = []
    schemas.push(generateOrganizationSchema())

    if (page && slug) {
      const pageSchema = generateSchemaByType(page, lang, slug, pageType)
      if (pageSchema) schemas.push(pageSchema)
    }

    return schemas
  }, [page, lang, slug, pageType])

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

      {seo.og_image && (
        <link rel="preload" as="image" href={seo.og_image} />
      )}

      {currentPage && totalPages && generatePaginationUrls(lang, pageType === 'blog' ? 'blog' : pageType === 'university' ? 'universities' : 'scholarships', slug, currentPage, totalPages).prev && (
        <link rel="prev" href={generatePaginationUrls(lang, pageType === 'blog' ? 'blog' : pageType === 'university' ? 'universities' : 'scholarships', slug, currentPage, totalPages).prev} />
      )}
      {currentPage && totalPages && generatePaginationUrls(lang, pageType === 'blog' ? 'blog' : pageType === 'university' ? 'universities' : 'scholarships', slug, currentPage, totalPages).next && (
        <link rel="next" href={generatePaginationUrls(lang, pageType === 'blog' ? 'blog' : pageType === 'university' ? 'universities' : 'scholarships', slug, currentPage, totalPages).next} />
      )}

      {jsonldSchemas.map((schema, idx) => (
        <script key={`ld-${idx}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {seo.og_type === 'article' && page?.date && (
        <>
          <meta property="article:published_time" content={page.date} />
          {page.author && <meta property="article:author" content={page.author} />}
        </>
      )}
    </Helmet>
  )
}
