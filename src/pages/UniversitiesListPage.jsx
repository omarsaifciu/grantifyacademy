import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { UniversitiesCarousel } from '@/components/UniversitiesCarousel';
import { getUniversities, getDrafts } from '@/lib/storage';
import { t } from '@/lib/i18n';
import { SEOHead } from '@/components/seo';

export default function UniversitiesListPage() {
  const { locale } = useParams();
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const load = async () => {
      const list = await getUniversities();
      const drafts = await getDrafts('university');
      const ids = new Set((drafts || []).map((d) => d.id));
      setUniversities(list.filter((u) => !ids.has(u.id)));
    };
    load();
  }, []);

  const listingMeta = useMemo(() => ({
    title: locale === 'ar' ? 'الجامعات' : 'Universities',
    name: locale === 'ar' ? 'الجامعات' : 'Universities',
    translations: {
      [locale]: {
        title: locale === 'ar' ? 'الجامعات' : 'Universities',
        description: locale === 'ar'
          ? 'استكشف جميع الجامعات المتاحة. تعرف على البرامج الدراسية وشروط القبول.'
          : 'Explore all available universities. Learn about academic programs and admission requirements.',
      },
    },
    is_active: true,
  }), [locale]);

  return (
    <>
      <SEOHead page={listingMeta} lang={locale} pageType="listing" slug="universities" items={universities} currentPage={1} totalPages={1} />
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
                {locale === 'ar' ? 'الجامعات' : 'Universities'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {locale === 'ar'
                  ? 'استكشف جميع الجامعات المضافة'
                  : 'Explore all featured universities'}
              </p>
            </div>
            <UniversitiesCarousel universities={universities} />
          </div>
        </motion.section>
        <Footer />
      </div>
    </>
  );
}
