import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock, FileText, MessageCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { uploadImage, getBlogPostById, updateBlogPost, getDrafts, getBlogPosts } from '@/lib/storage';
import { isAuthenticated } from '@/lib/auth';
import { SUPPORTED_LOCALES } from '@/lib/utils';
import { SEOHead } from '@/components/seo';
import { generateLocalizedSlug } from '@/lib/seo/slug';

const BlogPostPage = () => {
  const { id, slug, locale } = useParams();
  const location = useLocation();
  const identifier = slug || id;
  const [post, setPost] = useState(null);
  const [hiddenForUsers, setHiddenForUsers] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [blockLocale, setBlockLocale] = useState(SUPPORTED_LOCALES[0]);

  useEffect(() => {
    const load = async () => {
      let data = await getBlogPostById(identifier);
      if (!data && slug) {
        const all = await getBlogPosts();
        data = all.find(b => b.slug === slug || generateLocalizedSlug(b.translations?.en?.title || b.title || '', 'en') === slug);
      }
      setPost(data);
      let isAuth = false;
      try { const ok = await isAuthenticated(); isAuth = !!ok; setCanEdit(isAuth) } catch {}
      try {
        const drafts = await getDrafts('blog');
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
    if (!editMode || !post) return;
    const idTimer = setInterval(async () => {
      const getText = (t) => typeof t === 'object' ? (t?.[locale] || t?.ar || '') : (t || '');
      const html = blocks.map((b) => {
        if (b.type==='section') return `<h3 class=\"text-xl font-bold mb-4 text-foreground\">${getText(b.heading)}</h3><p class=\"text-muted-foreground mb-6\">${getText(b.paragraph)}</p>`;
        if (b.type==='slider') return `<div class=\"content-slider\">${(b.images||[]).map((src)=>`<img src="${src}" loading="lazy" alt="" />`).join('')}</div>`;
        return '';
      }).join('');
      const contentBlocks = blocks.map(b => {
        if (b.type === 'slider') return b;
        return { type: 'section', heading: b.heading?.[locale] || '', paragraph: b.paragraph?.[locale] || '' };
      });
      const updatedTranslations = { ...(post.translations || {}) };
      if (!updatedTranslations[locale]) updatedTranslations[locale] = {};
      updatedTranslations[locale] = { ...updatedTranslations[locale], contentBlocks };
      const updated = await updateBlogPost(post.id, { ...post, content: html, translations: updatedTranslations });
      setPost(updated);
    }, 10000);
    return () => clearInterval(idTimer);
  }, [editMode, blocks, post]);

  const seoSlug = useMemo(() => {
    if (slug) return slug;
    const title = post?.translations?.[locale]?.title || post?.title || '';
    return generateLocalizedSlug(title, locale);
  }, [slug, post, locale]);

  if (hiddenForUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-xl">{t(locale, 'page_unavailable')}</p>
      </div>
    );
  }

  if (!post) {
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
      <SEOHead page={post} lang={locale} pageType="blog" slug={seoSlug} />
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to={`/${locale}/`}>
              <Button variant="ghost" className="mb-8 text-primary hover:text-primary/80">
                <ArrowRight className="ml-2 w-5 h-5" />
                العودة للرئيسية
              </Button>
            </Link>
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-effect rounded-3xl overflow-hidden"
            >
              <div className="relative h-96 bg-secondary" style={{ aspectRatio: '800/600' }}>
                <img
                  src={post.image}
                  alt={`${post?.translations?.[locale]?.title || post.title} - Cover`}
                  className="w-full h-full object-cover"
                  width="800"
                  height="600"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  fetchpriority="high"
                  onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 600%22><rect width=%22800%22 height=%22600%22 fill=%22%23e5e7eb%22/></svg>'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              <div className="p-8 md:p-12">
                {canEdit && (
                  <div className="flex justify-end mb-4">
                    <Button variant="outline" onClick={() => setEditMode((v) => !v)}>{editMode ? 'إنهاء التحرير' : 'وضع التحرير'}</Button>
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                  {post?.translations?.[locale]?.title || post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>5 دقائق قراءة</span>
                  </div>
                </div>
                {!editMode ? (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p className="text-xl leading-relaxed mb-8">
                      {post?.translations?.[locale]?.excerpt || post.excerpt}
                    </p>
                    <div className="leading-relaxed space-y-6">
                      {(() => {
                        const contentBlocks = post?.translations?.[locale]?.contentBlocks;
                        if (contentBlocks && contentBlocks.length > 0) {
                          return contentBlocks.map((block, idx) => {
                            if (block.type === 'section') return (
                              <div key={idx}>
                                <h3 className="text-xl font-bold text-foreground">{block.heading}</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed mt-2">{block.paragraph}</p>
                              </div>
                            );
                            if (block.type === 'h3') return <h3 key={idx} className="text-xl font-bold text-foreground">{block.text}</h3>;
                            if (block.type === 'p') return <p key={idx} className="text-muted-foreground text-lg leading-relaxed">{block.text}</p>;
                            if (block.type === 'slider') return (
                              <div key={idx} className="content-slider flex gap-3 overflow-x-auto scrollbar-hide">
                                {(block.images || []).map((src, i) => <img key={i} src={src} loading="lazy" alt={`${post.title} image ${i + 1}`} className="w-64 h-48 object-cover rounded-xl" />)}
                              </div>
                            );
                            return null;
                          });
                        }
                        return post.content ? (
                          <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : (
                          <p>هذا نص تجريبي للمقالة...</p>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div>{/* edit mode content unchanged */}</div>
                )}
                <div className="bg-secondary/50 p-8 rounded-2xl mt-10">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">هل أنت مستعد للتقديم؟</h3>
                  <p className="text-muted-foreground mb-6">لا تفوت هذه الفرصة الذهبية! قدم الآن واحصل على منحة دراسية مجانية</p>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/${locale}/apply`}>
                      <Button size="lg">
                        <FileText className="ml-2 w-5 h-5" />
                        ابدأ التقديم الآن
                      </Button>
                    </Link>
                    <a href={`https://wa.me/905555555555?text=${encodeURIComponent(`استفسار من صفحة المدونة: ${post.title}`)}`} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="secondary">
                        <MessageCircle className="ml-2 w-5 h-5" />
                        التقديم عبر واتساب
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default BlogPostPage;
