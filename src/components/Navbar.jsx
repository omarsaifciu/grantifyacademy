import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, LayoutDashboard } from 'lucide-react';
import lightLogo from '@/assets/logo-header/logo light mode header.png';
import darkLogo from '@/assets/logo-header/logo dark mode header.png';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { SUPPORTED_LOCALES, LOCALE_LABELS, DEFAULT_LOCALE, isRtlLocale, cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';
import LanguageSwitcher from '@/components/seo/LanguageSwitcher';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const { locale } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentLocale = locale || DEFAULT_LOCALE;
  const rtl = isRtlLocale(currentLocale);

  useEffect(() => {
    (async () => {
      const authed = await isAuthenticated()
      if (authed) {
        const user = await getCurrentUser()
        setAuthUser(user)
      }
    })()
  }, [location])

  const changeLocale = (newLocale) => {
    const pathWithoutLocale = location.pathname.replace(/^\/[^/]+/, '') || '/';
    const next = `/${newLocale}${pathWithoutLocale}${location.search}${location.hash}`;
    try { window.localStorage?.setItem('site_locale', newLocale) } catch {}
    navigate(next);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b"
    >
      <div className="container mx-auto px-4">
        <div className={cn('flex items-center justify-between h-20', rtl ? 'flex-row-reverse' : 'flex-row')}>
          <Link to={`/${currentLocale}/`} className="flex items-center gap-3 group">
            <motion.div className="p-2 rounded-xl">
              <img src={lightLogo} alt="Logo" className="h-14 w-auto block dark:hidden" />
              <img src={darkLogo} alt="Logo" className="h-14 w-auto hidden dark:block" />
            </motion.div>
          </Link>

          <div className={cn('hidden md:flex items-center gap-8', rtl ? 'flex-row-reverse' : '')}>
            <Link to={`/${currentLocale}/`} className="text-foreground hover:text-primary transition-colors font-semibold">
              {t(currentLocale, 'nav_home')}
            </Link>
            <Link to={`/${currentLocale}/universities`} className="text-foreground hover:text-primary transition-colors font-semibold">
              {t(currentLocale, 'nav_universities')}
            </Link>
            <Link to={`/${currentLocale}/scholarships`} className="text-foreground hover:text-primary transition-colors font-semibold">
              {t(currentLocale, 'nav_scholarships')}
            </Link>
            <Link to={`/${currentLocale}/blog`} className="text-foreground hover:text-primary transition-colors font-semibold">
              {t(currentLocale, 'nav_blog')}
            </Link>
            <ThemeToggle />
            <LanguageSwitcher variant="button" />
            <Link to={`/${currentLocale}/apply`}>
              <Button>
                {t(currentLocale, 'nav_apply_now')}
              </Button>
            </Link>
            {authUser ? (
              <Link to={`/${currentLocale}/admin`}>
                <Button variant="outline" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  {t(currentLocale, 'nav_admin')}
                </Button>
              </Link>
            ) : (
              <Link to={`/${currentLocale}/login`}>
                <Button variant="outline" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  {t(currentLocale, 'nav_login')}
                </Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col gap-4">
              <Link to={`/${currentLocale}/`} className="text-foreground hover:text-primary transition-colors font-semibold">
                {t(currentLocale, 'nav_home')}
              </Link>
              <Link to={`/${currentLocale}/universities`} className="text-foreground hover:text-primary transition-colors font-semibold">
                {t(currentLocale, 'nav_universities')}
              </Link>
              <Link to={`/${currentLocale}/scholarships`} className="text-foreground hover:text-primary transition-colors font-semibold">
                {t(currentLocale, 'nav_scholarships')}
              </Link>
              <Link to={`/${currentLocale}/blog`} className="text-foreground hover:text-primary transition-colors font-semibold">
                {t(currentLocale, 'nav_blog')}
              </Link>
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <LanguageSwitcher variant="button" />
                <Link to={`/${currentLocale}/apply`} className="flex-1">
                    <Button className="w-full">
                    {t(currentLocale, 'nav_apply_now')}
                    </Button>
                </Link>
              </div>
              {authUser ? (
                <Link to={`/${currentLocale}/admin`}>
                  <Button variant="outline" className="w-full gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    {t(currentLocale, 'nav_admin')}
                  </Button>
                </Link>
              ) : (
                <Link to={`/${currentLocale}/login`}>
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn className="w-4 h-4" />
                    {t(currentLocale, 'nav_login')}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
