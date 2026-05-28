import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';

export const UniversitiesCarousel = ({ universities }) => {
  const { locale } = useParams();
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 600%22><rect width=%22800%22 height=%22600%22 fill=%22%23e5e7eb%22/></svg>';
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (universities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{t(locale, 'grid_no_universities')}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={() => scroll('left')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-12 h-12 shadow-xl"
        size="icon"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      <Button
        onClick={() => scroll('right')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-12 h-12 shadow-xl"
        size="icon"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4"
      >
        {universities.map((university, index) => (
          <motion.div
            key={university.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex-shrink-0 w-80"
          >
            <Link to={`/${locale || 'ar'}/university/${university.id}`}>
              <div className="bg-card border rounded-2xl overflow-hidden card-hover group">
                <div className="relative h-48 overflow-hidden bg-secondary">
                  <img
                    src={university.image}
                    alt={university.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = placeholder; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4">
                  <h3 className="text-xl font-bold text-white mb-2">{university?.translations?.[locale]?.name || university.name}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">{university.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">{university.students} {t(locale, 'students_suffix')}</span>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {university?.translations?.[locale]?.description || university.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {university.programs?.slice(0, 3).map((program, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
