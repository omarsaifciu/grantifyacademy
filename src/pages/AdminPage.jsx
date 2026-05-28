import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AdminPage() {
  return (
    <>
      <Helmet>
        <title>لوحة التحكم</title>
      </Helmet>
      <Navbar />
      <div className="pt-24">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">لوحة التحكم</h1>
              <p className="text-muted-foreground text-lg">مرحبا بك في صفحة الإدارة.</p>
            </div>
          </div>
        </motion.section>
        <Footer />
      </div>
    </>
  );
}