import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/utils';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, uploadImage, getDrafts, saveDraft, deleteDraft } from '@/lib/storage';

const deserializeHtmlToBlocks = (html) => {
  try {
    const container = document.createElement('div')
    container.innerHTML = html || ''
    const blocks = []
    container.querySelectorAll('h3').forEach((el) => blocks.push({ type: 'h3', text: el.textContent || '' }))
    container.querySelectorAll('p').forEach((el) => blocks.push({ type: 'p', text: el.textContent || '' }))
    container.querySelectorAll('.content-slider').forEach((el) => {
      const imgs = Array.from(el.querySelectorAll('img')).map((img) => img.getAttribute('src') || '')
      blocks.push({ type: 'slider', images: imgs })
    })
    return blocks
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

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
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
  useEffect(() => {
    if (!showForm) return
    const id = setInterval(async () => {
      const formEl = document.querySelector('#blog-form')
      if (!formEl) return
      const fd = new FormData(formEl)
      const draft = {
        id: editingPost?.id,
        author: fd.get('author'),
        date: fd.get('date'),
        image: imageUrl || editingPost?.image || '',
        content: serializeBlocksToHtml(blocks),
        translations,
      }
      await saveDraft('blog', draft)
    }, 10000)
    return () => clearInterval(id)
  }, [showForm, blocks, imageUrl, editingPost])

  useEffect(() => {
    const load = async () => {
      const data = await getBlogPosts()
      setPosts(data)
    }
    load()
  }, []);

  useEffect(() => {
    setTranslations(editingPost?.translations || {})
  }, [editingPost])

  const serializeBlocksToHtml = (items) => {
    return items.map((b) => {
      if (b.type === 'h3') return `<h3 class=\"text-2xl font-bold mb-4 text-foreground\">${b.text || ''}</h3>`;
      if (b.type === 'p') return `<p class=\"text-muted-foreground mb-6\">${b.text || ''}</p>`;
      if (b.type === 'slider') return `<div class=\"content-slider\">${(b.images || []).map((src) => `<img src=\"${src}\" loading=\"lazy\" alt=\"\" />`).join('')}</div>`;
      return '';
    }).join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contentHtml = serializeBlocksToHtml(blocks);

    const baseLoc = DEFAULT_LOCALE
    const tBase = translations[baseLoc] || {}
    const payload = {
      title: tBase.title || editingPost?.title || '',
      excerpt: tBase.excerpt || editingPost?.excerpt || '',
      author: formData.get('author'),
      date: formData.get('date'),
      image: imageUrl || editingPost?.image || '',
      content: contentHtml || editingPost?.content || '',
      seoTitle: tBase.seoTitle || editingPost?.seoTitle || '',
      seoDescription: tBase.seoDescription || editingPost?.seoDescription || '',
      translations,
    }

    if (editingPost) {
      await updateBlogPost(editingPost.id, payload)
      toast({ title: "تم تحديث المقالة بنجاح!" })
    } else {
      await createBlogPost(payload)
      toast({ title: "تم إضافة المقالة بنجاح!" })
    }

    const data = await getBlogPosts()
    setPosts(data)
    setEditingPost(null)
    setShowForm(false)
    setImageUrl(null)
  };

  const handleDelete = async (id) => {
    await deleteBlogPost(id)
    const data = await getBlogPosts()
    setPosts(data)
    toast({ title: "تم حذف المقالة بنجاح!" })
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">إدارة المدونة</h2>
        <Button
          onClick={() => {
            setEditingPost(null);
            setShowForm((prev) => !prev);
            setImageUrl(null);
          }}
        >
          <Plus className="ml-2 w-5 h-5" />
          إضافة مقالة
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-card border rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-4 gradient-text">
            {editingPost ? 'تعديل المقالة' : 'إضافة مقالة جديدة'}
          </h3>
          <form id="blog-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="author">الكاتب</Label>
              <Input id="author" name="author" defaultValue={editingPost?.author} required />
            </div>
            <div>
              <Label htmlFor="date">التاريخ</Label>
              <Input id="date" name="date" defaultValue={editingPost?.date} required />
            </div>
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
                          onBlur={async (e) => { const draft = { id: editingPost?.id, translations: { ...translations, [loc]: { ...(translations[loc]||{}), title: e.target.value } } }; await saveDraft('blog', draft); }}
                          placeholder={`عنوان (${loc})`}
                        />
                      </div>
                      <div>
                        <Label>عنوان SEO ({loc})</Label>
                        <Input
                          value={translations[loc]?.seoTitle || ''}
                          onChange={(e) => setTranslations((prev) => ({ ...prev, [loc]: { ...(prev[loc]||{}), seoTitle: e.target.value } }))}
                          onBlur={async (e) => { const draft = { id: editingPost?.id, translations: { ...translations, [loc]: { ...(translations[loc]||{}), seoTitle: e.target.value } } }; await saveDraft('blog', draft); }}
                          placeholder={`SEO Title (${loc})`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>المقتطف/الوصف ({loc})</Label>
                        <textarea
                          className="w-full min-h-[100px] rounded-md border bg-transparent px-3 py-2"
                          value={translations[loc]?.excerpt || ''}
                          onChange={(e) => setTranslations((prev) => ({ ...prev, [loc]: { ...(prev[loc]||{}), excerpt: e.target.value } }))}
                          onBlur={async (e) => { const draft = { id: editingPost?.id, translations: { ...translations, [loc]: { ...(translations[loc]||{}), excerpt: e.target.value } } }; await saveDraft('blog', draft); }}
                          placeholder={`المقتطف (${loc})`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>وصف SEO ({loc})</Label>
                        <Input
                          value={translations[loc]?.seoDescription || ''}
                          onChange={(e) => setTranslations((prev) => ({ ...prev, [loc]: { ...(prev[loc]||{}), seoDescription: e.target.value } }))}
                          onBlur={async (e) => { const draft = { id: editingPost?.id, translations: { ...translations, [loc]: { ...(translations[loc]||{}), seoDescription: e.target.value } } }; await saveDraft('blog', draft); }}
                          placeholder={`SEO Description (${loc})`}
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
            </Tabs>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => setShowPreview((v)=>!v)}>{showPreview ? 'إخفاء المعاينة' : 'معاينة'}</Button>
          </div>
          {showPreview && (
            <div className="mt-3 bg-secondary/50 p-4 rounded-xl">
              <h4 className="text-lg font-bold mb-2">معاينة ({activeLocale})</h4>
              <p className="text-foreground font-semibold">{translations[activeLocale]?.title || '[بدون عنوان]'}</p>
              <p className="text-muted-foreground">{translations[activeLocale]?.excerpt || '[بدون مقتطف]'}</p>
              <p className="text-xs text-muted-foreground mt-2">SEO: {translations[activeLocale]?.seoTitle || '-'} | {translations[activeLocale]?.seoDescription || '-'}</p>
            </div>
          )}
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
                    const url = await uploadImage(file, 'blog')
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
                    {(imageUrl || editingPost?.image) ? (
                      <img src={imageUrl || editingPost?.image} alt="preview" className="mx-auto max-h-40 rounded-md" />
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
                      const url = await uploadImage(file, 'blog')
                      setImageUrl(url)
                      setUploading(false)
                      toast({ title: 'تم رفع الصورة' })
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <Label>محرر المحتوى</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                <Button type="button" variant="outline" onClick={() => setBlocks((prev) => [...prev, { type: 'h3', text: '' }])}>إضافة عنوان فرعي</Button>
                <Button type="button" variant="outline" onClick={() => setBlocks((prev) => [...prev, { type: 'p', text: '' }])}>إضافة فقرة</Button>
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
                    {b.type === 'h3' && (
                      <div>
                        <Label>عنوان فرعي</Label>
                        <Input value={b.text} onChange={(e) => setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, text: e.target.value } : x))} placeholder="اكتب العنوان" />
                      </div>
                    )}
                    {b.type === 'p' && (
                      <div>
                        <Label>فقرة</Label>
                        <textarea className="w-full min-h-[80px] rounded-md border bg-transparent px-3 py-2" value={b.text} onChange={(e) => setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, text: e.target.value } : x))} placeholder="اكتب النص" />
                      </div>
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
                            onDrop={async (e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) { setUploading(true); const url = await uploadImage(file, 'blog'); setUploading(false); setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, images: [...(x.images||[]), url] } : x)); toast({ title: 'تم رفع الصورة' }); } }}
                          >
                            {uploading ? 'جارٍ الرفع...' : 'أضف صورة'}
                          </div>
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f=e.target.files?.[0]; if (f){ setUploading(true); const url=await uploadImage(f,'blog'); setUploading(false); setBlocks((prev) => prev.map((x,i) => i===idx ? { ...x, images: [...(x.images||[]), url] } : x)); toast({ title: 'تم رفع الصورة' }); } }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={uploading}>
                {editingPost ? 'تحديث' : 'إضافة'}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setEditingPost(null); setShowForm(false); }}>
                إلغاء
              </Button>
              <Button type="button" variant="secondary" onClick={async () => {
                setDraftSaving(true)
                const formEl = document.querySelector('#blog-form')
                const fd = formEl ? new FormData(formEl) : new FormData()
                const draft = {
                  id: editingPost?.id,
                  author: fd.get('author'),
                  date: fd.get('date'),
                  image: imageUrl || editingPost?.image || '',
                  content: serializeBlocksToHtml(blocks),
                  translations,
                }
                await saveDraft('blog', draft)
                setDraftSaving(false)
                toast({ title: 'تم حفظ المسودة' })
              }} disabled={draftSaving}>حفظ كمسودة</Button>
            </div>
          </form>
          <div className="mt-4">
            <h4 className="text-lg font-bold mb-2">المسودات</h4>
            <DraftsList type="blog" onLoad={(d) => {
              setEditingPost({ id: d.id })
              setImageUrl(d.image || null)
              setBlocks(deserializeHtmlToBlocks(d.content || ''))
            }} />
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border rounded-xl overflow-hidden"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">{post.author} - {post.date}</p>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditingPost(post);
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
                  onClick={() => handleDelete(post.id)}
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

export default BlogManager;