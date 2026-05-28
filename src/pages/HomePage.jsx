import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { UniversitiesCarousel } from '@/components/UniversitiesCarousel';
import { ScholarshipsGrid } from '@/components/ScholarshipsGrid';
import { BlogGrid } from '@/components/BlogGrid';
import { Footer } from '@/components/Footer';
import storage, { getDrafts } from '@/lib/storage';
import heroBg from '@/assets/hero-background/SingaporeUniversity.jpg';
import { useParams, useLocation } from 'react-router-dom';
import { buildAlternateLinks } from '@/lib/utils';
import { t } from '@/lib/i18n';

const HERO_BG_IMAGE = heroBg;

const HomePage = () => {
  const { locale } = useParams();
  const location = useLocation();
  const [universities, setUniversities] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const load = async () => {
      const [u, s, b, st] = await Promise.all([
        storage.getUniversities(),
        storage.getScholarships(),
        storage.getBlogPosts(),
        storage.getSettings(),
      ])
      const [du, ds, db] = await Promise.all([
        getDrafts('university'),
        getDrafts('scholarship'),
        getDrafts('blog'),
      ])
      const uIds = new Set((du || []).map((d) => d.id))
      const sIds = new Set((ds || []).map((d) => d.id))
      const bIds = new Set((db || []).map((d) => d.id))
      setUniversities(u.filter((x) => !uIds.has(x.id)))
      setScholarships(s.filter((x) => !sIds.has(x.id)))
      setBlogPosts(b.filter((x) => !bIds.has(x.id)))
      setSettings(st || {})
    }
    load()
  }, []);

  return (
    <>
      <Helmet>
        <title>منح دراسية - دليلك الشامل للدراسة</title>
        <meta name="description" content="اكتشف أفضل المنح الدراسية والجامعات. دليل شامل للطلاب العرب الراغبين بالدراسة" />
        <link rel="canonical" href={`${window.location.origin}/${locale}${location.pathname.replace(`/${locale}`, '') || '/'}`} />
        {buildAlternateLinks(location.pathname.replace(`/${locale}`, '').slice(1)).map((l) => (
          <link key={l.hreflang} rel="alternate" hrefLang={l.hreflang} href={l.href} />
        ))}
      </Helmet>

      <div className="min-h-screen">
        <Navbar />
        <Hero backgroundImage={settings.heroBackgroundUrl || HERO_BG_IMAGE} />
        
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                {t(locale, 'home_title_universities')}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t(locale, 'home_subtitle_universities')}
              </p>
            </div>
            <UniversitiesCarousel universities={universities} />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20 bg-secondary/50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                {t(locale, 'home_title_scholarships')}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t(locale, 'home_subtitle_scholarships')}
              </p>
            </div>
            <ScholarshipsGrid scholarships={scholarships} />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                {t(locale, 'home_title_blog')}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t(locale, 'home_subtitle_blog')}
              </p>
            </div>
            <BlogGrid posts={blogPosts} />
          </div>
        </motion.section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
