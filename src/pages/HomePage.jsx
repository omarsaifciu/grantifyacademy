import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { UniversitiesCarousel } from '@/components/UniversitiesCarousel';
import { ScholarshipsGrid } from '@/components/ScholarshipsGrid';
import { BlogGrid } from '@/components/BlogGrid';
import { Footer } from '@/components/Footer';
import storage, { getDrafts } from '@/lib/storage';
import heroBg from '@/assets/hero-background/SingaporeUniversity.jpg';
import { useParams } from 'react-router-dom';
import { SEOHead } from '@/components/seo';

const HERO_BG_IMAGE = heroBg;

const HomePage = () => {
  const { locale } = useParams();
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
      ]);
      const [du, ds, db] = await Promise.all([
        getDrafts('university'),
        getDrafts('scholarship'),
        getDrafts('blog'),
      ]);
      const uIds = new Set((du || []).map((d) => d.id));
      const sIds = new Set((ds || []).map((d) => d.id));
      const bIds = new Set((db || []).map((d) => d.id));
      setUniversities(u.filter((x) => !uIds.has(x.id)));
      setScholarships(s.filter((x) => !sIds.has(x.id)));
      setBlogPosts(b.filter((x) => !bIds.has(x.id)));
      setSettings(st || {});
    };
    load();
  }, []);

  const homeMeta = {
    title: 'Grantify Academy',
    translations: {
      en: { title: 'Grantify Academy', description: 'Discover top scholarships and universities worldwide. Your complete guide to study abroad opportunities, funding, and educational consulting.' },
      ar: { title: 'منح دراسية', description: 'اكتشف أفضل المنح الدراسية والجامعات حول العالم. دليلك الشامل للدراسة بالخارج والفرص التعليمية.' },
      es: { title: 'Becas y Universidades', description: 'Descubre las mejores becas y universidades del mundo. Tu guía completa para estudiar en el extranjero.' },
      fr: { title: 'Bourses et Universités', description: 'Découvrez les meilleures bourses et universités du monde. Votre guide complet pour étudier à l\'étranger.' },
    },
    is_active: true,
  };

  return (
    <>
      <SEOHead page={homeMeta} lang={locale} pageType="listing" slug="" />
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
                {(locale === 'ar' ? 'الجامعات المميزة' : locale === 'en' ? 'Featured Universities' : 'Featured Universities')}
              </h2>
              <p className="text-muted-foreground text-lg">
                {locale === 'ar' ? 'استكشف أفضل الجامعات' : 'Explore top universities'}
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
                {locale === 'ar' ? 'المنح الدراسية المتاحة' : 'Available Scholarships'}
              </h2>
              <p className="text-muted-foreground text-lg">
                {locale === 'ar' ? 'فرص ذهبية للحصول على منحة دراسية مجانية' : 'Golden opportunities to get a free scholarship'}
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
                {locale === 'ar' ? 'آخر المقالات والأخبار' : 'Latest Articles & News'}
              </h2>
              <p className="text-muted-foreground text-lg">
                {locale === 'ar' ? 'تابع أحدث الأخبار والنصائح للدراسة' : 'Follow the latest news and study tips'}
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
