import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock, Mail, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { login } from '@/lib/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { locale } = useParams();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {
      toast({
        title: "تم تسجيل الدخول بنجاح!",
        description: "مرحباً بك في لوحة التحكم",
      });
      navigate(`/${locale}/admin`);
    } else {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>تسجيل الدخول - منح دراسية</title>
        <meta name="description" content="تسجيل الدخول إلى لوحة التحكم" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-effect rounded-3xl p-8 md:p-12">
            <Link to="/" className="flex justify-center mb-8">
              <div className="bg-primary p-4 rounded-2xl">
                <GraduationCap className="w-12 h-12 text-primary-foreground" />
              </div>
            </Link>

            <h1 className="text-3xl font-bold text-center mb-2 gradient-text">
              تسجيل الدخول
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              ادخل إلى لوحة التحكم
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-12"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="mb-2 block">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-12"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-6"
              >
                تسجيل الدخول
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link to={`/${locale}/forgot-password`} className="text-primary hover:text-primary/80">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <div className="mt-6 p-4 bg-secondary/80 rounded-xl border">
              <p className="text-sm text-muted-foreground text-center">
                <strong className="text-foreground">للتجربة:</strong> admin@example.com / admin123
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;