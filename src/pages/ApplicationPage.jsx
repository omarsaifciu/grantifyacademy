import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buildAlternateLinks } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { useToast } from '@/components/ui/use-toast';
import { getUniversities, uploadImage } from '@/lib/storage';

const ApplicationPage = () => {
  const { id, locale } = useParams();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', program: '' });
  const [submitted, setSubmitted] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const universities = await getUniversities();
      const all = (universities || []).flatMap(u => Array.isArray(u.programs) ? u.programs : []);
      const unique = Array.from(new Set(all.filter(Boolean)));
      setPrograms(unique);
    };
    load();
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>التقديم على المنح - منح دراسية</title>
        <meta name="description" content="نموذج التقديم على المنح الدراسية." />
        <link rel="canonical" href={`${window.location.origin}/${locale}${location.pathname.replace(`/${locale}`, '')}`} />
        {buildAlternateLinks(location.pathname.replace(`/${locale}`, '').slice(1)).map((l) => (
          <link key={l.hreflang} rel="alternate" hrefLang={l.hreflang} href={l.href} />
        ))}
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
              {id ? (
                <Link to={`/${locale}/scholarship/${id}`}>
                  <Button variant="ghost" className="mb-8 text-primary hover:text-primary/80">
                    <ArrowRight className="ml-2 w-5 h-5" />
                  {t(locale, 'back_scholarship')}
                  </Button>
                </Link>
              ) : (
                <Link to={`/${locale}/`}>
                  <Button variant="ghost" className="mb-8 text-primary hover:text-primary/80">
                    <ArrowRight className="ml-2 w-5 h-5" />
                  {t(locale, 'back_home')}
                  </Button>
                </Link>
              )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-effect rounded-3xl overflow-hidden p-8 md:p-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-8 h-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-black text-foreground">{t(locale, 'app_form_title')}</h1>
              </div>
              <p className="text-muted-foreground mb-8">
                {t(locale, 'app_form_intro')}
              </p>

              {!submitted ? (
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">{t(locale, 'app_name')}</Label>
                      <Input id="name" name="name" value={form.name} onChange={onChange} placeholder="اكتب اسمك" />
                    </div>
                    <div>
                      <Label htmlFor="email">{t(locale, 'app_email')}</Label>
                      <Input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="example@mail.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t(locale, 'app_phone')}</Label>
                      <Input id="phone" name="phone" value={form.phone} onChange={onChange} placeholder="05XXXXXXXX" />
                    </div>
                    <div>
                      <Label htmlFor="program">{t(locale, 'app_program')}</Label>
                      <select
                        id="program"
                        name="program"
                        value={form.program}
                        onChange={onChange}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="" disabled>{t(locale, 'app_choose_program')}</option>
                        {programs.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="certificate">{t(locale, 'app_certificate')}</Label>
                    <div
                      className="mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/50"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          setUploading(true);
                          const url = await uploadImage(file, 'applications');
                          setCertificateUrl(url);
                          setUploading(false);
                          toast({ title: 'تم رفع الملف' });
                        }
                      }}
                    >
                      {uploading ? (
                        <div className="text-muted-foreground">{t(locale, 'upload_in_progress')}</div>
                      ) : (
                        <>
                          {certificateUrl ? (
                            <div className="text-sm text-foreground">{t(locale, 'file_attached')}</div>
                          ) : (
                            <div className="text-muted-foreground">{t(locale, 'drop_or_click')}</div>
                          )}
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploading(true);
                            const url = await uploadImage(file, 'applications');
                            setCertificateUrl(url);
                            setUploading(false);
                            toast({ title: 'تم رفع الملف' });
                          }
                        }}
                      />
                    </div>
                    <Input id="certificateUrl" name="certificateUrl" type="hidden" value={certificateUrl} readOnly />
                  </div>
                  <Button type="submit" size="lg" className="mt-2">
                    {t(locale, 'app_submit')}
                  </Button>
                </form>
              ) : (
                <div className="bg-secondary/50 p-6 rounded-xl">
                  <p className="text-foreground font-semibold mb-2">{t(locale, 'app_submitted_success')}</p>
                  <p className="text-muted-foreground">{t(locale, 'app_will_contact')}</p>
                  <div className="flex gap-3 mt-4">
                    <Link to={`/${locale}/scholarship/${id || ''}`}>
                      <Button variant="outline">{t(locale, 'app_back_scholarship')}</Button>
                    </Link>
                    <Link to={`/${locale}/`}>
                      <Button variant="secondary">{t(locale, 'app_back_home')}</Button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ApplicationPage;
