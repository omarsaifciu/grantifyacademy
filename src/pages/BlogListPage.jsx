import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogGrid } from '@/components/BlogGrid';
import { getBlogPosts, getDrafts } from '@/lib/storage';
import { SEOHead } from '@/components/seo';

export default function BlogListPage() {
  const { locale } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const list = await getBlogPosts();
      const drafts = await getDrafts('blog');
      const ids = new Set((drafts || []).map((d) => d.id));
      setPosts(list.filter((p) => !ids.has(p.id)));
    };
    load();
  }, []);

  const listingMeta = useMemo(() => ({
    title: locale === 'ar' ? 'المدونة' : 'Blog',
    name: locale === 'ar' ? 'المدونة' : 'Blog',
    translations: {
      [locale]: {
        title: locale === 'ar' ? 'المدونة' : 'Blog',
        description: locale === 'ar'
          ? 'تابع أحدث المقالات والأخبار حول المنح الدراسية والجامعات ونصائح الدراسة بالخارج.'
          : 'Follow the latest articles and news about scholarships, universities, and study abroad tips.',
      },
    },
    is_active: true,
  }), [locale]);

  return (
    <>
      <SEOHead page={listingMeta} lang={locale} pageType="listing" slug="blog" items={posts} currentPage={1} totalPages={1} />
      <div className="min-h-screen">
        <Navbar />
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-32 pb-20"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                {locale === 'ar' ? 'المدونة' : 'Blog'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {locale === 'ar' ? 'آخر المقالات والأخبار' : 'Latest articles and news'}
              </p>
            </div>
            <BlogGrid posts={posts} />
          </div>
        </motion.section>
        <Footer />
      </div>
    </>
  );
}
