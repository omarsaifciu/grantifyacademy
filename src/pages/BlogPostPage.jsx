import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock, FileText, MessageCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadImage } from '@/lib/storage';
import { getBlogPostById, updateBlogPost, getDrafts } from '@/lib/storage';
import { isAuthenticated } from '@/lib/auth';
import { buildAlternateLinks } from '@/lib/utils';

const BlogPostPage = () => {
  const { id, locale } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [hiddenForUsers, setHiddenForUsers] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getBlogPostById(id)
      setPost(data)
      try { const ok = await isAuthenticated(); setCanEdit(!!ok) } catch {}
      try {
        const drafts = await getDrafts('blog')
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
    if (!editMode || !post) return
    const idTimer = setInterval(async () => {
      const html = blocks.map((b) => {
        if (b.type==='h3') return `<h3 class=\"text-2xl font-bold mb-4 text-foreground\">${b.text||''}</h3>`
        if (b.type==='p') return `<p class=\"text-muted-foreground mb-6\">${b.text||''}</p>`
        if (b.type==='slider') return `<div class=\"content-slider\">${(b.images||[]).map((src)=>`<img src=\"${src}\" loading=\"lazy\" alt=\"\" />`).join('')}</div>`
        return ''
      }).join('')
      const updated = await updateBlogPost(post.id, { ...post, content: html })
      setPost(updated)
    }, 10000)
    return () => clearInterval(idTimer)
  }, [editMode, blocks, post])

  if (!post || hiddenForUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-xl">هذه الصفحة غير متاحة حالياً</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{(post?.translations?.[locale]?.seoTitle || post?.translations?.[locale]?.title || post.seoTitle || post.title)} - منح دراسية</title>
        <meta name="description" content={post?.translations?.[locale]?.seoDescription || post?.translations?.[locale]?.excerpt || post.seoDescription || post.excerpt} />
        <link rel="canonical" href={`${window.location.origin}/${locale}${location.pathname.replace(`/${locale}`, '')}`} />
        {/** alternate hreflang links for same content across locales */}
        {buildAlternateLinks(location.pathname.replace(`/${locale}`, '').slice(1)).map((l) => (
          <link key={l.hreflang} rel="alternate" hrefLang={l.hreflang} href={l.href} />
        ))}
      </Helmet>

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
              <div className="relative h-96 bg-secondary">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
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
                      {post.content ? (
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                      ) : (
                        <>
                          <p>هذا نص تجريبي للمقالة...</p>
                        </>
                      )}
                    </div>
                  </div>
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
                        const updated = await updateBlogPost(post.id, { ...post, content: html })
                        setPost(updated); setEditMode(false)
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
                            <div className="mt-2 flex gap-3 overflow-x-auto scrollbar-hide">
                              {(b.images||[]).map((src,i2)=>(
                                <div key={i2}>
                                  <img src={src} alt="" className="w-32 h-24 object-cover rounded" />
                                  <div className="flex gap-1 mt-2">
                                    <Button size="sm" variant="outline" onClick={()=>setBlocks((prev)=>prev.map((x,i)=>i===idx?{...x,images:x.images.filter((_,k)=>k!==i2)}:x))}>حذف</Button>
                                  </div>
                                </div>
                              ))}
                              <div
                                className="w-32 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={async (e) => {
                                  e.preventDefault()
                                  const file = e.dataTransfer.files?.[0]
                                  if (file) {
                                    const url = await uploadImage(file, 'blog')
                                    setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, images: [...(x.images||[]), url] } : x))
                                  }
                                }}
                              >
                                <label htmlFor={`blog-slider-file-${idx}`} className="text-sm text-muted-foreground">أضف صورة</label>
                                <input
                                  id={`blog-slider-file-${idx}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      const url = await uploadImage(file, 'blog')
                                      setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, images: [...(x.images||[]), url] } : x))
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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
                    <a
                      href={`https://wa.me/905555555555?text=${encodeURIComponent(`استفسار من صفحة المدونة: ${post.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
