
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import supabase from '@/lib/supabase';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { locale } = useParams();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمات المرور غير مطابقة',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'خطأ',
        description: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          title: 'خطأ',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'تم بنجاح',
        description: 'تم إعادة تعيين كلمة المرور بنجاح',
      });
      navigate(`/${locale}/login`);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>إعادة تعيين كلمة المرور - منح دراسية</title>
        <meta name="description" content="إعادة تعيين كلمة المرور" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-effect rounded-3xl p-8 md:p-12">
            <a href={`/${locale}`} className="flex justify-center mb-8">
              <div className="bg-primary p-4 rounded-2xl">
                <GraduationCap className="w-12 h-12 text-primary-foreground" />
              </div>
            </a>

            <h1 className="text-3xl font-bold text-center mb-2 gradient-text">
              إعادة تعيين كلمة المرور
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              أدخل كلمة المرور الجديدة
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="password" className="mb-2 block">
                  كلمة المرور الجديدة
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
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="mb-2 block">
                  تأكيد كلمة المرور الجديدة
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-12"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-6"
                disabled={isLoading}
              >
                {isLoading ? 'جارٍ التحديث...' : 'إعادة تعيين كلمة المرور'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
