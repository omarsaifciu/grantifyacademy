import React, { useMemo } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Sparkles, Hash, FileText, Percent, Eye } from 'lucide-react'
import { kwLabel } from '@/lib/seo/keywordLabels'
import { generateAutoSEODescription } from '@/lib/seo/metadata'

function getScoreColor(score) {
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function getScoreBg(score) {
  if (score >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
  if (score >= 50) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
  return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
}

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

export default function SEOAnalyzer({ keywords = [], title = '', description = '', lang = 'ar' }) {
  const analysis = useMemo(() => {
    const checks = []
    let score = 0

    const addCheck = (label, status, message) => {
      checks.push({ label, status, message })
      if (status === 'pass') score += 100
      else if (status === 'warning') score += 50
    }

    if (!keywords || keywords.length === 0) {
      addCheck(kwLabel('keywords', lang), 'warning', kwLabel('noKeywords', lang))
    } else {
      addCheck(
        kwLabel('keywordCount', lang),
        keywords.length >= 2 && keywords.length <= 8 ? 'pass' : keywords.length <= 10 ? 'warning' : 'fail',
        keywords.length >= 2 && keywords.length <= 8
          ? `${keywords.length} / ${kwLabel('keywordCountIdeal', lang)}`
          : keywords.length <= 10
            ? `${keywords.length} / ${kwLabel('keywordCountMax', lang)}`
            : `${kwLabel('tooMany', lang)} (${keywords.length})`,
      )

      const inTitle = keywords.filter(k => title.toLowerCase().includes(k.toLowerCase()))
      const titlePct = keywords.length > 0 ? (inTitle.length / keywords.length * 100) : 0
      addCheck(
        kwLabel('inTitle', lang),
        inTitle.length >= 1 ? 'pass' : 'fail',
        inTitle.length >= 1
          ? `${inTitle.length}/${keywords.length} (${Math.round(titlePct)}%)`
          : kwLabel('notInTitle', lang),
      )

      const inDesc = keywords.filter(k => description.toLowerCase().includes(k.toLowerCase()))
      const descPct = keywords.length > 0 ? (inDesc.length / keywords.length * 100) : 0
      addCheck(
        kwLabel('inDescription', lang),
        inDesc.length >= 1 ? 'pass' : 'fail',
        inDesc.length >= 1
          ? `${inDesc.length}/${keywords.length} (${Math.round(descPct)}%)`
          : kwLabel('notInDescription', lang),
      )

      const avgLen = keywords.reduce((s, k) => s + k.length, 0) / keywords.length
      addCheck(
        kwLabel('keywordLength', lang),
        avgLen >= 3 && avgLen <= 25 ? 'pass' : 'warning',
        `${kwLabel('avg', lang)}: ${avgLen.toFixed(1)} ${kwLabel('char', lang)}`,
      )

      if (description) {
        const totalWords = description.split(/\s+/).filter(Boolean).length
        if (totalWords > 0) {
          let denseKw = 0
          keywords.forEach(kw => {
            const occ = countOccurrences(description, kw)
            const density = (occ / totalWords) * 100
            if (density > 3) denseKw++
          })
          addCheck(
            kwLabel('keywordDensity', lang),
            denseKw === 0 ? 'pass' : denseKw <= 1 ? 'warning' : 'fail',
            denseKw === 0
              ? kwLabel('allNatural', lang)
              : `${denseKw} ${kwLabel('densityExceed', lang)}`,
          )
        }
      }
    }

    if (!title) {
      addCheck(kwLabel('title', lang), 'fail', kwLabel('titleEmpty', lang))
    } else {
      const titleLen = title.length
      addCheck(
        kwLabel('titleLength', lang),
        titleLen >= 30 && titleLen <= 60 ? 'pass' : titleLen > 0 ? 'warning' : 'fail',
        `${titleLen} / 60 ${kwLabel('charsMax', lang)}${titleLen < 30 && titleLen > 0 ? ` (${kwLabel('tooShort', lang)})` : ''}`,
      )
    }

    if (!description) {
      addCheck(kwLabel('description', lang), 'fail', kwLabel('descEmpty', lang))
    } else {
      const autoDesc = generateAutoSEODescription(description, lang, 155)
      const autoLen = autoDesc.length
      addCheck(
        kwLabel('descLength', lang),
        autoLen >= 80 ? 'pass' : 'warning',
        `${autoLen} / 155 ${kwLabel('charsMax', lang)}${autoLen < 80 ? ` (${kwLabel('tooShort', lang)})` : ''}`,
      )
    }

    const total = checks.length * 100
    const pct = total > 0 ? Math.round(score / total * 100) : 0
    return { checks, score: pct }
  }, [keywords, title, description, lang])

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${getScoreBg(analysis.score)}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary" />
          {kwLabel('analysisHeader', lang)}
        </h4>
        <span className={`text-lg font-black ${getScoreColor(analysis.score)}`}>
          {analysis.score}%
        </span>
      </div>
      <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            analysis.score >= 80 ? 'bg-green-500' : analysis.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${analysis.score}%` }}
        />
      </div>
      <div className="space-y-1.5">
        {analysis.checks.map((check, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              {check.status === 'pass' ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              ) : check.status === 'fail' ? (
                <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              )}
              <span className="font-medium text-foreground">{check.label}</span>
            </span>
            <span className="text-muted-foreground">{check.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
