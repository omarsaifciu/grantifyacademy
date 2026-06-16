
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Sparkles, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/utils'
import { validatePageBeforePublish } from '@/lib/seo/heading'
import {
  getUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getApplicationIntakes,
  createApplicationIntake,
  updateApplicationIntake,
  deleteApplicationIntake,
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  getRequiredDocuments,
  createRequiredDocument,
  updateRequiredDocument,
  deleteRequiredDocument,
  getProgramRequiredDocuments,
  addProgramRequiredDocument,
  updateProgramRequiredDocument,
  deleteProgramRequiredDocument,
  getNationalityRequirements,
  createNationalityRequirement,
  updateNationalityRequirement,
  deleteNationalityRequirement,
  uploadImage,
  getDrafts,
  saveDraft,
  deleteDraft,
  computeIntakeStatus,
  getAiSkills,
  updateAiSkills
} from '@/lib/storage'
import { Mistral } from '@mistralai/mistralai'

const COUNTRIES = [
  { value: 'China', label: 'الصين' },
  { value: 'Cyprus', label: 'قبرص' },
  { value: 'Georgia', label: 'جورجيا' },
  { value: 'Malaysia', label: 'ماليزيا' },
  { value: 'Germany', label: 'ألمانيا' },
  { value: 'UK', label: 'البريطانيا' },
  { value: 'Italy', label: 'إيطاليا' },
  { value: 'Rwanda', label: 'رواندا' },
  { value: 'Syria', label: 'سوريا' },
  { value: 'Yemen', label: 'اليمن' },
  { value: 'Egypt', label: 'مصر' },
  { value: 'Jordan', label: 'الأردن' },
  { value: 'Lebanon', label: 'لبنان' },
  { value: 'Saudi', label: 'السعودية' },
  { value: 'UAE', label: 'الإمارات' },
]

const UNIVERSITY_TYPES = [
  { value: 'public', label: 'حكومية' },
  { value: 'private', label: 'خاصة' },
]

const ACCREDITATION_OPTIONS = [
  { value: 'international', label: 'معتمدة دولياً' },
  ...COUNTRIES.map(c => ({ value: c.value, label: `معتمدة في ${c.label}` })),
]

const SEMESTERS = [
  { value: 'fall', label: 'خريف' },
  { value: 'spring', label: 'ربيع' },
  { value: 'summer', label: 'صيف' },
]

const DEGREE_LEVELS = [
  { value: 'diploma', label: 'دبلوم' },
  { value: 'bachelor', label: 'بكالوريوس' },
  { value: 'master', label: 'ماجستير' },
  { value: 'phd', label: 'دكتوراة' },
]

const STUDY_LANGUAGES = [
  { value: 'english', label: 'إنجليزي' },
  { value: 'chinese', label: 'صيني' },
  { value: 'german', label: 'ألماني' },
  { value: 'italian', label: 'إيطالي' },
  { value: 'turkish', label: 'تركي' },
  { value: 'other', label: 'آخر' },
]

const SCHOLARSHIP_TYPES = [
  { value: 'none', label: 'بدون' },
  { value: '25', label: 'منحة جزئية 25%' },
  { value: '50', label: 'منحة جزئية 50%' },
  { value: '75', label: 'منحة جزئية 75%' },
  { value: 'full', label: 'منحة كاملة' },
]

const LANGUAGE_REQUIREMENTS = [
  { value: 'none', label: 'لا يشترط' },
  { value: 'ielts_toefl', label: 'يشترط IELTS أو TOEFL' },
  { value: 'preparatory_year', label: 'سنة تحضيرية متاحة' },
  { value: 'internal_test', label: 'اختبار داخلي' },
]

const INTAKE_STATUS_LABELS = {
  open: { text: 'مفتوح الآن', color: 'bg-green-100 text-green-800' },
  closed: { text: 'مغلق', color: 'bg-red-100 text-red-800' },
  opening_soon: { text: 'يفتح قريباً', color: 'bg-yellow-100 text-yellow-800' },
}

const UniversitiesManager = () => {
  const [universities, setUniversities] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingUniversity, setEditingUniversity] = useState(null)
  const [logoImageUrl, setLogoImageUrl] = useState(null)
  const [heroImageUrl, setHeroImageUrl] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const logoFileInputRef = useRef(null)
  const heroFileInputRef = useRef(null)
  const skillsFileInputRef = useRef(null)
  const [blocks, setBlocks] = useState([])
  const [draftSaving, setDraftSaving] = useState(false)
  const [locales, setLocales] = useState(SUPPORTED_LOCALES)
  const [activeLocale, setActiveLocale] = useState(SUPPORTED_LOCALES[0])
  const [translations, setTranslations] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [intakes, setIntakes] = useState([])
  const [programs, setPrograms] = useState([])
  const [editingIntake, setEditingIntake] = useState(null)
  const [editingProgram, setEditingProgram] = useState(null)
  const [programSortOrder, setProgramSortOrder] = useState('asc')
  const [requiredDocuments, setRequiredDocuments] = useState([])
  const [editingRequiredDocument, setEditingRequiredDocument] = useState(null)
  const [nationalityRequirements, setNationalityRequirements] = useState([])
  const [editingNationalityRequirement, setEditingNationalityRequirement] = useState(null)
  const [activeFormTab, setActiveFormTab] = useState('basic')
  const [isActive, setIsActive] = useState(true)
  const [selectedAccreditations, setSelectedAccreditations] = useState([])
  const { toast } = useToast()

  // AI auto-fill state
  const [showAiDialog, setShowAiDialog] = useState(false)
  const [mistralApiKey, setMistralApiKey] = useState(() => import.meta.env.VITE_MISTRAL_API_KEY || localStorage.getItem('mistral_api_key') || '')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiInstructions, setAiInstructions] = useState('')
  const [aiSkills, setAiSkills] = useState([])
  const [aiNewSkill, setAiNewSkill] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  useEffect(() => { getAiSkills().then(setAiSkills).catch(() => {}) }, [])
  useEffect(() => { updateAiSkills(aiSkills).catch(() => {}) }, [aiSkills])

  const deserializeHtmlToBlocks = (html, transl) => {
    try {
      const container = document.createElement('div')
      container.innerHTML = html || ''
      const flat = []
      container.querySelectorAll('h3, p, .content-slider').forEach((el) => {
        if (el.tagName === 'H3') flat.push({ type: 'h3', text: el.textContent || '' })
        else if (el.tagName === 'P') flat.push({ type: 'p', text: el.textContent || '' })
        else if (el.classList.contains('content-slider')) {
          const imgs = Array.from(el.querySelectorAll('img')).map((img) => img.getAttribute('src') || '')
          flat.push({ type: 'slider', images: imgs })
        }
      })
      const sections = []
      let i = 0
      while (i < flat.length) {
        if (flat[i].type === 'h3' && i + 1 < flat.length && flat[i + 1].type === 'p') {
          sections.push({ type: 'section', heading: flat[i].text, paragraph: flat[i + 1].text })
          i += 2
        } else if (flat[i].type === 'slider') {
          sections.push(flat[i])
          i += 1
        } else {
          if (flat[i].type === 'h3') sections.push({ type: 'section', heading: flat[i].text, paragraph: '' })
          else sections.push({ type: 'section', heading: '', paragraph: flat[i].text })
          i += 1
        }
      }
      if (transl) {
        const translKeys = Object.keys(transl)
        const firstBlocks = translKeys.length ? transl[translKeys[0]]?.contentBlocks : null
        const isOldFormat = firstBlocks && firstBlocks.length > 0 && (firstBlocks[0]?.type === 'h3' || firstBlocks[0]?.type === 'p')
        if (isOldFormat) {
          let oldIdx = 0
          sections.forEach((s) => {
            if (s.type !== 'section') return
            const headingText = {}
            const paragraphText = {}
            translKeys.forEach(loc => {
              const list = transl[loc]?.contentBlocks || []
              let h3Idx = oldIdx
              while (h3Idx < list.length && list[h3Idx]?.type !== 'h3') h3Idx++
              const pIdx = h3Idx + 1
              headingText[loc] = (list[h3Idx]?.text || '')
              paragraphText[loc] = (pIdx < list.length && list[pIdx]?.type === 'p' ? list[pIdx].text : '')
            })
            if (Object.keys(headingText).length === 0) SUPPORTED_LOCALES.forEach(loc => headingText[loc] = s.heading)
            if (Object.keys(paragraphText).length === 0) SUPPORTED_LOCALES.forEach(loc => paragraphText[loc] = s.paragraph)
            s.heading = headingText
            s.paragraph = paragraphText
            oldIdx += 2
          })
        } else {
          sections.forEach((s, idx) => {
            if (s.type !== 'section') return
            const headingText = {}
            const paragraphText = {}
            translKeys.forEach(loc => {
              const list = transl[loc]?.contentBlocks || []
              if (list[idx]?.type === 'section') {
                headingText[loc] = list[idx].heading || ''
                paragraphText[loc] = list[idx].paragraph || ''
              }
            })
            if (Object.keys(headingText).length === 0) SUPPORTED_LOCALES.forEach(loc => headingText[loc] = s.heading)
            if (Object.keys(paragraphText).length === 0) SUPPORTED_LOCALES.forEach(loc => paragraphText[loc] = s.paragraph)
            s.heading = headingText
            s.paragraph = paragraphText
          })
        }
      } else {
        sections.forEach(s => {
          if (s.type !== 'section') return
          const h = s.heading
          const p = s.paragraph
          s.heading = {}
          s.paragraph = {}
          SUPPORTED_LOCALES.forEach(loc => { s.heading[loc] = h; s.paragraph[loc] = p })
        })
      }
      return sections
    } catch {
      return []
    }
  }

  const serializeBlocksToHtml = (items) => {
    const getText = (t) => typeof t === 'object' ? (t?.ar || t?.en || '') : (t || '')
    return items.map((b) => {
      if (b.type === 'section') return `<h3 class="text-xl font-bold mb-4 text-foreground">${getText(b.heading)}</h3><p class="text-muted-foreground mb-6">${getText(b.paragraph)}</p>`
      if (b.type === 'slider') return `<div class="content-slider">${(b.images || []).map((src) => `<img src="${src}" loading="lazy" alt="" />`).join('')}</div>`
      return ''
    }).join('')
  }

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mistral_api_key', mistralApiKey)
  }, [mistralApiKey])

  // AI auto-fill function
  const handleAiAutoFill = async () => {
    if (!mistralApiKey.trim()) {
      toast({ title: 'يرجى إدخال مفتاح API الخاص بـ Mistral AI أولاً!', variant: 'destructive' })
      return
    }
    if (!aiPrompt.trim()) {
      toast({ title: 'يرجى إدخال اسم أو وصف الجامعة!', variant: 'destructive' })
      return
    }
    setAiLoading(true)
    try {
      const client = new Mistral({ apiKey: mistralApiKey, timeout: 180000 })

      const systemPrompt = `You are a helpful university data assistant. You generate detailed, realistic university data in valid JSON format only.

Your response MUST be a single JSON object with the following structure (no extra text, markdown, or explanations):
{
  "university": {
    "name": {"ar": "Arabic name", "en": "English name"},
    "country": "one of: China, Cyprus, Georgia, Malaysia, Germany, UK, Italy, Rwanda, Syria, Yemen, Egypt, Jordan, Lebanon, Saudi, UAE",
    "city": {"ar": "Arabic city name", "en": "English city name"},
    "university_type": "one of: public, private",
    "accreditations": ["array of: international, China, ..."],
    "description": {"ar": "Arabic description", "en": "English description"},
    "website_url": "https://example.com",
    "seo_title": {"ar": "Arabic SEO title", "en": "English SEO title"},
    "seo_description": {"ar": "Arabic SEO description", "en": "English SEO description"}
  },
  "intakes": [
    {
      "semester_name": "one of: fall, spring, summer",
      "application_open_date": "YYYY-MM-DD",
      "application_close_date": "YYYY-MM-DD",
      "expected_admission_result_date": "YYYY-MM-DD or empty string",
      "semester_start_date": "YYYY-MM-DD or empty string"
    }
  ],
  "programs": [
    {
      "program_name": {"ar": "Arabic program name", "en": "English program name"},
      "degree_level": "one of: diploma, bachelor, master, phd",
      "study_language": "one of: english, chinese, german, italian, turkish, other",
      "duration_years": 4,
      "tuition_fee_original": 8500,
      "scholarship_type": "one of: none, 25, 50, 75, full",
      "language_requirement": "one of: none, ielts_toefl, preparatory_year, internal_test",
      "min_gpa_percentage": 70
    }
  ],
  "requiredDocuments": [
    {
      "name": {"ar": "Arabic name", "en": "English name"},
      "description": {"ar": "Arabic description", "en": "English description"}
    }
  ],
  "nationalityRequirements": [
    {
      "student_nationality": "Nationality like 'Sudan' or 'Egypt' etc.",
      "applies_to_destination": "one of: all, China, Cyprus, ...",
      "condition_text": {"ar": "Arabic condition text", "en": "English condition text"},
      "severity": "one of: warning, mandatory"
    }
  ],
  "contentSections": [
    {
      "heading": {"ar": "Arabic heading 1", "en": "English heading 1"},
      "paragraph": {"ar": "Arabic paragraph about heading 1", "en": "English paragraph about heading 1"}
    },
    {
      "heading": {"ar": "Arabic heading 2", "en": "English heading 2"},
      "paragraph": {"ar": "Arabic paragraph about heading 2", "en": "English paragraph about heading 2"}
    }
  ]
}

Important notes:
- All text fields must include BOTH Arabic ("ar") and English ("en") translations
- Generate realistic, plausible data
- Use valid dates
- Include at least 2 intakes, 3 programs, 4 required documents, and 1-2 nationality requirements
- Select 2-5 relevant accreditations
- No extra text outside the JSON object
- contentSections: each section has a heading (short, 2-15 words) followed by its related paragraph (detailed, 30-200 words). Headings MUST be short labels like "Overview", "Admission Requirements", "Campus Life" — NEVER put long paragraph text in a heading. Paragraphs MUST contain detailed descriptive text — NEVER put a short label in a paragraph. Include 3-4 sections.`

      const finalUserPrompt = [
        aiPrompt,
        aiSkills.length > 0 ? `\n\n[المهارات الدائمة - طبقها دائماً]:\n${aiSkills.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : '',
        aiInstructions.trim() ? `\n\n[تعليمات إضافية لهذا الطلب]:\n${aiInstructions.trim()}` : ''
      ].filter(Boolean).join('')

      const response = await client.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: finalUserPrompt }
        ],
        responseFormat: { type: 'json_object' },
        temperature: 0.7
      })

      let aiData
      try {
        aiData = JSON.parse(response.choices[0].message.content)
      } catch (parseErr) {
        throw new Error('فشل تحليل استجابة الذكاء الاصطناعي!')
      }

      // Convert contentSections (heading + paragraph pairs) into section blocks
      if (aiData.contentSections && Array.isArray(aiData.contentSections)) {
        const blocks = [];
        aiData.contentSections.forEach(section => {
          const headingEn = (section.heading?.en || '').trim();
          const paragraphEn = (section.paragraph?.en || '').trim();
          const headingAr = (section.heading?.ar || '').trim();
          const paragraphAr = (section.paragraph?.ar || '').trim();
          const maxHeadingLen = Math.max(headingEn.length, headingAr.length);
          const maxParagraphLen = Math.max(paragraphEn.length, paragraphAr.length);
          if (maxHeadingLen > maxParagraphLen && maxHeadingLen > 120) {
            const temp = section.heading;
            section.heading = section.paragraph;
            section.paragraph = temp;
          }
          blocks.push({ type: 'section', heading: section.heading || {}, paragraph: section.paragraph || {} });
        });
        aiData.contentBlocks = blocks;
      } else if (!aiData.contentBlocks) {
        aiData.contentBlocks = [];
      }

      // === Translate to all 20 locales ===
      const getEnText = (field) => {
        if (typeof field === 'object' && field !== null) return field?.en || field?.ar || '';
        return field || '';
      };

      const shortTexts = {};
      shortTexts['uni_name'] = getEnText(aiData.university.name);
      shortTexts['uni_city'] = getEnText(aiData.university.city);
      shortTexts['uni_description'] = getEnText(aiData.university.description);
      shortTexts['uni_seo_title'] = getEnText(aiData.university.seo_title);
      shortTexts['uni_seo_description'] = getEnText(aiData.university.seo_description);
      (aiData.programs || []).forEach((p, i) => { shortTexts[`prog_${i}_name`] = getEnText(p.program_name); });
      (aiData.requiredDocuments || []).forEach((d, i) => {
        shortTexts[`doc_${i}_name`] = getEnText(d.name);
        shortTexts[`doc_${i}_desc`] = getEnText(d.description);
      });
      (aiData.nationalityRequirements || []).forEach((r, i) => {
        shortTexts[`nat_${i}_text`] = getEnText(r.condition_text);
      });

      const blockTexts = {};
      (aiData.contentBlocks || []).forEach((b, i) => {
        if (b.type === 'section') {
          if (b.heading) blockTexts[`block_${i}_heading`] = getEnText(b.heading);
          if (b.paragraph) blockTexts[`block_${i}_paragraph`] = getEnText(b.paragraph);
        } else if (b.text) {
          blockTexts[`block_${i}_text`] = getEnText(b.text);
        }
      });

      // Truncate long texts to keep prompt small
      const truncate = (obj) => {
        const r = {};
        for (const [k, v] of Object.entries(obj)) r[k] = (v || '').length > 300 ? (v || '').slice(0, 300) + '...' : (v || '');
        return r;
      };

      let translationResults = null;
      try {
        const locs = SUPPORTED_LOCALES.filter(l => l !== 'en')
        translationResults = {};

        // Translate short texts in batches of 3 locales
        const shortBatches = [];
        for (let b = 0; b < locs.length; b += 3) shortBatches.push(locs.slice(b, b + 3));
        for (const batch of shortBatches) {
          const res = await client.chat.complete({
            model: 'mistral-small-latest',
            messages: [
              { role: 'system', content: 'You are a professional translator. Return only valid JSON.' },
              { role: 'user', content: `Translate to ${batch.join(', ')}:\n${JSON.stringify(truncate(shortTexts))}\nReturn {key: {locale: translation}} for ALL ${batch.length} locales.` }
            ],
            responseFormat: { type: 'json_object' },
            temperature: 0.3
          });
          const data = JSON.parse(res.choices[0].message.content);
          for (const key of Object.keys(data)) { if (!translationResults[key]) translationResults[key] = {}; Object.assign(translationResults[key], data[key]); }
        }

        // Translate content blocks 1 locale at a time (concurrently, small calls)
        if (Object.keys(blockTexts).length > 0) {
          await Promise.all(locs.filter(l => l !== 'ar' && l !== 'en').map(async (loc) => {
            try {
              const res = await client.chat.complete({
                model: 'mistral-small-latest',
                messages: [
                  { role: 'system', content: 'You are a translator. Return only valid JSON.' },
                  { role: 'user', content: `Translate to ${loc}:\n${JSON.stringify(blockTexts)}\nReturn JSON with same keys.` }
                ],
                responseFormat: { type: 'json_object' },
                temperature: 0.3
              });
              const data = JSON.parse(res.choices[0].message.content);
              for (const key of Object.keys(data)) {
                if (!translationResults[key]) translationResults[key] = {};
                translationResults[key][loc] = data[key];
              }
            } catch (e) {
              console.warn(`Block translation failed for ${loc}:`, e.message);
            }
          }));
        }
      } catch (transErr) {
        console.warn('Mistral translation failed, using English fallback:', transErr.message)
      }

      const buildAllLocales = (arEnObj, keyPrefix) => {
        const result = {}
        SUPPORTED_LOCALES.forEach(loc => { result[loc] = {} })
        const allFields = [...new Set([...Object.keys(arEnObj.ar || {}), ...Object.keys(arEnObj.en || {})])]
        allFields.forEach(field => {
          const arVal = arEnObj.ar?.[field] ?? ''
          const enVal = arEnObj.en?.[field] ?? ''
          const tKey = `${keyPrefix}_${field}`
          SUPPORTED_LOCALES.forEach(loc => {
            if (loc === 'ar') result[loc][field] = arVal
            else if (loc === 'en') result[loc][field] = enVal
            else result[loc][field] = translationResults?.[tKey]?.[loc] || enVal || ''
          })
        })
        return result
      }

      const baseLoc = DEFAULT_LOCALE
      const enLoc = 'en'
      const transl = buildAllLocales({
        ar: {
          name: aiData.university.name?.ar || aiData.university.name,
          description: aiData.university.description?.ar || aiData.university.description,
          seo_title: aiData.university.seo_title?.ar || aiData.university.seo_title,
          seo_description: aiData.university.seo_description?.ar || aiData.university.seo_description
        },
        en: {
          name: aiData.university.name?.en || aiData.university.name?.ar || aiData.university.name,
          description: aiData.university.description?.en || aiData.university.description?.ar || aiData.university.description,
          seo_title: aiData.university.seo_title?.en || aiData.university.seo_title?.ar || aiData.university.seo_title,
          seo_description: aiData.university.seo_description?.en || aiData.university.seo_description?.ar || aiData.university.seo_description
        }
      }, 'uni')

      // Expand content blocks to all 20 locales
      const expandedBlocks = (aiData.contentBlocks || []).map((b, i) => {
        if (b.type === 'slider') return b;
        const arHeading = b.heading?.ar || b.heading?.en || '';
        const enHeading = b.heading?.en || b.heading?.ar || '';
        const arParagraph = b.paragraph?.ar || b.paragraph?.en || '';
        const enParagraph = b.paragraph?.en || b.paragraph?.ar || '';
        const expandedHeading = { ar: arHeading, en: enHeading };
        const expandedParagraph = { ar: arParagraph, en: enParagraph };
        SUPPORTED_LOCALES.filter(l => l !== 'ar' && l !== 'en').forEach(l => {
          expandedHeading[l] = translationResults?.[`block_${i}_heading`]?.[l] || enHeading || '';
          expandedParagraph[l] = translationResults?.[`block_${i}_paragraph`]?.[l] || enParagraph || '';
        });
        return { type: 'section', heading: expandedHeading, paragraph: expandedParagraph };
      });

      // Add content blocks to translations per locale
      const translWithBlocks = {};
      SUPPORTED_LOCALES.forEach(loc => {
        translWithBlocks[loc] = {
          ...(transl[loc] || {}),
          contentBlocks: expandedBlocks.map(b => {
            if (b.type === 'slider') return b;
            return {
              type: 'section',
              heading: typeof b.heading === 'object' ? (b.heading?.[loc] || b.heading?.en || '') : (b.heading || ''),
              paragraph: typeof b.paragraph === 'object' ? (b.paragraph?.[loc] || b.paragraph?.en || '') : (b.paragraph || '')
            };
          })
        };
      });

      setTranslations(translWithBlocks)
      setBlocks(expandedBlocks)
      setIsActive(true)

      // Open form and set as new university (we'll create it first)
      setShowForm(true)
      setEditingUniversity(null)
      setActiveFormTab('basic')

      // Now, create the university first so we have an id for related data
      const newUni = await createUniversity({
        name: aiData.university.name?.ar || aiData.university.name,
        country: aiData.university.country,
        city: aiData.university.city?.ar || aiData.university.city,
        university_type: aiData.university.university_type,
        accreditation_status: (aiData.university.accreditations && aiData.university.accreditations.length > 0) ? 'accredited' : 'unaccredited',
        accreditations: aiData.university.accreditations || [],
        logo_image: '',
        description: aiData.university.description?.ar || aiData.university.description,
        website_url: aiData.university.website_url,
        is_active: true,
        content: serializeBlocksToHtml(expandedBlocks),
        seo_title: aiData.university.seo_title?.ar || aiData.university.seo_title,
        seo_description: aiData.university.seo_description?.ar || aiData.university.seo_description,
        translations: translWithBlocks
      })

      setEditingUniversity(newUni)
      setUniversities(await getUniversities())

      // Now create intakes, programs, required docs, nationality reqs
      const createdIntakes = []
      for (const intake of aiData.intakes) {
        createdIntakes.push(await createApplicationIntake({ university_id: newUni.id, ...intake }))
      }
      setIntakes(createdIntakes)

      const createdPrograms = []
      for (let i = 0; i < (aiData.programs || []).length; i++) {
        const program = aiData.programs[i];
        createdPrograms.push(await createProgram({
          university_id: newUni.id,
          ...program,
          program_name: program.program_name?.ar || program.program_name,
          is_active: true,
          translations: buildAllLocales({
            ar: { program_name: program.program_name?.ar || program.program_name },
            en: { program_name: program.program_name?.en || program.program_name?.ar || program.program_name }
          }, `prog_${i}`)
        }))
      }
      setPrograms(createdPrograms)

      const createdDocs = []
      for (let i = 0; i < (aiData.requiredDocuments || []).length; i++) {
        const doc = aiData.requiredDocuments[i];
        createdDocs.push(await createRequiredDocument({
          university_id: newUni.id,
          ...doc,
          name: doc.name?.ar || doc.name,
          description: doc.description?.ar || doc.description,
          is_active: true,
          translations: buildAllLocales({
            ar: { name: doc.name?.ar || doc.name, description: doc.description?.ar || doc.description },
            en: { name: doc.name?.en || doc.name?.ar || doc.name, description: doc.description?.en || doc.description?.ar || doc.description }
          }, `doc_${i}`)
        }))
      }
      setRequiredDocuments(createdDocs)

      const createdReqs = []
      for (let i = 0; i < (aiData.nationalityRequirements || []).length; i++) {
        const req = aiData.nationalityRequirements[i];
        createdReqs.push(await createNationalityRequirement({
          university_id: newUni.id,
          ...req,
          condition_text: req.condition_text?.ar || req.condition_text,
          translations: buildAllLocales({
            ar: { condition_text: req.condition_text?.ar || req.condition_text },
            en: { condition_text: req.condition_text?.en || req.condition_text?.ar || req.condition_text }
          }, `nat_${i}`)
        }))
      }
      setNationalityRequirements(createdReqs)

      setShowAiDialog(false)
      setAiPrompt('')
      toast({ title: 'تم ملء البيانات بالكامل بنجاح باستخدام الذكاء الاصطناعي!' })
    } catch (err) {
      console.error(err)
      toast({ title: `خطأ: ${err.message}`, variant: 'destructive' })
    } finally {
      setAiLoading(false)
    }
  }

  const DraftsList = ({ type, onLoad }) => {
    const [drafts, setDrafts] = React.useState([])
    React.useEffect(() => { (async () => { setDrafts(await getDrafts(type)) })() }, [type])
    return (
      <div className="space-y-2">
        {drafts.length === 0 && <p className="text-muted-foreground">لا توجد مسودات حالياً</p>}
        {drafts.map((d) => (
          <div key={d.id} className="flex items-center justify-between bg-secondary/50 p-3 rounded">
            <div>
              <p className="text-foreground font-semibold">{d.name || 'غير مسمى'}</p>
              <p className="text-muted-foreground text-xs">آخر تحديث: {new Date(d.updatedAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onLoad?.(d)}>تحميل</Button>
              <Button size="sm" variant="destructive" onClick={async () => { await deleteDraft(type, d.id); setDrafts(await getDrafts(type)) }}>حذف</Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => {
    const load = async () => {
      const data = await getUniversities()
      setUniversities(data)
    }
    load()
  }, [])

  useEffect(() => {
    const load = async () => {
      const docs = await getRequiredDocuments()
      const reqs = await getNationalityRequirements()
      setRequiredDocuments(docs)
      setNationalityRequirements(reqs)
    }
    load()
  }, [])

  useEffect(() => {
    if (!showForm) return
    const id = setInterval(async () => {
      const formEl = document.getElementById('university-form')
      if (!formEl) return
      const fd = new FormData(formEl)
      const draft = {
        id: editingUniversity?.id,
        country: fd.get('country'),
        city: fd.get('city'),
        university_type: fd.get('university_type'),
        accreditations: selectedAccreditations,
        logo_image: logoImageUrl || editingUniversity?.logo_image || '',
        image: heroImageUrl || editingUniversity?.image || '',
        images: galleryImages,
        website_url: fd.get('website_url'),
        is_active: isActive,
        content: serializeBlocksToHtml(blocks),
        translations,
      }
      await saveDraft('university', draft)
    }, 10000)
    return () => clearInterval(id)
  }, [showForm, blocks, logoImageUrl, heroImageUrl, galleryImages, editingUniversity, translations, isActive, selectedAccreditations])

  useEffect(() => {
    if (editingUniversity) {
      const transl = editingUniversity?.translations || {}
      setTranslations(transl)
      setLogoImageUrl(editingUniversity?.logo_image || null)
      setHeroImageUrl(editingUniversity?.image || null)
      setGalleryImages(Array.isArray(editingUniversity?.images) ? editingUniversity.images : [])
      setBlocks(deserializeHtmlToBlocks(editingUniversity?.content || '', transl))
      setIsActive(editingUniversity?.is_active ?? true)
      // Handle accreditation: if it's an array, use it; if it's a string (old data), convert
      if (Array.isArray(editingUniversity.accreditations)) {
        setSelectedAccreditations(editingUniversity.accreditations)
      } else if (editingUniversity.accreditation_status === 'accredited') {
        // For backward compatibility: if old 'accredited' status, default to international
        setSelectedAccreditations(['international'])
      } else {
        setSelectedAccreditations([])
      }
      const loadRelated = async () => {
        const intakesData = await getApplicationIntakes(editingUniversity.id)
        const programsData = await getPrograms(editingUniversity.id)
        const docsData = await getRequiredDocuments(editingUniversity.id)
        const nationalityReqsData = await getNationalityRequirements(editingUniversity.id)
        setIntakes(intakesData)
        setPrograms(programsData)
        setRequiredDocuments(docsData)
        setNationalityRequirements(nationalityReqsData)
      }
      loadRelated()
    } else {
      setTranslations({})
      setLogoImageUrl(null)
      setHeroImageUrl(null)
      setGalleryImages([])
      setBlocks([])
      setIntakes([])
      setPrograms([])
      setRequiredDocuments([])
      setNationalityRequirements([])
      setActiveFormTab('basic')
      setIsActive(true)
      setSelectedAccreditations([])
    }
  }, [editingUniversity])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const contentHtml = serializeBlocksToHtml(blocks)

    const validation = validatePageBeforePublish({ type: 'university', translations }, contentHtml)
    if (!validation.valid) {
      validation.errors.forEach(err => toast({ title: `تحذير SEO: ${err.message}`, variant: 'destructive' }))
    }

    const baseLoc = DEFAULT_LOCALE
    const tBase = translations[baseLoc] || {}
    const payload = {
      name: tBase.name || editingUniversity?.name || '',
      country: formData.get('country') || 'Cyprus',
      city: formData.get('city') || '',
      university_type: formData.get('university_type') || 'private',
      accreditation_status: selectedAccreditations.length > 0 ? 'accredited' : 'unaccredited',
      accreditations: selectedAccreditations,
      logo_image: logoImageUrl || editingUniversity?.logo_image || '',
      image: heroImageUrl || editingUniversity?.image || '',
      images: galleryImages,
      description: tBase.description || editingUniversity?.description || '',
      website_url: formData.get('website_url') || '',
      is_active: isActive,
      content: contentHtml,
      translations,
    }

    let updatedUni;
    if (editingUniversity) {
      await updateUniversity(editingUniversity.id, payload)
      await deleteDraft('university', editingUniversity.id)
      updatedUni = { ...editingUniversity, ...payload }
      toast({ title: 'تم تحديث الجامعة بنجاح!' })
    } else {
      updatedUni = await createUniversity(payload)
      toast({ title: 'تم إضافة الجامعة بنجاح! يمكنك الآن إضافة مواعيد التقديم والبرامج والمستندات.' })
    }

    const data = await getUniversities()
    setUniversities(data)
    setEditingUniversity(updatedUni)
    // We keep showForm true, and let the user click "إلغاء" when they're done with all tabs
  }

  const handleDelete = async (id) => {
    await deleteUniversity(id)
    const data = await getUniversities()
    setUniversities(data)
    toast({ title: 'تم حذف الجامعة بنجاح!' })
  }

  // Intake handlers
  const handleAddIntake = async () => {
    if (!editingUniversity) return
    const newIntake = {
      university_id: editingUniversity.id,
      semester_name: 'fall',
      application_open_date: new Date().toISOString().split('T')[0],
      application_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expected_admission_result_date: '',
      semester_start_date: '',
    }
    const created = await createApplicationIntake(newIntake)
    setIntakes([...intakes, created])
    setEditingIntake(created) // Immediately start editing so user can see all fields
    toast({ title: 'تم إضافة موعد التقديم!' })
  }

  const handleUpdateIntake = async (id, updates) => {
    await updateApplicationIntake(id, updates)
    setIntakes(intakes.map(i => i.id === id ? { ...i, ...updates } : i))
    toast({ title: 'تم تحديث موعد التقديم!' })
  }

  const handleDeleteIntake = async (id) => {
    await deleteApplicationIntake(id)
    setIntakes(intakes.filter(i => i.id !== id))
    toast({ title: 'تم حذف موعد التقديم!' })
  }

  // Program handlers
  const handleAddProgram = async () => {
    if (!editingUniversity) return
    const newProgram = {
      university_id: editingUniversity.id,
      program_name: '',
      degree_level: 'bachelor',
      study_language: 'english',
      duration_years: 4,
      tuition_fee_original: 0,
      scholarship_type: 'none',
      language_requirement: 'none',
      is_active: true,
      translations: {},
    }
    const created = await createProgram(newProgram)
    setPrograms([...programs, created])
    toast({ title: 'تم إضافة البرنامج!' })
  }

  const handleUpdateProgram = async (id, updates) => {
    await updateProgram(id, updates)
    setPrograms(programs.map(p => p.id === id ? { ...p, ...updates } : p))
    toast({ title: 'تم تحديث البرنامج!' })
  }

  const handleDeleteProgram = async (id) => {
    await deleteProgram(id)
    setPrograms(programs.filter(p => p.id !== id))
    toast({ title: 'تم حذف البرنامج!' })
  }

  const handleToggleProgramDocument = async (programId, docId, isRequired) => {
    const existing = (await getProgramRequiredDocuments(programId)).find(prd => prd.required_document_id === docId)
    if (existing) {
      if (existing.is_required !== isRequired) {
        await updateProgramRequiredDocument(existing.id, { is_required: isRequired })
      }
    } else {
      await addProgramRequiredDocument(programId, docId, isRequired)
    }
    toast({ title: 'تم تحديث المستندات المطلوبة!' })
  }

  // Required Document handlers
  const handleAddRequiredDocument = async () => {
    if (!editingUniversity) return
    const newDoc = {
      university_id: editingUniversity.id,
      name: '',
      description: '',
      is_active: true,
      translations: {},
    }
    const created = await createRequiredDocument(newDoc)
    setRequiredDocuments([...requiredDocuments, created])
    setEditingRequiredDocument(created)
    toast({ title: 'تم إضافة المستند!' })
  }

  const handleUpdateRequiredDocument = async (id, updates) => {
    await updateRequiredDocument(id, updates)
    setRequiredDocuments(requiredDocuments.map(d => d.id === id ? { ...d, ...updates } : d))
    toast({ title: 'تم تحديث المستند!' })
  }

  const handleDeleteRequiredDocument = async (id) => {
    await deleteRequiredDocument(id)
    setRequiredDocuments(requiredDocuments.filter(d => d.id !== id))
    toast({ title: 'تم حذف المستند!' })
  }

  // Nationality Requirement handlers
  const handleAddNationalityRequirement = async () => {
    if (!editingUniversity) return
    const newReq = {
      university_id: editingUniversity.id,
      student_nationality: '',
      applies_to_destination: 'all',
      condition_text: '',
      severity: 'warning',
      translations: {},
    }
    const created = await createNationalityRequirement(newReq)
    setNationalityRequirements([...nationalityRequirements, created])
    toast({ title: 'تم إضافة شرط الجنسية!' })
  }

  const handleUpdateNationalityRequirement = async (id, updates) => {
    await updateNationalityRequirement(id, updates)
    setNationalityRequirements(nationalityRequirements.map(r => r.id === id ? { ...r, ...updates } : r))
    toast({ title: 'تم تحديث شرط الجنسية!' })
  }

  const handleDeleteNationalityRequirement = async (id) => {
    await deleteNationalityRequirement(id)
    setNationalityRequirements(nationalityRequirements.filter(r => r.id !== id))
    toast({ title: 'تم حذف شرط الجنسية!' })
  }

  const sortedPrograms = [...programs].sort((a, b) => {
    const feeA = a.tuition_fee_original || 0
    const feeB = b.tuition_fee_original || 0
    return programSortOrder === 'asc' ? feeA - feeB : feeB - feeA
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">إدارة الجامعات</h2>
        <div className="flex gap-2">
          <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Sparkles className="ml-2 w-5 h-5" />
                إضافة جامعة بالذكاء الاصطناعي
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة جامعة باستخدام الذكاء الاصطناعي</DialogTitle>
                <DialogDescription>
                  أدخل اسم أو وصف الجامعة، وسوف يقوم الذكاء الاصطناعي بملء جميع البيانات تلقائياً!
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {!import.meta.env.VITE_MISTRAL_API_KEY && (
                  <div className="space-y-2">
                    <Label htmlFor="mistral-api-key">مفتاح API Mistral</Label>
                    <Input
                      id="mistral-api-key"
                      type="password"
                      placeholder="أدخل مفتاح API الخاص بك..."
                      value={mistralApiKey}
                      onChange={(e) => setMistralApiKey(e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="ai-prompt">اسم أو وصف الجامعة</Label>
                  <Input
                    id="ai-prompt"
                    placeholder="مثال: جامعة الشرق الادنى في قبرص"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ai-instructions">تعليمات إضافية (اختياري)</Label>
                  <textarea
                    id="ai-instructions"
                    className="w-full min-h-[60px] rounded-md border bg-transparent px-3 py-2 text-sm"
                    placeholder="مثال: ركز على معلومات حديثة من 2026، اهتم بالجانب النفسي للطلاب، اذكر المنح المتاحة..."
                    value={aiInstructions}
                    onChange={(e) => setAiInstructions(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>المهارات الدائمة (تطبق في كل مرة)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {aiSkills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-1 bg-secondary/50 px-3 py-1 rounded-full text-sm">
                        <span>{skill}</span>
                        <button
                          type="button"
                          className="text-destructive hover:text-destructive/80 mr-1"
                          onClick={() => setAiSkills(prev => prev.filter((_, j) => j !== i))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="أضف مهارة جديدة..."
                      value={aiNewSkill}
                      onChange={(e) => setAiNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && aiNewSkill.trim()) {
                          e.preventDefault()
                          setAiSkills(prev => [...prev, aiNewSkill.trim()])
                          setAiNewSkill('')
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (aiNewSkill.trim()) {
                          setAiSkills(prev => [...prev, aiNewSkill.trim()])
                          setAiNewSkill('')
                        }
                      }}
                    >
                      إضافة
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => skillsFileInputRef.current?.click()}
                    >
                      <Upload className="ml-1 w-4 h-4" />
                      رفع ملف
                    </Button>
                    <input
                      ref={skillsFileInputRef}
                      type="file"
                      accept=".txt,.json"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const text = await file.text()
                          let skills = []
                          if (file.name.endsWith('.json')) {
                            const data = JSON.parse(text)
                            skills = Array.isArray(data) ? data : (data.skills || data.maharat || [])
                          } else {
                            skills = [file.name]
                          }
                          if (skills.length > 0) {
                            setAiSkills(prev => [...prev, ...skills])
                            toast({ title: `تم إضافة ${skills.length} مهارة من الملف` })
                          }
                        } catch (err) {
                          toast({ title: 'فشل قراءة الملف', variant: 'destructive' })
                        }
                        e.target.value = ''
                      }}
                    />
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handleAiAutoFill}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="ml-2 w-4 h-4 animate-spin" />
                      جاري توليد البيانات...
                    </>
                  ) : (
                    <>
                      <Sparkles className="ml-2 w-4 h-4" />
                      توليد البيانات تلقائياً
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => {
              setEditingUniversity(null)
              setShowForm(prev => !prev)
              setLogoImageUrl(null)
              setHeroImageUrl(null)
              setGalleryImages([])
            }}
          >
            <Plus className="ml-2 w-5 h-5" />
            إضافة جامعة
          </Button>
        </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-card border rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-4 gradient-text">
            {editingUniversity ? 'تعديل الجامعة' : 'إضافة جامعة جديدة'}
          </h3>

          <Tabs value={activeFormTab} onValueChange={setActiveFormTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
              {editingUniversity && <TabsTrigger value="intakes">مواعيد التقديم</TabsTrigger>}
              {editingUniversity && <TabsTrigger value="programs">البرامج الدراسية</TabsTrigger>}
              {editingUniversity && <TabsTrigger value="documents">المستندات والشروط</TabsTrigger>}
            </TabsList>

            <TabsContent value="basic">
              <form id="university-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">الدولة</Label>
                    <select
                      id="country"
                      name="country"
                      defaultValue={editingUniversity?.country || 'Cyprus'}
                      className="w-full rounded-md border bg-transparent px-3 py-2"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="city">المدينة</Label>
                    <Input id="city" name="city" defaultValue={editingUniversity?.city} />
                  </div>
                  <div>
                    <Label htmlFor="university_type">نوع الجامعة</Label>
                    <select
                      id="university_type"
                      name="university_type"
                      defaultValue={editingUniversity?.university_type || 'private'}
                      className="w-full rounded-md border bg-transparent px-3 py-2"
                    >
                      {UNIVERSITY_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>الاعتمادات</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {ACCREDITATION_OPTIONS.map(opt => (
                        <div key={opt.value} className="flex items-center gap-2 bg-secondary/30 p-2 rounded">
                          <input
                            type="checkbox"
                            id={`accreditation-${opt.value}`}
                            checked={selectedAccreditations.includes(opt.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAccreditations([...selectedAccreditations, opt.value])
                              } else {
                                setSelectedAccreditations(selectedAccreditations.filter(v => v !== opt.value))
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <Label htmlFor={`accreditation-${opt.value}`}>{opt.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="website_url">رابط الموقع</Label>
                    <Input id="website_url" name="website_url" defaultValue={editingUniversity?.website_url} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="is_active">الجامعة نشطة</Label>
                  </div>
                </div>

                <div>
                  <Label>الشعار</Label>
                  <div
                    className="mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/50 relative"
                    onClick={() => logoFileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault()
                      const file = e.dataTransfer.files?.[0]
                      if (file) {
                        setUploading(true)
                        const url = await uploadImage(file, 'universities')
                        setLogoImageUrl(url)
                        setUploading(false)
                        toast({ title: 'تم رفع الصورة' })
                      }
                    }}
                  >
                    {uploading ? (
                      <div className="text-muted-foreground">جارٍ الرفع...</div>
                    ) : (
                      <>
                        {(logoImageUrl || editingUniversity?.logo_image) ? (
                          <div className="relative inline-block">
                            <img src={logoImageUrl || editingUniversity?.logo_image} alt="preview" className="mx-auto max-h-40 rounded-md" />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setLogoImageUrl(null) }}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">اسحب وأسقط الصورة هنا أو اضغط للاختيار</div>
                        )}
                      </>
                    )}
                    <input
                      ref={logoFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setUploading(true)
                          const url = await uploadImage(file, 'universities')
                          setLogoImageUrl(url)
                          setUploading(false)
                          toast({ title: 'تم رفع الصورة' })
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label>الصورة الرئيسية (الهيدر)</Label>
                  <div
                    className="mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/50 relative"
                    onClick={() => heroFileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault()
                      const file = e.dataTransfer.files?.[0]
                      if (file) {
                        setUploading(true)
                        const url = await uploadImage(file, 'universities')
                        setHeroImageUrl(url)
                        setUploading(false)
                        toast({ title: 'تم رفع الصورة الرئيسية' })
                      }
                    }}
                  >
                    {uploading ? (
                      <div className="text-muted-foreground">جارٍ الرفع...</div>
                    ) : (
                      <>
                        {(heroImageUrl || editingUniversity?.image) ? (
                          <div className="relative inline-block">
                            <img src={heroImageUrl || editingUniversity?.image} alt="hero preview" className="mx-auto max-h-40 rounded-md" />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setHeroImageUrl(null) }}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">اسحب وأسقط الصورة الرئيسية هنا أو اضغط للاختيار</div>
                        )}
                      </>
                    )}
                    <input
                      ref={heroFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setUploading(true)
                          const url = await uploadImage(file, 'universities')
                          setHeroImageUrl(url)
                          setUploading(false)
                          toast({ title: 'تم رفع الصورة الرئيسية' })
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label>معرض الصور</Label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative group border rounded-lg overflow-hidden">
                        <img src={img} alt={`gallery ${idx + 1}`} className="w-full h-28 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const next = [...galleryImages];
                              [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                              setGalleryImages(next);
                            }}
                            className="bg-white/80 text-foreground rounded p-1 hover:bg-white disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === galleryImages.length - 1}
                            onClick={() => {
                              const next = [...galleryImages];
                              [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                              setGalleryImages(next);
                            }}
                            className="bg-white/80 text-foreground rounded p-1 hover:bg-white disabled:opacity-30"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                            className="bg-destructive/80 text-destructive-foreground rounded p-1 hover:bg-destructive"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    <div
                      className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 min-h-[112px]"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.multiple = true
                        input.onchange = async () => {
                          setUploading(true)
                          for (const file of Array.from(input.files || [])) {
                            const url = await uploadImage(file, 'universities')
                            setGalleryImages(prev => [...prev, url])
                          }
                          setUploading(false)
                          toast({ title: `تم رفع ${input.files?.length || 0} صورة` })
                        }
                        input.click()
                      }}
                    >
                      <span className="text-muted-foreground text-sm">+ إضافة صور</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>الترجمات ({locales.length} لغة)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input placeholder="أضف رمز لغة (مثال: en)" onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const code = e.currentTarget.value.trim()
                        if (code && !locales.includes(code)) { setLocales(prev => [...prev, code]); setActiveLocale(code); e.currentTarget.value = '' }
                      }
                    }} />
                    <Button type="button" variant="outline" onClick={() => { setLocales(SUPPORTED_LOCALES); setActiveLocale(SUPPORTED_LOCALES[0]) }}>إعادة التعيين</Button>
                  </div>
                  <Tabs value={activeLocale} onValueChange={setActiveLocale} className="mt-3">
                    <TabsList className="flex flex-wrap">
                      {locales.map(loc => (
                        <TabsTrigger key={loc} value={loc}>{loc}</TabsTrigger>
                      ))}
                    </TabsList>
                    {locales.map(loc => (
                      <TabsContent key={loc} value={loc}>
                        <div className="flex justify-end mb-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => { setLocales(prev => prev.filter(x => x !== loc)); const nt = { ...translations }; delete nt[loc]; setTranslations(nt) }}>
                            حذف هذه اللغة
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>اسم الجامعة ({loc})</Label>
                            <Input
                              value={translations[loc]?.name || ''}
                              onChange={(e) => setTranslations(prev => ({ ...prev, [loc]: { ...(prev[loc] || {}), name: e.target.value } }))}
                              placeholder={`اسم (${loc})`}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>عنوان SEO المُنشأ تلقائياً ({loc})</Label>
                            <div className="text-sm text-muted-foreground bg-secondary/30 p-2 rounded">
                              {(translations[loc]?.name || 'الاسم') + ' | Grantify Academy'}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <Label>الوصف ({loc})</Label>
                            <textarea
                              className="w-full min-h-[100px] rounded-md border bg-transparent px-3 py-2"
                              value={translations[loc]?.description || ''}
                              onChange={(e) => setTranslations(prev => ({ ...prev, [loc]: { ...(prev[loc] || {}), description: e.target.value } }))}
                              placeholder={`الوصف (${loc})`}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>وصف SEO المُنشأ تلقائياً ({loc})</Label>
                            <div className="text-sm text-muted-foreground bg-secondary/30 p-2 rounded min-h-[40px]">
                              {translations[loc]?.description || 'الوصف التلقائي سيتم إنشاؤه من المحتوى'}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowPreview(prev => !prev)}>
                    {showPreview ? 'إخفاء المعاينة' : 'معاينة'}
                  </Button>
                </div>
                {showPreview && (
                  <div className="mt-3 bg-secondary/50 p-4 rounded-xl">
                    <h4 className="text-lg font-bold mb-2">معاينة ({activeLocale})</h4>
                    <p className="text-foreground font-semibold">{translations[activeLocale]?.name || '[بدون اسم]'}</p>
                    <p className="text-muted-foreground">{translations[activeLocale]?.description || '[بدون وصف]'}</p>
                  </div>
                )}

                <div>
                  <Label>محرر المحتوى</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    <Button type="button" variant="outline" onClick={() => setBlocks(prev => [...prev, { type: 'section', heading: {}, paragraph: {} }])}>إضافة قسم (عنوان + فقرة)</Button>
                    <Button type="button" onClick={() => setBlocks(prev => [...prev, { type: 'slider', images: [] }])}>إضافة سلايدر</Button>
                  </div>
                  <div className="space-y-4">
                    {blocks.map((b, idx) => (
                      <div key={idx} className="bg-secondary/50 p-4 rounded-xl">
                        <div className="flex gap-2 mb-3">
                          <Button type="button" size="sm" variant="outline" onClick={() => setBlocks(prev => { if (idx === 0) return prev; const next = [...prev]; const t = next[idx - 1]; next[idx - 1] = next[idx]; next[idx] = t; return next })}>أعلى</Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => setBlocks(prev => { if (idx === prev.length - 1) return prev; const next = [...prev]; const t = next[idx + 1]; next[idx + 1] = next[idx]; next[idx] = t; return next })}>أسفل</Button>
                          <Button type="button" size="sm" variant="destructive" onClick={() => setBlocks(prev => prev.filter((_, i) => i !== idx))}>حذف</Button>
                        </div>
                        {b.type === 'section' && (
                          <Tabs value={activeLocale} onValueChange={setActiveLocale}>
                            <TabsList className="flex flex-wrap">
                              {locales.map(loc => (
                                <TabsTrigger key={loc} value={loc}>{loc}</TabsTrigger>
                              ))}
                            </TabsList>
                            {locales.map(loc => (
                              <TabsContent key={loc} value={loc}>
                                <Label>عنوان ({loc})</Label>
                                <Input value={b.heading?.[loc] || ''} onChange={(e) => setBlocks(prev => prev.map((x, i) => i === idx ? { ...x, heading: { ...(typeof x.heading === 'object' ? x.heading : {}), [loc]: e.target.value } } : x))} placeholder={`اكتب العنوان (${loc})`} />
                                <div className="mt-2">
                                  <Label>فقرة ({loc})</Label>
                                  <textarea className="w-full min-h-[80px] rounded-md border bg-transparent px-3 py-2" value={b.paragraph?.[loc] || ''} onChange={(e) => setBlocks(prev => prev.map((x, i) => i === idx ? { ...x, paragraph: { ...(typeof x.paragraph === 'object' ? x.paragraph : {}), [loc]: e.target.value } } : x))} placeholder={`اكتب النص (${loc})`} />
                                </div>
                              </TabsContent>
                            ))}
                          </Tabs>
                        )}
                        {b.type === 'slider' && (
                          <div>
                            <Label>صور السلايدر</Label>
                            <div className="mt-2 flex gap-3 overflow-x-auto scrollbar-hide">
                              {(b.images || []).map((src, i2) => (
                                <div key={i2} className="relative">
                                  <img src={src} alt="" className="w-32 h-24 object-cover rounded" />
                                  <div className="flex gap-1 mt-2">
                                    <Button type="button" size="sm" variant="outline" onClick={() => {
                                      setBlocks(prev => prev.map((x, i) => {
                                        if (i !== idx) return x;
                                        return { ...x, images: x.images.filter((_, k) => k !== i2) };
                                      }));
                                    }}>حذف</Button>
                                    <Button type="button" size="sm" variant="outline" onClick={() => {
                                      setBlocks(prev => prev.map((x, i) => {
                                        if (i !== idx) return x;
                                        const imgs = [...x.images];
                                        if (i2 > 0) {
                                          const t = imgs[i2 - 1];
                                          imgs[i2 - 1] = imgs[i2];
                                          imgs[i2] = t;
                                        }
                                        return { ...x, images: imgs };
                                      }));
                                    }}>أعلى</Button>
                                    <Button type="button" size="sm" variant="outline" onClick={() => {
                                      setBlocks(prev => prev.map((x, i) => {
                                        if (i !== idx) return x;
                                        const imgs = [...x.images];
                                        if (i2 < imgs.length - 1) {
                                          const t = imgs[i2 + 1];
                                          imgs[i2 + 1] = imgs[i2];
                                          imgs[i2] = t;
                                        }
                                        return { ...x, images: imgs };
                                      }));
                                    }}>أسفل</Button>
                                  </div>
                                </div>
                              ))}
                              <label
                                className="w-32 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-secondary/50"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={async (e) => {
                                  e.preventDefault();
                                  const file = e.dataTransfer.files?.[0];
                                  if (file) {
                                    setUploading(true);
                                    const url = await uploadImage(file, 'universities');
                                    setUploading(false);
                                    setBlocks(prev => prev.map((x, i) => {
                                      if (i !== idx) return x;
                                      return { ...x, images: [...(x.images || []), url] };
                                    }));
                                    toast({ title: 'تم رفع الصورة' });
                                  }
                                }}
                              >
                                {uploading ? 'جارٍ الرفع...' : 'أضف صورة'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const f = e.target.files?.[0];
                                    if (f) {
                                      setUploading(true);
                                      const url = await uploadImage(f, 'universities');
                                      setUploading(false);
                                      setBlocks(prev => prev.map((x, i) => {
                                        if (i !== idx) return x;
                                        return { ...x, images: [...(x.images || []), url] };
                                      }));
                                      toast({ title: 'تم رفع الصورة' });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={uploading}>
                    {editingUniversity ? 'تحديث' : 'إضافة'}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={async () => { if (editingUniversity?.id) await deleteDraft('university', editingUniversity.id); setEditingUniversity(null); setShowForm(false) }}>
                    إلغاء
                  </Button>
                  <Button type="button" variant="secondary" onClick={async () => {
                    setDraftSaving(true)
                    const formEl = document.getElementById('university-form')
                    const fd = formEl ? new FormData(formEl) : new FormData()
                    const draft = {
                      id: editingUniversity?.id,
                      country: fd.get('country'),
                      city: fd.get('city'),
                      university_type: fd.get('university_type'),
                      accreditation_status: selectedAccreditations.length > 0 ? 'accredited' : 'unaccredited',
                      accreditations: selectedAccreditations,
                      logo_image: logoImageUrl || editingUniversity?.logo_image || '',
                      image: heroImageUrl || editingUniversity?.image || '',
                      images: galleryImages,
                      website_url: fd.get('website_url'),
                      is_active: isActive,
                      content: serializeBlocksToHtml(blocks),
                      translations,
                    }
                    await saveDraft('university', draft)
                    setDraftSaving(false)
                    toast({ title: 'تم حفظ المسودة' })
                  }} disabled={draftSaving}>حفظ كمسودة</Button>
                </div>
              </form>

              <div className="mt-4">
                <h4 className="text-lg font-bold mb-2">المسودات</h4>
                <DraftsList type="university" onLoad={(d) => {
                  setEditingUniversity(d)
                }} />
              </div>
            </TabsContent>

            <TabsContent value="intakes">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold">مواعيد التقديم</h4>
                <Button onClick={handleAddIntake}>
                  <Plus className="ml-2 w-5 h-5" />
                  إضافة موعد
                </Button>
              </div>
              <div className="space-y-3">
                {intakes.map(intake => {
                  const status = computeIntakeStatus(intake)
                  const isEditing = editingIntake?.id === intake.id
                  return (
                    <div key={intake.id} className="bg-secondary/30 p-4 rounded-xl">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div>
                              <Label>الفصل</Label>
                              <select
                                value={editingIntake.semester_name}
                                onChange={(e) => setEditingIntake({ ...editingIntake, semester_name: e.target.value })}
                                className="w-full rounded-md border bg-transparent px-3 py-2"
                              >
                                {SEMESTERS.map(s => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label>تاريخ فتح التقديم</Label>
                              <Input
                                type="date"
                                value={editingIntake.application_open_date}
                                onChange={(e) => setEditingIntake({ ...editingIntake, application_open_date: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>تاريخ إغلاق التقديم</Label>
                              <Input
                                type="date"
                                value={editingIntake.application_close_date}
                                onChange={(e) => setEditingIntake({ ...editingIntake, application_close_date: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>تاريخ صدور القبول المتوقع</Label>
                              <Input
                                type="date"
                                value={editingIntake.expected_admission_result_date || ''}
                                onChange={(e) => setEditingIntake({ ...editingIntake, expected_admission_result_date: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>تاريخ بداية الفصل</Label>
                              <Input
                                type="date"
                                value={editingIntake.semester_start_date || ''}
                                onChange={(e) => setEditingIntake({ ...editingIntake, semester_start_date: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => { handleUpdateIntake(intake.id, editingIntake); setEditingIntake(null) }}>حفظ</Button>
                            <Button variant="outline" onClick={() => setEditingIntake(null)}>إلغاء</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{SEMESTERS.find(s => s.value === intake.semester_name)?.label}</p>
                            <p className="text-sm text-muted-foreground">
                              فتح: {(() => { const d = new Date(intake.application_open_date); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; })()} - إغلاق: {(() => { const d = new Date(intake.application_close_date); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; })()}
                            </p>
                            {intake.expected_admission_result_date && (
                              <p className="text-sm text-muted-foreground">
                                صدور القبول المتوقع: {(() => { const d = new Date(intake.expected_admission_result_date); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; })()}
                              </p>
                            )}
                            {intake.semester_start_date && (
                              <p className="text-sm text-muted-foreground">
                                بداية الفصل: {(() => { const d = new Date(intake.semester_start_date); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; })()}
                              </p>
                            )}
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${INTAKE_STATUS_LABELS[status].color}`}>
                              {INTAKE_STATUS_LABELS[status].text}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingIntake(intake)}>
                              <Edit className="w-4 h-4 ml-1" /> تعديل
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteIntake(intake.id)}>
                              <Trash2 className="w-4 h-4 ml-1" /> حذف
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="programs">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold">البرامج الدراسية</h4>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setProgramSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
                    ترتيب حسب الرسوم: {programSortOrder === 'asc' ? 'الأقل إلى الأعلى' : 'الأعلى إلى الأقل'}
                  </Button>
                  <Button onClick={handleAddProgram}>
                    <Plus className="ml-2 w-5 h-5" />
                    إضافة برنامج
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {sortedPrograms.map(program => {
                  const isEditing = editingProgram?.id === program.id
                  return (
                    <div key={program.id} className="bg-secondary/30 p-4 rounded-xl">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                              <Label>اسم البرنامج</Label>
                              <Input
                                value={editingProgram.program_name}
                                onChange={(e) => setEditingProgram({ ...editingProgram, program_name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>المستوى</Label>
                              <select
                                value={editingProgram.degree_level}
                                onChange={(e) => setEditingProgram({ ...editingProgram, degree_level: e.target.value })}
                                className="w-full rounded-md border bg-transparent px-3 py-2"
                              >
                                {DEGREE_LEVELS.map(d => (
                                  <option key={d.value} value={d.value}>{d.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label>لغة الدراسة</Label>
                              <select
                                value={editingProgram.study_language}
                                onChange={(e) => setEditingProgram({ ...editingProgram, study_language: e.target.value })}
                                className="w-full rounded-md border bg-transparent px-3 py-2"
                              >
                                {STUDY_LANGUAGES.map(l => (
                                  <option key={l.value} value={l.value}>{l.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label>المدة (سنوات)</Label>
                              <Input
                                type="number"
                                value={editingProgram.duration_years}
                                onChange={(e) => setEditingProgram({ ...editingProgram, duration_years: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>الرسوم الأصلية ($)</Label>
                              <Input
                                type="number"
                                value={editingProgram.tuition_fee_original}
                                onChange={(e) => setEditingProgram({ ...editingProgram, tuition_fee_original: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>الرسوم بعد الخصم ($)</Label>
                              <Input
                                type="number"
                                value={editingProgram.tuition_fee_after_discount || ''}
                                onChange={(e) => setEditingProgram({ ...editingProgram, tuition_fee_after_discount: e.target.value ? Number(e.target.value) : null })}
                              />
                            </div>
                            <div>
                              <Label>نوع المنحة</Label>
                              <select
                                value={editingProgram.scholarship_type}
                                onChange={(e) => setEditingProgram({ ...editingProgram, scholarship_type: e.target.value })}
                                className="w-full rounded-md border bg-transparent px-3 py-2"
                              >
                                {SCHOLARSHIP_TYPES.map(s => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label>أدنى معدل مطلوب (%)</Label>
                              <Input
                                type="number"
                                value={editingProgram.min_gpa_percentage || ''}
                                onChange={(e) => setEditingProgram({ ...editingProgram, min_gpa_percentage: e.target.value ? Number(e.target.value) : null })}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label>شرط اللغة</Label>
                              <select
                                value={editingProgram.language_requirement}
                                onChange={(e) => setEditingProgram({ ...editingProgram, language_requirement: e.target.value })}
                                className="w-full rounded-md border bg-transparent px-3 py-2"
                              >
                                {LANGUAGE_REQUIREMENTS.map(r => (
                                  <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => { handleUpdateProgram(program.id, editingProgram); setEditingProgram(null) }}>حفظ</Button>
                            <Button variant="outline" onClick={() => setEditingProgram(null)}>إلغاء</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{program.program_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {DEGREE_LEVELS.find(d => d.value === program.degree_level)?.label} • {program.tuition_fee_original} $
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingProgram(program)}>
                              <Edit className="w-4 h-4 ml-1" /> تعديل
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteProgram(program.id)}>
                              <Trash2 className="w-4 h-4 ml-1" /> حذف
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold">المستندات المطلوبة (قاعدة)</h4>
                    <Button onClick={handleAddRequiredDocument}>
                      <Plus className="ml-2 w-5 h-5" />
                      إضافة مستند
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {requiredDocuments.map(doc => {
                      const isEditing = editingRequiredDocument?.id === doc.id
                      return (
                        <div key={doc.id} className="bg-secondary/30 p-4 rounded-xl">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div>
                                <Label>اسم المستند</Label>
                                <Input
                                  value={editingRequiredDocument.name}
                                  onChange={(e) => setEditingRequiredDocument({ ...editingRequiredDocument, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>الوصف</Label>
                                <Input
                                  value={editingRequiredDocument.description || ''}
                                  onChange={(e) => setEditingRequiredDocument({ ...editingRequiredDocument, description: e.target.value })}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={() => { handleUpdateRequiredDocument(doc.id, editingRequiredDocument); setEditingRequiredDocument(null) }}>حفظ</Button>
                                <Button variant="outline" onClick={() => setEditingRequiredDocument(null)}>إلغاء</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                {doc.description && <p className="text-sm text-muted-foreground">{doc.description}</p>}
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingRequiredDocument(doc)}>
                                  <Edit className="w-4 h-4 ml-1" /> تعديل
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteRequiredDocument(doc.id)}>
                                  <Trash2 className="w-4 h-4 ml-1" /> حذف
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold">شروط الجنسية</h4>
                    <Button onClick={handleAddNationalityRequirement}>
                      <Plus className="ml-2 w-5 h-5" />
                      إضافة شرط
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {nationalityRequirements.map(req => {
                      const isEditing = editingNationalityRequirement?.id === req.id
                      return (
                        <div key={req.id} className="bg-secondary/30 p-4 rounded-xl">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label>جنسية الطالب</Label>
                                  <Input
                                    value={editingNationalityRequirement.student_nationality}
                                    onChange={(e) => setEditingNationalityRequirement({ ...editingNationalityRequirement, student_nationality: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>ينطبق على</Label>
                                  <select
                                    value={editingNationalityRequirement.applies_to_destination}
                                    onChange={(e) => setEditingNationalityRequirement({ ...editingNationalityRequirement, applies_to_destination: e.target.value })}
                                    className="w-full rounded-md border bg-transparent px-3 py-2"
                                  >
                                    <option value="all">كل الدول</option>
                                    {COUNTRIES.map(c => (
                                      <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="md:col-span-2">
                                  <Label>نص الشرط</Label>
                                  <textarea
                                    className="w-full min-h-[80px] rounded-md border bg-transparent px-3 py-2"
                                    value={editingNationalityRequirement.condition_text}
                                    onChange={(e) => setEditingNationalityRequirement({ ...editingNationalityRequirement, condition_text: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>درجة الخطورة</Label>
                                  <select
                                    value={editingNationalityRequirement.severity}
                                    onChange={(e) => setEditingNationalityRequirement({ ...editingNationalityRequirement, severity: e.target.value })}
                                    className="w-full rounded-md border bg-transparent px-3 py-2"
                                  >
                                    <option value="warning">تنبيه عادي</option>
                                    <option value="mandatory">شرط إلزامي</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={() => { handleUpdateNationalityRequirement(req.id, editingNationalityRequirement); setEditingNationalityRequirement(null) }}>حفظ</Button>
                                <Button variant="outline" onClick={() => setEditingNationalityRequirement(null)}>إلغاء</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">
                                  {req.student_nationality || 'غير محدد'} → {req.applies_to_destination === 'all' ? 'كل الدول' : COUNTRIES.find(c => c.value === req.applies_to_destination)?.label}
                                </p>
                                <p className="text-sm text-muted-foreground">{req.condition_text}</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${req.severity === 'mandatory' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {req.severity === 'mandatory' ? 'إلزامي' : 'تنبيه'}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingNationalityRequirement(req)}>
                                  <Edit className="w-4 h-4 ml-1" /> تعديل
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteNationalityRequirement(req.id)}>
                                  <Trash2 className="w-4 h-4 ml-1" /> حذف
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map((university, index) => {
          const t = university.translations?.[DEFAULT_LOCALE] || {}
          return (
            <motion.div
              key={university.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border rounded-xl overflow-hidden"
            >
              {(university.logo_image || university.image || university.images?.[0]) ? (
                <div className="relative">
                  <img
                    src={university.logo_image || university.image || university.images?.[0]}
                    alt={t.name || university.name}
                    className="w-full h-40 object-cover"
                  />
                  {Array.isArray(university.images) && university.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      +{university.images.length - 1}
                    </span>
                  )}
                </div>
              ) : null}
              <div className="p-4">
                <h3 className="text-xl font-bold text-foreground mb-2">{t.name || university.name}</h3>
                
                <div className="space-y-1 mb-3">
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">الدولة:</span> {COUNTRIES.find(c => c.value === university.country)?.label} • {university.city || '—'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">النوع:</span> {UNIVERSITY_TYPES.find(t => t.value === university.university_type)?.label}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">الاعتمادات:</span> {
                      (() => {
                        const accs = university.accreditations;
                        if (Array.isArray(accs) && accs.length > 0) {
                          return accs
                            .map(val => ACCREDITATION_OPTIONS.find(opt => opt.value === val)?.label)
                            .filter(Boolean)
                            .join('، ');
                        }
                        if (university.accreditation_status === 'accredited') {
                          return 'معتمدة دولياً';
                        }
                        return 'غير محدد';
                      })()
                    }
                  </p>
                  {university.website_url && (
                    <p className="text-muted-foreground text-sm">
                      <span className="font-medium text-foreground">الموقع:</span> <a href={university.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{university.website_url}</a>
                    </p>
                  )}
                  <p className={`text-sm font-medium ${university.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {university.is_active ? '✓ نشطة' : '✗ موقوفة'}
                  </p>
                </div>

                {t.description && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {t.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditingUniversity(university)
                      setShowForm(true)
                    }}
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDelete(university.id)}
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default UniversitiesManager
