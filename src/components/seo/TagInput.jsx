import React, { useState, useMemo } from 'react'
import { X, Check, AlertTriangle, Hash, FileText, BarChart3, Sparkles } from 'lucide-react'
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

export default function TagInput({
  keywords = [],
  onChange,
  locale = 'ar',
  title = '',
  description = '',
  placeholder,
  showAnalysis = true,
}) {
  const [input, setInput] = useState('')

  const resolvedPlaceholder = placeholder || kwLabel('placeholder', locale)

  const addTag = (raw) => {
    const tag = raw.trim().replace(/,+$/, '').trim()
    if (!tag || tag.length < 2 || keywords.includes(tag)) return
    onChange([...keywords, tag])
  }

  const removeTag = (index) => {
    onChange(keywords.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
      setInput('')
    }
    if (e.key === 'Backspace' && !input && keywords.length > 0) {
      removeTag(keywords.length - 1)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    const parts = text.split(/[,\n]+/).map(s => s.trim().replace(/,+$/, '')).filter(Boolean)
    if (parts.length === 0) return
    const combined = [...keywords]
    parts.forEach(p => { if (p.length >= 2 && !combined.includes(p)) combined.push(p) })
    onChange(combined)
    setInput('')
  }

  const analysis = useMemo(() => {
    if (!showAnalysis || keywords.length === 0) return null
    return keywords.map(kw => {
      const inTitle = title.toLowerCase().includes(kw.toLowerCase())
      const inDesc = description.toLowerCase().includes(kw.toLowerCase())
      const titleCount = countOccurrences(title, kw)
      const descCount = countOccurrences(description, kw)
      const totalWords = description.split(/\s+/).filter(Boolean).length
      const density = totalWords > 0 ? ((descCount / totalWords) * 100).toFixed(1) : '0.0'

      const checks = []
      if (inTitle) checks.push({ pass: true, label: kwLabel('inTitle', locale) })
      else checks.push({ pass: false, label: kwLabel('missingTitle', locale) })

      if (inDesc) checks.push({ pass: true, label: kwLabel('inDescription', locale) })
      else checks.push({ pass: false, label: kwLabel('missingDescription', locale) })

      if (titleCount <= 3) checks.push({ pass: true, label: kwLabel('goodFrequency', locale) })
      else checks.push({ pass: false, label: kwLabel('overused', locale) })

      if (parseFloat(density) <= 3) checks.push({ pass: true, label: kwLabel('goodDensity', locale) })
      else checks.push({ pass: false, label: kwLabel('highDensity', locale) })

      const score = checks.filter(c => c.pass).length / checks.length
      return { keyword: kw, score, checks, titleCount, descCount, density }
    })
  }, [keywords, title, description, locale, showAnalysis])

  const overallScore = useMemo(() => {
    if (!analysis || analysis.length === 0) return null
    const avg = analysis.reduce((s, a) => s + a.score, 0) / analysis.length
    return Math.round(avg * 100)
  }, [analysis])

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {kwLabel('label', locale)}
        </label>
        <div className="flex flex-wrap items-center gap-2 p-2 mt-2 rounded-md border bg-transparent min-h-[42px] focus-within:ring-1 focus-within:ring-primary transition-all">
          {keywords.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 animate-in fade-in zoom-in-95 transition-all duration-150"
            >
              <Hash className="w-3 h-3 opacity-60" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={() => { if (input) { addTag(input); setInput('') } }}
            placeholder={keywords.length === 0 ? resolvedPlaceholder : ''}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {kwLabel('hint', locale)}
        </p>
      </div>

      {showAnalysis && analysis && analysis.length > 0 && (
        <div className="bg-secondary/30 rounded-xl p-4 border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold">
                {kwLabel('analysisHeader', locale)}
              </h4>
            </div>
            {overallScore !== null && (
              <span className={`text-sm font-black ${overallScore >= 66 ? 'text-green-600' : overallScore >= 33 ? 'text-amber-600' : 'text-red-600'}`}>
                {overallScore}%
              </span>
            )}
          </div>
          {overallScore !== null && (
            <div className="w-full bg-background/50 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overallScore >= 66 ? 'bg-green-500' : overallScore >= 33 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
          )}
          <div className="space-y-2">
            {analysis.map((item, idx) => {
              const scorePct = Math.round(item.score * 100)
              const scoreColor = scorePct >= 66 ? 'text-green-600' : scorePct >= 33 ? 'text-amber-600' : 'text-red-600'
              const scoreBg = scorePct >= 66 ? 'border-green-200 bg-green-50/30' : scorePct >= 33 ? 'border-amber-200 bg-amber-50/30' : 'border-red-200 bg-red-50/30'
              return (
                <div key={idx} className={`rounded-lg p-3 border ${scoreBg} transition-all duration-200`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-primary" />
                      {item.keyword}
                    </span>
                    <span className={`text-xs font-bold ${scoreColor}`}>
                      {scorePct}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.checks.map((check, ci) => (
                      <span
                        key={ci}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          check.pass
                            ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300'
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
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {kwLabel('densityLabel', locale)}{item.density}%
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
