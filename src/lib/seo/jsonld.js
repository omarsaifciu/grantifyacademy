import { getBCP47Locale } from './metadata'
import { getLocalizedCategorySlug } from './slug'

function getLocalizedText(item, lang, field) {
  return item?.translations?.[lang]?.[field]
    || item?.translations?.en?.[field]
    || item?.[field]
    || ''
}

function getSiteUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  return import.meta.env.VITE_SITE_URL || 'https://grantifyacademy.com'
}

export function generateScholarshipSchema(scholarship, lang, slug) {
  const siteUrl = getSiteUrl()
  const canonical = `${siteUrl}/${lang}/scholarships/${slug}`

  const name = getLocalizedText(scholarship, lang, 'title') || scholarship.title
  const description = getLocalizedText(scholarship, lang, 'description')
    || getLocalizedText(scholarship, lang, 'seoDescription')
    || ''

  const amount = scholarship.value || ''
  const currency = scholarship.currency || 'USD'
  const funderName = scholarship.university || scholarship.funder || ''
  const programName = scholarship.program || name

  const categorySlug = getLocalizedCategorySlug('scholarships', lang)
  const homeUrl = `${siteUrl}/${lang}/`
  const categoryUrl = `${siteUrl}/${lang}/${categorySlug}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MonetaryGrant',
        '@id': `${canonical}#grant`,
        name,
        description,
        amount: {
          '@type': 'MonetaryAmount',
          value: amount,
          currency,
        },
        funder: {
          '@type': 'EducationalOrganization',
          name: funderName,
          url: funderName ? `${siteUrl}/${lang}/universities` : siteUrl,
        },
        fundedItem: {
          '@type': 'EducationalOccupationalProgram',
          name: programName,
          financialAidEligible: name,
        },
      },
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name,
        inLanguage: getBCP47Locale(lang),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: 'Scholarships', item: categoryUrl },
            { '@type': 'ListItem', position: 3, name, item: canonical },
          ],
        },
      },
    ],
  }
}

export function generateUniversitySchema(university, lang, slug) {
  const siteUrl = getSiteUrl()
  const canonical = `${siteUrl}/${lang}/universities/${slug}`

  const name = getLocalizedText(university, lang, 'name') || university.name
  const description = getLocalizedText(university, lang, 'description') || ''

  const categorySlug = getLocalizedCategorySlug('universities', lang)
  const homeUrl = `${siteUrl}/${lang}/`
  const categoryUrl = `${siteUrl}/${lang}/${categorySlug}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `${canonical}#org`,
        name,
        description,
        url: canonical,
        location: university.location || university.country || '',
        ...(university.image ? { image: university.image } : {}),
      },
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name,
        inLanguage: getBCP47Locale(lang),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: 'Universities', item: categoryUrl },
            { '@type': 'ListItem', position: 3, name, item: canonical },
          ],
        },
      },
    ],
  }
}

export function generateProgramSchema(program, lang, slug) {
  const siteUrl = getSiteUrl()
  const canonical = `${siteUrl}/${lang}/programs/${slug}`

  const name = program.program_name || program.name || ''
  const description = program.description || ''

  const homeUrl = `${siteUrl}/${lang}/`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOccupationalProgram',
        '@id': `${canonical}#program`,
        name,
        description,
        ...(program.duration_years ? { duration: `P${program.duration_years}Y` } : {}),
        ...(program.degree_level ? { educationalLevel: program.degree_level } : {}),
        ...(program.tuition_fee_original ? {
          tuition: {
            '@type': 'MonetaryAmount',
            value: program.tuition_fee_original,
            currency: 'USD',
          },
        } : {}),
      },
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name,
        inLanguage: getBCP47Locale(lang),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
            { '@type': 'ListItem', position: 2, name, item: canonical },
          ],
        },
      },
    ],
  }
}

export function generateListingSchema(pageType, lang, pageName, items = []) {
  const siteUrl = getSiteUrl()
  const categorySlug = getLocalizedCategorySlug(
    pageType === 'university' ? 'universities' : 'scholarships',
    lang
  )
  const canonical = `${siteUrl}/${lang}/${categorySlug}`
  const homeUrl = `${siteUrl}/${lang}/`

  const itemList = items.slice(0, 10).map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.title || item.name || '',
    url: item.id ? `${canonical}/${item.id}` : '',
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...(itemList.length > 0 ? [{
        '@type': 'ItemList',
        itemListElement: itemList,
      }] : []),
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name: pageName,
        inLanguage: getBCP47Locale(lang),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: pageName, item: canonical },
          ],
        },
      },
    ],
  }
}

export function generateBlogPostSchema(post, lang, slug) {
  const siteUrl = getSiteUrl()
  const canonical = `${siteUrl}/${lang}/blog/${slug}`

  const name = getLocalizedText(post, lang, 'title') || post.title
  const description = getLocalizedText(post, lang, 'excerpt') || ''
  const authorName = post.author || 'Grantify Academy'

  const categorySlug = getLocalizedCategorySlug('blog', lang)
  const homeUrl = `${siteUrl}/${lang}/`
  const categoryUrl = `${siteUrl}/${lang}/${categorySlug}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: name,
        description,
        author: {
          '@type': 'Person',
          name: authorName,
        },
        ...(post.date ? { datePublished: post.date } : {}),
        ...(post.image ? { image: post.image } : {}),
        publisher: {
          '@type': 'Organization',
          name: 'Grantify Academy',
        },
      },
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name,
        inLanguage: getBCP47Locale(lang),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: categoryUrl },
            { '@type': 'ListItem', position: 3, name, item: canonical },
          ],
        },
      },
    ],
  }
}

export function generateOrganizationSchema() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Grantify Academy',
    url: siteUrl,
    sameAs: [
      'https://facebook.com/grantifyacademy',
      'https://twitter.com/grantifyacademy',
      'https://linkedin.com/company/grantifyacademy',
    ],
  }
}

export function generateSchemaByType(page, lang, slug, pageType) {
  if (!page) return null

  switch (pageType) {
    case 'scholarship':
      return generateScholarshipSchema(page, lang, slug)
    case 'university':
      return generateUniversitySchema(page, lang, slug)
    case 'program':
      return generateProgramSchema(page, lang, slug)
    case 'blog':
      return generateBlogPostSchema(page, lang, slug)
    case 'listing':
    default:
      return null
  }
}
