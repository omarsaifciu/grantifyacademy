import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Users, Award, BookOpen, FileText, MessageCircle, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getUniversityById, updateUniversity, uploadImage, getDrafts, getUniversities } from '@/lib/storage';
import { isAuthenticated } from '@/lib/auth';
import { getLocalizedCity, getLocalizedCountryLabel } from '@/components/admin/UniversitiesManager';
import { SUPPORTED_LOCALES, isRtlLocale } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { SEOHead } from '@/components/seo';
import { generateLocalizedSlug } from '@/lib/seo/slug';

const UniversityPage = () => {
  const { id, slug, locale } = useParams();
  const location = useLocation();
  const identifier = slug || id;
  const rtl = isRtlLocale(locale);
  const [university, setUniversity] = useState(null);
  const [hiddenForUsers, setHiddenForUsers] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxZoom, setLightboxZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [offsetStart, setOffsetStart] = useState({ x: 0, y: 0 });
  const [canEdit, setCanEdit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [blockLocale, setBlockLocale] = useState(SUPPORTED_LOCALES[0]);

  const galleryRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const dragState = useRef({ isDragging: false, startX: 0, scrollStartX: 0, wasDragged: false });

  const handleGalleryMouseDown = (e) => {
    dragState.current.isDragging = true;
    dragState.current.startX = e.pageX;
    dragState.current.scrollStartX = galleryRef.current.scrollLeft;
    dragState.current.wasDragged = false;
  };

  const handleGalleryMouseMove = (e) => {
    const ds = dragState.current;
    if (!ds.isDragging) return;
    e.preventDefault();
    const deltaX = e.pageX - ds.startX;
    if (Math.abs(deltaX) > 5) ds.wasDragged = true;
    galleryRef.current.scrollLeft = ds.scrollStartX - deltaX;
  };

  const handleGalleryMouseUp = () => {
    dragState.current.isDragging = false;
  };

  const handleGalleryMouseLeave = () => {
    dragState.current.isDragging = false;
  };

  const handleChildClick = (idx) => () => {
    if (dragState.current.wasDragged) return;
    setLightboxIndex(idx);
  };

  const scrollGalleryTo = (idx) => {
    const container = galleryRef.current;
    if (!container) return;
    const child = container.children[idx];
    if (!child) return;
    const targetLeft = child.offsetLeft;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
  };

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el || !university?.images?.length) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        const multiplier = e.deltaMode === 1 ? 32 : 2.5;
        el.scrollLeft += e.deltaY * multiplier;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });

    const handleScroll = () => {
      const children = Array.from(el.children);
      let closest = 0;
      let minDist = Infinity;
      const elRect = el.getBoundingClientRect();
      children.forEach((child, i) => {
        const dist = Math.abs(child.getBoundingClientRect().left - elRect.left);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveDot(closest);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      el.removeEventListener('scroll', handleScroll);
      el.removeEventListener('wheel', handleWheel);
    };
  }, [university?.images?.length]);

  useEffect(() => {
    const load = async () => {
      let data = await getUniversityById(identifier);
      if (!data && slug) {
        const all = await getUniversities();
        data = all.find(u => u.slug === slug || generateLocalizedSlug(u.translations?.en?.name || u.name || '', 'en') === slug);
      }
      setUniversity(data);
      let isAuth = false;
      try { const ok = await isAuthenticated(); isAuth = !!ok; setCanEdit(isAuth) } catch {}
      try {
        const drafts = await getDrafts('university');
        const isDraft = (drafts || []).some((d) => d.id === data?.id);
        setHiddenForUsers(isDraft && !isAuth);
      } catch {}
      if (data?.content) {
        const container = document.createElement('div');
        container.innerHTML = data.content;
        const flat = [];
        container.querySelectorAll('h3, p, .content-slider').forEach((el) => {
          if (el.tagName === 'H3') flat.push({ type: 'h3', text: el.textContent || '' });
          else if (el.tagName === 'P') flat.push({ type: 'p', text: el.textContent || '' });
          else if (el.classList.contains('content-slider')) {
            const imgs = Array.from(el.querySelectorAll('img')).map((img) => img.getAttribute('src') || '');
            flat.push({ type: 'slider', images: imgs });
          }
        });
        const transl = data?.translations || {};
        const sections = [];
        let i = 0;
        while (i < flat.length) {
          if (flat[i].type === 'h3' && i + 1 < flat.length && flat[i + 1].type === 'p') {
            sections.push({ type: 'section', heading: flat[i].text, paragraph: flat[i + 1].text });
            i += 2;
          } else if (flat[i].type === 'slider') {
            sections.push(flat[i]);
            i += 1;
          } else {
            if (flat[i].type === 'h3') sections.push({ type: 'section', heading: flat[i].text, paragraph: '' });
            else sections.push({ type: 'section', heading: '', paragraph: flat[i].text });
            i += 1;
          }
        }
        const translKeys = Object.keys(transl);
        const firstBlocks = translKeys.length ? transl[translKeys[0]]?.contentBlocks : null;
        const isOldFormat = firstBlocks && firstBlocks.length > 0 && (firstBlocks[0]?.type === 'h3' || firstBlocks[0]?.type === 'p');
        const enriched = sections.map((s, idx) => {
          if (s.type !== 'section') return s;
          const headingText = {};
          const paragraphText = {};
          if (isOldFormat) {
            translKeys.forEach(loc => {
              const list = transl[loc]?.contentBlocks || [];
              let h3Idx = idx * 2;
              while (h3Idx < list.length && list[h3Idx]?.type !== 'h3') h3Idx++;
              const pIdx = h3Idx + 1;
              headingText[loc] = (list[h3Idx]?.text || '');
              paragraphText[loc] = (pIdx < list.length && list[pIdx]?.type === 'p' ? list[pIdx].text : '');
            });
          } else {
            translKeys.forEach(loc => {
              const list = transl[loc]?.contentBlocks || [];
              if (list[idx]?.type === 'section') {
                headingText[loc] = list[idx].heading || '';
                paragraphText[loc] = list[idx].paragraph || '';
              }
            });
          }
          if (Object.keys(headingText).length === 0) SUPPORTED_LOCALES.forEach(loc => headingText[loc] = s.heading);
          if (Object.keys(paragraphText).length === 0) SUPPORTED_LOCALES.forEach(loc => paragraphText[loc] = s.paragraph);
          return { ...s, heading: headingText, paragraph: paragraphText };
        });
        setBlocks(enriched);
      }
    };
    load();
  }, [identifier]);

  useEffect(() => {
    if (!editMode || !university) return;
    const idTimer = setInterval(async () => {
      const getText = (t) => typeof t === 'object' ? (t?.[locale] || t?.ar || '') : (t || '');
      const html = blocks.map((b) => {
        if (b.type==='section') return `<h3 class="text-xl font-bold mb-4 text-foreground">${getText(b.heading)}</h3><p class="text-muted-foreground mb-6">${getText(b.paragraph)}</p>`;
        if (b.type==='slider') return `<div class="content-slider">${(b.images||[]).map((src)=>`<img src="${src}" loading="lazy" alt="" />`).join('')}</div>`;
        return '';
      }).join('');
      const contentBlocks = blocks.map(b => {
        if (b.type === 'slider') return b;
        return { type: 'section', heading: b.heading?.[locale] || '', paragraph: b.paragraph?.[locale] || '' };
      });
      const updatedTranslations = { ...(university.translations || {}) };
      if (!updatedTranslations[locale]) updatedTranslations[locale] = {};
      updatedTranslations[locale] = { ...updatedTranslations[locale], contentBlocks };
      const updated = await updateUniversity(university.id, { ...university, content: html, translations: updatedTranslations });
      setUniversity(updated);
    }, 10000);
    return () => clearInterval(idTimer);
  }, [editMode, blocks, university]);

  const seoSlug = useMemo(() => {
    if (slug) return slug;
    const name = university?.translations?.[locale]?.name || university?.name || '';
    return generateLocalizedSlug(name, locale);
  }, [slug, university, locale]);

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxZoom(false);
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
    setIsPanning(false);
  };

  const resetZoom = () => {
    setLightboxZoom(false);
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
    setIsPanning(false);
  };

  const prevImage = () => {
    setLightboxIndex(i => i - 1);
    resetZoom();
  };

  const nextImage = () => {
    setLightboxIndex(i => i + 1);
    resetZoom();
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (!lightboxZoom) {
      setLightboxZoom(true);
      setZoomLevel(2);
      setOffset({ x: 0, y: 0 });
    } else {
      resetZoom();
    }
  };

  const handleWheel = (e) => {
    if (!lightboxZoom) return;
    e.stopPropagation();
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.5 : 0.5;
    setZoomLevel(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleMouseDown = (e) => {
    if (!lightboxZoom) return;
    e.preventDefault();
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
    setOffsetStart({ ...offset });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setOffset({
      x: offsetStart.x + (e.clientX - panStart.x),
      y: offsetStart.y + (e.clientY - panStart.y),
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  if (hiddenForUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-xl">{t(locale, 'page_unavailable')}</p>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full"
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead page={university} lang={locale} pageType="university" slug={seoSlug} />
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
              <div className="relative w-full max-h-[70vh] md:max-h-[600px]" style={{ aspectRatio: '800/600' }}>
                {university.logo_image && (
                  <div className="absolute top-4 right-4 z-10">
                    <img src={university.logo_image} alt="Logo" className="h-14 md:h-20 w-auto object-contain rounded-lg shadow-lg bg-white/90 p-2" />
                  </div>
                )}
                <img
                  src={university.image}
                  alt={`${university?.translations?.[locale]?.name || university.name} - Campus`}
                  className="w-full h-full object-cover"
                  width="800"
                  height="600"
                  loading="eager"
                  fetchpriority="high"
                  onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 600%22><rect width=%22800%22 height=%22600%22 fill=%22%23e5e7eb%22/></svg>'; }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-8 right-8 left-8">
                  <h1 className="text-5xl font-black text-white mb-4">{university?.translations?.[locale]?.name || university.name}</h1>
                  <div className="flex items-center gap-2 text-gray-200">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">
                      {getLocalizedCountryLabel(university.country, locale)} • {getLocalizedCity(university.city, locale) || '—'}
                    </span>
                  </div>
                </div>
              </div>
              {university.images && university.images.length > 0 && (
                <div className="px-8 md:px-12 pt-6">
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                    <div
                      ref={galleryRef}
                      className="relative flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-proximity scroll-smooth pb-2 select-none cursor-grab active:cursor-grabbing"
                      onMouseDown={handleGalleryMouseDown}
                      onMouseMove={handleGalleryMouseMove}
                      onMouseUp={handleGalleryMouseUp}
                      onMouseLeave={handleGalleryMouseLeave}
                    >
                      {university.images.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 60 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: '-80px' }}
                          transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                          className="snap-start shrink-0 cursor-pointer"
                          onClick={handleChildClick(idx)}
                        >
                          <div className="w-72 md:w-80 aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-secondary/50 group relative">
                            <img
                              src={img}
                              alt={`${university?.translations?.[locale]?.name || university.name} gallery ${idx + 1}`}
                              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-[1deg]"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                              {idx + 1} / {university.images.length}
                            </div>
                          </div>
                        </motion.div>
                       ))}
                     </div>
                     {rtl ? (
                       activeDot < university.images.length - 1 ? (
                         <button onClick={() => scrollGalleryTo(activeDot + 1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-primary text-5xl md:text-6xl opacity-60 hover:opacity-100 select-none transition-all duration-300" style={{ marginTop: '-10px' }}>›</button>
                       ) : null
                     ) : (
                       activeDot > 0 ? (
                         <button onClick={() => scrollGalleryTo(activeDot - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-primary text-5xl md:text-6xl opacity-60 hover:opacity-100 select-none transition-all duration-300" style={{ marginTop: '-10px' }}>‹</button>
                       ) : null
                     )}
                     {rtl ? (
                       activeDot > 0 ? (
                         <button onClick={() => scrollGalleryTo(activeDot - 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-primary text-5xl md:text-6xl opacity-60 hover:opacity-100 select-none transition-all duration-300" style={{ marginTop: '-10px' }}>‹</button>
                       ) : null
                     ) : (
                       activeDot < university.images.length - 1 ? (
                         <button onClick={() => scrollGalleryTo(activeDot + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-primary text-5xl md:text-6xl opacity-60 hover:opacity-100 select-none transition-all duration-300" style={{ marginTop: '-10px' }}>›</button>
                       ) : null
                     )}
                     <div className="flex justify-center items-center gap-1.5 mt-4">
                       {university.images.map((_, idx) => (
                         <button
                           key={idx}
                           onClick={() => scrollGalleryTo(idx)}
                           className={`rounded-full transition-all duration-500 ease-out ${
                             idx === activeDot
                               ? 'w-7 h-2 bg-primary'
                               : 'w-2 h-2 bg-primary/30 hover:bg-primary/50'
                           }`}
                         />
                       ))}
                     </div>
                  </div>
                </div>
              )}
              <div className="p-8 md:p-12">
                {canEdit && (
                  <div className="flex justify-end mb-4">
                    <Button variant="outline" onClick={() => setEditMode((v) => !v)}>{editMode ? t(locale, 'scholarship_edit_finish') : t(locale, 'scholarship_edit_mode')}</Button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-secondary/50 p-6 rounded-xl">
                    <Users className="w-8 h-8 text-primary mb-3" />
                    <p className="text-muted-foreground text-sm mb-1">{t(locale, 'university_students_label')}</p>
                    {!editMode ? (
                      <p className="text-2xl font-bold text-foreground">{university?.translations?.[locale]?.students || university.students}</p>
                    ) : (
                      <Input value={university?.translations?.[locale]?.students || ''} onChange={(e)=>setUniversity((prev)=>({ ...prev, translations: { ...prev.translations, [locale]: { ...(prev.translations?.[locale]||{}), students: e.target.value } } }))} placeholder="عدد الطلاب" />
                    )}
                  </div>
                  <div className="bg-secondary/50 p-6 rounded-xl">
                    <BookOpen className="w-8 h-8 text-primary mb-3" />
                    <p className="text-muted-foreground text-sm mb-1">{t(locale, 'university_programs_label')}</p>
                    <p className="text-2xl font-bold text-foreground">{university.programs?.length || 0}</p>
                  </div>
                  <div className="bg-secondary/50 p-6 rounded-xl">
                    <Award className="w-8 h-8 text-primary mb-3" />
                    <p className="text-muted-foreground text-sm mb-1">{t(locale, 'university_rank_label')}</p>
                    {!editMode ? (
                      <p className="text-2xl font-bold text-foreground">{university?.translations?.[locale]?.rank || t(locale, 'university_rank_excellent')}</p>
                    ) : (
                      <Input value={university?.translations?.[locale]?.rank || ''} onChange={(e)=>setUniversity((prev)=>({ ...prev, translations: { ...prev.translations, [locale]: { ...(prev.translations?.[locale]||{}), rank: e.target.value } } }))} placeholder="التصنيف" />
                    )}
                  </div>
                </div>
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-foreground">{t(locale, 'university_about_title')}</h2>
                  {!editMode ? (
                    <p className="text-muted-foreground text-lg leading-relaxed">{university?.translations?.[locale]?.description || university.description}</p>
                  ) : (
                    <textarea className="w-full min-h-[100px] rounded-md border bg-transparent px-3 py-2" value={university?.translations?.[locale]?.description || university.description} onChange={(e)=>setUniversity((prev)=>({ ...prev, translations: { ...prev.translations, [locale]: { ...(prev.translations?.[locale]||{}), description: e.target.value } } }))} placeholder="الوصف" />
                  )}
                </div>
                {university.programs && university.programs.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-foreground">{t(locale, 'university_programs_title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(university?.programsTranslations?.[locale] || university.programs || []).map((program, index) => (
                        <div key={index} className="bg-secondary/50 p-4 rounded-xl hover:bg-accent transition-colors">
                          <p className="text-foreground font-semibold">{program}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!editMode ? (
                  (() => {
                    const contentBlocks = university?.translations?.[locale]?.contentBlocks;
                    if (contentBlocks && contentBlocks.length > 0) {
                      return (
                        <div className="mt-10 space-y-6">
                          {contentBlocks.map((block, idx) => {
                            if (block.type === 'section') return (
                              <div key={idx}>
                                <h3 className="text-xl font-bold text-foreground">{block.heading}</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed mt-2">{block.paragraph}</p>
                              </div>
                            );
                            if (block.type === 'h3') return <h3 key={idx} className="text-xl font-bold text-foreground">{block.text}</h3>;
                            if (block.type === 'p') return <p key={idx} className="text-muted-foreground text-lg leading-relaxed">{block.text}</p>;
                            if (block.type === 'slider') return (
                              <div key={idx} className="content-slider flex gap-3 overflow-x-auto scrollbar-hide py-2">
                                {(block.images || []).map((src, i) => <img key={i} src={src} loading="lazy" alt={`${university.name} image ${i + 1}`} className="w-48 sm:w-56 md:w-64 h-32 sm:h-40 md:h-48 object-cover rounded-xl flex-shrink-0" referrerPolicy="no-referrer" />)}
                              </div>
                            );
                            return null;
                          })}
                        </div>
                      );
                    }
                    return university.content && (
                      <div className="prose prose-lg max-w-none dark:prose-invert mt-10">
                        <div dangerouslySetInnerHTML={{ __html: university.content }} />
                      </div>
                    );
                  })()
                ) : (
                  <div>{/* edit mode content unchanged */}</div>
                )}
                <div className="bg-secondary/50 p-8 rounded-2xl mt-12">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{t(locale, 'university_cta_ready_title')}</h3>
                  <p className="text-muted-foreground mb-6">{t(locale, 'university_cta_ready_text')}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/${locale}/apply`}>
                      <Button size="lg">
                        <FileText className="ml-2 w-5 h-5" />
                        {t(locale, 'university_cta_start_apply')}
                      </Button>
                    </Link>
                    <a href={`https://wa.me/905555555555?text=${encodeURIComponent(`أرغب بالتقديم إلى جامعة: ${university.name}`)}`} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="secondary">
                        <MessageCircle className="ml-2 w-5 h-5" />
                        {t(locale, 'university_cta_apply_whatsapp')}
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
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/90" onClick={closeLightbox} />
          <button className="absolute top-4 right-4 z-20 bg-black/60 rounded-full p-2 text-white hover:text-gray-300" onClick={closeLightbox}>
            <X className="w-8 h-8" />
          </button>
          {rtl ? (
            lightboxIndex < university.images.length - 1 ? (
              <button className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gray-300 text-6xl opacity-70 hover:opacity-100 select-none" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
            ) : null
          ) : (
            lightboxIndex > 0 ? (
              <button className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gray-300 text-6xl opacity-70 hover:opacity-100 select-none" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
            ) : null
          )}
          {rtl ? (
            lightboxIndex > 0 ? (
              <button className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gray-300 text-6xl opacity-70 hover:opacity-100 select-none" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
            ) : null
          ) : (
            lightboxIndex < university.images.length - 1 ? (
              <button className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gray-300 text-6xl opacity-70 hover:opacity-100 select-none" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
            ) : null
          )}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden" onClick={closeLightbox}>
            <img
              src={university.images[lightboxIndex]}
              alt=""
              className="cursor-pointer select-none"
              style={{
                maxWidth: lightboxZoom ? 'none' : '90vw',
                maxHeight: lightboxZoom ? 'none' : '90vh',
                objectFit: lightboxZoom ? 'none' : 'contain',
                transform: lightboxZoom ? `translate(${offset.x}px, ${offset.y}px) scale(${zoomLevel})` : 'none',
                cursor: isPanning ? 'grabbing' : lightboxZoom ? 'grab' : 'pointer',
              }}
              onClick={handleImageClick}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UniversityPage;
