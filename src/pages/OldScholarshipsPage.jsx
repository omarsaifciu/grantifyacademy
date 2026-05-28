import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Archive } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { buildAlternateLinks } from '@/lib/utils';

const OldScholarshipsPage = () => {
  const { locale } = useParams();
  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>المنح القديمة - منح قبرص التركية</title>
        <meta name="description" content="استكشف الأرشيف التاريخي للمنح السابقة في قبرص التركية." />
        <link rel="canonical" href={`${window.location.origin}/${locale}${location.pathname.replace(`/${locale}`, '')}`} />
        {buildAlternateLinks(location.pathname.replace(`/${locale}`, '').slice(1)).map((l) => (
          <link key={l.hreflang} rel="alternate" hrefLang={l.hreflang} href={l.href} />
        ))}
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <Link to={`/${locale}/`}>
              <Button variant="ghost" className="mb-8 text-primary hover:text-primary/80">
                <ArrowRight className="ml-2 w-5 h-5" />
                العودة للرئيسية
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-effect rounded-3xl overflow-hidden p-8 md:p-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Archive className="w-8 h-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-black text-foreground">المنح القديمة</h1>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                يحتوي هذا القسم على أرشيف المنح السابقة المنتهية أو المكتملة. يمكنك مراجعة تفاصيلها للاستفادة منها في عمليات التقديم المستقبلية.
              </p>
              <div className="bg-secondary/50 rounded-2xl p-6">
                <p className="text-muted-foreground">
                  سيتم عرض قائمة المنح القديمة هنا قريبًا.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default OldScholarshipsPage;

