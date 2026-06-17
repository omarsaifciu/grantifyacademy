import { getBCP47Locale, truncateTo } from './metadata'
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

const BREADCRUMB_LABELS = {
  home: {
    ar: 'الرئيسية', en: 'Home', zh: '首页', es: 'Inicio', hi: 'होम',
    fr: 'Accueil', bn: 'হোম', pt: 'Início', ru: 'Главная', ja: 'ホーム',
    de: 'Startseite', ko: '홈', tr: 'Ana Sayfa', vi: 'Trang chủ',
    it: 'Home', th: 'หน้าแรก', fa: 'خانه', sw: 'Nyumbani', id: 'Beranda', nl: 'Home',
  },
  scholarships: {
    ar: 'المنح الدراسية', en: 'Scholarships', zh: '奖学金', es: 'Becas', hi: 'छात्रवृत्तियां',
    fr: 'Bourses', bn: 'স্কলারশিপ', pt: 'Bolsas de Estudo', ru: 'Стипендии', ja: '奨学金',
    de: 'Stipendien', ko: '장학금', tr: 'Burslar', vi: 'Học bổng',
    it: 'Borse di Studio', th: 'ทุนการศึกษา', fa: 'بورسیه‌ها', sw: 'Masomo', id: 'Beasiswa', nl: 'Beurzen',
  },
  universities: {
    ar: 'الجامعات', en: 'Universities', zh: '大学', es: 'Universidades', hi: 'विश्वविद्यालय',
    fr: 'Universités', bn: 'বিশ্ববিদ্যালয়', pt: 'Universidades', ru: 'Университеты', ja: '大学',
    de: 'Universitäten', ko: '대학', tr: 'Üniversiteler', vi: 'Trường đại học',
    it: 'Università', th: 'มหาวิทยาลัย', fa: 'دانشگاه‌ها', sw: 'Vyuo Vikuu', id: 'Universitas', nl: 'Universiteiten',
  },
  blog: {
    ar: 'المدونة', en: 'Blog', zh: '博客', es: 'Blog', hi: 'ब्लॉग',
    fr: 'Blog', bn: 'ব্লগ', pt: 'Blog', ru: 'Блог', ja: 'ブログ',
    de: 'Blog', ko: '블로그', tr: 'Blog', vi: 'Blog',
    it: 'Blog', th: 'บล็อก', fa: 'وبلاگ', sw: 'Blogu', id: 'Blog', nl: 'Blog',
  },
}

function getBreadcrumbLabel(category, lang) {
  return BREADCRUMB_LABELS[category]?.[lang] || BREADCRUMB_LABELS[category]?.en || category
}

export function generateScholarshipSchema(scholarship, lang, slug) {
  const siteUrl = getSiteUrl()
  const canonical = `${siteUrl}/${lang}/scholarships/${slug}`

  const name = getLocalizedText(scholarship, lang, 'title') || scholarship.title
  const description = truncateTo(getLocalizedText(scholarship, lang, 'description')
    || getLocalizedText(scholarship, lang, 'seoDescription')
    || '', 200)

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
            { '@type': 'ListItem', position: 1, name: getBreadcrumbLabel('home', lang), item: homeUrl },
            { '@type': 'ListItem', position: 2, name: getBreadcrumbLabel('scholarships', lang), item: categoryUrl },
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
  const description = truncateTo(getLocalizedText(university, lang, 'description') || '', 200)

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
            { '@type': 'ListItem', position: 1, name: getBreadcrumbLabel('home', lang), item: homeUrl },
            { '@type': 'ListItem', position: 2, name: getBreadcrumbLabel('universities', lang), item: categoryUrl },
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
  const description = truncateTo(program.description || '', 200)

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
            { '@type': 'ListItem', position: 1, name: getBreadcrumbLabel('home', lang), item: homeUrl },
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
            { '@type': 'ListItem', position: 1, name: getBreadcrumbLabel('home', lang), item: homeUrl },
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
  const description = truncateTo(getLocalizedText(post, lang, 'excerpt') || '', 200)
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
            { '@type': 'ListItem', position: 1, name: getBreadcrumbLabel('home', lang), item: homeUrl },
            { '@type': 'ListItem', position: 2, name: getBreadcrumbLabel('blog', lang), item: categoryUrl },
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

export function validateJSONLDSchema(schema, lang) {
  const errors = []
  
  if (!schema) {
    errors.push('Schema is null or undefined')
    return { valid: false, errors }
  }
  
  if (!schema['@type']) {
    errors.push('Missing @type in schema')
  }
  
  if (!schema['@graph'] || !Array.isArray(schema['@graph'])) {
    errors.push('Missing or invalid @graph array')
  } else {
    const webPageFound = schema['@graph'].some(item => item['@type'] === 'WebPage')
    if (!webPageFound) {
      errors.push('Missing WebPage schema in @graph')
    }
  }
  
  if (!schema['inLanguage']) {
    errors.push('Missing inLanguage for WebPage')
  }
  
  const name = schema.name || (schema['@graph'] && schema['@graph'].find(item => item['@type'] === 'WebPage')?.name)
  if (!name || typeof name !== 'string') {
    errors.push('Missing or invalid name')
  } else if (name.length < 10) {
    errors.push('Name is too short (should be at least 10 characters)')
  } else if (name.length > 100) {
    errors.push('Name is too long (should be at most 100 characters)')
  }
  
  if (lang === 'ar' && !/[؀-ۿ]/.test(name)) {
    errors.push('Arabic name should contain Arabic characters')
  }
  
  if (schema.description && typeof schema.description === 'string') {
    if (schema.description.length < 50) {
      errors.push('Description is too short (should be at least 50 characters)')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    wordCount: name ? name.split(' ').length : 0,
    language: lang,
  }
}

export function validateAllSchemas(schemas, lang) {
  const results = schemas.map(schema => {
    const type = schema['@graph']?.[0]?.['@type'] || schema['@type']
    return {
      type,
      ...validateJSONLDSchema(schema, lang),
    }
  })
  
  const allValid = results.every(r => r.valid)
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)
  
  return {
    valid: allValid,
    errors: results.flatMap(r => r.errors),
    totalErrors,
    schemas: results,
    language: lang,
    wordCount: results.reduce((sum, r) => sum + (r.wordCount || 0), 0),
  }
}
