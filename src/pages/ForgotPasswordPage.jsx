import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { requestPasswordReset } from '@/lib/auth';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { locale } = useParams();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await requestPasswordReset(email);
    if (result.success) {
      toast({ title: 'تم إرسال البريد الإلكتروني', description: result.message });
      navigate(`/${locale}/login`);
    } else {
      toast({ title: 'تعذر المتابعة', description: result.message, variant: 'destructive' });
    }
  };

  return (
    <>
      <Helmet>
        <title>استعادة كلمة المرور - منح دراسية</title>
        <meta name="description" content="استعادة كلمة المرور عبر البريد الإلكتروني" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-effect rounded-3xl p-8 md:p-12">
            <Link to={`/${locale}/`} className="flex justify-center mb-8">
              <div className="bg-primary p-4 rounded-2xl">
                <GraduationCap className="w-12 h-12 text-primary-foreground" />
              </div>
            </Link>

            <h1 className="text-3xl font-bold text-center mb-2 gradient-text">استعادة كلمة المرور</h1>
            <p className="text-muted-foreground text-center mb-8">أدخل بريدك الإلكتروني لإرسال رابط الاستعادة</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="mb-2 block">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-12"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full text-lg py-6">إرسال رابط الاستعادة</Button>
            </form>

            <div className="mt-6 text-center">
              <Link to={`/${locale}/login`} className="text-primary hover:text-primary/80">العودة لتسجيل الدخول</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;