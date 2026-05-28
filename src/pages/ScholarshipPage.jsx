import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, DollarSign, GraduationCap, FileText, CheckCircle, MessageCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getScholarshipById, updateScholarship, uploadImage, getDrafts } from '@/lib/storage';
import { isAuthenticated } from '@/lib/auth';
import { buildAlternateLinks } from '@/lib/utils';
import { t } from '@/lib/i18n';

const ScholarshipPage = () => {
  const { id, locale } = useParams();
  const location = useLocation();
  const [scholarship, setScholarship] = useState(null);
  const [hiddenForUsers, setHiddenForUsers] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getScholarshipById(id)
      setScholarship(data)
      try { const ok = await isAuthenticated(); setCanEdit(!!ok) } catch {}
      try {
        const drafts = await getDrafts('scholarship')
        const isDraft = (drafts || []).some((d) => d.id === id)
        setHiddenForUsers(isDraft && !canEdit)
      } catch {}
      if (data?.content) {
        const container = document.createElement('div')
        container.innerHTML = data.content
        const b = []
        container.querySelectorAll('h3').forEach((el) => b.push({ type: 'h3', text: el.textContent || '' }))
        container.querySelectorAll('p').forEach((el) => b.push({ type: 'p', text: el.textContent || '' }))
        container.querySelectorAll('.content-slider').forEach((el) => {
          const imgs = Array.from(el.querySelectorAll('img')).map((img) => img.getAttribute('src') || '')
          b.push({ type: 'slider', images: imgs })
        })
        setBlocks(b)
      }
    }
    load()
  }, [id]);

  useEffect(() => {
    if (!editMode || !scholarship) return
    const idTimer = setInterval(async () => {
      const html = blocks.map((b) => {
        if (b.type==='h3') return `<h3 class="text-2xl font-bold mb-4 text-foreground">${b.text||''}</h3>`
        if (b.type==='p') return `<p class="text-muted-foreground mb-6">${b.text||''}</p>`
        if (b.type==='slider') return `<div class="content-slider">${(b.images||[]).map((src)=>`<img src="${src}" loading="lazy" alt="" />`).join('')}</div>`
        return ''
      }).join('')
      const updated = await updateScholarship(scholarship.id, { ...scholarship, content: html })
      setScholarship(updated)
    }, 10000)
    return () => clearInterval(idTimer)
  }, [editMode, blocks, scholarship])

  if (!scholarship || hiddenForUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-xl">{t(locale, 'page_unavailable')}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{(scholarship?.translations?.[locale]?.seoTitle || scholarship?.translations?.[locale]?.title || scholarship.seoTitle || scholarship.title)} - منح دراسية</title>
        <meta name="description" content={scholarship?.translations?.[locale]?.seoDescription || scholarship?.translations?.[locale]?.description || scholarship.seoDescription || scholarship.description} />
        <link rel="canonical" href={`${window.location.origin}/${locale}${location.pathname.replace(`/${locale}`, '')}`} />
        {buildAlternateLinks(location.pathname.replace(`/${locale}`, '').slice(1)).map((l) => (
          <link key={l.hreflang} rel="alternate" hrefLang={l.hreflang} href={l.href} />
        ))}
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <Link to={`/${locale}/`}>
              <Button variant="ghost" className="mb-8 text-primary hover:text-primary/80">
                <ArrowRight className="ml-2 w-5 h-5" />
                {t(locale, 'back_home')}
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-effect rounded-3xl overflow-hidden"
            >
              <div className="relative h-96 bg-secondary">
                <img
                  src={scholarship.image}
                  alt={scholarship.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 600%22><rect width=%22800%22 height=%22600%22 fill=%22%23e5e7eb%22/></svg>'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute top-8 right-8">
                  <span className="px-6 py-3 bg-primary rounded-full text-lg font-bold text-primary-foreground shadow-2xl">
                    {scholarship.type}
                  </span>
                </div>
                <div className="absolute bottom-8 right-8 left-8">
                  <h1 className="text-5xl font-black text-white mb-4">{scholarship?.translations?.[locale]?.title || scholarship.title}</h1>
                </div>
              </div>

              <div className="p-8 md:p-12">
                {canEdit && (
                  <div className="flex justify-end mb-4">
                    <Button variant="outline" onClick={() => setEditMode((v) => !v)}>{editMode ? t(locale, 'scholarship_edit_finish') : t(locale, 'scholarship_edit_mode')}</Button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-secondary/50 p-6 rounded-xl">
                    <GraduationCap className="w-8 h-8 text-primary mb-3" />
                    <p className="text-muted-foreground text-sm mb-1">الجامعة</p>
                    <p className="text-xl font-bold text-foreground">{scholarship.university}</p>
                  </div>
                  <div className="bg-secondary/50 p-6 rounded-xl">
                    <DollarSign className="w-8 h-8 text-green-500 mb-3" />
                    <p className="text-muted-foreground text-sm mb-1">قيمة المنحة</p>
                    {!editMode ? (
                      <p className="text-xl font-bold text-foreground">{scholarship.value}</p>
                    ) : (
                      <Input value={scholarship.value} onChange={(e) => setScholarship((prev) => ({ ...prev, value: e.target.value }))} />
                    )}
                  </div>
                  <div className="bg-secondary/50 p-6 rounded-xl">
                    <Calendar className="w-8 h-8 text-blue-500 mb-3" />
                    <p className="text-muted-foreground text-sm mb-1">آخر موعد</p>
                    <p className="text-xl font-bold text-foreground">{scholarship.deadline}</p>
                  </div>
                </div>

                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 gradient-text">{t(locale, 'scholarship_details_title')}</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {scholarship?.translations?.[locale]?.description || scholarship.description}
                  </p>
                </div>

                {scholarship.requirements && scholarship.requirements.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 gradient-text">{t(locale, 'scholarship_requirements_title')}</h2>
                    <div className="space-y-3">
                      {scholarship.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                          <p className="text-muted-foreground text-lg">{req}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!editMode ? (
                  scholarship.content && (
                    <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
                      <div dangerouslySetInnerHTML={{ __html: scholarship.content }} />
                    </div>
                  )
                ) : (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Button variant="outline" onClick={() => setBlocks((prev) => [...prev, { type: 'h3', text: '' }])}>إضافة عنوان فرعي</Button>
                      <Button variant="outline" onClick={() => setBlocks((prev) => [...prev, { type: 'p', text: '' }])}>إضافة فقرة</Button>
                      <Button onClick={() => setBlocks((prev) => [...prev, { type: 'slider', images: [] }])}>إضافة سلايدر</Button>
                      <Button variant="secondary" onClick={async () => {
                        const html = blocks.map((b) => {
                          if (b.type==='h3') return `<h3 class=\"text-2xl font-bold mb-4 text-foreground\">${b.text||''}</h3>`
                          if (b.type==='p') return `<p class=\"text-muted-foreground mb-6\">${b.text||''}</p>`
                          if (b.type==='slider') return `<div class=\"content-slider\">${(b.images||[]).map((src)=>`<img src=\"${src}\" loading=\"lazy\" alt=\"\" />`).join('')}</div>`
                          return ''
                        }).join('')
                        const updated = await updateScholarship(scholarship.id, { ...scholarship, content: html })
                        setScholarship(updated); setEditMode(false)
                      }}>حفظ</Button>
                    </div>
                    <div className="space-y-4">
                      {blocks.map((b, idx) => (
                        <div
                          key={idx}
                          className="bg-secondary/50 p-4 rounded-xl"
                          draggable
                          onDragStart={() => setDragIndex(idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (dragIndex === null || dragIndex === idx) return
                            const next = [...blocks]
                            const [moved] = next.splice(dragIndex, 1)
                            next.splice(idx, 0, moved)
                            setBlocks(next)
                            setDragIndex(null)
                          }}
                        >
                          <div className="flex gap-2 mb-3">
                            <Button size="sm" variant="outline" onClick={() => setBlocks((prev)=>{ if(idx===0) return prev; const next=[...prev]; const t=next[idx-1]; next[idx-1]=next[idx]; next[idx]=t; return next; })}>أعلى</Button>
                            <Button size="sm" variant="outline" onClick={() => setBlocks((prev)=>{ if(idx===prev.length-1) return prev; const next=[...prev]; const t=next[idx+1]; next[idx+1]=next[idx]; next[idx]=t; return next; })}>أسفل</Button>
                            <Button size="sm" variant="destructive" onClick={() => setBlocks((prev)=>prev.filter((_,i)=>i!==idx))}>حذف</Button>
                          </div>
                          {b.type==='h3' && (
                            <Input value={b.text} onChange={(e)=>setBlocks((prev)=>prev.map((x,i)=>i===idx?{...x,text:e.target.value}:x))} placeholder="اكتب العنوان" />
                          )}
                          {b.type==='p' && (
                            <textarea className="w-full min-h-[80px] rounded-md border bg-transparent px-3 py-2" value={b.text} onChange={(e)=>setBlocks((prev)=>prev.map((x,i)=>i===idx?{...x,text:e.target.value}:x))} />
                          )}
                          {b.type==='slider' && (
                            <div className="mt-2">
                              <div
                                className="w-32 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={async (e) => {
                                  e.preventDefault()
                                  const file = e.dataTransfer.files?.[0]
                                  if (file) {
                                    const url = await uploadImage(file, 'scholarships')
                                    setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, images: [...(x.images||[]), url] } : x))
                                  }
                                }}
                              >
                                إضافة صورة بالسحب والإفلات
                              </div>
                              <div className="mt-2 flex gap-3 overflow-x-auto scrollbar-hide">
                                {(b.images||[]).map((src,i2)=>(
                                  <div key={i2}>
                                    <img src={src} alt="" className="w-32 h-24 object-cover rounded" />
                                    <div className="flex gap-1 mt-2">
                                      <Button size="sm" variant="outline" onClick={()=>setBlocks((prev)=>prev.map((x,i)=>i===idx?{...x,images:x.images.filter((_,k)=>k!==i2)}:x))}>حذف</Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-secondary/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{t(locale, 'scholarship_ready_title')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t(locale, 'scholarship_ready_text')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/${locale}/apply/${id}`}>
                      <Button size="lg">
                        <FileText className="ml-2 w-5 h-5" />
                        {t(locale, 'scholarship_start_apply')}
                      </Button>
                    </Link>
                    <a
                      href={`https://wa.me/905555555555?text=${encodeURIComponent(`أرغب بالتقديم على منحة: ${scholarship.title} (${id})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="lg" variant="secondary">
                        <MessageCircle className="ml-2 w-5 h-5" />
                        {t(locale, 'scholarship_apply_whatsapp')}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ScholarshipPage;
