import React from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { Languages } from 'lucide-react'
import { SUPPORTED_LOCALES, LOCALE_LABELS, DEFAULT_LOCALE } from '@/lib/utils'
import { getLocalizedCategorySlug, CATEGORY_SLUGS } from '@/lib/seo/slug'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'

function resolveEquivalentUrl(currentLang, targetLang, pathname) {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0 || segments[0] === currentLang) {
    segments.shift()
  }

  if (segments.length === 0) {
    return `/${targetLang}/`
  }

  const category = segments[0]
  for (const [cat, slugs] of Object.entries(CATEGORY_SLUGS[currentLang] || CATEGORY_SLUGS.en)) {
    if (slugs === category || cat === category) {
      const targetCategorySlug = getLocalizedCategorySlug(cat, targetLang)
      segments[0] = targetCategorySlug
      break
    }
  }

  return `/${targetLang}/${segments.join('/')}`
}

export default function LanguageSwitcher({ className = '', variant = 'header' }) {
  const { locale } = useParams()
  const location = useLocation()
  const currentLang = locale || DEFAULT_LOCALE

  if (variant === 'button') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 gap-2 text-foreground bg-background/20 hover:bg-background/30 backdrop-blur-sm border border-input">
            <Languages className="w-4 h-4" />
            {LOCALE_LABELS[currentLang] || currentLang}
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <VisuallyHidden.Root>
            <DialogTitle>Choose a language</DialogTitle>
          </VisuallyHidden.Root>
          <div className="grid grid-cols-3 gap-2 py-4">
            {SUPPORTED_LOCALES.map((lang) => {
              const url = resolveEquivalentUrl(currentLang, lang, location.pathname)
              const isActive = lang === currentLang
              return (
                <Link
                  key={lang}
                  to={url}
                  hrefLang={lang}
                  className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-input'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {LOCALE_LABELS[lang] || lang}
                </Link>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <nav className={`language-switcher ${className}`} aria-label="Language switcher">
      {variant === 'footer' && (
        <h3 className="text-lg font-bold mb-4 text-foreground">Languages</h3>
      )}
      <div className={variant === 'footer' ? 'flex flex-wrap gap-2' : 'flex flex-wrap gap-1.5'}>
        {SUPPORTED_LOCALES.map((lang) => {
          const url = resolveEquivalentUrl(currentLang, lang, location.pathname)
          const isActive = lang === currentLang

          return (
            <Link
              key={lang}
              to={url}
              hrefLang={lang}
              className={`
                inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors
                ${isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-input'
                }
              `}
              aria-current={isActive ? 'true' : undefined}
            >
              {LOCALE_LABELS[lang] || lang}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
