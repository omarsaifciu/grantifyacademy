import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScholarshipsGrid } from '@/components/ScholarshipsGrid';
import storage, { getScholarships, getDrafts } from '@/lib/storage';
import { t } from '@/lib/i18n';
import { SEOHead } from '@/components/seo';
import { generateLocalizedSlug } from '@/lib/seo/slug';

export default function ScholarshipsListPage() {
  const { locale } = useParams();
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    const load = async () => {
      const list = await getScholarships();
      const drafts = await getDrafts('scholarship');
      const ids = new Set((drafts || []).map((d) => d.id));
      setScholarships(list.filter((s) => !ids.has(s.id)));
    };
    load();
  }, []);

  const listingMeta = useMemo(() => ({
    title: locale === 'ar' ? 'المنح الدراسية' : 'Scholarships',
    name: locale === 'ar' ? 'المنح الدراسية' : 'Scholarships',
    translations: {
      [locale]: {
        title: locale === 'ar' ? 'المنح الدراسية' : 'Scholarships',
        description: locale === 'ar'
          ? 'استكشف جميع المنح الدراسية المتاحة للطلاب. تصفح وقدم على أفضل الفرص التعليمية.'
          : 'Explore all available scholarships for students. Browse and apply for the best educational opportunities.',
      },
    },
    is_active: true,
  }), [locale]);

  return (
    <>
      <SEOHead page={listingMeta} lang={locale} pageType="listing" slug="scholarships" items={scholarships} currentPage={1} totalPages={1} />
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
                {locale === 'ar' ? 'المنح الدراسية' : 'Scholarships'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {locale === 'ar'
                  ? 'استكشف جميع المنح الدراسية المتاحة للطلاب'
                  : 'Explore all available scholarships for students'}
              </p>
            </div>
            <ScholarshipsGrid scholarships={scholarships} />
          </div>
        </motion.section>
        <Footer />
      </div>
    </>
  );
}
