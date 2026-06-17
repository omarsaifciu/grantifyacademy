import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/utils'
import { getLocalizedCategorySlug } from './slug'

const BRAND = 'Grantify Academy'
const OG_IMAGE_DEFAULT = '/og-default.jpg'

const SHORT_CTA = {
  ar: 'قدم الآن', en: 'Apply now', es: 'Solicita ahora', fr: 'Postulez',
  pt: 'Inscreva-se', ru: 'Подайте заявку', de: 'Jetzt bewerben',
  zh: '立即申请', hi: 'अभी आवेदन करें', ja: '今すぐ申し込む',
  ko: '지금 신청', tr: 'Başvur', vi: 'Đăng ký', it: 'Candidati',
  th: 'สมัครตอนนี้', fa: 'اقدام کنید', sw: 'Tuma ombi', id: 'Daftar',
  nl: 'Solliciteer', bn: 'এখনই আবেদন',
}

const BCP47_MAP = {
  en: 'en_US', ar: 'ar_SA', es: 'es_ES', fr: 'fr_FR', pt: 'pt_BR',
  ru: 'ru_RU', de: 'de_DE', zh: 'zh_CN', hi: 'hi_IN', ja: 'ja_JP',
  ko: 'ko_KR', tr: 'tr_TR', vi: 'vi_VN', it: 'it_IT', th: 'th_TH',
  fa: 'fa_IR', sw: 'sw_KE', id: 'id_ID', nl: 'nl_NL', bn: 'bn_BD',
}

export function getBCP47Locale(lang) {
  return BCP47_MAP[lang] || 'en_US'
}

function getSiteUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  return import.meta.env.VITE_SITE_URL || 'https://grantifyacademy.com'
}

function stripHtml(text) {
  if (!text) return ''
  return text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

export function truncateTo(str, maxLen) {
  if (!str || str.length <= maxLen) return str || ''
  return str.substring(0, maxLen - 1).trim() + '…'
}

function getLocalizedText(item, lang, field) {
  return item?.translations?.[lang]?.[field]
    || item?.translations?.[DEFAULT_LOCALE]?.[field]
    || item?.[field]
    || ''
}

export function generateAutoSEODescription(text, lang = 'en', maxLen = 155) {
  const clean = stripHtml(text)
  if (!clean) return ''

  const cta = SHORT_CTA[lang] || SHORT_CTA.en
  const ctaSpace = cta.length + 3
  const contentMax = Math.max(60, maxLen - ctaSpace)

  const truncated = truncateTo(clean, contentMax)
  return `${truncated} — ${cta}`
}

function buildDescription(page, lang, pageType) {
  const seoDesc = getLocalizedText(page, lang, 'seo_description') || getLocalizedText(page, lang, 'seoDescription')
  if (seoDesc) {
    if (seoDesc.length <= 155) return seoDesc
    return truncateTo(seoDesc, 152)
  }

  const desc = getLocalizedText(page, lang, 'description')
    || getLocalizedText(page, lang, 'excerpt')
    || ''

  if (desc) return generateAutoSEODescription(desc, lang, 155)

  const contentText = page?.content ? stripHtml(page.content) : ''
  if (contentText.length > 60) {
    return generateAutoSEODescription(contentText, lang, 155)
  }

  if (pageType === 'scholarship') {
    const value = page.value || ''
    const name = getLocalizedText(page, lang, 'title')
    return truncateTo(`${name}${value ? ` | قيمة ${value}` : ''}`, 155)
  }

  const name = getLocalizedText(page, lang, 'title') || getLocalizedText(page, lang, 'name')
  return truncateTo(name, 155)
}

function buildTitle(page, lang, pageType) {
  const seoTitle = getLocalizedText(page, lang, 'seo_title') || getLocalizedText(page, lang, 'seoTitle')
  if (seoTitle) return `${seoTitle} | ${BRAND}`

  const keyword = getLocalizedText(page, lang, 'title')
    || getLocalizedText(page, lang, 'name')
    || ''

  if (pageType === 'listing') {
    return `${keyword} | ${BRAND}`
  }

  if (keyword) {
    const full = `${keyword} | ${BRAND}`
    if (full.length <= 60) return full
    const adjusted = keyword.length > 55 ? keyword.substring(0, 52).trim() + '…' : keyword
    return `${adjusted} | ${BRAND}`
  }

  return BRAND
}

export function generatePaginationUrls(lang, category, slug, currentPage, totalPages) {
  const siteUrl = getSiteUrl()
  const categorySlug = getLocalizedCategorySlug(category, lang)
  const baseUrl = `${siteUrl}/${lang}/${categorySlug}/${slug}`

  return {
    prev: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
    next: currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : null,
  }
}

export function generateSEOMetadata(page, lang, pageType, slug) {
  const siteUrl = getSiteUrl()
  const categorySlug = getLocalizedCategorySlug(
    pageType === 'blog' ? 'blog' : pageType === 'university' ? 'universities' : 'scholarships',
    lang
  )
  const canonical = `${siteUrl}/${lang}/${categorySlug}/${slug}`

  const title = buildTitle(page, lang, pageType)
  const description = buildDescription(page, lang, pageType)

  const isPublished = page?.is_active !== false && !page?.is_draft
  const robots = isPublished ? 'index, follow' : 'noindex, nofollow'

  const ogLocale = getBCP47Locale(lang)
  const ogType = pageType === 'blog' ? 'article' : 'website'

  const image = page?.image || page?.logo_image || `${siteUrl}${OG_IMAGE_DEFAULT}`

  const ogImage = image.startsWith('http') ? image : `${siteUrl}${image}`

  const hreflang = SUPPORTED_LOCALES.map(l => ({
    lang: l,
    url: `${siteUrl}/${l}/${categorySlug}/${slug}`,
  }))

  return {
    title,
    description,
    canonical,
    robots,
    og_title: title,
    og_description: description,
    og_image: ogImage,
    og_locale: ogLocale,
    og_type: ogType,
    twitter_card: 'summary_large_image',
    twitter_title: title,
    twitter_description: description,
    twitter_image: ogImage,
    hreflang,
    jsonLD: null,
  }
}
