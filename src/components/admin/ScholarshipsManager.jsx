import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/utils';
import { getScholarships, createScholarship, updateScholarship, deleteScholarship, uploadImage, getDrafts, saveDraft, deleteDraft } from '@/lib/storage';
import { validatePageBeforePublish } from '@/lib/seo/heading';
import { generateScholarshipSchema, validateJSONLDSchema } from '@/lib/seo/jsonld';
import { generateAutoSEODescription } from '@/lib/seo/metadata'
import FocusKeywordsInput from '@/components/admin/FocusKeywordsInput'
import SEOAnalyzer from '@/components/seo/SEOAnalyzer'

const ScholarshipsManager = () => {
  const [scholarships, setScholarships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [blocks, setBlocks] = useState([]);
  const [draftSaving, setDraftSaving] = useState(false);
  const [locales, setLocales] = useState(SUPPORTED_LOCALES);
  const [activeLocale, setActiveLocale] = useState(SUPPORTED_LOCALES[0]);
  const [translations, setTranslations] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
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

  const DraftsList = ({ type, onLoad }) => {
    const [drafts, setDrafts] = React.useState([])
    React.useEffect(() => { (async () => { setDrafts(await getDrafts(type)) })() }, [type])
    return (
      <div className="space-y-2">
        {drafts.length === 0 && <p className="text-muted-foreground">لا توجد مسودات حالياً</p>}
        {drafts.map((d) => (
          <div key={d.id} className="flex items-center justify-between bg-secondary/50 p-3 rounded">
            <div>
              <p className="text-foreground font-semibold">{d.title || 'غير مسمى'}</p>
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
    if (!showForm) return
    const id = setInterval(async () => {
      const formEl = document.querySelector('#scholarship-form')
      if (!formEl) return
      const fd = new FormData(formEl)
      const draft = {
        id: editingScholarship?.id,
        type: fd.get('type'),
        university: fd.get('university'),
        value: fd.get('value'),
        deadline: fd.get('deadline'),
        image: imageUrl || editingScholarship?.image || '',
        requirements: (fd.get('requirements') || '').toString(),
        content: serializeBlocksToHtml(blocks),
        translations,
      }
      await saveDraft('scholarship', draft)
    }, 10000)
    return () => clearInterval(id)
  }, [showForm, blocks, imageUrl, editingScholarship])

  useEffect(() => {
    const load = async () => {
      const data = await getScholarships()
      setScholarships(data)
    }
    load()
  }, []);

  useEffect(() => {
    const transl = editingScholarship?.translations || {}
    setTranslations(transl)
    if (editingScholarship?.content) {
      setBlocks(deserializeHtmlToBlocks(editingScholarship.content, transl))
    } else if (!editingScholarship) {
      setBlocks([])
    }
  }, [editingScholarship])

  const serializeBlocksToHtml = (items) => {
    const getText = (t) => typeof t === 'object' ? (t?.ar || t?.en || '') : (t || '')
    return items.map((b) => {
      if (b.type === 'section') return `<h3 class=\"text-xl font-bold mb-4 text-foreground\">${getText(b.heading)}</h3><p class=\"text-muted-foreground mb-6\">${getText(b.paragraph)}</p>`;
      if (b.type === 'slider') return `<div class=\"content-slider\">${(b.images || []).map((src) => `<img src=\"${src}\" loading=\"lazy\" alt=\"\" />`).join('')}</div>`;
      return '';
    }).join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contentHtml = serializeBlocksToHtml(blocks);

    // Validate heading structure and content blocks
    const pageValidation = validatePageBeforePublish({ type: 'scholarship', translations }, contentHtml)
    if (!pageValidation.valid) {
      pageValidation.errors.forEach(err => toast({ title: `خطأ في هيكل الصفحة: ${err.message}`, variant: 'destructive' }))
      return
    }

    // Validate JSON-LD schema for all 20 languages
    try {
      const baseLoc = DEFAULT_LOCALE
      const tBase = translations[baseLoc] || {}
      const basePayload = {
        title: tBase.title || editingScholarship?.title || '',
        description: tBase.description || editingScholarship?.description || '',
      }
      
      // Get validation for each language
      const allValidationResults = []
      for (const lang of Object.keys(translations)) {
        const schema = generateScholarshipSchema(basePayload, lang, '')
        const result = validateJSONLDSchema(schema, lang)
        allValidationResults.push({ lang, result })
      }
      
      const jsonldErrors = allValidationResults
        .filter(({ result }) => !result.valid)
        .flatMap(({ lang, result }) => 
          result.errors.map(err => `اللغة ${lang}: ${err}`)
        )
      
      if (jsonldErrors.length > 0) {
        jsonldErrors.forEach(err => toast({ title: `خطأ في JSON-LD: ${err}`, variant: 'destructive' }))
        return
      }
    } catch (err) {
      toast({ title: `خطأ في التحقق من JSON-LD: ${err.message}`, variant: 'destructive' })
      return
    }

    const baseLoc = DEFAULT_LOCALE
    const tBase = translations[baseLoc] || {}
    const payload = {
      title: tBase.title || editingScholarship?.title || '',
      type: formData.get('type'),
      university: formData.get('university'),
      value: formData.get('value'),
      deadline: formData.get('deadline'),
      image: imageUrl || editingScholarship?.image || '',
      description: tBase.description || editingScholarship?.description || '',
      requirements: formData.get('requirements').split('\n').filter(r => r.trim()),
      content: contentHtml,
      translations,
    }

    if (editingScholarship) {
      await updateScholarship(editingScholarship.id, payload)
      toast({ title: "تم تحديث المنحة بنجاح!" })
    } else {
      await createScholarship(payload)
      toast({ title: "تم إضافة المنحة بنجاح!" })
    }

    const data = await getScholarships()
    setScholarships(data)
    setEditingScholarship(null)
    setShowForm(false)
    setImageUrl(null)
  };

  const handleDelete = async (id) => {
    await deleteScholarship(id)
    const data = await getScholarships()
    setScholarships(data)
    toast({ title: "تم حذف المنحة بنجاح!" })
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">إدارة المنح الدراسية</h2>
        <Button
          onClick={() => {
            setEditingScholarship(null);
            setShowForm((prev) => !prev);
            setImageUrl(null);
          }}
        >
          <Plus className="ml-2 w-5 h-5" />
          إضافة منحة
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-card border rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-4 gradient-text">
            {editingScholarship ? 'تعديل المنحة' : 'إضافة منحة جديدة'}
          </h3>
          <form id="scholarship-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>الترجمات (20 لغة)</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input placeholder="أضف رمز لغة (مثال: en)" onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const code = e.currentTarget.value.trim()
                  if (code && !locales.includes(code)) { setLocales((prev) => [...prev, code]); setActiveLocale(code); e.currentTarget.value=''; }
                }
              }} />
              <Button type="button" variant="outline" onClick={() => { setLocales(SUPPORTED_LOCALES); setActiveLocale(SUPPORTED_LOCALES[0]); }}>إعادة التعيين</Button>
            </div>
            <Tabs value={activeLocale} onValueChange={setActiveLocale} className="mt-3">
              <TabsList className="flex flex-wrap">
                {locales.map((loc) => (
                  <TabsTrigger key={loc} value={loc}>{loc}</TabsTrigger>
                ))}
              </TabsList>
              {locales.map((loc) => (
                <TabsContent key={loc} value={loc}>
                  <div className="flex justify-end mb-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => { setLocales((prev)=>prev.filter((x)=>x!==loc)); const next={...translations}; delete next[loc]; setTranslations(next); }}>
                      حذف هذه اللغة
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>العنوان ({loc})</Label>
                      <Input
                        value={translations[loc]?.title || ''}
                        onChange={(e) => setTranslations((prev) => ({ ...prev, [loc]: { ...(prev[loc]||{}), title: e.target.value } }))}
                        onBlur={async (e) => { const draft = { id: editingScholarship?.id, translations: { ...translations, [loc]: { ...(translations[loc]||{}), title: e.target.value } } }; await saveDraft('scholarship', draft); }}
                        placeholder={`عنوان (${loc})`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>عنوان SEO المُنشأ تلقائياً ({loc})</Label>
                      <div className="text-sm text-muted-foreground bg-secondary/30 p-2 rounded">
                        {(translations[loc]?.title || 'العنوان') + ' | Grantify Academy'}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label>الوصف ({loc})</Label>
                      <textarea
                        className="w-full min-h-[100px] rounded-md border bg-transparent px-3 py-2"
                        value={translations[loc]?.description || ''}
                        onChange={(e) => setTranslations((prev) => ({ ...prev, [loc]: { ...(prev[loc]||{}), description: e.target.value } }))}
                        onBlur={async (e) => { const draft = { id: editingScholarship?.id, translations: { ...translations, [loc]: { ...(translations[loc]||{}), description: e.target.value } } }; await saveDraft('scholarship', draft); }}
                        placeholder={`الوصف (${loc})`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>وصف SEO المُنشأ تلقائياً ({loc})</Label>
                      <div className="text-sm text-muted-foreground bg-secondary/30 p-2 rounded min-h-[40px]">
                        {generateAutoSEODescription(translations[loc]?.description || translations[loc]?.excerpt || translations[loc]?.title || '', loc, 155)}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label>الكلمات المفتاحية (Focus Keywords) ({loc})</Label>
                      <FocusKeywordsInput translations={translations} locale={loc} onChange={setTranslations} />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            </div>
            <div className="mt-4">
              <SEOAnalyzer
                keywords={translations[activeLocale]?.focus_keywords || []}
                title={(translations[activeLocale]?.title || '') + ' | Grantify Academy'}
                description={translations[activeLocale]?.description || translations[activeLocale]?.excerpt || translations[activeLocale]?.title || ''}
                lang={activeLocale}
              />
            </div>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => setShowPreview((v)=>!v)}>{showPreview ? 'إخفاء المعاينة' : 'معاينة'}</Button>
          </div>
          {showPreview && (
            <div className="mt-3 bg-secondary/50 p-4 rounded-xl">
              <h4 className="text-lg font-bold mb-2">معاينة ({activeLocale})</h4>
              <p className="text-foreground font-semibold">{translations[activeLocale]?.title || '[بدون عنوان]'}</p>
              <p className="text-muted-foreground">{translations[activeLocale]?.description || '[بدون وصف]'}</p>
              <p className="text-xs text-muted-foreground mt-2">SEO تلقائي: {(translations[activeLocale]?.title || 'العنوان') + ' | Grantify Academy'} | {(translations[activeLocale]?.description || translations[activeLocale]?.excerpt || 'الوصف التلقائي')}</p>
            </div>
          )}
            <div>
              <Label htmlFor="type">نوع المنحة</Label>
              <Input id="type" name="type" defaultValue={editingScholarship?.type} placeholder="منحة كاملة / منحة جزئية" required />
            </div>
            <div>
              <Label htmlFor="university">الجامعة</Label>
              <Input id="university" name="university" defaultValue={editingScholarship?.university} required />
            </div>
            <div>
              <Label htmlFor="value">قيمة المنحة</Label>
              <Input id="value" name="value" defaultValue={editingScholarship?.value} required />
            </div>
            <div>
              <Label htmlFor="deadline">آخر موعد للتقديم</Label>
              <Input id="deadline" name="deadline" defaultValue={editingScholarship?.deadline} required />
            </div>
            <div>
              <Label htmlFor="image">الصورة</Label>
              <div
                className="mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/50"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0]
                  if (file) {
                    setUploading(true)
                    const url = await uploadImage(file, 'scholarships')
                    setImageUrl(url)
                    setUploading(false)
                    toast({ title: 'تم رفع الصورة' })
                  }
                }}
              >
                {uploading ? (
                  <div className="text-muted-foreground">جارٍ الرفع...</div>
                ) : (
                  <>
                    {(imageUrl || editingScholarship?.image) ? (
                      <img src={imageUrl || editingScholarship?.image} alt="preview" className="mx-auto max-h-40 rounded-md" />
                    ) : (
                      <div className="text-muted-foreground">اسحب وأسقط الصورة هنا أو اضغط للاختيار</div>
                    )}
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setUploading(true)
                      const url = await uploadImage(file, 'scholarships')
                      setImageUrl(url)
                      setUploading(false)
                      toast({ title: 'تم رفع الصورة' })
                    }
                  }}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="requirements">الشروط (كل شرط في سطر)</Label>
              <textarea id="requirements" name="requirements" defaultValue={editingScholarship?.requirements?.join('\n')} className="w-full min-h-[100px] rounded-md border bg-transparent px-3 py-2" required />
            </div>
            <div>
              <Label>محرر المحتوى</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                <Button type="button" variant="outline" onClick={() => setBlocks((prev) => [...prev, { type: 'section', heading: {}, paragraph: {} }])}>إضافة قسم (عنوان + فقرة)</Button>
                <Button type="button" onClick={() => setBlocks((prev) => [...prev, { type: 'slider', images: [] }])}>إضافة سلايدر</Button>
              </div>
              <div className="space-y-4">
                {blocks.map((b, idx) => (
                  <div key={idx} className="bg-secondary/50 p-4 rounded-xl">
                    <div className="flex gap-2 mb-3">
                      <Button type="button" size="sm" variant="outline" onClick={() => setBlocks((prev) => { if (idx===0) return prev; const next=[...prev]; const t=next[idx-1]; next[idx-1]=next[idx]; next[idx]=t; return next; })}>أعلى</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setBlocks((prev) => { if (idx===prev.length-1) return prev; const next=[...prev]; const t=next[idx+1]; next[idx+1]=next[idx]; next[idx]=t; return next; })}>أسفل</Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => setBlocks((prev) => prev.filter((_, i) => i !== idx))}>حذف</Button>
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
                            <Input value={b.heading?.[loc] || ''} onChange={(e) => setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, heading: { ...(typeof x.heading === 'object' ? x.heading : {}), [loc]: e.target.value } } : x))} placeholder={`اكتب العنوان (${loc})`} />
                            <div className="mt-2">
                              <Label>فقرة ({loc})</Label>
                              <textarea className="w-full min-h-[80px] rounded-md border bg-transparent px-3 py-2" value={b.paragraph?.[loc] || ''} onChange={(e) => setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, paragraph: { ...(typeof x.paragraph === 'object' ? x.paragraph : {}), [loc]: e.target.value } } : x))} placeholder={`اكتب النص (${loc})`} />
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
                                <Button type="button" size="sm" variant="outline" onClick={() => setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, images: x.images.filter((_, k) => k !== i2) } : x))}>حذف</Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => setBlocks((prev) => prev.map((x,i) => { if (i!==idx) return x; const imgs=[...x.images]; if (i2>0){ const t=imgs[i2-1]; imgs[i2-1]=imgs[i2]; imgs[i2]=t; } return { ...x, images: imgs }; }))}>أعلى</Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => setBlocks((prev) => prev.map((x,i) => { if (i!==idx) return x; const imgs=[...x.images]; if (i2<imgs.length-1){ const t=imgs[i2+1]; imgs[i2+1]=imgs[i2]; imgs[i2]=t; } return { ...x, images: imgs }; }))}>أسفل</Button>
                              </div>
                            </div>
                          ))}
                          <div
                            className="w-32 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={async (e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) { setUploading(true); const url = await uploadImage(file, 'scholarships'); setUploading(false); setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, images: [...(x.images||[]), url] } : x)); toast({ title: 'تم رفع الصورة' }); } }}
                          >
                            {uploading ? 'جارٍ الرفع...' : 'أضف صورة'}
                          </div>
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f=e.target.files?.[0]; if (f){ setUploading(true); const url=await uploadImage(f,'scholarships'); setUploading(false); setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, images: [...(x.images||[]), url] } : x)); toast({ title: 'تم رفع الصورة' }); } }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={uploading}>
                {editingScholarship ? 'تحديث' : 'إضافة'}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setEditingScholarship(null); setShowForm(false); }}>
                إلغاء
              </Button>
              <Button type="button" variant="secondary" onClick={async () => {
                setDraftSaving(true)
                const formEl = document.querySelector('#scholarship-form')
                const fd = formEl ? new FormData(formEl) : new FormData()
                const draft = {
                  id: editingScholarship?.id,
                  title: fd.get('title'),
                  type: fd.get('type'),
                  university: fd.get('university'),
                  value: fd.get('value'),
                  deadline: fd.get('deadline'),
                  image: imageUrl || editingScholarship?.image || '',
                  description: fd.get('description'),
                  requirements: (fd.get('requirements') || '').toString(),
                  content: serializeBlocksToHtml(blocks),
                }
                await saveDraft('scholarship', draft)
                setDraftSaving(false)
                toast({ title: 'تم حفظ المسودة' })
              }} disabled={draftSaving}>حفظ كمسودة</Button>
            </div>
          </form>
          <div className="mt-4">
            <h4 className="text-lg font-bold mb-2">المسودات</h4>
            <DraftsList type="scholarship" onLoad={(d) => {
              setEditingScholarship({ ...d })
              setImageUrl(d.image || null)
            }} />
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map((scholarship, index) => (
          <motion.div
            key={scholarship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border rounded-xl overflow-hidden"
          >
            <img
              src={scholarship.image}
              alt={scholarship.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                {scholarship.type}
              </span>
              <h3 className="text-xl font-bold text-foreground mt-3 mb-2">{scholarship.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{scholarship.university}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditingScholarship(scholarship);
                    setShowForm(true);
                  }}
                >
                  <Edit className="w-4 h-4 ml-2" />
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(scholarship.id)}
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipsManager;