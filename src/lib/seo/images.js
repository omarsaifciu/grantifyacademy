import { generateLocalizedSlug } from './slug'

export function generateImageAlt(item, lang, descriptor = '') {
  const title = item?.translations?.[lang]?.title
    || item?.translations?.[lang]?.name
    || item?.title
    || item?.name
    || ''

  const parts = [title]
  if (descriptor) parts.push(descriptor)
  parts.push(lang.toUpperCase())

  return parts.join(' - ')
}

export function generateImageFilename(originalName, title, lang) {
  const ext = originalName?.split('.').pop() || 'jpg'
  const slug = generateLocalizedSlug(title, lang)
  return `${slug}.${ext}`
}

export function getImageLoadingPriority(index) {
  if (index === 0) return { loading: 'eager', fetchpriority: 'high' }
  return { loading: 'lazy', fetchpriority: 'auto' }
}

export function validateImageAttributes(imgElement) {
  const warnings = []
  if (!imgElement.getAttribute('width') || !imgElement.getAttribute('height')) {
    warnings.push('Image missing width/height attributes — CLS risk')
  }
  if (!imgElement.getAttribute('alt')) {
    warnings.push('Image missing alt text')
  }
  if (!imgElement.getAttribute('loading')) {
    warnings.push('Image missing loading attribute')
  }
  return warnings
}
