import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';

export const Hero = ({ backgroundImage }) => {
  const { locale } = useParams();
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 600%22><rect width=%22800%22 height=%22600%22 fill=%22%23e5e7eb%22/></svg>';
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.src = placeholder; }}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20 dark:from-primary/20 dark:to-secondary/30" />
      
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--primary))/20] rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-foreground dark:text-primary text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              {t(locale, 'hero_badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight text-foreground"
          >
            {t(locale, 'hero_title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white mb-12 leading-relaxed"
          >
            {t(locale, 'hero_desc_line1')}
            <br />
            {t(locale, 'hero_desc_line2')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={`/${locale || 'ar'}/scholarships`}>
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-xl shadow-2xl shadow-primary/30"
              >
                {t(locale, 'hero_cta_scholarships')}
                <ArrowLeft className="mr-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={`/${locale || 'ar'}/universities`}>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-xl"
              >
                {t(locale, 'hero_cta_universities')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};