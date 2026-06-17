import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Award, Calendar, DollarSign, GraduationCap } from 'lucide-react';
import { t } from '@/lib/i18n';

export const ScholarshipsGrid = ({ scholarships }) => {
  const { locale } = useParams();
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 600%22><rect width=%22800%22 height=%22600%22 fill=%22%23e5e7eb%22/></svg>';
  if (scholarships.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{t(locale, 'grid_no_scholarships')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {scholarships.map((scholarship, index) => (
        <motion.div
          key={scholarship.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Link to={`/${locale || 'ar'}/scholarship/${scholarship.id}`}>
            <div className="bg-card border rounded-2xl overflow-hidden card-hover h-full group">
              <div className="relative h-56 overflow-hidden bg-secondary">
                <img
                  src={scholarship.image}
                  alt={scholarship?.translations?.[locale]?.title || scholarship.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-2 bg-primary rounded-full text-sm font-bold text-primary-foreground shadow-lg">
                    {scholarship.type}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 left-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{scholarship?.translations?.[locale]?.title || scholarship.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {scholarship?.translations?.[locale]?.description || scholarship.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-foreground">
                    <div className="p-2 bg-secondary rounded-lg">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t(locale, 'scholarships_university_label')}</p>
                      <p className="font-semibold">{scholarship.university}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-foreground">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t(locale, 'scholarships_value_label')}</p>
                      <p className="font-semibold">{scholarship.value}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-foreground">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t(locale, 'scholarships_deadline_label')}</p>
                      <p className="font-semibold">{scholarship.deadline}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold group-hover:text-primary/80 transition-colors">
                      {t(locale, 'grid_read_more')} ←
                    </span>
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};
