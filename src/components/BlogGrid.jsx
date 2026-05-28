import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { t } from '@/lib/i18n';

export const BlogGrid = ({ posts }) => {
  const { locale } = useParams();
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{t(locale, 'grid_no_posts')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Link to={`/${locale || 'ar'}/blog/${post.id}`}>
            <div className="bg-card border rounded-2xl overflow-hidden card-hover h-full group">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={post.image}
                  alt={post?.translations?.[locale]?.title || post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post?.translations?.[locale]?.title || post.title}
                </h3>

                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post?.translations?.[locale]?.excerpt || post.excerpt}
                </p>

                <div className="flex items-center gap-2 text-primary font-semibold group-hover:text-primary/80 transition-colors">
                  <span>{t(locale, 'grid_read_more')}</span>
                  <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};
