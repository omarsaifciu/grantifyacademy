import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Globe, Building2, Clock, CheckCircle2, XCircle,
  MapPin, Award, ArrowRight, GraduationCap,
  BookOpen, FileText, ChevronRight, ChevronLeft, CalendarDays,
  ExternalLink, BadgeCheck, AlertTriangle, Info, Languages,
  DollarSign, Percent, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  getUniversities,
  getPrograms,
  getApplicationIntakes,
  getRequiredDocuments,
  getNationalityRequirements,
  getProgramRequiredDocuments,
  computeIntakeStatus
} from '@/lib/storage'

const COUNTRIES = [
  { value: 'China', label: 'الصين' },
  { value: 'Malaysia', label: 'ماليزيا' },
  { value: 'Italy', label: 'إيطاليا' },
  { value: 'Turkey', label: 'تركيا' },
  { value: 'Cyprus', label: 'قبرص' },
  { value: 'Georgia', label: 'جورجيا' },
  { value: 'Germany', label: 'ألمانيا' },
  { value: 'UK', label: 'بريطانيا' },
  { value: 'Rwanda', label: 'رواندا' },
  { value: 'Syria', label: 'سوريا' },
  { value: 'Yemen', label: 'اليمن' },
  { value: 'Egypt', label: 'مصر' },
  { value: 'Jordan', label: 'الأردن' },
  { value: 'Lebanon', label: 'لبنان' },
  { value: 'Saudi', label: 'السعودية' },
  { value: 'UAE', label: 'الإمارات' },
]

const FILTER_OPTIONS = [
  { value: 'all', label: 'الكل' },
  { value: 'open', label: 'مفتوح للتقديم' },
  { value: 'medicine', label: 'الطب' },
  { value: 'engineering', label: 'الهندسة' },
  { value: 'business', label: 'إدارة الأعمال' },
  { value: 'it', label: 'تقنية المعلومات' },
]

const PROGRAM_KEYWORDS = {
  medicine: ['طب', 'طبي', 'صحة', 'صيدلة', 'تمريض', 'علاج', 'medical', 'medicine', 'pharmacy', 'nursing', 'health', 'dental'],
  engineering: ['هندسة', 'هندسي', 'engineering', 'engineer', 'civil', 'mechanical', 'electrical', 'architect', 'عمارة', 'مدني', 'ميكانيك', 'كهرباء'],
  business: ['إدارة', 'أعمال', 'محاسبة', 'اقتصاد', 'تسويق', 'business', 'accounting', 'economics', 'marketing', 'finance', 'management'],
  it: ['حاسوب', 'برمجة', 'معلومات', 'تقنية', 'it', 'computer', 'software', 'information', 'data', 'cyber', 'network', 'programming', 'cs', 'ai', 'ذكاء', 'بيانات', 'شبكات', 'cyber'],
}

const DEGREE_LABELS = {
  diploma: 'دبلوم',
  bachelor: 'بكالوريوس',
  master: 'ماجستير',
  phd: 'دكتوراة',
}

const SCHOLARSHIP_LABELS = {
  none: 'بدون',
  '25': 'منحة 25%',
  '50': 'منحة 50%',
  '75': 'منحة 75%',
  full: 'منحة كاملة',
}

const STUDY_LANGUAGE_LABELS = {
  english: 'إنجليزي',
  chinese: 'صيني',
  german: 'ألماني',
  italian: 'إيطالي',
  turkish: 'تركي',
  other: 'آخر',
}

const getDaysRemaining = (dateStr) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diff = target - today
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

const getProgressPercent = (startDate, endDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)
  const total = end - start
  const elapsed = today - start
  if (total <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
}

const UniversityExplorer = () => {
  const [universities, setUniversities] = useState([])
  const [programs, setPrograms] = useState({})
  const [intakes, setIntakes] = useState({})
  const [allRequiredDocs, setAllRequiredDocs] = useState([])
  const [nationalityReqs, setNationalityReqs] = useState({})
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState('countries')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedUniversity, setSelectedUniversity] = useState(null)
  const [filterMode, setFilterMode] = useState('all')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const unis = await getUniversities()
      setUniversities(unis)

      const programsMap = {}
      const intakesMap = {}
      for (const uni of unis) {
        programsMap[uni.id] = await getPrograms(uni.id)
        intakesMap[uni.id] = (await getApplicationIntakes(uni.id)).map(i => ({
          ...i,
          status: computeIntakeStatus(i)
        }))
      }
      setPrograms(programsMap)
      setIntakes(intakesMap)

      const docs = await getRequiredDocuments()
      setAllRequiredDocs(docs)

      const allReqs = await getNationalityRequirements()
      const reqsMap = {}
      for (const req of allReqs) {
        if (!reqsMap[req.university_id]) reqsMap[req.university_id] = []
        reqsMap[req.university_id].push(req)
      }
      setNationalityReqs(reqsMap)

      setLoading(false)
    }
    loadData()
  }, [])

  const countriesData = useMemo(() => {
    const map = {}
    for (const uni of universities) {
      if (!map[uni.country]) {
        map[uni.country] = { country: uni.country, total: 0, open: 0, openingSoon: 0 }
      }
      map[uni.country].total++
      const uniIntakes = intakes[uni.id] || []
      if (uniIntakes.some(i => i.status === 'open')) map[uni.country].open++
      if (uniIntakes.some(i => i.status === 'opening_soon')) map[uni.country].openingSoon++
    }
    return Object.values(map).sort((a, b) => b.total - a.total)
  }, [universities, intakes])

  const filteredUniversities = useMemo(() => {
    if (!selectedCountry) return []
    let list = universities.filter(u => u.country === selectedCountry)

    if (filterMode === 'open') {
      list = list.filter(u => (intakes[u.id] || []).some(i => i.status === 'open'))
    } else if (filterMode !== 'all') {
      list = list.filter(u => (programs[u.id] || []).some(p =>
        PROGRAM_KEYWORDS[filterMode]?.some(kw => p.program_name?.toLowerCase().includes(kw.toLowerCase()))
      ))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.city?.toLowerCase().includes(q)
      )
    }

    return list.sort((a, b) => {
      const aOpen = (intakes[a.id] || []).some(i => i.status === 'open') ? 1 : 0
      const bOpen = (intakes[b.id] || []).some(i => i.status === 'open') ? 1 : 0
      return bOpen - aOpen
    })
  }, [universities, selectedCountry, intakes, programs, filterMode, searchQuery])

  const getBestIntake = (uniId) => {
    const uniIntakes = intakes[uniId] || []
    const open = uniIntakes.find(i => i.status === 'open')
    if (open) return open
    const soon = uniIntakes.find(i => i.status === 'opening_soon')
    if (soon) return soon
    return uniIntakes.length > 0 ? uniIntakes[uniIntakes.length - 1] : null
  }

  const getCountryLabel = (value) => COUNTRIES.find(c => c.value === value)?.label || value

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {view !== 'countries' && (
          <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h2 className="text-2xl font-bold gradient-text">
            {view === 'countries' && 'مستكشف الجامعات'}
            {view === 'country' && getCountryLabel(selectedCountry)}
            {view === 'university' && selectedUniversity?.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {view === 'countries' && 'تصفح الجامعات حسب الدولة أو التخصص'}
            {view === 'country' && `${filteredUniversities.length} جامعة`}
            {view === 'university' && getCountryLabel(selectedUniversity?.country)}
          </p>
        </div>
      </div>
      {view === 'countries' && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>{countriesData.length} دولة • {universities.length} جامعة</span>
        </div>
      )}
    </div>
  )

  const renderFilterChips = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {FILTER_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => setFilterMode(opt.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filterMode === opt.value
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )

  const renderCountryCard = (countryData) => {
    const countryInfo = COUNTRIES.find(c => c.value === countryData.country)
    return (
      <motion.button
        key={countryData.country}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => handleSelectCountry(countryData.country)}
        className="relative group text-right bg-card border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 w-full"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
            {countryInfo?.label?.slice(0, 2) || '🌍'}
          </div>
          <div className="text-left">
            {countryData.open > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3" />
                {countryData.open} مفتوح
              </span>
            )}
          </div>
        </div>
        <h3 className="text-lg font-bold mb-1">{countryInfo?.label || countryData.country}</h3>
        <p className="text-sm text-muted-foreground mb-3">{countryData.total} جامعة</p>
        {countryData.openingSoon > 0 && (
          <p className="text-xs text-amber-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {countryData.openingSoon} جامعة ستفتح قريباً
          </p>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    )
  }

  const renderUniversityCard = (uni) => {
    const bestIntake = getBestIntake(uni.id)
    const uniPrograms = programs[uni.id] || []
    const uniIntakes = intakes[uni.id] || []
    const hasOpen = uniIntakes.some(i => i.status === 'open')

    return (
      <motion.button
        key={uni.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => handleSelectUniversity(uni)}
        className={`relative group text-right bg-card border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 w-full ${
          hasOpen ? 'border-green-200 bg-green-50/30' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
              {uni.logo_image ? (
                <img src={uni.logo_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">{uni.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {uni.city || ''} • {uni.university_type === 'private' ? 'خاصة' : 'حكومية'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {getIntakeStatusBadge(bestIntake)}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            {uniPrograms.length} برنامج
          </span>
          {uni.accreditation_status === 'accredited' && (
            <span className="flex items-center gap-1 text-green-600">
              <BadgeCheck className="w-3.5 h-3.5" />
              معتمدة
            </span>
          )}
        </div>

        {uniPrograms.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {uniPrograms.slice(0, 4).map(p => (
              <span key={p.id} className="px-2 py-0.5 bg-secondary/60 rounded text-xs text-muted-foreground">
                {p.program_name}
              </span>
            ))}
            {uniPrograms.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">+{uniPrograms.length - 4}</span>
            )}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    )
  }

  const getIntakeStatusBadge = (intake) => {
    if (!intake) return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
        لا توجد مواعيد
      </span>
    )
    if (intake.status === 'open') {
      const days = getDaysRemaining(intake.application_close_date)
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3" />
          {days > 0 ? `متبقي ${days} يوم` : 'مفتوح الآن'}
        </span>
      )
    }
    if (intake.status === 'opening_soon') {
      const days = getDaysRemaining(intake.application_open_date)
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3" />
          {days > 0 ? `بعد ${days} يوم` : 'يفتح قريباً'}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
        <XCircle className="w-3 h-3" />
        مغلق
      </span>
    )
  }

  const renderUniversityDetail = () => {
    const uni = selectedUniversity
    if (!uni) return null

    const uniPrograms = programs[uni.id] || []
    const uniIntakes = intakes[uni.id] || []
    const uniDocs = allRequiredDocs.filter(d => d.university_id === uni.id)
    const uniReqs = nationalityReqs[uni.id] || []

    const openIntake = uniIntakes.find(i => i.status === 'open')
    const soonIntake = uniIntakes.find(i => i.status === 'opening_soon')

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* University Header */}
        <div className="bg-card border rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {uni.logo_image ? (
                <img src={uni.logo_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-10 h-10 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{uni.name}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {getCountryLabel(uni.country)} {uni.city ? `• ${uni.city}` : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {uni.university_type === 'private' ? 'جامعة خاصة' : 'جامعة حكومية'}
                </span>
                {uni.accreditation_status === 'accredited' && (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <BadgeCheck className="w-4 h-4" />
                    معتمدة
                  </span>
                )}
                {uni.website_url && (
                  <a href={uni.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                    <ExternalLink className="w-4 h-4" />
                    الموقع الرسمي
                  </a>
                )}
              </div>
              {uni.description && (
                <p className="text-muted-foreground">{uni.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Intake Status */}
        <div className="bg-card border rounded-2xl p-6 md:p-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            حالة التقديم
          </h4>
          {uniIntakes.length === 0 ? (
            <p className="text-muted-foreground">لا توجد مواعيد تقديم متاحة حالياً</p>
          ) : (
            <div className="space-y-3">
              {uniIntakes.map(intake => (
                <div key={intake.id} className={`rounded-xl p-4 border ${
                  intake.status === 'open' ? 'bg-green-50 border-green-200' :
                  intake.status === 'opening_soon' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {intake.semester_name === 'fall' ? 'الفصل الخريفي' :
                         intake.semester_name === 'spring' ? 'الفصل الربيعي' : 'الفصل الصيفي'}
                      </span>
                      {getIntakeStatusBadge(intake)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">بداية التقديم</p>
                      <p className="font-medium">{formatDate(intake.application_open_date)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">نهاية التقديم</p>
                      <p className="font-medium">{formatDate(intake.application_close_date)}</p>
                    </div>
                    {intake.expected_admission_result_date && (
                      <div>
                        <p className="text-muted-foreground text-xs">نتائج القبول</p>
                        <p className="font-medium">{formatDate(intake.expected_admission_result_date)}</p>
                      </div>
                    )}
                    {intake.semester_start_date && (
                      <div>
                        <p className="text-muted-foreground text-xs">بداية الفصل</p>
                        <p className="font-medium">{formatDate(intake.semester_start_date)}</p>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  {intake.status === 'open' && (() => {
                    const progress = getProgressPercent(intake.application_open_date, intake.application_close_date)
                    const remaining = getDaysRemaining(intake.application_close_date)
                    return (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-green-700 font-medium">
                            {remaining > 0 ? `متبقي ${remaining} يوم` : 'آخر يوم today!'}
                          </span>
                          <span className="text-green-700 font-medium">{100 - progress}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-green-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-l from-green-500 to-green-400 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )
                  })()}

                  {intake.status === 'opening_soon' && (() => {
                    const remaining = getDaysRemaining(intake.application_open_date)
                    const prevClosed = uniIntakes
                      .filter(i => {
                        const iClose = new Date(i.application_close_date)
                        const thisOpen = new Date(intake.application_open_date)
                        return iClose < thisOpen && i.id !== intake.id
                      })
                      .sort((a, b) => b.application_close_date.localeCompare(a.application_close_date))[0]
                    const startDate = prevClosed
                      ? prevClosed.application_close_date
                      : new Date(new Date(intake.application_open_date).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    const progress = getProgressPercent(startDate, intake.application_open_date)
                    return (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-amber-700 font-medium">
                            {remaining > 0 ? `يفتح بعد ${remaining} يوم` : 'يفتح قريباً!'}
                          </span>
                          <span className="text-amber-700 font-medium">{progress}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-l from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )
                  })()}

                  {intake.status === 'closed' && (() => {
                    const nextIntakes = uniIntakes
                      .filter(i => getDaysRemaining(i.application_open_date) > 0)
                      .sort((a, b) => a.application_open_date.localeCompare(b.application_open_date))
                    const nextIntake = nextIntakes.length > 0 ? nextIntakes[0] : null
                    if (nextIntake) {
                      const remaining = getDaysRemaining(nextIntake.application_open_date)
                      const closeDate = new Date(intake.application_close_date)
                      closeDate.setHours(0, 0, 0, 0)
                      const nextOpenDate = new Date(nextIntake.application_open_date)
                      nextOpenDate.setHours(0, 0, 0, 0)
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      const totalGap = nextOpenDate - closeDate
                      const elapsed = today - closeDate
                      const progress = totalGap > 0 ? Math.min(100, Math.max(0, (elapsed / totalGap) * 100)) : 0
                      return (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-red-600 font-medium">
                              سيفتح بعد {remaining} يوم
                            </span>
                            <span className="text-red-600 font-medium">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-red-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-l from-red-400 to-red-300 rounded-full transition-all duration-500"
                              style={{ width: `${Math.round(progress)}%` }}
                            />
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              ))}
            </div>
          )}
          {openIntake && (() => {
            const remaining = getDaysRemaining(openIntake.application_close_date)
            const progress = getProgressPercent(openIntake.application_open_date, openIntake.application_close_date)
            return (
              <div className="mt-4 p-5 bg-green-100/60 rounded-xl border-2 border-green-300">
                <p className="text-green-800 font-bold flex items-center gap-2 text-lg mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                  التقديم مفتوح الآن!
                </p>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-green-700 font-semibold">
                    يغلق بعد {remaining} يوم
                  </span>
                  <span className="text-green-700 font-semibold">{100 - progress}% متبقي</span>
                </div>
                <div className="w-full h-3 bg-green-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-green-600 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )
          })()}
          {!openIntake && soonIntake && (() => {
            const remaining = getDaysRemaining(soonIntake.application_open_date)
            const prevClosed = uniIntakes
              .filter(i => {
                const iClose = new Date(i.application_close_date)
                const thisOpen = new Date(soonIntake.application_open_date)
                return iClose < thisOpen && i.id !== soonIntake.id
              })
              .sort((a, b) => b.application_close_date.localeCompare(a.application_close_date))[0]
            const startDate = prevClosed
              ? prevClosed.application_close_date
              : new Date(new Date(soonIntake.application_open_date).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            const progress = getProgressPercent(startDate, soonIntake.application_open_date)
            return (
              <div className="mt-4 p-5 bg-yellow-100/60 rounded-xl border-2 border-yellow-300">
                <p className="text-yellow-800 font-bold flex items-center gap-2 text-lg mb-3">
                  <Clock className="w-6 h-6" />
                  التقديم سيفتح قريباً
                </p>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-yellow-700 font-semibold">
                    سيفتح في {formatDate(soonIntake.application_open_date)}
                  </span>
                  <span className="text-yellow-700 font-semibold">{remaining} يوم متبقي</span>
                </div>
                <div className="w-full h-3 bg-yellow-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-yellow-500 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(progress, 3)}%` }}
                  />
                </div>
              </div>
            )
          })()}
          {!openIntake && !soonIntake && uniIntakes.length > 0 && (() => {
            const futureIntakes = uniIntakes.filter(i => getDaysRemaining(i.application_open_date) > 0)
            const nextIntake = futureIntakes.length > 0 ? futureIntakes.sort((a, b) => a.application_open_date.localeCompare(b.application_open_date))[0] : null
            const remaining = nextIntake ? getDaysRemaining(nextIntake.application_open_date) : 0
            const lastClosed = uniIntakes
              .filter(i => i.id !== nextIntake?.id && getDaysRemaining(i.application_close_date) <= 0)
              .sort((a, b) => b.application_close_date.localeCompare(a.application_close_date))[0]
            const startDate = lastClosed ? lastClosed.application_close_date : null
            const progress = startDate && nextIntake ? getProgressPercent(startDate, nextIntake.application_open_date) : 0
            return (
              <div className="mt-4 p-5 bg-red-100/60 rounded-xl border-2 border-red-300">
                <p className="text-red-800 font-bold flex items-center gap-2 text-lg mb-3">
                  <XCircle className="w-6 h-6" />
                  التقديم مغلق حالياً
                </p>
                {nextIntake ? (
                  <>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-red-700 font-semibold">
                        سيفتح في {formatDate(nextIntake.application_open_date)}
                      </span>
                      <span className="text-red-700 font-semibold">{remaining} يوم متبقي</span>
                    </div>
                    <div className="w-full h-3 bg-red-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-l from-red-500 to-red-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(progress, 3)}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-red-700 font-medium">لا توجد مواعيد تقديم قادمة متاحة حتى الآن</p>
                )}
              </div>
            )
          })()}
        </div>

        {/* Programs */}
        <div className="bg-card border rounded-2xl p-6 md:p-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            البرامج الدراسية ({uniPrograms.length})
          </h4>
          {uniPrograms.length === 0 ? (
            <p className="text-muted-foreground">لا توجد برامج دراسية مضافة</p>
          ) : (
            <div className="grid gap-3">
              {uniPrograms.map(p => (
                <div key={p.id} className="bg-secondary/30 rounded-xl p-4 border">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="font-bold">{p.program_name}</h5>
                    <span className="text-sm font-bold text-primary">{p.tuition_fee_original?.toLocaleString()} $</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">المستوى</p>
                      <p>{DEGREE_LABELS[p.degree_level] || p.degree_level}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">المدة</p>
                      <p>{p.duration_years} سنوات</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">اللغة</p>
                      <p>{STUDY_LANGUAGE_LABELS[p.study_language] || p.study_language}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">المنحة</p>
                      <p>{SCHOLARSHIP_LABELS[p.scholarship_type] || 'بدون'}</p>
                    </div>
                  </div>
                  {p.tuition_fee_after_discount && (
                    <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      بعد الخصم: {p.tuition_fee_after_discount.toLocaleString()} $
                    </div>
                  )}
                  {p.min_gpa_percentage && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      أدنى معدل: {p.min_gpa_percentage}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Required Documents */}
        {uniDocs.length > 0 && (
          <div className="bg-card border rounded-2xl p-6 md:p-8">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              المستندات المطلوبة
            </h4>
            <div className="grid gap-2">
              {uniDocs.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    {doc.description && (
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nationality Requirements */}
        {uniReqs.length > 0 && (
          <div className="bg-card border rounded-2xl p-6 md:p-8">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              متطلبات الجنسية
            </h4>
            <div className="grid gap-3">
              {uniReqs.map(req => (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border ${
                    req.severity === 'mandatory'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {req.severity === 'mandatory' ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{req.student_nationality}</p>
                      <p className="text-sm mt-1">{req.condition_text}</p>
                      {req.extra_document_required && (
                        <p className="text-sm mt-1 text-red-600 font-medium">
                          مستند إضافي: {req.extra_document_required}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  const handleBack = () => {
    if (view === 'university') {
      setSelectedUniversity(null)
      setView('country')
    } else if (view === 'country') {
      setSelectedCountry(null)
      setSearchQuery('')
      setFilterMode('all')
      setView('countries')
    }
  }

  const handleSelectCountry = (country) => {
    setSelectedCountry(country)
    setView('country')
  }

  const handleSelectUniversity = (uni) => {
    setSelectedUniversity(uni)
    setView('university')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {renderHeader()}

      {view === 'countries' && (
        <>
          {renderFilterChips()}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {countriesData
              .filter(cd => {
                if (filterMode === 'open') return cd.open > 0
                if (filterMode === 'medicine' || filterMode === 'engineering' || filterMode === 'business' || filterMode === 'it') {
                  return cd.total > 0
                }
                return true
              })
              .map(cd => renderCountryCard(cd))
            }
          </div>
          {countriesData.length === 0 && (
            <div className="text-center py-16">
              <Globe className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد جامعات مضافة بعد</p>
            </div>
          )}
        </>
      )}

      {view === 'country' && (
        <>
          {renderFilterChips()}
          <div className="relative mb-6">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث عن جامعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredUniversities.map(uni => renderUniversityCard(uni))}
          </div>
          {filteredUniversities.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد جامعات تطابق البحث</p>
            </div>
          )}
        </>
      )}

      {view === 'university' && renderUniversityDetail()}
    </div>
  )
}

export default UniversityExplorer
