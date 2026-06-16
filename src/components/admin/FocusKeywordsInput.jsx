import React, { useState, useMemo } from 'react'
import { X, Check, AlertTriangle, Hash, FileText, BarChart3 } from 'lucide-react'
import { kwLabel } from '@/lib/seo/keywordLabels'

function countOccurrences(text, keyword) {
  if (!text || !keyword) return 0
  const lower = text.toLowerCase()
  const kw = keyword.toLowerCase()
  let count = 0
  let pos = 0
  while ((pos = lower.indexOf(kw, pos)) !== -1) {
    count++
    pos += kw.length
  }
  return count
}

export default function FocusKeywordsInput({ translations, locale, onChange }) {
  const [input, setInput] = useState('')
  const keywords = translations?.[locale]?.focus_keywords || []

  const addKeyword = (raw) => {
    const kw = raw.trim().replace(/,+$/, '').trim()
    if (!kw || kw.length < 2) return
    if (keywords.includes(kw)) return
    const updated = { ...translations }
    if (!updated[locale]) updated[locale] = {}
    updated[locale] = { ...updated[locale], focus_keywords: [...keywords, kw] }
    onChange(updated)
  }

  const removeKeyword = (index) => {
    const updated = { ...translations }
    if (!updated[locale]) updated[locale] = {}
    updated[locale] = {
      ...updated[locale],
      focus_keywords: keywords.filter((_, i) => i !== index),
    }
    onChange(updated)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addKeyword(input)
      setInput('')
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    const parts = text.split(/[,\n]+/).filter(Boolean)
    if (parts.length === 0) return
    let updated = { ...translations }
    if (!updated[locale]) updated[locale] = {}
    const merged = [...keywords]
    parts.forEach(p => {
      const kw = p.trim()
      if (kw && kw.length >= 2 && !merged.includes(kw)) merged.push(kw)
    })
    updated[locale] = { ...updated[locale], focus_keywords: merged }
    onChange(updated)
    setInput('')
  }

  const title = translations?.[locale]?.title || translations?.[locale]?.name || ''
  const description = translations?.[locale]?.description || translations?.[locale]?.excerpt || ''
  const slug = title ? title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '').replace(/\s+/g, '-') : ''

  const analysis = useMemo(() => {
    if (keywords.length === 0) return null
    return keywords.map(kw => {
      const inTitle = title.toLowerCase().includes(kw.toLowerCase())
      const inDesc = description.toLowerCase().includes(kw.toLowerCase())
      const inSlug = slug.toLowerCase().includes(kw.toLowerCase().replace(/\s+/g, '-'))
      const titleCount = countOccurrences(title, kw)
      const descCount = countOccurrences(description, kw)

      const checks = []
      if (inTitle) checks.push({ pass: true, label: kwLabel('inTitle', locale) })
      else checks.push({ pass: false, label: kwLabel('missingTitle', locale) })

      if (inDesc) checks.push({ pass: true, label: kwLabel('inDescription', locale) })
      else checks.push({ pass: false, label: kwLabel('missingDescription', locale) })

      if (inSlug) checks.push({ pass: true, label: locale === 'ar' ? 'في الرابط' : 'In URL' })
      else checks.push({ pass: false, label: locale === 'ar' ? 'مفقود من الرابط' : 'Missing from URL' })

      const score = checks.filter(c => c.pass).length / checks.length
      return { keyword: kw, score, checks, titleCount, descCount }
    })
  }, [keywords, title, description, slug, locale])

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {kwLabel('label', locale)}
        </label>
        <div className="flex flex-wrap gap-2 mt-2 mb-2">
          {keywords.map((kw, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              <Hash className="w-3 h-3" />
              {kw}
              <button
                type="button"
                onClick={() => removeKeyword(idx)}
                className="ml-1 hover:text-blue-900 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={kwLabel('placeholder', locale)}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {kwLabel('hint', locale)}
        </p>
      </div>

      {analysis && analysis.length > 0 && (
        <div className="bg-secondary/30 rounded-xl p-4 border">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-bold">
              {kwLabel('analysisHeader', locale)}
            </h4>
          </div>
          <div className="space-y-3">
            {analysis.map((item, idx) => {
              const scorePct = Math.round(item.score * 100)
              const scoreColor = scorePct >= 66 ? 'text-green-600' : scorePct >= 33 ? 'text-yellow-600' : 'text-red-600'
              return (
                <div key={idx} className="bg-background/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-primary" />
                      {item.keyword}
                    </span>
                    <span className={`text-xs font-bold ${scoreColor}`}>
                      {scorePct}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.checks.map((check, ci) => (
                      <span
                        key={ci}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          check.pass
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {check.pass ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {check.label}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {kwLabel('inTitleCount', locale)}{item.titleCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {kwLabel('inDescriptionCount', locale)}{item.descCount}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
