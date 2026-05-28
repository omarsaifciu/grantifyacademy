import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { UniversitiesCarousel } from '@/components/UniversitiesCarousel';
import { getUniversities, getDrafts } from '@/lib/storage';
import { buildAlternateLinks } from '@/lib/utils';
import { t } from '@/lib/i18n';

export default function UniversitiesListPage() {
  const { locale } = useParams();
  const location = useLocation();
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

  return (
    <>
      <Helmet>
        <title>الجامعات - منح دراسية</title>
        <meta name="description" content="استكشف جميع الجامعات المضافة" />
        <link rel="canonical" href={`${window.location.origin}/${locale}${location.pathname.replace(`/${locale}`, '') || '/universities'}`} />
        {buildAlternateLinks(location.pathname.replace(`/${locale}`, '').slice(1)).map((l) => (
          <link key={l.hreflang} rel="alternate" hrefLang={l.hreflang} href={l.href} />
        ))}
      </Helmet>

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
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{t(locale, 'universities_list_title')}</h1>
              <p className="text-muted-foreground text-lg">{t(locale, 'universities_list_subtitle')}</p>
            </div>
            <UniversitiesCarousel universities={universities} />
          </div>
        </motion.section>

        <Footer />
      </div>
    </>
  );
}